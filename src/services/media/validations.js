import { body } from "express-validator";

export const newMediaValidation = [
  body("Title").exists().withMessage("Title is mandatory field!"),
  body("Year").exists().withMessage("Year is mandatory field!"),
  body("Type").exists().withMessage("Type is mandatory field!"),
  body("Poster").exists().withMessage("Poster is mandatory field!"),
];
