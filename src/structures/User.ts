export class User {
    public id: string;
    public username: string;
    public avatar: string;
    public bot: boolean;
    public avatarURL: string;
    public status = {
        online: false
    }; 
    public relationship!: string; 
    public constructor(raw: any) { 
        this.id = raw._id;
        this.username = raw.username;
        this.avatar = raw.avatar._id;
        this.bot = Boolean(raw.bot.owner);
        this.avatarURL = `https://autumn.revolt.chat/avatars/${raw.avatar._id}?max_side=256`;
        this.status.online = raw.online ?? false;
        this.relationship = raw.relationship;
    }
}