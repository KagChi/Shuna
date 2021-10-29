import { restManager } from "../rest/restManager";
import ws from 'ws';

export class socketManager {
    private wsConn!: ws;
    private wsBaseUrl = "wss://ws.revolt.chat?format=json";
    private lastHeartbeat!: NodeJS.Timer;
    constructor(public rest: restManager) { }
    public connect() {
        this.wsConn = new ws(this.wsBaseUrl);
        this.wsConn.on("open", () => {
            this.send({
                type: 'Authenticate', token: this.rest.client.sessionToken
            });
        });
        this.wsConn.onmessage = this.onMessage.bind(this);
    }

    public onMessage(message: ws.MessageEvent) {
        if (typeof message.data !== 'string') throw new Error("Expected data as string, but given " + typeof message.data);
        const parsedPacket = JSON.parse(message.data);
        this.rest.client.emit("raw", parsedPacket);
        switch (parsedPacket) {
            case "Ready": {
                this.lastHeartbeat = setInterval(() => {
                    this.send({ type: "Ping", data: Date.now() })
                }, this.rest.client.options?.keepAliveInterval ?? 4500)
            }
        }
    }
    public send(message: object) {
        this.wsConn.send(JSON.stringify(message))
    }
}