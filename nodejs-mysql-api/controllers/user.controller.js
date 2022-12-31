const models = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Validator = require("fastest-validator");

function signUp(req, res) {
  const requestBody = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  const schema = {
    name: { type: "string", optional: false, min: 3, max: 255 },
    email: { type: "email", optional: false, min: 3, max: 255 },
    password: { type: "string", optional: false },
  };
  const v = new Validator();
  const validationCheck = v.validate(requestBody, schema);
  if (validationCheck !== true) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validationCheck,
    });
  }
  models.User.findOne({ where: { email: req.body.email } })
    .then((result) => {
      if (result) {
        res.status(409).json({
          message: "Email already exists!",
        });
      } else {
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(requestBody.password, salt, function (err, hash) {
            const user = {
              name: requestBody.name,
              email: requestBody.email,
              password: hash,
            };

            models.User.create(user)
              .then((result) => {
                res.status(200).json({
                  message: "User created successfully",
                });
              })
              .catch((error) => {
                res.status(500).json({
                  message: "Something went wrong",
                  error: error,
                });
              });
          });
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
}

function login(req, res) {
  models.User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (user === null) {
        res.status(404).json({
          message: "Invalid credentials",
        });
      } else {
        bcrypt.compare(
          req.body.password,
          user.password,
          function (err, result) {
            if (result) {
              //token generating
              const token = jwt.sign(
                {
                  email: user.email,
                  userId: user.id,
                },
                "secret",
                function (err, token) {
                  res.status(200).json({
                    message: "Authentication successful",
                    token: token,
                  });
                }
              );
            } else {
              res.status(401).json({
                message: "Invalid credentials",
              });
            }
          }
        );
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
}
module.exports = {
  signUp: signUp,
  login: login,
};
