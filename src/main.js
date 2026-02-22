import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { getImagesByQuery } from "./js/pixabay-api.js";

import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from "./js/render-functions.js";

const loadMore = document.querySelector(".js-load-more");
const form = document.querySelector(".form");

let page = 1;
let currentQuery = "";
let loadedImages = 0;
let totalHits = 0;

form.addEventListener("submit", onFormSubmit);
loadMore.addEventListener("click", onLoadMore);

function onFormSubmit(event) {
    event.preventDefault();

    const query = event.currentTarget.elements["search-text"].value.trim();
    currentQuery = query;
    loadedImages = 0;
    page = 1;

    if (!query) {
        iziToast.show({
            message: "Please enter a search query",
            color: "red",
        });
        return;
    }

    clearGallery();
    showLoader();

    getImagesByQuery(query, page)
        .then(data => {
            totalHits = data.totalHits;
            loadedImages = data.hits.length;

            createGallery(data.hits);

            if (loadedImages >= totalHits) {
                hideLoadMoreButton();
                iziToast.show({
                    message: "We're sorry, but you've reached the end of search results.",
                    color: "blue",
                });
            } else {
                showLoadMoreButton();
            }
        })
        .finally(() => hideLoader());
}

async function onLoadMore() {
    page++;
    showLoader();

    try {
        const data = await getImagesByQuery(currentQuery, page);

        createGallery(data.hits);
        smoothScroll();

        loadedImages += data.hits.length;

        if (loadedImages >= totalHits) {
            hideLoadMoreButton();
            iziToast.show({
                message: "We're sorry, but you've reached the end of search results.",
                color: "blue",
            });
        }
    } finally {
        hideLoader();
    }
}

function smoothScroll() {
    const card = document.querySelector(".gallery-item");
    if (!card) return;

    const cardHeight = card.getBoundingClientRect().height;

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
}







