import BeatmapSet from "lib/models/beatmap";
import connectDb from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler({ query }: NextApiRequest, res: NextApiResponse) {
    const { } = query;
    await connectDb();

    const beatmaps = await BeatmapSet.find({});

    res.send(beatmaps.map(beatmap_set => ({
        id: beatmap_set.id,
        title: beatmap_set.beatmaps[0].metadata.title
    })));
}