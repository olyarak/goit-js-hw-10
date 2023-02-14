export function fetchCountries(name) {
  const ENDPOINT = 'https://restcountries.com/v2/name';
  const options = 'fields=name,capital,flags,languages,population';

  return fetch(`${ENDPOINT}/${name}?${options}`).then(response => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  });
}
