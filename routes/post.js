const express = require('express');
const mongoose = require('mongoose');
const router=express.Router();
const middleware=require('../middleware/tokencheck.js');
const User = mongoose.model("User");
const post=mongoose.model("Post");

router.get('/myposts',middleware,(req,res)=>{
  post.find({user:req.user._id}).
  populate("user","image").
  then(files=>{
    if(files.length)
    res.send(files)

  }).catch(err=>{console.log(err);});
})

router.post('/post',middleware,(req,res)=>{
  const {name,category,tags,completed,descrption,date,dueDate}=req.body;

console.log(req.body);
  if(!name)
  return res.status(404).json({error:"fill all required fields"});
  req.user.password=undefined;
  const p=new post(
    {
      name,category,tags,completed,descrption,date,dueDate,
      user:req.user
    }
  );
  p.save()
  .then(file=>{res.send(file)})
  .catch(err=>{console.log(err);});

})


router.put('/updatepost',middleware,(req,res)=>{
  /*console.log(JSON. parse(req.body.tags));
  req.body.user=req.user;
  let postsEg=new post(
    {
      name:req.body.name,
      _id:req.body._id,
      tags:JSON. parse(req.body.tags),
      user:req.user
    }
  );
  console.log(postsEg);*/
  post.findByIdAndUpdate(req.body._id,req.body).exec((err,result)=>{
    if(err){
      return res.status(444).json({error:err});
    }else
    res.send(result);
  })

})

router.put('/editadd',middleware,(req,res)=>{
  post.findByIdAndUpdate(req.body.postId,{
    $push:{tag:req.body.tag}
  },{
    new:true
  }).exec((err,result)=>{
    if(err){
      return res.status(444).json({error:err});
    }else
    res.send(result);
  })

})

router.put('/editdelete',middleware,(req,res)=>{
  post.findByIdAndUpdate(req.body.postId,{
    $pull:{tag:req.body.tag}
  },{
    new:true
  }).exec((err,result)=>{
    if(err){
      return res.status(444).json({error:err});
    }else
    res.send(result);
  })

})

router.put('/deletepost',(req,res)=>{
  post.findById(req.body.postId)
  .populate("user","_id")
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
