const { ObjectID } = require('bson');
const mongoose = require('mongoose');
const Schema = mongoose.Schema
var message_schema = new Schema(
    {
        speaker:{
            type:String
        },
        message:{
            type:String
        },
        update_time:{
            type:Date
        }
    }
)
message_schema.pre('save',(next)=>{
    var user = this
    this.update_time = Date.now();
})

module.exports = mongoose.model("chatMessage",message_schema,"chatMessage");