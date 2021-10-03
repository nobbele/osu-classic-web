import User from "lib/models/user";
import WebSession from "lib/models/webSession";
import connectDb from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from 'crypto';

export default async function handler({ method, body }: NextApiRequest, res: NextApiResponse) {
    if (method !== 'POST') {
        console.log("Non POST");
        res.status(400).send({ message: 'Only POST requests allowed' })
        return;
    }

    const { username, password } = JSON.parse(body);
    await connectDb();

    if (await User.findOne({ username }) != null) {
        console.log("User already exists");
        res.status(400).send("user exists");
        return;
    }

    const newUser = new User({
        username,
        password,
    });
    const user = await newUser.save();

    const session = new WebSession({ user_id: user.id, token: crypto.randomBytes(64).toString('hex') });
    await session.save();

    res.send({
        token: session.token,
        user_id: user.id,
    });
}