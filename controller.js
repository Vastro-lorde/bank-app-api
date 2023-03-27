const knex = require('./db/knex');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const { tables, transactionType, errorResponse, createAccountNumber } = require('./services');


//dynamic id checker
const checkEmailOrId = async ( data, table, email) => {
    const query = await knex(table).where(email?{email : email}:{id : data});
    return query;
 }

exports.signup = async (request, response) => {
    const {email, name, password} = request.body;
    // email plus addressing
    if (email.includes('+')) {
        response.status(400).json({
            success: false,
            message: 'wrong email format'
        });
    }
    else{
        //checking if user already exist in database
        const check = await checkEmailOrId('',tables.users, email);
        
        const dbTransaction = await knex.transaction();
        try {
            if (check.length === 0) {
                //hash user password
                const hashedPassword = await bcrypt.hash(password, 13);
                const user = await dbTransaction.insert({
                    name,
                    email,
                    password: hashedPassword
                }).into(tables.users).returning('*');
                await dbTransaction.commit();
                response.status(201).json({
                    data: user,
                    success: true,
                    message: `Successfully created`
                });
            }
            else{
                response.status(409).json({
                    success: false,
                    message: 'email already exist'
                });
            }
        } catch (error) {
            await dbTransaction.rollback();
            return errorResponse(response, error);
        }
    }
    
}

exports.login = async (request, response) => {
    const {email, password} = request.body;
    try {
        //checking if user already exist in database
        const check = await checkEmailOrId('',tables.users, email);
        console.log(check);
        if (check.length === 1) {
            const isPasswordMatching = await bcrypt.compare(password, check[0].password);
            if (isPasswordMatching) {
                const secret = process.env.JWT_SECRET;
                const dataStoredInToken = {
                    id: check.id
                  };
                const token = jwt.sign(dataStoredInToken,secret,{
                  expiresIn:"7d",
                  audience: process.env.JWT_AUDIENCE,
                  issuer: process.env.JWT_ISSUER
                });
                check.password = "";
                return response.status(200).json({
                    data: check,
                    success: true,
                    message: `Login Successfull`,
                    token: token 
                });
            }
            else {
                return response.status(401).json({
                    success: false,
                    message: "Username or Password incorrect"
                  });
            }
        }
        else {
            return response.status(404).json({
                success: false,
                message: "User not found"
              });
          }
        
    } catch (error) {
        return errorResponse(response, error);
    }
}

exports.getUsers = async (request, response) => {
    try {
        const users = await knex(tables.users);
        if (users) {
            response.status(200).json({
                data: users,
                success: true,
                message: `Successfull`
            });
        }
        else{
            response.status(404).json({
                success: false,
                message: 'Users not found'
              });
        }
    } catch (error) {
        return errorResponse(response, error);
    }
}

exports.getUser = async (request, response) => {
    try {
        const user = await checkEmailOrId(request.params.id, tables.users)
        if (user) {
            return response.status(200).json({
                data: user,
                success: true,
                message: `Successfull`
            });
        }
        else{
            return response.status(404).json({
                success: false,
                message: 'Users not found'
              });
        }
    } catch (error) {
        return errorResponse(response, error);
    }
}

exports.createAccount = async (request, response) => {
    const { user_id } = request.body;
    const user = await checkEmailOrId(user_id, tables.users)
    if (!user){
        return response.status(404).json({
            success: false,
            message: 'User not found'
          });
    }
    const dbTransaction = await knex.transaction();
    try {
        const account = await dbTransaction.insert({
            account_number: createAccountNumber(),
            user_id,
            balance: 0
        }).into(tables.accounts).returning('*');
        await dbTransaction.commit();
        return response.status(201).json({
            data: account,
            success: true,
            message: `Successfully created`
        });
    } catch (error) {
        await dbTransaction.rollback();
        return errorResponse(response, error);
    }

}

exports.getUserAccount = async (request, response) => {
    const {account_number} = request.body;
    try {
        const userAccount = await knex(tables.accounts).where({account_number})
        if (userAccount.length > 0) {
            return response.status(200).json({
                data: userAccount,
                success: true,
                message: `Successfull`
            });
        }
        else{
            return response.status(404).json({
                success: false,
                message: 'Account not found'
              });
        }
    } catch (error) {
        return errorResponse(response, error);
    }
}

exports.widthdraw = async (request, response) => {
    const {account_number, amount} = request.body;
    const userAccount = await knex(tables.accounts).where({account_number})
    console.log(userAccount);
    const dbTransaction = await knex.transaction();
    try {
        if (amount < 0) {
            return response.status(400).json({
                success: false,
                message: 'invalid input'
              });
        }
        if (userAccount.length < 1) {
            return response.status(404).json({
                success: false,
                message: 'Account not found'
              });
        }
        if (userAccount[0].balance < amount) {
            return response.status(400).json({
                success: false,
                message: 'not enough funds'
              });
        }
        const account_details = await dbTransaction(tables.accounts).where({account_number})
                                                                .decrement('balance',Math.abs(amount))
                                                                .update({updated_at: knex.fn.now()})
                                                                .returning('*');
        
        const createTransactionRecord = await dbTransaction.insert({
            sender_account_number: account_number,
            reciever_account_number: userAccount[0].account_number,
            transaction_type: transactionType.debit,
            sender_id: userAccount[0].user_id,
            reciever_id: userAccount[0].user_id, //request.user.id
            amount
                }).into(tables.transactions).returning('*');
        await dbTransaction.commit();
                response.status(201).json({
                    data: {
                        account_details,
                        transaction: createTransactionRecord,
                        previous_balance : userAccount[0].balance
                    },
                    success: true,
                    message: `withdrawal successful`
                });
    } catch (error) {
        await dbTransaction.rollback();
        return errorResponse(response, error);
    }
}

exports.deposit = async (request, response) => {
    const {account_number, amount} = request.body;
    const userAccount = await knex(tables.accounts).where({account_number})
    const dbTransaction = await knex.transaction();
    try {
        if (amount < 0) {
            return response.status(400).json({
                success: false,
                message: 'invalid input'
              });
        }
        else if (userAccount.length < 1) {
            return response.status(404).json({
                success: false,
                message: 'Account not found'
              });
        } else {
            const account_details = await dbTransaction(tables.accounts).where({account_number})
                                                                .increment('balance',Math.abs(amount))
                                                                .update({updated_at: knex.fn.now()})
                                                                .returning('*');
            
            
            const createTransactionRecord = await dbTransaction.insert({
                sender_account_number: account_number,
                reciever_account_number: account_number,
                transaction_type: transactionType.credit,
                sender_id: userAccount[0].user_id,
                reciever_id: userAccount[0].user_id, //request.user.id
                amount})
                .into(tables.transactions).returning('*');
            await dbTransaction.commit();
            return response.status(201).json({
                data: {
                    account_details,
                    transaction: createTransactionRecord,
                    previous_balance : userAccount[0].balance
                },
                success: true,
                message: `deposit successful`
            });
        }
        
    } catch (error) {
        await dbTransaction.rollback();
        return errorResponse(response, error);
    }
}

exports.transfer = async (request, response) => {
    const {sender_account_number, reciever_account_number, amount} = request.body;
    if (!sender_account_number || !reciever_account_number) {
        return response.status(400).json({
            success: false,
            message: 'invalid account number input'
          });
    }
    const recieverAccount = await knex(tables.accounts).where({account_number: reciever_account_number});
    const senderAccount = await knex(tables.accounts).where({account_number: reciever_account_number});

    const dbTransaction = await knex.transaction();
    try {
        if (amount < 0) {
            return response.status(400).json({
                success: false,
                message: 'invalid input'
              });
        }
        else if (amount > senderAccount[0].balance){
            return response.status(400).json({
                success: false,
                message: 'insulficient funds'
              });
        }
        else if (recieverAccount.length < 1 || senderAccount.length < 1) {
            return response.status(404).json({
                success: false,
                message: 'Account not found'
              });
        } else {
            await dbTransaction(tables.accounts).where({account_number: sender_account_number})
                                                                .decrement('balance',Math.abs(amount))
                                                                .update({updated_at: knex.fn.now()});

            await dbTransaction(tables.accounts).where({account_number: reciever_account_number})
                                                                .increment('balance',Math.abs(amount))
                                                                .update({updated_at: knex.fn.now()});
            
            
            const createTransactionRecord = await dbTransaction.insert({
                sender_account_number,
                reciever_account_number,
                transaction_type: transactionType.transfer,
                sender_id: senderAccount[0].user_id,
                reciever_id: recieverAccount[0].user_id, //request.user.id
                amount
                    }).into(tables.transactions).returning('*');
            await dbTransaction.commit();
            return response.status(201).json({
                data: {
                    transaction: createTransactionRecord,
                },
                success: true,
                message: `transfer successful`
            });
        }
        
    } catch (error) {
        await dbTransaction.rollback();
        return errorResponse(response, error);
    }
}