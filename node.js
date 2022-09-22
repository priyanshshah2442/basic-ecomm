const express = require('express');
const app = express();
const path = require('path');
const conn = require('./connection.js');
const multer = require('multer');
const storage = require('./cloudinary');
const session = require('express-session');
const upload = multer({ storage: storage })
const bcrypt=require('bcrypt');
const middleware = (req, res, next) => {
    if (!req.session.user_id) {
        res.redirect('/')
    }
    else {
        next();
    }
}
conn.createSchema();
conn.createUserSchema();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
app.use(session({ secret: 'Not a good secret' }));
app.use(express.static("./"));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/main.html'));
})
app.post('/', (req, res) => {
    req.session.user_id = null;
    res.redirect('/');
})
app.post('/main.html',async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    console.log(req.body);
    const Credentials=await conn.login(email,password);
    if (Credentials) {
        req.session.user_id = '12345';
        res.redirect('/show');
    }
    else {
        res.send("Wrong Credentials");
    }

})
app.get('/register', middleware, (req, res) => {
    res.sendFile(path.join(__dirname + "/register.html"))
})
app.get('/form', middleware, (req, res) => {
    res.sendFile(path.join(__dirname + '/form.html'));
})
app.post('/form.html/', middleware, storage.parser.single('img'), async (req, res) => {
    const name = req.body.name;
    const price = req.body.price;
    const brand = req.body.brand;
    const result = await conn.insert(name, price, brand, req.file.path, req.file.filename);
    console.log(req.body, req.file.path);
    if (result) {
        res.redirect('/success');
    }
    else {
        res.send("Product insertion failed!!<br> Please retry");
    }

})
app.get('/success', middleware, (req, res) => {
    res.sendFile(path.join(__dirname + '/success.html'));
    // res.redirect('/register')
})
app.get('/main.html', (req, res) => {
    res.sendFile(path.join(__dirname + '/main.html'));
})

app.get('/show', middleware, async (req, res) => {

    const data = await conn.showDbs();
    const result = JSON.parse(data);
    // let n=''
    // for(let i=0;i<result.length;i++)
    // {
    //     n+=result[i].name+' <br>';
    // }
    // res.send(n);4
    res.render('show', { result });
    //res.sendFile(path.join(__dirname+'/show.html'));
})

app.get('/registerUser', (req, res) => {
    res.sendFile(path.join(__dirname + '/registerUser.html'));
})

app.post('/registerUser', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword=await bcrypt.hash(password,12);
    const unique =await conn.isUserUnique(email);
    if (unique) {
        const result = JSON.parse(await conn.registerUser(email, hashedPassword));
        console.log(result);
        if (result) {
            return res.redirect('/register');
        }
        else {
            res.redirect('/registerUser');
        }
    }
    else{
        res.send("User already exists");
    }
})











app.listen(5000, () => {
    console.log("listening");
});