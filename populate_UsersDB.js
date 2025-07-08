const connectDB = require('./config/connect');
const User = require('./models/user');

(async () => {
  try {
    await connectDB();

    const testUser = new User({
      email: "test@gmail.com",
      username: "test",
      password: "test"
    });

    await testUser.save();
    console.log("Test user saved to MongoDB");
    process.exit(); 

  } catch (err) {
    console.error("Error saving user:", err);
    process.exit(1);
  }
})();
