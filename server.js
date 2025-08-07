const express = require("express");

const app = express();



app.use(express.static(__dirname));





app.listen(8181,()=>{
    console.log("server is live on port 8181");
})






