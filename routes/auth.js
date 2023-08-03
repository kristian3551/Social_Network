const controller = require('../controllers/auth');
const router = require('express').Router();

const { isAuth } = require('../middlewares');

router.post('/login', controller.post.login);
router.post('/logout', isAuth, controller.post.logout);

module.exports = router;
