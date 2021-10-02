import { body, ValidationChain } from "express-validator";
import { HttpException } from "../utility/HttpException";

export const createProductValidation: ValidationChain[] = [
  body("name")
    .trim()
    .exists()
    .withMessage("Product name is required")
    .isString()
    .notEmpty(),
  body("description")
    .trim()
    .exists()
    .withMessage("Product description is required")
    .isString()
    .isLength({ min: 10 })
    .withMessage("Production description must be at least 10 characters")
    .notEmpty(),
  body("price")
    .exists()
    .withMessage("Product price is required")
    .isNumeric()
    .notEmpty(),
  body("image_file")
    .exists()
    .withMessage("Product image is required")
    .custom((value, { req }) => {
      if (!req.file) throw new HttpException(422, "Profile Img is required");
      return true;
    }),
];

export const updateProductValidation: ValidationChain[] = [
  body("name")
    .trim()
    .optional()
    .isString()
    .isLength({ min: 10 })
    .withMessage("Product name must be at least 10 characters"),
  body("description")
    .trim()
    .optional()
    .isString()
    .isLength({ min: 10 })
    .withMessage("Product description must be at least 10 characters"),
  body("price").optional().isNumeric(),
];
