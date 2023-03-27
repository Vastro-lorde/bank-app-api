const JWT = require('jsonwebtoken');

exports.auth = async (request, response, next) => {
    try {
        const token = request.header('Authorization').replace('Bearer ', '');
        const decoded = JWT.verify(token, process.env.JWT_SECRET, {
            issuer: process.env.JWT_ISSUER,
            audience: process.env.JWT_AUDIENCE,
        });
        if (!decoded) throw new Error("User not found");
        request.user = decoded;
        next();
    } catch (error) {
        return response.status(401).json({ 
            error: 'Please authenticate.',
            message: error
        });
    }
}