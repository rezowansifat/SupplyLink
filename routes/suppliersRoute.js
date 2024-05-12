const express = require("express");

const {
  registerSupplier,
  loginSupplier,
} = require("../controllers/suppliersController");

//Routs
const router = express.Router();

router.post("/supplier/register", registerSupplier);
router.post("/supplier/login", registerSupplier);

module.exports = router;
