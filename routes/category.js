const express = require('express');
const mongoose = require('mongoose');
const router=express.Router();
const middleware=require('../middleware/tokencheck.js');
const User = mongoose.model("User");
const post=mongoose.model("Post");
const category=mongoose.model("Category");

router.get('/allcategories',middleware,(req,res)=>{
  category.find({user:req.user._id}).
  populate("user").
  then(files=>{
    if(files.length)
    res.send(files)
    
  }).catch(err=>{console.log(err);});
})

router.post('/addcategory',middleware,(req,res)=>{
  const {name,description}=req.body;
console.log(req.body);
  if(!name)
  return res.status(404).json({error:"fill all required fields"});
  //req.user.password=undefined;
  const p=new category(
    {
      name,description,
      user:req.user
    }
  );
  p.save()
  .then(file=>{res.send(file)})
  .catch(err=>{console.log(err);});

})


module.exports=router
