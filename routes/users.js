const router = require("express").Router();
const {
  createUser,
  updateUserInfo,
  updateAvatar,
  getUsers,
  getUser,
} = require("../controllers/users");

router.get("/", getUsers);

router.get("/:userId", getUser);

router.post("/", createUser);

router.patch("/me", updateUserInfo);

router.patch("/me/avatar", updateAvatar);

module.exports = router;
