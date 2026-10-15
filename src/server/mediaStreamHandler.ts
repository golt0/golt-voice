// streaming the data by websocket connection
// 
// https://www.twilio.com/docs/voice/media-streams/websocket-messages
// 

import type { WebSocket } from "ws";
import { addSession, createCallSession, createSessionRegistry, markStreaming, type CallSession, type SessionRegistry } from "./callSession";
import type { TwilioInboundEvent, TwilioOutboundMediaEvent } from "./twilioMediaTypes";

const registry: SessionRegistry = createSessionRegistry()


export function handleMediaStreamConnection(socket: WebSocket) : void {
    let session : CallSession | undefined;

    socket.on("message", (raw : Buffer) => {
        let event : TwilioInboundEvent;
        try {
            
            event = JSON.parse(raw.toString("utf-8"));
        } catch (error) {
            console.error("media failed to parse the frame", error);
            return;
        }

        switch (event.event) {
            case "connected" : {
                console.log("media twillio was connected", event.protocol, event.version);
                break;
            }

            case "start" : {
                session = createCallSession({
                    callSid : event.start.callSid,
                    streamSid : event.start.streamSid,
                });
                session = markStreaming(session)
                addSession(registry, session);
                console.log(`media call start callSid=${session.callSid} streamSid=${session.streamSid}` + 
                    `format=${event.start.mediaFormat.encoding}@${event.start.mediaFormat.sampleRate}`
                );
                break;
            }

            case "media" : {
                if(!session) {
                    console.warn(`media frame received with no active session dropping`);
                    return
                }

                session.framesReceived += 1;

                // sending the samplae thing first like i owne voice back echo 
                const outbound : TwilioOutboundMediaEvent = {
                    event : "media",
                    streamSid : session.streamSid,
                    media : {payload : event.media.payload},
                };

                socket.send(JSON.stringify(outbound));
                session.framesSend += 1;
                break;
            }

            
        }
    })
    
}