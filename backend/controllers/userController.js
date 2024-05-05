import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

//TODO: Check user if they are already logged in for every Route

const maxAge = 3 * 24 * 60 * 60;
//@desc   Auth user & get token
//@route POST /api/users/login
//@access public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id, maxAge)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(401)
        throw new Error('Invalid Email or Password!')
    }
})

//@desc  Get user profile
//@route GET /api/users/profile
//@access private
const getUserProfile = asyncHandler(async (req, res) => {
    // const user = await User.findById(req.user._id)
    const user = await User.findById(req.user._id)
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    }

})

//@desc  Register new User
//@route POST /api/users
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password
    })
    if (user) {
        const token = generateToken(user._id, maxAge)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

export { authUser, getUserProfile, registerUser }