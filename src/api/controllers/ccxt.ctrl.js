'use strict';

var path = require('path'),
    ccxtModule = require(path.join(__basedir, 'ccxt'))
;

exports.fetch_exchanges = (req, res, next)=>{

    ccxtModule.getExchanges()
        .then((exchanges)=>{

            res.json(exchanges);
        })
        .catch((err)=>{

            res.status(500).json(err.stack);
        })
    ;
};

exports.get_arbitrage_pairs = (req, res, next)=>{

    var exchangeIds = req.query.exchanges.split(',');

    ccxtModule.getArbitragePairs(exchangeIds)
        .then((pairs)=>{

            res.json(pairs);
        })
        .catch((err)=>{

            res.status(500).json(err.stack);
        })
    ;
};

exports.fetch_ohlcv_data = (req, res, next)=>{

    var exchangeName = req.params.exchangeName;
    var marketSymbol = req.params.marketSymbol;
    var options = req.query;

    ccxtModule.getOHLCVData(exchangeName, marketSymbol, options)
        .then((OHLCVData)=>{

            res.json(OHLCVData);
        })
        .catch((err)=>{

            res.status(500).json(err.stack);
        })
    ;
};