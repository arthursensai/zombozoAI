const admin = require('firebase-admin');

const signUp = async(obj) => {
  try {
    let { email, password, username } = obj;
    const signUpResponse = await admin.auth().createUser({
      email: email,
      password: password,
      username: username,
      emailVerified: false,
      disabled: false
    });
    return { status: 200, userUID: signUpResponse.uid }
  } catch (error) {
    return { status: 500, message: error.message };
  }
};

module.exports = {
  signUp
}