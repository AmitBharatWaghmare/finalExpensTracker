const form=document.getElementById('login-form');
form.addEventListener("submit",async (event)=>{
    try{ event.preventDefault();
       const Email=document.getElementById('Email').value;
        const password=document.getElementById('Password').value;
        event.target.reset();
        console.log(Email);
        const myobj={Email,password};
        
        const response=await axios.post("http://localhost:3000/user/login",myobj);
        localStorage.setItem('token',response.data.token);
        if(response.status===200){
            window.location.href="../expense/ExpenseTracker.html";
        }
        else{
          throw new Error(response.data.message);
        }
    }
    catch(err){
        console.log(err);
    }
});
function forgotpassword() {
    window.location.href = "../ForgetPassword/forget.html"
}
function signup() {
    window.location.href = "../signup.html"
}
