// EVENT LISTENERS
document.querySelector('.search-bar').addEventListener('keyup', testAlert);

document.querySelector('.favorites').addEventListener('click', testAlert);

document.querySelector('.small-btns'), addEventListener('click', addPhotoCardInfo);

function testAlert(event){
  event.preventDefault();
  console.log('Hi');
}

var photoAlbum = [];

window.onload = pullCardsFromStorage;


function addPhotoCardInfo(event) {
  var titleText = document.querySelector('#title-input').value;
  var captionText = document.querySelector('#caption-input').value
  
  if (event.target.classList.contains('add') && titleText && captionText){
    var photo = new Photo(titleText, captionText);
    buildPhotoCardObject(photo);
    photo.saveToStorage();
    addToAlbumArray(photo);
    event.preventDefault();
  }
}

// Add Photo Cards to Array
function addToAlbumArray(photoObject){
  photoAlbum.push(photoObject);
}

// ADD CARDS TO Page

// Photo Card Creation
function buildPhotoCardObject(object) {
  var photo = new Photo(object.title, object.caption, object.id, object.file)

  addCardWith(photo)
};

function addCardWith(photo) {
  var newPhotoCard = document.createElement('section');
 
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



function addAllCardsFromStorage() {
  var keys = Object.keys(localStorage);
  var targets = document.querySelector('.image-card-area');
  // remove all from page
  while (targets.firstChild) {
    targets.removeChild(targets.firstChild);
  }
  // Adding all cards  
  keys.forEach(function (key) {
    var parsedStorageIdeas = JSON.parse(localStorage.getItem(key));
    buildPhotoCardObject(parsedStorageIdeas);
    photoAlbum.push(photoObject);
  })
}


function pullCardsFromStorage() {
  var keys = Object.keys(localStorage);
  var numKeys = keys.length;
  var index = numKeys > 10 ? numKeys - 10 : 0;

  for (index; index < keys.length; index++) {
    var parsedStorageIdeas = JSON.parse(localStorage.getItem(keys[index]));
    buildPhotoCardObject(parsedStorageIdeas);
    photoAlbum.push(parsedStorageIdeas);
  }
}