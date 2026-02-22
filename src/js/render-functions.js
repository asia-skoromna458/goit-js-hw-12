import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const gallery = document.querySelector(".gallery");
const loader = document.querySelector(".loader");
const loadMore = document.querySelector(".js-load-more");


let lightbox = new SimpleLightbox('.gallery a', {
    captionsData: "alt",
    captionDelay: 250,
});

export function createGallery(images) {
    const markup = images
        .map(image => {
            return `
        <li class="gallery-item">
          <a href="${image.largeImageURL}">
            <img src="${image.webformatURL}" alt="${image.tags}" />
          </a>
          <div class="info">
            <p>Likes <span>${image.likes}</span></p>
            <p>Views <span>${image.views}</span></p>
            <p>Comments <span>${image.comments}</span></p>
            <p>Downloads <span>${image.downloads}</span></p>
          </div>
        </li>
      `;
        })
        .join("");

  gallery.insertAdjacentHTML("beforeend", markup);
    lightbox.refresh();
}

export function clearGallery() {
    gallery.innerHTML = "";
}

export function showLoader() {
    loader.classList.remove("hidden");
}

export function hideLoader() {
    loader.classList.add("hidden");
}
export function showLoadMoreButton() {
  loadMore.classList.remove("load-more-hidden");
  loadMore.classList.add("load-more");
  
}
export function hideLoadMoreButton() {
  loadMore.classList.remove("load-more");
  loadMore.classList.add("load-more-hidden");
}


