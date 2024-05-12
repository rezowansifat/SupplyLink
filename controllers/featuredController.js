const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const connectDatabase = require("../config/database");

// Get All table data with related table
exports.getAllData = catchAsyncErrors(async (req, res, next) => {
  const pool = await connectDatabase();

  const query = `
        SELECT u.*, s.*, p.*, i.*, so.*
        FROM Users u
        LEFT JOIN Suppliers s ON u.id = s.id
        LEFT JOIN Products p ON p.supplier_id = s.id
        LEFT JOIN Inventory i ON p.id = i.product_id
        LEFT JOIN SalesOrders so ON p.id = so.product_id
    `;
  const result = await pool.request().query(query);

  const data = result.recordset;

  res.status(200).json({ success: true, data });
});

//Get Data By Id/Unique Data/Name/Mobile/Email
exports.findData = catchAsyncErrors(async (req, res, next) => {
  const { table, field, value } = req.query;

  if (!field || !value || !table) {
    return next(new ErrorHander("Field and value are required", 400));
  }

  const pool = await connectDatabase();
  let query;

  switch (field) {
    case "id":
      query = `SELECT * FROM ${table} WHERE id = '${value}'`;
      break;
    case "username":
    case "email":
      query = `SELECT * FROM ${table} WHERE ${field} = '${value}'`;
      break;
    case "name":
      query = `
            SELECT * FROM ${table}  
            WHERE ${field} LIKE '%${value}%'
          `;
      break;
    default:
      query = `
      SELECT * FROM ${table}  
      WHERE ${field} LIKE '%${value}%'
    `;
  }

  const result = await pool.request().query(query);
  const data = result.recordset;

  if (data.length === 0) {
    return next(new ErrorHander("Data not found", 400));
  }

  res.status(200).json({ success: true, data });
});

//Get Data By Id with related Table Data
exports.findByIdWithRelated = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const pool = await connectDatabase();

  const query = `
      SELECT u.*, so.*
      FROM Users u
      LEFT JOIN SalesOrders so ON u.id = so.customer_id
      WHERE u.id = '${id}';
  
      SELECT s.*, p.*
      FROM Suppliers s
      LEFT JOIN Products p ON s.id = p.supplier_id
      WHERE s.id = '${id}';
  
      SELECT p.*, i.*
      FROM Products p
      LEFT JOIN Inventory i ON p.id = i.product_id
      WHERE p.id = '${id}';
    `;

  const result = await pool.request().query(query);

  const userData = result.recordsets[0];
  const supplierData = result.recordsets[1];
  const productData = result.recordsets[2];

  let responseData = {};

  if (userData.length > 0) {
    responseData.userData = userData;
  }
  if (supplierData.length > 0) {
    responseData.supplierData = supplierData;
  }
  if (productData.length > 0) {
    responseData.productData = productData;
  }

  if (Object.keys(responseData).length === 0) {
    return next(new ErrorHander("Data not found", 400));
  }

  res.status(200).json({ success: true, ...responseData });
});

//Get Date Between Search (Range)
exports.searchOrdersWithinDateRange = catchAsyncErrors(
  async (req, res, next) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return next(
        new ErrorHander("Both startDate and endDate are required", 400)
      );
    }

    const pool = await connectDatabase();

    const query = `
        SELECT *
        FROM SalesOrders
        WHERE order_date BETWEEN '${startDate}' AND '${endDate}'
      `;

    const result = await pool.request().query(query);
    const salesOrdersData = result.recordset;

    res.status(200).json({ success: true, salesOrdersData });
  }
);

//Get Total Amountand Max/Min amount wise search
exports.searchOrdersByAmountRange = catchAsyncErrors(async (req, res, next) => {
  const { minAmount, maxAmount } = req.query;

  if (!minAmount || !maxAmount) {
    return new ErrorHander("Both minAmount and maxAmount are required", 400);
  }

  const pool = await connectDatabase();

  const query = `
        SELECT *
        FROM SalesOrders
        WHERE quantity BETWEEN '${minAmount}' AND '${maxAmount}'
      `;

  const result = await pool.request().query(query);
  const salesOrdersData = result.recordset;

  const TotalAmount = salesOrdersData.length;

  res.status(200).json({ success: true, TotalAmount, salesOrdersData });
});

//Order By Search
exports.searchOrdersOrderBy = catchAsyncErrors(async (req, res, next) => {
  const { orderBy } = req.query;

  if (!orderBy) {
    return new ErrorHander("orderBy parameter is required", 400);
  }

  const validColumns = ["id", "product_id", "quantity", "order_date"];

  if (!validColumns.includes(orderBy)) {
    return new ErrorHander("Invalid column for ordering", 400);
  }

  const pool = await connectDatabase();

  const query = `
        SELECT 
          so.id,
          so.product_id,
          so.quantity,
          so.customer_id,
          so.order_date
        FROM SalesOrders so
        ORDER BY ${orderBy} ASC;
      `;

  const result = await pool.request().query(query);
  const salesOrdersData = result.recordset;

  res.status(200).json({ success: true, salesOrdersData });
});

//Data Update, with join table
exports.updateDataWithJoin = catchAsyncErrors(async (req, res, next) => {
  const { id, newValue } = req.body;

  if (!id || !newValue) {
    return new ErrorHander("Both id and newValue are required", 400);
  }

  const pool = await connectDatabase();

  const query = `
      UPDATE SalesOrders
      SET SalesOrders.quantity = '${newValue}'
      FROM SalesOrders
      INNER JOIN Users ON SalesOrders.customer_id = Users.id
      WHERE Users.id = '${id}';
    `;

  try {
    const result = await pool.request().query(query);

    res
      .status(200)
      .json({ success: true, message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Total Data in a table
exports.getTotalRowsInTable = catchAsyncErrors(async (req, res, next) => {
  const { tableName } = req.query;

  if (!tableName) {
    return new ErrorHander("tableName parameter is required", 400);
  }

  const pool = await connectDatabase();

  const query = `
      SELECT COUNT(*) AS totalRows
      FROM ${tableName};
    `;

  try {
    const result = await pool.request().query(query);
    const { totalRows } = result.recordset[0];

    const totalnumberOFData = totalRows;
    res.status(200).json({ success: true, tableName, totalnumberOFData });
  } catch (error) {
    console.error("Error retrieving total rows:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
