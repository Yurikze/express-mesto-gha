const router = require('express').Router();
const {
  createUser,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

router.post('/', createUser);

router.patch('/me', updateUserInfo);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
