const auth = (req, res, next) => {
    console.log(`req.session is ${JSON.stringify(req.session)}`)
    if (!req.session.user) { // if not send cookie, then reject
        
        console.log(`you dont have req.session.user: ${req.session.cookie.user}`)
        next(new Error('you need to login first'))
    } else { // if user send cookie with auth then proceed normal
        // if (req.session.user === "admin") {
            console.log('you have authenticated session')
            next()
        // }
        // else {
        //     console.log('idk how you got session but your session is incorrect')
        //     next(new Error('Incorrect session'))
        // }
        
    }
}

module.exports = auth