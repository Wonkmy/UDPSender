var dgram =require("dgram")
const server = dgram.createSocket('udp4')
const allClient=[]
const allBall=[]

server.on('error',(err)=>{
    console.log(err);
})

server.on('listening',()=>{
    const address = server.address()
    console.log(`server listening ${address.address} on ${address.port}`)
})

server.on('message',(msg,rinfo)=>{
    var pose=JSON.parse(msg);
    if(pose.dataType=="new_ball"){//收到一个type为0的消息，则开始生成ball   此逻辑只走一次
        allClient.push(rinfo);//并将当前客户端的信息保存到列表中
        allClient.forEach(client => {
            server.send(JSON.stringify({ballId:pose.ballId,resultCode:"can_create_ball",count:allClient.length}),client.port, client.address)
        });
    }
    if(pose.dataType=="update_ball_pos"){
        allClient.forEach(client => {
            server.send(JSON.stringify({ballId:pose.ballId,resultCode:"can_update_ball_pos",pos:pose.pos,rot:pose.rot,count:allClient.length}),client.port, client.address)
        });
    }
})

server.bind(9527)