import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '30129874-c78727ddf7e732cad9221ad6f';
const imageType = 'photo';
const orientation = 'horizontal';
const safesearch = 'true';
const perPage = '40';

export default class API {
  constructor() {
    this.page = 1;
  }

  async fetchPhoto(search) {
    const url = `${BASE_URL}?key=${API_KEY}&q=${search}&image_type=${imageType}&orientation=${orientation}&safesearch=${safesearch}&page=${this.page}&per_page=${perPage}`;

    const { data } = await axios.get(url);
    return data;
  }

  currentPage() {
    return this.page;
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }
}
