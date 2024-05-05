import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import colors from 'colors'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleWare.js'
import cookieParser from 'cookie-parser'


const app = express()
app.use(express.json())
app.use(cookieParser())
dotenv.config()
connectDB()

app.get('/', (req, res) => {
    res.send('Api is Running')
})
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)

app.use(notFound)

app.use(errorHandler)

const PORT = /*process.env.PORT ||*/ 8000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on Port ${PORT}`.yellow.bold))
