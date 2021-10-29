import EventEmitter from "events";
import { UserManager } from "../managers/UserManager";
import { restManager } from "../rest/restManager";
import { ClientOptions } from "../typings";

export class Client extends EventEmitter {
    public constructor(public options?: ClientOptions) {
        super()
     }
    public sessionToken!: string;

    public rest = new restManager(this);
    public users = new UserManager(this);

    public login(token?: string) {
        this.sessionToken = token ?? process.env.REVOLT_TOKEN!
        this.rest.connectWebsocket();
    }
}