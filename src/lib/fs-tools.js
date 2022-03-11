import fs from "fs-extra"; // 3RD PARTY MODULE
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile, createReadStream } = fs;

const getJSONPath = (filename) =>
  join(join(dirname(fileURLToPath(import.meta.url)), "../data"), filename);

const mediaJSONPath = getJSONPath("media.json");
/* const authorsJSONPath = getJSONPath("authors.json"); */

const coversPublicFolderPath = join(process.cwd(), "./public/img/covers");
/* const avatarsPublicFolderPath = join(process.cwd(), "./public/img/avatars"); */

export const getMedia = () => readJSON(mediaJSONPath);
export const writeMedia = (content) => writeJSON(mediaJSONPath, content);

export const saveCoversPictures = (filename, contentAsABuffer) =>
  writeFile(join(coversPublicFolderPath, filename), contentAsABuffer);

/* export const getAuthorsReadableStream = () => createReadStream(authorsJSONPath); */
