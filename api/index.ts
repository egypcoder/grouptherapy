import type { VercelRequest, VercelResponse } from "@vercel/node";
import serverless from "serverless-http";
import { createApp, initializeAppForServerless } from "../server/app";

let handler: any;

export default async function (req: VercelRequest, res: VercelResponse) {
  try {
    if (!handler) {
      const app = createApp();
      await initializeAppForServerless(app);
      handler = serverless(app);
    }

    return handler(req, res);
  } catch (err: any) {
    console.error("Serverless crash:", err);

    if (!res.headersSent) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
