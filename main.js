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
document.querySelector('.favorites').addEventListener('click', changeFavoritesBtn);
document.querySelector('.show').addEventListener('click', changeShowMoreShowLess);

// GLOBAL JAUNTS
var photoAlbum = [];
var favoriteCounter = 0;

window.onload = setPage();

// Initial State + Instructions
function setPage() {
  if (localStorage.getItem('Photos') == null) {
    document.querySelector('.instructions').insertAdjacentHTML('afterbegin', `<h1 id="message">Add Photos To Album Above!</h1>`);
  } else {
    pullCardsFromStorage();
  };
}

function displayMessageWhenEmpty() {
  if (localStorage.getItem('Photos') == null) {
    document.querySelector('.instructions').insertAdjacentHTML('afterbegin', `<h1 id="message">Add Photos To Album Above!</h1>`);
  };
}

function displayInstructions() {
  var message = document.getElementById('message');
  if (message) {
    message.parentNode.removeChild(message);
  };
}

// ADDING REMOVING FROM LOCAL STORAGE 
function pullCardsFromStorage() {
  if (localStorage.getItem('Photos') !== null) {
    photoAlbum = JSON.parse(localStorage.getItem("Photos"));
    photoAlbum = photoAlbum.map(function (photoCard) {
      return photoCard = new Photo(photoCard.title, photoCard.caption, photoCard.file, photoCard.id, photoCard.favorite);
    });
    photoAlbum.forEach(function(photoCard, index) {
      if (index >= (photoAlbum.length - 10)) {
        addCardToDomWith(photoCard);
      }
      if (photoCard.favorite) {
        favoriteCounter++;
      }
      updateFavViewNums();
    });
  };
}

// CREATE + ADD CARDS FUNCTIONALITY
function createNewPhotoCard(event) {
  event.preventDefault();
  var file = document.querySelector("#file").files[0];
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function(event) {
    var titleText = document.querySelector('#title-input').value;
    var captionText = document.querySelector('#caption-input').value;
    var pictureURL = event.target.result;
    displayInstructions();
    if (titleText && captionText) {
      var photo = new Photo(titleText, captionText, pictureURL);
      addCardToDomWith(photo);
      addToAlbumArray(photo);
      photo.saveToStorage(photoAlbum);
    };
  };
}

function addToAlbumArray(photoCard) {
  photoAlbum.push(photoCard);
}

function addCardToDomWith(photo) {
  var newPhotoCard = document.createElement('article');

  newPhotoCard.className = 'image-card';
  photo.photoCardInfo(newPhotoCard);
  document.querySelector('.image-card-area').prepend(newPhotoCard);
  clearInputs();
}

// DISABLED FUNCTIONALITY
function toggleDisabled() {
  var title = document.querySelector('#title-input').value;
  var caption = document.querySelector('#caption-input').value;
  var file = document.querySelector('#file').value;
  var addBtn = document.querySelector(".add");

  if (!title || !caption || !file) {
    addBtn.disabled = true;
  } else if (title && caption && file) {
    addBtn.disabled = false;
  };
}

function clearInputs() {
  document.querySelector("#title-input").value = null;
  document.querySelector("#caption-input").value = null;
}

function clearDOM() {
  document.querySelector('.image-card-area').innerHTML = '';
}

// DELETE FUNCTIONALITY
function deleteCardUsing(cardId) {
  var index = photoAlbum.findIndex(function (photo) {
    return photo.id = cardId;
  });
  photoAlbum[index].deleteFromStorage(photoAlbum, index);
  event.target.closest('article').remove();
  displayMessageWhenEmpty();
}

function findCardToDelete(event) {
  if (event.target.classList.contains('delete')) {
    var cardId = event.target.closest('article').dataset.name;
    deleteCardUsing(cardId);
  };
}

// EDITING PHOTO INFO
function editPhotoTitle(event) {
  if (event.target.classList.contains('card-title')) {
    var currentCard = event.target.closest('.image-card');
    var currentCardTitle = event.target.closest('.image-card .card-title').innerText;

    photoAlbum.forEach(function(cardFromArray) {
      if (cardFromArray.id == currentCard.dataset.name) {
        cardFromArray.updatePhoto(currentCardTitle, cardFromArray.caption, cardFromArray.favorite);
        cardFromArray.saveToStorage(photoAlbum);
      };
    });
  };
}

function editPhotoCaption(event) {
  if (event.target.classList.contains('card-caption')) {
    var currentCard = event.target.closest('.image-card');
    var currentCardCaption = event.target.closest('.image-card .card-caption').innerText;

    photoAlbum.forEach(function(cardFromArray) {
      if (cardFromArray.id == currentCard.dataset.name) {
        cardFromArray.updatePhoto(cardFromArray.title, currentCardCaption, cardFromArray.favorite);
        cardFromArray.saveToStorage(photoAlbum);
      };
    });
  };
}

// SHOW FAVORITES FUNCTIONALITY
function editFavoriteStatus(event) {
  if (event.target.classList.contains('favorite')) {
    var currentCard = event.target.closest('.image-card');
    var currentCardId = currentCard.dataset.name;
    var index = photoAlbum.findIndex(function (cardFromArray) {
      return cardFromArray.id == currentCardId;
    });
    currentCard = photoAlbum[index];
    currentCard.updatePhoto(currentCard.title, currentCard.caption, !currentCard.favorite);
    currentCard.saveToStorage(photoAlbum);
    event.target.classList.replace(`favorite-${!currentCard.favorite}`, `favorite-${currentCard.favorite}`);
    if (currentCard.favorite) {
      favoriteCounter++;
    } else {
      favoriteCounter--;
    };
    updateFavViewNums();
  };
}

function changeFavoritesBtn(event) {
  event.preventDefault();
  if (event.target.classList.contains('favorites')) {
    document.querySelector('.favorites').classList.replace('favorites', 'view-all');
    document.querySelector('.view-all').innerText = 'Show All Photos';
    showFavoritesOnly();
  } else {
    document.querySelector('.view-all').classList.replace('view-all', 'favorites');
    clearDOM();
    photoAlbum.forEach(function(photoCard) {
      addCardToDomWith(photoCard);
    });
    updateFavViewNums();
  };
}

function showFavoritesOnly() {
  var favorites = photoAlbum.filter(function(photo) {
    if (photo.favorite === true) {
      return photo;
    };
  });
  clearDOM();
  favorites.forEach(function(favorite) {
    addCardToDomWith(favorite);
  });
}

function updateFavViewNums() {
  document.querySelector('.favorites').innerText = `View ${favoriteCounter} Favorites`;
}

// SEARCH FUNCTIONALITY
function searchForCards() {
  var query = document.querySelector('.search-bar').value.toLowerCase();

  if (document.querySelector('.favorites') === null) {
    var arrayToSearch = photoAlbum.filter(function (photo) {
      if (photo.favorite === true) {
        return photo;
      };
    });
  } else {
    var arrayToSearch = photoAlbum;
  };
  var searchResults = arrayToSearch.filter(function(photo) {
    var cardTitle = photo.title.toLowerCase();
    var cardCaption = photo.caption.toLowerCase();
    return cardTitle.includes(query) || cardCaption.includes(query);
  });
  clearDOM();
  searchResults.forEach(function(meetsQuery) {
    addCardToDomWith(meetsQuery);
  });
}

// SHOW MORE OR SHOW LESS
function changeShowMoreShowLess(event) {
  event.preventDefault();
  if (event.target.classList.contains('show-more')) {
    document.querySelector('.show-more').classList.replace('show-more', 'show-less');
    document.querySelector('.show-less').innerText = 'Show Less';
    clearDOM();
    photoAlbum.forEach(function(photoCard) {
      addCardToDomWith(photoCard);
    });
  } else {
    document.querySelector('.show-less').classList.replace('show-less', 'show-more');
    document.querySelector('.show-more').innerText = 'Show More';
    clearDOM();
    photoAlbum.forEach(function(photoCard, index) {
      if (index >= photoAlbum.length - 10) {
        addCardToDomWith(photoCard);
      };
    });
  };
}
