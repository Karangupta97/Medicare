import mongoose from "mongoose";

// Database connections for different purposes
let patientDB = null;
let doctorDB = null;
let managementDB = null;
let feedbackDB = null;

const connectAllDatabases = async () => {
  try {
    // Extract base URI from environment variable
    const baseURI = process.env.MONGODB_URI;
    
    if (!baseURI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    console.log('🔗 Connecting to multiple databases...');
    
    // Connection options
    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true
    };
    
    // Create separate database connections
    patientDB = mongoose.createConnection(baseURI.replace(/\/[^\/]*(\?|$)/, '/Patient$1'), options);
    doctorDB = mongoose.createConnection(baseURI.replace(/\/[^\/]*(\?|$)/, '/Doctor$1'), options);
    managementDB = mongoose.createConnection(baseURI.replace(/\/[^\/]*(\?|$)/, '/Management$1'), options);
    feedbackDB = mongoose.createConnection(baseURI.replace(/\/[^\/]*(\?|$)/, '/Feedback$1'), options);
    
    // Wait for all connections to be ready
    await Promise.all([
      new Promise((resolve) => patientDB.once('open', resolve)),
      new Promise((resolve) => doctorDB.once('open', resolve)),
      new Promise((resolve) => managementDB.once('open', resolve)),
      new Promise((resolve) => feedbackDB.once('open', resolve))
    ]);
    
    console.log('✅ Patient Database Connected:', patientDB.host);
    console.log('✅ Doctor Database Connected:', doctorDB.host);
    console.log('✅ Management Database Connected:', managementDB.host);
    console.log('✅ Feedback Database Connected:', feedbackDB.host);
    
    // Handle connection errors
    patientDB.on('error', (err) => console.error('❌ Patient DB Error:', err));
    doctorDB.on('error', (err) => console.error('❌ Doctor DB Error:', err));
    managementDB.on('error', (err) => console.error('❌ Management DB Error:', err));
    feedbackDB.on('error', (err) => console.error('❌ Feedback DB Error:', err));
    
    return { patientDB, doctorDB, managementDB, feedbackDB };
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.name}`);
    console.error('Error details:', error.message);
    
    if (error.name === 'MongooseServerSelectionError') {
      console.error('\nPossible causes:');
      console.error('1. Your IP address is not whitelisted on MongoDB Atlas');
      console.error('2. Incorrect connection string or credentials');
      console.error('3. MongoDB Atlas service might be experiencing issues');
      console.error('\nTry these solutions:');
      console.error('• Add your current IP address to MongoDB Atlas whitelist');
      console.error('• Check your MONGODB_URI for typos');
      console.error('• Verify network connectivity to MongoDB Atlas');
    }
    
    process.exit(1);
  }
};

// Getter functions for database connections
export const getPatientDB = () => {
  if (!patientDB) {
    throw new Error('Patient database not connected. Call connectAllDatabases() first.');
  }
  return patientDB;
};

export const getDoctorDB = () => {
  if (!doctorDB) {
    throw new Error('Doctor database not connected. Call connectAllDatabases() first.');
  }
  return doctorDB;
};

export const getManagementDB = () => {
  if (!managementDB) {
    throw new Error('Management database not connected. Call connectAllDatabases() first.');
  }
  return managementDB;
};

export const getFeedbackDB = () => {
  if (!feedbackDB) {
    throw new Error('Feedback database not connected. Call connectAllDatabases() first.');
  }
  return feedbackDB;
};

// Get appropriate database connection based on origin/context
export const getDBConnection = (origin) => {
  // For now, we'll default to patient database for user-related operations
  // This can be extended later to support multi-tenancy based on origin
  if (!patientDB) {
    throw new Error('Patient database not connected. Call connectAllDatabases() first.');
  }
  return patientDB;
};

// Close all database connections
export const closeAllConnections = async () => {
  try {
    if (patientDB) await patientDB.close();
    if (doctorDB) await doctorDB.close();
    if (managementDB) await managementDB.close();
    if (feedbackDB) await feedbackDB.close();
    console.log('✅ All database connections closed');
  } catch (error) {
    console.error('❌ Error closing database connections:', error);
  }
};

export default connectAllDatabases;
export { connectAllDatabases };
