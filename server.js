require('dotenv').config()

const express = require('express');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session')
const bcrypt = require('bcrypt')


const journalController = require('./controllers/entry.js')
const goalsController = require('./controllers/goals.js');
const movesController = require('./controllers/moves.js');
const userController = require('./controllers/users.js');
const sessionsController = require('./controllers/sessions.js');
const hashedString = bcrypt.hashSync('yourStringHere', bcrypt.genSaltSync(10))

const mongodbURI = process.env.MONGODBURI
const app = express();


app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(
    session({
      secret: 'OnePieceIsReal', //a random string do not copy this value or your stuff will get hacked
      resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
      saveUninitialized: false, // default  more info: https://www.npmjs.com/package/express-session#resave
      mongodbURI: true
    })
  )
  
app.use(express.static(__dirname + '/public'));
app.use('/goals', goalsController);
app.use('/moves', movesController);
app.use('/users', userController);
app.use('/sessions', sessionsController)
app.use('/entry', journalController)


let PORT= process.env.PORT;
if(process.env.PORT){
	PORT
}

app.listen(PORT, () => {
    console.log('listening...')
});

app.get('/', (req, res)=>{  
    res.render('index.ejs', { 
      currentUser: req.session.currentUser, 
    });
});

  
bcrypt.compareSync('yourGuessHere', hashedString) //returns true or false
mongoose.connect('mongodb+srv://QGonz95:.ZybZjMEVB96uAj@sei.eg7suz6.mongodb.net/?retryWrites=true&w=majority', () => {
    console.log('linked to mongodb')
})