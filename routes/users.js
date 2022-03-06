const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  updateUserInfo,
  updateAvatar,
  getUsers,
  getUser,
} = require('../controllers/users');

router.get('/', auth, getUsers);
router.get('/:userId', getUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
