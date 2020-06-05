const express = require('express');
const { MessagingResponse } = require('twilio').twiml;
const http = require('https');
const mongoose = require('mongoose');
const fs = require('fs');
const axios = require('axios')
const router = express.Router();
const bodyParser = require('body-parser');
var request = require('request');
var unirest = require('unirest');
const User = mongoose.model("User");
const post=mongoose.model("Post");
var urlencodedParser = bodyParser.urlencoded({ extended:false })




router.post('/whatsapp', async (req, res) => {
  let message;
   //console.log(req.body.From);
   res.set('Content-Type', 'text/xml');
   User.findOne({mobileNo:req.body.From}).
   then((file)=>{
     //console.log(file);
      if(!file)
   {
     message = new MessagingResponse().message('Yet to register');
     res.send(message.toString()).status(200);
   }
      if(req.body.Body)
   {
     const reply='"'+req.body.Body+'"'+"added to list.Now you can update the task in Web Application";
     //console.log(reply);
     message = new MessagingResponse().message(reply);
     const p=new post(
       {
         name:req.body.Body,
         user:file
       }
     );
     p.save();
     res.send(message.toString()).status(200);
   }
      if(req.body.MediaUrl0)
   {
     //console.log(req.body.MediaUrl0);
     request(req.body.MediaUrl0).pipe(fs.createWriteStream('Voice_Message.ogg'))
     .on('error', () => {
     console.log('ERROR');
     message = new MessagingResponse().message('Something went wrong...Please try later');
     res.send(message.toString()).status(200);
   })
   .on('finish', () => {
     unirest
         .post('https://recognition.voicybot.com/recognize/Wit')
         .headers({'Content-Type': 'multipart/form-data'})
         .field('key','BHH56KIGVSKELNOZNHTWRYRVQTIEIEC2')
         .attach({'file':'Voice_Message.ogg',})
         .then((response) => {
           console.log(response.body);
           var text=response.body.text;
           const p=new post(
             {
               name:text,
               user:file
             }
           );
           p.save();
           const reply='"'+text+'"'+"added to list.Now you can update the task in Web Application";
           message = new MessagingResponse().message(reply);
           res.send(message.toString()).status(200);
         })
         .catch(e=>{
           message = new MessagingResponse().message('Something went wrong...Please try later');
           res.send(message.toString()).status(200);
         });
   });
   }


 }).catch(err=>{console.log(err);});


});

module.exports = router;
