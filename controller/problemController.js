const Problem = require('../models/problemModel')
const User = require('../models/userModel')

const getProblems = async (req, res) => {
    const problems = await Problem.find({})
    if (problems) {
        res.status(201).json({
            problems
        })
    }
    else {
        res.status(400)
        throw new Error('No problems found')
    }
}

const getProblem = async (req, res) => {
    const { id } = req.params
    if (!id) {
        res.status(400)
        throw new Error('Please fill out all fields')
    }
    const problem = await Problem.findOne({ problem_id: id })
    if (problem) {
        res.status(201).json({
            ...problem
        })
    }
    else {
        res.status(400)
        throw new Error('Problem does not exist')
    }
}

const createProblem = async (req, res) => {
    const { title, category, difficulty, order, problem_id, videoId } = req.body
    if (!title || !category || !difficulty || !order || !problem_id) {
        res.status(400)
        throw new Error('Please fill out all fields')
    }

    const problemExists = await Problem.findOne({ problem_id })
    if (problemExists) {
        res.status(400)
        throw new Error('Problem already exists')
    }


    const problem = await Problem.create({
        title,
        category,
        difficulty,
        order,
        problem_id,
    })

    if (problem) {
        res.status(201).json({
            _id: problem.id,
            title: problem.title,
            category: problem.category,
            difficulty: problem.difficulty,
            order: problem.order,
            problem_id: problem.problem_id,
        })
    } else {
        res.status(400)
        throw new Error('Invalid problem data')
    }
}


const handleLike = async (req, res) => {
    const { problemId } = req.params
    const { uid } = req.body
    if (!problemId || !uid) {
        res.status(400)
        throw new Error('Please fill out all fields')
    }

    try {
        const user = await User.findOne({ uid })
        const problem = await Problem.findOne({ problem_id: problemId })

        // Check if the problem exists
        if (!problem) {
            return res.status(403).json({
                message: 'Problem does not exist',
            })
        }

        // Check if the user exists
        if (!user) {
            return res.status(403).json({
                message: 'User does not exist',
            })
        }

        // Check if the user has liked the problem before
        if (user.likedProblems.includes(problemId)) {
            const updatedUser = await User.findOneAndUpdate({ uid }, { $pull: { likedProblems: problemId } }, { new: true })
            const updatedProblem = await Problem.findOneAndUpdate({ problem_id: problemId }, { $inc: { likes: -1 } }, {
                new: true
            })
            return res.status(200).json({
                message: 'Problem has been unliked',
                problem: updatedProblem,
                user: updatedUser
            })
        }

        // Check if the user has disliked the problem before
        if (user.dislikedProblems.includes(problemId)) {
            await User.findOneAndUpdate({ uid }, { $pull: { dislikedProblems: problemId } })
            await Problem.findOneAndUpdate({ problem_id: problemId }, { $inc: { dislikes: -1 } })
        }

        // Like the problem
        const updatedUser = await User.findOneAndUpdate({ uid }, { $push: { likedProblems: problemId } }, {
            new: true
        })
        console.log("🚀 ~ file: problemController.js:122 ~ handleLike ~ updatedUser:", updatedUser)
        const updatedProblem = await Problem.findOneAndUpdate({ problem_id: problemId }, { $inc: { likes: 1 } }, {
            new: true
        })
        return res.status(200).json({
            message: 'Problem has been liked',
            problem: updatedProblem,
            user: updatedUser
        })
    } catch (error) {
        res.status(500)
        console.log(error)
        throw new Error('Something went wrong')
    }
}

const handleDislike = async (req, res) => {
    const { problemId } = req.params
    const { uid } = req.body
    if (!problemId || !uid) {
        res.status(400)
        throw new Error('Please fill out all fields')
    }

    try {
        const user = await User.findOne({ uid })
        const problem = await Problem.findOne({ problem_id: problemId })

        // Check if the problem exists
        if (!problem) {
            return res.status(403).json({
                message: 'Problem does not exist',
            })
        }

        // Check if the user exists
        if (!user) {
            return res.status(403).json({
                message: 'User does not exist',
            })
        }

        // Check if the user has already disliked the problem
        if (user.dislikedProblems.includes(problemId)) {
            // Remove the dislike
            const updatedUser = await User.findOneAndUpdate({ uid }, { $pull: { dislikedProblems: problemId } }, { new: true })
            const updatedProblem = await Problem.findOneAndUpdate({ problem_id: problemId }, { $inc: { dislikes: -1 } }, { new: true })
            return res.status(200).json({
                message: 'Problem has been undisliked',
                user: updatedUser,
                problem: updatedProblem
            })
        }

        // Check if the user has liked the problem before
        if (user.likedProblems.includes(problemId)) {
            await User.findOneAndUpdate({ uid }, { $pull: { likedProblems: problemId } }, { new: true })
            await Problem.findOneAndUpdate({ problem_id: problemId }, { $inc: { likes: -1 } }, { new: true })
        }

        // Dislike the problem
        const updatedUser = await User.findOneAndUpdate({ uid }, { $push: { dislikedProblems: problemId } }, { new: true })
        const updatedProblem = await Problem.findOneAndUpdate({ problem_id: problemId }, { $inc: { dislikes: 1 } }, { new: true })
        return res.status(200).json({
            message: 'Problem has been disliked',
            user: updatedUser,
            problem: updatedProblem
        })
    } catch (e) {
        console.log(e)
        res.status(500)
        throw new Error('Something went wrong')
    }
}

const handleStar = async (req, res) => {
    const { problemId } = req.params
    const { uid } = req.body

    if (!problemId || !uid) {
        res.status(400)
        throw new Error('Please fill out all fields')
    }

    try {
        const user = await User.findOne({ uid })
        const problem = await Problem.findOne({ problem_id: problemId })

        // Check if the problem exists
        if (!problem) {
            return res.status(403).json({
                message: 'Problem does not exist',
            })
        }

        // Check if the user exists
        if (!user) {
            return res.status(403).json({
                message: 'User does not exist',
            })
        }

        // Check if the user has already starred the problem
        if (user.starredProblems.includes(problemId)) {
            // Unstar the problem
            const updatedUser = await User.findOneAndUpdate({ uid }, { $pull: { starredProblems: problemId } }, { new: true })
            const updatedProblem = await Problem.findOneAndUpdate({ problem_id: problemId }, { $inc: { stars: -1 } }, { new: true })
            return res.status(200).json({
                message: 'Problem has been unstarred',
                user: updatedUser,
                problem: updatedProblem
            })
        }

        // Star the problem
        const updatedUser = await User.findOneAndUpdate({ uid }, { $push: { starredProblems: problemId } }, { new: true })
        const updatedProblem = await Problem.findOneAndUpdate({ problem_id: problemId }, { $inc: { stars: 1 } }, { new: true })
        return res.status(200).json({
            message: 'Problem has been starred',
            user: updatedUser,
            problem: updatedProblem
        })


    } catch (e) {
        res.status(500)
        console.log(e)
        throw new Error('Something went wrong')
    }
}

const handleSolved = async (req, res) => {
    const { problemId } = req.params
    const { uid } = req.body

    if (!problemId || !uid) {
        res.status(400)
        throw new Error('Please fill out all fields')
    }

        console.log('1')
    
    try {
        const user = await User.findOne({ uid })
        const problem = await Problem.findOne({ problem_id: problemId })
        console.log('2')
        // Check if the problem exists
        if (!problem) {
            return res.status(403).json({
                message: 'Problem does not exist',
            })
        }

        // Check if the user exists
        if (!user) {
            return res.status(403).json({
                message: 'User does not exist',
            })
        }

        if(user.solvedProblems.includes(problemId)) {
            return res.status(200).json({
                message: 'User have already solved this problem before',
            })
        }
        console.log('2')
        const updatedUser = await User.findOneAndUpdate({ uid }, { $push: { solvedProblems: problemId } }, {
            new: true
        })        
        console.log("🚀 ~ file: problemController.js:288 ~ handleSolved ~ updatedUser:", updatedUser)
        console.log('3')
        res.status(200).json({
            message: 'Problem has been solved',
            user: updatedUser,
        })
    } catch (e) {
        console.log(e)
        res.status(500)
        throw new Error('Something went wrong')
    }
}

module.exports = {
    getProblems,
    getProblem,
    createProblem,
    handleLike,
    handleDislike,
    handleStar,
    handleSolved
}