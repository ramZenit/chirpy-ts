import express from "express";
import { Request, Response } from "express";

const app = express();
const PORT = 8080;

app.use("/app", express.static("./src/app"));

app.get("/healthz", handlerRediness);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

function handlerRediness(req: Request, res: Response) {
  res.set("content-type", "text/plain; charset=utf-8").status(200).send("OK");
}
