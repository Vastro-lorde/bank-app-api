const { response } = require('express');
const knex = require('./db/knex');

exports.signup = (request, response) => {

}

exports.login = (request, response) => {
    const {email, password} = request.body;
    try {
        const checkUser = knex.select()
    } catch (error) {
        response.status(500).json({
            success: false,
            message: error.message,
          });
    }
}

exports.getUser = (request, response) => {}

exports.createAccount = (request, response) => {}

exports.getUserAccount = (request, response) => {}

exports.widthdraw = (request, response) => {}

exports.deposit = (request, response) => {}

exports.transfer = (request, response) => {}