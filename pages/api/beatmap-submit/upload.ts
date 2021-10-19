import { NextApiRequest, NextApiResponse } from "next";
import connectDb from "lib/mongodb";
import formidable, { File } from 'formidable'
import { promises as fs } from 'fs'
import BeatmapSet from "lib/models/beatmap";

async function parseMultiPartFormBody(req: NextApiRequest) {
    return new Promise((resolve, reject) => {
        const form = formidable({ multiples: true });

        form.parse(req, (err, fields, files) => {
            if (err) reject({ err })
            resolve({ err, fields, files })
        })
    })
}

function toHexString(byteArray: Uint8Array) {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { u: username, h: _password, t: _fullSubmit, z: _osz2Hash, s: setId } = req.query;
    const data = await parseMultiPartFormBody(req) as any;
    const osz2File: File = data.files['0'];
    const osz2Data = await fs.readFile(osz2File.path);

    await connectDb();

    console.log("[BSS] Upload");
    console.log(req.query);

    const { parse } = await import('pkg/osz2-wasm');
    let osz2 = parse(osz2Data);
    console.log(osz2);
    // TODO upload files.

    if (osz2.metadata['BeatmapSetId'] != setId) {
        console.log("Beatmap set id didn't match");
        res.status(500).send("id not match");
        return;
    }
    let set_id = Number.parseInt(setId as string);
    let beatmap_set = await BeatmapSet.findOne({ id: set_id });
    if (!beatmap_set) {
        console.log("Beatmap set didn't exist");
        res.status(500).send("beatmapset not exist");
        return;
    }

    beatmap_set.metadata.title = osz2.metadata['Title'];

    for (const filename in osz2.difficulties) {
        let beatmap = beatmap_set.beatmaps.find(beatmap => beatmap.id == osz2.difficulties[filename]);
        if (!beatmap) {
            console.log("Beatmap didn't exist");
            res.status(500).send("beatmap not exist");
            return;
        }

        beatmap.filename = filename;
        // This is wrong for some reason? maybe I should use the .osu hash instead.
        beatmap.checksum = toHexString(osz2.files[filename].hash);
        // TODO Rest
    }

    beatmap_set.status = "pending";
    await beatmap_set.save();
    res.status(200).send("0");
}

export const config = {
    api: {
        bodyParser: false,
    },
};