const API_KEY = '8MBMFVYPYXNN27HK';
const SECTOR_API_URL = 'https://www.alphavantage.co/query?function=SECTOR&apikey=' + API_KEY;
const STOCK_API_URL = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=SHOP.TRT&outputsize=full&apikey=' + API_KEY;
const GLOBAL_QUOTE_API_URL = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=';

const symbolInput = document.querySelector('#symbol');
const stockList = document.querySelector('#stock-list');

function updateStockList(stockData) {
  let html = '';

  for (let i = 0; i < 10; i++) {
    const symbol = Object.keys(stockData)[i];
    const change = stockData[symbol];
    const changeColor = parseFloat(change) > 0 ? 'green' : 'red';
    html += `
      <li>
        <span class="symbol">${symbol}</span>
        <span class="change" style="color: ${changeColor}">${change}</span>
      </li>
    `;
  }

  stockList.innerHTML = html;
}

function updateStockDetails(symbol, quote) {
  if (quote && quote['10. change percent']) {
    const changePercent = quote['10. change percent'].replace('%', '');
    const changeColor = parseFloat(changePercent) >= 0 ? 'green' : 'red';
    const html = `
      <li>
        <span class="symbol">${symbol}</span>
        <span class="change" style="color: ${changeColor}">${changePercent}</span>
      </li>
    `;
    stockList.innerHTML = html;
  } else {
    stockList.innerHTML = '<li>Símbolo não conhecido</li>';
  }
}

function handleFormSubmit(event) {
  event.preventDefault();
  const symbol = symbolInput.value.toUpperCase();
  fetchStockData(symbol);
}

function fetchTopStocks() {
  fetch(STOCK_API_URL || SECTOR_API_URL)
    .then(response => response.json())
    .then(data => {
      const stock = data['Rank A: Real-Time Performance'];
      updateStockList(stock);
    })
    .catch(error => console.error(error));
}

function fetchStockData(symbol) {
  if (!symbol) {
    fetchTopStocks();
    return;
  }

  const url = `${GLOBAL_QUOTE_API_URL}${symbol}&apikey=${API_KEY}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const quote = data['Global Quote'];
      updateStockDetails(symbol, quote);
    })
    .catch(error => console.error(error));
}

fetchTopStocks();

document.querySelector('form').addEventListener('submit', handleFormSubmit);
