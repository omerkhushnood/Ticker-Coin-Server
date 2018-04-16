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

    'binance','bittrex','kucoin','yobit','bitfinex','bitfinex2','bitstamp','cryptopia','okex','quadrigacx',
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

exports.getArbitragePairs = (exchangeIds)=>{

    let proxies = [
        '', // no proxy by default
        'https://crossorigin.me/',
        'https://cors-anywhere.herokuapp.com/'
    ];

    return new Promise((resolve, reject)=>{

        (async ()=>{

            let ids = exchangeIds;
            let exchanges = {};

            // load all markets from all exchanges 
            for (let id of ids) {

                // instantiate the exchange by id
                let exchange = new ccxt[id] ();

                // save it in a dictionary under its id for future use
                exchanges[id] = exchange;

                try{

                    // load all markets from the exchange
                    let markets = await exchange.loadMarkets();
                }
                catch(e){

                    //
                }

                // basic round-robin proxy scheduler
                let currentProxy = 0;
                let maxRetries   = proxies.length;
                
                for (let numRetries = 0; numRetries < maxRetries; numRetries++) {

                    try { // try to load exchange markets using current proxy

                        exchange.proxy = proxies[currentProxy];
                        await exchange.loadMarkets();

                    } catch (e) { // rotate proxies in case of connectivity errors, catch all other exceptions

                        // swallow connectivity exceptions only
                        if (e instanceof ccxt.DDoSProtection || e.message.includes ('ECONNRESET')) {
                            //log.bright.yellow ('[DDoS Protection Error] ' + e.message)
                        } else if (e instanceof ccxt.RequestTimeout) {
                            //log.bright.yellow ('[Timeout Error] ' + e.message)
                        } else if (e instanceof ccxt.AuthenticationError) {
                            //log.bright.yellow ('[Authentication Error] ' + e.message)
                        } else if (e instanceof ccxt.ExchangeNotAvailable) {
                            //log.bright.yellow ('[Exchange Not Available Error] ' + e.message)
                        } else if (e instanceof ccxt.ExchangeError) {
                            //log.bright.yellow ('[Exchange Error] ' + e.message)
                        } else {
                            throw e; // rethrow all other exceptions
                        }

                        // retry next proxy in round-robin fashion in case of error
                        currentProxy = ++currentProxy % proxies.length;
                    }
                }
            }

            // get all unique symbols
            let uniqueSymbols = ccxt.unique (ccxt.flatten (ids.map (id => exchanges[id].symbols)));

            // filter out symbols that are not present on at least two exchanges
            let arbitrableSymbols = uniqueSymbols
                .filter (symbol => 
                    ids.filter (id => 
                        (exchanges[id].symbols.indexOf (symbol) >= 0)).length > 1)
                .sort ((id1, id2) => (id1 > id2) ? 1 : ((id2 > id1) ? -1 : 0));

            // print a table of arbitrable symbols
            let table = arbitrableSymbols.map (symbol => {
                let row = {

                    symbol: symbol,
                    presence: {}
                };
                for (let id of ids)
                    if (exchanges[id].symbols.indexOf (symbol) >= 0)
                        row.presence[id] = id;
                return row;
            })

            resolve(table);
        })();
    });
};
