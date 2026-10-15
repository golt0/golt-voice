/**
 * so what we going to do ther is memory the call memory 
 * so session banana hai
 *  seraching on the google what happen and how so wait for minutes
 * 
 */


export type CallState = "connecting" | "streaming" | "closed";

// there is one call session for the one user like websockt ki trahhai 

export type CallSession = {
    callSid : string;  // tw ki unique id for the call
    streamSid : string; // tq ki unique id for the audio stream 
    state : CallState;
    framesReceived : number;
    framesSend : number;
    startedAt : number // kab session bana tha
}

// function new session for the call 

export function createCallSession(params : {
    callSid : string, streamSid : string
}) : CallSession {
    return {
        callSid : params.callSid,
        streamSid : params.streamSid,
        state  :"connecting",
        framesReceived : 0,
        framesSend : 0,
        startedAt : Date.now(),
    };
}

// return new session with the state steaming

export function markStreaming(session : CallSession) : CallSession {
    return {...session, state : "streaming"}
}

// mark sesssion as closed

export function markClosed(session : CallSession) : CallSession {
    return {...session , state : "closed"};
}

// duration 

export function getDurationMs(session : CallSession) : number{
    return Date.now() - session.startedAt;
}

// registy banatehai map jisme we can treack all the active calls 
// stroage type hai


export type SessionRegistry = Map<string, CallSession>;

export function createSessionRegistry() : SessionRegistry {
    return new Map();
}
// new call store
export function addSession(registry : SessionRegistry, session : CallSession) : void {
    registry.set(session.streamSid, session)
}

// find the call by session id 
export function getSession(registry : SessionRegistry, streamSid : string) : CallSession  | undefined {
    return registry.get(streamSid);
}

// delete the call when it end 

export function removeSession(registry : SessionRegistry , streamSid : string) : CallSession | undefined {
     const session = registry.get(streamSid);
     registry.delete(streamSid);
     return session;
}

// how manuy call live right now
export function getActiveCount(registry : SessionRegistry) : number {
    return registry.size;
}

// done 
