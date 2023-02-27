import express, { json } from "express";
import cors from "cors";
import { JSDOM } from "jsdom";
import { drawText, drawImage } from "./methods/helper.js";
import { createCanvas } from "canvas";
import { registerFont } from "canvas";
import { Image } from "canvas";

const app = express();
const corsOptions = {
origin:["http://localhost:5173","https://water-stamp.vercel.app"]
}


// middleware to parse the incoming request and for cors
app.use(cors(corsOptions));
app.use(json({ limit: "50mb" }));
app.post("/test",(_,res) => res.send("done"));

// registering fonts
registerFont("./assets/fonts/Chillax-Variable.ttf", { family: "Chillax Variable" });
registerFont("./assets/fonts/ClashGrotesk-Variable.ttf", {
  family: "Clash Grotesk Variable",
});
registerFont("./assets/fonts/GeneralSans-Variable.ttf", {
  family: "General Sans Variable",
});
registerFont("./assets/fonts/Satoshi-Variable.ttf", { family: "Satoshi Variable" });



app.post("/image", (req, res) => {
  const DOM = new JSDOM(`<!doctype html><html><body></body></html>`, {
    resources: "usable",
  });
  let canvas;
  let ctx;
  let body = req.body.params;
  let document = DOM.window.document;
  let img = new Image();

  img.onload = function () {
    canvas = createCanvas(img.width, img.height);
    ctx = canvas.getContext("2d");
    console.log("load completed");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    ctx.scale(body.scale, body.scale);
    body.elements.forEach(async (el) =>
      el.type == "text"
        ? drawText(ctx, el.element, body.offsetLeft, body.offsetTop)
        : await drawImage(
            ctx,
            el.element,
            body.offsetLeft,
            body.offsetTop,
            document
          )
    );

    let data = canvas.toDataURL();

    res.send(data);
  };
  img.src = body.img;
});

app.listen("3000", () => {
  console.log("listening");
});
