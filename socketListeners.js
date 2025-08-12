

socket.on('availableOffers', (offers) => {

    console.log("available Offers",offers);
    createOfferEls(offers);

})

socket.on('newOfferAwaiting',(offers)=>{

     createOfferEls(offers);   


})


function createOfferEls(offers){

    const answerEl = document.getElementById('answer');
    offers.forEach( offer => {

            console.log(offer);
            const newOfferEl = document.createElement('div');
            newOfferEl.innerHTML = `<button class=' btn btn-success col-1'>Answer ${offer.offererUserName}  </button> `
            newOfferEl.addEventListener('click', () => answerOffer(offer) )
            answerEl.appendChild(newOfferEl);

    })



}







