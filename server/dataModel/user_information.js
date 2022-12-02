const { ObjectID } = require('bson');
const mongoose = require('mongoose');
const Schema = mongoose.Schema
const { functionsIn } = require('lodash');
var crypto =require('crypto');
//一般函数
function hashs(password){
    var md5 = crypto.createHash('md5')
    var passwords = md5.update(password).digest('hex')
    return passwords;
}
var salt = 114514

var permission_schema = new Schema({
    
    can_login:{
        type:Boolean, 
        default:true
    },

    can_speak_public_chatroom:{
        type:Boolean, 
        default:true
    },
    can_visit_public_chatroom:{
        type:Boolean, 
        default:true
    }
})
var user_schema = new Schema({
    user_id:{
        type:String,
        unique:true
    },
    user_age:{
        type:Number,
        default:null
    },
    user_name:{
        type:String,
        default:null,
        unique:true
    },
    user_password:{
        type:String,
        default:null
    },
    user_phone:{
        type:String,
        default:null
    },
    user_permission:{
        type:permission_schema
    },
    meta:{
        createTime:{
            type:Date,
            default:Date.now()
        },
        updateTime:{
            type:Date,
            default:Date.now()
        }
    }
})
var permissionModel = mongoose.model("permission_schema",permission_schema);

user_schema.pre('save',async function(next){
    var user = this
    if(this.isNew)
    {
        this.createTime = this.updateTime = Date.now()
        this.user_permission = new permissionModel();
    }
    this.updateTime = Date.now()
    this.user_password = hashs(hashs(this.user_password))
    next()
})

user_schema.methods = {
    comparePassword: async function(password)
    {
        var a = this.user_password;
        var b = hashs(hashs(password))
        return a==b;
    }
}

module.exports = mongoose.model("userImformation",user_schema,"userImformation");