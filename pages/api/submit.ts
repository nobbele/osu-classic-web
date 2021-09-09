import { NextApiRequest, NextApiResponse } from "next";
import formidable from 'formidable'
import { MCrypt } from 'mcrypt';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("Submit!");
    if (req.method !== 'POST') {
        console.log("Non POST");
        res.status(400).send({ message: 'Only POST requests allowed' })
        return
    }

    const key = "h89f2-890h2h89b34g-h80g134n90133";

    const key_buf = Buffer.from(key, 'utf8');

    const data = await parseMultiPartFormBody(req) as any;

    const iv = data.fields.iv;
    const iv_buf = Buffer.from(iv, 'base64');

    const encrypted_data = {
        pl: data.fields.pl,
        score: data.fields.score,
        fs: data.fields.fs,
        s: data.fields.s
    }
    const decrypted_data = {
        pl: null,
        score: null,
        fs: null,
        s: null,
    };

    Object.entries(encrypted_data as any).forEach(([name, data]) => {
        if (!data) {
            return null;
        }
        const msg_buf = Buffer.from(data as string, 'base64');
        const mc = new MCrypt('rijndael-256', 'cbc');
        mc.open(key_buf, iv_buf);
        const dec_buf = mc.decrypt(msg_buf);
        const re = /\p{Cc}*$/u;
        const dec_text = dec_buf.toString('utf8');
        const text = dec_text.replace(re, "");
        (decrypted_data as any)[name] = text;
    });
    console.log(decrypted_data);
    res.send(4);
}