document.addEventListener("DOMContentLoaded",function(){

const lessons=document.querySelectorAll(".lesson-card");

lessons.forEach((card,index)=>{

card.style.opacity=0;
card.style.transform="translateY(30px)";

setTimeout(()=>{
card.style.transition="all .6s ease";
card.style.opacity=1;
card.style.transform="translateY(0)";
},index*200);

});

});