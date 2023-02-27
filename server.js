import express, { json } from "express";
import cors from "cors";
import { JSDOM } from "jsdom";
import { drawText, drawImage } from "./methods/helper.js";
import { createCanvas } from "canvas";
import { registerFont } from "canvas";
import { Image } from "canvas";



// registering fonts
registerFont("./assets/fonts/Chillax-Variable.ttf", { family: "Chillax Variable" });
registerFont("./assets/fonts/ClashGrotesk-Variable.ttf", {
  family: "Clash Grotesk Variable",
});
registerFont("./assets/fonts/GeneralSans-Variable.ttf", {
  family: "General Sans Variable",
});
registerFont("./assets/fonts/Satoshi-Variable.ttf", { family: "Satoshi Variable" });

const app = express();
// app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://water-stamp.vercel.app"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(json({ limit: "50mb" }));

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
