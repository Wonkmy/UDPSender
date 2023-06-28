// var sqlite3 = require("sqlite3").verbose();

// var database = new sqlite3.Database("./dbs/userinfo.db", function (err) {
//   if (err) {
//     console.log("database error,", err.message);
//   } else {
//     console.log("database success!!");
//     //创建表
//     database.run("create table if not exists sharewaf_data(userId NUMERIC, userName TEXT, userPwd TEXT)", function (err) {
//       if (err) {
//         console.log("create database error,", err.message);
//       } else {
//         console.log("create database success");

//         //插入数据
//         database.run("insert into sharewaf_data(userId, userName, userPwd) VALUES(?,?,?)", ["00001", "wonkmy", "123456"], function (err) {
//           if (err) {
//             console.log("insert data error,", err.message);
//           } else {
//             console.log("insert data success");

//             //查询
//             database.all("select * from sharewaf_data", function (err, rows) {
//               if (err) {
//                 console.log("select from sharewaf_data error,", err.message);
//               } else {
//                 console.log(rows);
//               }
//             });
//           }
//         });
//       }
//     });
//   }
// })
console.log();
var SqliteDB = require('./sqliteApi').SqliteDB;
var file = "./dbs/platformgame.db";
var sqliteDB = new SqliteDB(file);

//创建表
// var createTileTableSql = "create table if not exists user_data(userId NUMERIC, userName TEXT, userPwd TEXT);";
// sqliteDB.createTable(createTileTableSql);

// 插入数据
// var tileData = [["1", "wonkmy", "123456"]];
// var insertTileSql = "insert into user_data(userId, userName, userPwd) VALUES(?,?,?)";
// sqliteDB.insertData(insertTileSql, tileData);

// 查询数据 
var querySql = 'select * from user_data';
sqliteDB.queryData(querySql, dataDeal);

function dataDeal(objects){
  console.log(objects);
}

/// update data.
// var updateSql = 'update user_data set level = 2 where level = 1';
// sqliteDB.executeSql(updateSql);