var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;
var crypto = require('crypto');//pwd security
var bodyParser=require('body-parser');//json

var config={
    user:'mohanapriyasubramaniam',
    database:'mohanapriyasubramaniam',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:process.env.DB_PASSWORD
    
}

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());


var articleOne={
    title:'ArticleOne',
    heading:'ArticleOne',
    date:'Sep 5 2016',
    content:`<h1>This is articleOne created in server.js</h1>
    <p>Content</p>
    `
    
}

function CreateTemplate(data)
{
    var title=data.title;
    var date=data.date;
    var heading=data.heading;
    var content=data.content;
    var htmlTemplate=`
    
    <html>
    
    <head>
    <title>
    ${title}
    </title>
    
    </head>
    
    <body>
    <div class="container">
    <h3>${heading}<h3>
    <div>${date.toDateString()}</div>
    <div>${content}</div>
    
    
    
    </div>
    
    </body>
    </html>`
    return htmlTemplate;
    
    
    
}
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input,salt)
{
   var key = crypto.pbkdf2Sync('input', 'salt', 100000, 512, 'sha512');
   /*return key.toString('hex');*/
   return ["pbkdf2","10000",salt,key.toString('hex')].join('$');
}
 
//hash->to secure password
app.get('/hash/:input',function(req,res)
{
    var hashedString=hash(req.params.input,"this-is-some-random-string");
    res.send(hashedString);
});


app.post('/create-user',function(req,res)
{
    //JSON
    //{"username":"priya","password":qwe"}
   var username=req.body.username;
   var password=req.body.password;
   //console.log(username);
   var salt=crypto.randomBytes(128).toString('hex');
   var dbString=hash(password,salt);
   pool.query('INSERT INTO hash(username,password) VALUES ($1,$2)',[username,dbString],function(err,result){
         if(err)
        {
            res.status(500).send(err.toString());
            
        }
        else
        {
            res.send("User Successfully Created"+username);
        }
   });
});


app.post('/login',function(req,res)
{
    //JSON
    //{"username":"priya","password":qwe"}
   var username=req.body.username;
   var password=req.body.password;
   console.log("user"+username);
   console.log("userpwd"+password);
 
   pool.query('SELECT * FROM  hash WHERE username=$1',[username],function(err,result){
         if(err)
        {
            res.status(500).send(err.toString());
            
        }
        else
        {
            if(result.rows.length==0){
            res.status(403).send("username/password is invalid");
            }
        
        else
        {
            var dbString=result.rows[0].password;
          var salt=dbString.split('$')[2];
          var hashedPassword=hash(password,salt);
          if(hashedPassword===dbString)
          {
              res.send('credentials correct');
              res.send(result.rows[0].password);
          }
              else
              {
                   res.status(403).send("username/password is invalid");
              }
          }
        }
    
   });
});


var pool=new Pool(config);
app.get('/test-db',function(req,res){
    
    pool.query('SELECT * from User',function(err,result)
    {
        if(err)
        {
            res.status(500).send(err.toString());
            
        }
        else
        {
            res.send(JSON.stringify(result.rows));
        }
    })
    
});

var counter=0;
app.get('/counter', function (req, res) {
    counter=counter+1;
  res.send(counter.toString());
});





app.get('/article/:articleName', function (req, res) {
    
    pool.query("SELECT * from articletypes WHERE title='"+req.params.articleName +"'",function(err,result)
    {
        if(err)
        {
            res.status(500).send(err.toString());
            
        }
        else
        {
            if(result.rows.length==0){
            res.status(400).send("Article Not Found");
            }
        
        else
        {
            var articleData=result.rows[0];
           res.send(CreateTemplate(articleData));
        }
    }
 
});
});


/*app.get('/article-one', function (req, res) {
  res.send(CreateTemplate(articleOne));
});*/


var names=[];
app.get('/submit_name', function (req, res) {
    
    name=req.query.name;
    names.push(name);
    res.send(JSON.stringify(names));
    

});
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
