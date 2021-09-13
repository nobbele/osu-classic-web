import { NextApiRequest, NextApiResponse } from "next";
import formidable from 'formidable'
import { MCrypt } from 'mcrypt';
import Score from "lib/models/score";
import BeatmapSet from "lib/models/beatmap";
import User from "lib/models/user";

export const config = {
    api: {
        bodyParser: false,
    },
}

async function parseMultiPartFormBody(req: NextApiRequest) {
    return new Promise((resolve, reject) => {
        const form = formidable({ multiples: true });

        form.parse(req, (err, fields, files) => {
            if (err) reject({ err })
            resolve({ err, fields, files })
        })
    })
}

const key = "h89f2-890h2h89b34g-h80g134n90133";
const key_buf = Buffer.from(key, 'utf8');

function decryptData(iv_buf: Buffer, data: string) {
    const msg_buf = Buffer.from(data as string, 'base64');
    const mc = new MCrypt('rijndael-256', 'cbc');
    mc.open(key_buf, iv_buf);
    const dec_buf = mc.decrypt(msg_buf);
    const re = /\p{Cc}*$/u;
    const dec_text = dec_buf.toString('utf8');
    return dec_text.replace(re, "");
}

interface ParsedScore {
    file_checksum: string,
    username: string,
    score_checksum: string,
    count_300: number,
    count_100: number,
    count_50: number,
    count_geki: number,
    count_katu: number,
    count_miss: number,
    total_score: number,
    max_combo: number,
    perfect: boolean,
    ranking: string,
    enabled_mods: number,
    pass: boolean,
    playmode: string,
    played_at: Date,
    // TODO check hacks
    osu_version: string,
}

const playmodeMap: {
    [key: number]: string
} = {
    0: "osu",
    1: "taiko",
    2: "catch",
    3: "mania"
};

function parseScoreString(score: string): ParsedScore {
    const split = score.split(":");
    return {
        file_checksum: split[0],
        username: split[1],
        score_checksum: split[2],
        count_300: Number.parseInt(split[3]),
        count_100: Number.parseInt(split[4]),
        count_50: Number.parseInt(split[5]),
        count_geki: Number.parseInt(split[6]),
        count_katu: Number.parseInt(split[7]),
        count_miss: Number.parseInt(split[8]),
        total_score: Number.parseInt(split[9]),
        max_combo: Number.parseInt(split[10]),
        perfect: split[11] != "False",
        ranking: split[12],
        enabled_mods: Number.parseInt(split[13]),
        pass: split[14] != "False",
        playmode: playmodeMap[Number.parseInt(split[15])],
        // TODO parse date properly (split[14])
        played_at: new Date(Date.now()),
        osu_version: split[17],
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        console.log("Non POST");
        res.status(400).send({ message: 'Only POST requests allowed' })
        return;
    }

    const data = await parseMultiPartFormBody(req) as any;

    const iv = data.fields.iv;
    const iv_buf = Buffer.from(iv, 'base64');

    const encrypted_data = {
        pl: data.fields.pl,
        score: data.fields.score,
        fs: data.fields.fs,
        s: data.fields.s
    }
    const wip_decrypted_data = {
        pl: null,
        score: null,
        fs: null,
        s: null,
    };

    Object.entries<string>(encrypted_data as any).forEach(([name, data]) => {
        if (!data) {
            return null;
        }
        (wip_decrypted_data as any)[name] = decryptData(iv_buf, data);
    });

    // It is known to be set not null and string but TS can't see that
    const decrypted_data = {
        pl: wip_decrypted_data.pl as unknown as string,
        score: wip_decrypted_data.score as unknown as string,
        fs: wip_decrypted_data.score as unknown as string,
        s: wip_decrypted_data.score as unknown as string,
        pass: data.pass as unknown as string,
    };

    const score = parseScoreString(decrypted_data.score);

    const beatmapset = await BeatmapSet.findOne({
        beatmaps: {
            $elemMatch: {
                checksum: score.file_checksum,
            }
        }
    });

    if (!beatmapset) {
        res.status(400).send("Unknown beatmap set");
        return;
    }

    const beatmap = beatmapset.beatmaps[0];
    if (!beatmap) {
        res.status(400).send("Unknown beatmap");
        return;
    }

    // TODO verify password
    const user = await User.findOne({ username: score.username });
    if (!user) {
        res.status(400).send("Unknown user");
        return;
    }

    const score_submit = new Score({
        beatmap_id: beatmap.id,
        user_id: user.id,
        total_score: score.total_score,
        max_combo: score.max_combo,
        count_50: score.count_50,
        count_100: score.count_100,
        count_300: score.count_300,
        count_miss: score.count_miss,
        count_katu: score.count_katu,
        count_geki: score.count_geki,
        played_at: score.played_at,
    });
    score_submit.save();

    res.status(200).send("OK");
}