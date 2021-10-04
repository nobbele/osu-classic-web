import BeatmapSetSubmit from "lib/models/beatmapSubmit";
import User from "lib/models/user";
import { NextApiRequest, NextApiResponse } from "next";
import connectDb from "lib/mongodb";


// /web/osu-osz2-bmsubmit-getid.php?u={ConfigManager.username}&h={ConfigManager.password}&s={maybeSetId}&b={beatmapIdListing}&z={beatmapHash}
export default async function handler({ query }: NextApiRequest, res: NextApiResponse) {
    // TODO make const
    let { u: username, h: _password, s: setId, b: beatmapIds_str, z: hash } = query;
    const beatmapIds: string[] = (beatmapIds_str as string).split(",");

    await connectDb();

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
        const beatmapSetSubmission = new BeatmapSetSubmit({ creator_id: user.id });
        beatmapIds.forEach(_beatmapId => {
            beatmapSetSubmission.beatmaps.push({} as any);
        });
        await beatmapSetSubmission.save();
        res.send(`0\n${beatmapSetSubmission.id}\n${beatmapSetSubmission.beatmaps.map(beatmap => beatmap.id)}\n1\n999\n0`);
    }
    // Update
    else {
        throw new Error("Unimplemented");
    }
}