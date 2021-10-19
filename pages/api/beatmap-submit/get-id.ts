import User from "lib/models/user";
import { NextApiRequest, NextApiResponse } from "next";
import connectDb from "lib/mongodb";
import BeatmapSet, { Beatmap } from "lib/models/beatmap";


// /web/osu-osz2-bmsubmit-getid.php?u={ConfigManager.username}&h={ConfigManager.password}&s={maybeSetId}&b={beatmapIdListing}&z={beatmapHash}
export default async function handler({ query }: NextApiRequest, res: NextApiResponse) {
    // TODO make const
    let { u: username, h: _password, s: setId, b: beatmapIds_str, z: hash } = query;
    const beatmapIds: string[] = (beatmapIds_str as string).split(",");

    await connectDb();

    console.log("[BSS] get-id");

    // TODO Check password
    const user = await User.findOne({ username: username as string });
    if (!user) {
        // TODO return error
        return;
    }

    // TODO fix update
    setId = "-1";

    // New upload
    if (!setId || setId == "-1") {
        const beatmapSetSubmission = new BeatmapSet({ uploader_id: user!.id, status: "empty" });
        beatmapIds.forEach(async (_beatmapId) => {
            let beatmap = new Beatmap({
                filename: "",
                checksum: "",
                metadata: {
                    title: ""
                }
            });
            beatmapSetSubmission.beatmaps.push(beatmap);
        });
        console.log(beatmapSetSubmission);
        const submittedBeatmap = await beatmapSetSubmission.save();
        console.log(submittedBeatmap);
        res.send(`0\n${submittedBeatmap.id}\n${submittedBeatmap.beatmaps.map(beatmap => beatmap.id)}\n1\n999\n0`);
    }
    // Update
    else {
        throw new Error("Unimplemented");
    }
}