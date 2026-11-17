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
  const context = {
    exports: {}, RTCPeerConnection: Peer, WebSocket: Socket,
    document: { createElement: () => video }, window: { setTimeout, clearTimeout, btoa, atob, console: { debug: (...args) => logs.push(args) } },
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
}

run().catch((err) => { console.error(err); process.exitCode = 1; });
