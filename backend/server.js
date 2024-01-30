import express, { json } from 'express'
import mysql from 'mysql2'
import cors from 'cors'
import fs from 'fs'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import cookieParser from 'cookie-parser'
import nodemailer from 'nodemailer'
import session from 'express-session'
import MySQLStoreCreator from 'express-mysql-session';
import cron from 'node-cron'
import axios from 'axios'

const MySQLStore = MySQLStoreCreator(session);
const app = express()
const port = "http://localhost:8800"

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"DeansOffice2023",
    database:"ojtsys"
})

db.connect(function(err){
    if(err){
        console.log('DB ERROR');
        throw err;
    }
    console.log("connected to backend");
})
const sessionStore = new MySQLStore({
    expiration: (1825 * 86400 * 1000),
    endConnectionOnClose: false
}, db)

app.use(session({
    key: 'SessionToken',
    secret: '192i34k1290wemfij981m239idm',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: (1825 * 86400 * 1000),
        httpOnly: false
    }
}))
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}))
app.use(express.json())

//User Backend
app.post("/register", async(req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const registerQ = "INSERT INTO users (`UID`, `first_Name`, `last_Name`, `username`, `email`, `password`, `role`, `active`, `verified`, `verification_Token`) VALUES (?)"
    const values = [
        req.body.UID,
        req.body.fName,
        req.body.lName,
        req.body.username,
        req.body.email,
        hashedPassword,
        "user",
        1,
        0,
        verificationToken
    ]
    db.query(registerQ, [values], (err, regData) => {
        if (err) return res.json({success : false})
        sendVerificationEmail(req.body.email, verificationToken)
        return res.json({success: true})
    })
    
})

async function sendVerificationEmail(email, verificationToken){
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'wp3deansofficetransaction@gmail.com',
            pass: 'ezoc sbde vuui qgqc'
        }
    })

    const verificationLink = `http://localhost:3000/verify/${verificationToken}`;
    const mailOptions = {
        from: 'wp3deansofficetransaction@gmail.com',
        to: email,
        subject: 'Verify Your Email',
        text: 'Email Verification Link',
        html: `Click <a href="${verificationLink}">here</a> to verify your email.`,
    };

    await transporter.sendMail(mailOptions)
}

app.get("/searchEmail", (req, res) => {
    const q = `SELECT * FROM users WHERE email = '${req.query.email}'`
    db.query(q, (err, data) => {
        if(err) return res.json({success : false})
        if(data.length > 0){
            return res.json({email : true, success : true})
        }else{
            return res.json({email : false, success : true})
        }
    })
})

app.get("/searchUsername", (req, res) => {
    const q = `SELECT * FROM users WHERE username = '${req.query.username}'`
    db.query(q, (err, data) => {
        if(err) return res.json({success : false})
        if(data.length > 0){
            return res.json({username : true, success : true})
        }else{
            return res.json({username : false, success : true})
        }
    })
})

app.post("/login", (req, res) =>{
    const q = `SELECT * FROM users WHERE username = '${req.body.username}' LIMIT 1`
    db.query(q, async(err, data) => {
        if (err) return res.json({success : false})
        if(data.length > 0){
            const passwordMatch = await bcrypt.compare(req.body.password, data[0].password); 
            if (!passwordMatch){
                return res.status(200).json({pass: false, userExist: true})
            }else{
                if(data[0].verified == 0){
                    return res.status(200).json({pass: true, userExist: true, verified: false})
                }
                else if(data[0].verified == 1){
                    req.session.userID = data[0].UID
                    return res.status(200).json({pass: true, userExist: true, verified: true})
                }
            }
        }
        else{
            return res.status(200).json({userExist: false})
        }
    })
})

app.get("/getUser", async(req, res) => {
    if(req.session.userID){
        let cols = [req.session.userID]
        const q = `SELECT * FROM users WHERE UID = '${cols}' LIMIT 1`
        db.query(q, (err, data) => {
            if (err) return res.json({success : false})
            return res.status(200).json(data)
        })
    }else{
        return res.status(401).json({ success: false });
    }
})

app.post("/logout", (req, res) => {
    if(req.session.userID){
        req.session.destroy()
        return res.json({ success: true });
    }else{
        return res.json({ success: false });
    }
})


app.listen(8800, () => { 
    
})