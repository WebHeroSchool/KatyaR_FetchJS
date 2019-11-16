
let apiUrl = 'https://api.github.com/users/';
const button = document.getElementById('button');
const elementId = (name) => document.getElementById(name);
const elementOk = elementId('ok');
const elementErr = elementId('err');

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
  let elemDate = elementId('date');
  elemDate.innerHTML = date.toLocaleDateString();
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

const getDate = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(new Date); 
    reject ('Date error')
  }, 3000);
});

/*-------------User actions-------------*/

const buttonOnClick = () => {

  const nickname = document.getElementById('name').value;
  let username = getUsername(window.location.search);

  if (nickname == undefined || nickname == '') {
    if (username == '') {
      clearPage();
      reverseElements(elementErr, elementOk);
      return;
    } 
  };

  setUsername(nickname);
  username = getUsername(window.location.search);
  apiUrl = apiUrl + username;

  Promise.all([getGithubUser(apiUrl), getDate])
  .then(([res, date]) => {
    setDate(date);
    res.json();
  })
    .then(json => {
      if (json.login == undefined) {
        showError();
      } else {
        showResult(json);
      };
    });
    
};

/*-------------Main program-------------*/

button.addEventListener('click', buttonOnClick);

window.onload = buttonOnClick();

/*------------------Preloader------------------*/
// window.onload = () => {
//   let loader = document.querySelectorAll('.loader');
//   loader.delay(1000);
// };

// $(window).on( 'load', function(){

//   $(".loader").delay(1000).fadeOut("slow");
  // $(".content_name .hello").addClass('animated zoomIn');
  // $(".content_name .name").addClass('animated zoomIn');
  // $(".content_prof p").addClass('animated zoomIn');
  // $(".content_download p").addClass('animated zoomIn');

// });