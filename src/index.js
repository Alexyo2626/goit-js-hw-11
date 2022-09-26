// Описан в документации
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';

import Notiflix from 'notiflix';
import API from './js/fetchPhoto.js';

const refs = {
  galleryEl: document.querySelector('.gallery'),
  inputEl: document.querySelector('input[name="searchQuery"]'),
  formEl: document.querySelector('#search-form'),
  moreBtn: document.querySelector('.load-more'),
};

const photoAPI = new API();
let searchQuery = null;
let totalPages = null;

refs.formEl.addEventListener('submit', seachPhotoCard);

//search on click submit
function seachPhotoCard(event) {
  event.preventDefault();
  cleanMurkupBeforNewSearch();

  searchQuery = refs.inputEl.value.trim();

  if (searchQuery === '') {
    addClassHiddenForBtn();
    Notiflix.Notify.warning('Empty string. Please, write what you need find');
    return;
  }

  photoAPI.resetPage();

  photoAPI
    .fetchPhoto(searchQuery)
    .then(data => {
      if (data.hits.length === 0) {
        addClassHiddenForBtn();
        Notiflix.Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      appendPhotoMarkup(data);
    })
    .catch(onFetchError);
}

//add photo in markup
function appendPhotoMarkup(photoCard) {
  removeClassHiddenForBtn();

  totalPages = Math.ceil(photoCard.totalHits / 40);

  if (totalPages === photoAPI.currentPage()) {
    addClassHiddenForBtn();
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
  refs.galleryEl.insertAdjacentHTML('beforeend', createPhotoMarkup(photoCard));
  addLightboxGallery();
}

function cleanMurkupBeforNewSearch() {
  if (searchQuery != refs.inputEl.value) {
    refs.galleryEl.innerHTML = '';
  }
}

function addClassHiddenForBtn() {
  refs.moreBtn.classList.add('is-hidden');
}

function removeClassHiddenForBtn() {
  refs.moreBtn.classList.remove('is-hidden');
}

function addLightboxGallery() {
  var lightbox = new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

  lightbox.refresh();
}

function onFetchError() {
  error => {
    Notiflix.Notify.warning('Please, try again.');

    console.log(error);
  };
}

//render markup
function createPhotoMarkup(photoCard) {
  return photoCard.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
      <div class="photo-card">
          <a href="${largeImageURL}" class="gallery__item">
        <div class="thumb">
          <img src="${webformatURL}" class="gallery__image" alt="${tags}" loading="lazy"/>
        </div>
          </a>
   
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join('');
}

//button load more
refs.moreBtn.addEventListener('click', loadMore);

function loadMore() {
  photoAPI.incrementPage();
  photoAPI.fetchPhoto(searchQuery).then(appendPhotoMurkup).catch(onFetchError);
}
