import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { u: username, p: password, b: set_id, subject, message, complete: _complete, notify: _notify } = req.body;

    console.log("[BSS] Post");
    // TODO
    res.send("-1");
}