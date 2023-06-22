const User = require('../models/userModel')

const createUser = async (req, res) => {
    const { name, email, uid } = req.body
    if (!name || !email || !uid) {
        res.status(400)
        throw new Error('Please fill out all fields')
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    const user = await User.create({
        uid,
        name,
        email,
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            uid: user.uid,
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
}

const getUser = async (req, res) => {
    const { id } = req.params
    if (!id) {
        res.status(400)
        throw new Error('Please fill out all fields')
    }
    const user = await User.findOne({ uid: id })
    if (user) {
        res.status(201).json({
            ...user
        })
    }
    else {
        res.status(400)
        throw new Error('User does not exist')
    }
}

const followUser = async (req, res) => {
    const { uid } = req.body
    if (!uid) {
        res.status(400)
        throw new Error('Please fill out all fields')
    }
    const currentUser = User.findOne({ uid })
    if (req.params.id !== currentUser.id) {
        try {
            const user = await User.findById(req.params.id)
            if (!user.followers.includes(currentUser.id)) {
                await user.updateOne({ $push: { followers: currentUser.id } })
                await currentUser.updateOne({ $push: { following: user.id } })
                res.status(200).json('user has been followed')
            } else {
                res.status(403).json('you already follow this user')
            }

        } catch (e) {
            res.status(500)
            throw new Error('Something went wrong')
        }
    }
    else {
        res.status(403)
        throw new Error('You cannot follow yourself')
    }
}

const unfollowUser = async (req, res) => {
    const { uid } = req.body
    if (!uid) {
        res.status(400)
        throw new Error('Please fill out all fields')
    }
    const currentUser = User.findOne({ uid })
    if (req.params.id !== currentUser.id) {
        try {
            const user = await User.findById(req.params.id)
            if (user.followers.includes(currentUser.id)) {
                await user.updateOne({ $pull: { followers: currentUser.id } })
                await currentUser.updateOne({ $pull: { following: user.id } })
                res.status(200).json('user has been unfollowed')
            } else {
                res.status(403).json('you dont follow this user')
            }

        } catch (e) {
            res.status(500)
            throw new Error('Something went wrong')
        }
    }
    else {
        res.status(403)
        throw new Error('You cannot unfollow yourself')
    }
}


module.exports = {
    createUser,
    getUser,
    followUser,
    unfollowUser
}