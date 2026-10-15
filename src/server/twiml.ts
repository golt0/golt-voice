//https://www.twilio.com/docs/voice/twiml/stream
//https://www.twilio.com/docs/voice/twiml/connect

export function buildMediaStreamTwiml(publicWsUrl : string) : string{
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${publicWsUrl}" />
  </Connect>
</Response>`;

}

// wait i'll come 