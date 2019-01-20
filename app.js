const http = require('http');
var express =require('express')
var app=express()

app.get('/',function(req,res){
    res.send("Hello World");
})
app.get('/myjavascript.js', function(req, res){
    var file = 'myjavascript.js';
    res.download(file); // Set disposition and send it.
});




const hostname = '127.0.0.1';
const port = 3000;


var server =app.listen(port, function(){
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})
