const controller = require('../controllers/auth');
const router = require('express').Router();

const { isAuth, isTokenNew } = require('../middlewares');

router.post('/login', controller.post.login);
router.post('/logout', isAuth, isTokenNew, controller.post.logout);

module.exports = router;
