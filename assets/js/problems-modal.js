
document.addEventListener("DOMContentLoaded",()=>{
const b=document.querySelector("[data-open-problems]");
const m=document.getElementById("problemsModal");
if(!b||!m)return;
b.onclick=()=>m.classList.add("active");
m.onclick=e=>{if(e.target===m)m.classList.remove("active")};
});
