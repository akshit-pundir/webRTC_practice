
const userName = "AP-"+ Math.floor(Math.random() * 10000);
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



const createPeerConnection = ( offerObj ) => {

    return new Promise(async(resolve,reject) => {

        peerConnection = await new RTCPeerConnection(peerConfiguration);
        
        remoteStream = new MediaStream()
        remoteVideo.srcObject = remoteStream;


        // if(offerObj){
        //     remoteStream.getTracks().forEach(track => {
        //         peerConnection.addTrack(track,remoteStream);
        //     });
        // }else{

            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track,localStream);
            })

        // }

        peerConnection.addEventListener('signalingstatechange', ( e ) => {

            console.log(e);
            console.log(peerConnection.signalingState);


        })

        peerConnection.addEventListener('icecandidate', ( e ) => {
            console.log("ice candidate found ........!!!!");
            console.log(e);

            if(e.candidate){
                socket.emit('sendIceCandidatesToServer',{
                    iceCandidates: e.candidate,
                    iceUserName: userName,
                    didIOffer
                });
            }


        });

        peerConnection.addEventListener('track', e => {
            console.log("got a track from remote",e);

            e.streams[0].getTracks().forEach(track => {
                remoteStream.addTrack(track,remoteStream);
                console.log("Magic !!!!!!!!!!")
            })
        })


        if(offerObj){

        //   console.log("1-->",peerConnection.signalingState);  
          await peerConnection.setRemoteDescription(offerObj.offer);
        //   console.log("2-->",peerConnection.signalingState);  
        
        }
        resolve();
    });


};


const call = async( e ) => {

    await fetchUsermedia(false)    

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

const answerOffer = async( offerObj ) => {

    console.log("inside answer",offerObj);
    
    await fetchUsermedia(true);
    await createPeerConnection(offerObj)

    const answer = await peerConnection.createAnswer();
    console.log("answer is-->>>" ,answer);
    peerConnection.setLocalDescription(answer)
    // console.log("signaling state from answer",peerConnection.signalingState);

    offerObj.answer = answer;
    
    const offerIceCandidates = await socket.emitWithAck('newAnswer',offerObj);

    // console.log("icefrom answer",offerIceCandidates);

    offerIceCandidates.forEach(candidate => {
        peerConnection.addIceCandidate(candidate);
    })


};



const addAnswer = async(offerObj) => {
    
   await peerConnection.setRemoteDescription(offerObj.answer);

}



const addNewIceCandidate = (iceCandidate) => {

    peerConnection.addIceCandidate(iceCandidate)
    console.log("*************ice added**************")

}



function fetchUsermedia(remote){

    return new Promise(async(resolve,reject) => {
        try {
        
            const stream = await navigator.mediaDevices.getUserMedia({
            video:true
        });
        
            // if(remote){
            //     remoteVideo.srcObject = stream;
            //     remoteStream =stream

            // }else{
                localVideoEl.srcObject = stream;
                localStream = stream;    
            // }

            resolve();
        
        } catch (error) {
            console.log(error.message)
            reject();
        }
        
    });
    
}


document.getElementById('call').addEventListener('click',call);










