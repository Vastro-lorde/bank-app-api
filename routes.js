
const router = require('express').Router();

router.get('/', (req, res) => {
    res.send("<h1>E-Wallet</h1>");
});

module.exports = router;