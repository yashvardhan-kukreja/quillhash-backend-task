const Image = require("./image_schema");

module.exports.save_image = (image_url, user_id) => {
    let image = new Image({
        image_url: image_url,
        user: user_id
    });
    return image.save();
}

module.exports.fetch_images_by_userid = (user_id) => {
    return Image.find({user: user_id}).populate({
        path: 'likes',
        populate: {
            path: 'liker',
            model: 'User'
        }
    });
}

module.exports.like_an_image = (image_id, liketype, liker_id) => {
    let like = {
        liker: liker_id,
        like_type: liketype
    }
    return Image.findOneAndUpdate({_id: image_id}, {$addToSet: {likes: like}})
}