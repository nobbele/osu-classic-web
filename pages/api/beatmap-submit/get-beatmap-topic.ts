import { NextApiRequest, NextApiResponse } from "next";

// /web/osu-get-beatmap-topic.php?u={ConfigManager.username}&h={ConfigManager.password}&s={BeatmapSetId}
export default async function handler({ query }: NextApiRequest, res: NextApiResponse) {
    res.status(404).send("How to parse osz2");
    return;
    const { u: username, h: password, s: setId } = query;

    console.log("Get beatmap topic");
    console.log(query);
    // TODO
    res.send("");
}