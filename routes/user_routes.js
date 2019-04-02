const UserController = require("../controllers/user_controller");
const router = require("express").Router();
const path = require("path");
const multer = require("multer");
const upload = multer({dest: path.resolve(__dirname, "uploads")});

router.use((req, res, next) => {
    let token = req.headers["x-access-token"];
    UserController.verify_token(token)
        .then(data => {
            req.decoded = data.payload.decoded;
            next();
        })
        .catch(err => res.status(err.meta.code).json(err));
});

router.get("/profile/me", (req, res) => {
    let user_id = req.decoded._id;
    UserController.fetch_profile(user_id)
        .then(data => res.status(data.meta.code).json(data))
        .catch(err => res.status(err.meta.code).json(err));
});

router.get("/profile", (req, res) => {
    let blocked_or_unblocked_userid = req.decoded._id; // currently logged in user
    let main_user_id = req.query.id; // user whose profile needs to be seen

    UserController.check_block_status(main_user_id, blocked_or_unblocked_userid)
        .then(data => UserController.fetch_profile(main_user_id))
        .then(data => res.status(data.meta.code).json(data))
        .catch(err => res.status(err.meta.code).json(err));
});

router.put("/block", (req, res) => {
    let current_user_id = req.decoded._id;
    let blocked_user_id = req.body.id;

    UserController.block_a_user(current_user_id, blocked_user_id)
        .then(data => res.status(data.meta.code).json(data))
        .catch(err => res.status(err.meta.code).json(err));

});

router.put("/unblock", (req, res) => {
    let current_user_id = req.decoded._id;
    let blocked_user_id = req.body.id;

    UserController.unblock_a_user(current_user_id, blocked_user_id)
        .then(data => res.status(data.meta.code).json(data))
        .catch(err => res.status(err.meta.code).json(err));
});

router.put("/image", upload.single("image"), (req, res) => {
    if (req.file || req.files) {
        let user_id = req.decoded._id;
        let filename = req.file.filename;
        let image_path = path.resolve(__dirname, "uploads", filename);

        UserController.upload_pic_to_the_cloud(user_id, image_path)
            .then(data => UserController.save_pic(data.payload.output.secure_url, user_id))
            .then(data => res.status(data.meta.code).json(data))
            .catch(err => res.status(err.meta.code).json(err));
    } else {
        res.status(400).json({
            meta: {
                success: false,
                message: "Please provide an image",
                code: 400
            }
        });
    }
});

router.put("/image/like", (req, res) => {
    let user_id = req.decoded._id;
    let image_id = req.body.image_id;
    let like_type = req.body.like_type;

    UserController.like_image(image_id, like_type, user_id)
        .then(data => res.status(data.meta.code).json(data))
        .catch(err => res.status(err.meta.code).json(err));
});



module.exports = router;
