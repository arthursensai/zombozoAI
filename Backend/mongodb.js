const User = require('./Modules/User');

const addUser = async(obj) => {
    try {
        const user = await User.create(obj);
        return { status: 200, message: "User Got Added To MongoDB 🔥" }
    } catch (error) {
        return { status: 500, message: error.message };
    }
}

module.exports = {
    addUser
}