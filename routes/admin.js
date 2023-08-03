const controller = require('../controllers/admin');
const router = require('express').Router();

router.get('/', controller.get.users);
router.post('/', controller.post.user);
router.patch('/:id/password', controller.patch.password);
router.delete('/:id', controller.delete.user); // TODO: Implement when added end user routes!

module.exports = router;
