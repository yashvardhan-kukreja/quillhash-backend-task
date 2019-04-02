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

router.get("/my-profile", (req, res) => {
    let user_id = req.decoded._id;
    UserController.fetch_my_profile(user_id)
        .then(data => res.status(data.meta.code).json(data))
        .catch(err => res.status(err.meta.code).json(err));
});

module.exports = router;
