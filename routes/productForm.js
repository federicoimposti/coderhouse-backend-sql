const express = require('express');
const productFormRouter = express.Router();

const controller = require('../controllers/products');

productFormRouter.get("/", (req, res) => {
    res.render('pages/productForm');
});

module.exports = productFormRouter;