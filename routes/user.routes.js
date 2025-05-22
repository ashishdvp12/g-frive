const express=require('express');
const router=express.Router();
const userModel=require('../models/user.model');

const { body, validationResult} = require('express-validator');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.get('/register',
    
     (req, res) => {
    res.render('register');
})
router.post('/register',body('email').trim().isEmail(),
    body('username').trim().isLength({min:3}),
    body('password').trim().isLength({min:5}), async (req, res) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
       return res.status(400).json({
        errors: errors.array(),
        message:"invalid data"
       });
        
    }
    const {username, email, password}=req.body;
    const hashedPassword=await bcrypt.hash(password, 10);
    const newUser= await userModel.create({
        username,
        email,
        password:hashedPassword
    });

res.json(newUser);
})

router.get('/login', (req, res) => {
    res.render('login');
})
router.post('/login',
    body('username').trim().isLength({min:5}),
    body('password').trim().isLength({min:5}),
    async (req, res) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            error: errors.array(),
            message:"invalid data"
        });
    }
    const {username, password}=req.body;
    const user=await userModel.findOne({username});
    if(!user){
        return res.status(400).json({
            message:"invalid username or password"
        });
    }
    const isMatch=await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({
            message:"invalid username or password"
        })
        
    }
    const token=jwt.sign({userId:user._id,
        username:user.username,
        email:user.email,
        


    }, process.env.JWT_SECRET, {expiresIn:'1h'});
    res.cookie('token', token) 
        res.redirect('/home');
}
)

module.exports=router;