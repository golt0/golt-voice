// streaming the data by websocket connection
// 
// https://www.twilio.com/docs/voice/media-streams/websocket-messages
// 

import type { WebSocket } from "ws";
import { addSession, createCallSession, createSessionRegistry, getActiveCount, getDurationMs, markClosed, markStreaming, removeSession, type CallSession, type SessionRegistry } from "./callSession";
import type { TwilioInboundEvent, TwilioOutboundMediaEvent } from "./twilioMediaTypes";

const registry: SessionRegistry = createSessionRegistry()


export function handleMediaStreamConnection(socket: WebSocket): void {
    let session: CallSession | undefined;

    socket.on("message", (raw: Buffer) => {
        let event: TwilioInboundEvent;
        try {

            event = JSON.parse(raw.toString("utf-8"));
        } catch (error) {
            console.error("media failed to parse the frame", error);
            return;
        }

        switch (event.event) {
            case "connected": {
                console.log("media twillio was connected", event.protocol, event.version);
                break;
            }

            case "start": {
                session = createCallSession({
                    callSid: event.start.callSid,
                    streamSid: event.start.streamSid,
                });
                session = markStreaming(session)
                addSession(registry, session);
                console.log(`media call start callSid=${session.callSid} streamSid=${session.streamSid}` +
                    `format=${event.start.mediaFormat.encoding}@${event.start.mediaFormat.sampleRate}`
                );
                break;
            }

            case "media": {
                if (!session) {
                    console.warn(`media frame received with no active session dropping`);
                    return
                }

                session.framesReceived += 1;

                // sending the samplae thing first like i owne voice back echo 
                const outbound: TwilioOutboundMediaEvent = {
                    event: "media",
                    streamSid: session.streamSid,
                    media: { payload: event.media.payload },
                };

                socket.send(JSON.stringify(outbound));
                session.framesSend += 1;
                break;
            }

            // ok start from there 

            case "stop": {
                if (session) {
                    console.log(
                        `media call ended callSid=${session.callSid}` + `duration=${getDurationMs(session)}ms framesIn=${session.framesReceived} framesOut=${session.framesSend}`
                    )

                    session = markClosed(session);
                    removeSession(registry, session.streamSid);
                }
                break;
            }

            case "mark": {
                // come back later aabi rok jao 
                console.log(`mark received : ${event.mark.name}`);
                break
            }

            default: {
                const _exhaustive = event;
                console.log("meida unknow event type", _exhaustive)
            }

        }
    });

    socket.on("close", () => {
        if (session && session.state !== "closed") {
            console.log(`media ws closed without explicit stop event (callSid=${session.callSid})`);
            session = markClosed(session);
            removeSession(registry, session.streamSid)
        }
    });

    socket.on("error", (error) => {
        console.error(`media websocket error`, error)
    });
}


export function getActiveCallCount(): number {
    return getActiveCount(registry)
}


// done till there now wait .... 
// adding twillow .env

