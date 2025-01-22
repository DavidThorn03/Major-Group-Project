const mongoose = require("mongoose");
const connectDB = require("./config/db");

const testConnection = async () => {
  try {
    await connectDB();

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log("Collections in the database:");
    console.log(collections.map((col) => col.name));

    process.exit(); // Exit after fetching collections
  } catch (error) {
    console.error("Error testing connection:", error);
    process.exit(1);
  }
};

testConnection();
