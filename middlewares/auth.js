const jwt = require('jsonwebtoken');
// FORMAT OF TOKEN
// Authoriation: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers.authorization;
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const token = bearer[1];

        if (token) {
            jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, decoded) => {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Token is not valid',
                        error: err
                    });
                }
                req.decoded = decoded;
                next(); // Next middleware
            });
        } else {
            return res.json({
                success: false,
                message: 'Auth token is not supplied'
            });
        }
    } else {
        // Forbidden
        return res.sendStatus(403);
    }
}

module.exports = {
    verifyToken
};
