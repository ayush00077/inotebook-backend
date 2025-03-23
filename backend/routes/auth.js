const express = require('express')
const router=express.Router()
const User=require('../models/User')//.. shows we need to go back to directories first into models then in to users
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser=require("../middleware/fetchuser")


const jwtSecret="heyayuhs"
//route 1:
router.post( '/createuser',[   //here the endpoint is '/' only 
body('name').isLength({min:3}),
body('email','enter a valid email').isEmail(),
body('password','password is incorrect').isLength({min:5}),
    ],async (req,res)  =>{

    //if there are errors return bad request and errors
     const errors=validationResult(req)
     if(!errors.isEmpty())
     {
        return res.status(400).json({errors:errors.array()})
     }
     try
     {
     //check whether the user with this emial already exist
     let user=await User.findOne({email:req.body.email})
     if(user)
     {
        return res.status(400).json({error:"sry a user with this mail already exist"})
     }

     const salt= await bcrypt.genSalt(10)
     const secPass=await bcrypt.hash(req.body.password,salt)
     //create a new user
     user = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:secPass
     })

     const data={
        user:{
            id:user.id
        }
     }
    const authtoken=jwt.sign(data,jwtSecret)
     res.json({authtoken:authtoken})
    }
    catch(error)
    {
        console.error(error.message);
        res.status(500).send("some error occured")
    }
     
})
//route2:
 //authenticate a new user using '/api/auth/login"
 router.post( '/login',
       [
        body('email','enter a valid email').isEmail(),
        body('password','password cannot be blank').exists()
       ],async (req,res)  =>{

        //if there are errors return bad request and errors
     const errors=validationResult(req)
     if(!errors.isEmpty())
     {
        return res.status(400).json({errors:errors.array()})
     }
     const{email,password}=req.body
     try 
     {
        let user= await User.findOne({email})
        if(!user)
        {
            return res.status(400).json({error:"please try valid credentials"})
        }
        console.log("user",user)

        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare)
        {
            return res.status(400).json({error:"please try valid credentials"})
        }

        const data=
        {
            user:
            {
                id:user.id
            }
         }
        const authtoken=jwt.sign(data,jwtSecret)
        res.json({authtoken:authtoken})  
     } catch (error) 
     {
        console.error(error.message);
        res.status(500).send("some error occured")  
     }
    })
    
    // route 3:get loggedin user deatils using post '/api/auth/getuser . login is required"
    router.post( '/getuser',fetchuser,async (req,res)  =>
    {

    try 
    {
        userId =req.user.id
        const user =await User.findById(userId).select("-password") 
        res.send(user)  
    } 
    catch (error) 
    {
       console.error(error.message);
       res.status(500).send("some error occured")  
    }

})
module.exports=router
   