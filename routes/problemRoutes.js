const express = require('express')
const router = express.Router()
const { createProblem, getProblem, getProblems, handleDislike, handleLike, handleStar, handleSolved } = require('../controller/problemController');

router.post('/addProblem', createProblem);
router.get('/getProblem/:id', getProblem);
router.get('/getProblems', getProblems);
router.put('/handleLike/:problemId', handleLike);
router.put('/handleDislike/:problemId', handleDislike);
router.put('/handleStar/:problemId', handleStar);
router.put('/handleSolved/:problemId', handleSolved)

module.exports = router;