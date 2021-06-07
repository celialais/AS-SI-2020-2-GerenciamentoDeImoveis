var config = {
    apiKey: "AIzaSyDQamknbkxQ4PRup7UZR5k2sch9Tc9PR6E",
    authDomain: "integra-imoveis.firebaseapp.com",
    projectId: "integra-imoveis",
    storageBucket: "integra-imoveis.appspot.com",
    messagingSenderId: "476961992659",
    appId: "1:476961992659:web:5191f94105cc3fdf77c926"
};

firebase.initializeApp(config);
var db = firebase.database();

// CRIA IMOVEIS

var reviewForm = document.getElementById('reviewForm');
var fullName   = document.getElementById('fullName');
var message    = document.getElementById('message');
var hiddenId   = document.getElementById('hiddenId');

reviewForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!fullName.value || !message.value) return null

  var id = hiddenId.value || Date.now()

  db.ref('imoveis/' + id).set({
    fullName: fullName.value,
    message: message.value
  });

  fullName.value = '';
  message.value  = '';
  hiddenId.value = '';
});

// LE IMOVEIS

var imoveis = document.getElementById('imoveis');
var reviewsRef = db.ref('/imoveis');

reviewsRef.on('child_added', (data) => {
  var li = document.createElement('li')
  li.id = data.key;
  li.innerHTML = reviewTemplate(data.val())
  reviews.appendChild(li);
});

reviewsRef.on('child_changed', (data) => {
  var reviewNode = document.getElementById(data.key);
  reviewNode.innerHTML = reviewTemplate(data.val());
});

reviewsRef.on('child_removed', (data) => {
  var reviewNode = document.getElementById(data.key);
  reviewNode.parentNode.removeChild(reviewNode);
});

reviews.addEventListener('click', (e) => {
  var reviewNode = e.target.parentNode

  // ATUALIZA IMOVEIS
  if (e.target.classList.contains('edit')) {
    fullName.value = reviewNode.querySelector('.fullName').innerText;
    message.value  = reviewNode.querySelector('.message').innerText;
    hiddenId.value = reviewNode.id;
  }

  // APAGA IMOVEIS
  if (e.target.classList.contains('delete')) {
    var id = reviewNode.id;
    db.ref('imoveis/' + id).remove();
  }
});

function reviewTemplate({fullName, message}) {
  return `
    <div class='fullName'>${fullName}</div>
    <div class='message'>${message}</div>
    <button class='delete'>Delete</button>
    <button class='edit'>Edit</button>
  `
};
