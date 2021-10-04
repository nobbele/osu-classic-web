import BeatmapSet from "lib/models/beatmap";
import Score, { IScore } from "lib/models/score";
import User from "lib/models/user";
import connectDb from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

async function scoreToString(score: IScore) {
    const player = await User.findOne({ id: score.user_id });
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
    let { s: _showScore, c: checksum, f: filename, u: user_id, m: _gamemode, i: beatmapset_id, h: _osz2Hash, p: _maybeRankType } = query;
    await connectDb();

    console.log(`Getting score for ${beatmapset_id} ${filename}`)

    if (beatmapset_id == '-1') {
        beatmapset_id = '118';
    }

    const hasOsz2 = false;

    //const beatmapset = await BeatmapSet.findOne({ id: Number.parseInt(beatmapset_id as string) });
    const beatmapset = await BeatmapSet.findOne({
        id: Number.parseInt(beatmapset_id as string),
        beatmaps: {
            $elemMatch: {
                filename: filename,
            }
        }
    });

    if (!beatmapset) {
        console.log("Beatmap doesn't exist");
        res.send(`-1|${hasOsz2}`);
        return;
    }

    const beatmap = beatmapset.beatmaps[0];

    if (beatmap.checksum != checksum) {
        console.log("Checksum doesn't match");
        res.send(`1|${hasOsz2}`);
        return;
    }

    // TODO maybe don't send every single score?
    const scores = await Score.find({
        beatmap_id: beatmap.id,
        ranked: true,
    }).sort({
        total_score: -1
    });

    let resText = "";
    // TODO add status
    resText += `2|${hasOsz2}|${beatmap.id}|${beatmapset.id}|${scores.length}\n`;
    // TODO online offset, display title(?), rating
    resText += "0\n";
    resText += "WhatIsThis\n";
    resText += "0.0\n";

    const personal_score = scores.find(score => score.user_id == Number.parseInt(user_id as string));
    resText += personal_score ? await scoreToString(personal_score) : "";

    for (const score of scores) {
        resText += "\n" + await scoreToString(score);
    }

    console.log(`Sending ${scores.length} scores`);
    res.send(resText);
}