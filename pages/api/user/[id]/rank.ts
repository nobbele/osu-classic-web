import User, { getUserRank } from "lib/models/user";
import connectDb from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler({ query }: NextApiRequest, res: NextApiResponse) {
    const id = Number.parseInt(query.id.toString());
    await connectDb();
    const rank = await getUserRank(id);
    if (rank == null) {
        res.status(404).send("Invalid User ID");
    }
    res.send(rank);
}