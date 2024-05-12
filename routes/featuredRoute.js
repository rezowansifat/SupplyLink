const express = require("express");

const {
  getAllData,
  findData,
  findByIdWithRelated,
  searchOrdersWithinDateRange,
  searchOrdersByAmountRange,
  searchOrdersOrderBy,
  updateDataWithJoin,
  getTotalRowsInTable,
} = require("../controllers/featuredController");

//Routs
const router = express.Router();

router.get("/featured/getalldata", getAllData);
router.get("/featured/find", findData);
router.get("/featured/find/related/:id", findByIdWithRelated);
router.get("/featured/find/range", searchOrdersWithinDateRange);
router.get("/featured/find/amount", searchOrdersByAmountRange);
router.get("/featured/find/orderBy", searchOrdersOrderBy);
router.put("/featured/update", updateDataWithJoin);
router.get("/featured/totaldata", getTotalRowsInTable);
module.exports = router;
