const controller = require('../controllers/endUser');
const router = require('express').Router();
const { isAuth, isEndUser } = require('../middlewares');

router.get('/', isAuth, controller.get.myInfo);
router.patch('/username', isAuth, controller.patch.username);
router.patch('/email', isAuth, controller.patch.email);
router.patch('/password', isAuth, controller.patch.password);
router.post('/friends', isAuth, isEndUser, controller.post.addFriend);
router.delete('/friends', isAuth, isEndUser, controller.delete.removeFriend);

module.exports = router;
