const UserTransactions = require("../models/user/user_db_transactions");
const Promise = require("bluebird");

module.exports.verify_token = (token) => {
    return new Promise((resolve, reject) => {
        UserTransactions.decode_token(token).then(decoded => {
            if (!decoded) {
                reject({
                    meta: {
                        status: false,
                        message: messages.user_controllers.verify_token_controller.errors[1],    // Corrupted token provided
                        code: 400
                    }
                });
            } else {
                return UserTransactions.fetch_user_by_id(decoded);
            }
        }).then(outputUser => {
            resolve({
                meta: {
                    success: true,
                    message: "Token decoded successfully",
                    code: 200
                },
                payload: {
                    decoded: outputUser
                }
            });
        }).catch(err => {
            console.error(err);
            reject({
                meta: {
                    success: false,
                    message: "An error occurred",
                    code: 500
                }
            });
        });
    });
}

module.exports.fetch_my_profile = (user_id) => {
    return new Promise((resolve, reject) => {
        UserTransactions.fetch_user_by_id(user_id).then(outputUser => {
            if (!outputUser) {
                reject({
                    meta: {
                        success: false,
                        message: "No user found with the provided user id",
                        code: 400
                    }
                });
            } else {
                resolve({
                    meta: {
                        success: true,
                        message: "Profile fetched successfully",
                        code: 200
                    },
                    payload: {
                        profile: outputUser
                    }
                });
            }
        }).catch(err => {
            console.error(err);
            reject({
                meta: {
                    success: false,
                    message: "An error occurred",
                    code: 500
                }
            });
        });
    });
}