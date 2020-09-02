const multer = require('multer'),
express = require('express'),
uploadRoute = express.Router(),
auth = require('../middlewares/auth')




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage})

uploadRoute.get('/', (req, res, next) => {
    res.send('upload site')
})

uploadRoute.post('/', auth.jwtAuthenticate, auth.verifyAdmin, upload.single('upload-image'), (req, res, next)=> {
    console.log('upload success')
    console.log(`filename is ${req.file.originalname}`)
    res.redirect(`/${req.file.originalname}`)
})

uploadRoute.all('/', auth.jwtAuthenticate, auth.verifyAdmin, (req, res, next)=>{
    next(new Error(`${req.method} not supported`))
    
})


module.exports = uploadRoute



