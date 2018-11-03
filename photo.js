class Photo {
  constructor(title, caption, id, file){
    this.title = title;
    this.caption = caption;
    this.id = id || Date.now();
    this.file = file;
    this.favorite = false;
  }

  photoCardInfo(photoCard) {
    photoCard.id = this.id
    photoCard.innerHTML = `<article data-name="${this.id}">
      <h2 class="card-title">${this.title}</h2>
      <img class="card-img" src="http://www.cpr.org/sites/default/files/images/rr11.jpg" alt="${this.id} photo">
      <p>${this.caption}</p>
      <section class="card-bottom">
        <button class="card-btns delete"></button>
        <button class="card-btns favorite"></button>
      </section>
    </article>`;
  }

  saveToStorage() {
    localStorage.setItem(this.id, JSON.stringify(this));
  }
}



//   deleteFromStorage(event) {
//     localStorage.removeItem(event.target.parentElement.id)
//   };
// }



