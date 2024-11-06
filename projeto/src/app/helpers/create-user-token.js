const jwt = require('jsonwebtoken');

const createUserToken = async (user) => {
    const token = jwt.sign(
        {
            name: user.name,
            id: user.id 
        },
        "secret"
    );
    return token
};

module.exports = createUserToken;