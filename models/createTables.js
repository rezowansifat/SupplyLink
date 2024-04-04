const connectDatabase = require("../config/database");

const createTables = async () => {
  try {
    const pool = await connectDatabase();
    await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Users')
    BEGIN
    CREATE TABLE Users (
      id INT IDENTITY(1,1) PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL
    );
    END;

    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Suppliers')
    BEGIN
      CREATE TABLE Suppliers (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contact_info VARCHAR(MAX)
      );
    END;

    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Products')
    BEGIN
      CREATE TABLE Products (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description VARCHAR(MAX),
        price DECIMAL(18,2) NOT NULL,
        supplier_id INT FOREIGN KEY REFERENCES Suppliers(id)
      );
    END;

    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'PurchaseOrders')
    BEGIN
      CREATE TABLE PurchaseOrders (
        id INT IDENTITY(1,1) PRIMARY KEY,
        product_id INT FOREIGN KEY REFERENCES Products(id),
        quantity INT NOT NULL,
        order_date DATETIME DEFAULT GETDATE()
      );
    END;

    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Inventory')
    BEGIN
      CREATE TABLE Inventory (
        id INT IDENTITY(1,1) PRIMARY KEY,
        product_id INT FOREIGN KEY REFERENCES Products(id),
        quantity INT NOT NULL
      );
    END;

    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'SalesOrders')
    BEGIN
      CREATE TABLE SalesOrders (
        id INT IDENTITY(1,1) PRIMARY KEY,
        product_id INT FOREIGN KEY REFERENCES Products(id),
        quantity INT NOT NULL,
        customer_id INT,
        order_date DATETIME DEFAULT GETDATE()
      );
    END;
      `);
    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error.message);
  }
};

module.exports = createTables;
