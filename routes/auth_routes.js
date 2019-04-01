const AuthController = require("../controllers/auth_controller");
const router = require("express").Router();

router.post("/register", (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let contact = req.body.contact;

    AuthController.signup_user(name, email, password, contact)
        .then(data => res.status(data.meta.code).json(data))
        .catch(err => res.status(err.meta.code).json(err));
});

router.post("/login", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    AuthController.login_user(email, password)
        .then(data => res.status(data.meta.code).json(data))
        .catch(err => res.status(err.meta.code).json(err));
});

module.exports = router;