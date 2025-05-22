const express=require('express');
const app=express();
const dotenv=require('dotenv');
const cookieParser=require('cookie-parser');
app.use(cookieParser());
dotenv.config();
const connectTodb= require('./config/db');
connectTodb();
const {storage, cloudinary}=require('./config/cloudinary');
const multer=require('multer');
const indexRouter=require('./routes/index.routes');
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));


const userRouter=require('./routes/user.routes');
app.use('/',indexRouter);

app.use('/user',userRouter);

app.listen(3000);