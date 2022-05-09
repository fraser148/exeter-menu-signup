import clientPromise from "../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from 'next'

function toIsoString(date: Date) {
  var tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function(num : number) {
          return (num < 10 ? '0' : '') + num;
      };

  return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds()) +
      dif + pad(Math.floor(Math.abs(tzo) / 60)) +
      ':' + pad(Math.abs(tzo) % 60);
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("exeterMenu");
  switch (req.method) {
    case "POST":
      let bodyObject = JSON.parse(req.body);
      bodyObject.timeStamp = toIsoString(new Date())
      // let newEmail = await db.collection("emails").insertOne(bodyObject);
      const update = {
        "$set": 
          bodyObject
      };
      const query = { email: bodyObject.email };
      let newEmail = await db.collection("emails").updateOne(query, update, {upsert: true});
      res.json(newEmail);
      break;
    case "GET":
      const posts = await db.collection("emails").find({}).toArray();
      res.json({ status: 200, data: posts });
      break;
  }
}