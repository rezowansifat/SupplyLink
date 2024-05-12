const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const connectDatabase = require("../config/database");

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const { name, description, price, supplier_id } = req.body;

  const pool = await connectDatabase();

  const insertProductQuery = `
        INSERT INTO Products (name, description, price, supplier_id)
        VALUES ('${name}', '${description}', '${price}', '${supplier_id}')
      `;

  await pool.request().query(insertProductQuery);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: { name, description, price, supplier_id },
  });
});
