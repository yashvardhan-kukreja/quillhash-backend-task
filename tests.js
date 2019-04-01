const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("./app");

const should = chai.should();

chai.use(chaiHttp);

describe("----------- Enter the tests -------------------", () => {
    it("GET healthcheck", (done) => {
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
                    process.exit(0);
                }
            });
    });
});