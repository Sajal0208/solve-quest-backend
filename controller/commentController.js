const Comment = require('../models/commentModel')
const User = require('../models/userModel')
const Problem = require('../models/problemModel')

const createComment = async (req, res) => {
    const { problemId } = req.params
    const { content, uid } = req.body

    if (!content || !uid) {
        res.status(400)
        throw new Error('Please fill out all fields')
    }

    try {
        const user = await User.findOne({ uid })
        const problem = await Problem.findOne({ problem_id: problemId })

        if (!user) {
            res.status(400)
            throw new Error('User does not exist')
        }

        if (!problem) {
            res.status(400)
            throw new Error('Problem does not exist')
        }

        const comment = await Comment.create({
            content,
            author: user._id,
            problem: problem._id
        })

        // Update problem with new comment
        problem.comments.push(comment._id)
        await problem.save()

        res.status(201).json({
            _id: comment._id,
            content: comment.content,
            message: 'Comment created successfully'
        })

    } catch (e) {
        return res.status(500).json({ 
            message: 'Internal server error' 
        });
    }

}

const getComments = async (req, res) => {
    const { problemId } = req.params

    try {
        const problem = await Problem.findOne({ problem_id: problemId }).populate('comments');

        if (!problem) {
            res.status(400)
            throw new Error('Problem does not exist')
        }

        return res.status(200).json({
            comments: problem.comments
        })
    } catch (e) {
        return res.status(500).json({ 
            message: 'Internal server error' 
        });
    }
}

const deleteComment = async (req, res) => {
    const { commentId } = req.params

    try {
        const comment = await Comment.findOne({ _id: commentId })
        if (!comment) {
            res.status(400)
            throw new Error('Comment does not exist')
        }

        await Comment.deleteOne({ _id: commentId })

        return res.status(200).json({
            message: 'Comment deleted successfully'
        })
    } catch (e) {
        return res.status(500).json({ 
            message: 'Internal server error' 
        });
    }
}

module.exports = {
    createComment,
    getComments,
    deleteComment
}