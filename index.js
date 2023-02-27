import express, { json } from "express";
import cors from "cors";
import { drawText, drawImage } from "./methods/helper.js";
import { createCanvas,GlobalFonts } from '@napi-rs/canvas';
import { Image } from '@napi-rs/canvas';
const app = express();
app.use(cors(
  {
    origin:["http://localhost:5173","https://water-stamp.vercel.app"]
  }
));
app.use(json({ limit: "50mb" }));

// registering fonts
GlobalFonts.registerFromPath(join(__dirname, ".","assets",".","fonts","Chillax-Variable.ttf"), "Chillax Variable");
GlobalFonts.registerFromPath(join(__dirname, ".","assets",".","fonts","ClashGrotesk-Variable.ttf"), "Clash Grotesk Variable");
GlobalFonts.registerFromPath(join(__dirname, ".","assets",".","fonts","GeneralSans-Variable.ttf"), "General Sans Variable");
GlobalFonts.registerFromPath(join(__dirname, ".","assets",".","fonts","Satoshi-Variable.ttf"), "Satoshi Variable");


// registerFont("./assets/fonts/Chillax-Variable.ttf", { family: "Chillax Variable" });
// registerFont("./assets/fonts/ClashGrotesk-Variable.ttf", {
//   family: "Clash Grotesk Variable",
// });
// registerFont("./assets/fonts/GeneralSans-Variable.ttf", {
//   family: "General Sans Variable",
// });
// registerFont("./assets/fonts/Satoshi-Variable.ttf", { family: "Satoshi Variable" });

app.post("/image", (req, res) => {
 
  let canvas;
  let ctx;
  let body = req.body.params;
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
            body.offsetTop
          )
    );

    let data = canvas.toDataURL();

    res.send(JSON.stringify({data:data}));
  };
  img.src = body.img;
});

app.listen("3000", () => {
  console.log("listening");
});


module.exports = app;