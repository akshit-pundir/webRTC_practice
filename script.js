const socket = io.connect('https://localhost:8181/')





const localVideoEl = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video')



let localStream;
let remoteStream;
let peerConnection


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

    } catch (error) {
        console.log(error.message);
    }


}



document.getElementById('call').addEventListener('click',call);










