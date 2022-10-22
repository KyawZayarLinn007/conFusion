require("dotenv").config();

module.exports = {
    'secretKey': '12345-67890-09876-54321',
    'mongoUrl': process.env.mongoUrl,
    'facebook': {
        clientId: 'Your Client App ID',
        clientSecret: 'Your Client App Secret'
    }
}