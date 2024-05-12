const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const connectDatabase = require("../config/database");

exports.createSalesOrder = async (req, res, next) => {
  const { product_id, quantity, customer_id } = req.body;

  // Connect to the database
  const pool = await connectDatabase();

  // Insert new sales order into the SalesOrders table
  const insertSalesOrderQuery = `
      INSERT INTO SalesOrders (product_id, quantity, customer_id)
      VALUES ('${product_id}', '${quantity}', '${customer_id}')
    `;
  await pool.request().query(insertSalesOrderQuery);

  // Respond with success message
  res.status(201).json({
    success: true,
    message: "Sales order created successfully",
    data: { product_id, quantity, customer_id },
  });
};
