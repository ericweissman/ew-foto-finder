class Photo {
  constructor(title, caption, file, id, favorite){
    this.title = title;
    this.caption = caption;
    this.file = file;
    this.id = id || Date.now();
    this.favorite = favorite || false;
  }

  photoCardInfo(photoCard) {
    photoCard.dataset.name = this.id
    photoCard.innerHTML = `
      <h2 class="card-title" contenteditable="true">${this.title}</h2>
      <img class="card-img" src="${this.file}" alt=" photo">
      <p class="card-caption" contenteditable="true">${this.caption}</p>
      <section class="card-bottom">
        <button class="card-btns delete"></button>
        <button class="card-btns favorite favorite-${this.favorite} "></button>
      </section>`;
  }

  saveToStorage(albumArray) {
    // SAVING THE ARRAY TO STORAGE WHICH CONTAINS ALL THE PHOTO CARDS
    localStorage.setItem('Photos', JSON.stringify(albumArray));
  }

  deleteFromStorage(array, index) {
    // go into the array and delete one thing at the selected index
    array.splice(index, 1);
    this.saveToStorage(array);
  };


  updateTitle(newTitle){
    this.title = newTitle;
  }

  updateCaption(newCaption){
    this.caption = newCaption;
  }

  updatePhoto() {
    this.favorite = !this.favorite;
  }

}



