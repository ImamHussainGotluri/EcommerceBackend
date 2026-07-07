const {
  addToCart,
  updateUserCart,
  getUserCart,
} = require("../controllers/cartController");
const express = require("express");
const authUser = require("../middleware/auth");
const cartRouter = require("express").Router();

cartRouter.post("/get", authUser, getUserCart);
cartRouter.post("/add", authUser, addToCart);
cartRouter.post("/update", authUser, updateUserCart);

module.exports = cartRouter;
