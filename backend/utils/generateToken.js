import jwt from 'jsonwebtoken'


const generateToken = (id, maxAge) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: maxAge }
    )
}

export default generateToken