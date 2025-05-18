import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { User } from './db/db.js'
import postRoutes from './posts.js';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json({ limit: '500mb' })); 
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(cookieParser());

const port = 8000;

mongoose.connect('mongodb://localhost:27017/posts')

app.post('/login', async(req, res) => 
{
    const {username, password} = req.body;

    try
    {
        const user = await User.findOne({username: username, password: password});
        if(!user)
        {
            return res.status(404).send('- User does not exist!')
        }

        const token = jwt.sign({username: username}, 'test', { expiresIn: '1h' })
        res.cookie('token', token, {httpOnly: true, secure: false, sameSite: 'lax'})

        return res.status(200).json({status: 'success', user: {username: username, email: user.email, userid: user.id}})
    }
    catch(e)
    {
        return res.status(500).send('An error occurred');   
    }  
})

app.post('/signup', async(req, res) => {
    
    const {username, email, password} = req.body;

    try
    {
        const exists = await User.findOne({username, email});

        if(exists)
        {
            return res.status(404).send('Email already exists. Please create a new one!')
        }

        const userCount = await User.countDocuments();
        let createUser = await User.insertOne({username, email, password, userid: userCount+1});

        if(createUser)
        {
            const token = jwt.sign({username: username}, 'test', { expiresIn: '1h' })
            res.cookie('token', token, {httpOnly: true, secure: false, sameSite: 'lax'})
            return res.status(200).send({status: 'success', username:username, userid: createUser.userid})
        }
    }
    catch(err)
    {
        return res.status(500).send('An error occurred');   
    }
})

app.post('/me', async(req, res) => {

    let token = req.cookies.token;

    if(!token)
    {
        return res.status(401).send('Unauthorized');
    }

    try
    {
        const decodedToken = jwt.verify(token, 'test');
        const user = await User.findOne({username: decodedToken.username})
        
        if (!user)
        {
            return res.status(401).send('User not found');
        }

        return res.status(200).json({ status: 'success', user: { username: user.username, email: user.email, userid: user.userid} });
    }
    catch(err)
    {
        console.log(err)
    }
})

app.get('/logout', (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: false, sameSite: 'lax' });
    return res.status(200).send('success');
})

app.use('/posts', postRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
