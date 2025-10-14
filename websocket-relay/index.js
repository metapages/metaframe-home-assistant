import ReconnectingWebSocket from 'reconnecting-websocket';
import WS from 'ws';

const options = {
    WebSocket: WS, // custom WebSocket constructor
    connectionTimeout: 1000,
    // maxRetries: 10,
};

const WSS_HA = process.env.WSS_HA;
const WSS_RELAY = process.env.WSS_RELAY;

console.log(`WEBSOCKET RELAY: ${WSS_HA} <=> ${WSS_RELAY}`);

const ws_ha = new ReconnectingWebSocket(WSS_HA, [], options);
const ws_relay = new ReconnectingWebSocket(WSS_RELAY, [], options);

let requestId = 1;

ws_ha.addEventListener('open', () => {
    console.log(`🟢 OPEN ${WSS_HA}`)
    // Authenticate here, keep it local, we'll expose the raw API to an obfuscated URL
    const authResponse = { "type": "auth", "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlYzBkYTlmMmVjYjQ0ZWNkOTU5ZjIzM2FiMDhhYmYxMiIsImlhdCI6MTc2MDQxNjQzOCwiZXhwIjoyMDc1Nzc2NDM4fQ.2H5MZjzEA-L8okoff6Mgygq9GLmNMIZRZX91PIncKC8" };
    ws_ha.send(JSON.stringify(authResponse));
});
ws_relay.addEventListener('open', () => {
    console.log(`🟢 OPEN ${WSS_RELAY}`)
});

ws_ha.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    switch (message.type) {
        case "auth_required":
            console.log(`👉 message ${WSS_HA} ${data}`);
            break; //ignored here
        case "auth_ok":
            console.log(`👉 message ${WSS_HA} ${data}`);
            ws_ha.send(JSON.stringify({ "id": ++requestId, "type": "get_services" }));
            break;
        default:
            ws_relay.send(data);
            break;
    }
});
ws_relay.addEventListener('message', ({ data }) => {
    console.log(`👉 message ${WSS_RELAY} ${data}`)
    const message = JSON.parse(data);
    if (message.request) {
        message.request.id = ++requestId;
        ws_ha.send(typeof (message.request) === "object" ? JSON.stringify((message.request)) : message.request);
    }
});

ws_ha.addEventListener('error', (e) => {
    console.log(`❗ error ${WSS_HA} ${JSON.stringify(e.message)}`)
});
ws_relay.addEventListener('error', (e) => {
    console.log(`❗ error ${WSS_RELAY} ${JSON.stringify(e.message)}`)
});

ws_ha.addEventListener('close', () => {
    console.log(`🟥 close ${WSS_HA}`)
});
ws_relay.addEventListener('close', () => {
    console.log(`🟥 close ${WSS_RELAY}`)
});
