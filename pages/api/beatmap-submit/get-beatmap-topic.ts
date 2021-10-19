import { NextApiRequest, NextApiResponse } from "next";

// /web/osu-get-beatmap-topic.php?u={ConfigManager.username}&h={ConfigManager.password}&s={BeatmapSetId}
export default async function handler({ query }: NextApiRequest, res: NextApiResponse) {
    const { u: username, h: password, s: setId } = query;

    console.log("[BSS] Get beatmap topic");
    console.log(query);
    // TODO
    res.send("");
}