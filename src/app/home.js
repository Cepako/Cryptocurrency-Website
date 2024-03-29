const coins = document.querySelectorAll('.coin'),
  coinNames = document.querySelectorAll('.coin__name'),
  coinPercents = document.querySelectorAll('.coin__percent'),
  coinPrices = document.querySelectorAll('.coin__price');

async function getCoinsInfo() {
  const apiLink =
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=4&page=1&sparkline=false&locale=en&precision=2';
  const apiKey = '?api_key=CG-j1vfxzxeKiAR7yTq835R7CUt';
  let data;
  try {
    const response = await fetch(apiLink + apiKey);
    data = await response.json();
  } catch (err) {
    console.log(err);
    throw err;
  }
  for (let i = 0; i < coins.length; i++) {
    const coinIcon = document.createElement('img');
    coinIcon.classList.add('coin__icon');
    coinIcon.src = data[i].image;
    coinIcon.alt = data[i].name;
    coins[i].prepend(coinIcon);

    const percent = data[i].price_change_percentage_24h.toFixed(2);

    coinNames[i].innerHTML = `${
      data[i].name
    } <span class="coin__percent" style="color:${
      percent < 0 ? 'red' : 'lightgreen'
    }" >${percent}%</span>`;
    coinPrices[i].textContent = `$ ${data[i].current_price.toFixed(2)}`;
  }
}
getCoinsInfo();

const burger = document.querySelector('.burger'),
  xBtn = document.querySelector('.fa-x'),
  menu = document.querySelector('.menu__list'),
  menuButtons = document.querySelectorAll('.menu__list__item');
burger.addEventListener('click', () => {
  menu.classList.add('active');
  xBtn.classList.add('active');
});
xBtn.addEventListener('click', () => {
  menu.classList.remove('active');
  xBtn.classList.remove('active');
});

menuButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    menu.classList.remove('active');
    xBtn.classList.remove('active');
  });
});
