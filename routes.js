const { auth } = require('./auth');
const { getUsers, getUser, signup, login, createAccount, getUserAccount, widthdraw, deposit, transfer } = require('./controller');

const router = require('express').Router();

router.get('/', (req, res) => {
    res.send("<h1>E-Wallet</h1>");
});

//authentication and onboarding route
router.post('/signup', signup)
router.post('/login', login)

//user routes
router.get('/users', auth , getUsers);
router.get('/user/:id', auth , getUser);


//account routes
router.post('/create-account', auth , createAccount);
router.get('/get-user-account', auth , getUserAccount);
router.post('/withdraw', auth , widthdraw);
router.post('/deposit', auth , deposit);
router.post('/transfer', auth , transfer);





module.exports = router;