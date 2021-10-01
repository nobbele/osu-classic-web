import { NextApiRequest, NextApiResponse } from "next";

export default async function handler({ body }: NextApiRequest, res: NextApiResponse) {
    console.log(body);
    res.send("ok")
}