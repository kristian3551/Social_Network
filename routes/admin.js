const controller = require('../controllers/admin');
const router = require('express').Router();
const { isAuth, isAdmin } = require('../middlewares');

router.get('/', isAuth, isAdmin, controller.get.users);
router.post('/', isAuth, isAdmin, controller.post.user);
router.patch('/:id/password', isAuth, isAdmin, controller.patch.password);
router.delete('/:id', isAuth, isAdmin, controller.delete.user);

module.exports = router;
