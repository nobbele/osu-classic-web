import { NextApiRequest, NextApiResponse } from "next";

export default async function handler({ query }: NextApiRequest, res: NextApiResponse) {
    const { u: username, p: password_hash, c: checksum } = query;
    res.send("ok")
}