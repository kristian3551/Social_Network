const controller = require('../controllers/endUser');
const router = require('express').Router();
const { isAuth, isEndUser, isUsernameValid, isEmailValid, isPasswordValid, uploader, isTokenNew } = require('../middlewares');

router.get('/', isAuth, isTokenNew, controller.get.myInfo);
router.patch('/username', isUsernameValid, isAuth, isTokenNew, controller.patch.username);
router.patch('/email', isEmailValid, isAuth, isTokenNew, controller.patch.email);
router.patch('/password', isPasswordValid, isAuth, isTokenNew, controller.patch.password);
router.post('/friends', isAuth, isTokenNew, isEndUser, controller.post.addFriend);
router.post('/avatar', isAuth, isTokenNew, uploader.single('avatar'), controller.post.avatar);
router.delete('/friends', isAuth, isTokenNew, isEndUser, controller.delete.removeFriend);

module.exports = router;
