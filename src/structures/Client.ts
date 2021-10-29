import EventEmitter from "events";
import { restManager } from "../rest/restManager";
import { ClientOptions } from "../typings";

export class Client extends EventEmitter {
    public constructor(public options?: ClientOptions) {
        super()
     }
    public sessionToken!: string;

    public rest = new restManager(this);
    public login(token?: string) {
        this.sessionToken = token ?? process.env.REVOLT_TOKEN!
        this.rest.connectWebsocket();
    }
}