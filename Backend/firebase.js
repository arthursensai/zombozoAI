const admin = require('firebase-admin');

const createUser = async(obj) => {
  try {
    let { email, password, username } = obj;
    const userResponse = await admin.auth().createUser({
      email: email,
      password: password,
      username: username,
      emailVerified: false,
      disabled: false
    });
    return { status: 200, userUID: userResponse.uid }
  } catch (error) {
    return { status: 500, message: error.message };
  }
}

module.exports = {
  createUser
}