//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
app.set('view engine', 'ejs');

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

//use express session to maintain session data
app.use(session({
    secret              : 'cmpe273_kafka_passport_mongo',
    resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration      :  5 * 60 * 1000
}));

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
app.use(bodyParser.json());

//Allow Access Control
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

  var Users = [{
      username : "admin",
      password : "admin"
  }]

  var books = [
    {"BookID" : "1", "Title" : "Book 1", "Author" : "Author 1"},
    {"BookID" : "2", "Title" : "Book 2", "Author" : "Author 2"},
    {"BookID" : "3", "Title" : "Book 3", "Author" : "Author 3"}
]
var init_books = [
    {"BookID" : "1", "Title" : "Book 1", "Author" : "Author 1"},
    {"BookID" : "2", "Title" : "Book 2", "Author" : "Author 2"},
    {"BookID" : "3", "Title" : "Book 3", "Author" : "Author 3"}
]
app.post('/createBook',function(req,res,next){
    console.log('in create backend')
    console.log(req.body)    
    let BookID = null;
    let title = null;
    let author = null;
    if(req.session.user){
    BookID = req.body.BookID;
    title = req.body.Title;
    author = req.body.Author;
    let book = {"BookID" : BookID, "Title" : title, "Author" : author };
    console.log(req.body.BookID+" "+author)
    let flag=false;
    for(let b of books){
        console.log(b+"   "+BookID);
        if(b.BookID===BookID)
            {flag=true;
            break;
            } 
    }
    console.log(flag);
        if (flag) {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({ data: "", errMsg: "Duplicate book id cannot be added" }));

        } else {
            books.push(book)
            console.log("new book "+books)
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify({ data: "book with id "+ book.BookID+" added successfully!!", errMsg: "" }));
        }    
}

});
app.post('/deleteBook',function(req,res){
    let bkid=req.body.bookId;
    console.log("id to be deleted" +bkid)
    let found=false;
    let c=0;
    if(req.session.user){
    for(let book of books){
        
        if(book.BookID===bkid){
            books.splice(c,1);
            found=true;
            
        }
        c++;
    }
    if(found){
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(`Book with id ${bkid} deleted successfully`);
    }
    else{
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(`Book does not exist`);
    }   
    }
})



app.get('/logout',function(req,res){
    req.session.user=null;
    //books=init_books;
    res.writeHead(200,{
        'Content-Type' : 'text/plain'
    })
    res.end("Successfully Logged out!!!!");
})

//Route to handle Post Request Call
app.post('/login',function(req,res){
    
    // Object.keys(req.body).forEach(function(key){
    //     req.body = JSON.parse(key);
    // });
    // var username = req.body.username;
    // var password = req.body.password;
    console.log("Inside Login Post Request");
    //console.log("Req Body : ", username + "password : ",password);
    console.log("Req Body : ",req.body);
    Users.filter(function(user){
        if(user.username === req.body.username && user.password === req.body.password){
            res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});
            req.session.user = user;
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end("Successful Login");
        }
        else{
            console.log('Unsuccessful login attempt')
            /* res.writeHead(200,{
                'Content-Type' : 'text/plain'
            }) */
            res.end('Incorrect Username or Password');
        }
    })

    
});
app.get('/',function(req,res,next){
    res.send('Welcome to the Book Store');
});
//Route to get All Books when user visits the Home Page
app.get('/home', function(req,res){
    if(req.session.user){
    console.log("Inside Home Login");    
    res.writeHead(200,{
        'Content-Type' : 'application/json'
    });
    console.log("Books : ",JSON.stringify(books));
    res.end(JSON.stringify(books));
}
})
//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");