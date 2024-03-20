//add expense
async function myFunc(event) {
  try {
    event.preventDefault();
    const name = document.getElementById("Name").value;
    const expense = document.getElementById("expense").value;
    const item = document.getElementById("item").value;
    const category = document.getElementById("category").value;
    event.target.reset();
    const myObj = {
      name,
      expense,
      item,
      category,
    };
    const token = localStorage.getItem("token");
    const response=await axios.post("http://localhost:3000/expense/addexpense",myObj, {headers: {Authorization: token}});
     onScreenFunction(response.data);
    fetchdata(1);
    console.log("Data Create Success full");
  } catch (err) {
    console.log(err);
  }
}

const ul = document.getElementById("listofexpense");
//shown on screen
  function onScreenFunction(myObj) {
  const li = document.createElement("li");
  li.innerHTML = `${myObj.name} - ${myObj.expense} - ${myObj.item} -${myObj.category} `;

  // Create Delete Button
  const delBtn = document.createElement("input");
  delBtn.value = "Delete";
  delBtn.type = "button";
  delBtn.style.backgroundColor = "red";
  delBtn.onclick = async () => {
    const token = localStorage.getItem("token");
    const deletedItem = await axios.delete(`http://localhost:3000/expense/deletedata/${myObj.id}`,
      { headers: { Authorization: token } }
    );
    try {
      ul.removeChild(li);
    } catch (err) {
      console.log(err.message);
    }
  };

  // Create Edit Button
  const editBtn = document.createElement("input");
  editBtn.value = "Edit";
  editBtn.type = "button";
  editBtn.style.backgroundColor = "yellow";
  editBtn.onclick = async () => {
    document.getElementById("Name").value = myObj.name;
    document.getElementById("expense").value = myObj.expense;
    document.getElementById("item").value = myObj.item;
    document.getElementById("category").value = myObj.category;
    const token = localStorage.getItem("token");
    const deletedItem = await axios.delete(`http://localhost:3000/expense/deletedata/${myObj.id}`, { headers: { Authorization: token } });
    try {
      ul.removeChild(li);
    } catch (err) {
      console.log(err.message);
    }
  };
  li.appendChild(delBtn);
  li.appendChild(editBtn);
  ul.appendChild(li);
}

function showPremiumMessage(){
  document.getElementById("rzp-button1").style.visibility="hidden";
  document.getElementById('message').innerHTML="premium user";
}

//decode token jwt
function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
return JSON.parse(jsonPayload);
}

//refresh page
window.addEventListener("DOMContentLoaded",()=>{
  fetchdata(1);
});

 async  function fetchdata(){
    try{
    const token=localStorage.getItem(`token`);
    const decodeToken=parseJwt(token);
    const isadmin=decodeToken.ispremiumuser;
    if(isadmin){
      showPremiumMessage();
      showLedboard();
      }
      const limit = document.getElementById('ITEM_PER_PAGE').value|| 5;
      const response= await axios.get(`http://localhost:3000/expense/getExpenses?page=1&limit=${limit}`, { headers: { Authorization: token}})
      ul.innerHTML="";
      for (let i = 0; i < response.data.Expenses.length; i++) {
        onScreenFunction(response.data.Expenses[i]);
       }
      showPagination(response.data);
    }
   catch (err) {
      console.log(err);
    }
  }

//preimum features 
async function showLedboard(){
  const inputElement=document.createElement('input');
  inputElement.type="button";
  inputElement.value="show Leadboard";
  inputElement.onclick=async()=>
   {
    const token=localStorage.getItem(`token`);
    const userLeadboardArray=await axios.get(`http://localhost:3000/premium/showLeaderBoard`, { headers: { Authorization: token } });
    var leadboardelem=document.getElementById('leaderboard');
    leadboardelem.innerHTML +='Leader Board';
    userLeadboardArray.data.forEach((Signup)=>{
      leadboardelem.innerHTML+=`<li>Name-${Signup.name} TotalExepense-${Signup.totalExpense}</li>`
    })
   }
  document.getElementById('message').appendChild(inputElement);
 }

 //payment methode
document.getElementById(`rzp-button1`).onclick = async function (e) {
  const token = localStorage.getItem("token");
 const response = await axios.get("http://localhost:3000/purchase/premiummembership",{headers:{Authorization:token}});
  var option = {
    "key": response.data.key_id, //Enter the key ID generated from dashbord
    "order_id": response.data.order.id, //for one time payment
    //this handler function will handle the success payment
    "handler": async function (response) {
    const res=await axios.post("http://localhost:3000/purchase/updatetransactionstatus",{order_id:option.order_id,payment_id:response.razorpay_payment_id },{headers:{Authorization:token}});
      alert("You are premium user now");
      showPremiumMessage();
    localStorage.setItem('token',res.data.token);
     showLedboard();
     },
  };
  const rzp1 = new Razorpay(option);
  rzp1.open();
  e.preventDefault();
  rzp1.on("payment failed", function (response) {
    alert("something is wrong");
  });
};
async function download(){
  try{
  const token = localStorage.getItem("token");
  const response= await axios.get("http://localhost:3000/expense/download", { headers: {"Authorization" : token} })
  
      if(response.status === 200){
          //the backend is essentially sending a download link
          //  which if we open in browser, the file would download
          var a = document.createElement("a");
          a.href = response.data.fileURL;
          a.download = 'expense.txt';
          a.click();
        } else {
          throw new Error(response.data.message)
      }
  }
 catch (err) {
  console.log(err);
}
}
async function showHistory() {
  const token = localStorage.getItem('token')
  const response = await axios.get('http://localhost:3000/expense/get-history',{ headers: { "Authorization": token } });
addToHistoryTable(response.data.fileURL);
}

function addToHistoryTable(files){
  const container = document.getElementById('linkContainer');
  
  // Clear any existing content
  container.innerHTML = '';

  // Create HTML elements to display the data
  const dataList = document.createElement('ul');

  // Loop through the data and create list items
  files.forEach(item => {
  var linkElement = document.createElement('a');

// Set the href attribute to a valid URL
linkElement.href =  item.fileURL;

// Set the text content of the link
linkElement.textContent = item.fileURL;

// Append the link element to a container in the document
document.getElementById('linkContainer').appendChild(linkElement);
  });

  // Append the list to the container
  container.appendChild(dataList);
}

function showError(err){
  document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

//  Sign out Functionality
document.addEventListener('DOMContentLoaded', () => {
  const LogOut = document.getElementById('signOut-button');
  LogOut.addEventListener('click', () => {
      // localStorage.removeItem('token');
      window.location.href = '../signup.html';
  })
})

function showPagination({
  currentpage,
  hasNextPage,
  hasPreviousPage,
  previousPage,
  nextpage,
  }) {
    const ul = document.getElementById("pagination");
    ul.innerHTML='';
  if (hasPreviousPage) {
      const btn2 = document.createElement('button');
      btn2.innerHTML =`${previousPage}` ;
      btn2.addEventListener('click', () => getdata(previousPage));
      ul.appendChild(btn2);
 }

  const btn1 = document.createElement('button');
  btn1.innerHTML = `${currentpage}`;
  btn1.addEventListener('click', () => getdata(currentpage));
  ul.appendChild(btn1);

  if (hasNextPage) {
      const btn3 = document.createElement('button');
      btn3.innerHTML = nextpage;
      btn3.addEventListener('click', () => getdata(nextpage));
      ul.appendChild(btn3);
  }
}

async function getdata(page){
  try{
  const token=localStorage.getItem(`token`);
  const decodeToken=parseJwt(token);
  const isadmin=decodeToken.ispremiumuser;
  if(isadmin){
    showPremiumMessage();
    showLedboard();
    }
    const limit = document.getElementById('ITEM_PER_PAGE').value|| 5;
    const response=await axios.get(`http://localhost:3000/expense/getExpenses?page=${page}&limit=${limit}`, { headers: { Authorization: token}})
    ul.innerHTML="";
    for (let i = 0; i < response.data.Expenses.length; i++) {
      onScreenFunction(response.data.Expenses[i]);
     }
    showPagination(response.data)
}
 catch (err) {
    console.log(err);
  }
}

async function updateRows(e) {
  try {
      const token = localStorage.getItem('token');
      const limit = e.target.value;
      localStorage.setItem('ITEM_PER_PAGE', limit);
      const response = await axios.get(`http://localhost:3000/expense/getExpenses?page=l&imit=${limit}`,{ headers: { "Authorization": token } });
          ul.innerHTML = '';
      for (let i = 0; i < response.data.Expenses.length; i++) {
        onScreenFunction(response.data.Expenses[i]);
      }
      showPagination(response.data);
      fetchdata();
  }
  catch (err) {
    console.log(err)
  }
}