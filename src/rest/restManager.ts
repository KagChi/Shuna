import { fetch } from "undici";
import { HttpMethod } from "undici/types/dispatcher";
import { Client } from "../structures/Client";
import { socketManager } from "../ws/socketManager";

export class restManager {
    private readonly apiBaseURL = "https://api.revolt.chat/";
    private readonly ws = new socketManager(this);
    constructor(public client: Client) { }
    
    public request(method: HttpMethod, path: string, options: object) {
        return fetch(this.apiBaseURL + path, {
            method,
            headers: {
                "x-bot-token": this.client.sessionToken
            },
            body: JSON.stringify(options)
        })
    }

    public connectWebsocket() {
        if(!this.client.sessionToken) throw new Error("There are no sessionToken in client property")
        this.ws.connect();
    }
}