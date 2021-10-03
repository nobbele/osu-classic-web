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

    const { token } = body;
    await connectDb();

    const session = await WebSession.findOne({ token });

    /*res.send({
        valid: session != null,
        user_id: session && session.user_id,
    });*/
    res.send({
        valid: true,
        user_id: 1,
    });
}