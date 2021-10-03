import { NextApiRequest, NextApiResponse } from "next";

import hashes from '../../public/release/hashes.json';

export default async function handler({ query }: NextApiRequest, res: NextApiResponse) {
    const { f: p_file, h: clientHash, t: _time } = query;
    const file = p_file as string;

    if (file == "osu!.exe") {
        console.log("Client is using unpached osu executable");
        // This will run if user opened osu!.exe.
        // Even if they have osu!classic installed already, we can't know
        // But we want to tell them to open the right exe anyway.
        res.send("1");
        return;
    }

    if (file in hashes) {
        let serverHash = (hashes as any)[file] as string;

        if (serverHash != clientHash) {
            res.send("1");
            return;
        }
    }

    res.send("0")
}