const express = require('express');
var bodyParser = require('body-parser');
const PORT=process.env.PORT || 5000;
var cors = require('cors')
const app=express();
app.use(cors())
const mongoose = require('mongoose');
//WECuWQlF0UKDYxTD
const key="mongodb+srv://shobha:anything@cluster0-txj5t.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(key,{
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('connected',()=>{
  console.log('connected');
})
mongoose.connection.on('error',()=>{
  console.log('error');
})
require('./models/user.js');
require('./models/post.js');
require('./models/category.js');
require('./models/tag.js');
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(require('./routes/auth.js'));
app.use(require('./routes/post.js'));
app.use(require('./routes/imageupload.js'));
app.use(require('./routes/category.js'));
app.use(require('./routes/tag.js'));
app.use(require('./routes/whatsapp.js'));

app.get('/',(req,res)=>{
  res.send('hello');
});

app.listen(PORT,()=>{
  console.log('listening');
});
