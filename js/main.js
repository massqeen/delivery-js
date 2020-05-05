const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

//day1

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');

let login = localStorage.getItem('deliveryFood');

function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
}

function authorized() {
  function logOut() {
    login = null;
    localStorage.removeItem('deliveryFood');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    logInForm.reset();
    checkAuth();
  }

  console.log('authorized');
  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline-block';
  buttonOut.style.display = 'block';
  buttonOut.addEventListener('click', logOut);
}

function notAuthorized() {
  console.log('not authorized');

  function logIn(event) {
    event.preventDefault();
    login = loginInput.value;
    localStorage.setItem('deliveryFood', login);
    toggleModalAuth();
    buttonAuth.removeEventListener('click', toggleModalAuth);
    closeAuth.removeEventListener('click', toggleModalAuth);
    logInForm.removeEventListener('submit', logIn);
    checkAuth();
  }
  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

checkAuth();