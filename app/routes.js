const express = require('express');
const router = express.Router();

// rute-rute yang tersedia pada app
require('./routes/login').register(router);
require('./routes/logout').register(router);
require('./routes/register').register(router);
require('./routes/admin').register(router);
require('./routes/shop').register(router);
require('./routes/default').register(router);
require('./routes/cart').register(router);

module.exports = router;