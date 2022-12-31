const models = require("../models");
const Validator = require("fastest-validator");

//create  a new post record
function save(req, res) {
  const post = {
    title: req.body.title,
    content: req.body.content,
    imageUrl: req.body.image_url,
    categoryId: req.body.category_id,
    userId: 1,
  };

  const v = new Validator();

  const schema = {
    title: { type: "string", optional: false, min: 3, max: 255 },
    content: { type: "string", optional: false, min: 3, max: 255 },
    imageUrl: { type: "string", optional: false },
    categoryId: { type: "number", optional: false },
  };

  const validationCheck = v.validate(post, schema);

  if (validationCheck !== true) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validationCheck,
    });
  }

  models.Post.create(post)
    .then((result) => {
      res.status(201).json({
        message: "Post created successfully",
        post: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
}

//return a new single post record
function show(req, res) {
  //accessing the id in parameter from URL
  const id = req.params.id;
  models.Post.findByPk(id)
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: "Post data found",
          post: result,
        });
      } else {
        res.status(404).json({
          message: "No data found",
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

//get all post records
function index(req, res) {
  models.Post.findAll()
    .then((result) => {
      res.status(200).json({
        posts: result,
        message: "Post data records",
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
}

//update a post record
function update(req, res) {
  const id = req.params.id;
  const userId = 1;

  const updatedPost = {
    title: req.body.title,
    content: req.body.content,
    imageUrl: req.body.image_url,
    categoryId: req.body.category_id,
  };

  const v = new Validator();

  const schema = {
    title: { type: "string", optional: false, min: 3, max: 255 },
    content: { type: "string", optional: false, min: 3, max: 255 },
    imageUrl: { type: "string", optional: false },
    categoryId: { type: "number", optional: false },
  };

  const validationCheck = v.validate(updatedPost, schema);

  if (validationCheck !== true) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validationCheck,
    });
  }
  models.Post.update(updatedPost, { where: { id: id, userId: userId } })
    .then((result) => {
      if (result == 1) {
        res.status(200).json({
          message: "Post data updated",
          post: updatedPost,
        });
      } else {
        res.status(404).json({
          message: "No data found",
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

//remove a post record

function destroy(req, res) {
  const id = req.params.id;
  const userId = 1;
  models.Post.destroy({ where: { id: id, userId: userId } })
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: "Post data deleted",
        });
      } else {
        res.status(404).json({
          message: "No data found",
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

module.exports = {
  save: save,
  show: show,
  index: index,
  update: update,
  destroy: destroy,
};
