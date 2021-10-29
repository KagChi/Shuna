import { restManager } from "../rest/restManager";
import ws from 'ws';
import { User } from "../structures/User";

export class socketManager {
    private wsConn!: ws;
    private wsBaseUrl = "wss://ws.revolt.chat?format=json";
    private lastHeartbeat!: number;
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
        switch (parsedPacket.type) {
            case "Authenticated": {
                this.send({ type: "Ping", data: Date.now() });
                break;
            }
            case "Ready": {
                console.log(parsedPacket)
                for(const user of parsedPacket.users) {
                    const userClass = new User(user);
                    this.rest.client.users._addToCache(userClass);
                }
                break;
            }
            case "Pong": {
                this.send({ type: "Ping", data: Date.now() });
                this.lastHeartbeat = Date.now();
                break;
            }
            default: {
                console.log(parsedPacket)
            }
        }
    }
    public send(message: object) {
        this.wsConn.send(JSON.stringify(message))
    }
}