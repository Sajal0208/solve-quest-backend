const express = require('express')
const router = express.Router()
const { getUser, createUser, followUser, unfollowUser } = require('../controller/userController');

router.post('/createUser', createUser);
router.get('/getUser/:id', getUser);
router.put('/:id/follow', followUser);
router.put('/:id/unfollow', unfollowUser)

module.exports = router;