const express = require('express')
const router = express.Router()
const { createComment, getComments, deleteComment } = require('../controller/commentController');


router.post('/createComment', createComment);
router.get('/getComments/:problemId', getComments);
router.delete('/deleteComment/:commentId', deleteComment);

module.exports = router;
