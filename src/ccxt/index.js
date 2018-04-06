'use strict';

var ccxt = require('ccxt');

// Filtered from available exchanges in ccxt.exchanges
const TESTED_EXCHANGES = [

    '_1btcxe',
    'acx', 'allcoin',
    'binance', 'bit2c', 'bitbank', 'bitfinex', 'bitfinex2', 'bitflyer', 'bithumb', 'bitlish', 'bitso', 'bitstamp',
    'bitstamp1', 'bitz', 'bl3p', 'braziliex', 'btcbox', 'btcmarkets', 'btctradeim', 'btctradeua', 'btcturk',
    'ccex', 'chilebit', 'cobinhood', 'coincheck', 'coinex', 'coinfloor', 'coingi', 'coinmate', 'coinnest', 'coinone', 'coinsecure', 'coolcoin', 'cryptopia',
    'dsx',
    'ethfinex', 'exmo', 'exx',
    'flowbtc', 'foxbit', 'fybsg',
    'gatecoin', 'gateio', 'gemini', 'getbtc',
    'hadax', 'hitbtc', 'hitbtc2', 'huobipro',
    'independentreserve', 'indodax', 'itbit',
    'kraken', 'kucoin', 'kuna',
    'lakebtc', 'lbank', 'liqui', 'livecoin', 'luno',
    'mercado', 'mixcoins',
    'negociecoins', 'nova',
    'okcoincny', 'okcoinusd', 'okex',
    'paymium',
    'qryptos', 'quadrigacx', 'quoinex',
    'southxchange', 'surbitcoin',
    'therock', 'tidex',
    'urdubit',
    'vaultoro', 'vbtc', 'virwox',
    'wex',
    'yobit',
    'zaif', 'zb'
];

// Filtered from TESTED_EXCHANGES
const TOP_25_EXCHANGES = [

    'binance','yobit','bitfinex','bitfinex2','bitstamp','cryptopia','okex','quadrigacx',
    'liqui','bithumb','bitz','bitso','gemini','kraken','wex','coinone','hitbtc',
    'bitflyer','vaultoro','lakebtc','coinfloor','itbit','acx','gatecoin','ccex'
];

exports.getExchanges = ()=>{

    return new Promise((resolve, reject)=>{

        // resolve(ccxt.exchanges);
        // resolve(TESTED_EXCHANGES);
        resolve(TOP_25_EXCHANGES);
    });
};

exports.getMarkets = (exchangeName)=>{

    return new Promise((resolve, reject)=>{

        let exchange = new ccxt[exchangeName]();
        exchange.load_markets()
            .then((markets)=>{

                resolve(markets);
            })
            .catch((err)=>{

                reject(err);
            })
        ;
    });
};

exports.getOHLCVData = (exchangeName, marketSymbol, options)=>{

    return new Promise((resolve, reject)=>{

        // Wait 2secs to avoid getting blacklisted by exchange api, in case of frequent requests.
        (async ()=>{await new Promise(resolve => setTimeout(resolve, 2000))})();

        let _DEFAULT_SINCE_DATE = new Date();
        _DEFAULT_SINCE_DATE.setDate(_DEFAULT_SINCE_DATE.getDate()-1);
        _DEFAULT_SINCE_DATE = _DEFAULT_SINCE_DATE.getTime();

        let exchange = new ccxt[exchangeName]();
        (async ()=>{

            await exchange.load_markets();

            exchange.fetchOHLCV(marketSymbol, options.timeframe||'15m', options.since||_DEFAULT_SINCE_DATE, Number(options.limit)||undefined)
                .then((OHLCVData)=>{

                    resolve(OHLCVData);
                })
                .catch((err)=>{

                    reject(err);
                })
            ;
        })();
    });
};
