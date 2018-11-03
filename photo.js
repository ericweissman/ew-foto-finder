class Photo {
  constructor(id, title, caption, file){
    this.id = id || Date.now();
    this.title = title;
    this.caption = caption;
    this.file = file;
    this.favorite = false;
  }
}

  photoCardInfo(photoCard) {
    photoCard.innerHTML =
    `<article class="image-card" data-name="${this.id}">
      <h2 class="card-title" >${this.title}</h2>
      <img class="card-img" src="${this.file}" alt="${this.id} photo">
      <p>${this.caption}</p>
      <section class="card-bottom">
        <button class="card-btns delete"></button>
        <button class="card-btns favorite"></button>
      </section>
    </article>`;
  }
}


