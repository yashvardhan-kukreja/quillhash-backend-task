const UserController = require("../controllers/user_controller");
const router = require("express").Router();

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

module.exports = router;
