'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const loginPassword = document.querySelector('#password'); //не используется, сделать проверку поля ввода пароля
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const buttonLogin = document.querySelector('.button-login');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const footerLogo = document.querySelector('.footer-logo');
const cardsMenu = document.querySelector('.cards-menu');

/*получаем данные из localStorage, если пользователь уже авторизован
- на случай обновления страницы*/
let login = localStorage.getItem('deliveryFood');

//выводим на экран модальное окно корзины
function toggleModal() {
  modal.classList.toggle("is-open");
}

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

      //для избежания повторений событий авторизации, если пользователь уже авторизован:
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

//создаем карточку с рестораном
function createCardRestaurant() {
  const card = `
    <a href="#" class="card card-restaurant">
      <img
        src="img/pizza-plus/preview.jpg"
        alt="image"
        class="card-image"
      />
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">Пицца плюс</h3>
          <span class="card-tag tag">50 мин</span>
        </div>
        <div class="card-info">
          <div class="rating">4.5</div>
          <div class="price">От 900 ₽</div>
          <div class="category">Пицца</div>
        </div>                
      </div>              
    </a>
  `

  //внедряем карточку внутрь элемента HTML (в конец) с классом cards-restaurants
  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

//создаем карточку товара в выбранном ресторане
function createCardGood() {
  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
    <img
      src = "img/pizza-plus/pizza-vesuvius.jpg"
      alt = "image"
      class = "card-image"
    />
    <div class = "card-text">
      <div class = "card-heading">
        <h3 class = "card-title card-title-reg" > Пицца Везувий </h3>
      </div> 
      <div class = "card-info">
        <div class = "ingredients">
          Соус томатный, сыр« Моцарелла», ветчина, пепперони, перец« Халапенье», соус« Тобаско», томаты. 
          </div> 
      </div>
      <div class = "card-buttons">
        <button class = "button button-primary button-add-cart">
          <span class = "button-card-text" > В корзину </span> 
          <span class = "button-cart-svg" > </span> 
        </button> 
        <strong class = "card-price-bold"> 545₽ </strong> 
      </div> 
    </div>         
  `);

  cardsMenu.insertAdjacentElement('beforeend', card);
}

//моделируем переход на страницу с товарами выбранного ресторана, 
function openGoods(event) {

  if (login) {
    const target = event.target; //элемент, по которому кликнули мышью

    /*closest поднимается выше по дереву в поисках элемента с заданным селектором
    - нужно получить карточку ресторана*/
    const restaurant = target.closest('.card-restaurant');

    //проверяем, юыл ли клик на элементах карточки ресторана (не пустое значение)
    if (restaurant) {
      cardsMenu.textContent = '';

      //фактически на главной странице скрываем ненужные элементы и показываем нужные
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      //создаем карточки товаров в меню ресторана
      createCardGood();
      createCardGood();
      createCardGood();
    }
  } else toggleModalAuth();
}

cartButton.addEventListener('click', toggleModal); //при клике на корзину открываем модальное окно

close.addEventListener('click', toggleModal); //при клике на крестик закрываем окно корзины

//при клике на карточку ресторана открываем карточки с его меню
cardsRestaurants.addEventListener('click', openGoods); 

//возврат к главной странице по клику на лого в шапке
logo.addEventListener('click', function () {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
})

//возврат к главной странице по клику на лого в футере
footerLogo.addEventListener('click', function () {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
})

//первичный запуск функции для получения первого значения login
checkAuth();

//рендерим карточки ресторанов
createCardRestaurant();
createCardRestaurant();
createCardRestaurant();