// EVENT LISTENERS
document.querySelector('.add').addEventListener('click', createNewPhotoCard);
document.querySelector('.image-card-area').addEventListener('click', findCardToDelete);
document.querySelector('.image-card-area').addEventListener('focusout', editPhotoTitle);
document.querySelector('.image-card-area').addEventListener('focusout', editPhotoCaption);
document.querySelector('.image-card-area').addEventListener('click', editFavoriteStatus);
document.querySelector('.search-bar').addEventListener('keyup', searchForCards);
document.querySelector('#title-input').addEventListener('focusout', toggleDisabled);
document.querySelector('#caption-input').addEventListener('focusout', toggleDisabled);
document.querySelector('#file').addEventListener('change', toggleDisabled);



// GLOBAL JAUNTS
var photoAlbum = [];
var favoriteCounter = 0;


window.onload = setPage();

// Initial State
function setPage(){
  if (localStorage.getItem('Photos') == null) {
    document.querySelector('.image-card-area').insertAdjacentHTML('afterbegin', `<h1 id="message">Add Photos To Album Above!</h1>`);
  }
  else {
    pullCardsFromStorage();
  }
}

function displayMessageWhenEmpty() {
  if (localStorage.getItem('Photos') == null) {
    document.querySelector('.image-card-area').insertAdjacentHTML('afterbegin', `<h1 id="message">Add Photos To Album Above!</h1>`);
  }
}

function removeWarning(){
  var message = document.getElementById('message');
  if (message){
    message.parentNode.removeChild(message);
  }
}


// SEARCH FUNCTIONALITY
function searchForCards(event){
  var query = document.querySelector('.search-bar').value.toLowerCase();

  var searchResults = photoAlbum.filter(function(photo){
    // create new array of any card whose title or caption matches the query
    var cardTitle = photo.title.toLowerCase();
    var cardCaption = photo.caption.toLowerCase();
    return cardTitle.includes(query) || cardCaption.includes(query);
  })
  // Clear the DOM
  document.querySelector('.image-card-area').innerHTML = '';
  // Go through the new array of search searchResults, and add to dom if it meets the query specs
  searchResults.forEach(function(meetsQuery){
    addCardToDomWith(meetsQuery);
  })
}

// CREATE CARDS FUNCTIONALITY
function createNewPhotoCard(event) {
  event.preventDefault();

  var file = document.querySelector("#file").files[0];
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function(event){
    // Grab title text
    var titleText = document.querySelector('#title-input').value;
    // grab caption text
    var captionText = document.querySelector('#caption-input').value
    // grab the URL from the upload input - reader 
    var pictureURL = event.target.result;
    // turn the file into a usable URL string
    removeWarning();
    if (titleText && captionText) {
      // create new photo card with title, caption and URL for the img src
      var photo = new Photo(titleText, captionText, pictureURL);
      // add new photo card to DOM
      addCardToDomWith(photo);
      // add photo card to the album array
      addToAlbumArray(photo);
      // save the array back to local storage
      photo.saveToStorage(photoAlbum);
      // Remove the warning message?
    }
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
      return photoCard = new Photo(photoCard.title, photoCard.caption, photoCard.file, photoCard.id, photoCard.favorite);
    });
    // for each card in the Array, add it to the DOM
      photoAlbum.forEach(function(photoCard){
      addCardToDomWith(photoCard);
      // if the card is marked as a favorite, update the favorite counter
      if (photoCard.favorite){
        favoriteCounter++;
      }
      updateFavViewNums();
    });
  }
}

// DELETE FUNCTIONALITY
function deleteCardUsing(cardId) {
  // find the index in the photo album array that matches the specific ID
  var index = photoAlbum.findIndex(function (photo) {
    return photo.id = cardId;
  });
  // at the specific index in the Array, run the delete from storage method
  photoAlbum[index].deleteFromStorage(photoAlbum, index);
  event.target.closest('article').remove();
  displayMessageWhenEmpty();
};

function findCardToDelete(event) {
  // if i click on a delete btn
  if (event.target.classList.contains('delete')) {
    // grab the photo cards ID (which lives in dataset)
    var cardId = event.target.closest('article').dataset.name;
    // delete the correct card by referencing its ID
    deleteCardUsing(cardId)
  }
};


// EDITING PHOTO INFO
function editPhotoTitle(event) {
  if(event.target.classList.contains('card-title')){
    var currentCard = event.target.closest('.image-card');
    var currentCardTitle = event.target.closest('.image-card .card-title').innerText;
   
    photoAlbum.forEach(function(oldCard){
      if (oldCard.id == currentCard.dataset.name) {
        oldCard.updatePhoto(currentCardTitle, oldCard.caption, oldCard.favorite);
        oldCard.saveToStorage(photoAlbum);
      }
    })
  }
}

function editPhotoCaption(event) {
  if (event.target.classList.contains('card-caption')) {
    var currentCard = event.target.closest('.image-card');
    var currentCardCaption = event.target.closest('.image-card .card-caption').innerText;

    photoAlbum.forEach(function (oldCard) {
      if (oldCard.id == currentCard.dataset.name) {
        oldCard.updatePhoto(oldCard.title, currentCardCaption, oldCard.favorite);
        oldCard.saveToStorage(photoAlbum);
      }
    })
  }
}

// TOGGLE WHETHER PHOTO IS CLASSIFIED AS A FAVORITE
function editFavoriteStatus(event){
  // if you click on a favorite button
  if (event.target.classList.contains('favorite')) {
    var currentCard = event.target.closest('.image-card');
    var currentCardId = currentCard.dataset.name
    // assigning index to the specific index in the array that matcehs the id
    var index = photoAlbum.findIndex(function(cardFromArray){
      return cardFromArray.id == currentCardId
      })

    currentCard = photoAlbum[index];
    currentCard.updatePhoto(currentCard.title, currentCard.caption, !currentCard.favorite);
    currentCard.saveToStorage(photoAlbum);
    
    // If the classlist is NOT favorite, replace with favorite to add correct styles
    event.target.classList.replace(`favorite-${!currentCard.favorite}`, `favorite-${currentCard.favorite}`);
    // if the card is marked favorite, increase the favorite counter
    if (currentCard.favorite) {
      favoriteCounter++;
      // otherwise, decrease the favorite counter
    } else {
      favoriteCounter--;
    }
    updateFavViewNums();
  }
}

function updateFavViewNums(){
  document.querySelector('.favorites').innerText = `View ${favoriteCounter} Favorites`;
}



// SHOW FAVORITES FUNCTIONALITY
function changeFavoritesBtn() {
  document.querySelector('.favorites').innerText = `Show All Photos`;
  document.querySelector('.favorites').classList.replace('favorites', 'view-all');
}


function showFavoritesOnly(event) {
  event.preventDefault();
  var favorites = photoAlbum.filter(function (photo) {
    if (photo.favorite === true) {
      return photo;
    }
  })
  document.querySelector('.image-card-area').innerHTML = '';
  favorites.forEach(function (favorite) {
    addCardToDomWith(favorite);
  })
  changeFavoritesBtn();
}

function testShowAll(event){
  if (document.querySelector('.favorites').innerText = 'Show All Photos'){
    document.querySelector(".image-card-area").innerHTML = "";
  }
}

// DISABLED FUNCTIONALITY
function toggleDisabled(event) {
  var title = document.querySelector('#title-input').value;
  var caption = document.querySelector('#caption-input').value;
  var file = document.querySelector('#file').value;
  var addBtn = document.querySelector(".add");

  if (!title || !caption || !file) {
    addBtn.disabled = true;
  } else if (title && caption && file) {
    addBtn.disabled = false;
  }
}
