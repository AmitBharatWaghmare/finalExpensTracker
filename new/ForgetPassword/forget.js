function forgotpassword(e) {
    try{
    e.preventDefault();
    console.log(e.target.name);
    const form = new FormData(e.target);
    const token=localStorage.getItem(`token`);
    const userDetails = {
        email: form.get("email"),
    }
    console.log(userDetails)
    axios.post('http://localhost:3000/password/forgetpassword',userDetails).then(response => {
     console.log(response);   
     if(response.status === 200){
            document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'
        } else {
            throw new Error('User is not present')
        }
    }).catch(err => {
        console.log(err);
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    })}
    catch (err) {
        console.log(err);
      }
}
