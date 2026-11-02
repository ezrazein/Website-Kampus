/* Antarmuka: teks hero, langkah, kartu kampus, dan jendela "Tentang" */
const $=s=>document.querySelector(s),st=$("#steps");
st.innerHTML=K.map((k,i)=>`<button data-i="${i}"><b>0${i+1}</b><span>${k[0]}</span><i></i></button>`).join("");
$("#kp").innerHTML=K.map((k,i)=>`<article><img src="${IMG[i]}" alt="Ilustrasi kampus ${k[0]}" loading="lazy"><div><h3>${k[0]}</h3><p>${k[10]}</p><div class="r2"><button class="btn y" data-i="${i}" data-up="1">Lihat di peta 3D ↑</button><button class="btn o" data-about="${i}">Tentang →</button></div></div></article>`).join("");
let cur=0,man=false,ins=false;
function stopAuto(){if(!man){man=true;st.classList.add("man")}}
function render(){const k=K[cur],c=$("#copy");c.classList.add("sw");
 setTimeout(()=>{const nx=cur<4?`<button class="btn" data-i="${cur+1}">Berikutnya →</button>`:`<a class="btn" href="#kampus">Semua kampus ↓</a>`;
  $("#ac").innerHTML=ins?`<button class="btn o" data-leave="1">← Keluar</button><button class="btn g" data-about="${cur}">Tentang</button>${nx}`:`<button class="btn g" data-enter="1">Masuk gedung →</button><button class="btn o" data-about="${cur}">Tentang</button>${nx}`;
  if(!ins){$("#kk").textContent="Langkah "+(cur+1)+" · "+k[0];$("#h1a").textContent=k[1];$("#h1b").textContent=k[2];$("#lp").textContent=k[3];
   $("#cd").innerHTML=`<div class="hd">Di kampus ini</div><div class="chips">${k[4].map((t,j)=>`<span class="${j?"":"k"}">${t}</span>`).join("")}</div><small>${k[5]}</small>`}
  else{$("#kk").textContent="Di dalam · "+k[6];$("#h1a").textContent="Ruang tunggu,";$("#h1b").textContent="Selamat datang.";$("#lp").textContent=k[8];
   $("#cd").innerHTML=`<div class="hd">Di dalam gedung ini</div><ul class="rows">${k[9].map(r=>`<li><b>${r[0]}</b>${r[1]}</li>`).join("")}</ul>`}
  c.classList.remove("sw")},180)}
function show(i,user){if(user)stopAuto();if(i===cur&&!ins&&$("#cd").innerHTML)return;
 cur=i;ins=false;render();
 st.querySelectorAll("button").forEach((b,j)=>{b.classList.toggle("on",j===i);b.classList.toggle("done",j<i)});
 if(window.setScene)setScene(i)}
window.onMode=on=>{ins=on;render()};
/* jendela Tentang */
const STEPS=["Gambaran","Program studi","Gedung","Kontak"];
const md={i:0,s:0,f:0,last:null};
function openAbout(i){md.i=i;md.s=0;md.f=0;md.last=document.activeElement;stopAuto();paint();$("#md").hidden=false;document.body.style.overflow="hidden";$("#mdX").focus()}
function closeAbout(){$("#md").hidden=true;document.body.style.overflow="";if(md.last&&md.last.focus)md.last.focus()}
function paint(){const k=K[md.i],a=ABOUT[md.i],b=$("#mdY");
 $("#mdI").src=IMG[md.i];$("#mdI").alt="Ilustrasi kampus "+k[0];$("#mdN").textContent=k[0];$("#mdA").textContent=a.addr;
 $("#mdS").innerHTML=STEPS.map((t,j)=>`<li class="${j===md.s?"on":j<md.s?"done":""}"><b>${j<md.s?"✓":j+1}</b><span>${t}</span></li>`).join("");
 $("#mdB").style.width=(md.s+1)*25+"%";$("#mdE").textContent="Langkah "+(md.s+1)+" dari 4";
 if(md.s===0){$("#mdT").textContent="Gambaran kampus";$("#mdU").textContent=a.tag;
  b.innerHTML=a.paras.map(p=>`<p>${p}</p>`).join("")+`<div class="fct">${a.facts.map(f=>`<div><small>${f[0]}</small><b>${f[1]}</b></div>`).join("")}</div>`}
 else if(md.s===1){const f=a.faculties[md.f]||a.faculties[0];$("#mdT").textContent="Program studi";$("#mdU").textContent="Pilih fakultas atau rumpun untuk melihat program studinya.";
  b.innerHTML=`<div class="chp">${a.faculties.map((x,j)=>`<button data-f="${j}" class="${j===md.f?"on":""}">${x.n}</button>`).join("")}</div><div class="cds">${f.p.map(([j,n])=>`<div class="cd2"><span class="ic">${n.replace(/^(Pendidikan|Magister|Doktor|Teknik|Ilmu)\s+/,"")[0]}</span><div><b>${n}</b><span>${f.n}</span></div><em>${j}</em></div>`).join("")}</div>`}
 else if(md.s===2){$("#mdT").textContent="Gedung dan fasilitas";$("#mdU").textContent="Yang bisa Anda temui di kampus ini.";
  b.innerHTML=`<div class="cds">${a.buildings.map(([n,d],j)=>`<div class="cd2"><span class="ic">${j+1}</span><div><b>${n}</b><span>${d}</span></div></div>`).join("")}</div>`}
 else{$("#mdT").textContent="Lokasi dan kontak";$("#mdU").textContent="Informasi resmi selalu ada di situs Untirta.";
  b.innerHTML=`<div class="cds"><div class="cd2"><span class="ic">📍</span><div><b>${K[md.i][0]}</b><span>${a.addr}</span></div></div><a class="cd2" href="https://untirta.ac.id/" target="_blank" rel="noopener"><span class="ic">↗</span><div><b>Situs resmi Untirta</b><span>untirta.ac.id</span></div></a><a class="cd2" href="https://spada.untirta.ac.id/user/index.php?id=19254" target="_blank" rel="noopener"><span class="ic">↗</span><div><b>SPADA</b><span>Pembelajaran daring</span></div></a><a class="cd2" href="https://siakang.untirta.ac.id/krs-mahasiswa?page=2" target="_blank" rel="noopener"><span class="ic">↗</span><div><b>SIAKANG</b><span>Sistem informasi akademik dan KRS</span></div></a></div>`}
 $("#mdP").disabled=md.s===0;$("#mdQ").textContent=md.s===3?"Selesai ✓":"Lanjut →";b.scrollTop=0}
$("#mdP").onclick=()=>{if(md.s>0){md.s--;paint()}};
$("#mdQ").onclick=()=>{if(md.s<3){md.s++;paint()}else closeAbout()};
$("#mdX").onclick=closeAbout;
$("#md").addEventListener("click",e=>{if(e.target.id==="md")closeAbout();const f=e.target.closest("[data-f]");if(f){md.f=+f.dataset.f;paint()}});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#md").hidden)closeAbout()});
document.addEventListener("click",e=>{
 const ab=e.target.closest("[data-about]");if(ab){openAbout(+ab.dataset.about);return}
 if(e.target.closest("[data-enter]")){stopAuto();enterBuilding();return}
 if(e.target.closest("[data-leave]")){leaveBuilding();return}
 const b=e.target.closest("[data-i]");if(!b||b.closest("#md"))return;if(b.dataset.up)scrollTo({top:0});show(+b.dataset.i,true)});
st.addEventListener("animationend",()=>{if(!man&&!ins&&cur<4)show(cur+1,false)});
show(0,false);
