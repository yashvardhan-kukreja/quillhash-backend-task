const UserTransactions = require("../models/user/user_db_transactions");
const Promise = require("bluebird");

module.exports.signup_user = (name, email, password, contact) => {
    return new Promise((resolve, reject) => {
        UserTransactions.hash_gen(password).then(hashed_password => {
            return UserTransactions.register_user(name, email, hashed_password, contact);
        }).then(outputUser => {
            resolve({
                meta: {
                    success: true,
                    message: "User added successfully",
                    code: 200
                },
                payload: {
                    user: outputUser
                }
            });
        }).catch(err => {
            console.error(err);
            if (err.code == 11000) {
                reject({
                    meta: {
                        status: false,
                        message: "User already exists with the same E-mail",
                        code: 400
                    }
                });
            } else {
                reject({
                    meta: {
                        status: false,
                        message: "An error occurred",
                        code: 500
                    }
                });
            }
        });
    });
}

module.exports.login_user = (email, password) => {

    let current_user = null;

    return new Promise((resolve, reject) => {
        UserTransactions.fetch_user_by_email(email).then(outputUser => {
            if (!outputUser) {
                reject({
                    meta: {
                        status: false,
                        message: "No user found with the provided email",
                        code: 404
                    }
                });
            } else {
                current_user = outputUser;
                return UserTransactions.compare_password(outputUser, password);
            }
        }).then(validPassword => {
            if (!validPassword) {
                reject({
                    meta: {
                        status: false,
                        message: "Wrong password entered",
                        code: 403
                    }
                });
            } else {
                return UserTransactions.generate_token(current_user._id);
            }
        }).then(token => {
            resolve({
                meta: {
                    status: true,
                    message: "User logged in successfully !",
                    code: 200
                },
                payload: {
                    user: current_user,
                    token: token
                }
            });
        }).catch(err => {
            console.error(err);
            reject({
                meta: {
                    status: false,
                    message: "An error occurred",
                    code: 500
                }
            });
        });
    });
}

