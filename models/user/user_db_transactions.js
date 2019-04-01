const User = require("./user_schema");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const Promise = require("bluebird");

const SECRET = require("../../config").JWT_SECRET;

module.exports.fetch_user_by_id = (id) => {
    return User.findOne({_id: id});
};

module.exports.fetch_user_by_email = (email) => {
    return User.findOne({email: email});
}

module.exports.block_user = (user_id, blocked_person_id) => {
    return User.findOneAndUpdate({_id: user_id}, {$push: {block_list: blocked_person_id}});
}

module.exports.hash_gen = (input) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if(err) {
                reject(err);
            } else {
                bcrypt.hash(input, salt, null, (err, hash) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hash);
                    }
                });
            }
        });
    });
};

module.exports.compare_password = (user, input_password) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(input_password, user.password, (err, validPassword) => {
            if (err)
                reject(err);
            else
                resolve(validPassword);
        });
    });
}

module.exports.register_user = (name, email, hashed_password, contact) => {
    let user = new User({
        name: name,
        email: email,
        password: hashed_password,
        contact: contact
    });
    return user.save();
}

module.exports.generate_token = (user) => {
    return jwt.sign(JSON.parse(JSON.stringify(user)), SECRET);
};

module.exports.decode_token = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET, (err, output) => err ? reject(err) : resolve(output));
    });
};