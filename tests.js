const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("./app");

const should = chai.should();

chai.use(chaiHttp);

const User = require("./models/user/user_schema");

describe("----------- Enter the tests -------------------", () => {

    let token = "";
    let current_user_id = "";

    it("should DELETE the user collection\n\n", (done) => {
        User.remove({}, (err) => {
            if (err)
                done(err);
            else
                done();
        });
    });

    it("should GET healthcheck", (done) => {
        chai.request(server)
            .get("/health-check")
            .end((err, res) => {
                if (err) {
                    done(err);
                    process.exit(1);
                } else {
                    res.should.have.status(200);

                    // Meta tests
                    res.body.meta.success.should.be.a("boolean");
                    res.body.meta.message.should.be.a("string");
                    res.body.meta.code.should.be.a("number");
                    done();
                }
            });
    });

    it("should POST user in the database", (done) => {
        let user = {
            "name": "Yashvardhan Kukreja",
            "email": "yash.kukreja.98@gmail.com",
            "password": "heythere",
            "contact": "+919999712426"
        }

        chai.request(server)
            .post("/auth/register")
            .send(user)
            .end((err, res) => {
                if (err)
                    done(err);
                else {
                    res.should.have.status(200);

                    // Meta tests
                    res.body.meta.success.should.be.a("boolean");
                    res.body.meta.message.should.be.a("string");
                    res.body.meta.code.should.be.a("number");

                    //Payload tests
                    res.body.payload.user._id.should.be.a("string");
                    res.body.payload.user.name.should.be.a("string");
                    res.body.payload.user.email.should.be.a("string");
                    res.body.payload.user.password.should.be.a("string");
                    res.body.payload.user.contact.should.be.a("string");

                    done();
                }
            });
    });

    it("should LOGIN user", (done) => {
        let credentials = {
            "email": "yash.kukreja.98@gmail.com",
            "password": "heythere"
        }

        chai.request(server)
            .post("/auth/login")
            .send(credentials)
            .end((err, res) => {
                if (err)
                    done(err);
                else {
                    res.should.have.status(200);

                    // Meta tests
                    res.body.meta.success.should.be.a("boolean");
                    res.body.meta.message.should.be.a("string");
                    res.body.meta.code.should.be.a("number");

                    //Payload tests
                    res.body.payload.user._id.should.be.a("string");
                    res.body.payload.user.name.should.be.a("string");
                    res.body.payload.user.email.should.be.a("string");
                    res.body.payload.user.password.should.be.a("string");
                    res.body.payload.user.contact.should.be.a("string");
                    res.body.payload.token.should.be.a("string");

                    current_user_id = res.body.payload.user._id;
                    token = res.body.payload.token;

                    done();                    
                }
            });      
    });

    it("should GET my profile", (done) => {
        chai.request(server)
            .get("/user/profile/me")
            .set("x-access-token", token)
            .end((err, res) => {
                if (err)
                    done(err);
                else {
                    res.should.have.status(200);

                    // Meta tests
                    res.body.meta.success.should.be.a("boolean");
                    res.body.meta.message.should.be.a("string");
                    res.body.meta.code.should.be.a("number");

                    //Payload tests
                    res.body.payload.profile._id.should.be.a("string");
                    res.body.payload.profile.name.should.be.a("string");
                    res.body.payload.profile.email.should.be.a("string");
                    res.body.payload.profile.password.should.be.a("string");
                    res.body.payload.profile.contact.should.be.a("string");

                    done();
                }
            });
    });

    it("should GET profile of other user who hasn't blocked the current user", (done) => {
        chai.request(server)
            .get("/user/profile?id="+current_user_id)
            .set("x-access-token", token)
            .end((err, res) => {
                if (err)
                    done(err);
                else {
                    res.should.have.status(200);

                    // Meta tests
                    res.body.meta.success.should.be.a("boolean");
                    res.body.meta.message.should.be.a("string");
                    res.body.meta.code.should.be.a("number");

                    //Payload tests
                    res.body.payload.profile._id.should.be.a("string");
                    res.body.payload.profile.name.should.be.a("string");
                    res.body.payload.profile.email.should.be.a("string");
                    res.body.payload.profile.password.should.be.a("string");
                    res.body.payload.profile.contact.should.be.a("string");

                    done();
                    process.exit(0);
                }
            });
    });
});