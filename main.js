var dgram =require("dgram")
const server = dgram.createSocket('udp4')

var SqliteDB = require('./sqliteApi').SqliteDB;
var file = "./dbs/userinfo.db";
var sqliteDB = new SqliteDB(file);

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
    if(loginData.reqId==1)//请求id,每个请求的数据都会有一个请求id
    {
        var querySql = 'select * from sharewaf_data';
        sqliteDB.queryData(querySql, (obj)=>{
            if(loginData.userId==obj[0].userId){
                console.log("已经有用户了");
                if(loginData.userPwd==obj[0].userPwd)//密码正确
                {
                    if(loginData.userName==obj[0].userName){
                        server.send(JSON.stringify({resId:0,resultCode:1,msg:"登录成功"}),rinfo.port,rinfo.address)
                    }else{
                        server.send(JSON.stringify({resId:0,resultCode:-1,msg:"用户名错误"}),rinfo.port,rinfo.address)
                    }
                }else{
                    
                    server.send(JSON.stringify({resId:0,resultCode:-1,msg:"密码错误"}),rinfo.port,rinfo.address)
                }
            }else{
                console.log("新用户");
                var tileData = [[loginData.userId, loginData.userName, loginData.userPwd]];
                var insertTileSql = "insert into sharewaf_data(userId, userName, userPwd) VALUES(?,?,?)";
                sqliteDB.insertData(insertTileSql, tileData);
                server.send(JSON.stringify({resId:0,resultCode:1}),rinfo.port,rinfo.address)
            }
        });
    }
})

server.bind(9527)