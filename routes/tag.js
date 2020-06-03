const express = require('express');
const mongoose = require('mongoose');
const router=express.Router();
const middleware=require('../middleware/tokencheck.js');
const User = mongoose.model("User");
const post=mongoose.model("Post");
const category=mongoose.model("Category");
const tag=mongoose.model("Tags");

router.get('/alltags',middleware,(req,res)=>{
  tag.find({user:req.user._id}).
  populate("user").
  then(files=>{
    if(files.length)
    res.send(files)

  }).catch(err=>{console.log(err);});
})

router.post('/addtag',middleware,(req,res)=>{
  const {name,description}=req.body;
console.log(req.body);
  if(!name)
  return res.status(404).json({error:"fill all required fields"});
  //req.user.password=undefined;
  const p=new tag(
    {
      name,description,
      user:req.user
    }
  );
  p.save()
  .then(file=>{res.send(file)})
  .catch(err=>{console.log(err);});

})

router.put('/deleteTag',(req,res)=>{
  tag.findById(req.body.TagId)
  .exec((err,result)=>{
    if(err){
      return res.status(444).json({error:err});
    }else
      {
        if(result)
        {
        res.send(result);result.remove();
        }

      }
  })

})


module.exports=router
