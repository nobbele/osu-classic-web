import User from "lib/models/user";
import connectDb from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler({ query }: NextApiRequest, res: NextApiResponse) {
    const id = Number.parseInt(query.id.toString());
    await connectDb();

    let user = await User.findOne({ user_id: id });
    if (!user) {
        res.status(404);
        return;
    }

    // TODO more efficient way rank user.
    // TODO - Local cache (redis)?
    // TODO - periodic service on bancho?

    let result = await User.aggregate([
        {
            '$project': {
                '_id': '$_id',
                'performance_points': '$performance_points'
            }
        }, {
            '$sort': {
                'performance_points': -1
            }
        }, {
            '$match': {
                'performance_points': {
                    '$gte': user.performance_points
                }
            }
        }, {
            '$count': 'performance_points'
        }
    ]);

    res.send(result[0].performance_points);
}