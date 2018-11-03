class Photo {
  constructor(title, caption, file, id){
    this.title = title;
    this.caption = caption;
    this.id = id || Date.now();
    this.file = file;
    this.favorite = false;
  }

  photoCardInfo(photoCard) {
    photoCard.dataset.name = this.id
    photoCard.innerHTML = `
      <h2 class="card-title" contenteditable="true">${this.title}</h2>
      <img class="card-img" src="${this.file}" alt=" photo">
      <p contenteditable="true">${this.caption}</p>
      <section class="card-bottom">
        <button class="card-btns delete"></button>
        <button class="card-btns favorite"></button>
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

  // updateSelf(updatedTitle, updatedCaption) {
  //   this.title = updatedTitle;
  //   this.caption = updatedCaption;
  //   return this.title + this.body;
  // }
}



