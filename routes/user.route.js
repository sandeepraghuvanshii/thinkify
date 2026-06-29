const express = require("express");
const router = express.Router();
const validatorMiddleware = require("../middlewares/validator.middlware");
const {
  registerController,
  loginController,
  // verifyAccountController,
  profileController,
  profileUpdateController,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

router.post(
  "/register",
  validatorMiddleware(registerSchema),
  registerController,
);
router.get("/profile", authMiddleware, profileController);
router.put("/profile", authMiddleware, profileUpdateController);
// router.get("/verify", verifyAccountController);
router.post("/login", validatorMiddleware(loginSchema), loginController);

module.exports = router;
