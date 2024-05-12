const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectDatabase = require("../config/database");

// Register a supplier
exports.registerSupplier = catchAsyncErrors(async (req, res, next) => {
  const { username, password, name, mobile, email } = req.body;

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const pool = await connectDatabase();

  // Insert
  const insertUserQuery = `
       INSERT INTO Suppliers(username, password_hash, name, mobile, email)
       VALUES ('${username}', '${passwordHash}', '${name}', '${mobile}', '${email}')
     `;

  await pool.request().query(insertUserQuery);

  res.status(201).json({
    success: true,
    message: "Supplier registered successfully",
    data: { username, name, mobile, email },
  });
});

//Supplier Login
exports.loginSupplier = catchAsyncErrors(async (req, res, next) => {
  const { username, password } = req.body;

  const pool = await connectDatabase();

  // Check user
  const checkUserQuery = `SELECT * FROM Suppliers WHERE username = '${username}'`;
  const result = await pool.request().query(checkUserQuery);
  const user = result.recordset[0];

  if (!user) {
    return next(new ErrorHander("Invalid username or password", 400));
  }

  // Pass Check
  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) {
    return next(new ErrorHander("Invalid username or password", 401));
  }

  //JWT
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    "FIEBVKSJDKSEUEEKHUBFOHOSIHAKHWFEU",
    {
      expiresIn: "1h",
    }
  );

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    token,
    userData: {
      username: user.username,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
    },
  });
});
