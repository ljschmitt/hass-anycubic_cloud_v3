const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createRequire } = require("node:module");
const vm = require("node:vm");

const frontend = path.join(__dirname, "../custom_components/anycubic_ha_integration/frontend_panel");
const ts = createRequire(path.join(frontend, "package.json"))("typescript");
const source = fs.readFileSync(path.join(
  frontend, "src/components/printer_card/camera_view/kinesis_viewer.ts",
), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
});

class Socket extends EventTarget {
  constructor() { super(); Socket.current = this; this.sent = []; }
  send(data) { this.sent.push(JSON.parse(data)); }
  close() { this.closed = true; }
  receive(messageType, payload) {
    this.receiveRaw(JSON.stringify({ messageType, messagePayload: btoa(JSON.stringify(payload)) }));
  }
  receiveRaw(data) { this.dispatchEvent(new MessageEvent("message", { data })); }
}

class Peer extends EventTarget {
  constructor() { super(); Peer.current = this; this.remoteIce = []; }
  addTransceiver(kind, options) { this.transceiver = [kind, options.direction]; }
  async createOffer() { return { type: "offer", sdp: "test-offer" }; }
  async setLocalDescription(offer) {
    this.localDescription = offer;
    this.dispatchEvent(Object.assign(new Event("icecandidate"), { candidate: { candidate: "local" } }));
  }
  async setRemoteDescription(answer) { this.remoteDescription = answer; }
  async addIceCandidate(candidate) {
    assert.ok(this.remoteDescription, "Apply remote ICE only after the SDP answer");
    this.remoteIce.push(candidate);
  }
  close() { this.closed = true; }
}

async function run() {
  const video = new EventTarget();
  video.remove = () => { video.removed = true; };
  const logs = [];
  const timers = new Map();
  let nextTimer = 0;
  const context = {
    exports: {}, RTCPeerConnection: Peer, WebSocket: Socket,
    document: { createElement: () => video }, window: {
      setTimeout: (fn) => { timers.set(++nextTimer, fn); return nextTimer; },
      clearTimeout: (id) => timers.delete(id),
      btoa, atob, console: { debug: (...args) => logs.push(args) } },
  };
  vm.runInNewContext(outputText, context);
  let state = "connecting";
  const stop = context.exports.startKinesisViewer(
    { signaling_url: "wss://example.com", ice_servers: [] }, { append: () => {} },
    () => { state = "playing"; }, () => { state = "error"; },
  );
  try {
    const socket = Socket.current;
    const peer = Peer.current;
    assert.deepEqual(peer.transceiver, ["video", "recvonly"]);
    socket.dispatchEvent(new Event("open"));
    await new Promise(setImmediate);
    assert.deepEqual(socket.sent.map((message) => message.action), ["SDP_OFFER", "ICE_CANDIDATE"]);
    socket.receiveRaw("");
    socket.receive("ICE_CANDIDATE", { candidate: "remote" });
    socket.receiveRaw("unexpected signaling text");
    socket.receiveRaw("null");
    socket.receive("SDP_ANSWER", { type: "answer", sdp: "test-answer" });
    await new Promise(setImmediate);
    assert.equal(peer.remoteIce[0].candidate, "remote");
    const stream = {};
    peer.dispatchEvent(Object.assign(new Event("track"), { track: { kind: "video" }, streams: [stream] }));
    assert.equal(video.srcObject, stream);
    assert.equal(state, "connecting");
    video.dispatchEvent(new Event("playing"));
    assert.equal(state, "playing");
    socket.receiveRaw("");
    await new Promise(setImmediate);
    assert.equal(state, "playing", "Empty signaling frames must not interrupt playback");
    stop();
    socket.dispatchEvent(new Event("close"));
    assert.ok(socket.closed && peer.closed && video.removed);
    assert.equal(state, "playing", "A deliberate close must not report an error");
  } finally {
    stop();
  }

  const stopSecond = context.exports.startKinesisViewer(
    { signaling_url: "wss://example.com", ice_servers: [] }, { append: () => {} },
    () => {}, () => { state = "error"; },
  );
  try {
    Socket.current.receiveRaw(JSON.stringify({
      messageType: "STATUS_RESPONSE",
      statusResponse: { statusCode: 403, description: "private vendor data" },
    }));
    await new Promise(setImmediate);
    assert.equal(state, "error");
    assert.deepEqual(logs, [["[Anycubic Kinesis]", "Signaling request rejected", 403]]);
  } finally {
    stopSecond();
  }

  const cameraSource = fs.readFileSync(path.join(
    frontend, "src/components/printer_card/camera_view/camera_view.ts",
  ), "utf8");
  const ast = ts.createSourceFile("camera.ts", cameraSource, ts.ScriptTarget.Latest, true);
  const cameraClass = ast.statements.find((node) =>
    ts.isClassDeclaration(node) && node.name.text === "AnycubicPrintercardCameraview");
  const methodNames = new Set(["_startCloudCamera", "_stopCloudCamera"]);
  const methods = cameraClass.members.filter((node) =>
    ts.isMethodDeclaration(node) && methodNames.has(node.name.text));
  assert.equal(methods.length, methodNames.size);
  const cameraOutput = ts.transpileModule(
    "class Camera { " + methods.map((node) => node.getText(ast)).join("\n") + " }; exports.Camera = Camera;",
    { compilerOptions: { target: ts.ScriptTarget.ES2020 } },
  ).outputText;
  const cameraContext = {
    exports: {},
    startKinesisViewer: context.exports.startKinesisViewer,
  };
  vm.runInNewContext(cameraOutput, cameraContext);
  let requests = 0;
  const camera = Object.assign(new cameraContext.exports.Camera(), {
    _startRequest: 0, showVideo: true, _videoElement: { append: () => {} },
    _hasCloudCameraConfig: () => true,
    _localize: (key) => key,
    _formatCloudCameraError: (error) => String(error),
    hass: { callWS: async () => {
      requests++;
      return { transport: "kinesis", signaling_url: "wss://example.com", ice_servers: [] };
    } },
  });
  const fireTimeout = async () => {
    assert.equal(timers.size, 1, "Exactly one active startup timer");
    const [id, callback] = timers.entries().next().value;
    timers.delete(id);
    callback();
    await new Promise(setImmediate);
  };

  // Reproduce the reporter's first timeout, then receive video on a fresh session.
  await camera._startCloudCamera();
  const initialPeer = Peer.current;
  const initialSocket = Socket.current;
  initialSocket.dispatchEvent(new Event("open"));
  await new Promise(setImmediate);
  await fireTimeout();
  assert.equal(requests, 2);
  assert.equal(camera.cloudCameraStatus, "connecting");
  assert.ok(initialPeer.closed && initialSocket.closed);
  video.dispatchEvent(new Event("playing"));
  assert.equal(camera.cloudCameraStatus, "connected");
  assert.equal(timers.size, 0);
  await camera._stopCloudCamera();

  // A second startup timeout terminates instead of starting an unlimited loop.
  await camera._startCloudCamera();
  await fireTimeout();
  await fireTimeout();
  assert.equal(requests, 4);
  assert.equal(camera.cloudCameraStatus, "error");
  assert.equal(timers.size, 0);

  // Closing the overlay before a timeout cancels the retry.
  await camera._startCloudCamera();
  camera.showVideo = false;
  await camera._stopCloudCamera();
  assert.equal(requests, 5);
  assert.equal(timers.size, 0);

  // Closing while the retry's session request is pending prevents a new viewer.
  camera.showVideo = true;
  await camera._startCloudCamera();
  let resolveSession;
  camera.hass.callWS = () => new Promise((resolve) => { resolveSession = resolve; });
  await fireTimeout();
  const closedPeer = Peer.current;
  camera.showVideo = false;
  await camera._stopCloudCamera();
  resolveSession({ transport: "kinesis", signaling_url: "wss://example.com", ice_servers: [] });
  await new Promise(setImmediate);
  assert.equal(Peer.current, closedPeer);
  assert.equal(timers.size, 0);

  // A real signaling rejection reports an error without a startup retry.
  camera.showVideo = true;
  camera.hass.callWS = async () => {
    requests++;
    return { transport: "kinesis", signaling_url: "wss://example.com", ice_servers: [] };
  };
  await camera._startCloudCamera();
  const beforeRejection = requests;
  Socket.current.receiveRaw(JSON.stringify({
    messageType: "STATUS_RESPONSE", statusResponse: { statusCode: 403 },
  }));
  await new Promise(setImmediate);
  assert.equal(requests, beforeRejection);
  assert.equal(camera.cloudCameraStatus, "error");
  assert.ok(logs.some((args) => args[1] === "Timed out waiting for signaling connection"));
  assert.ok(logs.some((args) => args[1] === "Timed out waiting for SDP answer"));
  assert.ok(logs.every((args) => !args.includes("")));
  await camera._stopCloudCamera();
}

run().catch((err) => { console.error(err); process.exitCode = 1; });
