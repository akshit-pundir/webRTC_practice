
const localVideoEl = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video')



let localStream;
let remoteStream;
let peerConnection



const call = async( e ) => {

    const stream = await navigator.mediaDevices.getUserMedia({
        video:true
    });
    
    localVideoEl.srcObject = stream
}



document.getElementById('call').addEventListener('click',call);
