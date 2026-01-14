const jwt = require('jsonwebtoken');

module.exports = function isAuthenticated(req, res, next) {
    try {
        const header = req.headers.authorization
        if (!header) {
            return res.status(401).send({ error: 'No authorization header provided.' })
        }

        const [type, token] = header.split(' ');

        if (type !== 'Bearer' || !token) {
            return res.status(401).send({ error: 'Invalid authorization format.' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret')
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send({ error: 'Unauthorized.'})
    }
}