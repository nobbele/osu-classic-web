import User from "lib/models/user";
import connectDb from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler({ query }: NextApiRequest, res: NextApiResponse) {
    const { u: username, p: password } = query;
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
    res.send(user.id);
}