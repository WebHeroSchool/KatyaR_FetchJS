
const button = document.getElementById('button');
const elementId = (name) => document.getElementById(name);
const elementOk = elementId('ok');
const elementErr = elementId('err');
const elementLoader = elementId('loader');
let elementDate = elementId('date');
let apiUrl = 'https://api.github.com/users/';

/*-------------Username handling-------------*/

const setUsername = (nickname) => window.history.pushState({}, '', '?username=' + nickname);

const getUsername = (urlStr) => {
  if (urlStr == '') {
    return('');
  };
  let arr = urlStr.split('=');
  if (arr.length >= 2 && (~arr[0].indexOf('username') != -1)) { 
    const user = arr[1];
    return(user); 
  }; 
  return('');
};

const clearUsername = () => window.history.pushState({}, '', 'index.html');

/*-------------Result window-------------*/

const showElement = (elem) => {
  elem.classList.remove('hidden');
  elem.classList.add('visible');  
};

const hideElement = (elem) => {
  elem.classList.remove('visible');
  elem.classList.add('hidden');  
};

const reverseElements = (elem1, elem2) => {
  hideElement(elem1);
  showElement(elem2);
};

const setDate = (date) => {
  showElement(elementDate);
  elementDate.innerHTML = date.toLocaleDateString();
};

const clearPage = () => {
  let user = elementId('user');
  let bio = elementId('bio');
  let avatar = elementId('avatar');
  let avatarLink = elementId('userLink');
  user.innerHTML = '';
  bio.innerHTML = '';
  avatar.src = 'img/github-logo.png';
  avatarLink.removeAttribute('href');
  avatarLink.removeAttribute('target');
  elementDate.innerHTML = '';
};

const showError = () => {
  clearPage();
  reverseElements(elementOk, elementErr);
};

const showResult = (json) => {
  let user = elementId('user');
  let bio = elementId('bio');
  let avatar = elementId('avatar');
  let linkElements = document.querySelectorAll('.userLink');
  user.innerHTML = json.name;
  bio.innerHTML = json.bio;
  avatar.src = json.avatar_url;
  linkElements.forEach(linkElement => {
    linkElement.href = json.html_url;
    linkElement.target = '_blank';
  });
  reverseElements(elementErr, elementOk);
};

/*-------------Getting info-------------*/

const getGithubUser = (apiUrl) => new Promise((resolve, reject) => {
  fetch(apiUrl)
    .then(res => resolve(res))
    .catch(err => {
      reject('error');
      showError();
    });
 });

const getCurDate = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    const currentDate = new Date;
    currentDate ? resolve(currentDate): reject ('Date error')
  }, 3000);
});

/*-------------User actions-------------*/

const buttonOnClick = (evt) => {

  evt.preventDefault();
  clearPage();
  const nickname = document.getElementById('name').value;
  let username = getUsername(window.location.search);

  if (nickname == undefined || nickname == '') {
      clearUsername();
      reverseElements(elementErr, elementOk);
      return;
  };

  setUsername(nickname);
  username = getUsername(window.location.search);
  let url = apiUrl + username;

  hideElement(elementOk);
  hideElement(elementErr);
  showElement(elementLoader);

  Promise.all([getGithubUser(url), getCurDate()])
  .then(([res, curdate]) => {
    hideElement(elementLoader);
    showElement(elementOk);
    setDate(curdate);
    return res.json();
  })
  .then(json => {
    if (json.login == undefined) {
      showError();
    } else {
      showResult(json);
    };
  })
  .catch(() => {
    hideElement(elementLoader);
    showError();
  });
};

/*-------------Main program-------------*/

button.addEventListener('click', buttonOnClick, false);

