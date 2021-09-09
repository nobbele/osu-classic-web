import User from "lib/models/user";
import connectDb from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler({ query }: NextApiRequest, res: NextApiResponse) {
    const id = Number.parseInt(query.id.toString());
    await connectDb();

    const user_doc = (await User.findOne({ user_id: id }));

    const user = user_doc?.toJSON();
    delete user?._id;
    res.send(user);
}