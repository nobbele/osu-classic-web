import User from "lib/models/user";
import connectDb from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler({ query }: NextApiRequest, res: NextApiResponse) {
    const id = Number.parseInt(query.id.toString());
    await connectDb();

    const user_doc = await User.findOne({ user_id: id }, { username: "$username" });

    if (!user_doc) {
        res.status(404);
        return;
    }

    res.send(user_doc.username);
}