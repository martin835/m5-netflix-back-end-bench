import fs from "fs-extra"; // 3RD PARTY MODULE
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile, createReadStream } = fs;

const getJSONPath = (filename) =>
  join(join(dirname(fileURLToPath(import.meta.url)), "../data"), filename);

const mediaJSONPath = getJSONPath("media.json");
/* const authorsJSONPath = getJSONPath("authors.json"); */

const postersPublicFolderPath = join(process.cwd(), "./public/img/posters");
/* const avatarsPublicFolderPath = join(process.cwd(), "./public/img/avatars"); */

export const getMedia = () => readJSON(mediaJSONPath);
export const writeMedia = (content) => writeJSON(mediaJSONPath, content);

export const savePostersPictures = (filename, contentAsABuffer) =>
  writeFile(join(postersPublicFolderPath, filename), contentAsABuffer);

export const getMediaReadableStream = () => createReadStream(mediaJSONPath);
