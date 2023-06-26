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
})

server.bind(9527)