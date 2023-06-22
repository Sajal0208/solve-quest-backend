const mongoose = require('mongoose')
const validator = require('validator')

const problemSchema = mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Please add a title'],
        minlength: [2, 'Title must be at least 2 characters long'],
        maxlength: [50, 'Title cannot exceed 30 characters'],
        trim: true,
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: [true, 'Please add a difficulty'],
    },
    order: {
        type: Number,
        required: [true, 'Please add an order'],
    },
    problem_id: {
        type: String,
        required: [true, 'Please add a problem id'],
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    likes: {
        type: Number,
        default: 0,
    },
    videoId: {
        type: String,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: []
    }]
})

module.exports = mongoose.model('Problem', problemSchema)