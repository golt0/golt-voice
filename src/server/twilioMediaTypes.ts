/**
 * // reading about what this twillow do do wait or read or try to understadn the this do 
 * 
 * https://www.twilio.com/docs/voice/media-streams
 * 
 *  https://www.twilio.com/docs/voice/media-streams/websocket-messages  yaha hai sab
 * 
 * i am reading the docs then start coding 
 * 
 */



// connection establibel karan hai

export interface TwilioConnectedEvent {
    event : "connected",
    protocol : string,
    version : string,
}

// staring event kay karta hai

export interface TwilioStartEvent {
    event : "start";
    sequenceNumber : string;
    start : {
        streamSid : string;
        accountSid : string;
        callSid : string;
        tracks : string[];
        mediaFormat : {
            encoding : string;
            sampleRate : number;
            channels : number;
        };
    };
    streamSid : string;
}

export interface  TwilioMediaEvent {
    event : "media",
    sequenceNumber : string;
    media : {
        track : "inbound" | "outbound";
        chunk : string;
        timestamp : string;
        payload : string;
    };
    streamSid : string
}

export interface TwilioStopEvent {
    event : "stop",
    sequenceNumber : string;
    streamSid : string,
    stop : {
        accountSid : string;
        callSid : string
    };
}


export interface TwilioMarkEvent {
    event : "mark",
    sequenceNumber : string;
    streamSid : string,
    mark  :{
        name : string
    };
}

export type TwilioInboundEvent = 
| TwilioConnectedEvent
| TwilioStartEvent
| TwilioMediaEvent
| TwilioStopEvent
| TwilioMarkEvent;


// in this twilio jo voice send karlega 

// ab hmm jo vioce send karege outbound

export interface TwilioOutboundMediaEvent {
    event : "media",
    streamSid : string,
    media : {
        payload : string
    }
}

// when twilio have audio buffer but not just palyed 

export interface TwilioClearEvent {
    event : "clear",
    streamSid : string
}

// to find the audio is end to paly

export interface TwilioMarkCommand {
    event : "mark",
    streamSid : string,
    mark : {
        name : string
    }
}

// ok first i create the second file then i tell what to do 
