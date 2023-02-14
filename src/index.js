import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
const DEBOUNCE_DELAY = 300;

const searchInput = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchInput.addEventListener('input', debounce(onChangeInput, DEBOUNCE_DELAY));

function onChangeInput() {
  const countryName = searchInput.value;
  console.log(countryName);
  clearInput();
  if (countryName === '') {
    return;
  }

  fetchCountries(countryName)
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (countries.length >= 2) {
        countryList.innerHTML = countries.reduce(
          (markup, countryItem) => renderCountryList(countryItem) + markup,
          ''
        );
      } else if (countries.length === 1) {
        countryInfo.innerHTML = countries.map(renderCountryInfo).join('');
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      clearInput();
      return error;
    });
}

function renderCountryList({ name, flags }) {
  return `<li class='list-item'>
  <img class='flag-img' src='${flags.svg}' alt='${name}' width='30' />
  <span>${name}</span>
</li>`;
}

function renderCountryInfo({ flags, name, capital, population, languages }) {
  const languagesString = languages.map(language => language.name).join(', ');

  return `
  <div class="box"><img class='flag-img' src='${flags.svg}' alt='${name}' width='30' />
  <h2 class="info-heading">${name}</h2></div>
  <ul>
   <li class="info-item"><span class="info-name">Capital:</span>${capital}</li>
    <li class="info-item"><span class="info-name">Population:</span>${population}</li>
     <li class="info-item"><span class="info-name">Languages:</span>${languagesString}</li>
  </ul>`;
}

function clearInput() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
