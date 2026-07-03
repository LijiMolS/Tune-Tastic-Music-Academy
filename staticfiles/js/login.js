/* =====================================================
   TUNE TASTIC LOGIN VALIDATION
===================================================== */


/* ---------- PASSWORD TOGGLE ---------- */

function togglePassword(){

const password=document.getElementById("password");

if(password.type==="password"){
password.type="text";
}else{
password.type="password";
}

}


/* ---------- FORM VALIDATION ---------- */

document.getElementById("loginForm").addEventListener("submit",function(e){

let valid=true;

const email=document.getElementById("email");
const password=document.getElementById("password");

const emailError=document.getElementById("emailError");
const passwordError=document.getElementById("passwordError");


/* RESET ERRORS */

emailError.textContent="";
passwordError.textContent="";

email.classList.remove("input-error");
password.classList.remove("input-error");


/* EMAIL VALIDATION */

const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(email.value===""){

emailError.textContent="Email is required";
email.classList.add("input-error");
valid=false;

}
else if(!emailPattern.test(email.value)){

emailError.textContent="Enter a valid email address";
email.classList.add("input-error");
valid=false;

}


/* PASSWORD VALIDATION */

if(password.value===""){

passwordError.textContent="Password is required";
password.classList.add("input-error");
valid=false;

}
else if(password.value.length<6){

passwordError.textContent="Password must be at least 6 characters";
password.classList.add("input-error");
valid=false;

}


/* STOP FORM IF INVALID */

if(!valid){
e.preventDefault();
}

});