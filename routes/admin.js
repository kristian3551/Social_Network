const controller = require('../controllers/admin');
const router = require('express').Router();
const { isAuth, isAdmin, isPasswordValid, isUsernameValid, isEmailValid } = require('../middlewares');

router.get('/', isAuth, isAdmin, controller.get.users);
router.post('/', isUsernameValid, isPasswordValid, isEmailValid, isAuth, isAdmin, controller.post.user);
router.patch('/:id/password', isPasswordValid, isAuth, isAdmin, controller.patch.password);
router.delete('/:id', isAuth, isAdmin, controller.delete.user);

module.exports = router;
