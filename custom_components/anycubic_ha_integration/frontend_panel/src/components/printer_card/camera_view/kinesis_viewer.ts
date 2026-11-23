export interface KinesisCameraSession {
  transport: "kinesis";
  signaling_url: string;
  ice_servers: RTCIceServer[];
}

// Kinesis transports WebRTC descriptions and candidates as base64 JSON.
type MessageType = "SDP_OFFER" | "ICE_CANDIDATE";
interface PeerMessage {
  messageType?: string;
  messagePayload?: string;
  statusResponse?: { statusCode?: number };
}

export function startKinesisViewer(
  session: KinesisCameraSession,
  container: HTMLElement,
  onPlaying: () => void,
  onError: (failure: "timeout" | "connection") => void,
): () => void {
  const peer = new RTCPeerConnection({ iceServers: session.ice_servers });
  let socket: WebSocket;
  try {
    socket = new WebSocket(session.signaling_url);
  } catch (error) {
    peer.close();
    throw error;
  }
  const video = document.createElement("video");
  video.muted = true;
  video.autoplay = true;
  video.playsInline = true;
  container.append(video);

  let stopped = false;
  let offerSent = false;
  let startupStage = "signaling connection";
  const timer = { id: 0 };
  const pendingLocal: RTCIceCandidate[] = [];
  const pendingRemote: RTCIceCandidateInit[] = [];

  function stop(): void {
    if (stopped) {
      return;
    }
    stopped = true;
    window.clearTimeout(timer.id);
    socket.close();
    peer.close();
    video.srcObject = null;
    video.remove();
  }

  function fail(
    reason: string,
    code?: number,
    failure: "timeout" | "connection" = "connection",
  ): void {
    if (!stopped) {
      // Never log signaling URLs, credentials or server-provided payloads.
      const details: (string | number)[] = ["[Anycubic Kinesis]", reason];
      if (code !== undefined) {
        details.push(code);
      }
      window.console.debug(...details);
      stop();
      onError(failure);
    }
  }

  function send(
    action: MessageType,
    data: RTCSessionDescription | RTCIceCandidate,
  ): void {
    socket.send(
      JSON.stringify({
        action,
        messagePayload: window.btoa(JSON.stringify(data)),
      }),
    );
  }

  peer.addTransceiver("video", { direction: "recvonly" });
  peer.addEventListener("icecandidate", ({ candidate }) => {
    if (candidate && !stopped) {
      if (!offerSent) {
        pendingLocal.push(candidate);
      } else {
        try {
          send("ICE_CANDIDATE", candidate);
        } catch {
          fail("Could not send ICE candidate");
        }
      }
    }
  });
  peer.addEventListener("track", ({ track, streams }) => {
    if (!stopped && track.kind === "video") {
      startupStage = "video playback";
      video.srcObject = streams[0] ?? new MediaStream([track]);
    }
  });
  peer.addEventListener("connectionstatechange", () => {
    if (peer.connectionState === "failed") {
      fail("Peer connection failed");
    }
  });
  video.addEventListener("playing", () => {
    if (!stopped) {
      window.clearTimeout(timer.id);
      onPlaying();
    }
  });
  video.addEventListener("error", () => {
    fail("Video playback failed", video.error?.code);
  });

  async function negotiate(): Promise<void> {
    await peer.setLocalDescription(await peer.createOffer());
    if (!stopped && peer.localDescription) {
      startupStage = "SDP answer";
      send("SDP_OFFER", peer.localDescription);
      offerSent = true;
      pendingLocal.splice(0).forEach((candidate) => {
        send("ICE_CANDIDATE", candidate);
      });
    }
  }

  async function receive({ data }: MessageEvent<string>): Promise<void> {
    if (stopped) {
      return;
    }
    if (typeof data !== "string" || !data.trim()) {
      return;
    }
    let message: PeerMessage | null;
    try {
      message = JSON.parse(data) as PeerMessage | null;
    } catch {
      // The signaling socket can deliver non-JSON frames during a valid session.
      return;
    }
    if (typeof message?.messageType !== "string") {
      return;
    }
    if (message.messageType === "STATUS_RESPONSE") {
      const code = message.statusResponse?.statusCode;
      if (typeof code === "number" && code >= 400) {
        fail("Signaling request rejected", code);
      }
      return;
    }
    if (typeof message.messagePayload !== "string" || !message.messagePayload) {
      return;
    }
    if (message.messageType === "SDP_ANSWER") {
      const answer = JSON.parse(
        window.atob(message.messagePayload),
      ) as RTCSessionDescriptionInit;
      startupStage = "video track";
      await peer.setRemoteDescription(answer);
      for (const candidate of pendingRemote.splice(0)) {
        await peer.addIceCandidate(candidate);
      }
    } else if (message.messageType === "ICE_CANDIDATE") {
      const candidate = JSON.parse(
        window.atob(message.messagePayload),
      ) as RTCIceCandidateInit;
      if (peer.remoteDescription) {
        await peer.addIceCandidate(candidate);
      } else {
        pendingRemote.push(candidate);
      }
    }
  }

  let messages = Promise.resolve();
  socket.addEventListener(
    "open",
    () =>
      void negotiate().catch(() => {
        fail("Could not send SDP offer");
      }),
  );
  socket.addEventListener("message", (event: MessageEvent<string>) => {
    messages = messages
      .then(() => receive(event))
      .catch(() => {
        fail("Could not apply signaling message");
      });
  });
  socket.addEventListener("error", () => {
    fail("Signaling socket error");
  });
  socket.addEventListener("close", ({ code }) => {
    fail("Signaling socket closed", code);
  });
  timer.id = window.setTimeout(() => {
    fail("Timed out waiting for " + startupStage, undefined, "timeout");
  }, 20000);
  return stop;
}
