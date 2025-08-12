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

const offers = [];
const connectedSockets = [];




io.on('connection' ,(socket) => {

    // console.log(`a user has connected to the server with id: ${socket.id}`);
    const userName = socket.handshake.auth.userName;
    const password = socket.handshake.auth.password;

    connectedSockets.push({
        socketId: socket.id,
        userName
    });

    if(offers.length){
        socket.emit('availableOffers',offers);
    }
    
    socket.on('newOffer', (newOffer) => {

            offers.push({
                offererUserName: userName,
                offer: newOffer,
                offerIceCandidates: [],
                answerUserName: null,
                answer: null,
                answerIceCandidates: []
            });
            //  console.log(newOffer);   
            socket.broadcast.emit('newOfferAwaiting',offers.slice(-1));
        })

    socket.on('sendIceCandidatesToServer', iceCandidateObj => {

        const { didIOffer, iceCandidates, iceUserName } = iceCandidateObj;

        if(didIOffer){
            const offerInOffers = offers.find( data => data.offererUserName === iceUserName) ;

            if(offerInOffers){
                offerInOffers.offerIceCandidates.push(iceCandidates);
            }

        }

        console.log(offers);
    })    


})





