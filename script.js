
const userName = "AP-"+ Math.floor(Math.random() *10000);
const password = "x";

document.getElementById('user-name').innerHTML = userName;

const socket = io.connect('https://localhost:8181/',{
    auth: {
        userName ,
        password
    }
});

const localVideoEl = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video')



let localStream;
let remoteStream;
let peerConnection
let didIOffer = false;

let peerConfiguration = {
    iceServers:[
        {
            urls:[
              'stun:stun.l.google.com:19302',
              'stun:stun1.l.google.com:19302'
            ]
        }
    ]
};


// *************** GOOGLE STUN SERVER LIST**************

//     { urls: "stun:stun.l.google.com:19302" },
//     { urls: "stun:stun.l.google.com:5349" },
//     { urls: "stun:stun1.l.google.com:3478" },
//     { urls: "stun:stun1.l.google.com:5349" },
//     { urls: "stun:stun2.l.google.com:19302" },
//     { urls: "stun:stun2.l.google.com:5349" },
//     { urls: "stun:stun3.l.google.com:3478" },
//     { urls: "stun:stun3.l.google.com:5349" },
//     { urls: "stun:stun4.l.google.com:19302" },
//     { urls: "stun:stun4.l.google.com:5349" }



const createPeerConnection = ( ) => {

    return new Promise(async(resolve,reject) => {

        peerConnection = await new RTCPeerConnection(peerConfiguration);

        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track,localStream);
        })

        peerConnection.addEventListener('icecandidate', ( e ) => {
            console.log("ice candidate found ........!!!!");
            console.log(e);

            if(e.candidate){
                socket.emit('sendIceCandidatesToServer',  {
                    iceCandidates: e.candidate,
                    iceUserName: userName,
                    didIOffer,


                });
            }


        })
        resolve();
    });


};


const call = async( e ) => {

    const stream = await navigator.mediaDevices.getUserMedia({
        video:true
    });
    
    localVideoEl.srcObject = stream;
    localStream = stream;

    await createPeerConnection();

    try {
        
        console.log("creating a offer");
        const offer = await peerConnection.createOffer();
        console.log(offer);

        peerConnection.setLocalDescription(offer);
        didIOffer = true;
        socket.emit('newOffer',offer);

    } catch (error) {
        console.log(error.message);
    }


}

const answerOffer = ( offerObj ) => {

    console.log(offerObj);

}


document.getElementById('call').addEventListener('click',call);










