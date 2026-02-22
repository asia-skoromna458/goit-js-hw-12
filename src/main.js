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

const form = document.querySelector(".form");
const loadMore = document.querySelector(".js-load-more");

let page = 1;
let currentQuery = "";
let loadedImages = 0;
let totalHits = 0;

form.addEventListener("submit", onFormSubmit);
loadMore.addEventListener("click", onLoadMore);

// ---------------------------
// ПЕРШИЙ ЗАПИТ
// ---------------------------
async function onFormSubmit(event) {
  event.preventDefault();

  const query = event.currentTarget.elements["search-text"].value.trim();
  currentQuery = query;
  page = 1;
  loadedImages = 0;

  if (!query) {
    iziToast.show({
      message: "Please enter a search query",
      color: "red",
    });
    return;
  }

  clearGallery();
  hideLoadMoreButton(); // ← приховуємо кнопку перед новим пошуком
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

    // ---------------------------
    // НІЧОГО НЕ ЗНАЙДЕНО
    // ---------------------------
    if (data.totalHits === 0) {
      iziToast.show({
        message: "No images found. Try another query.",
        color: "blue",
      });
      return;
    }

    totalHits = data.totalHits;
    loadedImages = data.hits.length;

    createGallery(data.hits);

    // ---------------------------
    // Є ЩЕ СТОРІНКИ?
    // ---------------------------
    if (loadedImages < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.show({
        message: "You've reached the end of search results.",
        color: "blue",
      });
    }

  } catch (error) {
    iziToast.show({
      message: "Something went wrong. Please try again later.",
      color: "red",
    });
  } finally {
    hideLoader();
  }
}

// ---------------------------
// LOAD MORE
// ---------------------------
async function onLoadMore() {
  page++;
  hideLoadMoreButton(); // ← кнопка не клікабельна під час завантаження
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, page);

    createGallery(data.hits);
    smoothScroll();

    loadedImages += data.hits.length;

    // ---------------------------
    // КІНЕЦЬ РЕЗУЛЬТАТІВ
    // ---------------------------
    if (loadedImages >= totalHits) {
      hideLoadMoreButton();
      iziToast.show({
        message: "You've reached the end of search results.",
        color: "blue",
      });
    } else {
      showLoadMoreButton();
    }

  } catch (error) {
    iziToast.show({
      message: "Something went wrong. Please try again later.",
      color: "red",
    });
  } finally {
    hideLoader();
  }
}

// ---------------------------
// ПЛАВНИЙ СКРОЛ
// ---------------------------
function smoothScroll() {
  const card = document.querySelector(".gallery-item");
  if (!card) return;

  const cardHeight = card.getBoundingClientRect().height;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}
