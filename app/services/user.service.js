const bcrypt = require("bcryptjs");

class UserService {
    constructor(client) {
        this.User = client.db().collection("users");
    }

    async register(payload) {
        const existing = await this.User.findOne({ username: payload.username });
        if (existing) {
            return null;
        }
        const hashedPassword = await bcrypt.hash(payload.password, 10);
        const result = await this.User.insertOne({
            username: payload.username,
            password: hashedPassword,
        });
        return { _id: result.insertedId, username: payload.username };
    }

    async login(payload) {
        const user = await this.User.findOne({ username: payload.username });
        if (!user) return null;
        const isMatch = await bcrypt.compare(payload.password, user.password);
        if (!isMatch) return null;
        return { _id: user._id, username: user.username };
    }
}

module.exports = UserService;
