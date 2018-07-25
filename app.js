const express = require('express');
const fetch = require('node-fetch');

const app = express();

const getUSDPrice = async (id) => {
  try {
    const res = await fetch(`https://api.coinmarketcap.com/v2/ticker/${id}`);
    const json = await res.json();
    return json.data.quotes.USD.price;
  } catch (err) {
    return err;
  }
};

const getBTCPrice = async (id) => {
  try {
    const res = await fetch(`https://api.coinmarketcap.com/v2/ticker/${id}/?convert=BTC`);
    const json = await res.json();
    return json.data.quotes.BTC.price;
  } catch (err) {
    return err;
  }
};

const getPrice = async (ticker, currency) => {
  try {
    const res = await fetch('https://api.coinmarketcap.com/v2/listings/');
    const json = await res.json();
    let coinId;
    json.data.forEach((coin) => {
      if (coin.symbol === ticker) {
        coinId = coin.id;
      }
    });
    if (coinId) {
      if (currency === 'USD') {
        return await getUSDPrice(coinId);
      }
      return await getBTCPrice(coinId);
    }
    throw new Error('Coin not found');
  } catch (err) {
    return err;
  }
};

/**
 *  Get price of coin by ticker and currency
 *  Supported currencies: 'BTC', 'USD'
 */
app.get('/price/:ticker/:currency', async (req, res) =>
  res.json(await getPrice(req.params.ticker, req.params.currency)));

/**
 *  Get price of coin by ticker in BTC
 */
app.get('/price/:ticker/', async (req, res) => res.json(await getPrice(req.params.ticker)));

app.listen(process.env.PORT || 3000);
