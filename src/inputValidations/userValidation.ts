import { body, ValidationChain } from "express-validator";
import { getRepository } from "typeorm";

import { User } from "../entity/User";

export const createUserValidation: Array<ValidationChain> = [
  body("first_name")
    .trim()
    .exists()
    .withMessage("Please provide first name")
    .isString()
    .notEmpty(),
  body("last_name")
    .trim()
    .exists()
    .withMessage("Please provide last name")
    .isString()
    .notEmpty(),
  body("email")
    .trim()
    .exists()
    .withMessage("Please provide first name")
    .isEmail()
    .withMessage("Please provide a valid email.")
    .custom(async (value) => {
      const user = await getRepository(User).findOneBy({ email: value });

      if (user) {
        return Promise.reject("E-mail already in use");
      }
    }),
  body("contact_number")
    .trim()
    .exists()
    .isMobilePhone("en-GH")
    .withMessage("This is not a valid Ghanaian mobile number.")
    .notEmpty(),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 6 characters")
    .notEmpty(),
  body("confirm_password")
    .exists()
    .custom((value, { req }) => value === req.body.password)
    .withMessage(
      "Confirm password field must have the same value as the password field"
    ),
];

export const updateUserValidation: Array<ValidationChain> = [
  body("first_name").trim().optional().isString(),
  body("last_name").trim().optional().isString(),
  body("email")
    .trim()
    .optional()
    .isEmail()
    .custom(async (value) => {
      const user = await getRepository(User).findOneBy({ email: value });
      if (user) {
        return Promise.reject("E-mail already in use");
      }
    }),
  body("contact_number")
    .trim()
    .optional()
    .isMobilePhone("en-GH")
    .withMessage("This is not a valid Ghanaian mobile number."),
];

export const loginValidation: Array<ValidationChain> = [
  body("email")
    .trim()
    .exists()
    .withMessage("Please your email required.")
    .notEmpty(),
  body("password").exists().withMessage("Password is required.").notEmpty(),
];

export const changePasswordValidation: Array<ValidationChain> = [
  body("currentPassword")
    .exists()
    .withMessage("Current password is required.")
    .notEmpty(),
  body("newPassword")
    .exists()
    .withMessage("New password is required")
    .notEmpty(),
  body("confirmNewPassword")
    .exists()
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage(
      "Confirm password field must have the same value as the new password field"
    ),
];
