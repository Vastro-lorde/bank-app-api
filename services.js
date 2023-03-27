//tables
exports.tables = {
    users: 'Users',
    accounts: 'Accounts',
    transactions: 'Transactions'
}

//transactionType
exports.transactionType = {
    credit: 'credit',
    debit: 'debit',
    transfer: 'transfer'
}

//error response
exports.errorResponse = (response, error) =>{
    return response.status(500).json({
        success: false,
        message: error.message
      });
}

exports.createAccountNumber = () =>{
    return `1${Math.floor(Math.random() * 90000000) + 10000000}`;
}