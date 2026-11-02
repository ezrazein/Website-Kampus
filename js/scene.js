/* Satu dunia 3D bersambung: kamera mengikuti pasien berjalan di jalur oranye (Three.js r128) */
(()=>{
const T=window.THREE,cv=document.getElementById('gl');
if(!T||!cv){if(cv)cv.outerHTML='<p style="padding:40px;color:#7a6f66">Animasi 3D tidak dapat dimuat. Pastikan file js/three.min.js ada di folder yang sama.</p>';return}
const OR=0xF5B800,WH=0xffffff,CR=0xf7f2e4,IN=0xefeadb,SAND=0xe3dcc6,NAVY=0x0E3B2C,TEAL=0x1f6a4e,GR=0x7a6f66,GAP=24;
const R=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
R.setPixelRatio(Math.min(devicePixelRatio,2));R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;
const S=new T.Scene(),cam=new T.OrthographicCamera(-1,1,1,-1,-80,80);
S.add(new T.HemisphereLight(0xffffff,0xe6d6c6,.9));
const sun=new T.DirectionalLight(0xffffff,.75);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{left:-15,right:15,top:15,bottom:-15,near:1,far:50});sun.shadow.radius=5;S.add(sun,sun.target);
const gs=new T.Mesh(new T.PlaneGeometry(240,70),new T.ShadowMaterial({opacity:.13}));gs.rotation.x=-Math.PI/2;gs.position.set(30,-.31,0);gs.receiveShadow=true;S.add(gs);

const M={},mat=c=>M[c]||(M[c]=new T.MeshStandardMaterial({color:c,roughness:.85}));
const sh=m=>{m.castShadow=m.receiveShadow=true;return m};
function box(g,w,h,d,x,y,z,c){const m=sh(new T.Mesh(new T.BoxGeometry(w,h,d),mat(c)));m.position.set(x,y+h/2,z);g.add(m);return m}
function cyl(g,r,h,x,y,z,c,n=14){const m=sh(new T.Mesh(new T.CylinderGeometry(r,r,h,n),mat(c)));m.position.set(x,y+h/2,z);g.add(m);return m}
function ball(g,r,x,y,z,c){const m=sh(new T.Mesh(new T.SphereGeometry(r,18,14),mat(c)));m.position.set(x,y,z);g.add(m);return m}
function hairCap(g,y,c){const h=sh(new T.Mesh(new T.SphereGeometry(.215,18,12,0,Math.PI*2,0,Math.PI/1.9),mat(c)));h.position.set(0,y,-.02);g.add(h)}
function person(g,x,z,shirt,ry=0){const p=new T.Group();cyl(p,.17,.55,0,0,0,0x2b3350);cyl(p,.23,.62,0,.55,0,shirt);
  cyl(p,.06,.12,0,1.17,0,0xe8b896);ball(p,.2,0,1.42,0,0xe8b896);hairCap(p,1.45,0x2a1d16);p.position.set(x,0,z);p.rotation.y=ry;g.add(p)}
function tree(g,x,z,s=1){cyl(g,.12*s,.9*s,x,0,z,0x8a6a4c);ball(g,.75*s,x,1.4*s,z,0x7da05a);ball(g,.5*s,x+.25*s,1.9*s,z-.1*s,0x8fb36a)}
function plant(g,x,z){cyl(g,.25,.4,x,0,z,OR);ball(g,.36,x,.75,z,0x6f9a52)}
function chair(g,x,z,ry=0){const c=new T.Group();box(c,.55,.12,.55,0,.32,0,OR);box(c,.55,.5,.1,0,.44,-.25,OR);box(c,.08,.32,.08,0,0,0,0x6b5a4c);c.position.set(x,0,z);c.rotation.y=ry;g.add(c)}
function wall(g,w,x){box(g,w,3.2,.25,x,0,-4.5,WH)}
function counter(g,w,x,z){box(g,w,1,.8,x,0,z,WH);box(g,w+.1,.1,.95,x,1,z,0xf4a56b);box(g,w,.12,.82,x,.1,z,OR)}
function shelf(g,w,x,z){box(g,w,3,.5,x,0,z,WH);const c=[OR,0x3d7ea6,0x7da05a,0xe8c15a,0xc0504d,0x8e6bb0];
  for(let r=0;r<4;r++)for(let i=0;i<Math.floor(w/.45);i++)box(g,.3,.4,.3,x-w/2+.35+i*.45,.35+r*.7,z+.28,c[(i*3+r*5)%6])}

/* ---- helper gedung ---- */
function rbox(g,w,d,h,r,x,y,z,c){const sp=new T.Shape(),a=-w/2,b=-d/2,e=w/2,f=d/2;
  sp.moveTo(a+r,b);sp.lineTo(e-r,b);sp.quadraticCurveTo(e,b,e,b+r);sp.lineTo(e,f-r);sp.quadraticCurveTo(e,f,e-r,f);
  sp.lineTo(a+r,f);sp.quadraticCurveTo(a,f,a,f-r);sp.lineTo(a,b+r);sp.quadraticCurveTo(a,b,a+r,b);
  const m=sh(new T.Mesh(new T.ExtrudeGeometry(sp,{depth:h,bevelEnabled:false,curveSegments:6}),mat(c)));
  m.rotation.x=-Math.PI/2;m.position.set(x,y,z);g.add(m);return m}
const TX=[];
function label(g,w,h,x,y,z,ry,draw,px=300){const c2=document.createElement('canvas');c2.width=px;c2.height=Math.round(px*h/w);
  const ctx=c2.getContext('2d'),tex=new T.CanvasTexture(c2);tex.anisotropy=4;
  const run=()=>{ctx.clearRect(0,0,c2.width,c2.height);draw(ctx,c2.width,c2.height);tex.needsUpdate=true};run();TX.push(run);
  const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tex,transparent:true}));m.position.set(x,y,z);m.rotation.y=ry;g.add(m)}
if(document.fonts){const rd=()=>TX.forEach(f=>f());document.fonts.load('800 40px "Plus Jakarta Sans"').then(rd).catch(()=>{});document.fonts.ready.then(rd)}
const FONT='"Plus Jakarta Sans",system-ui,sans-serif';
const roadMat=new T.MeshStandardMaterial({color:0x37373c,roughness:.9,side:T.DoubleSide});
function road(g,pts,wd){const c=new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(p[0],0,p[1]))),N=90,pos=[],ix=[];
  for(let i=0;i<=N;i++){const t=i/N,p=c.getPoint(t),q=c.getTangent(t),nx=-q.z,nz=q.x;
    pos.push(p.x+nx*wd/2,.03,p.z+nz*wd/2,p.x-nx*wd/2,.03,p.z-nz*wd/2)}
  for(let i=0;i<N;i++){const a=i*2;ix.push(a,a+1,a+2,a+1,a+3,a+2)}
  const ge=new T.BufferGeometry();ge.setAttribute('position',new T.Float32BufferAttribute(pos,3));ge.setIndex(ix);ge.computeVertexNormals();
  const m=new T.Mesh(ge,roadMat);m.receiveShadow=true;g.add(m);
  for(let d=.02;d<.99;d+=.04){const p=c.getPoint(d),q=c.getTangent(d),k=new T.Mesh(new T.BoxGeometry(.38,.02,.07),mat(WH));
    k.position.set(p.x,.045,p.z);k.rotation.y=-Math.atan2(q.z,q.x);g.add(k)}}
function ambulance(g,x,z){const a=new T.Group();box(a,1.1,.8,.75,-.15,.18,0,WH);box(a,.5,.55,.72,.7,.18,0,WH);box(a,1.7,.1,.78,0,.4,0,OR);
  box(a,.1,.25,.5,.97,.55,0,0x9fb8c8);[-.5,.55].forEach(wx=>box(a,.32,.2,.8,wx,0,0,0x222226));ball(a,.06,-.2,1.04,0,0xff5a2a);
  a.position.set(x,0,z);g.add(a)}
function grid(g,x0,x1,z0,z1){const p=[];for(let x=x0;x<=x1;x++)p.push(x,.025,z0,x,.025,z1);for(let z=z0;z<=z1;z++)p.push(x0,.025,z,x1,.025,z);
  const ge=new T.BufferGeometry();ge.setAttribute('position',new T.Float32BufferAttribute(p,3));g.add(new T.LineSegments(ge,new T.LineBasicMaterial({color:0xe8ddd2})))}

/* ---- helper tambahan ---- */
const GOLD=0xF5B800,DK=0x2b3a34,CRM=0xf6f1e6;
const fitF=(c,t,w,px,wt='800')=>{c.font=wt+' '+px+'px '+FONT;while(c.measureText(t).width>w*.92&&px>8){px-=2;c.font=wt+' '+px+'px '+FONT}};
const sign=(t,col='#14211b',f=.55)=>(c,w,h)=>{c.fillStyle=col;c.textBaseline='middle';c.textAlign='center';try{c.letterSpacing='.06em'}catch(e){}fitF(c,t,w*.94,h*f);c.fillText(t,w/2,h/2)};
function bands(g,x,z,w,d,y0,n,st,hh=.28){for(let k=0;k<n;k++){const y=y0+k*st;box(g,w-.6,hh,.06,x,y,z+d/2,DK);box(g,.06,hh,d-.6,x+w/2,y,z,DK)}}
function prism(g,pts,dep,x,y,z,c){const sp=new T.Shape();pts.forEach((p,i)=>i?sp.lineTo(p[0],p[1]):sp.moveTo(p[0],p[1]));
  const m=sh(new T.Mesh(new T.ExtrudeGeometry(sp,{depth:dep,bevelEnabled:false}),mat(c)));m.position.set(x,y,z);g.add(m);return m}
function lawn(g,w,d,x,z,c=0xd5e6bd){box(g,w,.03,d,x,0,z,c)}
function flag(g,x,z){cyl(g,.04,3.2,x,0,z,0x888888);box(g,.04,.4,.7,x,2.8,z+.36,0xd8362b);box(g,.04,.4,.7,x,2.4,z+.36,WH)}

const ORG=0xe0782a,MAR=0x7b2230,BGE=0xeadbb9,TER=0xb5532a,GRN=0x2a7a50,GL=0x5d7f93,CC=[0xc8412a,0xdde2e6,0x3d6ea6,0x2b2b2f,0xe8c15a,0xb8b8b8];
const cone=(g,rt,rb,h,x,y,z,c,n=12,ry=0)=>{const m=sh(new T.Mesh(new T.CylinderGeometry(rt,rb,h,n),mat(c)));m.position.set(x,y+h/2,z);m.rotation.y=ry;g.add(m);return m};
const oval=(g,rx,rz,x,z,c,y=.03,h=.04)=>{const m=sh(new T.Mesh(new T.CylinderGeometry(1,1,h,40),mat(c)));m.scale.set(rx,1,rz);m.position.set(x,y,z);g.add(m)};
const pine=(g,x,z,s=1)=>{cyl(g,.08*s,.5*s,x,0,z,0x6b4a2e,6);cone(g,0,.55*s,1.3*s,x,.4*s,z,0x3f7d4a,8);cone(g,0,.42*s,1.0*s,x,1.1*s,z,0x4a8c55,8)};
const vault=(g,x,y,z,r,len,sy,c,axis)=>{const m=sh(new T.Mesh(new T.CylinderGeometry(r,r,len,18,1,false,axis?Math.PI/2:0,Math.PI),mat(c)));
  if(axis){m.rotation.x=Math.PI/2;m.scale.z=sy}else{m.rotation.z=Math.PI/2;m.scale.x=sy}m.position.set(x,y,z);g.add(m)};
function facade(g,cx,cz,w,d,y0,fl,fh,cols,pc=GL){const sw=w/cols,rows=Math.max(2,Math.round(d/sw));
  for(let f=0;f<fl;f++){const y=y0+f*fh+fh*.22;
    for(let c=0;c<cols;c++)box(g,sw*.5,fh*.52,.05,cx-w/2+sw*(c+.5),y,cz+d/2+.01,pc);
    const sd=d/rows;for(let c=0;c<rows;c++)box(g,.05,fh*.52,sd*.5,cx+w/2+.01,y,cz-d/2+sd*(c+.5),pc)}}
function car(g,x,z,ry,c){const a=new T.Group();box(a,1,.28,.5,0,.08,0,c);box(a,.55,.24,.44,-.05,.36,0,0xdfe8ee);a.position.set(x,0,z);a.rotation.y=ry;g.add(a)}
function lot(g,x,z,w,d){box(g,w,.03,d,x,0,z,0x4a4a50);const n=Math.floor(w/1.0);
  for(let i=0;i<=n;i++)box(g,.04,.02,d*.9,x-w/2+.05+i*1.0,.03,z,0xeeeeee);
  for(let i=0;i<n;i++){const px=x-w/2+.55+i*1.0;if(i%3!==2)car(g,px,z-d*.25,Math.PI/2,CC[(i*2+n)%6]);if(i%4!==1)car(g,px,z+d*.25,Math.PI/2,CC[(i*3+1)%6])}}
function gate(g,x,z,c,txt){[-1,1].forEach(s=>{box(g,.55,2.6,.55,x,0,z+s*1.05,c);box(g,.7,.16,.7,x,2.6,z+s*1.05,GOLD)});
  box(g,.5,.55,2.9,x,2.25,z,c);label(g,2.8,.38,x+.26,2.52,z,Math.PI/2,sign(txt,'#fff',.5),560)}
function rd(g){box(g,GAP,.035,1.2,0,0,4.7,0x3a3a40);box(g,GAP,.04,.05,0,0,4.12,0xeeeeee);box(g,GAP,.04,.05,0,0,5.28,0xeeeeee);
  for(let x=-6;x<6.4;x+=1.1)box(g,.5,.045,.06,x,0,4.7,0xf6e08a)}
function board(g,w,h,x,y,z,t,c=0x8a5a2a,col='#fff',f=.5){box(g,w,h,.12,x,y,z,c);label(g,w-.1,h-.05,x,y+h/2,z+.07,0,sign(t,col,f),Math.round(w*130))}
function twoLine(a,b,col){return(c,w,h)=>{c.fillStyle=col;c.textAlign='center';c.textBaseline='middle';try{c.letterSpacing='.05em'}catch(e){}fitF(c,a,w*.92,h*.34);c.fillText(a,w/2,h*.28);fitF(c,b,w*.92,h*.27,'700');c.fillText(b,w/2,h*.72)}}
function ac(g,x,y,z){box(g,.6,.3,.5,x,y,z,0xdde2e0);cyl(g,.16,.04,x,y+.3,z,0x555a58,10)}

/* ---- dunia: 5 kampus berjajar di sumbu X ---- */
const world=new T.Group();S.add(world);
box(world,GAP*4+16,.3,11,GAP*2,-.3,0,SAND);
for(let i=0;i<5;i++)box(world,14,.02,10.6,i*GAP,0,0,0xd9e8c4);
const room=(i,fn)=>{const g=new T.Group();g.position.x=i*GAP;rd(g);fn(g);world.add(g)};

room(0,g=>{ // Sindangsari: Perpustakaan Terpadu + Rektorat
  box(g,5,.3,.7,-1,0,3.45,0xf0d9c4);
  rbox(g,4.6,3.4,3.3,.25,-3.4,0,-2.6,BGE);facade(g,-3.4,-2.6,4.6,3.4,.25,3,1.0,6);
  box(g,4.9,.22,3.7,-3.4,3.3,-2.6,0xf3efe6);box(g,4.7,.14,3.5,-3.4,3.14,-2.6,ORG);
  box(g,1,2.5,.1,-5.15,.1,-.88,0x8a2a3a);label(g,.9,.8,-5.15,1.6,-.82,0,twoLine('Perpustakaan','Terpadu','#fff'),240);
  cyl(g,2,2.5,2.2,0,-2.2,0xf1e8d4,28);cyl(g,2.03,.32,2.2,1.5,-2.2,0x6b8798,28);
  for(let k=0;k<11;k++){const a=-.25+(Math.PI+.5)*k/10;cyl(g,.12,2.4,2.2+Math.cos(a)*2.05,0,-2.2+Math.sin(a)*2.05,0x9a5a2a,8)}
  cone(g,1.55,2.4,.8,2.2,2.5,-2.2,MAR,12);cone(g,.7,1.55,.75,2.2,3.3,-2.2,MAR,12);ball(g,.55,2.2,4.35,-2.2,MAR);cone(g,0,.07,.9,2.2,4.8,-2.2,0xdddddd,6);
  box(g,2,.12,1.4,2.2,0,.3,0xe9dcc6);[-.8,.8].forEach(s=>[0,1.1].forEach(t=>cyl(g,.09,1.8,2.2+s,.1,.2+t*.0+(t?.85:-.35),0x9a5a2a,8)));
  cone(g,0,1.55,.95,2.2,1.95,.3,MAR,4,Math.PI/4);board(g,1.7,.34,2.2,1.65,1.02,'REKTORAT',MAR,'#fff',.55);
  oval(g,3.2,1.1,.4,1.7,0x3a3a40,.04,.05);oval(g,2.5,.62,.4,1.7,0xefd9c4,.07,.05);oval(g,2.1,.45,.4,1.7,0x7fb35a,.1,.05);flag(g,.4,1.7);box(g,2,1.8,2,5.3,0,-3.8,0xeadbb9);vault(g,5.3,1.8,-3.8,1.0,2.1,.6,0x7b2230,1);label(g,1.8,.35,5.3,.9,-2.79,0,sign('Grand Auditorium'),420);
  box(g,.2,2.7,1.6,5.6,0,.1,0x8a2430);label(g,1.4,1.5,5.71,1.5,.1,Math.PI/2,twoLine('UNTIRTA','Kampus Peradaban','#fff'),420);
  gate(g,-5.2,3.6,0xb8561f,'Kampus Sindangsari');lot(g,-5.0,.6,2.2,2.4);car(g,-2.5,4.7,0,0xe8e1cf);car(g,3,4.8,Math.PI,ORG);
  pine(g,-6,-4.6,1.1);pine(g,-1,-4.8,1);pine(g,5.5,-4.6,1.1);tree(g,5.4,2.4,.8);tree(g,-2,-.3,.7);person(g,-.8,2.5,TEAL,.4);person(g,3,.9,0xc8412a,-.6)});
room(2,g=>{ // Ciwaru: FKIP
  rbox(g,7,2.8,4.2,.2,-.8,0,-3.4,BGE);box(g,7.05,1.05,2.85,-.8,0,-3.4,ORG);facade(g,-.8,-3.4,7,2.8,1.15,3,1.0,8,0x4d6a7d);
  [-3.9,-1.6,.8,2.2].forEach(x=>box(g,.2,4.2,2.9,x,0,-3.4,ORG));
  box(g,1.8,4.2,.4,-.8,0,-1.85,0xf3e6c8);box(g,1,2.6,.06,-.8,.3,-1.64,0x4d6a7d);box(g,2.4,.14,1.3,-.8,1.3,-1.3,0xd9c9a4);[-.3,.3].forEach(s=>cyl(g,.08,1.3,-.8+s*3,0,-.75,0xd9c9a4,8));
  box(g,7.3,.2,3.1,-.8,4.2,-3.4,0xf2e6c8);board(g,6.4,.95,-.8,4.4,-2.05,'Fakultas Keguruan & Ilmu Pendidikan',0x8a5a2a,'#fff',.4);
  box(g,3.4,1.9,2.4,5,0,-3.8,0xe8b27a);vault(g,5,1.9,-3.8,1.25,3.6,.35,0x8e9096);label(g,2.4,.35,5,1.05,-2.59,0,sign('AULA & LAB FKIP'),460);
  rbox(g,2.2,2.4,3.1,.15,5,0,-.6,BGE);facade(g,5,-.6,2.2,2.4,.2,3,.95,3);[4.2,5.8].forEach(x=>box(g,.18,3.1,.06,x,0,.62,ORG));label(g,1.8,.3,5,3.2,.64,0,sign('GEDUNG C FKIP','#8a4a1a',.5),380);
  box(g,4.6,.03,2.5,-1,.01,-.1,0x7fb35a);[[0,-1.3,4.5,.05],[0,1.15,4.5,.05]].forEach(([a,z,w,d])=>box(g,w,.02,d,-1,.03,-.1+z,0xffffff));[-3.3,1.3].forEach(x=>box(g,.05,.02,2.4,x,.03,-.1,0xffffff));box(g,.05,.02,2.4,-1,.03,-.1,0xffffff);
  const ring=new T.Mesh(new T.TorusGeometry(.45,.02,6,24),mat(0xffffff));ring.rotation.x=Math.PI/2;ring.position.set(-1,.04,-.1);g.add(ring);
  flag(g,1.6,.9);gate(g,-4.2,3.6,GRN,'Universitas Sultan Ageng Tirtayasa');lot(g,-4.8,.3,2.2,2.4);car(g,1,4.7,0,CC[2]);car(g,-3,4.8,Math.PI,CC[0]);
  for(let i=0;i<7;i++)pine(g,-6+i*2,-4.8,.9);[[-1.8,.7,GOLD],[-.2,.4,NAVY],[.6,-.8,TEAL]].forEach(([x,z,c],k)=>person(g,x,z,c,k));person(g,3,2.4,0xc8412a,-.5)});
room(1,g=>{ // Sindangsari fakultas: FEB, FISIP, rumah joglo
  box(g,3,5,2,-.2,0,-4.4,BGE);facade(g,-.2,-4.4,3,2,.3,4,1.15,4);box(g,3.2,.15,2.2,-.2,5,-4.4,0xe0cfae);
  rbox(g,4.8,3,4.1,.2,-3.5,0,-2.8,BGE);box(g,4.9,.8,3.05,-3.5,0,-2.8,ORG);facade(g,-3.5,-2.8,4.8,3,.95,3,1.0,6,0x4d6a7d);[-5.9,-1.1].forEach(x=>box(g,.18,4.1,3.05,x,0,-2.8,ORG));
  box(g,5.1,.2,3.3,-3.5,4.1,-2.8,0xe0cfae);board(g,3.2,.8,-3.5,4.3,-1.4,'FEB Vokasi & Pascasarjana',0x8a5a2a,'#fff',.42);box(g,2,.12,1.1,-3.5,1.2,-.85,0xd9c9a4);label(g,1,.4,-3.5,.5,-1.3,0,sign('FEB','#8a3a10'),200);
  box(g,3.2,.8,2.6,1.8,0,-2.4,0xeadbb9);[-1.3,1.3].forEach(sx=>[-1,1].forEach(sz=>cyl(g,.1,.8,1.8+sx,0,-2.4+sz,0x6b3a1a,8)));
  cone(g,1.15,2.35,.8,1.8,.8,-2.4,TER,4,Math.PI/4);cone(g,.45,1.3,.85,1.8,1.55,-2.4,TER,4,Math.PI/4);cone(g,0,.5,.9,1.8,2.35,-2.4,TER,4,Math.PI/4);cone(g,0,.05,.5,1.8,3.2,-2.4,GOLD,6);
  rbox(g,3.4,2.8,3.5,.2,4.4,0,-.9,BGE);box(g,3.5,.7,2.85,4.4,0,-.9,ORG);facade(g,4.4,-.9,3.4,2.8,.85,2,1.0,5,0x4d6a7d);box(g,3.7,.18,3.1,4.4,3.5,-.9,0xe0cfae);
  board(g,3.1,.75,4.4,3.7,.55,'FKIK · Kedokteran & Ilmu Kesehatan',0x8a5a2a,'#fff',.36);box(g,1.6,.12,1.1,4.4,1.05,.9,0xd9c9a4);label(g,1,.4,4.4,.35,.52,0,sign('FKIK','#8a3a10'),200);
  board(g,2.6,.45,-.2,5.2,-3.38,'Gedung UPA Bahasa',0x3d6ea6,'#fff',.45);flag(g,1.4,1.2);gate(g,-4.4,3.6,GRN,'Universitas Sultan Ageng Tirtayasa');lot(g,-3.4,.2,3.6,2.4);box(g,.8,1.1,.8,-4.9,0,2.1,0xdde8e0);box(g,1,.12,1,-4.9,1.1,2.1,GRN);
  car(g,2,4.7,0,CC[4]);car(g,-2,4.8,Math.PI,CC[1]);tree(g,.3,.2,.8);tree(g,2.9,1.8,.7);pine(g,6,-4.4,1.1);pine(g,-6,-4.6,1);person(g,1.3,2.2,GOLD,.5);person(g,3.2,2.6,NAVY,-.4);person(g,-.6,1.5,TEAL,2)});
room(3,g=>{ // Kepandean: Fakultas Kedokteran
  rbox(g,6.4,3.2,5.2,.2,1.4,0,-2.9,0xf1e6c8);for(let f=0;f<5;f++)box(g,6.5,.14,3.3,1.4,f*1.04+.88,-2.9,ORG);
  facade(g,1.4,-2.9,6.4,3.2,.2,5,1.04,8,0x4d6a7d);[-1.8,4.6].forEach(x=>box(g,.35,5.2,3.3,x,0,-2.9,ORG));
  box(g,1.5,5.2,.14,1.4,0,-1.28,0xf3ecd6);box(g,.9,4.4,.06,1.4,.7,-1.2,0x4d6a7d);label(g,1.1,.7,1.4,3.5,-1.2,0,twoLine('KAMPUS','KEPANDEAN','#14211b'),240);
  box(g,6.7,.22,3.5,1.4,5.2,-2.9,0xf3ecd6);box(g,6.7,.1,3.5,1.4,5.12,-2.9,ORG);board(g,5.4,.8,1.4,5.45,-1.2,'FAKULTAS KEDOKTERAN',0xe9dcc0,'#14211b',.5);
  box(g,2.4,.14,1.4,1.4,1.45,-.65,0xf3e6c0);[-1,1].forEach(s=>cyl(g,.08,1.4,1.4+s,0,-.1,0xf3e6c0,8));label(g,2.1,.3,1.4,1.5,.06,0,sign('Fakultas Kedokteran','#14211b',.5),400);
  rbox(g,3.8,3,2.4,.2,-3.4,0,-.9,0xf1e6c8);box(g,3.9,.5,3.05,-3.4,.5,-.9,ORG);facade(g,-3.4,-.9,3.8,3,.95,1,1.2,4,0x4d6a7d);box(g,3.95,.14,3.1,-3.4,2.4,-.9,0xaeb4b8);
  ac(g,-4.2,2.55,-.9);ac(g,-2.8,2.55,-1.5);label(g,3.2,.7,-3.4,1.5,.61,0,twoLine('Laboratorium','Kedokteran & Klinik','#14211b'),420);
      ambulance(g,-1,1.7);ambulance(g,4.8,1.5);ambulance(g,-5.2,.2);
  [[0,.8],[.8,1.2],[2.4,.9],[-1.5,2.9]].forEach(([x,z],k)=>person(g,x,z,WH,k*1.3));
  gate(g,-4.6,3.6,GRN,'Universitas Sultan Ageng Tirtayasa');flag(g,-3.3,3);car(g,2,4.7,0,CC[0]);car(g,-2,4.8,Math.PI,CC[2]);
  for(let i=0;i<8;i++)tree(g,-6+i*1.6,-4.8,.9);tree(g,5.8,1.5,.9);tree(g,6,-1.5,.9)});
room(4,g=>{ // Cilegon: Fakultas Teknik
  rbox(g,4.8,3.2,2.4,.2,-3.3,0,-2.4,BGE);box(g,.9,3.5,3.25,-5.65,0,-2.4,ORG);facade(g,-3.3,-2.4,4.8,3.2,.25,2,1.0,4,0x2f4a5c);
  rbox(g,3.2,2.4,1.7,.2,-3.8,2.4,-3.1,ORG);box(g,3.3,.12,2.5,-3.8,4.1,-3.1,0xd8d4c4);facade(g,-3.8,-3.1,3.2,2.4,2.55,1,1.0,3,0x2f4a5c);
  box(g,5,.15,3.3,-3.3,2.4,-2.4,0xd8d4c4);ac(g,-2.2,2.55,-1.5);ac(g,-3.4,2.55,-1.2);cyl(g,.1,2.4,-2.6,4.1,-3,0x9a9ea0,8);cyl(g,.1,1.8,-3.2,4.1,-3.4,0x9a9ea0,8);
  [[-4.8,-3],[-2.9,-3.6]].forEach(([x,z])=>{ball(g,.3,x,4.4,z,0xf0f0f0)});label(g,1.2,.4,-3.8,2.3,-1.99,0,sign('TEKNIK','#fff',.5),260);label(g,2,.4,-2.6,1.7,-1.18,0,sign('UNTIRTA','#8a3a10',.5),300);
  box(g,3,3.6,.2,.3,0,-4.7,ORG);for(let i=0;i<12;i++)box(g,.04,3.6,.06,-1.1+i*.25,0,-4.58,0xc8651a);label(g,2.7,1.4,.3,2.5,-4.56,0,twoLine('Untirta Cilegon','Fakultas Teknik','#fff'),360);
  box(g,3.8,2.4,3.2,3.6,0,-2.4,0xeadfc8);[2.7,3.6,4.5].forEach(x=>vault(g,x,2.4,-2.4,.62,3.4,1.5,0x9ea3a6,1));
  [2.9,4.1].forEach(x=>box(g,1.05,1.3,.06,x,0,-.79,ORG));label(g,3,.4,3.6,1.8,-.78,0,sign('LABORATORIUM CILEGON','#5a2a10',.42),520);
  [[6,-1.4],[6,-.4],[6,.6]].forEach(([x,z])=>{cyl(g,.4,1.8,x,0,z,0xdfe3e4,14);cone(g,0,.4,.35,x,1.8,z,0xb9bec0,14)});
  [0,1].forEach(k=>{box(g,.06,2.2,.06,1.2+k*.9,0,-.4,0xb0602a);box(g,.06,2.2,.06,1.2+k*.9,0,.3,0xb0602a)});[.5,1.2,1.9].forEach(y=>box(g,.96,.05,.8,1.65,y,-.05,0xb0602a));
  oval(g,2.6,1.3,.4,1.3,0x3a3a40,.04,.05);oval(g,.9,.5,.4,1.3,0x7fb35a,.08,.05);
  gate(g,-5.2,3.6,ORG,'UNTIRTA');flag(g,-3.4,3);car(g,-2.4,4.7,0,0xf2f2f2);car(g,2.8,4.8,Math.PI,ORG);car(g,2.6,.2,0.4,0xf2f2f2);lot(g,-4.8,.5,2.4,2.4);
  pine(g,6,-4.4,1.1);pine(g,-1.6,-4.9,1);tree(g,4.6,2.4,.8);person(g,.6,2.6,GOLD,.3);person(g,-.9,.7,NAVY,-1);person(g,2.8,.6,TEAL,2)});

/* ---- ruang tunggu di dalam gedung: 5 tata letak rapi ---- */
const LOGO_DATA="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCADGAMgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7LooooAKKKKACiiigAooooAKKr6lfWWmWUt9qN5BZ2sK7pJp5AiIPUk8Cvm74r/tfeD9Blk0zwPZP4p1AHaJwTHahvY43P/wEYPrQB9MkgAkkADkk15j8Q/j18LPA7SQat4ptbi9j4NnYf6RKD6ELwp/3iK+ZV0T9pr47IbrWr6Xwx4bl+bE5Nlb7PaMfvJB7tke9O0z4Yfs7+ArpbXxN4m1L4heIVOP7L0WNpF3ehWLP/jzj6UpSUVd7AdzB+214PbXGgm8IazHpfRboSxtL9TH0x/wLNe0/Dz42/DLx3si0LxVZi8fpZ3beRPn0Cvjd/wABzXitzdeGW0oQan+yrfReGgP3UkEMD3iDuzRKRIv55rgL74S/s/8Aju7aHwL48vPButk8aVraMmG7ACXa35M1c+HxuGxN/YVIytvZp/kU4yjuj7tHIyKK+GxY/tQ/AtRPY3Evirw5F82EJvoNnup/exjHcYHvXpvwt/a/8F69LHp3jWym8LX5O1pmzLalvdgNyfiMD1rpJPpeiqulajp+rWEV/pd7bX1pMN0c9vKJEcezDg1aoAKKKKACiiigAooooAKKKKACiiigAooooAKKKwPHvjLw34F8Oza94o1SHT7KLoXOWkbsqL1Zj6CgDfPAya8B+Of7UHg7wC82j+H9niXxCvymGB/9Hgb/AKaSDqf9lcn1xXjviz4p/Fj9orXLjwl8LtNutF8NBtl1cl/LZkPeeUfdB/55rkn3rQ8CeF/h/wDDHVl0fwZoo+KfxKix51zgDT9MfuWc5VMH6t7rWdatTowdSpJRit29EhpNuyMB/BPxo+OYPin4oeIU8I+EI/3q/bT5EKJ1/dwEjPH8Tn8TXWfDqLwN4anFh8C/h7J431mM7JvFWsjy7OJuhKuw56dIwPqa7+2+FuqeLdQi1z4w6+3iS5Q74dHt8xaZan0Ef/LQj+83WvULO1trK1jtbO3ht4I12pFEgREHoAOBX5bn3idh8O3Sy6PPL+Z6R+S3f4L1O2lgm9Z6Hl0nwx8T+MZRdfFfx1f6xETn+xtKY2dgnsQuHk+pOa73wt4U8NeFrMWnh3Q7DS4QMYt4QpP1PU/iadqXijw5pshjvtd063kBAKPcLuGTgZGcjk4q7ealY2l9ZWNzcxxXF87JbRseZWVSzAfRQTX5Xmuc5vmjvi5yad2ltHTV2S00XX7zthThD4UW6wvFfg7wt4rtjb+I9A0/U0IxmeEFh9G+8PwNM8aeMfD/AINtrS68R3hsra7uFt45zGzIJD0DEA7c88njitNNUsX1Z9KWbN4kInMe0/6snAbOMYyCOvavLpU8VQUcRTUo7tSV1tvZrt1NG4vRnmcXwy8V+DpDc/Crx9qGlxKcjR9XY3li3+yN3zoPcEmuF+IKeB/Ec5sPjv8ADmTwbq8h2ReKtFBezkbsWdRx16SA/UV9J1Fd21veW0ltdwRXEEi7XjlQMrD0IPBFfb5N4kZpgWoYn97Dz0l/4F/nc5qmEhLbQ+PJvh58Y/gt/wAVd8JvE58U+FpP3u/T2E6OnX97Bkg8fxJnHtXsHwU/a08LeKJIdG8cwp4Z1gkIJySbSVun3jzGfZuPetK5+Fmo+FNQl1z4Qa+/hi7c75tJmzLpl0fRo/8Almf9penYV5t498N+APibqh0f4gaIPhd8RpMiG+QA6fqbdAQ/Cvk+pDe56V+yZFxVl2dx/wBnnafWL0l/wfVXPPq0J09z7KglinhSaCRJYnUMjowKsD0II6in1+f+i+MPjN+y/wCIYtC8R2r6r4Zkk/dRSSF7aVe7W8vWNsc7T+K96+x/hB8VPB/xR0Maj4Zvw08ag3VjNhbi3Poy+nowyDX0ZidzRRRQAUUUUAFFFFABRRRQAUUV4L+05+0FY/DeE+GfDKR6r4yulCxQKN6Wm7ozgdWOflTqe/HUA6b9oD43+F/hLo5+2Ouoa9OhNnpkT4dvR5D/AAJ79T2zXy9aeEfE/wAVpX+LXx88QyeHfBcA320DsY2mQ9I7eM8qp/vYLN2z1Gl4Y8AWfgyWH4nfHT7V4k8aaxL5mjeGM+bcXMx+6ZV9uPl+6vfJwB6/4Y8Ba54r1yDxv8WpIb3UYm36ZoUXNjpS9ht6SSerH/8AV4Gf8R4PI6HtcQ/ee0Vu/wDgd2a0qMqrsjF8O6X4g8eaFDofhnTZvht8MIxiOC3Xy9S1ZO7MesSN3JyxB79vSNNsfBXw08Lx2tqmnaBpURCgswTzHPAyTy7n8San+IviBvC3g6911UBS12GRzGXEMbOqtIVHJCKSxA7CvNrzWfAXxT8M6r4DuPH2ia7f6grtp0iRiKaJsbl2qepVgOnJHBr8SzDNMx4lksRim1h1KzjBNqK0u9rNpO95P0R6UIQo6R3PUX1O6n1m40dbdrJmtBNaXchDCU5w2E/2crkHH3hXF/A3xHqvi3wvr+meK7gTa3pmqXOnagEQRrt/gKqOilT+hrB+GHjn+1/BWn6frlzHD438OX6afdWcjgTzOGEZIXqyvGScjjIJ7Vuab4M8UaR8YfE/iXQpdNttH121gEy3JZmFygwZVReCMdiRkk1wVMDTwlOvhq1oTVnGT6uLSdnu1OMubTRtaFqTk00c5caPpPhf9pLw5ZWlpbJpOv8AhmbTTEEGx2gO8Z9SVHWj9o6PVW8jxJoFrfS33guSK/gMQBiZTkzo5z/zz29j+td4PhzpdyPC8+r319fX/htSbS5WTySzsMM7BeuQMYzjFdGmg6Qo1EfYkYamxa9DMWEx27eQTjoAPpVf27QpYijXu6koR5XdaS95q+rvrTdnp5C9m2mtv6/zOM8V2ugfFfwXpNjvSXTNespZ424LRnyvlYejIzD8Risj9mzUtbvNM1PR/E0Ui6z4aaPRbiVuRMIy7I4+qOn1xnvXo+meGvD+mG1OnaPZWn2QMtv5MQQRBvvBcdM9/WrsVhaQz3dxBAkM92QZ5EGGchdoJPqAAPwrz6mbUVg6mChFuD1jfeL5rvbvHR+aRag+ZSZ5N+0V42vdH0i3tNC1CGBoNWsY9TZZP3vlySA+WozkZAG4+hx3rrfiZ8QrHwbLpemxWE+sa7rE3k6bptuwV5j3ZmPCIO7Gs34kfDBfE3w8XwrYap9nkjuluo7y8i+0Sl1k8zlsg8ngnk4qlrmg/wBm/HDSPHeu7m0630CSySdULR2tzvBJbjKhkLgMeM8HqK9GgsrxFGjTtdw9o3HVObtHlu/7zT0Tukrb6kPnTb9DsNL8SXK6xaaH4g01dO1S8hea3WCY3EMqpjeA+1cFdy5BA6jGaueK/Dmg+LtEl0jxBpttqVjMOUlXOD/eU9VI9RzXmWnfFuZPhVqXxH8QaFDaiGea10RAWE18C+2MbCMoXKrkAn7pNQfAi08WR+Hra+Oq3t1qVzqzvr8F7Gy20BfLSRQq2CrR/KMr8pZiOccY1ckrUIzxSfspU5cujbTkrt8r1asrbt+87ejVRP3d7ia1o/iP4faNPouradN8SPhjKpE+n3Q83UdLT1jJ5lRew4Ydsda8V8WfC6/8KJD8YP2ffElzq2gxEyOtsxN3p/dkkXq6DoQRkDqCOa+wtF8Q6PrN/qdhp19FPd6XP9nvYQfmhfGRkehHQ/X0NcJ4r+H2raF4hl8c/Cq5h0nXnO6/0yTix1Ze6yL0V/Rx+PrX3vDPiFUpzWDzjR6WntvtzLz/AJvv7nLWwifvUxn7NP7SWi/EiODw/wCJDb6R4qACqm7bDen1jJ6N/sH8M9voGvhf4h/DHQ/ixbah4s+GWnyeGvHulPv1zwpIfKlEoOfMh6ck8gj5W9j17b9lj9pKW/u4fh78TpmtNZib7Paajc/IZmHHlTZ+7JngMevQ89f1+MlJKUXdM88+sqKKKoAooooAKKK8J/aw+Olt8MNC/sPQpI7nxdqEf+jxj5haIePNcev91e556DkAo/tU/H1PAUP/AAhvg4i/8ZXoCARr5gsg3AJA6yHPyr+J7A+WeBPCFv8AB8Wni3xjYv4t+L3iFjJo+iM/mNbO3JmlPYjqznpyBzkiH4ZeFV+E2iwfE7x3Yy+IPiZ4ikI8O6JKd83myf8ALWQHkNzksfujjqePbPhP4Cu9Fubvxf4wu11fxtq4DX94eVt17W8P91F6cdcV8vxTxPh8gw3PL3qkvhj3835L/gG1Gi6r8hPhn8PrrTdUn8aeNr4a5421Bf392w/dWaHpBbr/AAIOmRyavfFnxZb+FrKx/tDVTodhfSSQzasYDKLVgmUGMEAsc4JBHHvXW6oL1tOuV014UvfKbyDMCUD4+XcBzjPWvFT8aTaWn2D4q/DrUtKt5i6Pcwwi+sn2HDZA5AB7EHFfhGGeOzzGSxtZe1aesU0pWaduWLvdLdJJ7ao9R8tOPKtDrPh58WvAHjO8HhnTvFFtq+piIhw9o8AugB8xVXGDxyQPftVK/wDhrpl7rcltB4H0HSktb2C7tNatAscwCuHICKMhxt2nJ2kNn2q34P0qz8THTtYs7LQU8P2l0t7o93Y2ZhmnG1hypA2Dkg4zuHpmvSayxuLhluJksFeN1qm9pX/uqK23i1Zaprs4xc17xTXS9MXVG1RdOtFv2XY10IV80r6b8Zx+NXKKTFfOSlKfxO5slYKWgCvNfid8SNU0TxTp3gnwX4bbxN4sv4jcC180RxW8I48yRuw/L69M9uW5ZiczxCw2FjzTf9Xb6EznGCuzo5PiB4MTxovg1/EViNfbpZbzuzjO3OMbsc7c59q6evg1vgz8dG+NAv38JXB1g6h/af2oyj7Ju3+Z/rs4xnjGc9q+sPhX8Q77xJrOr+FPFPh9/DvivR9rXdiZBIjxt92SNh1Xp+Y55r7PingStk+HhiaDc4Je+9NH5eX326s5qGKVRtM9CoooxX56dZyPjzwJpniq+0jVJ2Zb/RrkXVkHJe3Mg6eZHnDD34I7HtUelT68GHh+9itbPULjfO8llG/kQQbsErI4+eVic47E5xgc9lSH9e1ejTzKqqSo1PejH4b9Ov3X1t+l7xyK90fPnwGWW88QfEttAlFnPd+I2iW527xbQwj7xB+8TkgA9eSehr3fTtU02+ke3tNTsryeIfvVgmVip9wCcV5D4/8AAt1Ha+Hvhn4RuptG0vW7y6vNd1CI4nmRQHdd3dnLAfQegIrW0rwd4S0fwyv/AAqvSNKbVtOv0tvtKOPMEiOFmE8vLEbd2Qc5yMDpX0ubxwuYtYjnac7cuidkvcUpybVr8ui1slfd640+aOn9fI2fiX4AOv3lr4n8NX50LxjpozY6nGOHH/PGYfxxnoQc47eleKfErwLY/HC31G4tNLh8MfGDRI86ppOQsepoOksR6Nn+F/cBuxr6mXdtG7G7HOOlcN8U/AkniT7Hr/h+8GkeL9IPm6XqSDv3hk/vRN0IPTP1z6PBXG08qmsHjHei9n/J/wDa9103XZxiMNzrmjueW/sjftAXf26L4XfEqeS31S3f7Np17dZV2ZePs8xP8YxhWPXoecZ+uq+Ivi14Lg+Negah4t0DS/7E+KPhwCPxFoa/K1zsHEsf94kcqw6jg8gE+jfsa/Hc+NNOTwJ4vudviewj2200pwb6JfXP/LVR19Rz61/QEJxnFSi7pnlPQ+l6KKKoDzP9ov4s6Z8JfAr6rMqXGr3e6HS7Qn/Wy45Zv9hcgn8B3r5Y+Cnh2FbXUf2kfjJLJfQicy6TayjL6hdZwjKp6gEbUXpxnotdl/wUohVrLwNMRnE90n4ERH+ldZeafb+Iv2gPDvhzUlDaJ4X8LWup6bp6KFhW5dtnmMvcqAMemK8/NcxhluDqYuauoK9u5cIOclFGt8JfCut6jrVx8UfiCgfxTqiYtLQ8ppNqfuwoOzEfePXkj1r0u9uI7Oznu5t/lwRtI+xSzYUZOAOSeOgqauU+Jlr4vvtEjt/A+qadp+rRzrPvvVLI6Lz5eBzhjgE+ma/mDGY+tnmY+3xU0nJ7vRRXbrZL59z2YwVONoo8stfiBqnhHxNc+LvHHhOU6DrO2Sz1/TJXnW2tyP3cNxH/AA7R1IH3ietekaJLpPiDXl17wveaTquk6jalNQkWXeV/u7AOAX6MDj7g7iuOs/i5f6BMmhfFbwPeaFLO3kpe2cRutPumY4wCASCxP3TnrXpng7wxoXhbT57XQNLh06C7uHu5Yo0CjzHxngdMYAx2xXsZxNUIe0nS5JtcsXGXNTlFdtXrHTZ2vukRTV3a/wDma9vDFbwRwQRpFFGoREUYCqBgAD0qSivAvjr8S9S1OTWPA3gX7TH/AGciP4i8QRSqkWlwFvnAY9XxkYBznIGT08TJclxWdYtYfDq7erfRLq3/AFqaVKkacbs9J8c/FPwD4LEi+IPEtjBcIMm1jfzZ/psXJB+uK1/AXirTPGvhWz8SaOtytldgmMXERjfgkHg/TqODXw/40+G0OofDu4+JOl6XNonhkXsNhoyXLGS71PfIQ91Mx6ZwSAOM8DgZP1l4x+JvgL4TafYeHNWvGhuoNOVrWzggZiyKCqjgYGSpHNfZcS8E08qp0MPhOerXqN7bWilf3UvNat6HPRxLm25aJFD48fF2HwXbXPhzw9aXmreMJ7Qy21ta2xmFuDwJZAOw6gc547Gvj/SL74qWXiG68RGbx/a6vepIl1eW1rKJZFwCi7uPl3AZHQADGelaz/Hbx1p3xB1fx1oN5p9hqOuW6RzxLZeaII4ztSLMg64UEkcHP4V0L/tP/GAW9zIPGemNJFFE8cY0dczM2NyA7MApk5JwDjjNfq3CfDNDI8JFcv72SXO99eyfZf8ABOGvWdSXkYE3jb4zCBfJ8U/FAyfZAzBo5gv2ndyoO77m3+LrntWLFqfxDm8WQ+Jb3U/HY1eNXjF99lleYRquYlJJ+YF8gqeAOeeld2f2nvi6NS+zf8Jtpht/OKfaf7GG3aBkPjZnBPGMZqKL9qL4wtFbs/i/TkaVJGkU6Op8llztU/LzuwMEdM819ROEZxcZK6fQwTsfSvwE+Ktr480eLTNTjuLHxVZWqPqFpcW5iL9jKgPVSfyzXbePPEI8KeD9T8RNp9zqC2EBma3t8eY6jrjPoOT7CvhfSvj744HxT0/x7rjWeq3kNl9gmUWnlbrcvuZfkA+YdQea+xfh38UfBHxNbUNL0G5uJ3ggDXUFxbNEfLfK9+vofrX8/cX8JPKcd9ao0nLDOzdumuqutl2/4B6uHr+0jZvUyfA37QHww8WNDBDr66ZeS4At9RXyTuPYMfkP4GvU1IZQykEEZBB4NfDnhP4UNbfDq9+I2n6NF4jstM1S80/XdGmX5pLWNx++gcfMjqD1HTAPIyK9L+BPxFvvBlloGg+I0M/gzXZ5V8N6690JPKG75bafsjL0wcYJ9OnqcS+HMcPhni8sbklq4uzdu6el7dtyKOLbfLM+hvEmiWPiDS5NPvvPRWB2S28rRTRMQRuR15U4JGR2JFZ3w/8ABPhvwHog0vw7YrbRfemlY7pZ27vI38Te9dJ2zXE/FfwQnjWxsrS58QanpOnxTZ1BLS48oXUGDmNj2G7HPpkd6/NsHWnUSwlSs4Um7vdrTyW77eZ2SS+JLU56/wDixokXxVstA03Xm1iB90N/BZ2nmQ2H92aScdPmAUjp83bFer14t4l8Q/Bf4eeHZPA9lbw3DXAEcmj6Khnubn/ZkKc89DuOcGvR/h3rl/4g8LW+oanoN5oN2WZXsbpcPGoPyZ+q7T+denm+BgsPTxFGlKEF7t5WTl1UrK3mna6Wl5NsinLVps5P4veF9YtNTtfib4EjCeLNFT97AOF1S06vbv6nGSp7H8MeA/tB+Gba5tNJ/aM+FDyWlpczpLqUMHyyadeA8uQOnzcMOmTno1fZleJadpdtpHxe+JPgm1RV0LxB4Tl1iWyZQYlusmN3Uds5yff6Cv0Twz4iq1W8rrapK8X2XWPp1Xz8jkxlFL30eo/s5/FKx+K/w8t9bQJDqlviDU7ZT/q5gPvD/ZbqPxHaivnj/gmi7C98cw548uzb8czCiv2E886H/gpLaM3gXwpfqD+51OSMn03R5/8AZK3dBuPM/aJ8P3gOV1P4dWsgP94rL/8AXqz/AMFBtP8AtfwHS8AybLVYJD7Bgyf+zCuV8Cah53iz4Ga03TUfCN1pzMe7RANj81NfPcWUnVyXFRX8jf3a/obUHapE+hq8l+KSeP7DxDcX3hDwZa67qN3GkOn6pNdIqaauPnDRsQSN3zZHB79MH1e4lSCCSeQ4SNSzH0AGTXydL8TI7PU4vE2h/FS8m8Q3VxtudC1+N7bTVR88LlQEWPjDAknHvX4DwtgMRias6lKKlZWtJSad9Vdx2Wmrbt0ejZ6laSSSZ6r8NNL13T9dh0bxF8Qm8YahKhn1ewkRHismU7o3QgZTDgAA8HqAMV6/XnHwTOs6hDqeva94y0bxNd3LRxqdJiC2tooBJjVhy5O4Ek88Cu18VX76X4Y1XU4yoe0s5p1LdMqhIz+VcedudbHey05tForK77Llj3ttslvuVTso3PNPjjrGv3/jfwV8N/DOvy6JP4hupft13agNPDBGm47Qemeefb61xGi+ANH8XeND8HPBjXR8D+HrwXnjDV5H3Taveg8Qs464IIwOBhj2GY/Cn9mfD/8AZ2X4xyrcat8SPFqNa2d5dOZJVmmkZVWIH7oCjdxycY6cV0nxB0bU/gl+yVb6VouovY+IdTvLePUr+NsTNPO2ZirdcgDaD1wK/orhvIaWR4COHVnLeUkrXe/rpsjyK1V1ZXGfESKX4ufGJvhhpd62neBfBkUMmoJZKoE10PuRA4wAoGMdtrd8Y8//AGrR4s8PfHPSNc8O3Go28mtaYljbvZRLI8kqyHMQDcZO5T6819E/CvwBofw88OHStG8+Z55DPd3dw26a5lPV3P8ATtR8WvAmmfEPwdcaFfkwzg+bZXa/ftp1+66n+Y7jNfldTj2M+I4Yt39hFOK7pO15fek7dlbc7vqtqXL1PlPyv2iz/wAw34i/+CWP/Cj7P+0V/wBAv4i/+CWP/Cu78JfHX402sd34Zu/+EEN9oE39n3M2sagLaadk434ZxuyB94CtO/8Aj/8AGGyMJls/h3PHISN9jfG6249RHIcde9fuSqQlBTT0fU8itVhRi51HZI8w+z/tFf8AQL+In/glj/wpfI/aK/6BnxF/8Ekf+Fely/tF/E7y/wB3a+GA/vazY/8ARlP0z47/ABov4HnUfDO0RZNgF9fG2ZuM5CvICRSjVhJ2TOXD5lhsRLkpzu/67nmIh/aLB4034ij3/sWP/Cu1/Y5PiTxD8RPFXjHXby/vDDZx6Y092qq7SBwxT5ePlC/+PCpPFHxc+M/im8sPh5FfeCIZ/EzNa/a9CvftEttEOZGJVzs+Tdz1645r6C+H3hLSPBHhOy8OaJD5drapgsfvyufvSMe7E81+eeI+fUsHl7wMdalX8I31fztZfPse1g6TlPm6I8p0wL8DvjlYxR3cyeAvG0jxXENxKXis78nIbLdA2cc9ic/dFZfjzwVoPw38dS+FfE1l9q+Evjm7DRAMR/YuonoyMPuA+vp1+7z7b458J6D408Oz6D4jsFvbGXDbSSrIw6MrDlWHqK8q+AuhwfFH9mHX/AGu6m17dWd/dWdu1xJvnsyjZgY55GG6e2R0ro8P+I5ZtgnQrXdSlZN9072frpZ/f1JxVH2crrZknwZuZvBHxY8XfCTUdfuLyxsTBc6CdRnDTvFImWRScbgMjgehr2m5hiubeW3njWSGVCkiMOGUjBB/CvmrU1sfH/7LOrazrunlPiF8Pg1k19GSlzFJA67W3DkqU7HuCRXvXw61hdf8CaJq4u4rqS5sYXmkjYMDIUG7p3znIr4XxJyCOBxccwouyqPVJWs0lr89/U6sHV5o8r6HiL69p3wlTVtM8EfCWQtpTiO91y9mSC3bOMMZ2+Zshh8o+mK7r4ca/wCNn8cfYfHGq+G3l1Kxaaz03SJC/wBmWNhl3YnncHAz0+XirvxB8AQeMfHOlXPiPVEfwxpsH2j+xyQqXN1uwJJf7yBcDB7/AFOc3T9N+G/w41yK68I6f4fivdUvIrW6xqf+kKkkir+7Ri3AJB2DaMD2ry62LweNw3KoOdecdXZy16XnKXu2av7seqjfdlqMoy30PWK8g1LC/tL6uxOB/wAK8uSf+/wr1+vEfENwsfx0+IF+x+XTfhxKufQu5P8AStfDOLeeJrpGX6Cxj/dnHf8ABNKJvtHjm4x8uLNAffMxorW/4JrWrL4R8X3pHyyX8EQ+qxkn/wBDFFf0QeSex/ta6T/bH7PPi+BV3PBZi6X28p1c/opr5o+Gesbvgx8IvEBO4+HfGculztnlY7gE8/g4r7a8T6ZFrXhrU9HmUNFfWcts4PcOhU/zr89vg8txL8Efit4PcEajoc1trluo6q9tLtlI/Ba58XQWJoTovaSa+9WKi+Vpn2/r92NP0O/vzB9oFvbSS+VnHmbVJ2598Yrl7u/0TURp+j+JvD9n/a2oQGSG0eya7iGFBI37Ap25GelaYvLLxF8N/t087JZalpPmSyx8lY5IssR7gE15dpHwQ+EupRwvYa5rVwWQMgXXJA+CBztzkZ47V/MOWUMJCE/rTnFxdrxi3Z26u6S13Vrvuj2ZuXQ9E+FWnWml6NqFnaaBp+hmPUpllt7A5gZhgeYowNu4bTjHFcH8adOk8afGnwH8NdQv7238O6nDdXWowWspjNx5S5VWI/h4/U16T8PfCOneCfD/APYeky3UtoJ5JkNzKZJAXOSCx5PNcP45YWP7UfwqvYjvluY7+zkj6kIYs7vwJr3uD50cRxRCd+ZPmabX912erdvvdu5liLqixni3SNO1/wDaa8A/DrTLSOHQPBWmNq01qi/u0fhYFx7EIfxNZ+pWEfxI/ar8RWniaSS70jwVBanTdOLHyPPlUOZWXoxBz19vSuh+C4Oo/tR/F/V5DuNsbKwjz2VY+R+a1hfs6ebf+Ofirr2pEnV5vE0lpOMcJHFkRqPoDj8BX65xxjamCyOvUptqTsk15tJ/hc4MNFSqJM9prn/iD4t0jwP4TvfEmtzbLW1ThB9+Vz92NR3YnirninxDovhfRJ9a1/UIdPsIMeZNKeAScAADkknsK+bvFHxZ+Gfjb44+HG1rXGl8HaFbG9jhNtIVu9QLYRWXbkhRtPIx1Hc1+GcKcNVs7xkIyi1ST96VtNNbX2u9vnc9OvXVKDfU4rxd8LLLW45fHvxE8Sz6Fr/iKZ76LQrOxE8sMDf6suWdQmR69sd84xNE0iz0Sz+w2LySQhiwklUK757kDI/Wuh8U6zd+IfEmoa3fSM895O0hz/CuflUewGB+FZor+i01GCpwVorRLyWx+TZnm1XGycdo3/q4VleJtFt9dsVtLh2jCyB1kVQWX1x+Fa1IaV2ndHmUqsqU1ODs0a/gP4ajwdY2/wAWfh9rU3iO+8PS+Zquh3FqIp1tmVlkZSGO7CkkEfXtivrbwT4m0jxh4XsfEWh3AnsbyMOh/iU91YdmByCPavl74Q+KD4R8fafqkku2ydjBfKeQ0DcNkd8cH8K0Ph38Yfhf4F+JfjG10rWbhPBmpPFfafGLSTFvcNxMirjIXOCOMYAr4njvh15vhFi6EW61PSy15o32t3V7/efpPD2bPE0/3m63/wAz6qrw/W9Ms/A/7VfgXVfDiNp//CVtd22sQxNiK5KoGVyvTduIOfUfXPsHhzWtL8RaJa61o15HeWF2nmQzJ0YfjyDnIx7V5R+1Cpim+Ht/Ykx6xF4rtEsZFOCN5+YH2OBX5vwJia2Cz+lTd1zNxktuj3Xk9fKx9DikpUmzQsLODwl+2Jq+hPDG+jePtEN1JA4yjXMWQ4weDlQ5P+9WX8MND0/wT+0l478G+HVls9B/s61v4bDzC0cUr43FAeg5P6egrf8A2goxZ/H34MaxH8sjapcWRYdSsiKMfqazvDsvmftgfEQXgMdwmkWKWikY3w7VLMPX5iK/Z+OYp5DiLq+i/wDSkedhv4qNn4x+E/Bnim60JPGUWoSQRPMsItWkVclVYmRk5C4T6ZIrIi+DHw6GlQ3PgnRNDguxJHJDqUhe6aLawbchLff44ORiuo+Klz46i0+ztvAWm6de3l1I8Vw9+5WK3jKH94SDknOOB1zXH+CvhR4osdUtNe8W/Ee/e5tIlQWukotpahFAG1zjMg46sBX4lgcVVpYCD+uOmle0LuV9XvBKy1/mdn+B6Uopy+G57HXzX491Dy5f2hPEAfC2+l2GjRN6M6AMPzevpPouc8DvXxh8UNZ2fs5+LNWL/vvGPj2bZj+KCDJH4AqBX0nhVhubMK9b+WFvva/yMcc/cSPcv+Ce+mmz+BUt6wwb7VZ5B9FCp/7KaK779lfRDoH7P/hCzdNsktgLtwRg5mJk/kwor91PMPTq+F9MsYfBv7cev+FrtPK0vxSLizK/wsl5FvT/AMfIFfdFfGn/AAUA0i58PeO/BfxN01Sk0Ti3kdf+ekL+bHn6gsPwoA9K/ZjvJZ/hRH4fvsG88P3dzo9yjDOPKchcj/cK1z17pHxU+Ksr2urJa+BfC6O0beQomv7tVJBKsw/dKccdDj1q/wDDjVLWz+OeuR2jAaV440m28Tadj7pkKhZ1Hvn5jVnxr4M8X634h1KTU/itfaB4Z8wG2srBY4ptpUFg0p+b727A54r8BzXDLK8+xUU4wcmpxlKLk1zb8kUmnK76rS3Q9Wm+elE7zwToui+FdPTw1pd5czNAglYXV2085BONzFiTgkdsD0FcDcSJpf7ZPhy81pS1rqXh+Wz0iRvuxXKszOv+8V/mKp/Bmy+HWjfEPU9I8ELr+qatbwbNa1S7nkeNRkFUdnwC+QcBV9eaf+03LDY6n8NtXnlFrFZ+LLZpbs8LAh+8WPYHH6UuGZSwHE9JScpe0WrmuWXvK97XdrtaX1afmFZc1F+Rvfs54Pxn+NLn739vRDPttavGfGknjbw74g+NWjeCr/7Ld2urRa5cTREeYbWVGaREJ+64yp9cA17D8Fn/ALG/ae+K/h+dlzqX2XV7Ug8SRsuCR9C4rM0q0j8M/tY+MdBmzcWvizSYtWQzAN86ExvH7rgtx6DFfrvFVT2WVVK3Ip8nLKz2fLJN/hc4KCvNK+5852ulTeL9Cg1C/wDBXxK8RQXKiRblvEkTo59QphIHOfpU9lsstFGi2sE0Nglw06RXgjluY2IA2tKFBOMcAYA54rb8X/Djwj8PPGPiWfxr8NvEOveHrm4N5peoaNctHHaxHJeKRQQF29iew9KztStBbtBcQWs9vYX0C3dgJjljbvymSOCQOD7g1vQzDC4rDU54WS5Zq6St22suq6o+b4ldenSSje19f0KlKKMUcVqj4gWkNGaSmFgNM1nSdM8Vam17rOg6nrurNFFb20OnXkVmZAnGHJjIPy5OepwKfVqxtNOniu7zXNJudU0LT4Dc6pBBJ5bmAEA4bIwckY5pRqqk1JuyPRyuvVpYmCp9WrruijrSeNfh34fbVvDnhzxp4OtoCArTeI4bi3LE94fLG7JPavZvGf8AwkWt+LPgX4d8YPapqdzqf9o308KlYzJCquqAf3iDg+/Suc+F3wl0TX/ifo3inSPh7qvhnwnpsBnKa5cmaW/nbmMrGxOEXg5716Lr8X/CX/tbeEfDdy7rYeGtNfXCqHBe4LbUyR2GFOPrXymKxmDxvE2Gw+GhGUqalKcla+zSV12bu15o/T4xlGi3Lqbf7S3/ACVT4L/9jMf5JWRdOviD9sy/vtKhxbeHdAFjqVwvSSaQ7ljJ7kA5/wCAmtD47TjVf2jvhL4dRlxYT3OsXLE48uONOCfQfIaxv2abiPVfEXxO8Q2kj3Onaj4nle0vCuBOgzyvqBkV6XHeLeFyKu1vJKP/AIE7P8LkYWPNVR1XxL0LxH4j1mwt/CvjweGL+xt5JnjSBZ2nWRlA3oSPkBjPPPNcHD8NdSvdTtl+J/xL8Q3l6blPsttGy29hcPvBVVVR8/TlDg9eMc1b+IHjq+bxTcWWk/DLxdf3VheiP+1tNtgvmRoOVSQjpuOCCCpwetdp8MfE3iHxPbSw+LPBGpaFcWzh4ZLtEKTAHhhgna/qMY9D2r8ehLH5bgITXKopf9O/aK+uj1k1d6rdeR6Huzl/w9jY+J2uJ4b+HfiDXXbb9j0+aRT/ALW0hR/30QK+PPjdpdwnhz4N/CyHP2x9PW8ukHUT3soOT79a+jP2kjJrVj4X+HtqSZ/FGtwQSqD0tomEkpPsAoryj4dovxS/bqvtZhHmaR4dd3gIHyrHbKIYsfV8N+dfofhdgHRy2piZb1JaekdPzuceNleaXY+1tJs4tO0u00+BQsNrAkMYHZVUAfoKKs0V+mnGFeT/ALWng0+NvgXr1jBF5l9YxjULQAZO+L5iB9U3j8a9YpJESSNo3UMjAhgehB7UAfAXws8UySfCLwl4wVi978Odc+yX2PvHS7s4yfZWJFfRfxrvL/SfCM3iTwjog1XxJdJFYafKihzEJW+WT6AnP4jPFfO2gaJbfDX9p/xN8L9a/d+GfFsMunAv93yrgbrd/qr4XPrmvoD9nnVr+88CT+FdZkK694VuZNHvN3JzHxFJz1BTGD3xX5d4i4L2MqGaxjzKD5ZLWzi3dJ26Xun6nbhJXvAi+G3g678D/Dp9KS7g0m4uA02o6vdMJLia5cfNJjOBg8LlieBxmup8T6RonxB8A6hod3Jbalb3MBidk/gmAyGHdWDYIrkPGHjvw/4KntoPEdxP4o8ZyDbbaVYwlnLnoY4+kan++cnryelanwf0/wAaTajrni7xpbW2lXOs+SsGk27bhaxRhgDI38Uh3c+wH0H5tjYYlwlmNWXLK/NF7c0rr4b+80lrzaRVrJHbFr4EeFeCPGZ8O6r8PfHuo3m7UPD0knhLxXC5/exQF2EErg87QO/qmK9k+JrIv7X/AICnhYMLnw7dqWU8Mo3kGud/aR+Bn/CbQ3PiLwi8dj4ieLZdQ52RaigwQH7BxgYY+gz2I8k+FHj7UrD40+DtM+KLf2JdeGNKuNKFxfMVZ1YExByeBgNtDZwQBzX64uIsPxDkGIdD+J7OV4dU7dF1V9mvzPP9i6VVX2ufUPxyGfg34wGcf8Sa6/8ARbVz3w/8I6H4u+BnhC11i13smkweTOh2yREoOVP9Olenf6PeWv8AyyuLeZPZkdSPyIIqlqmqaL4esEk1C8s9NtV+RPMYRr9FH9BX4bhcxr0sNHDYdNVFPmTW+1rW3PSlhY4h8jjzJq1rXufN83wyeDwv4n1ybUjjR7maCGFUBMvlkDLHtkHtV3xt8I5dA8EjxFb6obl4okkuoGjAADYyVPsT3r18W/hbxR4Z17SfD2sWkx1YyyTNFOHKyuAN23OQOBVH4tw6ze+CE8K6NYTX2o3aRpMY1xHHGuNxLHAGSMAda+0w3FmZVMXSpyqcvv8AvKSStC0b3vsvi1vf8D5XGcNYfDUqinTfMo6b35rvp93Q+XCcdelexeGfgodR8GJq99qstrfXEHnwwrGCiKRlQ3ckj06ZrnZPg34+EJb+zbYnH3Bdpu/nXvvgy5vr3wVFp13bNY6vbWgt5oJhjawXarcdVOM5HvXv8WcUSp0Kcssrxfve8002l076Pq/TueNkWSKdWaxlJrTS6a/pniEHwsSXwLo3iIapIJr+aBJYDGNqCWQJkH1AINdv8X/CGkeE/wBnrxfY6HZvvlsf3khy8sx3KMk/0HArrFm8JeHfDOmeHNd16wVrBYTiScKxeMhg23OQNwzXU6Xqem6vZi6029tr23bjfC4dc+hxXxOYcSZjWqU6tVydOFTmWlotJpxV7eXW59jgeH4YOHtlSteKV7Pe2ur7+RF4VBHhfSgQQRZQgg/7grzf4fmL/hsnxhcXDqotvDFvtZjgKpZCT/OvUdSvbLTNPmv9QuobS0t0LyzTOERFHck8Cvjf4leMdU8Y/G/WLH4Q3H9oyeJ9FTSZbpQYhtQ7pdjNjjaoBb0Jr1fDe6zWri5q1NQleXRap6vZaHXjPgUVuaPjbxrH4t8ReP8AxXpk73Gs+I9vhXwlaQAmV7YOvnzjH3UIB+b1c+hr6P03TP8AhBfhZaaLotugurCwEVvEgG6aYJltoP3nJDNjua4v9nb4HWPw1t/7W1a4j1PxJLF5ZnAPl2qHrHFnnnu3GfbvW+J/xT0Wy1e503W/DXiDTxp90n9na6+mvJbxtwHnUjnj5gOPmHsTXfxNnP8ArNjoYTAx5qVJ3b/me22jaXlq1dpEUafsYuUt2ZuifFC8/tOPwt8KfCniLxRKp3Xlzrc0sENsScsN0gypyenAHYGvavCWry63oUF/cWL2FyS0dxbO4fypEYqyhhwwyDgjqK57wR4o8LfFDwpctp1+l2iOYLs2krwsr4+8CNrqCDkfl2q/431vTfh98ONR1jy0itdKsyYYhxucDCJ9WYgfjXxma+zxFZYSGHcK3Mlq25Nvu9Fq2rJRVu7udMNFzN3R5F428VQx/ETx58QJXBsfAOhtpWmknh9SuhglfcZCn6Vof8E8PCD6d8P9W8a3kZ+065deVC7DkwxEgn8XLf8AfNeL/Fu11WDwd4F+EFrul8TeJrwa9roH3murpsQo3+6p6dsCvvDwH4cs/CPgzSPDOnqBbabaR26Y/iKjlvqTk/jX9I5Tl8MtwVLCw2gkvn1fzep49SfPJyNuiiivRICiiigD5W/4KDeA5r7wvpfxH0lHW+0OUQ3bxj5hAzZR/wDgL4/779qx/AfjZG8UeEviqjKmm+NIE0LxIBwsGqwjEcrem8D8jX1h4m0aw8ReHtQ0LVIRNZX9u9vOh7qwwfxr4G+HWizeGfHnjH9njxbceRaa2+zTLt+BDfJ81rOp7BxgHHsK4czy+nmOEqYWr8M1b/J/J6lwm4SUkfZp0bSzr/8AbxsYP7TFv9m+1bB5nlbt23PXGSav1wHwK8W3fijwZ9m1tTD4j0WZtN1mBuGWePjcR6MBuz9a7+v5SzHC18HiZ4bEfFB8v3dvLqj3INSV11Cvn74kQaD4N+NOpeIviF4aj1jwJ4q06KzurtrXzv7PuIuFJwNygjuMHnjpX0DUdxDDcwPBcQxzRONrxyKGVh6EHg16XDWfVMixyxUI8ys01tdPz6PQitSVSPKfPf7PninRtD+J+q/DLw94mi8ReFZ4DqHh+4WUu1sufntmzyMckA+me9YH7R51i5+J0sFxHPJbpDGtiiqSpUjnaPUtnNek3Pwig0347+HvHXhaw03TdOgtZ4tTghHl7nKkIyqBgk7sHp90VU17W/ihouvX9wLSS/063nby3eyBTZnggqAw4xyK/R8rVDOc7ljstdOMpU03GpPkfM5crSdmubRaaXvfqa5dxKuGaqxFWi6i1Wi263/pHDxfBPxnBolvrWn3UAvjGsv2RHaKaPIzgN03D0yKfpUXxzv5f7Jim16BQNjPcHy1Uf8AXQjJ/Ak11svxs1eSMRW+g2q3B4yZGfn/AHQAf1rpPhZ418Q6zrF1p3iK0ER8gz27C2aMnBGVGevB+td2aZFxXl+Aq43MsPSahqk3FytfdJN3S9U7anZhvFWjj6youEakns3B2j5dPl+Z58fgv48a481vFFoboDeT9rl3j3zjPUdao6hoXxxcjRpZdZmhU7A6XQ2Ee8gIOPrV3wN8RdR1H46NdzpKLXUnNitvjmJATs49QRk/U12nxJ+IHibSfFE9jodpG9nZhPOka2aQMxGSCegAyK87AYTPsdmEcFGFKc3DnvNJKOyav3u0l3PouJOKMVw4oTzCnCd0mvcu03fa3azued+IPgh4g0vwpca3Lfpe38QEklnBEzsQT82GzyQOenat/wDZVsNZtdU1iae1uoNOkgVcyIVVpQ3GM9SBmtGP41avLEIYdAtXum4UrIxBb/dxn8M1veANR+JWqeJoZddhks9KKM7q9qqA8cKM/MCSR+Vduc8P8S4XKcRHOPZU1Ztc04qUktbQjG93ppez1PmH4oRzTDywKi6jm17yjZRV1vol8/zPO/2kvFvhrUPi1oXgLxlrU2meEbGAalq6Qxuz3smf3cGE5xgZ/E9wK6PwNI3xE+LOi+KvD3hmXw54D8K2E1rpIlthbteSygBmVOyAAc+3qTjrNL+GkafGzXPiFqjWd8l5ZQ21jC8W5rcqAHPPGTtGCPU16MOBgdK+SxHF9LBZLHKcDBe9Bc8vOSvJJW31te/oeasO5VPaSYUjAMCGAIPUGloFfnh1lCw0XR7C+mvrHS7K1up1CzSwwKjSAHI3EDn8a8j+L2o2Hin4lab4QvpgvhnwxAfEfimTPy7IhmGBvdiM47givSfiP4s0/wAEeDNR8S6kcxWkeY4gfmmkPCRr7scCvlT4nya9pfhKw+G8Aa6+IXxEvo9T8QhPvwxuw+z2h9AOpHYA9jX6j4b5JPHY15jX1jT0jfrL/wC1X42OHGVOWPIup2f7JGkX3xT+OHiT42a/A32a2naLTlcZVZWXaoH/AFziwPqwr7Irkvg/4Isfh38O9J8J2G1hZw/v5QMedM3Mjn6sT+GK62v3c8wKKKKACiiigAr5a/b1+Gs+paBZfE7w+jx6toRVbxouHaDdlZAR3jbn6MfSvqWob+0tr+ynsryBJ7a4jaKaJxlXRhgqR6EGgD418IfEFJItJ+ONlxDdGLRfH1pEOIpRgQ320dAe59yPWvp+GWOaFJoZFkjkUMjqchgRkEHuK+LNX04/s6fHi/0DWbaS/wDh/wCJYWhuIXG5ZrKQkZ95IiT78f7Ve4/CHXW8Fa3/AMKv8QapHc2Jh+1+E9WkkGzULFuVjDdC6Zxj0+gz+T+JPDDxNNZnho3lHSaXVdH8uvl6Hdg61nyM9loooxX4eemFef8AxRsPHVxqNjP4QvJ44liYTxpKqLuByCd3XIOMe1egUV6uSZtPKMZHFwpwqNXXLOPNF3VtV5brzOXG4RYui6Tk436xdnp5ngf/AAsLxRoVwYNV8Maf/aKcGeS0McjH1+Xg/hVrR/GXxHvNZtNTnsLk6V5yiZI7H92IycEgkbunfNe4PHG+C6K2OmRmlGAMCv0Ct4g5NOk+XJqXtJKzbk2tf5Ite55Weh4MMgxkZq+Mlyp3Ssl976nkuneBE0X4x6v4tNsx02K0a8gCrnMz5DKB68Mf+BCudm8efEjTbh729sJFtJWLCKewwgB7ZAB6epr32kZQwwwBHoa8XJOM8Pg5SeY4GGJuox9/dRjf4XZ2bbu2e9xBDGZzKnL6xKm4RSVutu/f/gngdv4w8Z6/Ps8OeHLK0uCPmntbMFx/wNuBXpHwqtvF8Nlev4unuHmaUCFJWVsKByQV9Sf0rs0RUGEUKPQDFOrTiHjbDZlhJYLB5fSoQdtdZ1NHf43rbyttoeXl+S1cNVVatiJTkum0df7qCiiivgD3rhSEgDJOBS15D8WPEuo+Kdek+Fvgu+W2naEy+JNYDYj0iyx8+W6CRhkAdh+Y9XJcnxGcYuOFw61e76JdW/612M6tRU48zOV8a+LtL8SeI9Q8daywk+HvgGU/ZI8jbrWr9ERf7yIe/Tv0Jqb9jXwVq3izxTq3x48boZdQ1KaRdKV14UHh5VHZQP3a+wb2rzqw0qH47/E3SPhv4Khm0/4YeElAaRMjzVBw87HvLKQQueQCT61916Rp9lpOl2ul6bbR21naRLDBDGMKiKMAD8BX9R5VllDK8JDC0F7sV976t+bep4s5ucnJlqiiivQICiiigAooooAKKKKAPL/2lfhVa/Ff4dz6Ugji1mzzcaXcNxtlxyhP91xwfwPaviy28YeKPh3o8Hw5+L/w4XXNAtJGNrDqCNDcWu48m2uBnjvgZFfpHVLW9I0rXNPfT9Z0201C0kGGhuYVkQ/gRQB8U+BfiBopMSfDf4u3Whk/d0DxxGZbcH+7HdKTtHpk163a/E3xpo1qs/jL4bahNZEZGreGpl1K0cf3sL8yj86l+IP7JHwu8SF7jRo7zwxdtyDZPvhz7xvn/wAdK149efsw/GvwHctefDrxolyoO4La3j2cjfVSdhP4181mnCGT5m3KtRSk+sfdf4b/ADTNoYipDZnuvh/41fDLWpBBD4tsbO5Jwbe/JtZFPoRIBzXdWV5Z3sIms7qC5iPR4ZA6n8RXxd4k8VftA6BF5PxH+HVt4mtE4aTWdAS5BH/XeIA/+PVzFp8TvhsLgvqHwlutCuj96bw/r1xaEH2jbI/WvicZ4UYaTvhsQ4+Ukn+K5Tpjjn1R9/0V8T6X8WPAiAfYviF8YdC/2Jp7a+RfzwTW/Z/FzSwP9F/aI1+H2v8AwfHIfzVjXh1fCrMo/wAOtB+vMv0ZqsdDqmfXNFfKB+MTL0/aJtGX38GNu/wqG4+MFk4BuP2idSx3Fp4MVT+ZasF4WZvfWpT++X/yI/r1Psz61pkssUMZkmkSNB1Z2AA/E18Z6l8W/BrKRe/Fn4sauO6WVtbWIP45Jrlr/wCJXwyuJQIfh74p8Vzg/KfEHiWWUH3McYwa9DD+E+Kb/fYiK9E3+diHjo9EfYPiX4t/Dfw8WTU/GOkiZf8AljBMJpM+m1MnNc//AMLY17xBET8Pvhr4h1iM9NQ1FBp9ko/vb5OSPoK8G8K698aNWUL8MPgto/hmFuEurXQgHHv59xkfiK6yP9nX48/EGRZfiT8QzaWzctA909yQP+uaYjH519PgPDHKcO1KvKVR+bsvuWv4mMsbN7aC+PfHBTzE+JvxgtLKP+Pw94GXzZm/2JLonC+h5rzhvFuueP8ASJPhf8E/AFzomh6hcKdQmR3nubztuup+ip3I/U9K+l/h/wDsk/Czw35c+rwXniW7XktfSbYc+0aYGP8AeLV7ro2k6XotglhpGnWmn2kYwsNtCsaD8AMV93gsvwuAp+zw1NQXkrff3+ZyynKTvJnG/Af4Y6T8KvAVt4e0/bNdviXULvbg3E5HJ/3R0A7D8a76iiuwkKKKKACiiigAooooAKKKKACiiigAooooAKxtY8KeGNYVl1bw7pN8G+959nG5P4kUUUAcbqfwD+DuouXuPh/oysTkmGMxf+gEVz15+yv8Erly48KzQZ7RajOB+W+iigCgf2R/guX3f2VqoH93+0pMVetf2VvglBIrnwtPNjtJqNwQf/H6KKAOh0v4BfB3TnD2/wAP9HZl6GdGm/8AQya7TRvC3hrRlVdI8P6VYBen2e0SM/mBRRQBsUUUUAFFFFABRRRQAUUUUAFFFFAH/9k=";
const ZI=-70,tlg=new T.TextureLoader().load(LOGO_DATA);
const bench=(g,x,z,c)=>{box(g,1.9,.14,.55,x,.42,z,c);box(g,1.9,.5,.1,x,.56,z+.27,c);[-.8,.8].forEach(k=>box(g,.08,.42,.45,x+k,0,z,0x222))};
const seat=(g,x,z,c)=>{box(g,.7,.12,.6,x,.42,z,c);box(g,.7,.5,.08,x,.56,z+.3,c);box(g,.08,.42,.08,x,0,z,0x333)};
const pot=(g,x,z)=>{cyl(g,.22,.4,x,0,z,0xd9d2c0,12);ball(g,.4,x,.85,z,0x4f9a56)};
const panel=(l1,l2)=>(c,w,h)=>{c.textAlign='center';c.textBaseline='middle';try{c.letterSpacing='.04em'}catch(e){}c.fillStyle='#0E3B2C';fitF(c,l1,w*.94,h*.28);c.fillText(l1,w/2,h*.32);c.fillStyle='#A87400';fitF(c,l2,w*.94,h*.22,'700');c.fillText(l2,w/2,h*.7)};
const lgo=(g,x,y,z,ry)=>{const m=new T.Mesh(new T.PlaneGeometry(1.2,1.2),new T.MeshBasicMaterial({map:tlg}));m.position.set(x,y,z);m.rotation.y=ry;g.add(m)};
function sgn(g,wall,a,w,sub,y=1.35){const t=panel('Universitas Sultan Ageng Tirtayasa',sub);
  if(wall==='b'){box(g,w,1.7,.1,a,y,-4.8,WH);lgo(g,a-w/2+.85,y+.85,-4.73,0);label(g,w-1.85,1.3,a+.675,y+.85,-4.73,0,t,1000)}
  else{box(g,.1,1.7,w,-6.0,y,a,WH);lgo(g,-5.93,y+.85,a+w/2-.85,Math.PI/2);label(g,w-1.85,1.3,-5.93,y+.85,a-.675,Math.PI/2,t,1000)}}
const mez=g=>{box(g,12,.28,1,0,3.2,-4.35,0xe6dfcf);for(let k=0;k<=30;k++)box(g,.04,.9,.04,-5.8+k*.387,3.48,-3.9,0x26262a);box(g,12,.06,.06,0,4.38,-3.9,0x26262a);box(g,12,.04,.04,0,3.9,-3.9,0x26262a)};
const base=(g,fc,wc)=>{box(g,12.4,.2,10,0,-.2,0,fc);grid(g,-6,6,-4.8,4.8);box(g,12.4,6.2,.3,0,0,-5,wc);box(g,.3,6.2,10,-6.2,0,0,wc);box(g,12,.14,.06,0,0,-4.84,0xb9b3a2);box(g,.06,.14,9.6,-6.04,0,0,0xb9b3a2)};
const desk=(g,x,w,c,top)=>{box(g,w,.14,1.4,x,0,-3.2,0x222);box(g,w-.1,.85,1.25,x,.14,-3.2,c);box(g,w,.1,1.4,x,.99,-3.2,top)};
const LOB=[
(g,sub)=>{ // Rektorat: formal, balkon dan panel emas
  base(g,0xe4e1d8,0xefe8da);mez(g);sgn(g,'b',-2.6,6.4,sub,.9);
  box(g,2.8,1.5,.12,3.4,4.15,-4.8,0x2a2a30);box(g,2.6,1.3,.05,3.4,4.25,-4.72,0x1c4a7a);label(g,2.5,1,3.4,4.9,-4.68,0,twoLine('Selamat Datang','di Untirta','#fff'),600);
  desk(g,3,5,WH,0xcfe6e4);box(g,4.2,.9,.5,3,0,-4.4,0x26262a);
  for(let k=0;k<7;k++){const z=-3.8+k*1.05;box(g,.1,2.4,.98,-6.0,.2,z,0xc89a36);box(g,.12,1.9,.5,-5.97,.45,z,0x7a4a14);box(g,.14,.5,.3,-5.95,1.1,z,0xe3b94d)}
  box(g,.14,2.6,1.7,-5.96,0,3.5,0x3a2a22);box(g,1.6,.02,1.4,-5.2,0,3.5,0xa3222b);
  [[-3.4,1.2],[-1.1,1.2],[-3.4,3.0],[-1.1,3.0]].forEach(([x,z])=>bench(g,x,z,0x1f6a4e));
  pot(g,-5.5,-4.3);pot(g,5.7,-4.3);person(g,.6,-.4,NAVY,0);person(g,.2,2.1,0xc8412a,Math.PI)},
(g,sub)=>{ // Fakultas Sindangsari: atrium kayu, meja bundar, tangga
  base(g,0xd9c29a,0xf3e6cc);for(let k=-5;k<=5;k++)box(g,.03,.02,9.6,k*1.1,0,0,0xb89a6a);
  sgn(g,'b',0,7.4,sub);[['FKIK',0x1f6a4e,-4.2],['FEB VOKASI',0xe0782a,0],['PASCASARJANA',0x0E3B2C,4.2]].forEach(([t,c,x])=>board(g,2.9,.6,x,3.6,-4.78,t,c,'#fff',.5));
  cyl(g,1.4,.95,2.6,0,-3,WH,32);cyl(g,1.5,.08,2.6,.95,-3,0xcfe6e4,32);
  for(let k=0;k<8;k++)box(g,1.6,.25*(k+1),.5,-5.2,0,3.2-k*.5,0xb98d5a);
  bench(g,-2.6,1.4,0x8a5a2a);bench(g,-2.6,3.2,0x8a5a2a);
  box(g,.5,1.5,.4,-.4,0,-1.0,0x26362f);box(g,.5,.6,.05,-.4,.9,-.79,0x7ff0c0);
  pot(g,-5.5,-4.3);pot(g,5.7,-4.3);person(g,-.2,1.2,NAVY,Math.PI);person(g,.9,2.0,0xc8412a,Math.PI)},
(g,sub)=>{ // FKIP: rak buku, karpet baca, globe
  base(g,0xf1dfae,0xfff0c9);sgn(g,'l',-1.4,6.4,sub);
  [-4.6,-2.4,-.2].forEach(x=>{box(g,1.9,2.6,.5,x,0,-4.55,0x8a5a2a);for(let r=0;r<4;r++)for(let c=0;c<6;c++)box(g,.22,.4,.3,x-.8+c*.3,.35+r*.6,-4.3,CC[(r*3+c)%6])});
  board(g,2.8,1.1,3.4,2.0,-4.8,'SELAMAT DATANG CALON GURU',0xe0782a,'#fff',.4);desk(g,3.4,3.4,0xe0782a,WH);
  cone(g,1.9,1.9,.04,-2.4,0,2.4,0x4aa3a8,32);
  [[-3.44,1.8,0xe0782a],[-1.36,1.8,0xd8362b],[-2.4,3.6,0x3d6ea6]].forEach(([x,z,c])=>ball(g,.45,x,.45,z,c));
  cyl(g,.05,.9,-2.4,.04,2.4,0x555,8);ball(g,.4,-2.4,1.3,2.4,0x3d6ea6);
  [[-1.9,2.9,0xd8362b],[-1.5,2.5,0xf5b800],[-1.9,2.5,0x1f6a4e]].forEach(([x,z,c])=>box(g,.35,.35,.35,x,.04,z,c));
  pot(g,-5.5,3.6);pot(g,5.7,-4.3);person(g,-3.0,2.9,TEAL,0);person(g,-1.6,1.2,GOLD,Math.PI*.8)},
(g,sub)=>{ // Kedokteran: klinis, layar antrean, baris kursi
  base(g,0xe8f0f0,0xf4f9f9);sgn(g,'b',-2.2,6.2,sub);
  box(g,.28,1.2,.08,-2.2,3.1,-4.78,TEAL);box(g,1.2,.28,.08,-2.2,3.56,-4.78,TEAL);
  box(g,2.4,1.5,.12,3.6,2.8,-4.8,0x1c1c20);label(g,2.2,1.2,3.6,3.55,-4.72,0,twoLine('NOMOR ANTRIAN','A-012 · Loket 2','#7ff0c0'),500);
  desk(g,3.2,4.6,WH,0xbfe3e0);
  for(let r=0;r<3;r++)for(let c=0;c<4;c++)seat(g,-4.2+c*1,.4+r*1.2,0x3d6ea6);
  box(g,.15,.02,6.4,1.0,.01,1.4,TEAL);box(g,.9,2.2,.6,-5.55,0,-4.1,0xdff0f6);ball(g,.2,-5.55,1.9,-4.1,WH);box(g,.12,.9,.12,-5.55,.9,-4.1,WH);
  box(g,.5,.1,.5,-5.5,.5,2.0,0x333);box(g,.5,.5,.08,-5.5,.6,2.25,0x333);[-.3,.3].forEach(k=>{const w=new T.Mesh(new T.TorusGeometry(.32,.04,6,18),mat(0x222));w.position.set(-5.5+k,.35,2.0);w.rotation.y=Math.PI/2;g.add(w)});
  pot(g,5.7,-4.3);pot(g,5.7,3.2);person(g,1.6,-1.9,WH,Math.PI);person(g,-2.2,3.9,TEAL,Math.PI)},
(g,sub)=>{ // Teknik: industri, pedestal gigi, maket kota
  base(g,0xc7c8c6,0xb9bcbe);for(let k=0;k<24;k++)box(g,.5,.02,.3,-5.9+k*.5,0,-4.5,k%2?0x14211b:GOLD);
  sgn(g,'l',-.6,6.4,sub);cyl(g,1.1,.7,-2.8,0,-1.8,0x2b2b2e,24);
  const gr=new T.Mesh(new T.TorusGeometry(.6,.17,8,18),mat(ORG));gr.position.set(-2.8,1.4,-1.8);g.add(gr);for(let k=0;k<8;k++){const a=k*Math.PI/4;ball(g,.14,-2.8+Math.cos(a)*.8,1.4+Math.sin(a)*.8,-1.8,ORG)}
  box(g,2.8,.8,1.6,-2.8,0,1.6,0x2b2b2e);[[.3,.9],[.45,.5],[.3,.7],[.4,.35]].forEach(([w,h],k)=>box(g,w,h,w,-3.8+k*.65,.8,1.6+(k%2)*.3-.15,[ORG,0xeadbb9,0x8e9096,GOLD][k]));
  box(g,2.4,1.5,.06,-.4,1.3,-4.8,0x1c4a7a);label(g,2.2,.5,-.4,2.05,-4.76,0,sign('GEDUNG KULIAH TERPADU','#fff',.4),500);
  desk(g,3.2,3.2,0x2b2b2e,ORG);box(g,2.6,.08,.25,3.2,1.7,-4.75,0x555);for(let k=0;k<5;k++)ball(g,.2,2.2+k*.5,1.9,-4.7,k%2?ORG:GOLD);
  bench(g,-3.4,3.8,0x6b6f72);bench(g,-1.1,3.8,0x6b6f72);pot(g,5.7,-4.3);pot(g,5.7,3.2);
  person(g,-.8,.2,ORG,Math.PI);person(g,.9,1.8,TEAL,Math.PI)}];
function lobby(i,sub){const g=new T.Group();g.position.set(i*70,0,ZI);LOB[i](g,sub);world.add(g)}
['Rektorat','Kampus Pakupatan','FKIP · Kampus Ciwaru','Kampus Kepandean','Fakultas Teknik · Cilegon'].forEach((t,i)=>lobby(i,t));
/* ---- jalur emas yang menyambung kampus ---- */
const stat=[[-1.6,2.5],[-.5,2.5],[0,2.5],[-1.8,2.5],[-.8,2.5]];
const P=[[-5.5,3.6]],SI=[];
for(let i=0;i<5;i++){const o=i*GAP,[sx,sz]=stat[i];if(i)P.push([o-5.2,3.6]);P.push([o+sx,3.6],[o+sx,sz]);SI[i]=P.length-1;P.push([o+sx+1.2,sz],[o+sx+1.2,3.6])}
P.push([4*GAP+5.8,3.6]);
for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1],dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz);
  const m=new T.Mesh(new T.BoxGeometry(L+.2,.04,.2),mat(GOLD));m.position.set((a[0]+b[0])/2,.03,(a[1]+b[1])/2);m.rotation.y=-Math.atan2(dz,dx);m.receiveShadow=true;world.add(m)}

function mk(P){const cum=[0];for(let i=1;i<P.length;i++)cum.push(cum[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));return{P,cum,L:cum[cum.length-1]}}
function at(R,s){const P=R.P,cum=R.cum;s=Math.max(0,Math.min(R.L,s));let i=1;while(i<cum.length-1&&cum[i]<s)i++;
  const a=P[i-1],b=P[i],L=cum[i]-cum[i-1]||1,t=(s-cum[i-1])/L;return{x:a[0]+(b[0]-a[0])*t,z:a[1]+(b[1]-a[1])*t,dx:(b[0]-a[0])/L,dz:(b[1]-a[1])/L}}
const RX=mk(P),ST=SI.map(i=>RX.cum[i]);
/* ---- rombongan: pemandu berbendera + 3 mahasiswa ---- */
function walker(c,hr,fl,off){const w=new T.Group();
  const L=(x,y,len,r,cc)=>{const g=new T.Group();g.position.set(x,y,0);const m=sh(new T.Mesh(new T.CylinderGeometry(r,r,len,10),mat(cc)));m.position.y=-len/2;g.add(m);w.add(g);return g};
  const o={w,off,face:Math.PI/2,LL:L(-.1,.55,.55,.09,0x2b3350),LR:L(.1,.55,.55,.09,0x2b3350),AL:L(-.29,1.1,.5,.06,c),AR:L(.29,1.1,.5,.06,c)};
  cyl(w,.23,.62,0,.55,0,c);cyl(w,.06,.12,0,1.17,0,0xe8b896);ball(w,.2,0,1.42,0,0xe8b896);hairCap(w,1.45,hr);box(w,.16,.05,.06,0,1.38,.2,0xd8a07c);
  if(fl){box(w,.04,2.4,.04,.42,0,.1,0x3b2a1a);box(w,.04,.55,.85,.42,1.75,-.4,GOLD)}
  w.rotation.y=Math.PI/2;world.add(w);return o}
const crew=[walker(NAVY,0x2a1d16,1,0),walker(0xc8412a,0x14100c,0,1.15),walker(WH,0x6b3b1a,0,2.1),walker(TEAL,0x2a1d16,0,3.05)];


/* ---- loop animasi ---- */
const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
let idx=0,mode=0,RT=RX,s=0,v=0,ph=null,cx=0,cz=0,phase=0,mx=0,my=0,ready=false,last=performance.now();
const DOOR=[[2.2,.9],[-.8,-.5],[0,-1.2],[1.4,-.1],[-2.6,-1]];
const RIn=[0,1,2,3,4].map(i=>mk([[4.8,10.5],[4.8,1],[2.6,1],[2.6,-1.6]].map(([x,z])=>[i*70+x,ZI+z])));
const fade=(o,fn)=>{cv.style.opacity=o;if(fn)setTimeout(fn,still?0:420)};
const zoomTo=z=>{cam.zoom=z;cam.updateProjectionMatrix()};
function snap(i){idx=i;s=ST[i];v=0;cx=i*GAP;cz=0}
window.setScene=i=>{
  if(!ready){snap(i);ready=true;return}
  if(ph)return;
  if(mode){ph={k:'x'};fade(0,()=>{mode=0;RT=RX;snap(i);zoomTo(1);fade(1);ph=null;window.onMode&&onMode(false)});return}
  if(i===idx)return;
  if(still||Math.abs(i-idx)>1){ph={k:'x'};fade(0,()=>{snap(i);fade(1);ph=null})}else idx=i};
window.enterBuilding=()=>{if(mode||ph||!ready)return;
  const tr=[3.05,2.1,1.15,0].map(o=>{const p=at(RX,s-o);return[p.x,p.z]}),d=DOOR[idx],Rd=mk(tr.concat([[idx*GAP+d[0],d[1]]]));ph={k:'door',R:Rd,s:Rd.cum[3]}};
window.leaveBuilding=()=>{if(!mode||ph)return;ph={k:'x'};fade(0,()=>{mode=0;RT=RX;s=ST[idx];v=0;cx=idx*GAP;cz=0;zoomTo(1.9);fade(1);ph=null;window.onMode&&onMode(false)})};
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
let ox=.63,oy=.58;
function fit(){const w=cv.clientWidth,h=cv.clientHeight||1,a=w/h,m=a<1,vs=m?10.8/a:12.6;ox=m?.5:.69;oy=m?.26:.58;R.setSize(w,h,false);
  Object.assign(cam,{left:-vs*a*2*ox,right:vs*a*2*(1-ox),top:vs*2*oy,bottom:-vs*2*(1-oy)});cam.updateProjectionMatrix()}
new ResizeObserver(fit).observe(cv);fit();
(function frame(now){requestAnimationFrame(frame);
  const dt=Math.min(.05,(now-last)/1000||.016);last=now;
  let RR=RT,ss=s,vv=v;
  if(ph&&ph.k==='door'){ph.s+=3.2*dt;vv=3.2;if(ph.s>=ph.R.L){ph.s=ph.R.L;const h=ph;ph={k:'x',R:h.R,s:h.s};
      fade(0,()=>{mode=1;RT=RIn[idx];s=0;v=0;cx=idx*70;cz=ZI;zoomTo(1.9);fade(1);ph=null;window.onMode&&onMode(true)})}}
  else if(!ph){const tgt=mode?RT.L:ST[idx],dv=Math.max(-5.5,Math.min(5.5,(tgt-s)*1.4));
    v+=(dv-v)*(1-Math.exp(-dt*3.5));s+=v*dt;if(Math.abs(tgt-s)<.01&&Math.abs(v)<.03){s=tgt;v=0}vv=v;ss=s}
  if(ph&&ph.R){RR=ph.R;ss=ph.s}
  phase+=Math.abs(vv)*dt*2.6;const sw=Math.min(1,Math.abs(vv)/2)*.7,wv=Math.sin(phase)*sw,mv=Math.min(1,Math.abs(vv));
  crew.forEach(o=>{const p=at(RR,ss-o.off);o.w.position.set(p.x,Math.abs(Math.sin(phase))*.035*mv,p.z);o.w.visible=!(mode&&p.z-ZI>5.4);
    if(Math.abs(vv)>.2){const g=Math.sign(vv);o.face=Math.atan2(p.dx*g,p.dz*g)}
    let d=o.face-o.w.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));o.w.rotation.y+=d*(1-Math.exp(-dt*9));
    o.LL.rotation.x=wv;o.LR.rotation.x=-wv;o.AL.rotation.x=-wv*.8;o.AR.rotation.x=wv*.8});
  const p=at(RR,ss),tx=mode?(p.x+idx*70)/2:p.x*.5+idx*GAP*.5,tz=mode?(p.z+ZI)/2:p.z*.25,k=1-Math.exp(-dt*3);cx+=(tx-cx)*k;cz+=(tz-cz)*k;
  const zt=ph&&ph.R?1.9:(mode?1.3:1);if(Math.abs(zt-cam.zoom)>.002)zoomTo(cam.zoom+(zt-cam.zoom)*(1-Math.exp(-dt*(ph&&ph.R?2.2:3))));
  const px=still?0:mx*1.4,pz=still?0:my*-1;
  cam.position.set(cx+10+px,9,cz+10+pz);cam.lookAt(cx+px,1.6,cz+pz);
  sun.position.set(cx-7,13,cz+6);sun.target.position.set(cx,0,cz);
  R.render(S,cam)})(last);
})();
