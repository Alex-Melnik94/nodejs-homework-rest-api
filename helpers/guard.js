const passport = require('passport')
require('../config/passport')

const guard = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        const token = req.get('Authorization')?.split(' ')[1]
        if (!user || err || token !== user.token) {
            return res.status(401).json({status: 'Unauthorized', code: 401, message: 'Not authorized'})
        }
        req.user = user
        return next()
    })(req, res, next)
}

module.exports = guard