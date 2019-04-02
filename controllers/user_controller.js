const UserTransactions = require("../models/user/user_db_transactions");
const ImageTransactions = require("../models/image/image_db_transactions");
const Promise = require("bluebird");
const fs = require("fs");

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

module.exports.fetch_profile = (user_id) => {
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

module.exports.check_block_status = (main_user_id, blocked_or_unblocked_user_id) => {
    return new Promise((resolve, reject) => {
        UserTransactions.fetch_user_by_id(main_user_id).then(outputUser => {
            if (outputUser.block_list.indexOf(blocked_or_unblocked_user_id) < 0) {
                resolve({
                    meta: {
                        success: true,
                        message: "User not blocked by the main user here",
                        code: 200
                    }
                });
            } else {
                reject({
                    meta: {
                        success: false,
                        message: "User blocked by the main user here",
                        code: 403
                    }
                });
            }
        })
    });
}

module.exports.block_a_user = (current_user_id, blocked_user_id) => {
    return new Promise((resolve, reject) => {
        UserTransactions.block_a_user(current_user_id, blocked_user_id).then(output => {
            resolve({
                meta: {
                    success: true,
                    message: "User blocked successfully",
                    code: 200
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
        })
    });
}

module.exports.unblock_a_user = (current_user_id, blocked_user_id) => {
    return new Promise((resolve, reject) => {
        UserTransactions.unblock_a_user(current_user_id, blocked_user_id).then(output => {
            resolve({
                meta: {
                    success: true,
                    message: "User unblocked successfully",
                    code: 200
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
        })
    });
}

module.exports.upload_pic_to_the_cloud = (id, image_path) => {
    return new Promise((resolve, reject) => {

        let public_id = id + "_" + Math.ceil(Math.random()*1000).toString();

        UserTransactions.upload_pic_to_cloud(public_id, image_path, (err, outputResult) => {
            if (err) {
                console.error(err);
                reject({
                    meta: {
                        success: false,
                        message: "An error occurred",
                        code: 500
                    }
                });
            } else {
                fs.unlinkSync(image_path);
                resolve({
                    meta: {
                        success: true,
                        message: "Image uploaded to the cloud successfully",
                        code: 200
                    },
                    payload: {
                        output: outputResult
                    }
                });
            }
        });
    });
};

module.exports.save_pic = (image_url, user_id) => {
    return new Promise((resolve, reject) => {
        ImageTransactions.save_image(image_url, user_id).then(outputImage => {
                resolve({
                    meta: {
                        success: true,
                        message: "Image uploaded successfully",
                        code: 200
                    },
                    payload: {
                        image_url: outputImage.image_url
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

