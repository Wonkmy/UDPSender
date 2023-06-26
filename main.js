var dgram =require("dgram")
const server = dgram.createSocket('udp4')

class UserInfo{
    constructor(userId,userName,userPwd){
        this.userId=userId;
        this.userName=userName;
        this.userPwd=userPwd;
    }
}

const allUserList=[]

server.on('error',(err)=>{
    console.log(err);
})

server.on('listening',()=>{
    const address = server.address()
    console.log(`server listening ${address.address} on ${address.port}`)
})

server.on('message',(msg,rinfo)=>{
    console.log(rinfo.address+":"+rinfo.port+"="+msg);
    let loginData = JSON.parse(msg);
    if(loginData.reqId==0)//登陆请求id
    {
        console.log("请求id是0");
        if(allUserList.length>0){
            allUserList.forEach(user => {
                if(loginData.userName==user.userName){//说明列表中有此用户
                    console.log("有");
                    if(loginData.userPwd==user.userPwd){//用户名密码正确
                        //准备发送一个登陆成功的消息
                        server.send(JSON.stringify({resId:0,resultCode:1}),rinfo.port,rinfo.address)
                    }
                }else{
                    console.log("没有");
                    let userInfo=new UserInfo(loginData.userId,loginData.userName,loginData.userPwd);
                    allUserList.push(userInfo)
                    //创建完之后，发送一个登陆成功的消息
                    server.send(JSON.stringify({resId:0,resultCode:1}),rinfo.port,rinfo.address)
                }
            });
        }
        else{
            let userInfo=new UserInfo(loginData.userId,loginData.userName,loginData.userPwd);
            allUserList.push(userInfo)
            //创建完之后，发送一个登陆成功的消息
            server.send(JSON.stringify({resId:0,resultCode:1}),rinfo.port,rinfo.address)
        }
    }
})

server.bind(9527)