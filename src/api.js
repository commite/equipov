import fetch from 'isomorphic-fetch';
import Promise from 'promise';
import md5 from 'blueimp-md5';

// Characters API, which uses Marvel or generic characters database

export const randomCharacter = (database) => {
  const randomGenerator = database === 'marvel' ? marvelRandomCharacter : genericRandomCharacter;
  return randomGenerator();
};

// Marvel Characters API. See https://developer.marvel.com/
const MARVEL_API_KEY = 'f7ad96ce1e1fa51154333f64b939b20e';
const MARVEL_PRIV_API_KEY = '2419d9e0a4235cfe25eab5c6b177b3b658ac4b53';
const API_URL = 'https://gateway.marvel.com/v1/public';

let ts = 1;

const marvelApiCall = (path) => {

  const hash = md5(ts + MARVEL_PRIV_API_KEY + MARVEL_API_KEY);
  const url = `${API_URL}/${path}?ts=${ts}&apikey=${MARVEL_API_KEY}&hash=${hash}&limit=30`;

  // increment timestamp
  ts++;

  return fetch(url)
    .then(response => {
      if (response.status >= 400) {
        return Promise.reject(new Error('Invalid response'));
      }

      return response.json();
    })
    .then(json => {
      if (parseInt(json.code) !== 200) {
        return Promise.reject(new Error('Invalid response'));
      }
      return json.data;
    });
};

const marvelRandomCharacter = () => {
  return marvelApiCall('characters')
  .then(data => {
    let character;
    let found = false;
    // TODO: Make sure that some result has image
    while (true) {
      const idx = Math.floor(Math.random() * data.count)
      character = data.results[idx];
      if (character.thumbnail.path.indexOf('image_not_available') === -1) {
        return {
          name: character.name,
          picture: `${character.thumbnail.path}/standard_xlarge.jpg`,
          details: character.urls[0].url,
        }
      }
    }
  })
}

// Generic characters API (mocked)

const characters = [
  {
    name: 'Carmen De Mairena',
    picture: 'assets/characters/carmen_de_mairena.png',
    details: 'https://es.wikipedia.org/wiki/Carmen_de_Mairena',
  },
  {
    name: 'Albert Rivera',
    picture: 'assets/characters/albert_rivera.png',
    details: 'https://es.wikipedia.org/wiki/Albert_Rivera',
  },
  {
    name: 'Alejandro Sanz',
    picture: 'assets/characters/alejandro_sanz.png',
    details: 'https://es.wikipedia.org/wiki/Alejandro_Sanz',
  },
  {
    name: 'Espinete',
    picture: 'assets/characters/espinete.png',
    details: 'https://es.wikipedia.org/wiki/Espinete',
  },
  {
    name: 'Mafalda',
    picture: 'assets/characters/mafalda.png',
    details: 'https://es.wikipedia.org/wiki/Mafalda',
  },
  {
    name: 'Alvaro Ojeda',
    picture: 'assets/characters/ojeda.png',
    details: 'https://es.wikipedia.org/wiki/%C3%81lvaro_Ojeda_Sacaluga',
  },
  {
    name: 'Sr Barragan',
    picture: 'assets/characters/sr_barragan.png',
    details: 'https://es.wikipedia.org/wiki/Se%C3%B1or_Barrag%C3%A1n',
  }
];

const genericRandomCharacter = () => {
  const idx = Math.floor(Math.random() * characters.length)
  return new Promise((resolve, reject) => {
    return resolve(characters[idx]);
  });
}
