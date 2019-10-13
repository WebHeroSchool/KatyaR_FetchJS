fetch('https://api.github.com/users/AlenaDmit')
  .then(res => res.json())
  .then(json => {
    document.getElementById('avatar').src = json.avatar_url;
    let name = document.getElementById('name');
    name.innerHTML = json.name;
    name.href = json.html_url;
    document.getElementById('bio').innerHTML = json.bio;
  })
  .catch(err => alert('Информация о пользователе недоступна'));
