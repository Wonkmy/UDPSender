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
    let loginData = JSON.parse(msg);
    if(loginData.reqId==0)//请求id,每个请求的数据都会有一个请求id
    {
        var querySql = 'select * from sharewaf_data';
        sqliteDB.queryData(querySql, (obj)=>{
            let a=0;
            for (let i = 0; i < obj.length; i++) {
                if(loginData.userId==obj[i].userId){
                    if(loginData.userName==obj[i].userName){
                        console.log("已经有用户了,他的地址和端口为：\n"+rinfo.address+":"+rinfo.port);
                        if(loginData.userPwd==obj[i].userPwd){
                            
                            console.log(loginData.userName+":登陆成功\n详细信息为:"+msg);
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
                var tileData = [[loginData.userId, loginData.userName, loginData.userPwd]];
                var insertTileSql = "insert into sharewaf_data(userId, userName, userPwd) VALUES(?,?,?)";
                sqliteDB.insertData(insertTileSql, tileData);
                server.send(JSON.stringify({ resId: 0, resultCode: 1 }), rinfo.port, rinfo.address)
            }
        });
    }
})

server.bind(9527)