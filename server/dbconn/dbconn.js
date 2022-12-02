module.exports = app=>{
    const mongoose = require("mongoose");
    const url = "mongodb://uitstalie:dqc20010924@127.0.0.1:27017/chatRoom";
    var ok = false;
    
     mongoose.connect(url,{useNewUrlParser: true},function(err){
        if(err)
        {
            console.log("数据库连接失败："+err);s
        }
    });
    
    mongoose.connection.once('open',()=>{
            console.log('数据库连接成功');
    })
    
    mongoose.connection.once('close',()=>{
        console.log('数据库断开，不确定是否为意外断开');
    })
}
    