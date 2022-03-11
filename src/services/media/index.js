import express from "express";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { newMediaValidation } from "./validations.js";
import multer from "multer";
import { extname } from "path";
import { getMedia, writeMedia } from "../../lib/fs-tools.js";
import { saveCoversPictures } from "../../lib/fs-tools.js";

const mediaRouter = express.Router();
//1
mediaRouter.post("/", newMediaValidation, async (req, res, next) => {
  console.log("this is request post media: ");

  try {
    const errorsList = validationResult(req);
    if (errorsList.isEmpty()) {
      const newMedia = {
        ...req.body,
        createdAt: new Date(),
        imdbID: uniqid(),
      };
      const mediaArray = await getMedia();
      mediaArray.push(newMedia);
      await writeMedia(mediaArray);

      res.status(201).send({ imdbID: newMedia.imdbID });
    } else {
      next(
        createHttpError(400, "Some errors occurred in req body", {
          errorsList,
        })
      );
    }
  } catch (error) {
    next(error);
  }
});

//2
mediaRouter.get("/", async (req, res) => {
  console.log("this is request get all media: ");
  res.send();
});

//3
mediaRouter.get("/:oneMediaId", async (req, res) => {
  console.log("this is request get oneMedia: ", req.params);
  res.send();
});

//4
mediaRouter.put("/:oneMediaId", async (req, res) => {
  console.log("this is request edit oneMedia: ", req.params);
  res.send();
});

//5
mediaRouter.delete("/:oneMediaId", async (req, res) => {
  console.log("this is request delete oneMedia: ", req.params);
  res.send();
});

//6 - upload cover image for media

mediaRouter.patch(
  "/:oneMediaId/cover",
  /* multer().single("cover") */
  async (req, res, next) => {}
);

//7 - send confirmation email to author when oneMedia is created
// This  ⬇️ ⬇️ ⬇️  is an example how to send an email with dedicated endpoint.
//If we want to send confirmation email after an oneMedia is created,
//it should be part of mediaRouter.post (....post new oneMedia router -- #1 ⬆️⬆️⬆️ )
/* mediaRouter.post("/sendEmail", async (req, res, next) => {
  try {
    // 1. Receive email address from req.body
    console.log(req.body);
    console.log("ArticleId from params: ", req.params.oneMediaId);
    
    // 2. Send email to new user
    await sendRegistrationEmail(req.body);
    res.send();
  } catch (error) {
    next(error);
  }
}); */

export default mediaRouter;
