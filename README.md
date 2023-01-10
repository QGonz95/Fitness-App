# Fitness-App

edits to make 


-
overall app
make it black
fix hamburger dropdown 
session/authorization - make it save to one user not all 

goals/moves/entries
make exercises under goal a check list
make it able to change order of list
add mulitple exercises
journal titles dont show under goal

npm i mongoose express ejs  method-override express-session bcrypt dotenv

Heroku Link: https://agile-springs-30393.herokuapp.com/
ERROR FIXED WITH in 
app.use(
    session({
      secret: 'OnePieceIsReal', //a random string do not copy this value or your stuff will get hacked
      resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
      saveUninitialized: false // default  more info: https://www.npmjs.com/package/express-session#resave
    })
  )
  
Home Page
<img width="1728" alt="Screen Shot 2022-11-30 at 7 53 58 AM" src="https://user-images.githubusercontent.com/115441104/204802218-046485ee-a0e1-4a2b-a119-47b63bed85be.png">

When log in is successful
<img width="1728" alt="Screen Shot 2022-11-30 at 7 54 18 AM" src="https://user-images.githubusercontent.com/115441104/204802248-f1281529-d135-4cdb-8f4d-ea11306e59f1.png">

Goal Index.js
<img width="1728" alt="Screen Shot 2022-11-30 at 7 55 04 AM" src="https://user-images.githubusercontent.com/115441104/204802473-46ffe329-919f-4c13-8037-22a57efa6ba0.png">

Move Index.js
<img width="1728" alt="Screen Shot 2022-11-30 at 7 59 39 AM" src="https://user-images.githubusercontent.com/115441104/204802752-952c2740-f539-4966-b6be-e301d7cecd7f.png">

Entry Index.js
<img width="1728" alt="Screen Shot 2022-11-30 at 7 55 04 AM" src="https://user-images.githubusercontent.com/115441104/204802417-aee7661e-890a-4cc5-aaba-985ac495b2bf.png">
