const router = require('express').Router();

const {
  updateUserInfo,
  updateAvatar,
  getUsers,
  getUser,
  getMe,
} = require('../controllers/users');

router.get('/me', getMe);
router.get('/', getUsers);
router.get('/:userId', getUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
