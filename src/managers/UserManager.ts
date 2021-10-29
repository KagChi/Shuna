import Collection from "@discordjs/collection";
import { Client } from "..";
import { User } from "../structures/User";

export class UserManager {
    constructor(public client: Client) { }
    public cache = new Collection();

    public _addToCache(user: User | User[]) {
        if(Array.isArray(user)) {
            for(const IUser of user) {
                this.cache.set(IUser.id, IUser)
            }
        } else this.cache.set(user.id, user);
    }

    public _updateUser(user: string, key: keyof User, value: any) {
        const getUserFromCache = this.cache.get(user);
        if(!getUserFromCache) return null;
        //@ts-expect-error
        getUserFromCache[key] = value;
        return getUserFromCache;
    }
}