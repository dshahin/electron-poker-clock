//setup the database
var sql = require('sql.js');
var fs = require('fs');
var filebuffer = fs.readFileSync('./test.sqlite');

var db = new sql.Database(filebuffer);
// Execute some sql
sqlstr = "CREATE TABLE  if not exists hello (a int, b char);";
sqlstr += "INSERT INTO hello VALUES (0, 'hello');"
sqlstr += "INSERT INTO hello VALUES (1, 'world');"
db.run(sqlstr); // Run the query without returning anything

var res = db.exec("SELECT * FROM hello");
console.log(res);
var data = db.export();
var buffer = new Buffer(data);
fs.writeFileSync("test.sqlite", buffer);
