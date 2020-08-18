const auth = (req, res, next) => {
    console.log(`req.session is ${JSON.stringify(req.session)}`)
    if (!req.session.user) { // if not send cookie, then get login info
        
        console.log(`you dont have req.session.user: ${req.session.cookie.user}`)
        const loginAuth = req.headers.authorization
        if (!loginAuth) { // if user not log in yet => reject
            const authError = new Error('You are not authenticated')
            res.statusCode = 401
            res.setHeader('WWW-Authenticate', 'Basic');
            next(authError);
            return;
        }
        // get login info
        const [username, password] = new Buffer.from(loginAuth.split(' ')[1], 'base64').toString().split(':')
        if (username === "tri97nguyen" && password === "123456") {
            req.session.user = "admin"
            // res.cookie('name','something')
            next()
        } else {
            next(new Error('Invalid username or password'))
        }    
    } else { // if user send cookie with auth then proceed normal
        // if (req.session.user === "admin") {
            console.log('you have correct session')
            next()
        // }
        // else {
        //     console.log('idk how you got session but your session is incorrect')
        //     next(new Error('Incorrect session'))
        // }
        
    }
}

module.exports = auth