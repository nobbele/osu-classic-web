import BeatmapSet from "lib/models/beatmap";
import Score, { IScore } from "lib/models/score";
import User from "lib/models/user";
import connectDb from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

async function scoreToString(score: IScore) {
    const player = await User.findOne({ user_id: score.user_id });
    if (!player) {
        throw new Error("??");
    }
    const perfect = false;
    const enabled_mods = 0;
    const rank = 1;
    return `${score.id}|${player.username}|${score.total_score}|${score.max_combo}|`
        + `${score.count_50}|${score.count_100}|${score.count_300}|${score.count_miss}|${score.count_katu}|${score.count_geki}|`
        + `${perfect}|${enabled_mods}|${score.user_id}|${rank}|${score.played_at.toISOString()}`;
}

export default async function handler({ query }: NextApiRequest, res: NextApiResponse) {
    const { s: something, c: checksum, f: filename, u: user_id, m: gamemode, i: beatmapset_id, h: hashSomething, p: pSomething } = query;
    await connectDb();

    console.log(`Getting score for ${beatmapset_id} ${filename}`)

    const beatmapset = await BeatmapSet.findOne({ id: Number.parseInt(beatmapset_id as string) });
    if (!beatmapset) {
        res.send("2|true");
        return;
    }
    const beatmap = beatmapset.beatmaps.find(beatmap => beatmap.filename == filename);
    if (!beatmap) {
        res.send("-1|true");
        return;
    }
    if (beatmap.checksum != checksum) {
        res.send("1|true");
        return;
    }
    let resText = "";
    // TODO add status
    resText += `2|true|${beatmap.id}|${beatmapset.id}|${beatmap.scores.length}\n`;
    // TODO online offset, display title(?), rating
    resText += "0\n";
    resText += "WhatIsThis\n";
    resText += "0.0\n";

    const personal_score = await Score.findOne({
        beatmap_id: beatmap.id,
        user_id: Number.parseInt(user_id as string)
    });
    resText += personal_score ? await scoreToString(personal_score) : "";

    // TODO maybe don't send every single score?
    const scores = await Score.find({
        id: {
            $in: beatmap.scores
        }
    });
    for (const score of scores) {
        resText += "\n" + await scoreToString(score);
    }

    console.log(resText);
    res.send(resText);
}