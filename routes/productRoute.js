const express = require("express");
const adminAuth = require("../middleware/adminAuth");
const {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
  updateProduct,
} = require("../controllers/productController");
const upload = require("../middleware/multer");
const router = require("express").Router();

router.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct,
);
router.post("/remove", adminAuth, removeProduct);
router.post("/single", singleProduct);
router.get("/list", listProducts);

router.post(
  "/update",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  updateProduct,
);

module.exports = router;
