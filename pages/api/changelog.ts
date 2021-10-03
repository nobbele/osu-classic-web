import { NextApiRequest, NextApiResponse } from "next";

export default async function handler({ query }: NextApiRequest, res: NextApiResponse) {
    const { updater: _updater } = query;
    res.send("Run osu!classic.exe instead of osu!.exe after updating");
}