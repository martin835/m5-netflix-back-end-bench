import express from "express";
import multer from "multer";
import {
  savePostersPictures,
  getMedia,
  getMediaReadableStream,
} from "../../lib/fs-tools.js";
import { getPDFReadableStream } from "../../lib/pdf-tools.js";
import { pipeline } from "stream";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const filesRouter = express.Router();

filesRouter.get("/:oneMediaId/downloadPDF", async (req, res, next) => {
  try {
    //1, get data from articles about concrete article using req.params.articleId
    const mediaArray = await getMedia();

    const foundMedium = mediaArray.find(
      (medium) => medium.imdbID === req.params.oneMediaId
    );

    //2, send that data to getPDFReadableStream(articleData)

    res.setHeader("Content-Disposition", "attachment; filename=medium.pdf");

    console.log(
      "THIS SHOULD BE MY DOWNLOAD articleId: ",
      req.params.oneMediaId
    );

    const source = getPDFReadableStream(foundMedium);

    const destination = res;
    pipeline(source, destination, (err) => {
      console.log(err);
    });
  } catch (error) {
    next(error);
  }
});

export default filesRouter;
