const express= require("express");
const bodyparser=require("body-parser");

const https=require('https');
const request=require('request');
const app=express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("static"));

 
app.get("/",function(req,res){
    res.sendFile(__dirname+"/templates/index.html");
});
app.post("/",function(req,res){
    const firstname=req.body.fname;
    const lastname=req.body.lname;
    const email=req.body.email;
    const data={
        members:[
            {
            email_address:email,
            status:"subscribed",
            merge_fields:{
                FNAME:firstname,
                LNAME:lastname
            }

        }]
        
    };
    
    const jsonData=JSON.stringify(data);
    const url="https://us6.api.mailchimp.com/3.0/lists/mailchimpid";
    const options={
        method:"POST",
        auth:"api-key"


    }
    const request =https.request(url,options,function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/templates/success.html")
        }
        else{
            res.sendFile(__dirname+"/templates/failure.html") 
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        });

    });
    request.write(jsonData);
    request.end();



});
app.post("/failure",function(req,res){
    res.sendFile(__dirname+"/templates/index.html");
});
app.listen(process.env.PORT || 3000,function(){
    console.log("server is running on port 3000");
});

