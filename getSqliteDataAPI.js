var express = require('express');
var path = require("path");
var app =express();

var SqliteDB = require('./sqliteApi').SqliteDB;
var file = "./dbs/platformgame.db";
var sqliteDB = new SqliteDB(file);

app.listen(3000,()=>{
    console.log(' running on port 3000');
});

app.use("/",express.static(path.join(process.cwd(),"www_root")));

app.get('/users', function(req, res){
    //console.log('get users');
    // res.json({message:'hello word'});
    res.send('hello get users')
})
app.get('/getItem', (req, res) => {
    var querySql = 'select * from '+req.query.tableName;
    sqliteDB.queryData(querySql, (obj) => {
        for (let i = 0; i < obj.length; i++) {
            if (req.query.itemId == obj[i].itemId) {
                console.log("查询到item了");
                res.json({itemId: req.query.itemId,itemName: obj[i].itemName,itemDes: obj[i].itemDes,itemRefine: obj[i].itemRefine})
                break;
            } else {
                res.send("没有查到id为" + req.query.itemId + "的item" )
            }
            return
        }
    });
})

app.get('/',(req,res)=>{
    res.send('<h1>hello world</h1>')
})