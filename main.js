var dgram =require("dgram")
const server = dgram.createSocket('udp4')

server.on('error',(err)=>{
    console.log(err);
})

server.on('listening',()=>{
    const address = server.address()
    console.log(`server listening ${address.address} on ${address.port}`)
})

server.on('message',(msg,rinfo)=>{
    var requestType=JSON.parse(msg);
    // if(requestType.dataType=="new_ball"){//收到一个type为new_ball 消息
    //     allClient.push(rinfo);//并将当前客户端的信息保存到列表中
    //     exist=false
    //     allBall.forEach(ball => {
    //         if(ball.ballId==requestType.id){
    //             exist=true;
    //         }
    //     });
    //     if(exist)return;
    //     var ballData=new Ball(requestType.id,"can_create_ball",allClient.length)
    //     allBall.push(ballData)
    //     allClient.forEach(client => {
    //         server.send(JSON.stringify(ballData),client.port, client.address)
    //     });
    // }
    // if(requestType.dataType=="update_ball_pos"){
    //     for (let i = 0; i < allBall.length; i++) {
    //         if(allBall[i].ballId=requestType.id){
    //             server.send(JSON.stringify({ballId:requestType.id,resultType:"can_update_ball_pos",pos:requestType.pos,rot:requestType.rot,count:allClient.length}),allClient[i].port, allClient[i].address)
    //             return;
    //         }
    //     }
    // }
})

server.bind(9527)