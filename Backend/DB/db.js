import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log('mongodb uri', process.env.MONGODB_URI);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      retryWrites: true,
      retryReads: true
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Drop the uid_1 index if it exists (to fix the duplicate key error)
    try {
      await conn.connection.db.collection('users').dropIndex('uid_1');
      console.log('✅ Successfully dropped uid_1 index');
    } catch (indexError) {
      // If the index doesn't exist, this will throw an error, which is fine
      if (indexError.codeName !== 'IndexNotFound') {
        console.log('⚠️ Note about uid_1 index:', indexError.message);
      }
    }
    
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.name}`);
    console.error('Error details:', error.message);
    
    // Provide more helpful advice for common error cases
    if (error.name === 'MongooseServerSelectionError') {
      console.error('\nPossible causes:');
      console.error('1. Your IP address is not whitelisted on MongoDB Atlas');
      console.error('2. Incorrect connection string or credentials');
      console.error('3. MongoDB Atlas service might be experiencing issues');
      console.error('\nTry these solutions:');
      console.error('• Add your current IP address to MongoDB Atlas whitelist: https://www.mongodb.com/docs/atlas/security-whitelist/');
      console.error('• Check your MONGODB_URI for typos');
      console.error('• Verify network connectivity to MongoDB Atlas');
    }
    
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
