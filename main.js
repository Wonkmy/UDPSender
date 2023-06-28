var dgram =require("dgram")
const server = dgram.createSocket('udp4')

var SqliteDB = require('./sqliteApi').SqliteDB;
var file = "./dbs/platformgame.db";
var sqliteDB = new SqliteDB(file);

server.on('error',(err)=>{
    console.log(err);
})

server.on('listening',()=>{
    const address = server.address()
    console.log(`server listening ${address.address} on ${address.port}`)
})

server.on('message',(msg,rinfo)=>{
    let receiveData = JSON.parse(msg);
    if(receiveData.reqId==0)//请求id,每个请求的数据都会有一个请求id,这个请求id是登录的请求id
    {
        var querySql = 'select * from user_data';
        sqliteDB.queryData(querySql, (obj)=>{
            let a=0;
            for (let i = 0; i < obj.length; i++) {
                if(receiveData.userId==obj[i].userId){
                    if(receiveData.userName==obj[i].userName){
                        console.log("已经有用户了,他的地址和端口为：\n"+rinfo.address+":"+rinfo.port);
                        if(receiveData.userPwd==obj[i].userPwd){
                            
                            console.log(receiveData.userName+":登陆成功\n详细信息为:"+msg);
                            server.send(JSON.stringify({resId:0,resultCode:1,msg:"登陆成功"}),rinfo.port,rinfo.address)
                        }else{
                            server.send(JSON.stringify({resId:0,resultCode:-1,msg:"密码错误"}),rinfo.port,rinfo.address)
                        }
                    }else{
                        server.send(JSON.stringify({resId:0,resultCode:-1,msg:"用户名错误"}),rinfo.port,rinfo.address)
                    }
                    return
                }else{
                    a++
                }
            }
            if (a >= obj.length) {
                console.log("新用户");
                var tileData = [[receiveData.userId, receiveData.userName, receiveData.userPwd]];
                var insertTileSql = "insert into sharewaf_data(userId, userName, userPwd) VALUES(?,?,?)";
                sqliteDB.insertData(insertTileSql, tileData);
                server.send(JSON.stringify({ resId: 0, resultCode: 1 }), rinfo.port, rinfo.address)
            }
        });
    }

    if(receiveData.reqId==1){//这个请求id是获取某item的请求id
        var querySql = 'select * from Items';
        sqliteDB.queryData(querySql, (obj)=>{
            for (let i = 0; i < obj.length; i++) {
                if (receiveData.itemId == obj[i].itemId) {
                    console.log("查询到item了");
                    server.send(JSON.stringify({ resId: 1, resultCode: 1, msg: "获得item成功!",itemCount:receiveData.itemCount,itemId:obj[i].itemId,itemName:obj[i].itemName,itemDes:obj[i].itemDes }), rinfo.port, rinfo.address)
                    return
                }else{
                    server.send(JSON.stringify({ resId: 1, resultCode: -1, msg: "没有查到id为"+receiveData.itemId+"的item" }), rinfo.port, rinfo.address)
                }
            }
        });
    }
})

server.bind(9527)