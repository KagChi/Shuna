import EventEmitter from "events";

export class Client extends EventEmitter {
    public readonly sessionToken = process.env.REVOLT_TOKEN!;
    
}