const express = require("express");

const { createSalesOrder } = require("../controllers/orderController");

//Routs
const router = express.Router();

router.post("/order/create", createSalesOrder);

module.exports = router;
