const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = mongoose.Schema({
    uid: {
        type: String,
        required: [true, 'Please add a uid'],
    },
    name: {
        type: String,
        required: [true, 'Please add first name'],
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [30, 'Name cannot exceed 30 characters'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Please enter a valid email');
            }
        }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likedProblems: [{ type: String }],
    dislikedProblems: [{ type: String }],
    starredProblems: [{ type: String }],
    solvedProblems: [{ type: String }],
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('User', userSchema)