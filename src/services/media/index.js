import express from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import multer from "multer";
import { extname } from "path";
import uniqid from "uniqid";
import {
  getMedia,
  savePostersPictures,
  writeMedia,
} from "../../lib/fs-tools.js";
import { newMediaValidation } from "./validations.js";

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
  const media = await getMedia();

  res.send(media);
});

//3
mediaRouter.get("/:oneMediaId", async (req, res) => {
  console.log("this is request get oneMedia: ", req.params.oneMediaId);
  const media = await getMedia();

  const foundmedia = media.find(
    (media) => media.imdbID === req.params.oneMediaId
  );

  res.send(foundmedia);
});

//4
mediaRouter.put("/:oneMediaId", async (req, res) => {
  console.log("this is request edit oneMedia: ", req.params);
  const media = await getMedia();

  const index = media.findIndex(
    (media) => media.imdbID === req.params.oneMediaId
  );
  const oldMedia = media[index];
  const updatedMedia = {
    ...oldMedia,
    ...req.body,
    updatedAt: new Date(),
  };

  media[index] = updatedMedia;

  await writeMedia(media);

  res.send(updatedMedia);
});

//5
mediaRouter.delete("/:oneMediaId", async (req, res) => {
  console.log("this is request delete oneMedia: ", req.params);
  const media = await getMedia();
  const remainingMedia = media.filter(
    (medium) => medium.imdbID !== req.params.oneMediaId
  );

  await writeMedia(remainingMedia);

  res.status(204).send();
});

//6 - upload cover image for media

mediaRouter.patch(
  "/:oneMediaId/poster",
  multer().single("poster"),
  async (req, res, next) => {
    try {
      console.log("FILE: ", req.file);
      await savePostersPictures(
        req.params.oneMediaId + extname(req.file.originalname),
        req.file.buffer
      );
      res.send({ message: "file uploaded" });
    } catch (error) {
      next(error);
    }

    const mediaArray = await getMedia();

    const index = mediaArray.findIndex(
      (medium) => medium.imdbID === req.params.oneMediaId
    );
    const oldMedium = mediaArray[index];

    const posterUrl =
      "http://localhost:3001/img/posters/" +
      req.params.oneMediaId +
      extname(req.file.originalname);

    const updatedMedium = {
      ...oldMedium,
      Poster: posterUrl,
      updatedAt: new Date(),
    };

    mediaArray[index] = updatedMedium;

    await writeMedia(mediaArray);
  }
);

//7 add comments to a medium
mediaRouter.put("/:oneMediaId/comment", async (req, res, next) => {
  try {
    /* const { text, userName } = req.body; */
    const { comment, rate } = req.body;
    const commentOjb = {
      elementId: uniqid(),
      comment,
      rate,
      createdAt: new Date(),
    };

    const mediaArray = await getMedia();

    const mediumIndex = mediaArray.findIndex(
      (medium) => medium.imdbID === req.params.oneMediaId
    );
    if (!mediumIndex == -1) {
      res.status(404).send({
        message: `medium with ${req.params.oneMediaId} is not found!`,
      });
    }
    const oldMedium = mediaArray[mediumIndex];
    oldMedium.comments = oldMedium.comments || [];
    const updatedMedium = {
      ...oldMedium,

      comments: [...oldMedium.comments, commentOjb],
      updatedAt: new Date(),
    };
    mediaArray[mediumIndex] = updatedMedium;
    await writeMedia(mediaArray);

    res.send(updatedMedium);
  } catch (error) {
    console.log(error);
    res.send(500).send({ message: error.message });
  }
});

//8 delete a comment

mediaRouter.delete(
  "/:oneMediaId/comment/:commentId",
  async (req, res, next) => {
    console.log("this is requested  one comment: ", req.params);
    const mediaArray = await getMedia();

    const mediumIndex = mediaArray.findIndex(
      (medium) => medium.imdbID === req.params.oneMediaId
    );
    if (!mediumIndex == -1) {
      res.status(404).send({
        message: `medium with ${req.params.oneMediaId} is not found!`,
      });
    }
    let oldMedium = mediaArray[mediumIndex];

    const remainingMediaComments = oldMedium.comments.filter(
      (comment) => comment.elementId !== req.params.commentId
    );

    oldMedium.comments = remainingMediaComments;

    const updatedMedium = { ...oldMedium };

    mediaArray[mediumIndex] = updatedMedium;
    await writeMedia(mediaArray);

    res.status(204).send();
  }
);

//9 get a comment

mediaRouter.get("/:oneMediaId/:commentId.", async (req, res, next) => {
  console.log("this is requested comment: ", req.params.oneMediaId);
  const media = await getMedia();

  const foundmedia = media.find(
    (media) => media.imdbID === req.params.oneMediaId
  );

  const foundComment = foundmedia.comments.find(
    (comment) => comment.elementId === req.params.commentId
  );

  res.send(foundComment);
});

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
