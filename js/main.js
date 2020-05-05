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
const loginPassword = document.querySelector('#password'); //не используется, сделать проверку поля ввода пароля
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const buttonLogin = document.querySelector('.button-login');

/*получаем данные из localStorage, если пользователь уже авторизован
- на случай обновления страницы*/
let login = localStorage.getItem('deliveryFood');

//выводит на экран модальное окно авторизации
function toggleModalAuth() {
  loginInput.style.borderColor = ''; // обнуляем красную границу поля после неправильного ввода логина
  loginInput.style.borderRadius = '';
  modalAuth.classList.toggle('is-open');
}

function notAuthorized() {
  console.log('not authorized');

  function logIn(event) {
    event.preventDefault(); //запрещаем обновлять страницу при нажатии submit
    //проверяем, не пустое ли поле логина (так же обрезаем пробелы)
    if (loginInput.value.trim()) {
      login = loginInput.value; //получаем данные из поля логина после нажатия submit
      localStorage.setItem('deliveryFood', login); //записываем логин в localStorage
      toggleModalAuth(); //закрываем окно авторизации

      //для избежания повторений, если пользователь уже авторизован:
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      checkAuth();
    } else {
      loginInput.style.borderColor = '#cc3f71'; //ошибка в поле логина - пустое или с пробелами
      loginInput.style.borderRadius = '3px';
    }
  }
  buttonAuth.addEventListener('click', toggleModalAuth); //выводим окно авторизации при клике на кнопку Войти
  closeAuth.addEventListener('click', toggleModalAuth); //закрываем окно авторизации при клике на крестик
  logInForm.addEventListener('submit', logIn); //авторизуем пользователя и выполняем функцию logIn
}

function authorized() {
  function logOut() {
    login = null; //обнуляем переменную для соответствия состоянию notAuthorized
    localStorage.removeItem('deliveryFood'); //удаляем данные login из localStorage

    //сбрасываем стили элементов до первоначальных значений из css
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    logInForm.reset(); //удаляем заполненные данные формы
    checkAuth();
  }
  console.log('authorized');
  userName.textContent = login; //выводим в элемент .user-name значение login - для отображение имени пользователя в шапке
  buttonAuth.style.display = 'none'; //убираем кнопку логина для авторизованного пользователя
  userName.style.display = 'inline-block'; //выводим логин в шапку
  buttonOut.style.display = 'block'; //выводим кнопку выхода в шапку
  buttonOut.addEventListener('click', logOut); //запускаем функцию выхода при клике на кнопку
}

//проверяем состояние авторизации в зависимости от значения login
function checkAuth() {
  if (login) { //если login пустой то false
    authorized();
  } else {
    notAuthorized();
  }
}

//первичный запуск функции для получения первого значения login
checkAuth();

function checkFields() {
  if (loginInput.value !== "") {
    return true;
  } else {
    alert("Заполните поле логина");
    return false;
  }
}