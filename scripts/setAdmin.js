const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

async function setAdmin() {
  const email = 'admin@gmail.com'; 
  
  try {
    const user = await admin.auth().getUserByEmail(email);
    console.log('✅ User found:', user.uid);
    
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log('✅ Admin role assigned successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password: admin123456');
    
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.log('⚠️ User not found. Creating new user...');
      
      const newUser = await admin.auth().createUser({
        email: email,
        password: 'admin123456',
      });
      console.log('✅ New user created:', newUser.uid);
      
      await admin.auth().setCustomUserClaims(newUser.uid, { admin: true });
      console.log('✅ Admin role assigned to new user!');
      console.log('📧 Email:', email);
      console.log('🔑 Password: admin123456');
      
    } else {
      console.error('❌ Error:', error.message);
      console.error('Details:', error);
    }
  }
}

// Run the function
setAdmin()
  .then(() => {
    console.log('✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed:', error.message);
    process.exit(1);
  });