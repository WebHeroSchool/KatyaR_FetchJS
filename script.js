
const button = document.getElementById('button');
const elementId = (name) => document.getElementById(name);
const elementOk = elementId('ok');
const elementErr = elementId('err');

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

const showError = () => {
  let avatar = elementId('avatar');
  let avatarLink = elementId('userLink');
  avatar.src = 'img/github-logo.png';
  avatarLink.removeAttribute('href');
  avatarLink.removeAttribute('target');
  reverseElements(elementOk, elementErr);
};

const setUsername = (nickname) => window.history.pushState({}, '', '?username=' + nickname);

const getUsername = (urlStr) => {
  if (urlStr == '') {
    return '';
  };
  let arr = urlStr.split('=');
  if (arr.length >= 2 && (~arr[0].indexOf('username') != -1)) { 
    return arr[1]; 
  }; 
  return '';
};

const buttonOnClick = () => {
  const nickname = document.getElementById('name').value;

  if (nickname == undefined || nickname == '') {
    return;
  };

  setUsername(nickname);
  let username = getUsername(window.location.search);

  fetch('https://api.github.com/users/' + username)
    .then(res => res.json())
    .then(json => {
      if (json.login == undefined) {
        showError();
      } else {
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
    })
    .catch(err => showError());
};

button.addEventListener('click', buttonOnClick);

