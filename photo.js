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
      <div>
      <img class="card-img" src="${this.file}" alt=" photo">
      </div>
      <p class="card-caption" contenteditable="true">${this.caption}</p>
      <section class="card-bottom">
        <button class="card-btns delete"></button>
        <button class="card-btns favorite favorite-${this.favorite} "></button>
      </section>`;
  }

  saveToStorage(albumArray) {
    localStorage.setItem('Photos', JSON.stringify(albumArray));
  }

  deleteFromStorage(array, index) {
    array.splice(index, 1);
    this.saveToStorage(array);
  };


  updateTitle(newTitle){
    this.title = newTitle;
  }

  updateCaption(newCaption){
    this.caption = newCaption;
  }

  updateFavorite() {
    this.favorite = !this.favorite;
  }
}



