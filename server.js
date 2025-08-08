const https = require("https")
const fs = require("fs");
const express = require("express");

const app = express();
const socketIo = require("socket.io");
app.use(express.static(__dirname));

const key = fs.readFileSync('cert.key');
const cert = fs.readFileSync('cert.crt');

const expressServer = https.createServer({key,cert},app);
const io = socketIo(expressServer);


expressServer.listen(8181,()=>{
    console.log("server is live on port 8181");
})


io.on('connection' ,(socket) => {

    console.log(`a user has connected to the server with id: ${socket.id}`);



})





