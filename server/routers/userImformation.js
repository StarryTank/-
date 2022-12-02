const uuid = require('uuid');
const { ObjectID } = require('bson');
var express = require('express')
var router = express.Router();
var User = require('../dataModel/user_information.js')
var utils = require('../dataModel/util.js');
var util = new utils();
var messages = require('../dataModel/messageModel.js')

//消息体创建
function createMessage(from,to,req,res,reply,data = null){
    var msgs = new messages(from,to,req,res,reply,data);
    return JSON.stringify(msgs);
}

//中间件
function checkRequest(req,res,next){
    if(!req.body)
    {
        var msg = createMessage(util.server,util.client,util.request,util.response,util.error,util.reqBodyEmpty)
        res.send(msg)
        throw(msg)
    }
    next();
    
}
function checkEmptyWhenLogReg(req,res,next){

    if(!req.body["user_name"]||!req.body["user_password"])
    {
        var msg = createMessage(util.server,util.client,res,util.error,util.name_password_empty_error)
        res.send(msg)
        throw(msg)
    }
    next();
    
}




//路由



router.get('/', function (req, res) {
    //res.send("please login first");

    var query = User.find();
    query.lean().exec((err,docs)=>{
        if(err) 
        {
            res.send(err);
        }
        else
        {
            res.send(docs);
        }
    })
})
router.get("/init",(req,res)=>{
    User.findOne({"user_name":req.body["user_name"]} ,async (queryerr, docs) => {
        if (queryerr) {
            var msg = createMessage(util.server,util.client,util.initRequest,util.initResponse,util.error,util.queryerr)
            res.send(msg);
        }
        else if(!docs)
        {
            var msg = createMessage(util.server,util.client,util.initRequest,util.initResponse,util.error,util.querryEmpty)
            res.send(msg);
        }
        else
        {
            var msg = createMessage(util.server,util.client,util.initRequest,util.initResponse,util.success,docs._doc)
        }
    })
})
router.post('/login',[checkRequest,checkEmptyWhenLogReg],async (req,res) =>{
    User.findOne({"user_name":req.body["user_name"]} ,async (queryerr, docs) => {
    if (queryerr) {
        var msg = createMessage(util.server,util.client,util.loginRequest,util.loginSuccess,util.error,util.queryerr)
        res.send(msg);
    }
    else {
        if(!docs)
        {
            var msg = createMessage(util.server,util.client,util.loginRequest,util.loginSuccess,util.error,util.namePasswordError)
            res.send(msg);
        }
        else
        {
            var ans = docs.comparePassword(req.body["user_password"])
            if(ans)
            {
                var msg = createMessage(util.server,util.client,util.loginRequest,util.loginResponse,util.success,util.loginSuccess)
                res.send(msg);
            }
            else
            {
                var msg = createMessage(util.server,util.client,util.loginRequest,util.loginResponse,util.error,util.namePasswordError)
                res.send(msg);

            }
        }
    }
    })        
})


router.post('/register',[checkRequest,checkEmptyWhenLogReg],(req,res) =>{
    req.body["user_id"] = uuid.v4();
    var newuser = new User(req.body);
    newuser.save((err, docs) => {
        if (err) {
            var msg = createMessage(util.server,util.client,util.registerRequest,util.registerResponse,util.error,util.registerError)
            res.send(msg);
            }
        else {
            var msg = createMessage(util.server,util.client,util.registerRequest,util.registerResponse,util.success,util.registerSuccess)
            res.send(msg);
        }
    });
})

router.post("/updateInformation",[checkRequest],async (req,res)=>{
    var user_id = req.body["user_id"]
    var query = User.findOne({"user_id":user_id});
    query.lean().exec(async (err,docs)=>{
    if(err)
    {
        sendMessage("8223172"+"010","数据库查询失败",req.body,req,res)
    }
    else
    {
        var msg = createMessage(util.server,util.client,req,res,docs)
            res.send(msg);
    }
    })
})

router.post("/information/update",[checkRequest],async (req,res)=>{
    var test = req.body;
    var newset = test["address"][0]
    User.updateMany({userID:test.userID},{"$set":{address:[newset]}},async (err,doc)=>{
        if(err)
        {
            sendMessage("2306647"+"100","地址更新失败",req.body,req,res)
        }
        else
        {
            getimformation(test.userID,req,res)
        }
    })
})

module.exports = router;
