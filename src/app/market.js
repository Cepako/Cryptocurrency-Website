import { async } from 'regenerator-runtime';

const apiUrl =
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d&locale=en&precision=2',
  apiKey = '?api_key=CG-j1vfxzxeKiAR7yTq835R7CUt',
  table = document.querySelector('table');
let data;

function generateTable(data, index) {
  table.innerHTML = ``;
  table.innerHTML += `<tbody><tr>
            <th>Coin</th>
            <th>Price</th>
            <th>1h</th>
            <th>24h</th>
            <th>7d</th>
            <th>Market Cap</th>
            <th>Last 7 Days</th>
          </tr></tbody>`;
  for (let i = index * 20; i < (index + 1) * 20; i++) {
    const tr = document.createElement('tr'),
      tdImg = document.createElement('td'),
      div = document.createElement('div'),
      img = document.createElement('img'),
      p = document.createElement('p'),
      tdPrice = document.createElement('td'),
      tdHour = document.createElement('td'),
      spanHour = document.createElement('span'),
      tdHours = document.createElement('td'),
      spanHours = document.createElement('span'),
      tdDays = document.createElement('td'),
      spanDays = document.createElement('span'),
      tdCanvas = document.createElement('td'),
      tdMarketCap = document.createElement('td'),
      canvas = document.createElement('canvas');
    p.textContent = data[i].name;
    img.src = data[i].image;
    img.alt = data[i].name;
    div.classList.add('coin-wrapper');
    div.appendChild(img);
    div.appendChild(p);
    tdImg.appendChild(div);
    tr.appendChild(tdImg);
    const price = data[i].current_price.toString();
    tdPrice.textContent = `$ ${price.length < 4 ? price + '.00' : price}`;
    tr.appendChild(tdPrice);

    const daysPercent =
        data[i].price_change_percentage_7d_in_currency.toFixed(1),
      hourPercent = data[i].price_change_percentage_1h_in_currency.toFixed(1),
      hoursPercent = data[i].price_change_percentage_24h_in_currency.toFixed(1);

    spanHour.textContent = `${hourPercent}%`;
    spanHour.style.color = hourPercent > 0 ? 'lightgreen' : 'red';
    tdHour.appendChild(spanHour);
    tr.appendChild(tdHour);

    spanHours.textContent = `${hoursPercent}%`;
    spanHours.style.color = hoursPercent > 0 ? 'lightgreen' : 'red';
    tdHours.appendChild(spanHours);
    tr.appendChild(tdHours);

    spanDays.textContent = `${daysPercent}%`;
    spanDays.style.color = daysPercent > 0 ? 'lightgreen' : 'red';
    tdDays.appendChild(spanDays);
    tr.appendChild(tdDays);
    const marketCap = data[i].market_cap.toLocaleString();
    tdMarketCap.textContent = `$ ${marketCap}`;
    tr.appendChild(tdMarketCap);
    canvas.setAttribute('id', 'myChart');
    const ctx = canvas.getContext('2d');
    const canvasData = {
      labels: [],
      datasets: [
        {
          label: '',

          borderColor:
            daysPercent > 0 ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 0, 0, 1)', // Kolor linii wykresu
          borderWidth: 1, // Grubość linii
          pointRadius: 0,
          data: [], // Wartości danych
        },
      ],
    };
    for (let j = 0; j < data[i].sparkline_in_7d.price.length; j++) {
      canvasData.labels.push('');
      canvasData.datasets[0].data.push(data[i].sparkline_in_7d.price[j]);
    }
    const myChart = new Chart(ctx, {
      type: 'line', // Typ wykresu (liniowy w tym przypadku)
      data: canvasData,
      options: {
        scales: {
          x: {
            display: false, // Ukryj oś X (czasami oznaczaną jako 'xAxes')
          },
          y: {
            display: false, // Ukryj oś Y (czasami oznaczaną jako 'yAxes')
          },
        },
        plugins: {
          legend: {
            display: false, // Ukryj legendę
          },
        },
      },
    });
    canvas.setAttribute('width', 135);
    canvas.setAttribute('height', 50);
    canvas.style.width = '135px';
    canvas.style.height = '50px';
    tdCanvas.appendChild(canvas);
    tdCanvas.style.maxWidth = '160px';
    tdCanvas.style.maxHeight = '80px';
    tr.appendChild(tdCanvas);
    table.appendChild(tr);
  }
}

async function getMarketInfo() {
  try {
    const response = await fetch(apiUrl + apiKey);
    data = await response.json();
  } catch (err) {
    console.log(err);
    throw err;
  }
  generateTable(data, 0);
}

getMarketInfo();

const pageButtons = document.querySelectorAll('.market__pages__page');

pageButtons.forEach((button, i) => {
  button.addEventListener('click', () => {
    if (!button.classList.contains('chosen')) {
      generateTable(data, i);
      pageButtons.forEach((button) => {
        button.classList.remove('chosen');
      });
      button.classList.add('chosen');
    }
  });
});
