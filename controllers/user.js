
const User = require('../moduls/Signup');
const bcrypt = require('bcrypt');
const jwt =require(`jsonwebtoken`);

const generateAccessToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId : id, name: name, ispremiumuser } ,'secretkey');
   
}
// Data store into the Database of New user signup page
const Signup=(req, res,next)=>{
         const Name=req.body.Name;
        const Email=req.body.Email;
        const password=req.body.password;
    User.findAll({where:{Email}}).then(([result])=>{
       if(!result){
        bcrypt.hash(password,10,async(err,hash)=>{ 
           await User.create({
                Name:Name,
                Email:Email,
                password:hash
        });
        res.status(202).json({success:true,message:"user logged in successfully"});
    });}
    else {
        res.json({result:"user already registered"})
    }
    }).
    catch(err=>{res.status(500).json({success:false,message:"err"});})
}
//login page
const Login=(req, res, next)=>
{
    const {Email,password} = req.body;
    User.findAll({where:{Email}})
    .then((user)=>{
        if(user.length>0)
        { bcrypt.compare(password,user[0].password,(err,result)=>{
            if(err)
             {  throw new Error(`something is wrong`);}
            if(result===true)
                {return res.status(200).json({success:true,message:"user logged in successfully",token:generateAccessToken(user[0].id ,user[0].name, user[0].ispremiumuser)});}
            else
                { return res.status(400).json({success:false,message:"user logged in not successfully"});}
        })
        }
    else{
       return  res.status(404).json({success:false,message:"user Not found"});
}
}).catch(err=>
{res.status(500).json({success:false,message:"err"});})
}

module.exports ={generateAccessToken,Signup,Login}