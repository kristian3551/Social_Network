const controller = require('../controllers/admin');
const router = require('express').Router();
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');

router.get('/', isAuth, isAdmin, controller.get.users);
router.post('/', isAuth, isAdmin, controller.post.user);
router.patch('/:id/password', isAuth, isAdmin, controller.patch.password);
router.delete('/:id', isAuth, isAdmin, controller.delete.user); // TODO: Implement when added end user routes!

module.exports = router;
