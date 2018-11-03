// EVENT LISTENERS
document.querySelector('.add').addEventListener('click', createNewPhotoCard);

document.querySelector('.image-card-area').addEventListener('click', findCardId);

// PHOTO ALBUM ARRAY
var photoAlbum = [];

window.onload = pullCardsFromStorage;

// DELETE FUNCTIONALITY
function deleteCardUsing(cardId) {
  // find the index in the photo album array that matches the specific ID
  var index = photoAlbum.findIndex(function (photo) {
    return photo.id = cardId;
  });
  // at the specific index in the Array, run the delete from storage method
  photoAlbum[index].deleteFromStorage(photoAlbum, index);
  event.target.closest('article').remove();
}

function findCardId(event){
  // if i click on a delete btn
  if(event.target.classList.contains('delete')){
    // grab the photo cards ID (which lives in dataset)
    var cardId = event.target.closest('article').dataset.name; 
    // delete the correct card by referencing its ID
    deleteCardUsing(cardId)
  }
};




function createNewPhotoCard(event) {
  event.preventDefault();
  // Grab title text
  var titleText = document.querySelector('#title-input').value;
  // grab caption text
  var captionText = document.querySelector('#caption-input').value
  // grab the file from the upload input
  var file = document.querySelector('#file').files[0];
  // turn the file into a usable URL string
  var pictureURL = URL.createObjectURL(file);
  
  if (event.target.classList.contains('add') && titleText && captionText) {
    // create new photo card wiht titel, caption and URL for the img src
    var photo = new Photo(titleText, captionText, pictureURL);
    // add new photo card to DOM
    addCardWith(photo);
    // add photo card to the album array
    addToAlbumArray(photo);
    // save the array back to local storage
    photo.saveToStorage(photoAlbum);
  }
}

// Add Photo Cards to Array
function addToAlbumArray(photoCard){
  photoAlbum.push(photoCard);
}

// ADD CARD TO DOM
function addCardWith(photo) {
  var newPhotoCard = document.createElement('article');
 
  newPhotoCard.className = 'image-card';
  photo.photoCardInfo(newPhotoCard);
  document.querySelector('.image-card-area').prepend(newPhotoCard);
  clearInputs();
}

function clearInputs() {
  document.querySelector("#title-input").value = null;
  document.querySelector("#caption-input").value = null;
}


// ADDING REMOVING FROM LOCAL STORAGE 
function pullCardsFromStorage() {
  // if the array ISNT empty
  if (localStorage.getItem('Photos') !== null) {
    // turn the array into an object
    photoAlbum = JSON.parse(localStorage.getItem("Photos"));
    // for everything in the Array, go an re-instantiate each card
    photoAlbum = photoAlbum.map(function(photoCard){
      return photoCard = new Photo(photoCard.title, photoCard.caption, photoCard.file, photoCard.id);
    });
    // for each card in the Array, add it to the DOM
      photoAlbum.forEach(function(photoCard){
      addCardWith(photoCard);
    });
  }
}
