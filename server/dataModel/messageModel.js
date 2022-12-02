class message {
    constructor(from,to,req,res,reply,data){
        this.from = from
        this.to = to
        this.req = req
        this.res = res
        this.reply = reply
        this.data = data
    }
}
module.exports = message;
