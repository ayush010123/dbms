const express = require("express")
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(cookieParser());

const url = 'mongodb+srv://Amogh:Amogh007@cluster007.kprad1c.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(url,{
   useNewUrlParser:true,
})
const personschema ={
    name:String,
    EmailId :String,
    USN:String,
    password:String,
    role:String
}
const Person = mongoose.model("person",personschema);
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/home.html");
})
app.get("/profile",async(req,res)=>{
    const EmailId = req.cookies.EmailId;
    const findPerson =await Person.findOne({EmailId});
    const results = {
        name : findPerson.name,
        EmailId : findPerson.EmailId,
        USN : findPerson.USN,
        role : findPerson.role
    }
    res.render("profile",{results : results})
    // res.send(findPerson.name + findPerson.EmailId + findPerson.USN + findPerson.role);
})
app.get("/:links",(req,res)=>{
    const requestedUrl = req.params.links;
    if(requestedUrl==="signin") res.sendFile(__dirname+"/signin.html");
    else if(requestedUrl==="login") res.sendFile(__dirname+"/login.html");
    else if(requestedUrl==="home") res.render("home");
})

app.post("/signin",async(req,res)=>{
    const {name,usn,EId,psw,role} = req.body;
    const person = new Person({
        name:name,
        EmailId:EId,
        USN:usn,
        password:psw,
        role:role
    })
    await person.save();
    res.cookie('EmailId',EId);
    res.render("home");
})
app.post('/login', async (req, res) => {
    const { EId, psw } = req.body;
    const findPerson = await Person.findOne({ EmailId: EId });
    if (!findPerson) {
        res.render("login", { msg1: "New User", msg2: "" });
    } else if (findPerson.password !== psw) {
        res.render("login", { msg1: "", msg2: "Wrong Credentials" });
    } else {
        res.cookie('EmailId',EId);
        res.render("home");
    }
});

app.listen(3000,()=>console.log("Server is running on 3000"));