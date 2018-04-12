'use strict';

var express = require('express'),
    router = express.Router(),
    ccxtCtrl = require('../controllers/ccxt.ctrl')
;

router.route('/exchanges')
    .get(ccxtCtrl.fetch_exchanges)
;

router.route('/exchanges/:exchangeName/markets/:marketSymbol/ohlcv')
    .get(ccxtCtrl.fetch_ohlcv_data)
;

router.route('/arbitrage')
    .get(ccxtCtrl.get_arbitrage_pairs)
;

module.exports = router;