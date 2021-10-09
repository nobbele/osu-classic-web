import { NextApiRequest, NextApiResponse } from "next";
import formidable from 'formidable'
import path from "path";
import extract from 'extract-zip';
import { promises as fs } from 'fs';
import BeatmapSet, { IBeatmap } from "lib/models/beatmap";
import User from "lib/models/user";
import SparkMD5 from "spark-md5";

async function parseMultiPartFormBody(req: NextApiRequest): Promise<{ err: any, fields: formidable.Fields, files: formidable.Files }> {
    return new Promise((resolve, reject) => {
        const form = formidable({ multiples: true });

        form.parse(req, (err, fields, files) => {
            if (err) reject({ err })
            resolve({ err, fields, files })
        })
    })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const data = await parseMultiPartFormBody(req);
    const oszFile = data.files['osz'] as formidable.File;

    res.status(400).send("Cannot upload beatmaps yet");
    return;

    const extractPath = path.join(path.dirname(oszFile.path), path.basename(oszFile.name!, ".osz"));
    console.log(extractPath);

    let entries: string[] = [];
    await extract(oszFile.path, {
        dir: extractPath,
        onEntry: (entry: any) => entries.push(entry.fileName),
    });

    const beatmapFiles = entries.filter(entry => entry.endsWith(".osu"));

    // Maybe move to top level?
    const { loadContent } = await import("pkg/osu-parser-wasm");

    const beatmaps = await Promise.all(beatmapFiles.map(async (beatmapFile) => {
        const content = (await fs.readFile(path.join(extractPath, beatmapFile))).toString();
        let beatmap = loadContent(content);
        return beatmap;
    }));
    const firstBeatmap = beatmaps[0];

    if (!beatmaps.every(beatmap => beatmap.info.metadata.creator == firstBeatmap.info.metadata.creator)) {
        res.status(400).send("Beatmaps have different creators");
        return;
    }

    if (!beatmaps.every(beatmap => beatmap.info.metadata.beatmap_set_id == firstBeatmap.info.metadata.beatmap_set_id)) {
        res.status(400).send("Beatmaps are from different sets");
        return;
    }

    const test_id_query = {
        $or: [
            {
                id: {
                    $in: beatmaps.map(beatmap => beatmap.beatmap_set_id)
                },
                beatmaps: {
                    $elemMatch: {
                        id: {
                            $in: beatmaps.map(beatmap => beatmap.beatmap_id)
                        },
                    }
                }
            }
        ]
    };
    if ((await BeatmapSet.findOne(test_id_query)) != null) {
        res.status(400).send("Beatmap already exists");
        return;
    }

    const creator = firstBeatmap.info.metadata.creator;

    // TODO check user who sent it so we can verify the user who sent it in case they exist.
    // TODO reason being to prevent accidentally associating a map with someone else.
    const user = await User.findOne({ username: creator });


    const set_submit = new BeatmapSet({
        id: firstBeatmap.info.metadata.beatmap_set_id,
        creator,
        creator_id: user?.id,
        beatmaps: beatmaps.map<IBeatmap>(beatmap => ({
            id: beatmap.info.metadata.beatmap_id,
            filename: beatmap.info.general_data.audio_file_name,
            metadata: {
                title: beatmap.info.metadata.title
            },
            // TODO we need to somehow get the osz2 hash.
            // TODO We will have to require the user to upload in-game,
            // TODO and then be told to upload the osz on the website.
            checksum: "gaming"
        }))
    });
    console.log(set_submit)
    //await set_submit.save();

    await fs.rm(extractPath, {
        recursive: true
    });

    res.send("ok")
}

export const config = {
    api: {
        bodyParser: false,
    },
};