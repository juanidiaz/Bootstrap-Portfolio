
var API_KEY = '4f053f20df76d1ac0a47b7c68f79cdf3';
var private = 'a238a11188afcb9fe6682df29afbbe9a816427b1';


// const API_KEY = `6ad1755aed6bec3aff36e5741089417b`;
const API_URL = `https://gateway.marvel.com/v1/public/events/29/characters?limit=60&apikey=${API_KEY}`;

function getCharacterData() {
  return fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      console.log(data)
    });
}
getCharacterData();