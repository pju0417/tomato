/* Approved classroom artwork and alpha-trimmed sprite sheets. */
(() => {
  const base = 'assets/classroom-2-5d/';
  const art = {ready:false};
  const gait={phase:0,lastMoved:0};
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const legacy = {drawChar, drawPot, drawFloor, drawObject, buildPlantVisualMarkup, buildStageChangeMarkup, renderShop, renderCC, drawRoom};
  function load(file) { return new Promise((resolve,reject) => {const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error(file));im.src=base+file;}); }
  function cut(im, cols, rows) {
    const out=[]; const w=im.width/cols,h=im.height/rows;
    for(let row=0;row<rows;row++) for(let col=0;col<cols;col++) {
      const c=document.createElement('canvas');c.width=w;c.height=h;
      const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(im,col*w,row*h,w,h,0,0,w,h);
      const p=g.getImageData(0,0,w,h).data;let l=w,t=h,r=0,b=0;
      for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(p[(y*w+x)*4+3]>40){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
      const tile=document.createElement('canvas');tile.width=r-l+1;tile.height=b-t+1;
      tile.getContext('2d').drawImage(c,l,t,tile.width,tile.height,0,0,tile.width,tile.height);out.push(tile);
    } return out;
  }
  const potIds=['pot_terra','pot_bunny','pot_frog','pot_star','pot_rainbow','pot_leaf'];
  const potNames=['황토 화분','토끼 화분','개구리 화분','별 화분','무지개 화분','새싹 화분'];
  function potIndex(){const id=(S.equip||{}).pot;return Math.max(0,potIds.indexOf(id));}
  function sprite(g,im,x,y,height){g.drawImage(im,x-height*im.width/im.height/2,y-height,height*im.width/im.height,height);}
  drawChar=function(g,x,y,scale,look,face,walk,equip){
    if(!art.ready)return legacy.drawChar(g,x,y,scale,look,face,walk,equip);
    const tiles=look && look.avatar===1?art.girl:art.boy;
    const moving=!!walk&&performance.now()-gait.lastMoved<120;
    const phase=gait.phase,amount=reducedMotion.matches ? .35 : 1;
    const stride=moving?Math.sin(phase)*amount:0;
    const lift=moving?Math.abs(Math.sin(phase))*1.4*amount:0;
    const im=tiles[face||0],h=70*scale,w=h*im.width/im.height;
    g.save();g.fillStyle='rgba(60,45,25,.14)';g.beginPath();g.ellipse(x,y,(14-lift)*scale,4*scale,0,0,7);g.fill();
    g.translate(x,y);g.rotate(stride*.025);
    if(!moving){sprite(g,im,0,0,h);g.restore();return;}
    // Articulated lower-leg strips swing alternately while the torso stays connected.
    const split=Math.round(im.height*.76),overlap=3;
    const lowerH=(im.height-split)/im.height*h;
    for(let leg=0;leg<2;leg++){
      const sign=leg?1:-1,step=stride*sign;
      g.save();g.translate((leg-.5)*w/2,-lowerH-lift*scale);
      g.rotate(step*.19);
      g.drawImage(im,leg*im.width/2,split,im.width/2,im.height-split,-w/4,0,w/2,lowerH);
      g.restore();
    }
    g.drawImage(im,0,0,im.width,split+overlap,-w/2,-h-lift*scale,w,(split+overlap)/im.height*h);
    g.restore();
  };
  drawPot=function(g,x,y,scale,opts={}){
    if(!art.ready)return legacy.drawPot(g,x,y,scale,opts);
    const st=opts.stageIdx==null?getStage().idx:opts.stageIdx;
    const pi=opts.friend?0:potIndex();
    if(st===0){sprite(g,art.pots[pi],x,y,40*scale);return;}
    // Eight simulation stages retain distinct buds and ripening via the existing botanical renderer.
    if(st===3||st===6||(!opts.friend&&S.dead))return legacy.drawPot(g,x,y,scale,opts);
    const tile=art.growth[({1:0,2:1,4:3,5:4,7:5})[st]??2];
    const height=([0,57,70,82,92,98,102,108][st]||90)*scale;
    sprite(g,tile,x,y,height);
    if(pi){
      // Cover the source terracotta body, keeping the stem and foliage visible.
      sprite(g,art.pots[pi],x,y+scale,40*scale);
      g.save();g.strokeStyle='#65923c';g.lineWidth=3*scale;g.beginPath();g.moveTo(x,y-26*scale);g.lineTo(x,y-40*scale);g.stroke();g.restore();
    }
  };
  drawFloor=function(g,map){if(map==='class'&&art.ready)g.drawImage(art.room,0,0,WORLD_W,WORLD_H);else legacy.drawFloor(g,map);};
  drawObject=function(g,o){
    if(!o.artObject)return legacy.drawObject(g,o);
    // Repaint only furniture in front of the player's feet to preserve occlusion.
    if(o.crop&&art.ready&&ROOM.py<o.depth&&ROOM.px>o.x-22&&ROOM.px<o.x+o.w+22){
      const [x,y,w,h]=o.crop;g.drawImage(art.room,x/900*art.room.width,y/600*art.room.height,w/900*art.room.width,h/600*art.room.height,x,y,w,h);
    }
    if(o.id==='door_garden') {fillR(g,o.x,o.y,o.w,o.h,8,'#f4ead5');g.fillStyle='#436b46';g.font='bold 12px sans-serif';g.textAlign='center';g.fillText('야외 →',o.x+o.w/2,o.y+20);}
  };
  // Match floor and desk footprints to the approved 900 × 600 map projection.
  const m=MAPS.class;
  m.spawn=[450,510];m.solids=[rect(0,0,900,195),rect(0,534,900,66),rect(0,0,76,600),rect(822,0,78,600)];
  m.objects=[];
  const centers=[[255,351,447,541,635],[240,344,448,550,651],[228,339,448,561,673],[216,334,451,568,689]];
  const bottoms=[258,323,391,476], tops=[202,262,327,400];
  centers.forEach((xs,row)=>xs.forEach(x=>m.objects.push({t:'desk',artObject:true,x:x-23,y:bottoms[row]-17,w:46,h:17,solid:true,depth:bottoms[row],crop:[x-41,tops[row],78,bottoms[row]-tops[row]]})));
  m.objects.push(
    {t:'board',artObject:true,id:'board',label:'칠판 보기',x:756,y:280,w:20,h:30},
    {t:'notice',artObject:true,id:'notice',label:'성장 앨범 보기',x:766,y:452,w:20,h:24},
    {t:'tools',artObject:true,id:'tools',label:'돌봄 도구 보기',x:730,y:330,w:30,h:20},
    {t:'locker',artObject:true,id:'locker',label:'사물함 열기',x:100,y:395,w:25,h:30},
    {t:'win',artObject:true,id:'win1',x:440,y:181,w:24,h:16},
    {t:'door',artObject:true,id:'door_garden',label:'야외로 나가기',x:747,y:491,w:66,h:30}
  );
  const places={window:[310,174],nearwin:[575,174],center:[493,500],back:[115,448],shelf:[139,290],shade_in:[163,208]};
  SPOTS.forEach(s=>{if(places[s.id]){[s.x,s.y]=places[s.id];if(s.id==='shelf')s.name='사물함 위';}});
  ROOM.px=450;ROOM.py=510;
  // Click movement follows clear floor cells instead of pushing into desks.
  let route=[];
  const originalMove=movePlayer;
  movePlayer=function(dx,dy,dt){const x=ROOM.px,y=ROOM.py;if(ROOM.target)dt=Math.min(dt,Math.hypot(ROOM.target[0]-ROOM.px,ROOM.target[1]-ROOM.py)/168);originalMove(dx,dy,dt);const distance=Math.hypot(ROOM.px-x,ROOM.py-y);if(distance>.01){gait.phase+=distance*.14;gait.lastMoved=performance.now();}};
  function routeTo(tx,ty){
    const solids=mapSolids(ROOM.map),step=14;
    const nodes=[];const byKey=new Map();
    for(let y=84;y<565;y+=step)for(let x=30;x<871;x+=step)if(!hitAny(x,y,solids)){const n={x,y,key:x+','+y};nodes.push(n);byKey.set(n.key,n);}
    const nearest=(x,y)=>nodes.reduce((a,b)=>Math.hypot(b.x-x,b.y-y)<Math.hypot(a.x-x,a.y-y)?b:a);
    const start=nearest(ROOM.px,ROOM.py),end=nearest(tx,ty),queue=[start],prev=new Map([[start.key,null]]);
    for(let i=0;i<queue.length;i++){const n=queue[i];if(n===end)break;for(const [dx,dy] of [[step,0],[-step,0],[0,step],[0,-step]]){const next=byKey.get((n.x+dx)+','+(n.y+dy));if(next&&!prev.has(next.key)){prev.set(next.key,n);queue.push(next);}}}
    route=[];if(!prev.has(end.key)){ROOM.target=null;return;}
    for(let n=end;n;n=prev.get(n.key))route.unshift([n.x,n.y]);ROOM.target=route.shift()||null;
  }
  drawRoom=function(){if(!ROOM.target&&route.length)ROOM.target=route.shift();legacy.drawRoom();};
  document.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('room-canvas').addEventListener('pointerdown',e=>{if(anyModalOpen())return;e.stopImmediatePropagation();const r=e.currentTarget.getBoundingClientRect();routeTo((e.clientX-r.left)/r.width*900,(e.clientY-r.top)/r.height*600);},true);
    document.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(e.key)){route=[];ROOM.target=null;}});
  });
  const origToggle=toggleEquip;
  toggleEquip=function(id){origToggle(id);if(art.ready&&S.plantDate)renderGame();};
  const originalPotMenu=openPotMenu;
  function decorateTools(){if(!art.tools)return;document.querySelectorAll('#modal-pot button').forEach(b=>{const text=b.textContent;const idx=text.includes('물 주기')?0:text.includes('흙 살펴보기')?1:text.includes('관찰하기')?2:-1;if(idx>=0){const target=b.querySelector('span');if(target){const img=new Image();img.src=art.tools[idx].toDataURL();img.alt='';img.style.cssText='width:38px;height:38px;object-fit:contain';target.replaceChildren(img);}}});}
  openPotMenu=function(){originalPotMenu();decorateTools();};
  renderCC=function(){
    if(!art.ready)return legacy.renderCC();
    const box=document.getElementById('cc-opts');if(!box)return;
    S.look=S.look||defaultLook();box.innerHTML='<p>함께 토마토를 돌볼 친구를 골라요.</p>';
    [art.boy[0],art.girl[0]].forEach((im,i)=>{const b=document.createElement('button');b.className='btn btn-gray';b.style.cssText='margin:8px;padding:12px;border:3px solid '+((S.look.avatar||0)===i?'#659563':'transparent');const img=new Image();img.src=im.toDataURL();img.alt=i?'여학생':'남학생';img.style.height='100px';b.append(img,document.createTextNode(i?'여학생':'남학생'));b.onclick=()=>ccSet('avatar',i);box.append(b);});ccDraw();
  };
  const plantCache=new Map();
  buildPlantVisualMarkup=function(info,profile){
    if(!art.ready||profile==='dead'||info.stage.idx===3||info.stage.idx===6)return legacy.buildPlantVisualMarkup(info,profile);
    const key=info.stage.idx+':'+potIndex();
    if(!plantCache.has(key)){const c=document.createElement('canvas');c.width=220;c.height=250;drawPot(c.getContext('2d'),110,235,2,{stageIdx:info.stage.idx});plantCache.set(key,c.toDataURL());}
    return '<img alt="'+esc(info.stage.name)+' 토마토" src="'+plantCache.get(key)+'" style="width:200px;height:230px;object-fit:contain">';
  };
  buildStageChangeMarkup=function(a,b,c,d,p){if(!art.ready)return legacy.buildStageChangeMarkup(a,b,c,d,p);return buildPlantVisualMarkup({stage:{idx:b,name:STAGE_LABEL[b]},progress:p},d);};
  renderShop=function(){legacy.renderShop();if(!art.ready)return;
    document.querySelectorAll('#shop-grid .item').forEach((node,i)=>{const it=ITEMS[SHOP_TAB][i];const n=potIds.indexOf(it.id);if(n>=0){const img=new Image();img.src=art.pots[n].toDataURL();img.style.cssText='height:76px;max-width:100%;object-fit:contain';img.alt=it.name;node.querySelector('.ii').replaceChildren(img);}});
  };
  Promise.all([load('classroom-school-v5.png'),load('student-poses-v2.png'),load('student-girl-poses-v1.png'),load('tomato-growth-v2.png'),load('decorative-pots-v2.png'),load('tools-and-accessories-v2.png')]).then(([room,boy,girl,growth,pots,tools])=>{
    Object.assign(art,{room,boy:cut(boy,4,2),girl:cut(girl,4,2),growth:cut(growth,3,2),pots:cut(pots,3,2),ready:true});
    ITEMS.pot=potIds.map((id,i)=>({id,slot:'pot',icon:'🪴',name:potNames[i],cost:0}));
    // Unsupported dress-up overlays are omitted from the art-based character selector.
    ITEMS.char=[];
    art.tools=cut(tools,4,3);
    document.querySelectorAll('#modal-pot button').forEach(b=>{const text=b.textContent;const idx=text.includes('물 주기')?0:text.includes('흙 살펴보기')?1:text.includes('관찰하기')?2:-1;if(idx>=0){const target=b.querySelector('span');if(target){const img=new Image();img.src=art.tools[idx].toDataURL();img.alt='';img.style.cssText='width:38px;height:38px;object-fit:contain';target.replaceChildren(img);}}});
    renderStartPot=function(){const box=document.getElementById('start-pot');if(!box)return;box.replaceChildren();potIds.forEach((id,i)=>{const b=document.createElement('button');b.className='sw'+((S.equip||{}).pot===id?' on':'');b.style.cssText='width:60px;height:64px';const img=new Image();img.src=art.pots[i].toDataURL();img.alt=potNames[i];img.style.cssText='width:100%;height:100%;object-fit:contain';b.append(img);b.onclick=()=>pickStartPot(id);box.append(b);});};
    const charTab=document.getElementById('stab-char');if(charTab)charTab.style.display='none';
    const roomTab=document.getElementById('stab-room');if(roomTab)roomTab.style.display='none';
    SHOP_TAB='pot';drawStartChar();renderStartPot();if(S.plantDate)renderGame();drawRoom();
  }).catch(e=>{console.error('Game artwork failed',e);toast('그림을 불러오지 못했어요. 새로고침해 주세요.','orange');});
})();
