
const button = document.getElementById("button");

const buttonOnClick = () => {

  let nickname = document.getElementById('name').value;
  let username = getUsername(window.location.search);

  if ((nickname != "") &&  (nickname != username)) { 
    setUsername(nickname);
  };
  
  if (username == undefined || username == "") {
    username = 'KatyaRyazantseva';
  };
  
  fetch('https://api.github.com/users/' + username)
  .then(res => res.json())
  .then(json => {
    // document.getElementById('bioContainer').style.display = 'block';
    if (json.login == undefined) {
      document.getElementById('ok').style.display = 'none';
      document.getElementById('err').style.display = 'block';
      document.getElementById('err').innerHTML = 'Информация о пользователе недоступна';
    } else {
      let name = document.getElementById('name');
      if (name.value != json.login) {name.value = json.login};
      document.getElementById('ok').style.display = 'block';
      document.getElementById('err').style.display = 'none';
      let user = document.getElementById('user');
      user.innerHTML = json.name;
      user.href = json.html_url;
      document.getElementById('bio').innerHTML = json.bio;
      document.getElementById('avatar').src = json.avatar_url;
      document.getElementById('userLink').href = json.html_url;
    }
  })
  .catch(err => {
    document.getElementById('bioContainer').style.display = 'block';
    document.getElementById('ok').style.display = 'none';
    document.getElementById('err').style.display = 'block';
    document.getElementById('err').innerHTML = 'Информация о пользователе недоступна';
  });
};

button.addEventListener('click', buttonOnClick);

function setUsername(nickname) {
  let pageURL = window.location;
  window.location.href = pageURL.origin + pageURL.pathname + '?username=' + nickname;
};

function getUsername(urlStr) {
  if (urlStr == "") {
    return "";
  };
  let arr = urlStr.split('=');
  if (arr.length >= 2 && (~arr[0].indexOf('username') != -1)) { 
    return arr[1]; 
  }; 
  return "";
}