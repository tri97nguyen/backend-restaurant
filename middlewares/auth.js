const auth = (req, res, next) => {
    console.log(`req.session is ${JSON.stringify(req.session)}`)
    if (!req.user) { // if user prop not attached in req, then there is no established session
        
        console.log(`you dont have req.user: ${req.user}`)
        next(new Error('you need to login first'))
    } else { 
        console.log('you have authenticated session')
        next()
    }
}

module.exports = auth