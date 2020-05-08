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
const restaurantTitle = document.querySelector('.restaurant-title');
const rating = document.querySelector('.rating');
const minPrice = document.querySelector('.price');
const category = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart')

const cart = [];

//загрузка корзины из local storage для логина
const loadCart = function () {
  if (localStorage.getItem(login + '')) {
    JSON.parse(localStorage.getItem(login)).forEach(function (item) {
      cart.push(item);
    })
  }
}

//добавление содержимого корзины в local storage
const saveCart = function () {
  localStorage.setItem(login, JSON.stringify(cart))
}

/*получаем данные из localStorage, если пользователь уже авторизован
- на случай обновления страницы*/
let login = localStorage.getItem('deliveryFood');

//асинхронная функция запроса на сервер
const getData = async function (url) {

  //получаем результат c сервера по url
  const response = await fetch(url);

  //проверяем получение данных и скидываем ошибку если не true (не ок)
  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, 
    статус ошибки ${response.status}!`);
  }
  return await response.json();
}

getData('./db/partners.json');
console.log(getData('./db/partners.json'));

const valid = function (str) { //идентично записи function valid(str) {}
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/; //валидация имени пользователя
  return nameReg.test(str);
}

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
    if (valid(loginInput.value.trim())) { //валидируем имя пользователя функцией valid()
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

//возврат к списку ресторанов - на случай logout пользователя на странице меню
function returnMain() {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
}

function authorized() {
  function logOut() {
    login = null; //обнуляем переменную для соответствия состоянию notAuthorized
    localStorage.removeItem('deliveryFood'); //удаляем данные login из localStorage

    //сбрасываем стили элементов до первоначальных значений из css
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    logInForm.reset(); //удаляем заполненные данные формы
    checkAuth();
    returnMain(); //возвращаем неавторизованного пользователя на главную страницу
  }
  console.log('authorized');
  userName.textContent = login; //выводим в элемент .user-name значение login - для отображение имени пользователя в шапке
  buttonAuth.style.display = 'none'; //убираем кнопку логина для авторизованного пользователя
  userName.style.display = 'inline-block'; //выводим логин в шапку
  buttonOut.style.display = 'flex'; //выводим кнопку выхода в шапку
  buttonOut.addEventListener('click', logOut); //запускаем функцию выхода при клике на кнопку
  cartButton.style.display = 'flex'; //выводим кнопку коризны в шапку

  //добавляем содержимое корзины в local storage
  loadCart();
}

//проверяем состояние авторизации в зависимости от значения login
function checkAuth() {
  if (login) { //если login пустой то false
    authorized();
  } else {
    notAuthorized();
  }
}

//создаем карточку с рестораном, данные получаем из функции getData
function createCardRestaurant(restaurantData) {

  //деструктуризация данных restaurantData
  const {
    image,
    kitchen,
    name,
    price,
    products,
    stars,
    time_of_delivery: timeOfDelivery
  } = restaurantData; //во время деструктуризации можно переименовывать данные - см. timeOfDelivery

  const card = `
    <a href="#" class="card card-restaurant"
      data-products="${products}" 
      data-restaurant-info = "${[name, price, stars, kitchen]}"
      >
      <img
        src="${image}"
        alt="image"
        class="card-image"
      />
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
          <span class="card-tag tag">${timeOfDelivery} мин</span>
        </div>
        <div class="card-info">
          <div class="rating">${stars}</div>
          <div class="price">От ${price} ₽</div>
          <div class="category">${kitchen}</div>
        </div>                
      </div>              
    </a>
  `

  //внедряем карточку внутрь элемента HTML (в конец) с классом cards-restaurants
  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

//создаем карточку товара в выбранном ресторане
function createCardGood(goodsData) {

  const {
    name,
    description,
    price,
    image,
    id
  } = goodsData

  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
    <img
      src = "${image}"
      alt = "${name}"
      class = "card-image"
    />
    <div class = "card-text">
      <div class = "card-heading">
        <h3 class = "card-title card-title-reg">${name}</h3>
      </div> 
      <div class = "card-info">
        <div class = "ingredients">
          ${description} 
        </div> 
      </div>
      <div class = "card-buttons">
        <button class = "button button-primary button-add-cart" id="${id}">
          <span class = "button-card-text">В корзину</span> 
          <span class = "button-cart-svg"></span> 
        </button> 
        <strong class = "card-price card-price-bold">${price}₽ 
        </strong> 
      </div> 
    </div>         
  `);

  cardsMenu.insertAdjacentElement('beforeend', card);
}

//моделируем переход на страницу с товарами выбранного ресторана, 
function openGoods(event) {
  const target = event.target; //элемент, по которому кликнули мышью

  /*closest поднимается выше по дереву в поисках элемента с заданным селектором
  - нужно получить карточку ресторана*/
  const restaurant = target.closest('.card-restaurant');

  //проверяем, юыл ли клик на элементах карточки ресторана (не пустое значение)
  if (restaurant) {


    if (login) { //открываем карточки меню только для авторизованного пользователя

      const info = restaurant.dataset.restaurantInfo.split(',');
      const [name, price, stars, kitchen] = info;

      cardsMenu.textContent = '';

      //фактически на главной странице скрываем ненужные элементы и показываем нужные
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      restaurantTitle.textContent = name;
      rating.textContent = stars;
      minPrice.textContent = `От ${price} ₽`;
      category.textContent = kitchen;


      /*получаем дынные из объекта dataset (содержит все data-атрибуты) - 
      данные о продуктах записаны в карточке ресторана в атрибуте data - products*/
      getData(`./db/${restaurant.dataset.products}`).then(function (data) {
        data.forEach(createCardGood); //для каждого объекта data выполняем функцию генерации карточки меню - 6 карточек
      });

    } else toggleModalAuth(); //если пользователь не авторизован выводим окно авторизации    
  }
}

//создаем функцию поиска для поля Поиск блюд и ресторанов
function searchRestaurants(event) {

  if (event.keyCode === 13) {
    const target = event.target;
    const value = target.value.toLowerCase().trim();
    target.value = '';

    if (!value || value.length < 3) {
      target.style.backgroundColor = 'tomato';
      setTimeout(function () {
        target.style.backgroundColor = '';
      }, 2000);
      return;
    }

    const goods = [];

    getData('./db/partners.json')
      .then(function (data) {

        const products = data.map(function (item) {
          return item.products;
        });

        products.forEach(function (product) {
          getData(`./db/${product}`)
            .then(function (data) {

              goods.push(...data);

              const searchGoods = goods.filter(function (item) {
                return item.name.toLowerCase().includes(value)
              })

              console.log(searchGoods);

              cardsMenu.textContent = '';

              containerPromo.classList.add('hide');
              restaurants.classList.add('hide');
              menu.classList.remove('hide');

              restaurantTitle.textContent = 'Результат поиска';
              rating.textContent = '';
              minPrice.textContent = '';
              category.textContent = '';

              return searchGoods;
            })
            .then(function (data) {
              data.forEach(createCardGood);
            })
        })
      });
  }
}

function addToCart(event) {

  const target = event.target; //событие клика выводим в переменную target
  const buttonAddToCard = target.closest('.button-add-cart'); //получаем кнопку при клике на любой элемент кнопки

  if (buttonAddToCard) {
    // получаем карточку товара, соответствующего нажатой кнопке
    const card = target.closest('.card');

    //внутри полученной карточки получаем название и цену (в виде текста, а не элемента!)для передачи в корзину
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;

    //получаем id кнопки добавления товара из карточки
    const id = buttonAddToCard.id;

    //проверяем, есть ли уже в массиве cart товар с искомым id, если есть увеличиваем count на 1
    const food = cart.find(function (item) {
      return item.id === id;
    })
    if (food) {
      food.count += 1;
    } else {
      //отправляем полученные данные в переменную cart в виде массива
      cart.push({
        id,
        title,
        cost,
        count: 1
      });
    }
  }

  //сохраняем содержимое корзины в local storage
  saveCart();
}

//формируем список товаров, добавленных в корзину
function renderCart() {

  //очищаем корзину при ее запуске
  modalBody.textContent = '';

  //генерируем строки с товарами
  cart.forEach(function ({
    id,
    title,
    cost,
    count
  }) {
    const itemCart = `
      <div class = "food-row">
        <span class = "food-name">${title}</span> 
        <strong class = "food-price">${cost}</strong>
        <div class = "food-counter">
          <button class = "counter-button counter-minus" data-id="${id}">-</button>
          <span class = "counter">${count}</span>
          <button class = "counter-button counter-plus" data-id="${id}">+</button>
        </div> 
      </div>
    `;
    modalBody.insertAdjacentHTML('beforeend', itemCart);
  });

  //считаем общую сумму покупки
  const totalPrice = cart.reduce(function (result, item) {
    return result + (parseFloat(item.cost) * item.count);
  }, 0);

  modalPrice.textContent = totalPrice + ' ₽';
}

//меняем количество товаров в корзине по щелчку на + или -
function changeCount(event) {
  const target = event.target;

  if (target.classList.contains('counter-button')) {
    const food = cart.find(function (item) {
      return item.id === target.dataset.id;
    });
    if (target.classList.contains('counter-minus')) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1); //удаляем из списка корзины элемент с количеством 0
      }
    }
    if (target.classList.contains('counter-plus')) food.count++;

    renderCart();
  }
  //при изменении содержимого корзины сохраняем в local storage
  saveCart();
}

//создаем функцию инициализации (на случай если нужно перезапустить все скрипты)
function init() {

  //обрабатываем полученный функцией promise с помощью then получаем массив с 6 объектами - data
  getData('./db/partners.json').then(function (data) {
    data.forEach(createCardRestaurant); //для каждого объекта data выполняем функцию генерации карточки - 6 карточек
  });

  cartButton.addEventListener('click', function () {
    renderCart(); //формируем список товаров в корзине
    toggleModal(); //при клике на корзину открываем модальное окно
  });

  //меняем количество товаров в корзине по щелчку на + или -
  modalBody.addEventListener('click', changeCount);

  cardsMenu.addEventListener('click', addToCart); // при клике на карточку меню запускаем функцию добавления товара в корзину

  //очищаем корзину при нажатии Отмена - делаем длину массива 0
  buttonClearCart.addEventListener('click', function () {
    cart.length = 0;
    renderCart();
  })

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


  //поиск ресторанов и меню на главной странице
  inputSearch.addEventListener('keydown', searchRestaurants);

  //настраиваем и запускаем промо-слайдер
  new Swiper('.swiper-container', {
    loop: true,
    autoplay: {
      delay: 3000,
    },
  })
}

init();