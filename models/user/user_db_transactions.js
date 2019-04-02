const User = require("./user_schema");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const Promise = require("bluebird");
const cloudinary = require("cloudinary");
const config = require("../../config");

const SECRET = config.JWT_SECRET;

cloudinary.config({
    cloud_name: config.cloudinary_config.CLOUD_NAME,
    api_key: config.cloudinary_config.API_KEY,
    api_secret: config.cloudinary_config.API_SECRET
});

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

module.exports.block_a_user = (current_user_id, block_user_id) => {
    return User.findOneAndUpdate({_id: current_user_id}, {$addToSet: {block_list: block_user_id}});
};

module.exports.unblock_a_user = (current_user_id, block_user_id) => {
    return User.findOneAndUpdate({_id: current_user_id}, {$pull: {block_list: block_user_id}});
};

module.exports.upload_pic_to_cloud = (public_id, image_path, next) => {
    cloudinary.v2.uploader.upload(image_path, {
        public_id: public_id
    }, next);
};