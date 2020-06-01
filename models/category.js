const mongoose =require('mongoose');
const {ObjectId}= mongoose.Schema.Types;
const categorySchema=new mongoose.Schema(
  {
    name:{type:String,required:true},
    description:{type:String},
	  date: {type: Date,default: () => Date.now()},
    user:{type:ObjectId,ref:"User"},

  }
)
mongoose.model("Category",categorySchema);
