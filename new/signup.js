const form=document.getElementById('signup-form');
form.addEventListener("submit",async (event)=>{
        event.preventDefault();
        const Name=document.getElementById('name').value;
        const Email=document.getElementById('email').value;
        const password=document.getElementById('password').value;
        event.target.reset();
       
        const obj={Name,Email,password};
        const response=await axios.post("http://localhost:3000/user/signup",obj);
        if(response.status===202){
            console.log("response");
            window.location.href="../new/Login/login.html"//change the page on successful login
        }
        else{
             throw new 'User already exists';
        }
});
