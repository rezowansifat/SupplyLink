const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const connectDatabase = require("../config/database");

exports.addProduct = catchAsyncErrors(async (req, res, next) => {
  const { product_id, quantity } = req.body;
  const pool = await connectDatabase();

  const insertPurchaseOrderQuery = `
      INSERT INTO Inventory (product_id, quantity)
      VALUES ('${product_id}', '${quantity}')
    `;

  await pool.request().query(insertPurchaseOrderQuery);

  res.status(201).json({
    success: true,
    message: "Product Added To Invenntory Successfully",
    data: { product_id, quantity },
  });
});
