const express =require("express");


const https = require("https");
const bodyparser= require("body-parser");


const app =express();
const urlencoded=bodyparser.urlencoded({extended:true});

app.use(urlencoded);

app.use(express.static('static'))

app.set('view engine','ejs')
app.set('views',"./views")

app.get("/",function(req,res){
    return res.render("basic");
    // console.log(weatherData);
});





app.post("/",function(req,res){
    console.log(req.body.cityName);
    console.log("post request recieved");
    const query =req.body.cityName
    const url ="https://api.openweathermap.org/data/2.5/weather?q="+query+ "&appid=ae76f3fa7267328c6f6b99fcfa2b9547";
    https.get(url,function(response){
        console.log(response);
        console.log(response.statusCode);

        response.on("data",function(data){
            const weatherData =JSON.parse(data);

            console.log(weatherData)
            if(weatherData.main==null)
                return res.render('error')
            
            const temp=weatherData.main.temp;
            const humidity  = weatherData.main.humidity
            const windSpeed = weatherData.wind.speed
            const name = weatherData.name;
            const weatherDescription=weatherData.weather[0].description
            const icon =weatherData.weather[0].icon
            const imageUrl="https://openweathermap.org/img/wn/"+icon+"@2x.png"


            return res.render('home',{'temp':temp,'desc':weatherDescription,'imgUrl':imageUrl,'location':name,'humidity':humidity,'windSpeed':windSpeed})
            res.write("<p>the current temperature of the " + query + "is" + temp + " </p>")
            res.write("<p>the weather description is"+weatherDescription+"</p>")
            res.write("<img src="+imageUrl+">")
            res.send()
        });
    });
});      


    
    //seen from documentation of the https 


    // res.send("the server is running on the / ");

    

app.listen(3000,function(){
    console.log("the app is running on the port 3000.");

})