const mongoose =require('mongoose');
const {ObjectId}= mongoose.Schema.Types;
const postSchema=new mongoose.Schema(
  {
    name:{type:String,required:true},
    description:{type:String},
    category:{type:String},
    tags:[{value:String,label:String}],
    completed: {type: Boolean,default: false},
	  date: {type: Date,default: () => Date.now()},
    dueDate:{type: Date,default: () => Date.now()},
    user:{type:ObjectId,ref:"User"},

  }
)
mongoose.model("Post",postSchema);
