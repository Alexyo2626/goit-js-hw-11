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
refs.moreBtn.addEventListener('click', loadMore);

function loadMore() {
  photoAPI.incrementPage();
  photoAPI.fetchPhoto(searchQuery).then(appendPhotoMurkup).catch(onFetchError);
}

function seachPhotoCard() {
  event.preventDefault();
  if (searchQuery != refs.inputEl.value) {
    refs.galleryEl.innerHTML = '';
  }
  searchQuery = refs.inputEl.value.trim();
  if (searchQuery === '') {
    refs.moreBtn.classList.add('is-hidden');
    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  photoAPI.resetPage();
  photoAPI
    .fetchPhoto(searchQuery)
    .then(data => {
      if (data.hits.length === 0) {
        refs.moreBtn.classList.add('is-hidden');
        Notiflix.Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      appendPhotoMurkup(data);
    })
    .catch(onFetchError);
}

function appendPhotoMurkup(photoCard) {
  refs.moreBtn.classList.remove('is-hidden');
  totalPages = Math.ceil(photoCard.totalHits / 40);
  if (totalPages === photoAPI.currentPage()) {
    refs.moreBtn.classList.add('is-hidden');
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
  refs.galleryEl.insertAdjacentHTML('beforeend', createPhotoMarkup(photoCard));

  var lightbox = new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

  lightbox.refresh();
}

function onFetchError() {
  error => {
    if (data.hits.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    console.log(error);
  };
}

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
      <div class="thumb">
   <a href="${largeImageURL}" class="gallery__item"><img src="${webformatURL}" class="gallery__image" width="290px" height="200px" alt="${tags}" loading="lazy"/></a>
   </div>
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
