const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = function isAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).send({ error: 'Missing auth token.'});
    }

    try {
        const decoded = jwt.verify(token, config.authentication.jwtSecret);
        req.user = decoded;
        next();
    } catch (e) {
        return res.status(401).send({error: 'Invalid auth token.'});
    }
}