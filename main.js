// EVENT LISTENERS
// document.querySelector('.input-area').addEventListener('click', testAlert);
// document.querySelector('.favorites').addEventListener('click', favAlert)

document.querySelector('.add'), addEventListener('click', addToAlbumButton);



// function testAlert(){
//   alert('Hi');
// }

// function favAlert() {
//   alert('Favs');
// }

// function addAlert() {
//   alert("add to album");
// }

// Add Card To DOM
function buildPhotoCardAsObject(obj) {
  var photo = new Photo(obj.id, obj.title, obj.caption, obj.file);

  addCardWith(photo);
}

function addCardWith(photo) {
  var newPhotoCard = document.createElement('article');

  newPhotoCard.className = 'image-card';
  buildPhotoCardInfo(photo);
  document.querySelector('.image-card-area').prepend(newPhotoCard);
}


function addToAlbumButton(event) {
  event.preventDefault();
  var title = document.querySelector('#title-input').value;
  var caption = document.querySelector('#caption-input').value;

  if (title && caption) {
    var photo = new Photo(title, caption);
    buildPhotoCardAsObject(photo);
    // photo.saveToStorage();
  }
}


