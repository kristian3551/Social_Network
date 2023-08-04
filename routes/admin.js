const controller = require('../controllers/admin');
const router = require('express').Router();
const { isAuth, isAdmin, isPasswordValid, isUsernameValid, isEmailValid, isTokenNew } = require('../middlewares');

router.get('/', isAuth, isTokenNew, isAdmin, controller.get.users);
router.post('/', isUsernameValid, isPasswordValid, isEmailValid, isAuth, isTokenNew, isAdmin, controller.post.user);
router.patch('/:id/password', isPasswordValid, isAuth, isTokenNew, isAdmin, controller.patch.password);
router.delete('/:id', isAuth, isTokenNew, isAdmin, controller.delete.user);

module.exports = router;
