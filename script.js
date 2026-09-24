const WHATSAPP_NUMBER = "919999999999"; // Replace with your WhatsApp number, e.g. 919876543210
const INSTAGRAM_URL = "https://instagram.com/"; // Replace with your Instagram profile

const products = [
  {id:1,name:"Signature Hoops",category:"Earrings",price:799,letter:"H"},
  {id:2,name:"Everyday Chain",category:"Necklaces",price:999,letter:"V"},
  {id:3,name:"Classic Band",category:"Rings",price:699,letter:"E"},
  {id:4,name:"Sculpted Bracelet",category:"Bracelets",price:899,letter:"R"},
  {id:5,name:"Dainty Studs",category:"Earrings",price:599,letter:"S"},
  {id:6,name:"Layered Pendant",category:"Necklaces",price:1199,letter:"V"},
  {id:7,name:"Twist Ring",category:"Rings",price:649,letter:"E"},
  {id:8,name:"Link Bracelet",category:"Bracelets",price:949,letter:"H"}
];

let activeFilter = "All";
let cart = JSON.parse(localStorage.getItem("herverseCart") || "[]");

function money(n){ return "₹" + n.toLocaleString("en-IN"); }

function renderProducts(){
  const grid=document.getElementById("productGrid");
  const list=activeFilter==="All"?products:products.filter(p=>p.category===activeFilter);
  grid.innerHTML=list.map(p=>`
    <article class="product-card">
      <div class="product-image"><span>${p.letter}</span></div>
      <h3>${p.name}</h3>
      <div class="product-meta"><span>${p.category}</span><strong>${money(p.price)}</strong></div>
      <button class="add-btn" onclick="addToCart(${p.id})">ADD TO BAG</button>
    </article>`).join("");
}
function addToCart(id){
  const found=cart.find(x=>x.id===id);
  if(found) found.qty++;
  else cart.push({id,qty:1});
  saveCart(); renderCart(); showToast("Added to your bag");
}
function saveCart(){localStorage.setItem("herverseCart",JSON.stringify(cart));document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);}
function renderCart(){
  const box=document.getElementById("cartItems");
  if(!cart.length){box.innerHTML='<div style="padding:50px 0;text-align:center;color:#999;font-size:13px">Your bag is waiting for something beautiful.</div>';document.getElementById("cartTotal").textContent="₹0";return;}
  box.innerHTML=cart.map(item=>{
    const p=products.find(x=>x.id===item.id);
    return `<div class="cart-body-item"><div class="mini-img">${p.letter}</div><div><div class="item-name">${p.name}</div><div class="item-price">${money(p.price)} × ${item.qty}</div></div><button class="remove" onclick="removeItem(${p.id})">×</button></div>`;
  }).join("");
  const total=cart.reduce((s,x)=>{const p=products.find(p=>p.id===x.id);return s+p.price*x.qty},0);
  document.getElementById("cartTotal").textContent=money(total);
}
function removeItem(id){cart=cart.filter(x=>x.id!==id);saveCart();renderCart();}
function toggleCart(){document.getElementById("cartOverlay").classList.toggle("open");renderCart();}
function closeCartIfOutside(e){if(e.target.id==="cartOverlay")toggleCart();}
function orderOnWhatsApp(){
  if(!cart.length){showToast("Your bag is empty");return;}
  const lines=cart.map(x=>{const p=products.find(p=>p.id===x.id);return `• ${p.name} × ${x.qty} — ${money(p.price*x.qty)}`}).join("\n");
  const total=cart.reduce((s,x)=>{const p=products.find(p=>p.id===x.id);return s+p.price*x.qty},0);
  const msg=`Hi HerVerse! I'd like to order:\n\n${lines}\n\nSubtotal: ${money(total)}\n\nPlease confirm availability, delivery charges and payment details.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,"_blank");
}
function toggleMenu(){document.getElementById("nav").classList.toggle("open");}
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800);}
function subscribe(e){e.preventDefault();document.getElementById("subscribeMsg").textContent="Thank you — you're on the HerVerse list ♡";document.getElementById("email").value="";}
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));btn.classList.add("active");activeFilter=btn.dataset.filter;renderProducts();}));
document.getElementById("instagramLink").href=INSTAGRAM_URL;
document.getElementById("whatsappLink").href=`https://wa.me/${WHATSAPP_NUMBER}`;
renderProducts();saveCart();renderCart();
