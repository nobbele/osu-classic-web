import { NextApiRequest, NextApiResponse } from "next";
import connectDb from "lib/mongodb";
import formidable, { File } from 'formidable'
import { promises as fs } from 'fs'

async function parseMultiPartFormBody(req: NextApiRequest) {
    return new Promise((resolve, reject) => {
        const form = formidable({ multiples: true });

        form.parse(req, (err, fields, files) => {
            if (err) reject({ err })
            resolve({ err, fields, files })
        })
    })
}

// TODO parse osz2
// /web/osu-osz2-bmsubmit-getid.php?u={ConfigManager.username}&h={ConfigManager.password}&s={maybeSetId}&b={beatmapIdListing}&z={beatmapHash}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { u: username, h: _password, t: _fullSubmit, z: _osz2Hash, s: _setId } = req.query;
    const data = await parseMultiPartFormBody(req) as any;
    const osz2File: File = data.files['0'];
    const osz2Data = await fs.readFile(osz2File.path, {
        encoding: 'utf8',
    });

    await connectDb();

    console.log("upload");
    console.log(req.query);
    //console.log(osz2Data);
    res.status(404).send("TODO");
}

export const config = {
    api: {
        bodyParser: false,
    },
};