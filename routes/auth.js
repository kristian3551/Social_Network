const controller = require('../controllers/auth');
const router = require('express').Router();

router.post('/login', controller.post.login);
router.post('/logout', controller.post.logout);

module.exports = router;
