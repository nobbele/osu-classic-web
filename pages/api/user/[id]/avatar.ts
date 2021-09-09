import fs from 'fs';
import User from 'lib/models/user';
import connectDb from 'lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

export default async function handler({ query }: NextApiRequest, res: NextApiResponse) {
  const id = Number.parseInt(query.id.toString());
  console.log(`Getting profile picture for ${id}`);

  await connectDb();

  const user = await User.findOne({ user_id: id }, "profile_image");

  let filePath;
  if (user?.profile_image) {
    filePath = user.profile_image;
  } else {
    filePath = path.join(process.cwd(), `/public/default_avatar.png`)
  }

  console.log(`Sending ${filePath}`);

  const imageBuffer = fs.createReadStream(filePath);

  await new Promise(function (resolve) {
    res.setHeader('Content-Type', 'image/png');
    imageBuffer.pipe(res);
    imageBuffer.on('end', resolve);
    imageBuffer.on('error', function (err) {
      console.error(err)
    });
  });
}
