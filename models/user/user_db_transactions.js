const User = require("./user_schema");
const bcrypt = require("bcrypt-nodejs");

module.exports.fetch_user_by_id = (id) => {
    return User.findOne({_id: id});
};

module.exports.block_user = (user_id, blocked_person_id) => {
    return User.findOneAndUpdate({_id: user_id}, {$push: {block_list: blocked_person_id}});
}

module.exports.hash_gen = (input) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if(err) {
                reject({
                    meta: {
                        success: false,
                        message: "An error occured",
                        code: 500
                    }
                });
            } else {
                bcrypt.hash(user.password, salt, null, (err, hash) => {
                    if (err) {
                        reject({
                            meta: {
                                success: false,
                                message: "An error occured",
                                code: 500
                            }
                        });
                    } else {
                        resolve(hash);
                    }
                });
            }
        });
    });
};

module.exports.register_user = (name, email, hashed_password, contact) => {
    let user = new User({
        name: name,
        email: email,
        password: hashed_password,
        contact: contact
    });
    return user.save();
}