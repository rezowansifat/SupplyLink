const express = require("express");

const { addProduct } = require("../controllers/InventoryController");

//Routs
const router = express.Router();

router.post("/inventory/addproduct", addProduct);

module.exports = router;
