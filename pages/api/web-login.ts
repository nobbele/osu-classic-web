import User from "lib/models/user";
import WebSession from "lib/models/webSession";
import connectDb from "lib/mongodb";
import crypto from 'crypto';
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler({ method, body }: NextApiRequest, res: NextApiResponse) {
    if (method !== 'POST') {
        console.log("Non POST");
        res.status(400).send({ message: 'Only POST requests allowed' })
        return;
    }

    const { u: username, p: password } = body;
    await connectDb();
    const user = await User.findOne({ username: username as string });
    if (!user) {
        res.send("invalid username");
        return;
    }
    if (!user.password) {
        res.send("unloginable user");
        return;
    }

    const validPassword = user.password == password;
    if (!validPassword) {
        res.send("invalid password");
        return;
    }

    const session = new WebSession({ user_id: user.id, token: crypto.randomBytes(64).toString('hex') });
    session.save();

    res.send(session.token);
}