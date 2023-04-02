// import { fetchData } from "./partials/fetchfunction";
// import { renderImg } from "./partials/renderimage";
import { Notify } from "notiflix";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from "axios";


const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const imgBox = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const API_KEY = '34988018-026f4de83fc2116d0280b55fb';
const BASE_URL = 'https://pixabay.com/api/';
const lightbox = new SimpleLightbox('.gallery a');

let currentPage = 1;
let searchQuerry = '';
loadMoreBtn.classList.add('is-hidden');

form.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onButtonClick);

async function fetchData(url){
try {
    const response = await axios.get(url);
    return response.data;
} catch (error) {
     
    Notify.failure("We're sorry, but you've reached the end of search results.");
}
}

function onFormSubmit(e) {
    
    e.preventDefault();
    resetPage();
    clearBox();


    searchQuerry = input.value.trim();
    const url=`${BASE_URL}?key=${API_KEY}&q=${searchQuerry}&type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${currentPage}`;

    if (searchQuerry === '') {
        loadMoreBtn.classList.add('is-hidden');
        Notify.failure('Please,enter something!')
    }
    else {
        fetchData(url).then(data => {
            if (data.total === 0) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.') 
            }
            else {
                Notify.success(`Hooray! We found ${data.totalHits} images.`)
                imgBox.insertAdjacentHTML('beforeend', renderImg(data));
                currentPage += 1;
                loadMoreBtn.classList.remove('is-hidden');
                lightbox.refresh();
            }
        })
    }

}
function renderImg(img){
    return img.hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
return `<div class="photo-card">
<a class='gallery__link' href='${largeImageURL}'><img class='gallery__image' src="${webformatURL}" alt="${tags}" loading="lazy" width='360' height='260'/></a>
<div class="info">
  <p class="info-item">
    <b>Likes:${likes}</b>
  </p>
  <p class="info-item">
    <b>Views:${views}</b>
  </p>
  <p class="info-item">
    <b>Comments:${comments}</b>
  </p>
  <p class="info-item">
    <b>Downloads:${downloads}</b>
  </p>
</div>
</div>`
    }).join('')
}
function onButtonClick() {
    
  const url = `${BASE_URL}?key=${API_KEY}&q=${searchQuerry}&type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${currentPage}`;
    fetchData(url).then(data => {
         imgBox.insertAdjacentHTML('beforeend', renderImg(data));
                currentPage += 1;
                loadMoreBtn.classList.remove('is-hidden');
        lightbox.refresh();
        

    const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
        
    });
   
}
function clearBox(){
    imgBox.innerHTML = '';
}

function resetPage(){
  currentPage = 1;
}