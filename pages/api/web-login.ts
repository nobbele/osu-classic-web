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

    const { username, password } = JSON.parse(body);
    await connectDb();
    const user = await User.findOne({ username: username as string });
    if (!user) {
        console.log("Invalid username");
        res.status(401).send("invalid username");
        return;
    }
    if (!user.password) {
        console.log("Unloginable user");
        res.status(401).send("unloginable user");
        return;
    }

    const validPassword = user.password == password;
    if (!validPassword) {
        console.log("Invalid password");
        res.status(401).send("invalid password");
        return;
    }

    const session = new WebSession({ user_id: user.id, token: crypto.randomBytes(64).toString('hex') });
    session.save();

    res.send({
        token: session.token,
        user_id: user.id,
    });
}