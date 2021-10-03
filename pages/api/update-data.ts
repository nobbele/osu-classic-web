import { NextApiRequest, NextApiResponse } from "next";
import hashes from '../../public/release/hashes.json';

export default async function handler({ query }: NextApiRequest, res: NextApiResponse) {
    const { time: _time } = query;
    // What does noup mean? It's not "NO UPdate" as it still does update.
    res.send(Object.entries(hashes).map(([name, hash]) => `${name} ${hash} ${name} noup ${name}`).join("\n"))
}