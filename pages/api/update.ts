import { NextApiRequest, NextApiResponse } from "next";

export default async function handler({ query }: NextApiRequest, res: NextApiResponse) {
    const { f: file, h: hash, t: time } = query;
    console.log(`Checking ${file} (${hash})`);
    res.send("0")
}