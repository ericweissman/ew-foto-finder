// EVENT LISTENERS
document.querySelector('.add').addEventListener('click', createNewPhotoCard);
document.querySelector('.image-card-area').addEventListener('click', findCardToDelete);
document.querySelector('.image-card-area').addEventListener('focusout', editPhotoInfo);
document.querySelector('.image-card-area').addEventListener('click', editFavoriteStatus)


// GLOBAL JAUNTS
var photoAlbum = [];
var favoriteCounter = 0;

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
};

function findCardToDelete(event){
  // if i click on a delete btn
  if(event.target.classList.contains('delete')){
    // grab the photo cards ID (which lives in dataset)
    var cardId = event.target.closest('article').dataset.name; 
    // delete the correct card by referencing its ID
    deleteCardUsing(cardId)
  }
};



// CREATE CARDS FUNCTIONALITY
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
    addCardToDomWith(photo);
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
function addCardToDomWith(photo) {
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
      addCardToDomWith(photoCard);
    });
  }
}


// EDITING PHOTO INFO
function editPhotoInfo(event) {
  if(event.target.classList.contains('card-title')){
    var currentCard = event.target.closest('.image-card');
    var currentCardTitle = event.target.closest('.image-card .card-title').innerText;
   
    photoAlbum.forEach(function(oldCard){
      if (oldCard.id == currentCard.dataset.name) {
        // oldCard.title = currentCardTitle;
        oldCard.updateTitle(currentCardTitle);
        oldCard.saveToStorage(photoAlbum);
      }
    })
  }

  if(event.target.classList.contains('card-caption')){
    var currentCard = event.target.closest('.image-card');
    var currentCardCaption = event.target.closest('.image-card .card-caption').innerText;

    photoAlbum.forEach(function(oldCard){
      if(oldCard.id == currentCard.dataset.name) {
        // oldCard.caption = currentCardCaption;
        oldCard.updateCaption(currentCardCaption);
        oldCard.saveToStorage(photoAlbum);
      }
    })
  }
}

// TOGGLE WHETHER PHOTO IS CLASSIFIED AS A FAVORITE
function editFavoriteStatus(event){
  if (event.target.classList.contains('favorite')) {
    var currentCard = event.target.closest('.image-card');
    var currentCardId = currentCard.dataset.name
    
    photoAlbum.forEach(function(oldCard){
      if(oldCard.id == currentCardId){
        currentCard = oldCard;
        oldCard.updateFavorite();
        oldCard.saveToStorage(photoAlbum);
      }
    })
    event.target.classList.replace(`favorite-${!currentCard.favorite}`, `favorite-${currentCard.favorite}`);

    if (currentCard.favorite) {
      favoriteCounter++;
    } else {
      favoriteCounter--;
    }
    updateFavViewNums();
  }
}


function updateFavViewNums(){
  document.querySelector('.favorites').innerText = `View ${favoriteCounter} Favorites`;
}

