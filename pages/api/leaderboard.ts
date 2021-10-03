import User from "lib/models/user";
import connectDb from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler({ query }: NextApiRequest, res: NextApiResponse) {
    const { type } = query;
    await connectDb();
    let result;
    if (type == "ranked_score") {
        result = await User.aggregate([
            {
                '$project': {
                    'user_id': '$id',
                    'username': '$username',
                    'ranked_score': '$ranked_score',
                }
            }, {
                '$sort': {
                    'ranked_score': -1
                }
            }
        ]);
    } else if (type == "total_score") {
        result = await User.aggregate([
            {
                '$project': {
                    'user_id': '$id',
                    'username': '$username',
                    'total_score': '$total_score',
                }
            }, {
                '$sort': {
                    'total_score': -1
                }
            }
        ]);
    } else {
        result = await User.aggregate([
            {
                '$project': {
                    'user_id': '$id',
                    'username': '$username',
                    'performance_points': '$performance_points',
                }
            }, {
                '$sort': {
                    'performance_points': -1
                }
            }
        ]);
    }
    res.send(result)
}