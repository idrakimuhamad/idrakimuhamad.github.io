(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();class yl{s;constructor(e=1337){this.s=e>>>0}next(){let e=this.s+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}range(e,t){return e+(t-e)*this.next()}int(e,t){return Math.floor(this.range(e,t+1))}pick(e){return e[Math.floor(this.next()*e.length)]}}function Sl(i,e){const t=[],n=i.length;for(let s=0;s<n-1;s++){const r=i[Math.max(0,s-1)],o=i[s],a=i[s+1],c=i[Math.min(n-1,s+2)];for(let l=0;l<e;l++){const h=l/e,d=h*h,p=d*h,m=.5*(2*o.x+(-r.x+a.x)*h+(2*r.x-5*o.x+4*a.x-c.x)*d+(-r.x+3*o.x-3*a.x+c.x)*p),g=.5*(2*o.z+(-r.z+a.z)*h+(2*r.z-5*o.z+4*a.z-c.z)*d+(-r.z+3*o.z-3*a.z+c.z)*p);t.push({x:m,y:0,z:g})}}return t.push({...i[n-1]}),t}function zi(i,e){const t=Sl(e,14),n=[0];for(let s=1;s<t.length;s++){const r=t[s-1],o=t[s];n.push(n[s-1]+Math.hypot(o.x-r.x,o.z-r.z))}return{name:i,points:t,cum:n,length:n[n.length-1],portal:{...t[0]}}}function bl(i=20240607){const e=new yl(i),t={x:0,y:0,z:0},n=[zi("north",[{x:4,y:0,z:-46},{x:-6,y:0,z:-38},{x:2,y:0,z:-28},{x:-3,y:0,z:-18},{x:1,y:0,z:-9},t]),zi("east",[{x:44,y:0,z:14},{x:36,y:0,z:4},{x:28,y:0,z:12},{x:19,y:0,z:6},{x:10,y:0,z:3},t]),zi("west",[{x:-42,y:0,z:18},{x:-34,y:0,z:10},{x:-26,y:0,z:16},{x:-17,y:0,z:8},{x:-9,y:0,z:4},t]),zi("northeast",[{x:36,y:0,z:-32},{x:28,y:0,z:-26},{x:22,y:0,z:-20},{x:13,y:0,z:-12},t]),zi("northwest",[{x:-36,y:0,z:-32},{x:-28,y:0,z:-26},{x:-22,y:0,z:-20},{x:-13,y:0,z:-12},t])],s=[];let r=0;const o=(d,p,m)=>{const g=n[d],v=g.length-p;let f=1;for(;f<g.cum.length-1&&g.cum[f]<v;)f++;const u=g.points[f-1],b=g.points[f],M=g.cum[f]-g.cum[f-1]||1,S=(v-g.cum[f-1])/M,C=u.x+(b.x-u.x)*S,R=u.z+(b.z-u.z)*S,A=b.x-u.x,F=b.z-u.z,X=Math.hypot(A,F)||1,_=-F/X,w=A/X;s.push({id:r++,pos:{x:C+_*m,y:0,z:R+w*m},lane:d,dist:p})};for(let d=0;d<n.length;d++)for(const p of[7,13,19,26,33])o(d,p,-5.2),o(d,p,5.2);for(let d=0;d<6;d++){const p=d/6*Math.PI*2+.35;s.push({id:r++,pos:{x:Math.cos(p)*6.5,y:0,z:Math.sin(p)*6.5},lane:-1,dist:6.5})}const a=[],c=n.flatMap(d=>d.points),l=(d,p,m)=>c.some(g=>Math.hypot(g.x-d,g.z-p)<m);let h=0;for(;a.length<46&&h++<400;){const d=e.range(0,Math.PI*2),p=e.range(9,48),m=Math.cos(d)*p,g=Math.sin(d)*p;if(Math.abs(m)<7&&Math.abs(g)<7||l(m,g,4.5)||s.some(u=>Math.hypot(u.pos.x-m,u.pos.z-g)<4))continue;const v=e.next(),f=v<.4?"rock":v<.6?"tree":v<.85?"ruin":"crystal";a.push({pos:{x:m,y:0,z:g},scale:e.range(.7,1.6),rot:e.range(0,Math.PI*2),kind:f})}return{lanes:n,pads:s,features:a,radius:50}}function qr(i,e,t){const n=Math.max(0,Math.min(i.length,e));let s=1;for(;s<i.cum.length-1&&i.cum[s]<n;)s++;const r=i.points[s-1],o=i.points[s],a=i.cum[s]-i.cum[s-1]||1,c=(n-i.cum[s-1])/a;t.x=r.x+(o.x-r.x)*c,t.z=r.z+(o.z-r.z)*c,t.y=0;const l=o.x-r.x,h=o.z-r.z,d=Math.hypot(l,h)||1;return t.hx=l/d,t.hz=h/d,t}function Ra(i,e,t){const n=qr(i,e,t),s=n.hx??1,r=n.hz??0;return t.x=-r,t.z=s,t.y=0,t}const sn={crawler:{kind:"crawler",name:"Crawler",hp:42,speed:3.4,radius:.55,damage:6,attackRange:1.6,attackInterval:1,essence:4,color:9064408},wisp:{kind:"wisp",name:"Wisp",hp:20,speed:6.2,radius:.42,damage:3,attackRange:1.4,attackInterval:.8,essence:3,color:5564671,aggroPlayer:!0,contact:4},brute:{kind:"brute",name:"Brute",hp:220,speed:1.9,radius:.95,damage:18,attackRange:2.2,attackInterval:1.6,essence:12,color:14176094},bulwark:{kind:"bulwark",name:"Bulwark",hp:300,speed:1.6,radius:.85,damage:14,attackRange:2,attackInterval:1.4,essence:14,color:10135480,armor:4,raidTowers:!0},shaman:{kind:"shaman",name:"Shaman",hp:90,speed:2.6,radius:.6,damage:8,attackRange:1.8,attackInterval:1.2,essence:10,color:7208862,heal:14,healRadius:7},colossus:{kind:"colossus",name:"Colossus",hp:900,speed:1.5,radius:1.5,damage:30,attackRange:2.8,attackInterval:2,essence:60,color:11816920,raidTowers:!0,elite:!0},boss:{kind:"boss",name:"The Rift Behemoth",hp:5200,speed:1.15,radius:2.6,damage:45,attackRange:4,attackInterval:2.2,essence:400,color:7024600,raidTowers:!0}},Jt={arcane:{kind:"arcane",name:"Arcane Turret",icon:"✦",cost:60,range:11,interval:.42,damage:11,color:5232895,desc:"Fast single-target bolts. Cheap and reliable.",upgrades:[{name:"Overclocked Coils",desc:"+45% damage, +20% fire rate",cost:70},{name:"Prism Head",desc:"Bolts pierce one extra enemy, +2 range",cost:120}]},frost:{kind:"frost",name:"Frost Obelisk",icon:"❄",cost:90,range:9,interval:1.5,damage:14,color:9431295,desc:"Slow pulse that damages and chills enemies in an area.",upgrades:[{name:"Deep Cold",desc:"Stronger chill (60% slow), +1 range",cost:100},{name:"Glacial Crown",desc:"Pulse deals 2x damage, +30% slow duration",cost:150}]},ember:{kind:"ember",name:"Ember Spire",icon:"☄",cost:110,range:13,interval:1.9,damage:26,color:16747586,desc:"Lobs explosive arcs that splash-damage groups.",upgrades:[{name:"Volatile Payload",desc:"+60% damage, +splash radius",cost:120},{name:"Molten Core",desc:"-25% cooldown, bigger blast",cost:170}]},tesla:{kind:"tesla",name:"Tesla Pylon",icon:"⚡",cost:160,range:10,interval:1.1,damage:22,color:14221135,desc:"Lightning arcs that chain between clustered enemies.",upgrades:[{name:"Conductive Lattice",desc:"Chains to 2 extra enemies",cost:150},{name:"Storm Engine",desc:"+50% damage, shorter cooldown",cost:200}]}},El=["arcane","frost","ember","tesla"];function ha(i,e){const t=Jt[i];switch(i){case"arcane":return e===1?{range:t.range,interval:t.interval,damage:t.damage}:e===2?{range:t.range,interval:t.interval*.8,damage:t.damage*1.45}:{range:t.range+2,interval:t.interval*.8,damage:t.damage*1.45};case"frost":return e===1?{range:t.range,interval:t.interval,damage:t.damage}:e===2?{range:t.range+1,interval:t.interval,damage:t.damage}:{range:t.range+1,interval:t.interval*.85,damage:t.damage*2};case"ember":return e===1?{range:t.range,interval:t.interval,damage:t.damage}:e===2?{range:t.range,interval:t.interval,damage:t.damage*1.6}:{range:t.range+1,interval:t.interval*.75,damage:t.damage*1.6};case"tesla":return e===1?{range:t.range,interval:t.interval,damage:t.damage}:e===2?{range:t.range,interval:t.interval,damage:t.damage}:{range:t.range+1,interval:t.interval*.7,damage:t.damage*1.5}}}const Yr=[{id:"atk_speed",name:"Haste Sigil",icon:"⚔",desc:"+20% attack speed",category:"guardian"},{id:"pierce",name:"Piercing Shot",icon:"➹",desc:"Primary bolts pierce one enemy",category:"guardian"},{id:"crit",name:"Rune of Cinders",icon:"✷",desc:"15% chance to deal double damage",category:"guardian"},{id:"crit_essence",name:"Essence Leech",icon:"❖",desc:"Critical hits grant +4 Essence",category:"economy"},{id:"dash_fire",name:"Blazing Dash",icon:"🔥",desc:"Dash leaves burning ground behind",category:"guardian"},{id:"lance_kb",name:"Shock Lance",icon:"≋",desc:"Lance gains knockback",category:"guardian"},{id:"vitality",name:"Aegis Plating",icon:"⛨",desc:"+40 max HP and full heal",category:"guardian"},{id:"swift",name:"Wind Steps",icon:"🌀",desc:"+12% movement speed",category:"guardian"},{id:"arcane_ricochet",name:"Ricochet Prisms",icon:"◇",desc:"Arcane Turret bolts bounce to one extra target",category:"tower"},{id:"frost_freeze",name:"Absolute Zero",icon:"❆",desc:"Frost Obelisks freeze heavily slowed enemies",category:"tower"},{id:"ember_fire",name:"Scorched Earth",icon:"♨",desc:"Ember Spires leave burning ground on impact",category:"tower"},{id:"tesla_chain",name:"Storm Conduit",icon:"ϟ",desc:"Tesla Pylons chain to one additional enemy",category:"tower"},{id:"essence_15",name:"Essence Attunement",icon:"◈",desc:"Enemies drop +15% Essence",category:"economy"},{id:"early_double",name:"Eager Guardian",icon:"⏵",desc:"Starting waves early gives double bonus",category:"economy"},{id:"refund",name:"Salvage Rites",icon:"♻",desc:"Selling towers refunds 80% instead of 60%",category:"economy"},{id:"blink",name:"Blink Step",icon:"⇢",desc:"Unlocks Blink: teleport a short distance (F)",category:"ability"},{id:"overcharge",name:"Overcharge",icon:"⚛",desc:"Unlocks Overcharge: nearby towers fire 80% faster for 6s (F)",category:"ability"}],He=(i,e,t,n=0,s=!1)=>({kind:i,count:e,interval:t,delay:n,elite:s}),un=[{label:"First Stirrings",groups:[He("crawler",8,1.1)]},{label:"The Swarm Gathers",groups:[He("crawler",12,.9),He("wisp",3,1.4,4)]},{label:"Hunters in the Dark",groups:[He("wisp",8,.8),He("crawler",10,.9,2)]},{label:"Heavy Footfalls",groups:[He("brute",3,3),He("crawler",12,.8,2),He("wisp",4,1,6)]},{label:"The Colossus Stirs",groups:[He("colossus",1,1),He("crawler",10,.8,3),He("wisp",6,.9,5)]},{label:"Every Gate Opens",groups:[He("crawler",14,.7),He("wisp",8,.8,3),He("brute",3,2.6,6)]},{label:"Iron Procession",groups:[He("bulwark",4,2.4),He("crawler",14,.7,2),He("wisp",6,.9,8)]},{label:"Whispers of the Void",groups:[He("shaman",3,3),He("bulwark",3,2.6,4),He("wisp",10,.7,6),He("crawler",10,.8,10)]},{label:"The Great Assault",groups:[He("brute",5,2.2),He("bulwark",4,2.2,3),He("shaman",3,3,6),He("crawler",18,.6,2),He("wisp",10,.7,8)]},{label:"Elite Vanguard",groups:[He("colossus",2,6),He("bulwark",5,2,4),He("shaman",4,2.6,8),He("wisp",14,.6,10),He("crawler",16,.6,12)]},{label:"The Rift Behemoth",groups:[He("boss",1,1,2)]}],wl=[3,6,9],qs={easy:{hp:.8,speed:.92,count:.8,essence:1.25,prep:35,bossHp:.8,bossSpeed:.95,label:"Easy"},normal:{hp:1,speed:1,count:1,essence:1,prep:25,bossHp:1,bossSpeed:1,label:"Normal"},hard:{hp:1.35,speed:1.1,count:1.25,essence:.85,prep:20,bossHp:1.4,bossSpeed:1.12,label:"Hard"}},Tl=140,Ca=1e3,Pa=120,Al=.6,Rl=2,_t=2400;class Cl{count=0;px=new Float32Array(_t);py=new Float32Array(_t);pz=new Float32Array(_t);vx=new Float32Array(_t);vy=new Float32Array(_t);vz=new Float32Array(_t);life=new Float32Array(_t);maxLife=new Float32Array(_t);size=new Float32Array(_t);cr=new Float32Array(_t);cg=new Float32Array(_t);cb=new Float32Array(_t);gravity=new Float32Array(_t);drag=new Float32Array(_t);spawn(e,t,n,s){const r=s.count??8;for(let o=0;o<r;o++){if(this.count>=_t)return;const a=this.count++,c=Math.random()*Math.PI*2,l=(s.speed??3)*(.4+Math.random()*.8),h=s.spread??1;this.px[a]=e,this.py[a]=t,this.pz[a]=n,this.vx[a]=Math.cos(c)*l*h,this.vy[a]=(s.up??2)*(.5+Math.random()*.8),this.vz[a]=Math.sin(c)*l*h;const d=(s.life??.6)*(.6+Math.random()*.7);this.life[a]=d,this.maxLife[a]=d,this.size[a]=(s.size??.14)*(.6+Math.random()*.8),this.cr[a]=s.color[0],this.cg[a]=s.color[1],this.cb[a]=s.color[2],this.gravity[a]=s.gravity??6,this.drag[a]=s.drag??.9}}burst(e,t,n,s,r=10,o=4,a=2.5,c=.7,l=.15){this.spawn(e,t,n,{count:r,speed:o,up:a,life:c,size:l,color:s})}update(e){let t=0;for(;t<this.count;){if(this.life[t]-=e,this.life[t]<=0){const s=--this.count;t!==s&&(this.px[t]=this.px[s],this.py[t]=this.py[s],this.pz[t]=this.pz[s],this.vx[t]=this.vx[s],this.vy[t]=this.vy[s],this.vz[t]=this.vz[s],this.life[t]=this.life[s],this.maxLife[t]=this.maxLife[s],this.size[t]=this.size[s],this.cr[t]=this.cr[s],this.cg[t]=this.cg[s],this.cb[t]=this.cb[s],this.gravity[t]=this.gravity[s],this.drag[t]=this.drag[s]);continue}const n=Math.max(0,1-this.drag[t]*e);this.vx[t]*=n,this.vz[t]*=n,this.vy[t]=this.vy[t]*n-this.gravity[t]*e,this.px[t]+=this.vx[t]*e,this.py[t]+=this.vy[t]*e,this.pz[t]+=this.vz[t]*e,this.py[t]<.02&&(this.py[t]=.02,this.vy[t]*=-.3),t++}}}const Pl=i=>[(i>>16&255)/255,(i>>8&255)/255,(i&255)/255],Ll=260,Dl=220,Il=64,Ul=40;class La{arena=bl();phase="menu";paused=!1;difficulty="normal";essence=Tl;bastionHp=Ca;bastionMaxHp=Ca;bastionFlash=0;wave=0;prepTime=0;prepTotal=25;spawnPaused=!1;spawnQueue=[];spawnTimer=0;enemiesAlive=0;enemies=[];towers=[];projectiles=[];patches=[];nextId=1;player=Nl();mods=Fl();stats={kills:0,essenceEarned:0,towersBuilt:0,damageDealt:0,time:0};gameSpeed=1;time=0;fx=[];bossRef=null;particles=new Cl;buildMode=!1;buildSelection=null;selectedTowerId=-1;acquiredCards=[];pendingCards=[];debug={showPaths:!1,showRanges:!1,spawnPaused:!1};enemyPool=[];projectilePool=[];constructor(){for(let e=0;e<Ll;e++)this.enemyPool.push(Ol());for(let e=0;e<Dl;e++)this.projectilePool.push(zl())}pushFx(e){this.fx.push(e)}drainFx(){const e=this.fx;return this.fx=[],e}addEssence(e){this.essence+=e,this.stats.essenceEarned+=Math.max(0,e)}spawnEnemy(e,t,n=!1){const s=this.enemyPool.find(a=>!a.active);if(!s)return null;const o=this.arena.lanes[t].points[0];return s.active=!0,s.id=this.nextId++,s.kind=e,s.elite=n,s.pos={x:o.x,y:0,z:o.z},s.lane=t,s.dist=0,s.lateral=0,s.lateralTarget=(Math.random()-.5)*4,s.state="spawn",s.spawnT=.4,s.attackCd=0,s.target=null,s.targetId=-1,s.slow=0,s.slowT=0,s.freezeT=0,s.buffT=0,s.flash=0,s.dead=!1,s.healTick=0,s.summonCd=4,s.boltCd=3,s.shieldCd=8,s.shieldT=0,s.enraged=!1,this.enemies.push(s),this.enemiesAlive++,s}killEnemy(e){if(e.dead)return;e.dead=!0,e.active=!1,this.enemiesAlive--,this.stats.kills++;const t=this.enemies.indexOf(e);t>=0&&this.enemies.splice(t,1),this.enemyPool.push(e),this.bossRef===e&&(this.bossRef=null)}spawnTower(e,t){if(this.towers.length>=Il)return null;const n=this.arena.pads[t],s={id:this.nextId++,kind:e,level:1,pos:{x:n.pos.x,y:0,z:n.pos.z},padId:t,range:0,interval:0,damage:0,cd:0,hp:140,maxHp:140,headAngle:0,invested:0,flash:0,dead:!1,stormCd:0,anim:0};return this.towers.push(s),this.stats.towersBuilt++,s}removeTower(e){e.dead=!0;const t=this.towers.indexOf(e);t>=0&&this.towers.splice(t,1),this.selectedTowerId===e.id&&(this.selectedTowerId=-1)}allocProjectile(){return this.projectilePool.find(e=>!e.active)??null}addPatch(e,t,n,s){this.patches.length>=Ul&&this.patches.shift();const r={pos:{x:e.x,y:e.y,z:e.z},radius:t,life:n,maxLife:n,dps:s,tick:0};this.patches.push(r)}}function Nl(){return{pos:{x:0,y:0,z:8},aim:{x:0,y:0,z:0},hp:Pa,maxHp:Pa,speed:8.5,fireCd:0,lanceCd:0,dashCd:0,dashT:0,dashDir:{x:0,y:0,z:0},invulnT:0,hurtT:0,facing:0,dead:!1,meleeCd:0,meleeAnim:0,meleeAngle:0}}function Fl(){return{attackSpeed:1,pierce:0,critChance:0,critEssence:!1,dashFire:!1,lanceKnockback:!1,maxHpBonus:0,moveSpeed:1,arcaneRicochet:0,frostFreeze:!1,emberFire:!1,teslaChainBonus:0,essenceMult:1,earlyBonusMult:1,sellRefund:.6,blink:!1,overcharge:!1,overchargeT:0,overchargeCd:0}}function Ol(){return{id:0,kind:"crawler",pos:{x:0,y:0,z:0},hp:0,maxHp:0,speed:0,radius:.5,lane:0,dist:0,lateral:0,lateralTarget:0,state:"spawn",spawnT:0,attackCd:0,target:null,targetId:-1,slow:0,slowT:0,freezeT:0,buffT:0,flash:0,dead:!1,elite:!1,healTick:0,summonCd:0,boltCd:0,shieldCd:0,shieldT:0,enraged:!1,active:!1,facing:0}}function zl(){return{active:!1,kind:"bolt",pos:{x:0,y:0,z:0},vel:{x:0,y:0,z:0},life:0,dmg:0,radius:.3,from:-1,pierce:0,bounces:0,splash:0,color:16777215,hit:[],arcT:0,arcFrom:{x:0,y:0,z:0},arcTo:{x:0,y:0,z:0},arcDur:0,arcH:0,trailT:0}}const as={x:0,y:0,z:0},Da={x:0,y:0,z:0};function Bl(i,e){const t=i.player;for(let n=i.enemies.length-1;n>=0;n--){const s=i.enemies[n],r=sn[s.kind];if(s.flash>0&&(s.flash-=e),s.slowT>0&&(s.slowT-=e,s.slowT<=0&&(s.slow=0)),s.freezeT>0&&(s.freezeT-=e),s.buffT>0&&(s.buffT-=e),s.shieldT>0&&(s.shieldT-=e),s.kbX||s.kbZ){s.pos.x+=(s.kbX??0)*e,s.pos.z+=(s.kbZ??0)*e;const l=Math.max(0,1-6*e);s.kbX=(s.kbX??0)*l,s.kbZ=(s.kbZ??0)*l}if(s.state==="spawn"){s.spawnT-=e,s.spawnT<=0&&(s.state="walk");continue}if(s.freezeT>0)continue;const o=(1-s.slow)*(s.buffT>0?1.35:1)*(s.enraged?1.4:1),a=s.speed*o;if(s.kind!=="boss"&&kl(i,s,!!r.raidTowers,!!r.aggroPlayer),r.heal&&s.state==="walk"&&(s.healTick-=e,s.healTick<=0)){s.healTick=.5;for(const l of i.enemies){if(l===s||l.dead||l.hp>=l.maxHp)continue;const h=l.pos.x-s.pos.x,d=l.pos.z-s.pos.z;h*h+d*d<(r.healRadius??7)*(r.healRadius??7)&&(l.hp=Math.min(l.maxHp,l.hp+r.heal*.5))}i.pushFx({type:"sound",sound:"heal"})}s.kind==="boss"&&Xl(i,s,e);const c=Gl(i,s);if(c){const l=c.x-s.pos.x,h=c.z-s.pos.z;if(Math.hypot(l,h)<=r.attackRange)s.state="attack",s.attackCd-=e,s.attackCd<=0&&(s.attackCd=r.attackInterval*(s.enraged?.6:1),Hl(i,s,c));else{s.state="walk",s.dist+=a*e;const p=i.arena.lanes[s.lane];p.length-s.dist>2?(s.lateral+=(s.lateralTarget-s.lateral)*Math.min(1,2.5*e),Math.abs(s.lateralTarget-s.lateral)<.2&&Math.random()<.4*e&&(s.lateralTarget=(Math.random()-.5)*4.5)):s.lateral*=Math.max(0,1-3*e);const g=qr(p,s.dist,as),v=Ra(p,s.dist,Da);if(s.pos.x=g.x+v.x*s.lateral,s.pos.z=g.z+v.z*s.lateral,Math.abs(s.kbX??0)<.5){const f=as.hx??0,u=as.hz??0;s.facing=Math.atan2(f,u)}if(r.contact&&!t.dead){const f=t.pos.x-s.pos.x,u=t.pos.z-s.pos.z;f*f+u*u<(s.radius+.6)*(s.radius+.6)&&da(i,r.contact,s.pos)}}}else{s.dist+=a*e;const l=i.arena.lanes[s.lane],h=qr(l,s.dist,as),d=Ra(l,s.dist,Da);s.pos.x=h.x+d.x*s.lateral,s.pos.z=h.z+d.z*s.lateral,s.dist>=l.length-r.attackRange&&(s.state="attack",s.attackCd-=e,s.attackCd<=0&&(s.attackCd=r.attackInterval*(s.enraged?.6:1),Vl(i,s,r.damage),i.pushFx({type:"sound",sound:"bastion_hit"})))}}}function kl(i,e,t,n){if(e.target==="tower"){const s=i.towers.find(r=>r.id===e.targetId);if(s&&!s.dead){const r=s.pos.x-e.pos.x,o=s.pos.z-e.pos.z;if(r*r+o*o<12*12)return}e.target=null}if(e.target==="player"){if(i.player.dead){e.target=null;return}const s=i.player.pos.x-e.pos.x,r=i.player.pos.z-e.pos.z;if(s*s+r*r<14*14)return;e.target=null}if(n&&!i.player.dead){const s=i.player.pos.x-e.pos.x,r=i.player.pos.z-e.pos.z;if(s*s+r*r<6*6){e.target="player";return}}if(t){let s=null;for(const r of i.towers){if(r.dead)continue;const o=r.pos.x-e.pos.x,a=r.pos.z-e.pos.z,c=o*o+a*a;c<8*8&&(!s||c<s.d)&&(s={id:r.id,d:c})}if(s){e.target="tower",e.targetId=s.id;return}}e.target=null}function Gl(i,e){if(e.target==="player"&&!i.player.dead)return i.player.pos;if(e.target==="tower"){const t=i.towers.find(n=>n.id===e.targetId);if(t&&!t.dead)return t.pos}return null}function Hl(i,e,t){const n=sn[e.kind];if(e.target==="player")da(i,n.damage,t);else if(e.target==="tower"){const s=i.towers.find(r=>r.id===e.targetId);s&&!s.dead&&(s.hp-=n.damage,s.flash=.15,i.pushFx({type:"sound",sound:"tower_hit"}),s.hp<=0&&(i.pushFx({type:"announce",msg:"TOWER DESTROYED",sub:Jt[s.kind].name,color:"#ff7d6b"}),i.pushFx({type:"sound",sound:"tower_destroy"}),i.removeTower(s),i.pushFx({type:"shake",amount:4})))}}function Vl(i,e,t){i.bastionHp-=t,i.bastionFlash=.2,i.pushFx({type:"shake",amount:3}),i.bastionHp<=0&&(i.bastionHp=0,i.phase="gameover",i.pushFx({type:"sound",sound:"defeat"}),i.pushFx({type:"shake",amount:14}))}function da(i,e,t){const n=i.player;if(n.dead||n.invulnT>0)return;n.hp-=e,n.hurtT=.3,n.invulnT=.5,i.pushFx({type:"sound",sound:"player_hit"}),i.pushFx({type:"shake",amount:5});const s=n.pos.x-t.x,r=n.pos.z-t.z,o=Math.hypot(s,r)||1;n.pos.x+=s/o*.6,n.pos.z+=r/o*.6,n.hp<=0&&(n.hp=0,n.dead=!0,i.phase="gameover",i.pushFx({type:"sound",sound:"defeat"}),i.pushFx({type:"announce",msg:"THE GUARDIAN HAS FALLEN",sub:"The Bastion is lost"}))}function Zn(i,e,t,n={}){if(e.dead||e.state==="spawn")return!1;if(e.kind==="boss"&&e.shieldT>0)return i.pushFx({type:"text",msg:"SHIELDED",pos:{x:e.pos.x,y:2.4,z:e.pos.z},color:"#8fe8ff"}),!1;const s=sn[e.kind];let r=t;return s.armor&&(r=Math.max(1,t-s.armor)),e.hp-=r,e.flash=.12,i.stats.damageDealt+=r,n.kb&&n.kbStrength&&(e.kbX=(e.kbX??0)+n.kb.x*n.kbStrength,e.kbZ=(e.kbZ??0)+n.kb.z*n.kbStrength),e.hp<=0?(Wl(i,e),!0):!1}function Wl(i,e){const t=sn[e.kind],n=Math.round(t.essence*i.mods.essenceMult*(e.elite?2:1));i.addEssence(n),Pl(t.color),i.pushFx({type:"sound",sound:e.kind==="boss"?"boss_die":"enemy_die"}),i.pushFx({type:"shake",amount:e.kind==="brute"||e.kind==="colossus"||e.kind==="boss"?4:1}),i.pushFx({type:"text",msg:"+"+n,pos:{x:e.pos.x,y:1.2,z:e.pos.z},color:"#7dffb0"}),i.pushFx({type:"burst",pos:{x:e.pos.x,y:.6,z:e.pos.z},color:"#"+t.color.toString(16).padStart(6,"0"),value:e.kind==="boss"?80:e.kind==="brute"||e.kind==="colossus"?30:14,size:e.radius*.5,speed:4+e.radius*3}),i.pushFx({type:"burst",pos:{x:e.pos.x,y:.4,z:e.pos.z},color:"#7dffb0",value:6,size:.1,speed:2}),i.killEnemy(e)}function Xl(i,e,t){if(!e.enraged&&e.hp<e.maxHp*.5&&(e.enraged=!0,i.pushFx({type:"announce",msg:"THE BEHEMOTH IS ENRAGED",sub:"It fights with desperate fury",color:"#ff7d6b"}),i.pushFx({type:"sound",sound:"boss_enrage"}),i.pushFx({type:"shake",amount:8})),e.summonCd-=t,e.summonCd<=0){e.summonCd=e.enraged?7:11;const n=e.enraged?4:3;for(let s=0;s<n;s++){const r=(e.lane+s)%3,o=i.spawnEnemy("crawler",r);o&&(o.hp=42*Yl(i),o.maxHp=o.hp,o.speed=3.4,o.radius=.55,o.dist=Math.max(0,e.dist-6-s*2))}i.pushFx({type:"sound",sound:"boss_summon"}),i.pushFx({type:"shake",amount:3})}if(e.boltCd-=t,e.boltCd<=0){e.boltCd=e.enraged?2.2:3.4;const n=i.player,s=!n.dead&&Math.hypot(n.pos.x-e.pos.x,n.pos.z-e.pos.z)<26?n.pos:{x:0,z:0};jl(i,e,s,e.enraged?26:18,s===n.pos?-1:-2)}e.shieldCd-=t,e.shieldCd<=0&&(e.shieldCd=e.enraged?10:14,e.shieldT=3,i.pushFx({type:"announce",msg:"VOID SHIELD",sub:"The Behemoth is invulnerable",color:"#8fe8ff"}),i.pushFx({type:"sound",sound:"boss_shield"})),ql(e,t,i)}const Ia=new Map;function ql(i,e,t){let n=Ia.get(i.id)??6;if(n-=e,n<=0){n=i.enraged?8:12;let s=0;for(const r of t.towers){if(r.dead||s>=2)continue;const o=r.pos.x-i.pos.x,a=r.pos.z-i.pos.z;o*o+a*a<9*9&&(r.stormCd=5,s++)}s>0&&(t.pushFx({type:"announce",msg:"TOWERS SUPPRESSED",sub:s+" defense"+(s>1?"s":"")+" disabled",color:"#b44fd8"}),t.pushFx({type:"sound",sound:"boss_stun"}),t.pushFx({type:"shake",amount:4}))}Ia.set(i.id,n)}function Yl(i){return i.difficulty==="easy"?.8:i.difficulty==="hard"?1.35:1}function jl(i,e,t,n,s){const r=i.allocProjectile();if(!r)return;r.active=!0,r.kind="void",r.pos={x:e.pos.x,y:1.6,z:e.pos.z};const o=t.x-r.pos.x,a=t.z-r.pos.z,c=Math.hypot(o,a)||1,l=14;r.vel={x:o/c*l,y:0,z:a/c*l},r.life=4,r.dmg=n,r.radius=.5,r.from=s,r.color=11816920,r.hit=[],i.pushFx({type:"sound",sound:"void_bolt"})}function $l(i,e){let t=null,n=-1;for(const s of i.enemies){if(s.dead||s.state==="spawn")continue;const r=s.pos.x-e.pos.x,o=s.pos.z-e.pos.z,a=r*r+o*o;if(a>e.range*e.range)continue;const c=s.dist-a*.01;c>n&&(n=c,t=s)}return t}function Kl(i,e){const t=i.mods.overchargeT>0;for(const n of i.towers){if(n.flash>0&&(n.flash-=e),n.stormCd>0){n.stormCd-=e;continue}n.anim>0&&(n.anim-=e);const s=t&&Math.hypot(n.pos.x-i.player.pos.x,n.pos.z-i.player.pos.z)<14?1/1.8:1;if(n.cd-=e*s,n.cd>0)continue;const r=$l(i,n);if(!r){n.cd=0;continue}const o=r.pos.x-n.pos.x,a=r.pos.z-n.pos.z;let l=Math.atan2(o,a)-n.headAngle;for(;l>Math.PI;)l-=Math.PI*2;for(;l<-Math.PI;)l+=Math.PI*2;switch(n.headAngle+=l*Math.min(1,12*e),n.cd=n.interval,n.anim=.25,n.kind){case"arcane":Zl(i,n,r);break;case"frost":Jl(i,n);break;case"ember":eh(i,n,r);break;case"tesla":th(i,n,r);break}}}function Zl(i,e,t){const n=i.allocProjectile();if(!n)return;n.active=!0,n.kind="bolt",n.pos={x:e.pos.x,y:1.5,z:e.pos.z};const s=t.pos.x-n.pos.x,r=t.pos.z-n.pos.z,o=Math.hypot(s,r)||1,a=26;n.vel={x:s/o*a,y:0,z:r/o*a},n.life=1.2,n.dmg=e.damage,n.radius=.28,n.from=e.id,n.color=5232895,n.pierce=e.level>=3?1:0,n.bounces=i.mods.arcaneRicochet>0?1:0,n.splash=0,n.hit=[],n.arcT=0,n.trailT=0,i.pushFx({type:"sound",sound:"arcane"})}function Jl(i,e){let t=!1;for(const n of i.enemies){if(n.dead||n.state==="spawn")continue;const s=n.pos.x-e.pos.x,r=n.pos.z-e.pos.z;if(s*s+r*r>e.range*e.range)continue;t=!0;const a=e.level>=2?.6:.45,c=e.level>=3?2.6:1.8;n.slow=Math.max(n.slow,a),n.slowT=Math.max(n.slowT,c),i.mods.frostFreeze&&n.slow>=.6&&(n.freezeT=Math.max(n.freezeT,1.2)),Ql(i,n,e.damage)}t&&i.pushFx({type:"sound",sound:"frost"})}function Ql(i,e,t,n){Zn(i,e,t)}function eh(i,e,t){const n=i.allocProjectile();if(!n)return;n.active=!0,n.kind="ember",n.pos={x:e.pos.x,y:1.8,z:e.pos.z},n.arcFrom={x:n.pos.x,y:1.8,z:n.pos.z},n.arcTo={x:t.pos.x+(t.kbX??0)*.1,y:0,z:t.pos.z+(t.kbZ??0)*.1};const s=Math.hypot(n.arcTo.x-n.arcFrom.x,n.arcTo.z-n.arcFrom.z);n.arcDur=Math.max(.5,s/18),n.arcT=0,n.arcH=3+s*.12,n.life=n.arcDur+.1,n.dmg=e.damage,n.radius=.4,n.from=e.id,n.color=16747586,n.pierce=0,n.bounces=0,n.splash=e.level>=2?3.4:2.6,n.hit=[],n.trailT=0,i.pushFx({type:"sound",sound:"ember"})}function th(i,e,t){const n=3+(e.level>=2?1:0)+i.mods.teslaChainBonus,s=new Set;let r=t,o=e.damage,a=e.pos.x,c=1.6,l=e.pos.z;for(i.pushFx({type:"sound",sound:"tesla"});r&&s.size<n;){s.add(r.id);const h=Zn(i,r,o);i.pushFx({type:"beam",pos:{x:a,y:c,z:l},pos2:{x:r.pos.x,y:1.2,z:r.pos.z},color:"#d8ff4f"}),a=r.pos.x,c=1.2,l=r.pos.z,o*=.75;let d=null,p=6.5*6.5;for(const m of i.enemies){if(m.dead||m.state==="spawn"||s.has(m.id))continue;const g=m.pos.x-r.pos.x,v=m.pos.z-r.pos.z,f=g*g+v*v;f<p&&(p=f,d=m)}r=d}}function Tc(i,e,t){const n=Jt[t];return!(i.essence<n.cost||i.towers.some(s=>s.padId===e&&!s.dead))}function nh(i,e,t){if(!Tc(i,e,t))return!1;const n=Jt[t];i.addEssence(-n.cost);const s=i.spawnTower(t,e);if(!s)return!1;const r=ha(t,1);return s.range=r.range,s.interval=r.interval,s.damage=r.damage,s.invested=n.cost,i.pushFx({type:"sound",sound:"place"}),i.pushFx({type:"shake",amount:1}),!0}function ih(i,e){if(e.level>=3)return!1;const t=Jt[e.kind],n=t.upgrades[e.level-1];if(i.essence<n.cost)return!1;i.addEssence(-n.cost),e.level++,e.invested+=n.cost,e.hp=e.maxHp;const s=ha(e.kind,e.level);return e.range=s.range,e.interval=s.interval,e.damage=s.damage,i.pushFx({type:"sound",sound:"upgrade"}),i.pushFx({type:"announce",msg:t.name.toUpperCase()+" LV"+e.level,sub:n.name,color:"#7dffb0"}),!0}function sh(i,e){const t=Math.round(e.invested*(i.mods.sellRefund>0?i.mods.sellRefund:Al));return i.addEssence(t),i.removeTower(e),i.pushFx({type:"sound",sound:"sell"}),t}const Ua=2.2,rh=1.15,ah=.45,oh=.2,fn={Q:{name:"Ground Slam",cd:8,desc:"Radial knockback around you"},E:{name:"Arcane Volley",cd:10,desc:"Burst of 8 bolts"},R:{name:"Blink",cd:6,desc:"Teleport toward aim (unlocked)"},F:{name:"Overcharge",cd:25,desc:"Nearby towers fire faster for 6s (unlocked)"}},ct={Q:0,E:0,R:0,F:0};function ch(){ct.Q=0,ct.E=0,ct.R=0,ct.F=0}function os(i){return ct[i]}function lh(i,e,t){const n=i.player;if(n.dead)return;n.invulnT>0&&(n.invulnT-=e),n.hurtT>0&&(n.hurtT-=e),n.fireCd>0&&(n.fireCd-=e),n.lanceCd>0&&(n.lanceCd-=e),n.dashCd>0&&(n.dashCd-=e),ct.Q=Math.max(0,ct.Q-e),ct.E=Math.max(0,ct.E-e),ct.R=Math.max(0,ct.R-e),ct.F=Math.max(0,ct.F-e);const s=t.aim.x-n.pos.x,r=t.aim.z-n.pos.z;s*s+r*r>.05&&(n.facing=Math.atan2(s,r));const o=n.speed*i.mods.moveSpeed;if(n.dashT>0)n.dashT-=e,n.pos.x+=n.dashDir.x*26*e,n.pos.z+=n.dashDir.z*26*e,i.mods.dashFire&&i.addPatch({x:n.pos.x,y:0,z:n.pos.z},1.1,.5,14);else{let l=t.moveX,h=t.moveY;const d=Math.hypot(l,h);d>1&&(l/=d,h/=d),n.pos.x+=l*o*e,n.pos.z+=-h*o*e}const a=i.arena.radius-2,c=Math.hypot(n.pos.x,n.pos.z);if(c>a&&(n.pos.x*=a/c,n.pos.z*=a/c),t.dash&&n.dashCd<=0&&n.dashT<=0){n.dashCd=2.5,n.dashT=.18,n.invulnT=Math.max(n.invulnT,.3);let l=t.moveX,h=-t.moveY;const d=Math.hypot(l,h);d<.1?(l=Math.sin(n.facing),h=Math.cos(n.facing)):(l/=d,h/=d),n.dashDir={x:l,y:0,z:h},i.pushFx({type:"sound",sound:"dash"})}if(n.meleeAnim>0&&(n.meleeAnim-=e,n.facing=n.meleeAngle),n.meleeCd>0&&(n.meleeCd-=e),n.meleeCd<=0&&n.meleeAnim<=0&&n.dashT<=0){let l=null,h=1/0;for(const d of i.enemies){if(d.dead||d.state==="spawn")continue;const p=d.pos.x-n.pos.x,m=d.pos.z-n.pos.z,g=Math.hypot(p,m)-d.radius;g<Ua&&g<h&&(l=d,h=g)}if(l){const d=Math.atan2(l.pos.x-n.pos.x,l.pos.z-n.pos.z);n.facing=d,n.meleeAngle=d,n.meleeCd=ah/i.mods.attackSpeed,n.meleeAnim=oh;let p=!1;for(const m of i.enemies){if(m.dead||m.state==="spawn")continue;const g=m.pos.x-n.pos.x,v=m.pos.z-n.pos.z;if(Math.hypot(g,v)>Ua+m.radius)continue;let u=Math.atan2(g,v)-d;for(;u>Math.PI;)u-=Math.PI*2;for(;u<-Math.PI;)u+=Math.PI*2;if(Math.abs(u)>rh)continue;const b={x:Math.sin(d)*5,y:0,z:Math.cos(d)*5};Zn(i,m,9*i.mods.attackSpeed,{kb:b,kbStrength:.5}),p=!0}i.pushFx({type:"sound",sound:"swing"}),p&&(i.pushFx({type:"sound",sound:"hit"}),i.pushFx({type:"burst",pos:{x:n.pos.x+Math.sin(d)*1.7,y:.9,z:n.pos.z+Math.cos(d)*1.7},color:"#ffe8c8",value:5,size:.08,speed:3}))}}if(t.firing&&n.fireCd<=0){n.fireCd=.34/i.mods.attackSpeed;const l=i.allocProjectile();if(l){l.active=!0,l.kind="bolt",l.pos={x:n.pos.x+Math.sin(n.facing)*.8,y:1.2,z:n.pos.z+Math.cos(n.facing)*.8};const h=t.aim.x-l.pos.x,d=t.aim.z-l.pos.z,p=Math.hypot(h,d)||1,m=30;l.vel={x:h/p*m,y:0,z:d/p*m},l.life=1;const g=Math.random()<i.mods.critChance;l.dmg=(g?28:14)*i.mods.attackSpeed,l.radius=.26,l.from=-1,l.color=g?16767055:10479871,l.pierce=i.mods.pierce,l.bounces=0,l.splash=0,l.hit=[],l.arcT=0,l.trailT=0,i.pushFx({type:"sound",sound:"shoot"}),g&&i.mods.critEssence&&i.addEssence(4)}}if(t.lance&&n.lanceCd<=0){n.lanceCd=1.3;const l=i.allocProjectile();if(l){l.active=!0,l.kind="lance",l.pos={x:n.pos.x+Math.sin(n.facing)*.8,y:1.3,z:n.pos.z+Math.cos(n.facing)*.8};const h=t.aim.x-l.pos.x,d=t.aim.z-l.pos.z,p=Math.hypot(h,d)||1;l.vel={x:h/p*22,y:0,z:d/p*22},l.life=1.4,l.dmg=34,l.radius=.45,l.from=-1,l.color=16758863,l.pierce=2,l.bounces=0,l.splash=0,l.hit=[],l.arcT=0,l.trailT=0,i.pushFx({type:"sound",sound:"lance"})}}t.q&&ct.Q<=0&&(ct.Q=fn.Q.cd,hh(i)),t.e&&ct.E<=0&&(ct.E=fn.E.cd,dh(i)),t.r&&ct.R<=0&&i.mods.blink&&(ct.R=fn.R.cd,uh(i,t.aim)),t.f&&ct.F<=0&&i.mods.overcharge&&(ct.F=fn.F.cd,i.mods.overchargeT=6,i.pushFx({type:"sound",sound:"overcharge"}),i.pushFx({type:"announce",msg:"OVERCHARGE",sub:"Nearby towers fire 80% faster",color:"#d8ff4f"}))}function hh(i){const e=i.player;i.pushFx({type:"sound",sound:"slam"}),i.pushFx({type:"shake",amount:7}),i.pushFx({type:"burst",pos:{x:e.pos.x,y:.3,z:e.pos.z},color:"#9fe8ff",value:40,size:.2,speed:9});for(const t of i.enemies){if(t.dead||t.state==="spawn")continue;const n=t.pos.x-e.pos.x,s=t.pos.z-e.pos.z,r=Math.hypot(n,s);if(r<5.2){const o={x:n/(r||1)*10,y:0,z:s/(r||1)*10};Zn(i,t,22,{kb:o,kbStrength:1.6})}}}function dh(i){const e=i.player;i.pushFx({type:"sound",sound:"volley"});for(let t=0;t<8;t++){const n=i.allocProjectile();if(!n)return;const s=(t-3.5)*.16,r=e.facing+s;e.aim.x,e.aim.z;const o=Math.sin(r),a=Math.cos(r);n.active=!0,n.kind="bolt",n.pos={x:e.pos.x+o*.8,y:1.2,z:e.pos.z+a*.8},n.vel={x:o*28,y:0,z:a*28},n.life=.9,n.dmg=11,n.radius=.24,n.from=-1,n.color=5232895,n.pierce=0,n.bounces=0,n.splash=0,n.hit=[],n.arcT=0,n.trailT=0}}function uh(i,e){const t=i.player,n=e.x-t.pos.x,s=e.z-t.pos.z,r=Math.hypot(n,s),o=Math.min(9,Math.max(3,r*.6));i.pushFx({type:"burst",pos:{x:t.pos.x,y:.8,z:t.pos.z},color:"#9fe8ff",value:14,size:.15,speed:4}),t.pos.x+=n/(r||1)*o,t.pos.z+=s/(r||1)*o,i.pushFx({type:"burst",pos:{x:t.pos.x,y:.8,z:t.pos.z},color:"#9fe8ff",value:14,size:.15,speed:4}),i.pushFx({type:"sound",sound:"blink"})}function fh(i,e){for(const t of i.projectilePool){if(!t.active)continue;if(t.life-=e,t.life<=0){t.active=!1;continue}if(t.kind==="ember"){t.arcT+=e;const s=Math.min(1,t.arcT/t.arcDur);t.pos.x=t.arcFrom.x+(t.arcTo.x-t.arcFrom.x)*s,t.pos.z=t.arcFrom.z+(t.arcTo.z-t.arcFrom.z)*s,t.pos.y=t.arcFrom.y+t.arcH*4*s*(1-s),s>=1&&(t.active=!1,mh(i,t));continue}if(t.pos.x+=t.vel.x*e,t.pos.y+=t.vel.y*e,t.pos.z+=t.vel.z*e,t.from>=0||t.from===-1||t.from===-2){if(t.from===-2){const r=i.player;if(!r.dead){const c=r.pos.x-t.pos.x,l=r.pos.z-t.pos.z;if(c*c+l*l<(t.radius+.6)*(t.radius+.6)){t.active=!1,da(i,t.dmg,t.pos),i.pushFx({type:"burst",pos:{x:t.pos.x,y:1,z:t.pos.z},color:"#b44fd8",value:12,size:.15,speed:4});continue}}const o=0-t.pos.x,a=0-t.pos.z;if(o*o+a*a<2.2*2.2){t.active=!1,i.bastionHp=Math.max(0,i.bastionHp-t.dmg),i.bastionFlash=.2,i.pushFx({type:"shake",amount:4}),i.pushFx({type:"burst",pos:{x:t.pos.x,y:1,z:t.pos.z},color:"#b44fd8",value:12,size:.15,speed:4}),i.bastionHp<=0&&(i.phase="gameover",i.pushFx({type:"sound",sound:"defeat"}));continue}continue}e:for(const r of i.enemies){if(r.dead||r.state==="spawn"||t.hit.includes(r.id))continue;const o=r.pos.x-t.pos.x,a=r.pos.z-t.pos.z,c=t.radius+r.radius;if(o*o+a*a>=c*c)continue;t.hit.push(r.id);const l={x:t.vel.x,y:0,z:t.vel.z},h=t.kind==="lance"?i.mods.lanceKnockback?2.4:1:.4;if(Zn(i,r,t.dmg,{kb:l,kbStrength:h}),i.pushFx({type:"sound",sound:t.kind==="lance"?"lance_hit":"hit"}),i.pushFx({type:"burst",pos:{x:t.pos.x,y:.8,z:t.pos.z},color:"#"+t.color.toString(16).padStart(6,"0"),value:6,size:.12,speed:3}),t.pierce>0){t.pierce--;continue}if(t.bounces>0){const d=ph(i,t,r);if(d){t.bounces--;const p=d.pos.x-t.pos.x,m=d.pos.z-t.pos.z,g=Math.hypot(p,m)||1;t.vel={x:p/g*26,y:0,z:m/g*26},t.life=.5;continue}}t.active=!1;break e}}const n=i.arena.radius+4;t.pos.x*t.pos.x+t.pos.z*t.pos.z>n*n&&(t.active=!1)}}function ph(i,e,t){let n=null,s=9*9;for(const r of i.enemies){if(r.dead||r.state==="spawn"||r===t||e.hit.includes(r.id))continue;const o=r.pos.x-e.pos.x,a=r.pos.z-e.pos.z,c=o*o+a*a;c<s&&(s=c,n=r)}return n}function mh(i,e){i.pushFx({type:"sound",sound:"explode"}),i.pushFx({type:"shake",amount:2}),i.pushFx({type:"burst",pos:{x:e.pos.x,y:.4,z:e.pos.z},color:"#ff8c42",value:26,size:.2,speed:7}),i.pushFx({type:"burst",pos:{x:e.pos.x,y:.3,z:e.pos.z},color:"#ffd84f",value:10,size:.12,speed:3});for(const t of i.enemies){if(t.dead||t.state==="spawn")continue;const n=t.pos.x-e.pos.x,s=t.pos.z-e.pos.z,r=Math.hypot(n,s);if(r<e.splash+t.radius){const o=1-r/(e.splash+t.radius)*.5,a={x:n/(r||1),y:0,z:s/(r||1)};Zn(i,t,e.dmg*o,{kb:a,kbStrength:3})}}i.mods.emberFire&&i.addPatch({x:e.pos.x,y:0,z:e.pos.z},e.splash*.8,2.2,12)}function gh(i,e){for(let t=i.patches.length-1;t>=0;t--){const n=i.patches[t];if(n.life-=e,n.life<=0){i.patches.splice(t,1);continue}if(n.tick-=e,n.tick<=0){n.tick=.4;for(const s of i.enemies){if(s.dead||s.state==="spawn")continue;const r=s.pos.x-n.pos.x,o=s.pos.z-n.pos.z;r*r+o*o<(n.radius+s.radius)*(n.radius+s.radius)&&Zn(i,s,n.dps*.4)}}}}function _h(i,e="normal"){const t=un[i-1];if(!t)return[];const n=qs[e],s=[];for(const r of t.groups){const o=s.find(c=>c.kind===r.kind),a=Math.max(1,Math.round(r.count*n.count));o?o.count+=a:s.push({kind:r.kind,count:a,name:sn[r.kind].name,color:sn[r.kind].color})}return s}function vh(i,e){const t=un[e-1],n=qs[i.difficulty];if(!t)return;const s=[],r=e>=6?5:3;let o=Math.floor(Math.random()*r);for(const a of t.groups){const c=Math.max(1,Math.round(a.count*n.count));for(let l=0;l<c;l++){const h=a.kind==="boss"?0:(o+l)%r;s.push({kind:a.kind,t:a.delay+l*a.interval,elite:!!a.elite,lane:h})}}s.sort((a,c)=>a.t-c.t),i.spawnQueue=s,i.spawnTimer=0}function jr(i,e){i.wave=e,i.phase="prep",i.prepTotal=qs[i.difficulty].prep,i.prepTime=i.prepTotal,i.buildMode=!1,i.buildSelection=null,i.selectedTowerId=-1,e===11?(i.pushFx({type:"announce",msg:"THE RIFT BEHEMOTH",sub:"It stirs beyond the gate..."}),i.pushFx({type:"sound",sound:"boss_warn"})):i.pushFx({type:"announce",msg:"WAVE "+e,sub:un[e-1]?.label??""})}function Ac(i,e=!1){if(i.phase==="prep"){if(e){const t=Math.round(i.prepTime*Rl*i.mods.earlyBonusMult);t>0&&(i.addEssence(t),i.pushFx({type:"text",msg:"+"+t+" Essence (early start)",pos:{x:0,y:4,z:0},color:"#7dffb0"}))}i.phase="combat",vh(i,i.wave),i.pushFx({type:"sound",sound:"wave_start"}),i.pushFx({type:"announce",msg:"WAVE "+i.wave,sub:"Defend the Bastion!"})}}function xh(i,e){i.prepTime-=e,i.prepTime<=0&&Ac(i,!1)}function Mh(i,e){if(!i.spawnPaused&&i.spawnQueue.length>0)for(i.spawnTimer+=e;i.spawnQueue.length>0&&i.spawnQueue[0].t<=i.spawnTimer;){const n=i.spawnQueue.shift(),s=i.spawnEnemy(n.kind,n.lane,n.elite);if(s){const r=sn[n.kind],o=qs[i.difficulty];let a=r.hp*o.hp;n.elite&&(a*=2.2),n.kind==="boss"&&(a=r.hp*o.bossHp),s.hp=a,s.maxHp=a,s.speed=r.speed*o.speed*(n.kind==="boss"&&o.bossSpeed?o.bossSpeed:1),s.radius=r.radius,n.kind==="boss"&&(i.bossRef=s),i.pushFx({type:"sound",sound:n.kind==="boss"?"boss_spawn":"spawn"})}}return i.spawnQueue.length===0&&i.enemies.length===0}function yh(i){const e=30+i.wave*6;i.addEssence(e),i.pushFx({type:"text",msg:"Wave "+i.wave+" cleared  +"+e+" Essence",pos:{x:0,y:5,z:0},color:"#7dffb0"}),i.pushFx({type:"sound",sound:"wave_clear"});const t=i.wave+1;if(t>un.length){i.phase="victory",i.pushFx({type:"sound",sound:"victory"});return}if(wl.includes(i.wave)){i.phase="upgrade";return}jr(i,t)}function Sh(i){const e=new Set(i.acquiredCards),t=Yr.filter(a=>!e.has(a.id)),n=Yr,s=t.length>=3?t:n,r=[],o=[...s];for(let a=0;a<3&&o.length>0;a++){const c=Math.floor(Math.random()*o.length);r.push(o.splice(c,1)[0])}return r}function bh(i,e){const t=i.mods;switch(i.acquiredCards.push(e),e){case"atk_speed":t.attackSpeed*=1.2;break;case"pierce":t.pierce+=1;break;case"crit":t.critChance=Math.min(.6,t.critChance+.15);break;case"crit_essence":t.critEssence=!0;break;case"dash_fire":t.dashFire=!0;break;case"lance_kb":t.lanceKnockback=!0;break;case"vitality":t.maxHpBonus+=40,i.player.maxHp+=40,i.player.hp=i.player.maxHp;break;case"swift":t.moveSpeed*=1.12;break;case"arcane_ricochet":t.arcaneRicochet+=1;break;case"frost_freeze":t.frostFreeze=!0;break;case"ember_fire":t.emberFire=!0;break;case"tesla_chain":t.teslaChainBonus+=1;break;case"essence_15":t.essenceMult*=1.15;break;case"early_double":t.earlyBonusMult*=2;break;case"refund":t.sellRefund=.8;break;case"blink":t.blink=!0;break;case"overcharge":t.overcharge=!0;break}}class Eh{g=new La;onPhaseChange=null;constructor(){}startRun(e){this.g=new La,this.g.difficulty=e,ch(),jr(this.g,1),this.notifyPhase()}notifyPhase(){this.onPhaseChange&&this.onPhaseChange(this.g.phase)}togglePause(){this.g.phase==="paused"?this.g.phase=this.pausedInto:(this.g.phase==="prep"||this.g.phase==="combat"||this.g.phase==="upgrade")&&(this.pausedInto=this.g.phase,this.g.phase="paused"),this.notifyPhase()}pausedInto="prep";chooseCard(e){bh(this.g,e),this.g.pendingCards=[],this.g.phase="prep";const t=this.g.wave+1;jr(this.g,t),this.notifyPhase()}startEarly(){this.g.phase==="prep"&&(Ac(this.g,!0),this.notifyPhase())}update(e,t){const n=this.g;if(n.phase==="menu"||n.phase==="gameover"||n.phase==="victory"||n.phase==="upgrade"){n.time+=e,n.particles.update(e);return}if(n.phase==="paused")return;const s=e*n.gameSpeed;n.time+=s,n.stats.time+=s,n.mods.overchargeT>0&&(n.mods.overchargeT-=s),n.bastionFlash>0&&(n.bastionFlash-=s),lh(n,s,t),n.phase==="prep"?xh(n,s):n.phase==="combat"&&Mh(n,s)&&yh(n),Bl(n,s),Kl(n,s),fh(n,s),gh(n,s),n.particles.update(s),n.phase!==this.lastPhase&&this.notifyPhase(),this.lastPhase=n.phase}lastPhase="menu";debugStartWave(){this.g.phase==="prep"?this.startEarly():this.g.phase}debugAddEssence(e=500){this.g.addEssence(e)}debugDamageBastion(e=100){this.g.bastionHp=Math.max(0,this.g.bastionHp-e),this.g.bastionHp<=0&&(this.g.phase="gameover",this.notifyPhase())}debugSpawn(e,t=0){const n=this.g.spawnEnemy(e,t);if(n){const s=sn[e];n.hp=s.hp,n.maxHp=s.hp,n.speed=s.speed,n.radius=s.radius,e==="boss"&&(n.hp=s.hp*1,n.maxHp=n.hp,this.g.bossRef=n)}}debugKillAll(){for(const e of[...this.g.enemies])this.g.killEnemy(e)}debugToggleSpawnPause(){this.g.spawnPaused=!this.g.spawnPaused}}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ua="161",wh=0,Na=1,Th=2,Rc=1,Cc=2,dn=3,Dn=0,Nt=1,Lt=2,Rn=0,Ei=1,$r=2,Fa=3,Oa=4,Ah=5,Hn=100,Rh=101,Ch=102,za=103,Ba=104,Ph=200,Lh=201,Dh=202,Ih=203,Kr=204,Zr=205,Uh=206,Nh=207,Fh=208,Oh=209,zh=210,Bh=211,kh=212,Gh=213,Hh=214,Vh=0,Wh=1,Xh=2,zs=3,qh=4,Yh=5,jh=6,$h=7,Pc=0,Kh=1,Zh=2,Cn=0,Jh=1,Qh=2,ed=3,Lc=4,td=5,nd=6,Dc=300,Ci=301,Pi=302,Jr=303,Qr=304,Ys=306,ea=1e3,$t=1001,ta=1002,Pt=1003,ka=1004,Bi=1005,It=1006,sr=1007,Wn=1008,Pn=1009,id=1010,sd=1011,fa=1012,Ic=1013,An=1014,pn=1015,Ji=1016,Uc=1017,Nc=1018,qn=1020,rd=1021,Kt=1023,ad=1024,od=1025,Yn=1026,Li=1027,cd=1028,Fc=1029,ld=1030,Oc=1031,zc=1033,rr=33776,ar=33777,or=33778,cr=33779,Ga=35840,Ha=35841,Va=35842,Wa=35843,Bc=36196,Xa=37492,qa=37496,Ya=37808,ja=37809,$a=37810,Ka=37811,Za=37812,Ja=37813,Qa=37814,eo=37815,to=37816,no=37817,io=37818,so=37819,ro=37820,ao=37821,lr=36492,oo=36494,co=36495,hd=36283,lo=36284,ho=36285,uo=36286,kc=3e3,jn=3001,dd=3200,ud=3201,Gc=0,fd=1,Wt="",dt="srgb",vn="srgb-linear",pa="display-p3",js="display-p3-linear",Bs="linear",nt="srgb",ks="rec709",Gs="p3",ei=7680,fo=519,pd=512,md=513,gd=514,Hc=515,_d=516,vd=517,xd=518,Md=519,na=35044,ki=35048,po="300 es",ia=1035,mn=2e3,Hs=2001;class Ui{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const s=this._listeners[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}}const wt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],hr=Math.PI/180,sa=180/Math.PI;function Ln(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(wt[i&255]+wt[i>>8&255]+wt[i>>16&255]+wt[i>>24&255]+"-"+wt[e&255]+wt[e>>8&255]+"-"+wt[e>>16&15|64]+wt[e>>24&255]+"-"+wt[t&63|128]+wt[t>>8&255]+"-"+wt[t>>16&255]+wt[t>>24&255]+wt[n&255]+wt[n>>8&255]+wt[n>>16&255]+wt[n>>24&255]).toLowerCase()}function Ut(i,e,t){return Math.max(e,Math.min(t,i))}function yd(i,e){return(i%e+e)%e}function dr(i,e,t){return(1-t)*i+t*e}function mo(i){return(i&i-1)===0&&i!==0}function ra(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function nn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ye(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class Se{constructor(e=0,t=0){Se.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ut(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ze{constructor(e,t,n,s,r,o,a,c,l){ze.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l)}set(e,t,n,s,r,o,a,c,l){const h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],d=n[7],p=n[2],m=n[5],g=n[8],v=s[0],f=s[3],u=s[6],b=s[1],M=s[4],S=s[7],C=s[2],R=s[5],A=s[8];return r[0]=o*v+a*b+c*C,r[3]=o*f+a*M+c*R,r[6]=o*u+a*S+c*A,r[1]=l*v+h*b+d*C,r[4]=l*f+h*M+d*R,r[7]=l*u+h*S+d*A,r[2]=p*v+m*b+g*C,r[5]=p*f+m*M+g*R,r[8]=p*u+m*S+g*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8];return t*o*h-t*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],d=h*o-a*l,p=a*c-h*r,m=l*r-o*c,g=t*d+n*p+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=d*v,e[1]=(s*l-h*n)*v,e[2]=(a*n-s*o)*v,e[3]=p*v,e[4]=(h*t-s*c)*v,e[5]=(s*r-a*t)*v,e[6]=m*v,e[7]=(n*c-l*t)*v,e[8]=(o*t-n*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-s*l,s*c,-s*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(ur.makeScale(e,t)),this}rotate(e){return this.premultiply(ur.makeRotation(-e)),this}translate(e,t){return this.premultiply(ur.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ur=new ze;function Vc(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Vs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Sd(){const i=Vs("canvas");return i.style.display="block",i}const go={};function $n(i){i in go||(go[i]=!0,console.warn(i))}const _o=new ze().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),vo=new ze().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),cs={[vn]:{transfer:Bs,primaries:ks,toReference:i=>i,fromReference:i=>i},[dt]:{transfer:nt,primaries:ks,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[js]:{transfer:Bs,primaries:Gs,toReference:i=>i.applyMatrix3(vo),fromReference:i=>i.applyMatrix3(_o)},[pa]:{transfer:nt,primaries:Gs,toReference:i=>i.convertSRGBToLinear().applyMatrix3(vo),fromReference:i=>i.applyMatrix3(_o).convertLinearToSRGB()}},bd=new Set([vn,js]),je={enabled:!0,_workingColorSpace:vn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!bd.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,e,t){if(this.enabled===!1||e===t||!e||!t)return i;const n=cs[e].toReference,s=cs[t].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,e){return this.convert(i,this._workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this._workingColorSpace)},getPrimaries:function(i){return cs[i].primaries},getTransfer:function(i){return i===Wt?Bs:cs[i].transfer}};function wi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function fr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ti;class Wc{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{ti===void 0&&(ti=Vs("canvas")),ti.width=e.width,ti.height=e.height;const n=ti.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=ti}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Vs("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=wi(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(wi(t[n]/255)*255):t[n]=wi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Ed=0;class Xc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ed++}),this.uuid=Ln(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(pr(s[o].image)):r.push(pr(s[o]))}else r=pr(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function pr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Wc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let wd=0;class Dt extends Ui{constructor(e=Dt.DEFAULT_IMAGE,t=Dt.DEFAULT_MAPPING,n=$t,s=$t,r=It,o=Wn,a=Kt,c=Pn,l=Dt.DEFAULT_ANISOTROPY,h=Wt){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:wd++}),this.uuid=Ln(),this.name="",this.source=new Xc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Se(0,0),this.repeat=new Se(1,1),this.center=new Se(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ze,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:($n("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===jn?dt:Wt),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Dc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ea:e.x=e.x-Math.floor(e.x);break;case $t:e.x=e.x<0?0:1;break;case ta:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ea:e.y=e.y-Math.floor(e.y);break;case $t:e.y=e.y<0?0:1;break;case ta:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return $n("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===dt?jn:kc}set encoding(e){$n("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===jn?dt:Wt}}Dt.DEFAULT_IMAGE=null;Dt.DEFAULT_MAPPING=Dc;Dt.DEFAULT_ANISOTROPY=1;class it{constructor(e=0,t=0,n=0,s=1){it.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const c=e.elements,l=c[0],h=c[4],d=c[8],p=c[1],m=c[5],g=c[9],v=c[2],f=c[6],u=c[10];if(Math.abs(h-p)<.01&&Math.abs(d-v)<.01&&Math.abs(g-f)<.01){if(Math.abs(h+p)<.1&&Math.abs(d+v)<.1&&Math.abs(g+f)<.1&&Math.abs(l+m+u-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const M=(l+1)/2,S=(m+1)/2,C=(u+1)/2,R=(h+p)/4,A=(d+v)/4,F=(g+f)/4;return M>S&&M>C?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=R/n,r=A/n):S>C?S<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),n=R/s,r=F/s):C<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),n=A/r,s=F/r),this.set(n,s,r,t),this}let b=Math.sqrt((f-g)*(f-g)+(d-v)*(d-v)+(p-h)*(p-h));return Math.abs(b)<.001&&(b=1),this.x=(f-g)/b,this.y=(d-v)/b,this.z=(p-h)/b,this.w=Math.acos((l+m+u-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Td extends Ui{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new it(0,0,e,t),this.scissorTest=!1,this.viewport=new it(0,0,e,t);const s={width:e,height:t,depth:1};n.encoding!==void 0&&($n("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===jn?dt:Wt),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:It,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Dt(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Xc(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Kn extends Td{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class qc extends Dt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Pt,this.minFilter=Pt,this.wrapR=$t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ad extends Dt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Pt,this.minFilter=Pt,this.wrapR=$t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ns{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],d=n[s+3];const p=r[o+0],m=r[o+1],g=r[o+2],v=r[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d;return}if(a===1){e[t+0]=p,e[t+1]=m,e[t+2]=g,e[t+3]=v;return}if(d!==v||c!==p||l!==m||h!==g){let f=1-a;const u=c*p+l*m+h*g+d*v,b=u>=0?1:-1,M=1-u*u;if(M>Number.EPSILON){const C=Math.sqrt(M),R=Math.atan2(C,u*b);f=Math.sin(f*R)/C,a=Math.sin(a*R)/C}const S=a*b;if(c=c*f+p*S,l=l*f+m*S,h=h*f+g*S,d=d*f+v*S,f===1-a){const C=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=C,l*=C,h*=C,d*=C}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,o){const a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],d=r[o],p=r[o+1],m=r[o+2],g=r[o+3];return e[t]=a*g+h*d+c*m-l*p,e[t+1]=c*g+h*p+l*d-a*m,e[t+2]=l*g+h*m+a*p-c*d,e[t+3]=h*g-a*d-c*p-l*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),d=a(r/2),p=c(n/2),m=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=p*h*d+l*m*g,this._y=l*m*d-p*h*g,this._z=l*h*g+p*m*d,this._w=l*h*d-p*m*g;break;case"YXZ":this._x=p*h*d+l*m*g,this._y=l*m*d-p*h*g,this._z=l*h*g-p*m*d,this._w=l*h*d+p*m*g;break;case"ZXY":this._x=p*h*d-l*m*g,this._y=l*m*d+p*h*g,this._z=l*h*g+p*m*d,this._w=l*h*d-p*m*g;break;case"ZYX":this._x=p*h*d-l*m*g,this._y=l*m*d+p*h*g,this._z=l*h*g-p*m*d,this._w=l*h*d+p*m*g;break;case"YZX":this._x=p*h*d+l*m*g,this._y=l*m*d+p*h*g,this._z=l*h*g-p*m*d,this._w=l*h*d-p*m*g;break;case"XZY":this._x=p*h*d-l*m*g,this._y=l*m*d-p*h*g,this._z=l*h*g+p*m*d,this._w=l*h*d+p*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],h=t[6],d=t[10],p=n+a+d;if(p>0){const m=.5/Math.sqrt(p+1);this._w=.25/m,this._x=(h-c)*m,this._y=(r-l)*m,this._z=(o-s)*m}else if(n>a&&n>d){const m=2*Math.sqrt(1+n-a-d);this._w=(h-c)/m,this._x=.25*m,this._y=(s+o)/m,this._z=(r+l)/m}else if(a>d){const m=2*Math.sqrt(1+a-n-d);this._w=(r-l)/m,this._x=(s+o)/m,this._y=.25*m,this._z=(c+h)/m}else{const m=2*Math.sqrt(1+d-n-a);this._w=(o-s)/m,this._x=(r+l)/m,this._y=(c+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ut(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const m=1-t;return this._w=m*o+t*this._w,this._x=m*n+t*this._x,this._y=m*s+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),d=Math.sin((1-t)*h)/l,p=Math.sin(t*h)/l;return this._w=o*d+this._w*p,this._x=n*d+this._x*p,this._y=s*d+this._y*p,this._z=r*d+this._z*p,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(t*Math.cos(s),n*Math.sin(r),n*Math.cos(r),t*Math.sin(s))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,n=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(xo.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(xo.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*s-a*n),h=2*(a*t-r*s),d=2*(r*n-o*t);return this.x=t+c*l+o*d-a*h,this.y=n+c*h+a*l-r*d,this.z=s+c*d+r*h-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return mr.copy(this).projectOnVector(e),this.sub(mr)}reflect(e){return this.sub(mr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ut(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const mr=new P,xo=new ns;class Jn{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(qt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(qt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=qt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,qt):qt.fromBufferAttribute(r,o),qt.applyMatrix4(e.matrixWorld),this.expandByPoint(qt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ls.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ls.copy(n.boundingBox)),ls.applyMatrix4(e.matrixWorld),this.union(ls)}const s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,qt),qt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Gi),hs.subVectors(this.max,Gi),ni.subVectors(e.a,Gi),ii.subVectors(e.b,Gi),si.subVectors(e.c,Gi),xn.subVectors(ii,ni),Mn.subVectors(si,ii),On.subVectors(ni,si);let t=[0,-xn.z,xn.y,0,-Mn.z,Mn.y,0,-On.z,On.y,xn.z,0,-xn.x,Mn.z,0,-Mn.x,On.z,0,-On.x,-xn.y,xn.x,0,-Mn.y,Mn.x,0,-On.y,On.x,0];return!gr(t,ni,ii,si,hs)||(t=[1,0,0,0,1,0,0,0,1],!gr(t,ni,ii,si,hs))?!1:(ds.crossVectors(xn,Mn),t=[ds.x,ds.y,ds.z],gr(t,ni,ii,si,hs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,qt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(qt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(an[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),an[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),an[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),an[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),an[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),an[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),an[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),an[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(an),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const an=[new P,new P,new P,new P,new P,new P,new P,new P],qt=new P,ls=new Jn,ni=new P,ii=new P,si=new P,xn=new P,Mn=new P,On=new P,Gi=new P,hs=new P,ds=new P,zn=new P;function gr(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){zn.fromArray(i,r);const a=s.x*Math.abs(zn.x)+s.y*Math.abs(zn.y)+s.z*Math.abs(zn.z),c=e.dot(zn),l=t.dot(zn),h=n.dot(zn);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const Rd=new Jn,Hi=new P,_r=new P;class Qn{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Rd.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Hi.subVectors(e,this.center);const t=Hi.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Hi,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(_r.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Hi.copy(e.center).add(_r)),this.expandByPoint(Hi.copy(e.center).sub(_r))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const on=new P,vr=new P,us=new P,yn=new P,xr=new P,fs=new P,Mr=new P;class $s{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,on)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=on.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(on.copy(this.origin).addScaledVector(this.direction,t),on.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){vr.copy(e).add(t).multiplyScalar(.5),us.copy(t).sub(e).normalize(),yn.copy(this.origin).sub(vr);const r=e.distanceTo(t)*.5,o=-this.direction.dot(us),a=yn.dot(this.direction),c=-yn.dot(us),l=yn.lengthSq(),h=Math.abs(1-o*o);let d,p,m,g;if(h>0)if(d=o*c-a,p=o*a-c,g=r*h,d>=0)if(p>=-g)if(p<=g){const v=1/h;d*=v,p*=v,m=d*(d+o*p+2*a)+p*(o*d+p+2*c)+l}else p=r,d=Math.max(0,-(o*p+a)),m=-d*d+p*(p+2*c)+l;else p=-r,d=Math.max(0,-(o*p+a)),m=-d*d+p*(p+2*c)+l;else p<=-g?(d=Math.max(0,-(-o*r+a)),p=d>0?-r:Math.min(Math.max(-r,-c),r),m=-d*d+p*(p+2*c)+l):p<=g?(d=0,p=Math.min(Math.max(-r,-c),r),m=p*(p+2*c)+l):(d=Math.max(0,-(o*r+a)),p=d>0?r:Math.min(Math.max(-r,-c),r),m=-d*d+p*(p+2*c)+l);else p=o>0?-r:r,d=Math.max(0,-(o*p+a)),m=-d*d+p*(p+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(vr).addScaledVector(us,p),m}intersectSphere(e,t){on.subVectors(e.center,this.origin);const n=on.dot(this.direction),s=on.dot(on)-n*n,r=e.radius*e.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,p=this.origin;return l>=0?(n=(e.min.x-p.x)*l,s=(e.max.x-p.x)*l):(n=(e.max.x-p.x)*l,s=(e.min.x-p.x)*l),h>=0?(r=(e.min.y-p.y)*h,o=(e.max.y-p.y)*h):(r=(e.max.y-p.y)*h,o=(e.min.y-p.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(e.min.z-p.z)*d,c=(e.max.z-p.z)*d):(a=(e.max.z-p.z)*d,c=(e.min.z-p.z)*d),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,on)!==null}intersectTriangle(e,t,n,s,r){xr.subVectors(t,e),fs.subVectors(n,e),Mr.crossVectors(xr,fs);let o=this.direction.dot(Mr),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;yn.subVectors(this.origin,e);const c=a*this.direction.dot(fs.crossVectors(yn,fs));if(c<0)return null;const l=a*this.direction.dot(xr.cross(yn));if(l<0||c+l>o)return null;const h=-a*yn.dot(Mr);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Qe{constructor(e,t,n,s,r,o,a,c,l,h,d,p,m,g,v,f){Qe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l,h,d,p,m,g,v,f)}set(e,t,n,s,r,o,a,c,l,h,d,p,m,g,v,f){const u=this.elements;return u[0]=e,u[4]=t,u[8]=n,u[12]=s,u[1]=r,u[5]=o,u[9]=a,u[13]=c,u[2]=l,u[6]=h,u[10]=d,u[14]=p,u[3]=m,u[7]=g,u[11]=v,u[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Qe().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/ri.setFromMatrixColumn(e,0).length(),r=1/ri.setFromMatrixColumn(e,1).length(),o=1/ri.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const p=o*h,m=o*d,g=a*h,v=a*d;t[0]=c*h,t[4]=-c*d,t[8]=l,t[1]=m+g*l,t[5]=p-v*l,t[9]=-a*c,t[2]=v-p*l,t[6]=g+m*l,t[10]=o*c}else if(e.order==="YXZ"){const p=c*h,m=c*d,g=l*h,v=l*d;t[0]=p+v*a,t[4]=g*a-m,t[8]=o*l,t[1]=o*d,t[5]=o*h,t[9]=-a,t[2]=m*a-g,t[6]=v+p*a,t[10]=o*c}else if(e.order==="ZXY"){const p=c*h,m=c*d,g=l*h,v=l*d;t[0]=p-v*a,t[4]=-o*d,t[8]=g+m*a,t[1]=m+g*a,t[5]=o*h,t[9]=v-p*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){const p=o*h,m=o*d,g=a*h,v=a*d;t[0]=c*h,t[4]=g*l-m,t[8]=p*l+v,t[1]=c*d,t[5]=v*l+p,t[9]=m*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){const p=o*c,m=o*l,g=a*c,v=a*l;t[0]=c*h,t[4]=v-p*d,t[8]=g*d+m,t[1]=d,t[5]=o*h,t[9]=-a*h,t[2]=-l*h,t[6]=m*d+g,t[10]=p-v*d}else if(e.order==="XZY"){const p=o*c,m=o*l,g=a*c,v=a*l;t[0]=c*h,t[4]=-d,t[8]=l*h,t[1]=p*d+v,t[5]=o*h,t[9]=m*d-g,t[2]=g*d-m,t[6]=a*h,t[10]=v*d+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Cd,e,Pd)}lookAt(e,t,n){const s=this.elements;return Ot.subVectors(e,t),Ot.lengthSq()===0&&(Ot.z=1),Ot.normalize(),Sn.crossVectors(n,Ot),Sn.lengthSq()===0&&(Math.abs(n.z)===1?Ot.x+=1e-4:Ot.z+=1e-4,Ot.normalize(),Sn.crossVectors(n,Ot)),Sn.normalize(),ps.crossVectors(Ot,Sn),s[0]=Sn.x,s[4]=ps.x,s[8]=Ot.x,s[1]=Sn.y,s[5]=ps.y,s[9]=Ot.y,s[2]=Sn.z,s[6]=ps.z,s[10]=Ot.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],d=n[5],p=n[9],m=n[13],g=n[2],v=n[6],f=n[10],u=n[14],b=n[3],M=n[7],S=n[11],C=n[15],R=s[0],A=s[4],F=s[8],X=s[12],_=s[1],w=s[5],G=s[9],j=s[13],L=s[2],U=s[6],D=s[10],W=s[14],V=s[3],q=s[7],Y=s[11],ee=s[15];return r[0]=o*R+a*_+c*L+l*V,r[4]=o*A+a*w+c*U+l*q,r[8]=o*F+a*G+c*D+l*Y,r[12]=o*X+a*j+c*W+l*ee,r[1]=h*R+d*_+p*L+m*V,r[5]=h*A+d*w+p*U+m*q,r[9]=h*F+d*G+p*D+m*Y,r[13]=h*X+d*j+p*W+m*ee,r[2]=g*R+v*_+f*L+u*V,r[6]=g*A+v*w+f*U+u*q,r[10]=g*F+v*G+f*D+u*Y,r[14]=g*X+v*j+f*W+u*ee,r[3]=b*R+M*_+S*L+C*V,r[7]=b*A+M*w+S*U+C*q,r[11]=b*F+M*G+S*D+C*Y,r[15]=b*X+M*j+S*W+C*ee,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],h=e[2],d=e[6],p=e[10],m=e[14],g=e[3],v=e[7],f=e[11],u=e[15];return g*(+r*c*d-s*l*d-r*a*p+n*l*p+s*a*m-n*c*m)+v*(+t*c*m-t*l*p+r*o*p-s*o*m+s*l*h-r*c*h)+f*(+t*l*d-t*a*m-r*o*d+n*o*m+r*a*h-n*l*h)+u*(-s*a*h-t*c*d+t*a*p+s*o*d-n*o*p+n*c*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],d=e[9],p=e[10],m=e[11],g=e[12],v=e[13],f=e[14],u=e[15],b=d*f*l-v*p*l+v*c*m-a*f*m-d*c*u+a*p*u,M=g*p*l-h*f*l-g*c*m+o*f*m+h*c*u-o*p*u,S=h*v*l-g*d*l+g*a*m-o*v*m-h*a*u+o*d*u,C=g*d*c-h*v*c-g*a*p+o*v*p+h*a*f-o*d*f,R=t*b+n*M+s*S+r*C;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/R;return e[0]=b*A,e[1]=(v*p*r-d*f*r-v*s*m+n*f*m+d*s*u-n*p*u)*A,e[2]=(a*f*r-v*c*r+v*s*l-n*f*l-a*s*u+n*c*u)*A,e[3]=(d*c*r-a*p*r-d*s*l+n*p*l+a*s*m-n*c*m)*A,e[4]=M*A,e[5]=(h*f*r-g*p*r+g*s*m-t*f*m-h*s*u+t*p*u)*A,e[6]=(g*c*r-o*f*r-g*s*l+t*f*l+o*s*u-t*c*u)*A,e[7]=(o*p*r-h*c*r+h*s*l-t*p*l-o*s*m+t*c*m)*A,e[8]=S*A,e[9]=(g*d*r-h*v*r-g*n*m+t*v*m+h*n*u-t*d*u)*A,e[10]=(o*v*r-g*a*r+g*n*l-t*v*l-o*n*u+t*a*u)*A,e[11]=(h*a*r-o*d*r-h*n*l+t*d*l+o*n*m-t*a*m)*A,e[12]=C*A,e[13]=(h*v*s-g*d*s+g*n*p-t*v*p-h*n*f+t*d*f)*A,e[14]=(g*a*s-o*v*s-g*n*c+t*v*c+o*n*f-t*a*f)*A,e[15]=(o*d*s-h*a*s+h*n*c-t*d*c-o*n*p+t*a*p)*A,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,c=e.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,h=o+o,d=a+a,p=r*l,m=r*h,g=r*d,v=o*h,f=o*d,u=a*d,b=c*l,M=c*h,S=c*d,C=n.x,R=n.y,A=n.z;return s[0]=(1-(v+u))*C,s[1]=(m+S)*C,s[2]=(g-M)*C,s[3]=0,s[4]=(m-S)*R,s[5]=(1-(p+u))*R,s[6]=(f+b)*R,s[7]=0,s[8]=(g+M)*A,s[9]=(f-b)*A,s[10]=(1-(p+v))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=ri.set(s[0],s[1],s[2]).length();const o=ri.set(s[4],s[5],s[6]).length(),a=ri.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Yt.copy(this);const l=1/r,h=1/o,d=1/a;return Yt.elements[0]*=l,Yt.elements[1]*=l,Yt.elements[2]*=l,Yt.elements[4]*=h,Yt.elements[5]*=h,Yt.elements[6]*=h,Yt.elements[8]*=d,Yt.elements[9]*=d,Yt.elements[10]*=d,t.setFromRotationMatrix(Yt),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=mn){const c=this.elements,l=2*r/(t-e),h=2*r/(n-s),d=(t+e)/(t-e),p=(n+s)/(n-s);let m,g;if(a===mn)m=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Hs)m=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=mn){const c=this.elements,l=1/(t-e),h=1/(n-s),d=1/(o-r),p=(t+e)*l,m=(n+s)*h;let g,v;if(a===mn)g=(o+r)*d,v=-2*d;else if(a===Hs)g=r*d,v=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-p,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-m,c[2]=0,c[6]=0,c[10]=v,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const ri=new P,Yt=new Qe,Cd=new P(0,0,0),Pd=new P(1,1,1),Sn=new P,ps=new P,Ot=new P,Mo=new Qe,yo=new ns;class Ks{constructor(e=0,t=0,n=0,s=Ks.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],d=s[2],p=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(Ut(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(p,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ut(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ut(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-d,m),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ut(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(p,m),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Ut(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-Ut(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(p,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Mo.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Mo,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return yo.setFromEuler(this),this.setFromQuaternion(yo,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ks.DEFAULT_ORDER="XYZ";class ma{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Ld=0;const So=new P,ai=new ns,cn=new Qe,ms=new P,Vi=new P,Dd=new P,Id=new ns,bo=new P(1,0,0),Eo=new P(0,1,0),wo=new P(0,0,1),Ud={type:"added"},Nd={type:"removed"};class lt extends Ui{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ld++}),this.uuid=Ln(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=lt.DEFAULT_UP.clone();const e=new P,t=new Ks,n=new ns,s=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Qe},normalMatrix:{value:new ze}}),this.matrix=new Qe,this.matrixWorld=new Qe,this.matrixAutoUpdate=lt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=lt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ma,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ai.setFromAxisAngle(e,t),this.quaternion.multiply(ai),this}rotateOnWorldAxis(e,t){return ai.setFromAxisAngle(e,t),this.quaternion.premultiply(ai),this}rotateX(e){return this.rotateOnAxis(bo,e)}rotateY(e){return this.rotateOnAxis(Eo,e)}rotateZ(e){return this.rotateOnAxis(wo,e)}translateOnAxis(e,t){return So.copy(e).applyQuaternion(this.quaternion),this.position.add(So.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(bo,e)}translateY(e){return this.translateOnAxis(Eo,e)}translateZ(e){return this.translateOnAxis(wo,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(cn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ms.copy(e):ms.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Vi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?cn.lookAt(Vi,ms,this.up):cn.lookAt(ms,Vi,this.up),this.quaternion.setFromRotationMatrix(cn),s&&(cn.extractRotation(s.matrixWorld),ai.setFromRotationMatrix(cn),this.quaternion.premultiply(ai.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(Ud)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Nd)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),cn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),cn.multiply(e.parent.matrixWorld)),e.applyMatrix4(cn),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Vi,e,Dd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Vi,Id,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++){const r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++){const a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const d=c[l];r(e.shapes,d)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){const a=o(e.geometries),c=o(e.materials),l=o(e.textures),h=o(e.images),d=o(e.shapes),p=o(e.skeletons),m=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),p.length>0&&(n.skeletons=p),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}lt.DEFAULT_UP=new P(0,1,0);lt.DEFAULT_MATRIX_AUTO_UPDATE=!0;lt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const jt=new P,ln=new P,yr=new P,hn=new P,oi=new P,ci=new P,To=new P,Sr=new P,br=new P,Er=new P;class Zt{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),jt.subVectors(e,t),s.cross(jt);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){jt.subVectors(s,t),ln.subVectors(n,t),yr.subVectors(e,t);const o=jt.dot(jt),a=jt.dot(ln),c=jt.dot(yr),l=ln.dot(ln),h=ln.dot(yr),d=o*l-a*a;if(d===0)return r.set(0,0,0),null;const p=1/d,m=(l*c-a*h)*p,g=(o*h-a*c)*p;return r.set(1-m-g,g,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,hn)===null?!1:hn.x>=0&&hn.y>=0&&hn.x+hn.y<=1}static getInterpolation(e,t,n,s,r,o,a,c){return this.getBarycoord(e,t,n,s,hn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,hn.x),c.addScaledVector(o,hn.y),c.addScaledVector(a,hn.z),c)}static isFrontFacing(e,t,n,s){return jt.subVectors(n,t),ln.subVectors(e,t),jt.cross(ln).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return jt.subVectors(this.c,this.b),ln.subVectors(this.a,this.b),jt.cross(ln).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Zt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Zt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return Zt.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return Zt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Zt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let o,a;oi.subVectors(s,n),ci.subVectors(r,n),Sr.subVectors(e,n);const c=oi.dot(Sr),l=ci.dot(Sr);if(c<=0&&l<=0)return t.copy(n);br.subVectors(e,s);const h=oi.dot(br),d=ci.dot(br);if(h>=0&&d<=h)return t.copy(s);const p=c*d-h*l;if(p<=0&&c>=0&&h<=0)return o=c/(c-h),t.copy(n).addScaledVector(oi,o);Er.subVectors(e,r);const m=oi.dot(Er),g=ci.dot(Er);if(g>=0&&m<=g)return t.copy(r);const v=m*l-c*g;if(v<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(n).addScaledVector(ci,a);const f=h*g-m*d;if(f<=0&&d-h>=0&&m-g>=0)return To.subVectors(r,s),a=(d-h)/(d-h+(m-g)),t.copy(s).addScaledVector(To,a);const u=1/(f+v+p);return o=v*u,a=p*u,t.copy(n).addScaledVector(oi,o).addScaledVector(ci,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Yc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},bn={h:0,s:0,l:0},gs={h:0,s:0,l:0};function wr(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Fe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=dt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,je.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=je.workingColorSpace){return this.r=e,this.g=t,this.b=n,je.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=je.workingColorSpace){if(e=yd(e,1),t=Ut(t,0,1),n=Ut(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=wr(o,r,e+1/3),this.g=wr(o,r,e),this.b=wr(o,r,e-1/3)}return je.toWorkingColorSpace(this,s),this}setStyle(e,t=dt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=dt){const n=Yc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=wi(e.r),this.g=wi(e.g),this.b=wi(e.b),this}copyLinearToSRGB(e){return this.r=fr(e.r),this.g=fr(e.g),this.b=fr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=dt){return je.fromWorkingColorSpace(Tt.copy(this),e),Math.round(Ut(Tt.r*255,0,255))*65536+Math.round(Ut(Tt.g*255,0,255))*256+Math.round(Ut(Tt.b*255,0,255))}getHexString(e=dt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=je.workingColorSpace){je.fromWorkingColorSpace(Tt.copy(this),t);const n=Tt.r,s=Tt.g,r=Tt.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const d=o-a;switch(l=h<=.5?d/(o+a):d/(2-o-a),o){case n:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-n)/d+2;break;case r:c=(n-s)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=je.workingColorSpace){return je.fromWorkingColorSpace(Tt.copy(this),t),e.r=Tt.r,e.g=Tt.g,e.b=Tt.b,e}getStyle(e=dt){je.fromWorkingColorSpace(Tt.copy(this),e);const t=Tt.r,n=Tt.g,s=Tt.b;return e!==dt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(bn),this.setHSL(bn.h+e,bn.s+t,bn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(bn),e.getHSL(gs);const n=dr(bn.h,gs.h,t),s=dr(bn.s,gs.s,t),r=dr(bn.l,gs.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Tt=new Fe;Fe.NAMES=Yc;let Fd=0;class Un extends Ui{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Fd++}),this.uuid=Ln(),this.name="",this.type="Material",this.blending=Ei,this.side=Dn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Kr,this.blendDst=Zr,this.blendEquation=Hn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Fe(0,0,0),this.blendAlpha=0,this.depthFunc=zs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=fo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ei,this.stencilZFail=ei,this.stencilZPass=ei,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ei&&(n.blending=this.blending),this.side!==Dn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Kr&&(n.blendSrc=this.blendSrc),this.blendDst!==Zr&&(n.blendDst=this.blendDst),this.blendEquation!==Hn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==zs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==fo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ei&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ei&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ei&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(t){const r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class gn extends Un{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Fe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Pc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ht=new P,_s=new Se;class bt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=na,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=pn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return $n("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)_s.fromBufferAttribute(this,t),_s.applyMatrix3(e),this.setXY(t,_s.x,_s.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)ht.fromBufferAttribute(this,t),ht.applyMatrix3(e),this.setXYZ(t,ht.x,ht.y,ht.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)ht.fromBufferAttribute(this,t),ht.applyMatrix4(e),this.setXYZ(t,ht.x,ht.y,ht.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)ht.fromBufferAttribute(this,t),ht.applyNormalMatrix(e),this.setXYZ(t,ht.x,ht.y,ht.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)ht.fromBufferAttribute(this,t),ht.transformDirection(e),this.setXYZ(t,ht.x,ht.y,ht.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=nn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ye(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=nn(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ye(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=nn(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ye(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=nn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ye(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=nn(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ye(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Ye(t,this.array),n=Ye(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Ye(t,this.array),n=Ye(n,this.array),s=Ye(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Ye(t,this.array),n=Ye(n,this.array),s=Ye(s,this.array),r=Ye(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==na&&(e.usage=this.usage),e}}class jc extends bt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class $c extends bt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class et extends bt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Od=0;const Ht=new Qe,Tr=new lt,li=new P,zt=new Jn,Wi=new Jn,gt=new P;class ut extends Ui{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Od++}),this.uuid=Ln(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Vc(e)?$c:jc)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new ze().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Ht.makeRotationFromQuaternion(e),this.applyMatrix4(Ht),this}rotateX(e){return Ht.makeRotationX(e),this.applyMatrix4(Ht),this}rotateY(e){return Ht.makeRotationY(e),this.applyMatrix4(Ht),this}rotateZ(e){return Ht.makeRotationZ(e),this.applyMatrix4(Ht),this}translate(e,t,n){return Ht.makeTranslation(e,t,n),this.applyMatrix4(Ht),this}scale(e,t,n){return Ht.makeScale(e,t,n),this.applyMatrix4(Ht),this}lookAt(e){return Tr.lookAt(e),Tr.updateMatrix(),this.applyMatrix4(Tr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(li).negate(),this.translate(li.x,li.y,li.z),this}setFromPoints(e){const t=[];for(let n=0,s=e.length;n<s;n++){const r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new et(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Jn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];zt.setFromBufferAttribute(r),this.morphTargetsRelative?(gt.addVectors(this.boundingBox.min,zt.min),this.boundingBox.expandByPoint(gt),gt.addVectors(this.boundingBox.max,zt.max),this.boundingBox.expandByPoint(gt)):(this.boundingBox.expandByPoint(zt.min),this.boundingBox.expandByPoint(zt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Qn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new P,1/0);return}if(e){const n=this.boundingSphere.center;if(zt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];Wi.setFromBufferAttribute(a),this.morphTargetsRelative?(gt.addVectors(zt.min,Wi.min),zt.expandByPoint(gt),gt.addVectors(zt.max,Wi.max),zt.expandByPoint(gt)):(zt.expandByPoint(Wi.min),zt.expandByPoint(Wi.max))}zt.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)gt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(gt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)gt.fromBufferAttribute(a,l),c&&(li.fromBufferAttribute(e,l),gt.add(li)),s=Math.max(s,n.distanceToSquared(gt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.array,s=t.position.array,r=t.normal.array,o=t.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new bt(new Float32Array(4*a),4));const c=this.getAttribute("tangent").array,l=[],h=[];for(let _=0;_<a;_++)l[_]=new P,h[_]=new P;const d=new P,p=new P,m=new P,g=new Se,v=new Se,f=new Se,u=new P,b=new P;function M(_,w,G){d.fromArray(s,_*3),p.fromArray(s,w*3),m.fromArray(s,G*3),g.fromArray(o,_*2),v.fromArray(o,w*2),f.fromArray(o,G*2),p.sub(d),m.sub(d),v.sub(g),f.sub(g);const j=1/(v.x*f.y-f.x*v.y);isFinite(j)&&(u.copy(p).multiplyScalar(f.y).addScaledVector(m,-v.y).multiplyScalar(j),b.copy(m).multiplyScalar(v.x).addScaledVector(p,-f.x).multiplyScalar(j),l[_].add(u),l[w].add(u),l[G].add(u),h[_].add(b),h[w].add(b),h[G].add(b))}let S=this.groups;S.length===0&&(S=[{start:0,count:n.length}]);for(let _=0,w=S.length;_<w;++_){const G=S[_],j=G.start,L=G.count;for(let U=j,D=j+L;U<D;U+=3)M(n[U+0],n[U+1],n[U+2])}const C=new P,R=new P,A=new P,F=new P;function X(_){A.fromArray(r,_*3),F.copy(A);const w=l[_];C.copy(w),C.sub(A.multiplyScalar(A.dot(w))).normalize(),R.crossVectors(F,w);const j=R.dot(h[_])<0?-1:1;c[_*4]=C.x,c[_*4+1]=C.y,c[_*4+2]=C.z,c[_*4+3]=j}for(let _=0,w=S.length;_<w;++_){const G=S[_],j=G.start,L=G.count;for(let U=j,D=j+L;U<D;U+=3)X(n[U+0]),X(n[U+1]),X(n[U+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new bt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let p=0,m=n.count;p<m;p++)n.setXYZ(p,0,0,0);const s=new P,r=new P,o=new P,a=new P,c=new P,l=new P,h=new P,d=new P;if(e)for(let p=0,m=e.count;p<m;p+=3){const g=e.getX(p+0),v=e.getX(p+1),f=e.getX(p+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,v),o.fromBufferAttribute(t,f),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,f),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(f,l.x,l.y,l.z)}else for(let p=0,m=t.count;p<m;p+=3)s.fromBufferAttribute(t,p+0),r.fromBufferAttribute(t,p+1),o.fromBufferAttribute(t,p+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),n.setXYZ(p+0,h.x,h.y,h.z),n.setXYZ(p+1,h.x,h.y,h.z),n.setXYZ(p+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)gt.fromBufferAttribute(e,t),gt.normalize(),e.setXYZ(t,gt.x,gt.y,gt.z)}toNonIndexed(){function e(a,c){const l=a.array,h=a.itemSize,d=a.normalized,p=new l.constructor(c.length*h);let m=0,g=0;for(let v=0,f=c.length;v<f;v++){a.isInterleavedBufferAttribute?m=c[v]*a.data.stride+a.offset:m=c[v]*h;for(let u=0;u<h;u++)p[g++]=l[m++]}return new bt(p,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new ut,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=e(c,n);t.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let h=0,d=l.length;h<d;h++){const p=l[h],m=e(p,n);c.push(m)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let d=0,p=l.length;d<p;d++){const m=l[d];h.push(m.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const s=e.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(t))}const r=e.morphAttributes;for(const l in r){const h=[],d=r[l];for(let p=0,m=d.length;p<m;p++)h.push(d[p].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let l=0,h=o.length;l<h;l++){const d=o[l];this.addGroup(d.start,d.count,d.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ao=new Qe,Bn=new $s,vs=new Qn,Ro=new P,hi=new P,di=new P,ui=new P,Ar=new P,xs=new P,Ms=new Se,ys=new Se,Ss=new Se,Co=new P,Po=new P,Lo=new P,bs=new P,Es=new P;class fe extends lt{constructor(e=new ut,t=new gn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const a=this.morphTargetInfluences;if(r&&a){xs.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=a[c],d=r[c];h!==0&&(Ar.fromBufferAttribute(d,e),o?xs.addScaledVector(Ar,h):xs.addScaledVector(Ar.sub(t),h))}t.add(xs)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),vs.copy(n.boundingSphere),vs.applyMatrix4(r),Bn.copy(e.ray).recast(e.near),!(vs.containsPoint(Bn.origin)===!1&&(Bn.intersectSphere(vs,Ro)===null||Bn.origin.distanceToSquared(Ro)>(e.far-e.near)**2))&&(Ao.copy(r).invert(),Bn.copy(e.ray).applyMatrix4(Ao),!(n.boundingBox!==null&&Bn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Bn)))}_computeIntersections(e,t,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,p=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=p.length;g<v;g++){const f=p[g],u=o[f.materialIndex],b=Math.max(f.start,m.start),M=Math.min(a.count,Math.min(f.start+f.count,m.start+m.count));for(let S=b,C=M;S<C;S+=3){const R=a.getX(S),A=a.getX(S+1),F=a.getX(S+2);s=ws(this,u,e,n,l,h,d,R,A,F),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),v=Math.min(a.count,m.start+m.count);for(let f=g,u=v;f<u;f+=3){const b=a.getX(f),M=a.getX(f+1),S=a.getX(f+2);s=ws(this,o,e,n,l,h,d,b,M,S),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,v=p.length;g<v;g++){const f=p[g],u=o[f.materialIndex],b=Math.max(f.start,m.start),M=Math.min(c.count,Math.min(f.start+f.count,m.start+m.count));for(let S=b,C=M;S<C;S+=3){const R=S,A=S+1,F=S+2;s=ws(this,u,e,n,l,h,d,R,A,F),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),v=Math.min(c.count,m.start+m.count);for(let f=g,u=v;f<u;f+=3){const b=f,M=f+1,S=f+2;s=ws(this,o,e,n,l,h,d,b,M,S),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}}}function zd(i,e,t,n,s,r,o,a){let c;if(e.side===Nt?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,e.side===Dn,a),c===null)return null;Es.copy(a),Es.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(Es);return l<t.near||l>t.far?null:{distance:l,point:Es.clone(),object:i}}function ws(i,e,t,n,s,r,o,a,c,l){i.getVertexPosition(a,hi),i.getVertexPosition(c,di),i.getVertexPosition(l,ui);const h=zd(i,e,t,n,hi,di,ui,bs);if(h){s&&(Ms.fromBufferAttribute(s,a),ys.fromBufferAttribute(s,c),Ss.fromBufferAttribute(s,l),h.uv=Zt.getInterpolation(bs,hi,di,ui,Ms,ys,Ss,new Se)),r&&(Ms.fromBufferAttribute(r,a),ys.fromBufferAttribute(r,c),Ss.fromBufferAttribute(r,l),h.uv1=Zt.getInterpolation(bs,hi,di,ui,Ms,ys,Ss,new Se),h.uv2=h.uv1),o&&(Co.fromBufferAttribute(o,a),Po.fromBufferAttribute(o,c),Lo.fromBufferAttribute(o,l),h.normal=Zt.getInterpolation(bs,hi,di,ui,Co,Po,Lo,new P),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:c,c:l,normal:new P,materialIndex:0};Zt.getNormal(hi,di,ui,d.normal),h.face=d}return h}class Vt extends ut{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],h=[],d=[];let p=0,m=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new et(l,3)),this.setAttribute("normal",new et(h,3)),this.setAttribute("uv",new et(d,2));function g(v,f,u,b,M,S,C,R,A,F,X){const _=S/A,w=C/F,G=S/2,j=C/2,L=R/2,U=A+1,D=F+1;let W=0,V=0;const q=new P;for(let Y=0;Y<D;Y++){const ee=Y*w-j;for(let se=0;se<U;se++){const we=se*_-G;q[v]=we*b,q[f]=ee*M,q[u]=L,l.push(q.x,q.y,q.z),q[v]=0,q[f]=0,q[u]=R>0?1:-1,h.push(q.x,q.y,q.z),d.push(se/A),d.push(1-Y/F),W+=1}}for(let Y=0;Y<F;Y++)for(let ee=0;ee<A;ee++){const se=p+ee+U*Y,we=p+ee+U*(Y+1),H=p+(ee+1)+U*(Y+1),Z=p+(ee+1)+U*Y;c.push(se,we,Z),c.push(we,H,Z),V+=6}a.addGroup(m,V,X),m+=V,p+=W}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Di(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Ct(i){const e={};for(let t=0;t<i.length;t++){const n=Di(i[t]);for(const s in n)e[s]=n[s]}return e}function Bd(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Kc(i){return i.getRenderTarget()===null?i.outputColorSpace:je.workingColorSpace}const kd={clone:Di,merge:Ct};var Gd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Hd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class In extends Un{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Gd,this.fragmentShader=Hd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Di(e.uniforms),this.uniformsGroups=Bd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Zc extends lt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Qe,this.projectionMatrix=new Qe,this.projectionMatrixInverse=new Qe,this.coordinateSystem=mn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const En=new P,Do=new Se,Io=new Se;class Bt extends Zc{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=sa*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(hr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return sa*2*Math.atan(Math.tan(hr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){En.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(En.x,En.y).multiplyScalar(-e/En.z),En.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(En.x,En.y).multiplyScalar(-e/En.z)}getViewSize(e,t){return this.getViewBounds(e,Do,Io),t.subVectors(Io,Do)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(hr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const fi=-90,pi=1;class Vd extends lt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Bt(fi,pi,e,t);s.layers=this.layers,this.add(s);const r=new Bt(fi,pi,e,t);r.layers=this.layers,this.add(r);const o=new Bt(fi,pi,e,t);o.layers=this.layers,this.add(o);const a=new Bt(fi,pi,e,t);a.layers=this.layers,this.add(a);const c=new Bt(fi,pi,e,t);c.layers=this.layers,this.add(c);const l=new Bt(fi,pi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,c]=t;for(const l of t)this.remove(l);if(e===mn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Hs)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,h]=this.children,d=e.getRenderTarget(),p=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(d,p,m),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Jc extends Dt{constructor(e,t,n,s,r,o,a,c,l,h){e=e!==void 0?e:[],t=t!==void 0?t:Ci,super(e,t,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Wd extends Kn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];t.encoding!==void 0&&($n("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===jn?dt:Wt),this.texture=new Jc(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:It}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Vt(5,5,5),r=new In({name:"CubemapFromEquirect",uniforms:Di(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Nt,blending:Rn});r.uniforms.tEquirect.value=t;const o=new fe(s,r),a=t.minFilter;return t.minFilter===Wn&&(t.minFilter=It),new Vd(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,s){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}}const Rr=new P,Xd=new P,qd=new ze;class wn{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Rr.subVectors(n,t).cross(Xd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Rr),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||qd.getNormalMatrix(e),s=this.coplanarPoint(Rr).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const kn=new Qn,Ts=new P;class ga{constructor(e=new wn,t=new wn,n=new wn,s=new wn,r=new wn,o=new wn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=mn){const n=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],c=s[3],l=s[4],h=s[5],d=s[6],p=s[7],m=s[8],g=s[9],v=s[10],f=s[11],u=s[12],b=s[13],M=s[14],S=s[15];if(n[0].setComponents(c-r,p-l,f-m,S-u).normalize(),n[1].setComponents(c+r,p+l,f+m,S+u).normalize(),n[2].setComponents(c+o,p+h,f+g,S+b).normalize(),n[3].setComponents(c-o,p-h,f-g,S-b).normalize(),n[4].setComponents(c-a,p-d,f-v,S-M).normalize(),t===mn)n[5].setComponents(c+a,p+d,f+v,S+M).normalize();else if(t===Hs)n[5].setComponents(a,d,v,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),kn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),kn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(kn)}intersectsSprite(e){return kn.center.set(0,0,0),kn.radius=.7071067811865476,kn.applyMatrix4(e.matrixWorld),this.intersectsSphere(kn)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(Ts.x=s.normal.x>0?e.max.x:e.min.x,Ts.y=s.normal.y>0?e.max.y:e.min.y,Ts.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Ts)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Qc(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Yd(i,e){const t=e.isWebGL2,n=new WeakMap;function s(l,h){const d=l.array,p=l.usage,m=d.byteLength,g=i.createBuffer();i.bindBuffer(h,g),i.bufferData(h,d,p),l.onUploadCallback();let v;if(d instanceof Float32Array)v=i.FLOAT;else if(d instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(t)v=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else v=i.UNSIGNED_SHORT;else if(d instanceof Int16Array)v=i.SHORT;else if(d instanceof Uint32Array)v=i.UNSIGNED_INT;else if(d instanceof Int32Array)v=i.INT;else if(d instanceof Int8Array)v=i.BYTE;else if(d instanceof Uint8Array)v=i.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)v=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:g,type:v,bytesPerElement:d.BYTES_PER_ELEMENT,version:l.version,size:m}}function r(l,h,d){const p=h.array,m=h._updateRange,g=h.updateRanges;if(i.bindBuffer(d,l),m.count===-1&&g.length===0&&i.bufferSubData(d,0,p),g.length!==0){for(let v=0,f=g.length;v<f;v++){const u=g[v];t?i.bufferSubData(d,u.start*p.BYTES_PER_ELEMENT,p,u.start,u.count):i.bufferSubData(d,u.start*p.BYTES_PER_ELEMENT,p.subarray(u.start,u.start+u.count))}h.clearUpdateRanges()}m.count!==-1&&(t?i.bufferSubData(d,m.offset*p.BYTES_PER_ELEMENT,p,m.offset,m.count):i.bufferSubData(d,m.offset*p.BYTES_PER_ELEMENT,p.subarray(m.offset,m.offset+m.count)),m.count=-1),h.onUploadCallback()}function o(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function a(l){l.isInterleavedBufferAttribute&&(l=l.data);const h=n.get(l);h&&(i.deleteBuffer(h.buffer),n.delete(l))}function c(l,h){if(l.isGLBufferAttribute){const p=n.get(l);(!p||p.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);const d=n.get(l);if(d===void 0)n.set(l,s(l,h));else if(d.version<l.version){if(d.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(d.buffer,l,h),d.version=l.version}}return{get:o,remove:a,update:c}}class is extends ut{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,o=t/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,d=e/a,p=t/c,m=[],g=[],v=[],f=[];for(let u=0;u<h;u++){const b=u*p-o;for(let M=0;M<l;M++){const S=M*d-r;g.push(S,-b,0),v.push(0,0,1),f.push(M/a),f.push(1-u/c)}}for(let u=0;u<c;u++)for(let b=0;b<a;b++){const M=b+l*u,S=b+l*(u+1),C=b+1+l*(u+1),R=b+1+l*u;m.push(M,S,R),m.push(S,C,R)}this.setIndex(m),this.setAttribute("position",new et(g,3)),this.setAttribute("normal",new et(v,3)),this.setAttribute("uv",new et(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new is(e.width,e.height,e.widthSegments,e.heightSegments)}}var jd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,$d=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Kd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Zd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Jd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Qd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,eu=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,tu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,nu=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,iu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,su=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ru=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,au=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ou=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,cu=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,lu=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,hu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,du=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,uu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,fu=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,pu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,mu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,gu=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,_u=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,vu=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,xu=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Mu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,yu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Su=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,bu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Eu="gl_FragColor = linearToOutputTexel( gl_FragColor );",wu=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,Tu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Au=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ru=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Cu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Pu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Lu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Du=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Iu=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Uu=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Nu=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Fu=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Ou=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,zu=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Bu=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ku=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Gu=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Hu=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Vu=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Wu=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Xu=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,qu=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Yu=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,ju=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,$u=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Ku=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Zu=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ju=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Qu=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,ef=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,tf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,nf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,sf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,rf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,af=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,of=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,cf=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,lf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,hf=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,df=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,uf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,ff=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,pf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,mf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,gf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,_f=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,vf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,xf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Mf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,yf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Sf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,bf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Ef=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,wf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Tf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Af=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Rf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Cf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Pf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,Lf=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Df=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,If=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Uf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Nf=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Ff=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Of=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,zf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Bf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,kf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Gf=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Hf=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Vf=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Wf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Xf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,qf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Yf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const jf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,$f=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zf=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Jf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Qf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ep=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,tp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,np=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,ip=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,sp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,rp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ap=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,op=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,cp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,lp=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,dp=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,up=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,fp=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pp=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,mp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,gp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_p=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vp=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,xp=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Mp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,yp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sp=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,bp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ep=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,wp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Tp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ap=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ie={alphahash_fragment:jd,alphahash_pars_fragment:$d,alphamap_fragment:Kd,alphamap_pars_fragment:Zd,alphatest_fragment:Jd,alphatest_pars_fragment:Qd,aomap_fragment:eu,aomap_pars_fragment:tu,batching_pars_vertex:nu,batching_vertex:iu,begin_vertex:su,beginnormal_vertex:ru,bsdfs:au,iridescence_fragment:ou,bumpmap_pars_fragment:cu,clipping_planes_fragment:lu,clipping_planes_pars_fragment:hu,clipping_planes_pars_vertex:du,clipping_planes_vertex:uu,color_fragment:fu,color_pars_fragment:pu,color_pars_vertex:mu,color_vertex:gu,common:_u,cube_uv_reflection_fragment:vu,defaultnormal_vertex:xu,displacementmap_pars_vertex:Mu,displacementmap_vertex:yu,emissivemap_fragment:Su,emissivemap_pars_fragment:bu,colorspace_fragment:Eu,colorspace_pars_fragment:wu,envmap_fragment:Tu,envmap_common_pars_fragment:Au,envmap_pars_fragment:Ru,envmap_pars_vertex:Cu,envmap_physical_pars_fragment:Gu,envmap_vertex:Pu,fog_vertex:Lu,fog_pars_vertex:Du,fog_fragment:Iu,fog_pars_fragment:Uu,gradientmap_pars_fragment:Nu,lightmap_fragment:Fu,lightmap_pars_fragment:Ou,lights_lambert_fragment:zu,lights_lambert_pars_fragment:Bu,lights_pars_begin:ku,lights_toon_fragment:Hu,lights_toon_pars_fragment:Vu,lights_phong_fragment:Wu,lights_phong_pars_fragment:Xu,lights_physical_fragment:qu,lights_physical_pars_fragment:Yu,lights_fragment_begin:ju,lights_fragment_maps:$u,lights_fragment_end:Ku,logdepthbuf_fragment:Zu,logdepthbuf_pars_fragment:Ju,logdepthbuf_pars_vertex:Qu,logdepthbuf_vertex:ef,map_fragment:tf,map_pars_fragment:nf,map_particle_fragment:sf,map_particle_pars_fragment:rf,metalnessmap_fragment:af,metalnessmap_pars_fragment:of,morphcolor_vertex:cf,morphnormal_vertex:lf,morphtarget_pars_vertex:hf,morphtarget_vertex:df,normal_fragment_begin:uf,normal_fragment_maps:ff,normal_pars_fragment:pf,normal_pars_vertex:mf,normal_vertex:gf,normalmap_pars_fragment:_f,clearcoat_normal_fragment_begin:vf,clearcoat_normal_fragment_maps:xf,clearcoat_pars_fragment:Mf,iridescence_pars_fragment:yf,opaque_fragment:Sf,packing:bf,premultiplied_alpha_fragment:Ef,project_vertex:wf,dithering_fragment:Tf,dithering_pars_fragment:Af,roughnessmap_fragment:Rf,roughnessmap_pars_fragment:Cf,shadowmap_pars_fragment:Pf,shadowmap_pars_vertex:Lf,shadowmap_vertex:Df,shadowmask_pars_fragment:If,skinbase_vertex:Uf,skinning_pars_vertex:Nf,skinning_vertex:Ff,skinnormal_vertex:Of,specularmap_fragment:zf,specularmap_pars_fragment:Bf,tonemapping_fragment:kf,tonemapping_pars_fragment:Gf,transmission_fragment:Hf,transmission_pars_fragment:Vf,uv_pars_fragment:Wf,uv_pars_vertex:Xf,uv_vertex:qf,worldpos_vertex:Yf,background_vert:jf,background_frag:$f,backgroundCube_vert:Kf,backgroundCube_frag:Zf,cube_vert:Jf,cube_frag:Qf,depth_vert:ep,depth_frag:tp,distanceRGBA_vert:np,distanceRGBA_frag:ip,equirect_vert:sp,equirect_frag:rp,linedashed_vert:ap,linedashed_frag:op,meshbasic_vert:cp,meshbasic_frag:lp,meshlambert_vert:hp,meshlambert_frag:dp,meshmatcap_vert:up,meshmatcap_frag:fp,meshnormal_vert:pp,meshnormal_frag:mp,meshphong_vert:gp,meshphong_frag:_p,meshphysical_vert:vp,meshphysical_frag:xp,meshtoon_vert:Mp,meshtoon_frag:yp,points_vert:Sp,points_frag:bp,shadow_vert:Ep,shadow_frag:wp,sprite_vert:Tp,sprite_frag:Ap},ie={common:{diffuse:{value:new Fe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ze}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ze},normalScale:{value:new Se(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Fe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Fe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0},uvTransform:{value:new ze}},sprite:{diffuse:{value:new Fe(16777215)},opacity:{value:1},center:{value:new Se(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}}},tn={basic:{uniforms:Ct([ie.common,ie.specularmap,ie.envmap,ie.aomap,ie.lightmap,ie.fog]),vertexShader:Ie.meshbasic_vert,fragmentShader:Ie.meshbasic_frag},lambert:{uniforms:Ct([ie.common,ie.specularmap,ie.envmap,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.fog,ie.lights,{emissive:{value:new Fe(0)}}]),vertexShader:Ie.meshlambert_vert,fragmentShader:Ie.meshlambert_frag},phong:{uniforms:Ct([ie.common,ie.specularmap,ie.envmap,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.fog,ie.lights,{emissive:{value:new Fe(0)},specular:{value:new Fe(1118481)},shininess:{value:30}}]),vertexShader:Ie.meshphong_vert,fragmentShader:Ie.meshphong_frag},standard:{uniforms:Ct([ie.common,ie.envmap,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.roughnessmap,ie.metalnessmap,ie.fog,ie.lights,{emissive:{value:new Fe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ie.meshphysical_vert,fragmentShader:Ie.meshphysical_frag},toon:{uniforms:Ct([ie.common,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.gradientmap,ie.fog,ie.lights,{emissive:{value:new Fe(0)}}]),vertexShader:Ie.meshtoon_vert,fragmentShader:Ie.meshtoon_frag},matcap:{uniforms:Ct([ie.common,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.fog,{matcap:{value:null}}]),vertexShader:Ie.meshmatcap_vert,fragmentShader:Ie.meshmatcap_frag},points:{uniforms:Ct([ie.points,ie.fog]),vertexShader:Ie.points_vert,fragmentShader:Ie.points_frag},dashed:{uniforms:Ct([ie.common,ie.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ie.linedashed_vert,fragmentShader:Ie.linedashed_frag},depth:{uniforms:Ct([ie.common,ie.displacementmap]),vertexShader:Ie.depth_vert,fragmentShader:Ie.depth_frag},normal:{uniforms:Ct([ie.common,ie.bumpmap,ie.normalmap,ie.displacementmap,{opacity:{value:1}}]),vertexShader:Ie.meshnormal_vert,fragmentShader:Ie.meshnormal_frag},sprite:{uniforms:Ct([ie.sprite,ie.fog]),vertexShader:Ie.sprite_vert,fragmentShader:Ie.sprite_frag},background:{uniforms:{uvTransform:{value:new ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ie.background_vert,fragmentShader:Ie.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Ie.backgroundCube_vert,fragmentShader:Ie.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ie.cube_vert,fragmentShader:Ie.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ie.equirect_vert,fragmentShader:Ie.equirect_frag},distanceRGBA:{uniforms:Ct([ie.common,ie.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ie.distanceRGBA_vert,fragmentShader:Ie.distanceRGBA_frag},shadow:{uniforms:Ct([ie.lights,ie.fog,{color:{value:new Fe(0)},opacity:{value:1}}]),vertexShader:Ie.shadow_vert,fragmentShader:Ie.shadow_frag}};tn.physical={uniforms:Ct([tn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ze},clearcoatNormalScale:{value:new Se(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ze},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ze},sheen:{value:0},sheenColor:{value:new Fe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ze},transmissionSamplerSize:{value:new Se},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ze},attenuationDistance:{value:0},attenuationColor:{value:new Fe(0)},specularColor:{value:new Fe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ze},anisotropyVector:{value:new Se},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ze}}]),vertexShader:Ie.meshphysical_vert,fragmentShader:Ie.meshphysical_frag};const As={r:0,b:0,g:0};function Rp(i,e,t,n,s,r,o){const a=new Fe(0);let c=r===!0?0:1,l,h,d=null,p=0,m=null;function g(f,u){let b=!1,M=u.isScene===!0?u.background:null;M&&M.isTexture&&(M=(u.backgroundBlurriness>0?t:e).get(M)),M===null?v(a,c):M&&M.isColor&&(v(M,1),b=!0);const S=i.xr.getEnvironmentBlendMode();S==="additive"?n.buffers.color.setClear(0,0,0,1,o):S==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||b)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),M&&(M.isCubeTexture||M.mapping===Ys)?(h===void 0&&(h=new fe(new Vt(1,1,1),new In({name:"BackgroundCubeMaterial",uniforms:Di(tn.backgroundCube.uniforms),vertexShader:tn.backgroundCube.vertexShader,fragmentShader:tn.backgroundCube.fragmentShader,side:Nt,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(C,R,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=M,h.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=u.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,h.material.toneMapped=je.getTransfer(M.colorSpace)!==nt,(d!==M||p!==M.version||m!==i.toneMapping)&&(h.material.needsUpdate=!0,d=M,p=M.version,m=i.toneMapping),h.layers.enableAll(),f.unshift(h,h.geometry,h.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new fe(new is(2,2),new In({name:"BackgroundMaterial",uniforms:Di(tn.background.uniforms),vertexShader:tn.background.vertexShader,fragmentShader:tn.background.fragmentShader,side:Dn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,l.material.toneMapped=je.getTransfer(M.colorSpace)!==nt,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(d!==M||p!==M.version||m!==i.toneMapping)&&(l.material.needsUpdate=!0,d=M,p=M.version,m=i.toneMapping),l.layers.enableAll(),f.unshift(l,l.geometry,l.material,0,0,null))}function v(f,u){f.getRGB(As,Kc(i)),n.buffers.color.setClear(As.r,As.g,As.b,u,o)}return{getClearColor:function(){return a},setClearColor:function(f,u=1){a.set(f),c=u,v(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(f){c=f,v(a,c)},render:g}}function Cp(i,e,t,n){const s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:e.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},c=f(null);let l=c,h=!1;function d(L,U,D,W,V){let q=!1;if(o){const Y=v(W,D,U);l!==Y&&(l=Y,m(l.object)),q=u(L,W,D,V),q&&b(L,W,D,V)}else{const Y=U.wireframe===!0;(l.geometry!==W.id||l.program!==D.id||l.wireframe!==Y)&&(l.geometry=W.id,l.program=D.id,l.wireframe=Y,q=!0)}V!==null&&t.update(V,i.ELEMENT_ARRAY_BUFFER),(q||h)&&(h=!1,F(L,U,D,W),V!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(V).buffer))}function p(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function m(L){return n.isWebGL2?i.bindVertexArray(L):r.bindVertexArrayOES(L)}function g(L){return n.isWebGL2?i.deleteVertexArray(L):r.deleteVertexArrayOES(L)}function v(L,U,D){const W=D.wireframe===!0;let V=a[L.id];V===void 0&&(V={},a[L.id]=V);let q=V[U.id];q===void 0&&(q={},V[U.id]=q);let Y=q[W];return Y===void 0&&(Y=f(p()),q[W]=Y),Y}function f(L){const U=[],D=[],W=[];for(let V=0;V<s;V++)U[V]=0,D[V]=0,W[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:D,attributeDivisors:W,object:L,attributes:{},index:null}}function u(L,U,D,W){const V=l.attributes,q=U.attributes;let Y=0;const ee=D.getAttributes();for(const se in ee)if(ee[se].location>=0){const H=V[se];let Z=q[se];if(Z===void 0&&(se==="instanceMatrix"&&L.instanceMatrix&&(Z=L.instanceMatrix),se==="instanceColor"&&L.instanceColor&&(Z=L.instanceColor)),H===void 0||H.attribute!==Z||Z&&H.data!==Z.data)return!0;Y++}return l.attributesNum!==Y||l.index!==W}function b(L,U,D,W){const V={},q=U.attributes;let Y=0;const ee=D.getAttributes();for(const se in ee)if(ee[se].location>=0){let H=q[se];H===void 0&&(se==="instanceMatrix"&&L.instanceMatrix&&(H=L.instanceMatrix),se==="instanceColor"&&L.instanceColor&&(H=L.instanceColor));const Z={};Z.attribute=H,H&&H.data&&(Z.data=H.data),V[se]=Z,Y++}l.attributes=V,l.attributesNum=Y,l.index=W}function M(){const L=l.newAttributes;for(let U=0,D=L.length;U<D;U++)L[U]=0}function S(L){C(L,0)}function C(L,U){const D=l.newAttributes,W=l.enabledAttributes,V=l.attributeDivisors;D[L]=1,W[L]===0&&(i.enableVertexAttribArray(L),W[L]=1),V[L]!==U&&((n.isWebGL2?i:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](L,U),V[L]=U)}function R(){const L=l.newAttributes,U=l.enabledAttributes;for(let D=0,W=U.length;D<W;D++)U[D]!==L[D]&&(i.disableVertexAttribArray(D),U[D]=0)}function A(L,U,D,W,V,q,Y){Y===!0?i.vertexAttribIPointer(L,U,D,V,q):i.vertexAttribPointer(L,U,D,W,V,q)}function F(L,U,D,W){if(n.isWebGL2===!1&&(L.isInstancedMesh||W.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;M();const V=W.attributes,q=D.getAttributes(),Y=U.defaultAttributeValues;for(const ee in q){const se=q[ee];if(se.location>=0){let we=V[ee];if(we===void 0&&(ee==="instanceMatrix"&&L.instanceMatrix&&(we=L.instanceMatrix),ee==="instanceColor"&&L.instanceColor&&(we=L.instanceColor)),we!==void 0){const H=we.normalized,Z=we.itemSize,oe=t.get(we);if(oe===void 0)continue;const xe=oe.buffer,Me=oe.type,de=oe.bytesPerElement,Ve=n.isWebGL2===!0&&(Me===i.INT||Me===i.UNSIGNED_INT||we.gpuType===Ic);if(we.isInterleavedBufferAttribute){const Ce=we.data,N=Ce.stride,Mt=we.offset;if(Ce.isInstancedInterleavedBuffer){for(let _e=0;_e<se.locationSize;_e++)C(se.location+_e,Ce.meshPerAttribute);L.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=Ce.meshPerAttribute*Ce.count)}else for(let _e=0;_e<se.locationSize;_e++)S(se.location+_e);i.bindBuffer(i.ARRAY_BUFFER,xe);for(let _e=0;_e<se.locationSize;_e++)A(se.location+_e,Z/se.locationSize,Me,H,N*de,(Mt+Z/se.locationSize*_e)*de,Ve)}else{if(we.isInstancedBufferAttribute){for(let Ce=0;Ce<se.locationSize;Ce++)C(se.location+Ce,we.meshPerAttribute);L.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=we.meshPerAttribute*we.count)}else for(let Ce=0;Ce<se.locationSize;Ce++)S(se.location+Ce);i.bindBuffer(i.ARRAY_BUFFER,xe);for(let Ce=0;Ce<se.locationSize;Ce++)A(se.location+Ce,Z/se.locationSize,Me,H,Z*de,Z/se.locationSize*Ce*de,Ve)}}else if(Y!==void 0){const H=Y[ee];if(H!==void 0)switch(H.length){case 2:i.vertexAttrib2fv(se.location,H);break;case 3:i.vertexAttrib3fv(se.location,H);break;case 4:i.vertexAttrib4fv(se.location,H);break;default:i.vertexAttrib1fv(se.location,H)}}}}R()}function X(){G();for(const L in a){const U=a[L];for(const D in U){const W=U[D];for(const V in W)g(W[V].object),delete W[V];delete U[D]}delete a[L]}}function _(L){if(a[L.id]===void 0)return;const U=a[L.id];for(const D in U){const W=U[D];for(const V in W)g(W[V].object),delete W[V];delete U[D]}delete a[L.id]}function w(L){for(const U in a){const D=a[U];if(D[L.id]===void 0)continue;const W=D[L.id];for(const V in W)g(W[V].object),delete W[V];delete D[L.id]}}function G(){j(),h=!0,l!==c&&(l=c,m(l.object))}function j(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:d,reset:G,resetDefaultState:j,dispose:X,releaseStatesOfGeometry:_,releaseStatesOfProgram:w,initAttributes:M,enableAttribute:S,disableUnusedAttributes:R}}function Pp(i,e,t,n){const s=n.isWebGL2;let r;function o(h){r=h}function a(h,d){i.drawArrays(r,h,d),t.update(d,r,1)}function c(h,d,p){if(p===0)return;let m,g;if(s)m=i,g="drawArraysInstanced";else if(m=e.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",m===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[g](r,h,d,p),t.update(d,r,p)}function l(h,d,p){if(p===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<p;g++)this.render(h[g],d[g]);else{m.multiDrawArraysWEBGL(r,h,0,d,0,p);let g=0;for(let v=0;v<p;v++)g+=d[v];t.update(g,r,1)}}this.setMode=o,this.render=a,this.renderInstances=c,this.renderMultiDraw=l}function Lp(i,e,t){let n;function s(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");n=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let a=t.precision!==void 0?t.precision:"highp";const c=r(a);c!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",c,"instead."),a=c);const l=o||e.has("WEBGL_draw_buffers"),h=t.logarithmicDepthBuffer===!0,d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),v=i.getParameter(i.MAX_VERTEX_ATTRIBS),f=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),u=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),M=p>0,S=o||e.has("OES_texture_float"),C=M&&S,R=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:l,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:d,maxVertexTextures:p,maxTextureSize:m,maxCubemapSize:g,maxAttributes:v,maxVertexUniforms:f,maxVaryings:u,maxFragmentUniforms:b,vertexTextures:M,floatFragmentTextures:S,floatVertexTextures:C,maxSamples:R}}function Dp(i){const e=this;let t=null,n=0,s=!1,r=!1;const o=new wn,a=new ze,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,p){const m=d.length!==0||p||n!==0||s;return s=p,n=d.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,p){t=h(d,p,0)},this.setState=function(d,p,m){const g=d.clippingPlanes,v=d.clipIntersection,f=d.clipShadows,u=i.get(d);if(!s||g===null||g.length===0||r&&!f)r?h(null):l();else{const b=r?0:n,M=b*4;let S=u.clippingState||null;c.value=S,S=h(g,p,M,m);for(let C=0;C!==M;++C)S[C]=t[C];u.clippingState=S,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=b}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,p,m,g){const v=d!==null?d.length:0;let f=null;if(v!==0){if(f=c.value,g!==!0||f===null){const u=m+v*4,b=p.matrixWorldInverse;a.getNormalMatrix(b),(f===null||f.length<u)&&(f=new Float32Array(u));for(let M=0,S=m;M!==v;++M,S+=4)o.copy(d[M]).applyMatrix4(b,a),o.normal.toArray(f,S),f[S+3]=o.constant}c.value=f,c.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,f}}function Ip(i){let e=new WeakMap;function t(o,a){return a===Jr?o.mapping=Ci:a===Qr&&(o.mapping=Pi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Jr||a===Qr)if(e.has(o)){const c=e.get(o).texture;return t(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new Wd(c.height);return l.fromEquirectangularTexture(i,o),e.set(o,l),o.addEventListener("dispose",s),t(l.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class el extends Zc{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const yi=4,Uo=[.125,.215,.35,.446,.526,.582],Vn=20,Cr=new el,No=new Fe;let Pr=null,Lr=0,Dr=0;const Gn=(1+Math.sqrt(5))/2,mi=1/Gn,Fo=[new P(1,1,1),new P(-1,1,1),new P(1,1,-1),new P(-1,1,-1),new P(0,Gn,mi),new P(0,Gn,-mi),new P(mi,0,Gn),new P(-mi,0,Gn),new P(Gn,mi,0),new P(-Gn,mi,0)];class Oo{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){Pr=this._renderer.getRenderTarget(),Lr=this._renderer.getActiveCubeFace(),Dr=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ko(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Bo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Pr,Lr,Dr),e.scissorTest=!1,Rs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ci||e.mapping===Pi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Pr=this._renderer.getRenderTarget(),Lr=this._renderer.getActiveCubeFace(),Dr=this._renderer.getActiveMipmapLevel();const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:It,minFilter:It,generateMipmaps:!1,type:Ji,format:Kt,colorSpace:vn,depthBuffer:!1},s=zo(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=zo(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Up(r)),this._blurMaterial=Np(r,e,t)}return s}_compileMaterial(e){const t=new fe(this._lodPlanes[0],e);this._renderer.compile(t,Cr)}_sceneToCubeUV(e,t,n,s){const a=new Bt(90,1,t,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,p=h.toneMapping;h.getClearColor(No),h.toneMapping=Cn,h.autoClear=!1;const m=new gn({name:"PMREM.Background",side:Nt,depthWrite:!1,depthTest:!1}),g=new fe(new Vt,m);let v=!1;const f=e.background;f?f.isColor&&(m.color.copy(f),e.background=null,v=!0):(m.color.copy(No),v=!0);for(let u=0;u<6;u++){const b=u%3;b===0?(a.up.set(0,c[u],0),a.lookAt(l[u],0,0)):b===1?(a.up.set(0,0,c[u]),a.lookAt(0,l[u],0)):(a.up.set(0,c[u],0),a.lookAt(0,0,l[u]));const M=this._cubeSize;Rs(s,b*M,u>2?M:0,M,M),h.setRenderTarget(s),v&&h.render(g,a),h.render(e,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=p,h.autoClear=d,e.background=f}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Ci||e.mapping===Pi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=ko()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Bo());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new fe(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const c=this._cubeSize;Rs(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,Cr)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Fo[(s-1)%Fo.length];this._blur(e,s-1,s,r,o)}t.autoClear=n}_blur(e,t,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new fe(this._lodPlanes[s],l),p=l.uniforms,m=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Vn-1),v=r/g,f=isFinite(r)?1+Math.floor(h*v):Vn;f>Vn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${f} samples when the maximum is set to ${Vn}`);const u=[];let b=0;for(let A=0;A<Vn;++A){const F=A/v,X=Math.exp(-F*F/2);u.push(X),A===0?b+=X:A<f&&(b+=2*X)}for(let A=0;A<u.length;A++)u[A]=u[A]/b;p.envMap.value=e.texture,p.samples.value=f,p.weights.value=u,p.latitudinal.value=o==="latitudinal",a&&(p.poleAxis.value=a);const{_lodMax:M}=this;p.dTheta.value=g,p.mipInt.value=M-n;const S=this._sizeLods[s],C=3*S*(s>M-yi?s-M+yi:0),R=4*(this._cubeSize-S);Rs(t,C,R,3*S,2*S),c.setRenderTarget(t),c.render(d,Cr)}}function Up(i){const e=[],t=[],n=[];let s=i;const r=i-yi+1+Uo.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);t.push(a);let c=1/a;o>i-yi?c=Uo[o-i+yi-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,d=1+l,p=[h,h,d,h,d,d,h,h,d,d,h,d],m=6,g=6,v=3,f=2,u=1,b=new Float32Array(v*g*m),M=new Float32Array(f*g*m),S=new Float32Array(u*g*m);for(let R=0;R<m;R++){const A=R%3*2/3-1,F=R>2?0:-1,X=[A,F,0,A+2/3,F,0,A+2/3,F+1,0,A,F,0,A+2/3,F+1,0,A,F+1,0];b.set(X,v*g*R),M.set(p,f*g*R);const _=[R,R,R,R,R,R];S.set(_,u*g*R)}const C=new ut;C.setAttribute("position",new bt(b,v)),C.setAttribute("uv",new bt(M,f)),C.setAttribute("faceIndex",new bt(S,u)),e.push(C),s>yi&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function zo(i,e,t){const n=new Kn(i,e,t);return n.texture.mapping=Ys,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Rs(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Np(i,e,t){const n=new Float32Array(Vn),s=new P(0,1,0);return new In({name:"SphericalGaussianBlur",defines:{n:Vn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:_a(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function Bo(){return new In({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:_a(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function ko(){return new In({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:_a(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function _a(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Fp(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===Jr||c===Qr,h=c===Ci||c===Pi;if(l||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let d=e.get(a);return t===null&&(t=new Oo(i)),d=l?t.fromEquirectangular(a,d):t.fromCubemap(a,d),e.set(a,d),d.texture}else{if(e.has(a))return e.get(a).texture;{const d=a.image;if(l&&d&&d.height>0||h&&d&&s(d)){t===null&&(t=new Oo(i));const p=l?t.fromEquirectangular(a):t.fromCubemap(a);return e.set(a,p),a.addEventListener("dispose",r),p.texture}else return null}}}return a}function s(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function Op(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){const s=t(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function zp(i,e,t,n){const s={},r=new WeakMap;function o(d){const p=d.target;p.index!==null&&e.remove(p.index);for(const g in p.attributes)e.remove(p.attributes[g]);for(const g in p.morphAttributes){const v=p.morphAttributes[g];for(let f=0,u=v.length;f<u;f++)e.remove(v[f])}p.removeEventListener("dispose",o),delete s[p.id];const m=r.get(p);m&&(e.remove(m),r.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function a(d,p){return s[p.id]===!0||(p.addEventListener("dispose",o),s[p.id]=!0,t.memory.geometries++),p}function c(d){const p=d.attributes;for(const g in p)e.update(p[g],i.ARRAY_BUFFER);const m=d.morphAttributes;for(const g in m){const v=m[g];for(let f=0,u=v.length;f<u;f++)e.update(v[f],i.ARRAY_BUFFER)}}function l(d){const p=[],m=d.index,g=d.attributes.position;let v=0;if(m!==null){const b=m.array;v=m.version;for(let M=0,S=b.length;M<S;M+=3){const C=b[M+0],R=b[M+1],A=b[M+2];p.push(C,R,R,A,A,C)}}else if(g!==void 0){const b=g.array;v=g.version;for(let M=0,S=b.length/3-1;M<S;M+=3){const C=M+0,R=M+1,A=M+2;p.push(C,R,R,A,A,C)}}else return;const f=new(Vc(p)?$c:jc)(p,1);f.version=v;const u=r.get(d);u&&e.remove(u),r.set(d,f)}function h(d){const p=r.get(d);if(p){const m=d.index;m!==null&&p.version<m.version&&l(d)}else l(d);return r.get(d)}return{get:a,update:c,getWireframeAttribute:h}}function Bp(i,e,t,n){const s=n.isWebGL2;let r;function o(m){r=m}let a,c;function l(m){a=m.type,c=m.bytesPerElement}function h(m,g){i.drawElements(r,g,a,m*c),t.update(g,r,1)}function d(m,g,v){if(v===0)return;let f,u;if(s)f=i,u="drawElementsInstanced";else if(f=e.get("ANGLE_instanced_arrays"),u="drawElementsInstancedANGLE",f===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[u](r,g,a,m*c,v),t.update(g,r,v)}function p(m,g,v){if(v===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let u=0;u<v;u++)this.render(m[u]/c,g[u]);else{f.multiDrawElementsWEBGL(r,g,0,a,m,0,v);let u=0;for(let b=0;b<v;b++)u+=g[b];t.update(u,r,1)}}this.setMode=o,this.setIndex=l,this.render=h,this.renderInstances=d,this.renderMultiDraw=p}function kp(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Gp(i,e){return i[0]-e[0]}function Hp(i,e){return Math.abs(e[1])-Math.abs(i[1])}function Vp(i,e,t){const n={},s=new Float32Array(8),r=new WeakMap,o=new it,a=[];for(let l=0;l<8;l++)a[l]=[l,0];function c(l,h,d){const p=l.morphTargetInfluences;if(e.isWebGL2===!0){const g=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,v=g!==void 0?g.length:0;let f=r.get(h);if(f===void 0||f.count!==v){let U=function(){j.dispose(),r.delete(h),h.removeEventListener("dispose",U)};var m=U;f!==void 0&&f.texture.dispose();const M=h.morphAttributes.position!==void 0,S=h.morphAttributes.normal!==void 0,C=h.morphAttributes.color!==void 0,R=h.morphAttributes.position||[],A=h.morphAttributes.normal||[],F=h.morphAttributes.color||[];let X=0;M===!0&&(X=1),S===!0&&(X=2),C===!0&&(X=3);let _=h.attributes.position.count*X,w=1;_>e.maxTextureSize&&(w=Math.ceil(_/e.maxTextureSize),_=e.maxTextureSize);const G=new Float32Array(_*w*4*v),j=new qc(G,_,w,v);j.type=pn,j.needsUpdate=!0;const L=X*4;for(let D=0;D<v;D++){const W=R[D],V=A[D],q=F[D],Y=_*w*4*D;for(let ee=0;ee<W.count;ee++){const se=ee*L;M===!0&&(o.fromBufferAttribute(W,ee),G[Y+se+0]=o.x,G[Y+se+1]=o.y,G[Y+se+2]=o.z,G[Y+se+3]=0),S===!0&&(o.fromBufferAttribute(V,ee),G[Y+se+4]=o.x,G[Y+se+5]=o.y,G[Y+se+6]=o.z,G[Y+se+7]=0),C===!0&&(o.fromBufferAttribute(q,ee),G[Y+se+8]=o.x,G[Y+se+9]=o.y,G[Y+se+10]=o.z,G[Y+se+11]=q.itemSize===4?o.w:1)}}f={count:v,texture:j,size:new Se(_,w)},r.set(h,f),h.addEventListener("dispose",U)}let u=0;for(let M=0;M<p.length;M++)u+=p[M];const b=h.morphTargetsRelative?1:1-u;d.getUniforms().setValue(i,"morphTargetBaseInfluence",b),d.getUniforms().setValue(i,"morphTargetInfluences",p),d.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),d.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}else{const g=p===void 0?0:p.length;let v=n[h.id];if(v===void 0||v.length!==g){v=[];for(let S=0;S<g;S++)v[S]=[S,0];n[h.id]=v}for(let S=0;S<g;S++){const C=v[S];C[0]=S,C[1]=p[S]}v.sort(Hp);for(let S=0;S<8;S++)S<g&&v[S][1]?(a[S][0]=v[S][0],a[S][1]=v[S][1]):(a[S][0]=Number.MAX_SAFE_INTEGER,a[S][1]=0);a.sort(Gp);const f=h.morphAttributes.position,u=h.morphAttributes.normal;let b=0;for(let S=0;S<8;S++){const C=a[S],R=C[0],A=C[1];R!==Number.MAX_SAFE_INTEGER&&A?(f&&h.getAttribute("morphTarget"+S)!==f[R]&&h.setAttribute("morphTarget"+S,f[R]),u&&h.getAttribute("morphNormal"+S)!==u[R]&&h.setAttribute("morphNormal"+S,u[R]),s[S]=A,b+=A):(f&&h.hasAttribute("morphTarget"+S)===!0&&h.deleteAttribute("morphTarget"+S),u&&h.hasAttribute("morphNormal"+S)===!0&&h.deleteAttribute("morphNormal"+S),s[S]=0)}const M=h.morphTargetsRelative?1:1-b;d.getUniforms().setValue(i,"morphTargetBaseInfluence",M),d.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:c}}function Wp(i,e,t,n){let s=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,d=e.get(c,h);if(s.get(d)!==l&&(e.update(d),s.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const p=c.skeleton;s.get(p)!==l&&(p.update(),s.set(p,l))}return d}function o(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:o}}class tl extends Dt{constructor(e,t,n,s,r,o,a,c,l,h){if(h=h!==void 0?h:Yn,h!==Yn&&h!==Li)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Yn&&(n=An),n===void 0&&h===Li&&(n=qn),super(null,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Pt,this.minFilter=c!==void 0?c:Pt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const nl=new Dt,il=new tl(1,1);il.compareFunction=Hc;const sl=new qc,rl=new Ad,al=new Jc,Go=[],Ho=[],Vo=new Float32Array(16),Wo=new Float32Array(9),Xo=new Float32Array(4);function Ni(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=Go[s];if(r===void 0&&(r=new Float32Array(s),Go[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function ft(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function pt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Zs(i,e){let t=Ho[e];t===void 0&&(t=new Int32Array(e),Ho[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Xp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function qp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ft(t,e))return;i.uniform2fv(this.addr,e),pt(t,e)}}function Yp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(ft(t,e))return;i.uniform3fv(this.addr,e),pt(t,e)}}function jp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ft(t,e))return;i.uniform4fv(this.addr,e),pt(t,e)}}function $p(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(ft(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),pt(t,e)}else{if(ft(t,n))return;Xo.set(n),i.uniformMatrix2fv(this.addr,!1,Xo),pt(t,n)}}function Kp(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(ft(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),pt(t,e)}else{if(ft(t,n))return;Wo.set(n),i.uniformMatrix3fv(this.addr,!1,Wo),pt(t,n)}}function Zp(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(ft(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),pt(t,e)}else{if(ft(t,n))return;Vo.set(n),i.uniformMatrix4fv(this.addr,!1,Vo),pt(t,n)}}function Jp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Qp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ft(t,e))return;i.uniform2iv(this.addr,e),pt(t,e)}}function em(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ft(t,e))return;i.uniform3iv(this.addr,e),pt(t,e)}}function tm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ft(t,e))return;i.uniform4iv(this.addr,e),pt(t,e)}}function nm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function im(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ft(t,e))return;i.uniform2uiv(this.addr,e),pt(t,e)}}function sm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ft(t,e))return;i.uniform3uiv(this.addr,e),pt(t,e)}}function rm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ft(t,e))return;i.uniform4uiv(this.addr,e),pt(t,e)}}function am(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const r=this.type===i.SAMPLER_2D_SHADOW?il:nl;t.setTexture2D(e||r,s)}function om(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||rl,s)}function cm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||al,s)}function lm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||sl,s)}function hm(i){switch(i){case 5126:return Xp;case 35664:return qp;case 35665:return Yp;case 35666:return jp;case 35674:return $p;case 35675:return Kp;case 35676:return Zp;case 5124:case 35670:return Jp;case 35667:case 35671:return Qp;case 35668:case 35672:return em;case 35669:case 35673:return tm;case 5125:return nm;case 36294:return im;case 36295:return sm;case 36296:return rm;case 35678:case 36198:case 36298:case 36306:case 35682:return am;case 35679:case 36299:case 36307:return om;case 35680:case 36300:case 36308:case 36293:return cm;case 36289:case 36303:case 36311:case 36292:return lm}}function dm(i,e){i.uniform1fv(this.addr,e)}function um(i,e){const t=Ni(e,this.size,2);i.uniform2fv(this.addr,t)}function fm(i,e){const t=Ni(e,this.size,3);i.uniform3fv(this.addr,t)}function pm(i,e){const t=Ni(e,this.size,4);i.uniform4fv(this.addr,t)}function mm(i,e){const t=Ni(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function gm(i,e){const t=Ni(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function _m(i,e){const t=Ni(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function vm(i,e){i.uniform1iv(this.addr,e)}function xm(i,e){i.uniform2iv(this.addr,e)}function Mm(i,e){i.uniform3iv(this.addr,e)}function ym(i,e){i.uniform4iv(this.addr,e)}function Sm(i,e){i.uniform1uiv(this.addr,e)}function bm(i,e){i.uniform2uiv(this.addr,e)}function Em(i,e){i.uniform3uiv(this.addr,e)}function wm(i,e){i.uniform4uiv(this.addr,e)}function Tm(i,e,t){const n=this.cache,s=e.length,r=Zs(t,s);ft(n,r)||(i.uniform1iv(this.addr,r),pt(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||nl,r[o])}function Am(i,e,t){const n=this.cache,s=e.length,r=Zs(t,s);ft(n,r)||(i.uniform1iv(this.addr,r),pt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||rl,r[o])}function Rm(i,e,t){const n=this.cache,s=e.length,r=Zs(t,s);ft(n,r)||(i.uniform1iv(this.addr,r),pt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||al,r[o])}function Cm(i,e,t){const n=this.cache,s=e.length,r=Zs(t,s);ft(n,r)||(i.uniform1iv(this.addr,r),pt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||sl,r[o])}function Pm(i){switch(i){case 5126:return dm;case 35664:return um;case 35665:return fm;case 35666:return pm;case 35674:return mm;case 35675:return gm;case 35676:return _m;case 5124:case 35670:return vm;case 35667:case 35671:return xm;case 35668:case 35672:return Mm;case 35669:case 35673:return ym;case 5125:return Sm;case 36294:return bm;case 36295:return Em;case 36296:return wm;case 35678:case 36198:case 36298:case 36306:case 35682:return Tm;case 35679:case 36299:case 36307:return Am;case 35680:case 36300:case 36308:case 36293:return Rm;case 36289:case 36303:case 36311:case 36292:return Cm}}class Lm{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=hm(t.type)}}class Dm{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Pm(t.type)}}class Im{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(e,t[a.id],n)}}}const Ir=/(\w+)(\])?(\[|\.)?/g;function qo(i,e){i.seq.push(e),i.map[e.id]=e}function Um(i,e,t){const n=i.name,s=n.length;for(Ir.lastIndex=0;;){const r=Ir.exec(n),o=Ir.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){qo(t,l===void 0?new Lm(a,i,e):new Dm(a,i,e));break}else{let d=t.map[a];d===void 0&&(d=new Im(a),qo(t,d)),t=d}}}class Fs{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);Um(r,o,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){const a=t[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const o=e[s];o.id in t&&n.push(o)}return n}}function Yo(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Nm=37297;let Fm=0;function Om(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function zm(i){const e=je.getPrimaries(je.workingColorSpace),t=je.getPrimaries(i);let n;switch(e===t?n="":e===Gs&&t===ks?n="LinearDisplayP3ToLinearSRGB":e===ks&&t===Gs&&(n="LinearSRGBToLinearDisplayP3"),i){case vn:case js:return[n,"LinearTransferOETF"];case dt:case pa:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function jo(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+Om(i.getShaderSource(e),o)}else return s}function Bm(i,e){const t=zm(e);return`vec4 ${i}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function km(i,e){let t;switch(e){case Jh:t="Linear";break;case Qh:t="Reinhard";break;case ed:t="OptimizedCineon";break;case Lc:t="ACESFilmic";break;case nd:t="AgX";break;case td:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Gm(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.alphaToCoverage||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Si).join(`
`)}function Hm(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Si).join(`
`)}function Vm(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Wm(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Si(i){return i!==""}function $o(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ko(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Xm=/^[ \t]*#include +<([\w\d./]+)>/gm;function aa(i){return i.replace(Xm,Ym)}const qm=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Ym(i,e){let t=Ie[e];if(t===void 0){const n=qm.get(e);if(n!==void 0)t=Ie[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return aa(t)}const jm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Zo(i){return i.replace(jm,$m)}function $m(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Jo(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	`;return i.isWebGL2&&(e+=`precision ${i.precision} sampler3D;
		precision ${i.precision} sampler2DArray;
		precision ${i.precision} sampler2DShadow;
		precision ${i.precision} samplerCubeShadow;
		precision ${i.precision} sampler2DArrayShadow;
		precision ${i.precision} isampler2D;
		precision ${i.precision} isampler3D;
		precision ${i.precision} isamplerCube;
		precision ${i.precision} isampler2DArray;
		precision ${i.precision} usampler2D;
		precision ${i.precision} usampler3D;
		precision ${i.precision} usamplerCube;
		precision ${i.precision} usampler2DArray;
		`),i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Km(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Rc?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Cc?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===dn&&(e="SHADOWMAP_TYPE_VSM"),e}function Zm(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ci:case Pi:e="ENVMAP_TYPE_CUBE";break;case Ys:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Jm(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Pi:e="ENVMAP_MODE_REFRACTION";break}return e}function Qm(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Pc:e="ENVMAP_BLENDING_MULTIPLY";break;case Kh:e="ENVMAP_BLENDING_MIX";break;case Zh:e="ENVMAP_BLENDING_ADD";break}return e}function eg(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function tg(i,e,t,n){const s=i.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const c=Km(t),l=Zm(t),h=Jm(t),d=Qm(t),p=eg(t),m=t.isWebGL2?"":Gm(t),g=Hm(t),v=Vm(r),f=s.createProgram();let u,b,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(u=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(Si).join(`
`),u.length>0&&(u+=`
`),b=[m,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(Si).join(`
`),b.length>0&&(b+=`
`)):(u=[Jo(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Si).join(`
`),b=[m,Jo(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Cn?"#define TONE_MAPPING":"",t.toneMapping!==Cn?Ie.tonemapping_pars_fragment:"",t.toneMapping!==Cn?km("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ie.colorspace_pars_fragment,Bm("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Si).join(`
`)),o=aa(o),o=$o(o,t),o=Ko(o,t),a=aa(a),a=$o(a,t),a=Ko(a,t),o=Zo(o),a=Zo(a),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,u=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+u,b=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===po?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===po?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+b);const S=M+u+o,C=M+b+a,R=Yo(s,s.VERTEX_SHADER,S),A=Yo(s,s.FRAGMENT_SHADER,C);s.attachShader(f,R),s.attachShader(f,A),t.index0AttributeName!==void 0?s.bindAttribLocation(f,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(f,0,"position"),s.linkProgram(f);function F(G){if(i.debug.checkShaderErrors){const j=s.getProgramInfoLog(f).trim(),L=s.getShaderInfoLog(R).trim(),U=s.getShaderInfoLog(A).trim();let D=!0,W=!0;if(s.getProgramParameter(f,s.LINK_STATUS)===!1)if(D=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,f,R,A);else{const V=jo(s,R,"vertex"),q=jo(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(f,s.VALIDATE_STATUS)+`

Material Name: `+G.name+`
Material Type: `+G.type+`

Program Info Log: `+j+`
`+V+`
`+q)}else j!==""?console.warn("THREE.WebGLProgram: Program Info Log:",j):(L===""||U==="")&&(W=!1);W&&(G.diagnostics={runnable:D,programLog:j,vertexShader:{log:L,prefix:u},fragmentShader:{log:U,prefix:b}})}s.deleteShader(R),s.deleteShader(A),X=new Fs(s,f),_=Wm(s,f)}let X;this.getUniforms=function(){return X===void 0&&F(this),X};let _;this.getAttributes=function(){return _===void 0&&F(this),_};let w=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return w===!1&&(w=s.getProgramParameter(f,Nm)),w},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(f),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Fm++,this.cacheKey=e,this.usedTimes=1,this.program=f,this.vertexShader=R,this.fragmentShader=A,this}let ng=0;class ig{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new sg(e),t.set(e,n)),n}}class sg{constructor(e){this.id=ng++,this.code=e,this.usedTimes=0}}function rg(i,e,t,n,s,r,o){const a=new ma,c=new ig,l=new Set,h=[],d=s.isWebGL2,p=s.logarithmicDepthBuffer,m=s.vertexTextures;let g=s.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function f(_){return l.add(_),_===0?"uv":`uv${_}`}function u(_,w,G,j,L){const U=j.fog,D=L.geometry,W=_.isMeshStandardMaterial?j.environment:null,V=(_.isMeshStandardMaterial?t:e).get(_.envMap||W),q=V&&V.mapping===Ys?V.image.height:null,Y=v[_.type];_.precision!==null&&(g=s.getMaxPrecision(_.precision),g!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",g,"instead."));const ee=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,se=ee!==void 0?ee.length:0;let we=0;D.morphAttributes.position!==void 0&&(we=1),D.morphAttributes.normal!==void 0&&(we=2),D.morphAttributes.color!==void 0&&(we=3);let H,Z,oe,xe;if(Y){const Ze=tn[Y];H=Ze.vertexShader,Z=Ze.fragmentShader}else H=_.vertexShader,Z=_.fragmentShader,c.update(_),oe=c.getVertexShaderID(_),xe=c.getFragmentShaderID(_);const Me=i.getRenderTarget(),de=L.isInstancedMesh===!0,Ve=L.isBatchedMesh===!0,Ce=!!_.map,N=!!_.matcap,Mt=!!V,_e=!!_.aoMap,Te=!!_.lightMap,me=!!_.bumpMap,st=!!_.normalMap,Le=!!_.displacementMap,E=!!_.emissiveMap,x=!!_.metalnessMap,O=!!_.roughnessMap,Q=_.anisotropy>0,$=_.clearcoat>0,J=_.iridescence>0,ue=_.sheen>0,re=_.transmission>0,ce=Q&&!!_.anisotropyMap,be=$&&!!_.clearcoatMap,Ue=$&&!!_.clearcoatNormalMap,K=$&&!!_.clearcoatRoughnessMap,qe=J&&!!_.iridescenceMap,Be=J&&!!_.iridescenceThicknessMap,Ae=ue&&!!_.sheenColorMap,ge=ue&&!!_.sheenRoughnessMap,le=!!_.specularMap,De=!!_.specularColorMap,We=!!_.specularIntensityMap,tt=re&&!!_.transmissionMap,ke=re&&!!_.thicknessMap,$e=!!_.gradientMap,T=!!_.alphaMap,te=_.alphaTest>0,ne=!!_.alphaHash,he=!!_.extensions;let ve=Cn;_.toneMapped&&(Me===null||Me.isXRRenderTarget===!0)&&(ve=i.toneMapping);const Xe={isWebGL2:d,shaderID:Y,shaderType:_.type,shaderName:_.name,vertexShader:H,fragmentShader:Z,defines:_.defines,customVertexShaderID:oe,customFragmentShaderID:xe,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:g,batching:Ve,instancing:de,instancingColor:de&&L.instanceColor!==null,supportsVertexTextures:m,outputColorSpace:Me===null?i.outputColorSpace:Me.isXRRenderTarget===!0?Me.texture.colorSpace:vn,alphaToCoverage:!!_.alphaToCoverage,map:Ce,matcap:N,envMap:Mt,envMapMode:Mt&&V.mapping,envMapCubeUVHeight:q,aoMap:_e,lightMap:Te,bumpMap:me,normalMap:st,displacementMap:m&&Le,emissiveMap:E,normalMapObjectSpace:st&&_.normalMapType===fd,normalMapTangentSpace:st&&_.normalMapType===Gc,metalnessMap:x,roughnessMap:O,anisotropy:Q,anisotropyMap:ce,clearcoat:$,clearcoatMap:be,clearcoatNormalMap:Ue,clearcoatRoughnessMap:K,iridescence:J,iridescenceMap:qe,iridescenceThicknessMap:Be,sheen:ue,sheenColorMap:Ae,sheenRoughnessMap:ge,specularMap:le,specularColorMap:De,specularIntensityMap:We,transmission:re,transmissionMap:tt,thicknessMap:ke,gradientMap:$e,opaque:_.transparent===!1&&_.blending===Ei&&_.alphaToCoverage===!1,alphaMap:T,alphaTest:te,alphaHash:ne,combine:_.combine,mapUv:Ce&&f(_.map.channel),aoMapUv:_e&&f(_.aoMap.channel),lightMapUv:Te&&f(_.lightMap.channel),bumpMapUv:me&&f(_.bumpMap.channel),normalMapUv:st&&f(_.normalMap.channel),displacementMapUv:Le&&f(_.displacementMap.channel),emissiveMapUv:E&&f(_.emissiveMap.channel),metalnessMapUv:x&&f(_.metalnessMap.channel),roughnessMapUv:O&&f(_.roughnessMap.channel),anisotropyMapUv:ce&&f(_.anisotropyMap.channel),clearcoatMapUv:be&&f(_.clearcoatMap.channel),clearcoatNormalMapUv:Ue&&f(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:K&&f(_.clearcoatRoughnessMap.channel),iridescenceMapUv:qe&&f(_.iridescenceMap.channel),iridescenceThicknessMapUv:Be&&f(_.iridescenceThicknessMap.channel),sheenColorMapUv:Ae&&f(_.sheenColorMap.channel),sheenRoughnessMapUv:ge&&f(_.sheenRoughnessMap.channel),specularMapUv:le&&f(_.specularMap.channel),specularColorMapUv:De&&f(_.specularColorMap.channel),specularIntensityMapUv:We&&f(_.specularIntensityMap.channel),transmissionMapUv:tt&&f(_.transmissionMap.channel),thicknessMapUv:ke&&f(_.thicknessMap.channel),alphaMapUv:T&&f(_.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(st||Q),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!D.attributes.uv&&(Ce||T),fog:!!U,useFog:_.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:_.flatShading===!0,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:p,skinning:L.isSkinnedMesh===!0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:se,morphTextureStride:we,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&G.length>0,shadowMapType:i.shadowMap.type,toneMapping:ve,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Ce&&_.map.isVideoTexture===!0&&je.getTransfer(_.map.colorSpace)===nt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Lt,flipSided:_.side===Nt,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionDerivatives:he&&_.extensions.derivatives===!0,extensionFragDepth:he&&_.extensions.fragDepth===!0,extensionDrawBuffers:he&&_.extensions.drawBuffers===!0,extensionShaderTextureLOD:he&&_.extensions.shaderTextureLOD===!0,extensionClipCullDistance:he&&_.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:he&&_.extensions.multiDraw===!0&&n.has("WEBGL_multi_draw"),rendererExtensionFragDepth:d||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:d||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:d||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Xe.vertexUv1s=l.has(1),Xe.vertexUv2s=l.has(2),Xe.vertexUv3s=l.has(3),l.clear(),Xe}function b(_){const w=[];if(_.shaderID?w.push(_.shaderID):(w.push(_.customVertexShaderID),w.push(_.customFragmentShaderID)),_.defines!==void 0)for(const G in _.defines)w.push(G),w.push(_.defines[G]);return _.isRawShaderMaterial===!1&&(M(w,_),S(w,_),w.push(i.outputColorSpace)),w.push(_.customProgramCacheKey),w.join()}function M(_,w){_.push(w.precision),_.push(w.outputColorSpace),_.push(w.envMapMode),_.push(w.envMapCubeUVHeight),_.push(w.mapUv),_.push(w.alphaMapUv),_.push(w.lightMapUv),_.push(w.aoMapUv),_.push(w.bumpMapUv),_.push(w.normalMapUv),_.push(w.displacementMapUv),_.push(w.emissiveMapUv),_.push(w.metalnessMapUv),_.push(w.roughnessMapUv),_.push(w.anisotropyMapUv),_.push(w.clearcoatMapUv),_.push(w.clearcoatNormalMapUv),_.push(w.clearcoatRoughnessMapUv),_.push(w.iridescenceMapUv),_.push(w.iridescenceThicknessMapUv),_.push(w.sheenColorMapUv),_.push(w.sheenRoughnessMapUv),_.push(w.specularMapUv),_.push(w.specularColorMapUv),_.push(w.specularIntensityMapUv),_.push(w.transmissionMapUv),_.push(w.thicknessMapUv),_.push(w.combine),_.push(w.fogExp2),_.push(w.sizeAttenuation),_.push(w.morphTargetsCount),_.push(w.morphAttributeCount),_.push(w.numDirLights),_.push(w.numPointLights),_.push(w.numSpotLights),_.push(w.numSpotLightMaps),_.push(w.numHemiLights),_.push(w.numRectAreaLights),_.push(w.numDirLightShadows),_.push(w.numPointLightShadows),_.push(w.numSpotLightShadows),_.push(w.numSpotLightShadowsWithMaps),_.push(w.numLightProbes),_.push(w.shadowMapType),_.push(w.toneMapping),_.push(w.numClippingPlanes),_.push(w.numClipIntersection),_.push(w.depthPacking)}function S(_,w){a.disableAll(),w.isWebGL2&&a.enable(0),w.supportsVertexTextures&&a.enable(1),w.instancing&&a.enable(2),w.instancingColor&&a.enable(3),w.matcap&&a.enable(4),w.envMap&&a.enable(5),w.normalMapObjectSpace&&a.enable(6),w.normalMapTangentSpace&&a.enable(7),w.clearcoat&&a.enable(8),w.iridescence&&a.enable(9),w.alphaTest&&a.enable(10),w.vertexColors&&a.enable(11),w.vertexAlphas&&a.enable(12),w.vertexUv1s&&a.enable(13),w.vertexUv2s&&a.enable(14),w.vertexUv3s&&a.enable(15),w.vertexTangents&&a.enable(16),w.anisotropy&&a.enable(17),w.alphaHash&&a.enable(18),w.batching&&a.enable(19),_.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.skinning&&a.enable(4),w.morphTargets&&a.enable(5),w.morphNormals&&a.enable(6),w.morphColors&&a.enable(7),w.premultipliedAlpha&&a.enable(8),w.shadowMapEnabled&&a.enable(9),w.useLegacyLights&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.alphaToCoverage&&a.enable(20),_.push(a.mask)}function C(_){const w=v[_.type];let G;if(w){const j=tn[w];G=kd.clone(j.uniforms)}else G=_.uniforms;return G}function R(_,w){let G;for(let j=0,L=h.length;j<L;j++){const U=h[j];if(U.cacheKey===w){G=U,++G.usedTimes;break}}return G===void 0&&(G=new tg(i,w,_,r),h.push(G)),G}function A(_){if(--_.usedTimes===0){const w=h.indexOf(_);h[w]=h[h.length-1],h.pop(),_.destroy()}}function F(_){c.remove(_)}function X(){c.dispose()}return{getParameters:u,getProgramCacheKey:b,getUniforms:C,acquireProgram:R,releaseProgram:A,releaseShaderCache:F,programs:h,dispose:X}}function ag(){let i=new WeakMap;function e(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function t(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:e,remove:t,update:n,dispose:s}}function og(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Qo(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function ec(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(d,p,m,g,v,f){let u=i[e];return u===void 0?(u={id:d.id,object:d,geometry:p,material:m,groupOrder:g,renderOrder:d.renderOrder,z:v,group:f},i[e]=u):(u.id=d.id,u.object=d,u.geometry=p,u.material=m,u.groupOrder=g,u.renderOrder=d.renderOrder,u.z=v,u.group=f),e++,u}function a(d,p,m,g,v,f){const u=o(d,p,m,g,v,f);m.transmission>0?n.push(u):m.transparent===!0?s.push(u):t.push(u)}function c(d,p,m,g,v,f){const u=o(d,p,m,g,v,f);m.transmission>0?n.unshift(u):m.transparent===!0?s.unshift(u):t.unshift(u)}function l(d,p){t.length>1&&t.sort(d||og),n.length>1&&n.sort(p||Qo),s.length>1&&s.sort(p||Qo)}function h(){for(let d=e,p=i.length;d<p;d++){const m=i[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function cg(){let i=new WeakMap;function e(n,s){const r=i.get(n);let o;return r===void 0?(o=new ec,i.set(n,[o])):s>=r.length?(o=new ec,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function lg(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new Fe};break;case"SpotLight":t={position:new P,direction:new P,color:new Fe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new Fe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new Fe,groundColor:new Fe};break;case"RectAreaLight":t={color:new Fe,position:new P,halfWidth:new P,halfHeight:new P};break}return i[e.id]=t,t}}}function hg(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Se};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Se};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Se,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let dg=0;function ug(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function fg(i,e){const t=new lg,n=hg(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new P);const r=new P,o=new Qe,a=new Qe;function c(h,d){let p=0,m=0,g=0;for(let G=0;G<9;G++)s.probe[G].set(0,0,0);let v=0,f=0,u=0,b=0,M=0,S=0,C=0,R=0,A=0,F=0,X=0;h.sort(ug);const _=d===!0?Math.PI:1;for(let G=0,j=h.length;G<j;G++){const L=h[G],U=L.color,D=L.intensity,W=L.distance,V=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)p+=U.r*D*_,m+=U.g*D*_,g+=U.b*D*_;else if(L.isLightProbe){for(let q=0;q<9;q++)s.probe[q].addScaledVector(L.sh.coefficients[q],D);X++}else if(L.isDirectionalLight){const q=t.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity*_),L.castShadow){const Y=L.shadow,ee=n.get(L);ee.shadowBias=Y.bias,ee.shadowNormalBias=Y.normalBias,ee.shadowRadius=Y.radius,ee.shadowMapSize=Y.mapSize,s.directionalShadow[v]=ee,s.directionalShadowMap[v]=V,s.directionalShadowMatrix[v]=L.shadow.matrix,S++}s.directional[v]=q,v++}else if(L.isSpotLight){const q=t.get(L);q.position.setFromMatrixPosition(L.matrixWorld),q.color.copy(U).multiplyScalar(D*_),q.distance=W,q.coneCos=Math.cos(L.angle),q.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),q.decay=L.decay,s.spot[u]=q;const Y=L.shadow;if(L.map&&(s.spotLightMap[A]=L.map,A++,Y.updateMatrices(L),L.castShadow&&F++),s.spotLightMatrix[u]=Y.matrix,L.castShadow){const ee=n.get(L);ee.shadowBias=Y.bias,ee.shadowNormalBias=Y.normalBias,ee.shadowRadius=Y.radius,ee.shadowMapSize=Y.mapSize,s.spotShadow[u]=ee,s.spotShadowMap[u]=V,R++}u++}else if(L.isRectAreaLight){const q=t.get(L);q.color.copy(U).multiplyScalar(D),q.halfWidth.set(L.width*.5,0,0),q.halfHeight.set(0,L.height*.5,0),s.rectArea[b]=q,b++}else if(L.isPointLight){const q=t.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity*_),q.distance=L.distance,q.decay=L.decay,L.castShadow){const Y=L.shadow,ee=n.get(L);ee.shadowBias=Y.bias,ee.shadowNormalBias=Y.normalBias,ee.shadowRadius=Y.radius,ee.shadowMapSize=Y.mapSize,ee.shadowCameraNear=Y.camera.near,ee.shadowCameraFar=Y.camera.far,s.pointShadow[f]=ee,s.pointShadowMap[f]=V,s.pointShadowMatrix[f]=L.shadow.matrix,C++}s.point[f]=q,f++}else if(L.isHemisphereLight){const q=t.get(L);q.skyColor.copy(L.color).multiplyScalar(D*_),q.groundColor.copy(L.groundColor).multiplyScalar(D*_),s.hemi[M]=q,M++}}b>0&&(e.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=ie.LTC_FLOAT_1,s.rectAreaLTC2=ie.LTC_FLOAT_2):(s.rectAreaLTC1=ie.LTC_HALF_1,s.rectAreaLTC2=ie.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=ie.LTC_FLOAT_1,s.rectAreaLTC2=ie.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=ie.LTC_HALF_1,s.rectAreaLTC2=ie.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=p,s.ambient[1]=m,s.ambient[2]=g;const w=s.hash;(w.directionalLength!==v||w.pointLength!==f||w.spotLength!==u||w.rectAreaLength!==b||w.hemiLength!==M||w.numDirectionalShadows!==S||w.numPointShadows!==C||w.numSpotShadows!==R||w.numSpotMaps!==A||w.numLightProbes!==X)&&(s.directional.length=v,s.spot.length=u,s.rectArea.length=b,s.point.length=f,s.hemi.length=M,s.directionalShadow.length=S,s.directionalShadowMap.length=S,s.pointShadow.length=C,s.pointShadowMap.length=C,s.spotShadow.length=R,s.spotShadowMap.length=R,s.directionalShadowMatrix.length=S,s.pointShadowMatrix.length=C,s.spotLightMatrix.length=R+A-F,s.spotLightMap.length=A,s.numSpotLightShadowsWithMaps=F,s.numLightProbes=X,w.directionalLength=v,w.pointLength=f,w.spotLength=u,w.rectAreaLength=b,w.hemiLength=M,w.numDirectionalShadows=S,w.numPointShadows=C,w.numSpotShadows=R,w.numSpotMaps=A,w.numLightProbes=X,s.version=dg++)}function l(h,d){let p=0,m=0,g=0,v=0,f=0;const u=d.matrixWorldInverse;for(let b=0,M=h.length;b<M;b++){const S=h[b];if(S.isDirectionalLight){const C=s.directional[p];C.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),C.direction.sub(r),C.direction.transformDirection(u),p++}else if(S.isSpotLight){const C=s.spot[g];C.position.setFromMatrixPosition(S.matrixWorld),C.position.applyMatrix4(u),C.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),C.direction.sub(r),C.direction.transformDirection(u),g++}else if(S.isRectAreaLight){const C=s.rectArea[v];C.position.setFromMatrixPosition(S.matrixWorld),C.position.applyMatrix4(u),a.identity(),o.copy(S.matrixWorld),o.premultiply(u),a.extractRotation(o),C.halfWidth.set(S.width*.5,0,0),C.halfHeight.set(0,S.height*.5,0),C.halfWidth.applyMatrix4(a),C.halfHeight.applyMatrix4(a),v++}else if(S.isPointLight){const C=s.point[m];C.position.setFromMatrixPosition(S.matrixWorld),C.position.applyMatrix4(u),m++}else if(S.isHemisphereLight){const C=s.hemi[f];C.direction.setFromMatrixPosition(S.matrixWorld),C.direction.transformDirection(u),f++}}}return{setup:c,setupView:l,state:s}}function tc(i,e){const t=new fg(i,e),n=[],s=[];function r(){n.length=0,s.length=0}function o(d){n.push(d)}function a(d){s.push(d)}function c(d){t.setup(n,d)}function l(d){t.setupView(n,d)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:t},setupLights:c,setupLightsView:l,pushLight:o,pushShadow:a}}function pg(i,e){let t=new WeakMap;function n(r,o=0){const a=t.get(r);let c;return a===void 0?(c=new tc(i,e),t.set(r,[c])):o>=a.length?(c=new tc(i,e),a.push(c)):c=a[o],c}function s(){t=new WeakMap}return{get:n,dispose:s}}class mg extends Un{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=dd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class gg extends Un{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const _g=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,vg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function xg(i,e,t){let n=new ga;const s=new Se,r=new Se,o=new it,a=new mg({depthPacking:ud}),c=new gg,l={},h=t.maxTextureSize,d={[Dn]:Nt,[Nt]:Dn,[Lt]:Lt},p=new In({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Se},radius:{value:4}},vertexShader:_g,fragmentShader:vg}),m=p.clone();m.defines.HORIZONTAL_PASS=1;const g=new ut;g.setAttribute("position",new bt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new fe(g,p),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Rc;let u=this.type;this.render=function(R,A,F){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||R.length===0)return;const X=i.getRenderTarget(),_=i.getActiveCubeFace(),w=i.getActiveMipmapLevel(),G=i.state;G.setBlending(Rn),G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const j=u!==dn&&this.type===dn,L=u===dn&&this.type!==dn;for(let U=0,D=R.length;U<D;U++){const W=R[U],V=W.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",W,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const q=V.getFrameExtents();if(s.multiply(q),r.copy(V.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/q.x),s.x=r.x*q.x,V.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/q.y),s.y=r.y*q.y,V.mapSize.y=r.y)),V.map===null||j===!0||L===!0){const ee=this.type!==dn?{minFilter:Pt,magFilter:Pt}:{};V.map!==null&&V.map.dispose(),V.map=new Kn(s.x,s.y,ee),V.map.texture.name=W.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const Y=V.getViewportCount();for(let ee=0;ee<Y;ee++){const se=V.getViewport(ee);o.set(r.x*se.x,r.y*se.y,r.x*se.z,r.y*se.w),G.viewport(o),V.updateMatrices(W,ee),n=V.getFrustum(),S(A,F,V.camera,W,this.type)}V.isPointLightShadow!==!0&&this.type===dn&&b(V,F),V.needsUpdate=!1}u=this.type,f.needsUpdate=!1,i.setRenderTarget(X,_,w)};function b(R,A){const F=e.update(v);p.defines.VSM_SAMPLES!==R.blurSamples&&(p.defines.VSM_SAMPLES=R.blurSamples,m.defines.VSM_SAMPLES=R.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new Kn(s.x,s.y)),p.uniforms.shadow_pass.value=R.map.texture,p.uniforms.resolution.value=R.mapSize,p.uniforms.radius.value=R.radius,i.setRenderTarget(R.mapPass),i.clear(),i.renderBufferDirect(A,null,F,p,v,null),m.uniforms.shadow_pass.value=R.mapPass.texture,m.uniforms.resolution.value=R.mapSize,m.uniforms.radius.value=R.radius,i.setRenderTarget(R.map),i.clear(),i.renderBufferDirect(A,null,F,m,v,null)}function M(R,A,F,X){let _=null;const w=F.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(w!==void 0)_=w;else if(_=F.isPointLight===!0?c:a,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const G=_.uuid,j=A.uuid;let L=l[G];L===void 0&&(L={},l[G]=L);let U=L[j];U===void 0&&(U=_.clone(),L[j]=U,A.addEventListener("dispose",C)),_=U}if(_.visible=A.visible,_.wireframe=A.wireframe,X===dn?_.side=A.shadowSide!==null?A.shadowSide:A.side:_.side=A.shadowSide!==null?A.shadowSide:d[A.side],_.alphaMap=A.alphaMap,_.alphaTest=A.alphaTest,_.map=A.map,_.clipShadows=A.clipShadows,_.clippingPlanes=A.clippingPlanes,_.clipIntersection=A.clipIntersection,_.displacementMap=A.displacementMap,_.displacementScale=A.displacementScale,_.displacementBias=A.displacementBias,_.wireframeLinewidth=A.wireframeLinewidth,_.linewidth=A.linewidth,F.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const G=i.properties.get(_);G.light=F}return _}function S(R,A,F,X,_){if(R.visible===!1)return;if(R.layers.test(A.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&_===dn)&&(!R.frustumCulled||n.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,R.matrixWorld);const j=e.update(R),L=R.material;if(Array.isArray(L)){const U=j.groups;for(let D=0,W=U.length;D<W;D++){const V=U[D],q=L[V.materialIndex];if(q&&q.visible){const Y=M(R,q,X,_);R.onBeforeShadow(i,R,A,F,j,Y,V),i.renderBufferDirect(F,null,j,Y,R,V),R.onAfterShadow(i,R,A,F,j,Y,V)}}}else if(L.visible){const U=M(R,L,X,_);R.onBeforeShadow(i,R,A,F,j,U,null),i.renderBufferDirect(F,null,j,U,R,null),R.onAfterShadow(i,R,A,F,j,U,null)}}const G=R.children;for(let j=0,L=G.length;j<L;j++)S(G[j],A,F,X,_)}function C(R){R.target.removeEventListener("dispose",C);for(const F in l){const X=l[F],_=R.target.uuid;_ in X&&(X[_].dispose(),delete X[_])}}}function Mg(i,e,t){const n=t.isWebGL2;function s(){let T=!1;const te=new it;let ne=null;const he=new it(0,0,0,0);return{setMask:function(ve){ne!==ve&&!T&&(i.colorMask(ve,ve,ve,ve),ne=ve)},setLocked:function(ve){T=ve},setClear:function(ve,Xe,Ze,yt,kt){kt===!0&&(ve*=yt,Xe*=yt,Ze*=yt),te.set(ve,Xe,Ze,yt),he.equals(te)===!1&&(i.clearColor(ve,Xe,Ze,yt),he.copy(te))},reset:function(){T=!1,ne=null,he.set(-1,0,0,0)}}}function r(){let T=!1,te=null,ne=null,he=null;return{setTest:function(ve){ve?de(i.DEPTH_TEST):Ve(i.DEPTH_TEST)},setMask:function(ve){te!==ve&&!T&&(i.depthMask(ve),te=ve)},setFunc:function(ve){if(ne!==ve){switch(ve){case Vh:i.depthFunc(i.NEVER);break;case Wh:i.depthFunc(i.ALWAYS);break;case Xh:i.depthFunc(i.LESS);break;case zs:i.depthFunc(i.LEQUAL);break;case qh:i.depthFunc(i.EQUAL);break;case Yh:i.depthFunc(i.GEQUAL);break;case jh:i.depthFunc(i.GREATER);break;case $h:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ne=ve}},setLocked:function(ve){T=ve},setClear:function(ve){he!==ve&&(i.clearDepth(ve),he=ve)},reset:function(){T=!1,te=null,ne=null,he=null}}}function o(){let T=!1,te=null,ne=null,he=null,ve=null,Xe=null,Ze=null,yt=null,kt=null;return{setTest:function(Je){T||(Je?de(i.STENCIL_TEST):Ve(i.STENCIL_TEST))},setMask:function(Je){te!==Je&&!T&&(i.stencilMask(Je),te=Je)},setFunc:function(Je,At,Qt){(ne!==Je||he!==At||ve!==Qt)&&(i.stencilFunc(Je,At,Qt),ne=Je,he=At,ve=Qt)},setOp:function(Je,At,Qt){(Xe!==Je||Ze!==At||yt!==Qt)&&(i.stencilOp(Je,At,Qt),Xe=Je,Ze=At,yt=Qt)},setLocked:function(Je){T=Je},setClear:function(Je){kt!==Je&&(i.clearStencil(Je),kt=Je)},reset:function(){T=!1,te=null,ne=null,he=null,ve=null,Xe=null,Ze=null,yt=null,kt=null}}}const a=new s,c=new r,l=new o,h=new WeakMap,d=new WeakMap;let p={},m={},g=new WeakMap,v=[],f=null,u=!1,b=null,M=null,S=null,C=null,R=null,A=null,F=null,X=new Fe(0,0,0),_=0,w=!1,G=null,j=null,L=null,U=null,D=null;const W=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,q=0;const Y=i.getParameter(i.VERSION);Y.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(Y)[1]),V=q>=1):Y.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),V=q>=2);let ee=null,se={};const we=i.getParameter(i.SCISSOR_BOX),H=i.getParameter(i.VIEWPORT),Z=new it().fromArray(we),oe=new it().fromArray(H);function xe(T,te,ne,he){const ve=new Uint8Array(4),Xe=i.createTexture();i.bindTexture(T,Xe),i.texParameteri(T,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(T,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ze=0;Ze<ne;Ze++)n&&(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)?i.texImage3D(te,0,i.RGBA,1,1,he,0,i.RGBA,i.UNSIGNED_BYTE,ve):i.texImage2D(te+Ze,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ve);return Xe}const Me={};Me[i.TEXTURE_2D]=xe(i.TEXTURE_2D,i.TEXTURE_2D,1),Me[i.TEXTURE_CUBE_MAP]=xe(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Me[i.TEXTURE_2D_ARRAY]=xe(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Me[i.TEXTURE_3D]=xe(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),c.setClear(1),l.setClear(0),de(i.DEPTH_TEST),c.setFunc(zs),Le(!1),E(Na),de(i.CULL_FACE),me(Rn);function de(T){p[T]!==!0&&(i.enable(T),p[T]=!0)}function Ve(T){p[T]!==!1&&(i.disable(T),p[T]=!1)}function Ce(T,te){return m[T]!==te?(i.bindFramebuffer(T,te),m[T]=te,n&&(T===i.DRAW_FRAMEBUFFER&&(m[i.FRAMEBUFFER]=te),T===i.FRAMEBUFFER&&(m[i.DRAW_FRAMEBUFFER]=te)),!0):!1}function N(T,te){let ne=v,he=!1;if(T)if(ne=g.get(te),ne===void 0&&(ne=[],g.set(te,ne)),T.isWebGLMultipleRenderTargets){const ve=T.texture;if(ne.length!==ve.length||ne[0]!==i.COLOR_ATTACHMENT0){for(let Xe=0,Ze=ve.length;Xe<Ze;Xe++)ne[Xe]=i.COLOR_ATTACHMENT0+Xe;ne.length=ve.length,he=!0}}else ne[0]!==i.COLOR_ATTACHMENT0&&(ne[0]=i.COLOR_ATTACHMENT0,he=!0);else ne[0]!==i.BACK&&(ne[0]=i.BACK,he=!0);he&&(t.isWebGL2?i.drawBuffers(ne):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(ne))}function Mt(T){return f!==T?(i.useProgram(T),f=T,!0):!1}const _e={[Hn]:i.FUNC_ADD,[Rh]:i.FUNC_SUBTRACT,[Ch]:i.FUNC_REVERSE_SUBTRACT};if(n)_e[za]=i.MIN,_e[Ba]=i.MAX;else{const T=e.get("EXT_blend_minmax");T!==null&&(_e[za]=T.MIN_EXT,_e[Ba]=T.MAX_EXT)}const Te={[Ph]:i.ZERO,[Lh]:i.ONE,[Dh]:i.SRC_COLOR,[Kr]:i.SRC_ALPHA,[zh]:i.SRC_ALPHA_SATURATE,[Fh]:i.DST_COLOR,[Uh]:i.DST_ALPHA,[Ih]:i.ONE_MINUS_SRC_COLOR,[Zr]:i.ONE_MINUS_SRC_ALPHA,[Oh]:i.ONE_MINUS_DST_COLOR,[Nh]:i.ONE_MINUS_DST_ALPHA,[Bh]:i.CONSTANT_COLOR,[kh]:i.ONE_MINUS_CONSTANT_COLOR,[Gh]:i.CONSTANT_ALPHA,[Hh]:i.ONE_MINUS_CONSTANT_ALPHA};function me(T,te,ne,he,ve,Xe,Ze,yt,kt,Je){if(T===Rn){u===!0&&(Ve(i.BLEND),u=!1);return}if(u===!1&&(de(i.BLEND),u=!0),T!==Ah){if(T!==b||Je!==w){if((M!==Hn||R!==Hn)&&(i.blendEquation(i.FUNC_ADD),M=Hn,R=Hn),Je)switch(T){case Ei:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case $r:i.blendFunc(i.ONE,i.ONE);break;case Fa:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Oa:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",T);break}else switch(T){case Ei:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case $r:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Fa:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Oa:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",T);break}S=null,C=null,A=null,F=null,X.set(0,0,0),_=0,b=T,w=Je}return}ve=ve||te,Xe=Xe||ne,Ze=Ze||he,(te!==M||ve!==R)&&(i.blendEquationSeparate(_e[te],_e[ve]),M=te,R=ve),(ne!==S||he!==C||Xe!==A||Ze!==F)&&(i.blendFuncSeparate(Te[ne],Te[he],Te[Xe],Te[Ze]),S=ne,C=he,A=Xe,F=Ze),(yt.equals(X)===!1||kt!==_)&&(i.blendColor(yt.r,yt.g,yt.b,kt),X.copy(yt),_=kt),b=T,w=!1}function st(T,te){T.side===Lt?Ve(i.CULL_FACE):de(i.CULL_FACE);let ne=T.side===Nt;te&&(ne=!ne),Le(ne),T.blending===Ei&&T.transparent===!1?me(Rn):me(T.blending,T.blendEquation,T.blendSrc,T.blendDst,T.blendEquationAlpha,T.blendSrcAlpha,T.blendDstAlpha,T.blendColor,T.blendAlpha,T.premultipliedAlpha),c.setFunc(T.depthFunc),c.setTest(T.depthTest),c.setMask(T.depthWrite),a.setMask(T.colorWrite);const he=T.stencilWrite;l.setTest(he),he&&(l.setMask(T.stencilWriteMask),l.setFunc(T.stencilFunc,T.stencilRef,T.stencilFuncMask),l.setOp(T.stencilFail,T.stencilZFail,T.stencilZPass)),O(T.polygonOffset,T.polygonOffsetFactor,T.polygonOffsetUnits),T.alphaToCoverage===!0?de(i.SAMPLE_ALPHA_TO_COVERAGE):Ve(i.SAMPLE_ALPHA_TO_COVERAGE)}function Le(T){G!==T&&(T?i.frontFace(i.CW):i.frontFace(i.CCW),G=T)}function E(T){T!==wh?(de(i.CULL_FACE),T!==j&&(T===Na?i.cullFace(i.BACK):T===Th?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ve(i.CULL_FACE),j=T}function x(T){T!==L&&(V&&i.lineWidth(T),L=T)}function O(T,te,ne){T?(de(i.POLYGON_OFFSET_FILL),(U!==te||D!==ne)&&(i.polygonOffset(te,ne),U=te,D=ne)):Ve(i.POLYGON_OFFSET_FILL)}function Q(T){T?de(i.SCISSOR_TEST):Ve(i.SCISSOR_TEST)}function $(T){T===void 0&&(T=i.TEXTURE0+W-1),ee!==T&&(i.activeTexture(T),ee=T)}function J(T,te,ne){ne===void 0&&(ee===null?ne=i.TEXTURE0+W-1:ne=ee);let he=se[ne];he===void 0&&(he={type:void 0,texture:void 0},se[ne]=he),(he.type!==T||he.texture!==te)&&(ee!==ne&&(i.activeTexture(ne),ee=ne),i.bindTexture(T,te||Me[T]),he.type=T,he.texture=te)}function ue(){const T=se[ee];T!==void 0&&T.type!==void 0&&(i.bindTexture(T.type,null),T.type=void 0,T.texture=void 0)}function re(){try{i.compressedTexImage2D.apply(i,arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function ce(){try{i.compressedTexImage3D.apply(i,arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function be(){try{i.texSubImage2D.apply(i,arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function Ue(){try{i.texSubImage3D.apply(i,arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function K(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function qe(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function Be(){try{i.texStorage2D.apply(i,arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function Ae(){try{i.texStorage3D.apply(i,arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function ge(){try{i.texImage2D.apply(i,arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function le(){try{i.texImage3D.apply(i,arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function De(T){Z.equals(T)===!1&&(i.scissor(T.x,T.y,T.z,T.w),Z.copy(T))}function We(T){oe.equals(T)===!1&&(i.viewport(T.x,T.y,T.z,T.w),oe.copy(T))}function tt(T,te){let ne=d.get(te);ne===void 0&&(ne=new WeakMap,d.set(te,ne));let he=ne.get(T);he===void 0&&(he=i.getUniformBlockIndex(te,T.name),ne.set(T,he))}function ke(T,te){const he=d.get(te).get(T);h.get(te)!==he&&(i.uniformBlockBinding(te,he,T.__bindingPointIndex),h.set(te,he))}function $e(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),p={},ee=null,se={},m={},g=new WeakMap,v=[],f=null,u=!1,b=null,M=null,S=null,C=null,R=null,A=null,F=null,X=new Fe(0,0,0),_=0,w=!1,G=null,j=null,L=null,U=null,D=null,Z.set(0,0,i.canvas.width,i.canvas.height),oe.set(0,0,i.canvas.width,i.canvas.height),a.reset(),c.reset(),l.reset()}return{buffers:{color:a,depth:c,stencil:l},enable:de,disable:Ve,bindFramebuffer:Ce,drawBuffers:N,useProgram:Mt,setBlending:me,setMaterial:st,setFlipSided:Le,setCullFace:E,setLineWidth:x,setPolygonOffset:O,setScissorTest:Q,activeTexture:$,bindTexture:J,unbindTexture:ue,compressedTexImage2D:re,compressedTexImage3D:ce,texImage2D:ge,texImage3D:le,updateUBOMapping:tt,uniformBlockBinding:ke,texStorage2D:Be,texStorage3D:Ae,texSubImage2D:be,texSubImage3D:Ue,compressedTexSubImage2D:K,compressedTexSubImage3D:qe,scissor:De,viewport:We,reset:$e}}function yg(i,e,t,n,s,r,o){const a=s.isWebGL2,c=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let d;const p=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(E,x){return m?new OffscreenCanvas(E,x):Vs("canvas")}function v(E,x,O,Q){let $=1;if((E.width>Q||E.height>Q)&&($=Q/Math.max(E.width,E.height)),$<1||x===!0)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap){const J=x?ra:Math.floor,ue=J($*E.width),re=J($*E.height);d===void 0&&(d=g(ue,re));const ce=O?g(ue,re):d;return ce.width=ue,ce.height=re,ce.getContext("2d").drawImage(E,0,0,ue,re),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+E.width+"x"+E.height+") to ("+ue+"x"+re+")."),ce}else return"data"in E&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+E.width+"x"+E.height+")."),E;return E}function f(E){return mo(E.width)&&mo(E.height)}function u(E){return a?!1:E.wrapS!==$t||E.wrapT!==$t||E.minFilter!==Pt&&E.minFilter!==It}function b(E,x){return E.generateMipmaps&&x&&E.minFilter!==Pt&&E.minFilter!==It}function M(E){i.generateMipmap(E)}function S(E,x,O,Q,$=!1){if(a===!1)return x;if(E!==null){if(i[E]!==void 0)return i[E];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let J=x;if(x===i.RED&&(O===i.FLOAT&&(J=i.R32F),O===i.HALF_FLOAT&&(J=i.R16F),O===i.UNSIGNED_BYTE&&(J=i.R8)),x===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(J=i.R8UI),O===i.UNSIGNED_SHORT&&(J=i.R16UI),O===i.UNSIGNED_INT&&(J=i.R32UI),O===i.BYTE&&(J=i.R8I),O===i.SHORT&&(J=i.R16I),O===i.INT&&(J=i.R32I)),x===i.RG&&(O===i.FLOAT&&(J=i.RG32F),O===i.HALF_FLOAT&&(J=i.RG16F),O===i.UNSIGNED_BYTE&&(J=i.RG8)),x===i.RGBA){const ue=$?Bs:je.getTransfer(Q);O===i.FLOAT&&(J=i.RGBA32F),O===i.HALF_FLOAT&&(J=i.RGBA16F),O===i.UNSIGNED_BYTE&&(J=ue===nt?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function C(E,x,O){return b(E,O)===!0||E.isFramebufferTexture&&E.minFilter!==Pt&&E.minFilter!==It?Math.log2(Math.max(x.width,x.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?x.mipmaps.length:1}function R(E){return E===Pt||E===ka||E===Bi?i.NEAREST:i.LINEAR}function A(E){const x=E.target;x.removeEventListener("dispose",A),X(x),x.isVideoTexture&&h.delete(x)}function F(E){const x=E.target;x.removeEventListener("dispose",F),w(x)}function X(E){const x=n.get(E);if(x.__webglInit===void 0)return;const O=E.source,Q=p.get(O);if(Q){const $=Q[x.__cacheKey];$.usedTimes--,$.usedTimes===0&&_(E),Object.keys(Q).length===0&&p.delete(O)}n.remove(E)}function _(E){const x=n.get(E);i.deleteTexture(x.__webglTexture);const O=E.source,Q=p.get(O);delete Q[x.__cacheKey],o.memory.textures--}function w(E){const x=E.texture,O=n.get(E),Q=n.get(x);if(Q.__webglTexture!==void 0&&(i.deleteTexture(Q.__webglTexture),o.memory.textures--),E.depthTexture&&E.depthTexture.dispose(),E.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(O.__webglFramebuffer[$]))for(let J=0;J<O.__webglFramebuffer[$].length;J++)i.deleteFramebuffer(O.__webglFramebuffer[$][J]);else i.deleteFramebuffer(O.__webglFramebuffer[$]);O.__webglDepthbuffer&&i.deleteRenderbuffer(O.__webglDepthbuffer[$])}else{if(Array.isArray(O.__webglFramebuffer))for(let $=0;$<O.__webglFramebuffer.length;$++)i.deleteFramebuffer(O.__webglFramebuffer[$]);else i.deleteFramebuffer(O.__webglFramebuffer);if(O.__webglDepthbuffer&&i.deleteRenderbuffer(O.__webglDepthbuffer),O.__webglMultisampledFramebuffer&&i.deleteFramebuffer(O.__webglMultisampledFramebuffer),O.__webglColorRenderbuffer)for(let $=0;$<O.__webglColorRenderbuffer.length;$++)O.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(O.__webglColorRenderbuffer[$]);O.__webglDepthRenderbuffer&&i.deleteRenderbuffer(O.__webglDepthRenderbuffer)}if(E.isWebGLMultipleRenderTargets)for(let $=0,J=x.length;$<J;$++){const ue=n.get(x[$]);ue.__webglTexture&&(i.deleteTexture(ue.__webglTexture),o.memory.textures--),n.remove(x[$])}n.remove(x),n.remove(E)}let G=0;function j(){G=0}function L(){const E=G;return E>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+s.maxTextures),G+=1,E}function U(E){const x=[];return x.push(E.wrapS),x.push(E.wrapT),x.push(E.wrapR||0),x.push(E.magFilter),x.push(E.minFilter),x.push(E.anisotropy),x.push(E.internalFormat),x.push(E.format),x.push(E.type),x.push(E.generateMipmaps),x.push(E.premultiplyAlpha),x.push(E.flipY),x.push(E.unpackAlignment),x.push(E.colorSpace),x.join()}function D(E,x){const O=n.get(E);if(E.isVideoTexture&&st(E),E.isRenderTargetTexture===!1&&E.version>0&&O.__version!==E.version){const Q=E.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Z(O,E,x);return}}t.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+x)}function W(E,x){const O=n.get(E);if(E.version>0&&O.__version!==E.version){Z(O,E,x);return}t.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+x)}function V(E,x){const O=n.get(E);if(E.version>0&&O.__version!==E.version){Z(O,E,x);return}t.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+x)}function q(E,x){const O=n.get(E);if(E.version>0&&O.__version!==E.version){oe(O,E,x);return}t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+x)}const Y={[ea]:i.REPEAT,[$t]:i.CLAMP_TO_EDGE,[ta]:i.MIRRORED_REPEAT},ee={[Pt]:i.NEAREST,[ka]:i.NEAREST_MIPMAP_NEAREST,[Bi]:i.NEAREST_MIPMAP_LINEAR,[It]:i.LINEAR,[sr]:i.LINEAR_MIPMAP_NEAREST,[Wn]:i.LINEAR_MIPMAP_LINEAR},se={[pd]:i.NEVER,[Md]:i.ALWAYS,[md]:i.LESS,[Hc]:i.LEQUAL,[gd]:i.EQUAL,[xd]:i.GEQUAL,[_d]:i.GREATER,[vd]:i.NOTEQUAL};function we(E,x,O){if(x.type===pn&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===It||x.magFilter===sr||x.magFilter===Bi||x.magFilter===Wn||x.minFilter===It||x.minFilter===sr||x.minFilter===Bi||x.minFilter===Wn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),O?(i.texParameteri(E,i.TEXTURE_WRAP_S,Y[x.wrapS]),i.texParameteri(E,i.TEXTURE_WRAP_T,Y[x.wrapT]),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,Y[x.wrapR]),i.texParameteri(E,i.TEXTURE_MAG_FILTER,ee[x.magFilter]),i.texParameteri(E,i.TEXTURE_MIN_FILTER,ee[x.minFilter])):(i.texParameteri(E,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(E,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(x.wrapS!==$t||x.wrapT!==$t)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(E,i.TEXTURE_MAG_FILTER,R(x.magFilter)),i.texParameteri(E,i.TEXTURE_MIN_FILTER,R(x.minFilter)),x.minFilter!==Pt&&x.minFilter!==It&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),x.compareFunction&&(i.texParameteri(E,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(E,i.TEXTURE_COMPARE_FUNC,se[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const Q=e.get("EXT_texture_filter_anisotropic");if(x.magFilter===Pt||x.minFilter!==Bi&&x.minFilter!==Wn||x.type===pn&&e.has("OES_texture_float_linear")===!1||a===!1&&x.type===Ji&&e.has("OES_texture_half_float_linear")===!1)return;(x.anisotropy>1||n.get(x).__currentAnisotropy)&&(i.texParameterf(E,Q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy)}}function H(E,x){let O=!1;E.__webglInit===void 0&&(E.__webglInit=!0,x.addEventListener("dispose",A));const Q=x.source;let $=p.get(Q);$===void 0&&($={},p.set(Q,$));const J=U(x);if(J!==E.__cacheKey){$[J]===void 0&&($[J]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,O=!0),$[J].usedTimes++;const ue=$[E.__cacheKey];ue!==void 0&&($[E.__cacheKey].usedTimes--,ue.usedTimes===0&&_(x)),E.__cacheKey=J,E.__webglTexture=$[J].texture}return O}function Z(E,x,O){let Q=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(Q=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(Q=i.TEXTURE_3D);const $=H(E,x),J=x.source;t.bindTexture(Q,E.__webglTexture,i.TEXTURE0+O);const ue=n.get(J);if(J.version!==ue.__version||$===!0){t.activeTexture(i.TEXTURE0+O);const re=je.getPrimaries(je.workingColorSpace),ce=x.colorSpace===Wt?null:je.getPrimaries(x.colorSpace),be=x.colorSpace===Wt||re===ce?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,be);const Ue=u(x)&&f(x.image)===!1;let K=v(x.image,Ue,!1,s.maxTextureSize);K=Le(x,K);const qe=f(K)||a,Be=r.convert(x.format,x.colorSpace);let Ae=r.convert(x.type),ge=S(x.internalFormat,Be,Ae,x.colorSpace,x.isVideoTexture);we(Q,x,qe);let le;const De=x.mipmaps,We=a&&x.isVideoTexture!==!0&&ge!==Bc,tt=ue.__version===void 0||$===!0,ke=J.dataReady,$e=C(x,K,qe);if(x.isDepthTexture)ge=i.DEPTH_COMPONENT,a?x.type===pn?ge=i.DEPTH_COMPONENT32F:x.type===An?ge=i.DEPTH_COMPONENT24:x.type===qn?ge=i.DEPTH24_STENCIL8:ge=i.DEPTH_COMPONENT16:x.type===pn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),x.format===Yn&&ge===i.DEPTH_COMPONENT&&x.type!==fa&&x.type!==An&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),x.type=An,Ae=r.convert(x.type)),x.format===Li&&ge===i.DEPTH_COMPONENT&&(ge=i.DEPTH_STENCIL,x.type!==qn&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),x.type=qn,Ae=r.convert(x.type))),tt&&(We?t.texStorage2D(i.TEXTURE_2D,1,ge,K.width,K.height):t.texImage2D(i.TEXTURE_2D,0,ge,K.width,K.height,0,Be,Ae,null));else if(x.isDataTexture)if(De.length>0&&qe){We&&tt&&t.texStorage2D(i.TEXTURE_2D,$e,ge,De[0].width,De[0].height);for(let T=0,te=De.length;T<te;T++)le=De[T],We?ke&&t.texSubImage2D(i.TEXTURE_2D,T,0,0,le.width,le.height,Be,Ae,le.data):t.texImage2D(i.TEXTURE_2D,T,ge,le.width,le.height,0,Be,Ae,le.data);x.generateMipmaps=!1}else We?(tt&&t.texStorage2D(i.TEXTURE_2D,$e,ge,K.width,K.height),ke&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,K.width,K.height,Be,Ae,K.data)):t.texImage2D(i.TEXTURE_2D,0,ge,K.width,K.height,0,Be,Ae,K.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){We&&tt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,$e,ge,De[0].width,De[0].height,K.depth);for(let T=0,te=De.length;T<te;T++)le=De[T],x.format!==Kt?Be!==null?We?ke&&t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,T,0,0,0,le.width,le.height,K.depth,Be,le.data,0,0):t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,T,ge,le.width,le.height,K.depth,0,le.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):We?ke&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,T,0,0,0,le.width,le.height,K.depth,Be,Ae,le.data):t.texImage3D(i.TEXTURE_2D_ARRAY,T,ge,le.width,le.height,K.depth,0,Be,Ae,le.data)}else{We&&tt&&t.texStorage2D(i.TEXTURE_2D,$e,ge,De[0].width,De[0].height);for(let T=0,te=De.length;T<te;T++)le=De[T],x.format!==Kt?Be!==null?We?ke&&t.compressedTexSubImage2D(i.TEXTURE_2D,T,0,0,le.width,le.height,Be,le.data):t.compressedTexImage2D(i.TEXTURE_2D,T,ge,le.width,le.height,0,le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):We?ke&&t.texSubImage2D(i.TEXTURE_2D,T,0,0,le.width,le.height,Be,Ae,le.data):t.texImage2D(i.TEXTURE_2D,T,ge,le.width,le.height,0,Be,Ae,le.data)}else if(x.isDataArrayTexture)We?(tt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,$e,ge,K.width,K.height,K.depth),ke&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,K.width,K.height,K.depth,Be,Ae,K.data)):t.texImage3D(i.TEXTURE_2D_ARRAY,0,ge,K.width,K.height,K.depth,0,Be,Ae,K.data);else if(x.isData3DTexture)We?(tt&&t.texStorage3D(i.TEXTURE_3D,$e,ge,K.width,K.height,K.depth),ke&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,K.width,K.height,K.depth,Be,Ae,K.data)):t.texImage3D(i.TEXTURE_3D,0,ge,K.width,K.height,K.depth,0,Be,Ae,K.data);else if(x.isFramebufferTexture){if(tt)if(We)t.texStorage2D(i.TEXTURE_2D,$e,ge,K.width,K.height);else{let T=K.width,te=K.height;for(let ne=0;ne<$e;ne++)t.texImage2D(i.TEXTURE_2D,ne,ge,T,te,0,Be,Ae,null),T>>=1,te>>=1}}else if(De.length>0&&qe){We&&tt&&t.texStorage2D(i.TEXTURE_2D,$e,ge,De[0].width,De[0].height);for(let T=0,te=De.length;T<te;T++)le=De[T],We?ke&&t.texSubImage2D(i.TEXTURE_2D,T,0,0,Be,Ae,le):t.texImage2D(i.TEXTURE_2D,T,ge,Be,Ae,le);x.generateMipmaps=!1}else We?(tt&&t.texStorage2D(i.TEXTURE_2D,$e,ge,K.width,K.height),ke&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Be,Ae,K)):t.texImage2D(i.TEXTURE_2D,0,ge,Be,Ae,K);b(x,qe)&&M(Q),ue.__version=J.version,x.onUpdate&&x.onUpdate(x)}E.__version=x.version}function oe(E,x,O){if(x.image.length!==6)return;const Q=H(E,x),$=x.source;t.bindTexture(i.TEXTURE_CUBE_MAP,E.__webglTexture,i.TEXTURE0+O);const J=n.get($);if($.version!==J.__version||Q===!0){t.activeTexture(i.TEXTURE0+O);const ue=je.getPrimaries(je.workingColorSpace),re=x.colorSpace===Wt?null:je.getPrimaries(x.colorSpace),ce=x.colorSpace===Wt||ue===re?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ce);const be=x.isCompressedTexture||x.image[0].isCompressedTexture,Ue=x.image[0]&&x.image[0].isDataTexture,K=[];for(let T=0;T<6;T++)!be&&!Ue?K[T]=v(x.image[T],!1,!0,s.maxCubemapSize):K[T]=Ue?x.image[T].image:x.image[T],K[T]=Le(x,K[T]);const qe=K[0],Be=f(qe)||a,Ae=r.convert(x.format,x.colorSpace),ge=r.convert(x.type),le=S(x.internalFormat,Ae,ge,x.colorSpace),De=a&&x.isVideoTexture!==!0,We=J.__version===void 0||Q===!0,tt=$.dataReady;let ke=C(x,qe,Be);we(i.TEXTURE_CUBE_MAP,x,Be);let $e;if(be){De&&We&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ke,le,qe.width,qe.height);for(let T=0;T<6;T++){$e=K[T].mipmaps;for(let te=0;te<$e.length;te++){const ne=$e[te];x.format!==Kt?Ae!==null?De?tt&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+T,te,0,0,ne.width,ne.height,Ae,ne.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+T,te,le,ne.width,ne.height,0,ne.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):De?tt&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+T,te,0,0,ne.width,ne.height,Ae,ge,ne.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+T,te,le,ne.width,ne.height,0,Ae,ge,ne.data)}}}else{$e=x.mipmaps,De&&We&&($e.length>0&&ke++,t.texStorage2D(i.TEXTURE_CUBE_MAP,ke,le,K[0].width,K[0].height));for(let T=0;T<6;T++)if(Ue){De?tt&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+T,0,0,0,K[T].width,K[T].height,Ae,ge,K[T].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+T,0,le,K[T].width,K[T].height,0,Ae,ge,K[T].data);for(let te=0;te<$e.length;te++){const he=$e[te].image[T].image;De?tt&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+T,te+1,0,0,he.width,he.height,Ae,ge,he.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+T,te+1,le,he.width,he.height,0,Ae,ge,he.data)}}else{De?tt&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+T,0,0,0,Ae,ge,K[T]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+T,0,le,Ae,ge,K[T]);for(let te=0;te<$e.length;te++){const ne=$e[te];De?tt&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+T,te+1,0,0,Ae,ge,ne.image[T]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+T,te+1,le,Ae,ge,ne.image[T])}}}b(x,Be)&&M(i.TEXTURE_CUBE_MAP),J.__version=$.version,x.onUpdate&&x.onUpdate(x)}E.__version=x.version}function xe(E,x,O,Q,$,J){const ue=r.convert(O.format,O.colorSpace),re=r.convert(O.type),ce=S(O.internalFormat,ue,re,O.colorSpace);if(!n.get(x).__hasExternalTextures){const Ue=Math.max(1,x.width>>J),K=Math.max(1,x.height>>J);$===i.TEXTURE_3D||$===i.TEXTURE_2D_ARRAY?t.texImage3D($,J,ce,Ue,K,x.depth,0,ue,re,null):t.texImage2D($,J,ce,Ue,K,0,ue,re,null)}t.bindFramebuffer(i.FRAMEBUFFER,E),me(x)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Q,$,n.get(O).__webglTexture,0,Te(x)):($===i.TEXTURE_2D||$>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Q,$,n.get(O).__webglTexture,J),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Me(E,x,O){if(i.bindRenderbuffer(i.RENDERBUFFER,E),x.depthBuffer&&!x.stencilBuffer){let Q=a===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(O||me(x)){const $=x.depthTexture;$&&$.isDepthTexture&&($.type===pn?Q=i.DEPTH_COMPONENT32F:$.type===An&&(Q=i.DEPTH_COMPONENT24));const J=Te(x);me(x)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,J,Q,x.width,x.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,J,Q,x.width,x.height)}else i.renderbufferStorage(i.RENDERBUFFER,Q,x.width,x.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,E)}else if(x.depthBuffer&&x.stencilBuffer){const Q=Te(x);O&&me(x)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Q,i.DEPTH24_STENCIL8,x.width,x.height):me(x)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Q,i.DEPTH24_STENCIL8,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,E)}else{const Q=x.isWebGLMultipleRenderTargets===!0?x.texture:[x.texture];for(let $=0;$<Q.length;$++){const J=Q[$],ue=r.convert(J.format,J.colorSpace),re=r.convert(J.type),ce=S(J.internalFormat,ue,re,J.colorSpace),be=Te(x);O&&me(x)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,be,ce,x.width,x.height):me(x)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,be,ce,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,ce,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function de(E,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,E),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(x.depthTexture).__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),D(x.depthTexture,0);const Q=n.get(x.depthTexture).__webglTexture,$=Te(x);if(x.depthTexture.format===Yn)me(x)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0);else if(x.depthTexture.format===Li)me(x)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function Ve(E){const x=n.get(E),O=E.isWebGLCubeRenderTarget===!0;if(E.depthTexture&&!x.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");de(x.__webglFramebuffer,E)}else if(O){x.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[Q]),x.__webglDepthbuffer[Q]=i.createRenderbuffer(),Me(x.__webglDepthbuffer[Q],E,!1)}else t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer=i.createRenderbuffer(),Me(x.__webglDepthbuffer,E,!1);t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ce(E,x,O){const Q=n.get(E);x!==void 0&&xe(Q.__webglFramebuffer,E,E.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&Ve(E)}function N(E){const x=E.texture,O=n.get(E),Q=n.get(x);E.addEventListener("dispose",F),E.isWebGLMultipleRenderTargets!==!0&&(Q.__webglTexture===void 0&&(Q.__webglTexture=i.createTexture()),Q.__version=x.version,o.memory.textures++);const $=E.isWebGLCubeRenderTarget===!0,J=E.isWebGLMultipleRenderTargets===!0,ue=f(E)||a;if($){O.__webglFramebuffer=[];for(let re=0;re<6;re++)if(a&&x.mipmaps&&x.mipmaps.length>0){O.__webglFramebuffer[re]=[];for(let ce=0;ce<x.mipmaps.length;ce++)O.__webglFramebuffer[re][ce]=i.createFramebuffer()}else O.__webglFramebuffer[re]=i.createFramebuffer()}else{if(a&&x.mipmaps&&x.mipmaps.length>0){O.__webglFramebuffer=[];for(let re=0;re<x.mipmaps.length;re++)O.__webglFramebuffer[re]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(J)if(s.drawBuffers){const re=E.texture;for(let ce=0,be=re.length;ce<be;ce++){const Ue=n.get(re[ce]);Ue.__webglTexture===void 0&&(Ue.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&E.samples>0&&me(E)===!1){const re=J?x:[x];O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let ce=0;ce<re.length;ce++){const be=re[ce];O.__webglColorRenderbuffer[ce]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[ce]);const Ue=r.convert(be.format,be.colorSpace),K=r.convert(be.type),qe=S(be.internalFormat,Ue,K,be.colorSpace,E.isXRRenderTarget===!0),Be=Te(E);i.renderbufferStorageMultisample(i.RENDERBUFFER,Be,qe,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.RENDERBUFFER,O.__webglColorRenderbuffer[ce])}i.bindRenderbuffer(i.RENDERBUFFER,null),E.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),Me(O.__webglDepthRenderbuffer,E,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if($){t.bindTexture(i.TEXTURE_CUBE_MAP,Q.__webglTexture),we(i.TEXTURE_CUBE_MAP,x,ue);for(let re=0;re<6;re++)if(a&&x.mipmaps&&x.mipmaps.length>0)for(let ce=0;ce<x.mipmaps.length;ce++)xe(O.__webglFramebuffer[re][ce],E,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+re,ce);else xe(O.__webglFramebuffer[re],E,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0);b(x,ue)&&M(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(J){const re=E.texture;for(let ce=0,be=re.length;ce<be;ce++){const Ue=re[ce],K=n.get(Ue);t.bindTexture(i.TEXTURE_2D,K.__webglTexture),we(i.TEXTURE_2D,Ue,ue),xe(O.__webglFramebuffer,E,Ue,i.COLOR_ATTACHMENT0+ce,i.TEXTURE_2D,0),b(Ue,ue)&&M(i.TEXTURE_2D)}t.unbindTexture()}else{let re=i.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(a?re=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(re,Q.__webglTexture),we(re,x,ue),a&&x.mipmaps&&x.mipmaps.length>0)for(let ce=0;ce<x.mipmaps.length;ce++)xe(O.__webglFramebuffer[ce],E,x,i.COLOR_ATTACHMENT0,re,ce);else xe(O.__webglFramebuffer,E,x,i.COLOR_ATTACHMENT0,re,0);b(x,ue)&&M(re),t.unbindTexture()}E.depthBuffer&&Ve(E)}function Mt(E){const x=f(E)||a,O=E.isWebGLMultipleRenderTargets===!0?E.texture:[E.texture];for(let Q=0,$=O.length;Q<$;Q++){const J=O[Q];if(b(J,x)){const ue=E.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,re=n.get(J).__webglTexture;t.bindTexture(ue,re),M(ue),t.unbindTexture()}}}function _e(E){if(a&&E.samples>0&&me(E)===!1){const x=E.isWebGLMultipleRenderTargets?E.texture:[E.texture],O=E.width,Q=E.height;let $=i.COLOR_BUFFER_BIT;const J=[],ue=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=n.get(E),ce=E.isWebGLMultipleRenderTargets===!0;if(ce)for(let be=0;be<x.length;be++)t.bindFramebuffer(i.FRAMEBUFFER,re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,re.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,re.__webglFramebuffer);for(let be=0;be<x.length;be++){J.push(i.COLOR_ATTACHMENT0+be),E.depthBuffer&&J.push(ue);const Ue=re.__ignoreDepthValues!==void 0?re.__ignoreDepthValues:!1;if(Ue===!1&&(E.depthBuffer&&($|=i.DEPTH_BUFFER_BIT),E.stencilBuffer&&($|=i.STENCIL_BUFFER_BIT)),ce&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,re.__webglColorRenderbuffer[be]),Ue===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[ue]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[ue])),ce){const K=n.get(x[be]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,K,0)}i.blitFramebuffer(0,0,O,Q,0,0,O,Q,$,i.NEAREST),l&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,J)}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ce)for(let be=0;be<x.length;be++){t.bindFramebuffer(i.FRAMEBUFFER,re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.RENDERBUFFER,re.__webglColorRenderbuffer[be]);const Ue=n.get(x[be]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.TEXTURE_2D,Ue,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,re.__webglMultisampledFramebuffer)}}function Te(E){return Math.min(s.maxSamples,E.samples)}function me(E){const x=n.get(E);return a&&E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function st(E){const x=o.render.frame;h.get(E)!==x&&(h.set(E,x),E.update())}function Le(E,x){const O=E.colorSpace,Q=E.format,$=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||E.format===ia||O!==vn&&O!==Wt&&(je.getTransfer(O)===nt?a===!1?e.has("EXT_sRGB")===!0&&Q===Kt?(E.format=ia,E.minFilter=It,E.generateMipmaps=!1):x=Wc.sRGBToLinear(x):(Q!==Kt||$!==Pn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),x}this.allocateTextureUnit=L,this.resetTextureUnits=j,this.setTexture2D=D,this.setTexture2DArray=W,this.setTexture3D=V,this.setTextureCube=q,this.rebindTextures=Ce,this.setupRenderTarget=N,this.updateRenderTargetMipmap=Mt,this.updateMultisampleRenderTarget=_e,this.setupDepthRenderbuffer=Ve,this.setupFrameBufferTexture=xe,this.useMultisampledRTT=me}function Sg(i,e,t){const n=t.isWebGL2;function s(r,o=Wt){let a;const c=je.getTransfer(o);if(r===Pn)return i.UNSIGNED_BYTE;if(r===Uc)return i.UNSIGNED_SHORT_4_4_4_4;if(r===Nc)return i.UNSIGNED_SHORT_5_5_5_1;if(r===id)return i.BYTE;if(r===sd)return i.SHORT;if(r===fa)return i.UNSIGNED_SHORT;if(r===Ic)return i.INT;if(r===An)return i.UNSIGNED_INT;if(r===pn)return i.FLOAT;if(r===Ji)return n?i.HALF_FLOAT:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===rd)return i.ALPHA;if(r===Kt)return i.RGBA;if(r===ad)return i.LUMINANCE;if(r===od)return i.LUMINANCE_ALPHA;if(r===Yn)return i.DEPTH_COMPONENT;if(r===Li)return i.DEPTH_STENCIL;if(r===ia)return a=e.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===cd)return i.RED;if(r===Fc)return i.RED_INTEGER;if(r===ld)return i.RG;if(r===Oc)return i.RG_INTEGER;if(r===zc)return i.RGBA_INTEGER;if(r===rr||r===ar||r===or||r===cr)if(c===nt)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===rr)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===ar)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===or)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===cr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===rr)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===ar)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===or)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===cr)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Ga||r===Ha||r===Va||r===Wa)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===Ga)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Ha)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Va)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Wa)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Bc)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Xa||r===qa)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(r===Xa)return c===nt?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===qa)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Ya||r===ja||r===$a||r===Ka||r===Za||r===Ja||r===Qa||r===eo||r===to||r===no||r===io||r===so||r===ro||r===ao)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(r===Ya)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===ja)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===$a)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Ka)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Za)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Ja)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Qa)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===eo)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===to)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===no)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===io)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===so)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===ro)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===ao)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===lr||r===oo||r===co)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(r===lr)return c===nt?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===oo)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===co)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===hd||r===lo||r===ho||r===uo)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(r===lr)return a.COMPRESSED_RED_RGTC1_EXT;if(r===lo)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===ho)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===uo)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===qn?n?i.UNSIGNED_INT_24_8:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}class bg extends Bt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Xt extends lt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Eg={type:"move"};class Ur{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Xt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Xt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Xt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(const v of e.hand.values()){const f=t.getJointPose(v,n),u=this._getHandJoint(l,v);f!==null&&(u.matrix.fromArray(f.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=f.radius),u.visible=f!==null}const h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],p=h.position.distanceTo(d.position),m=.02,g=.005;l.inputState.pinching&&p>m+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&p<=m-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Eg)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Xt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const wg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Tg=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepthEXT = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepthEXT = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Ag{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const s=new Dt,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}render(e,t){if(this.texture!==null){if(this.mesh===null){const n=t.cameras[0].viewport,s=new In({extensions:{fragDepth:!0},vertexShader:wg,fragmentShader:Tg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new fe(new is(20,20),s)}e.render(this.mesh,t)}}reset(){this.texture=null,this.mesh=null}}class Rg extends Ui{constructor(e,t){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,d=null,p=null,m=null,g=null;const v=new Ag,f=t.getContextAttributes();let u=null,b=null;const M=[],S=[],C=new Se;let R=null;const A=new Bt;A.layers.enable(1),A.viewport=new it;const F=new Bt;F.layers.enable(2),F.viewport=new it;const X=[A,F],_=new bg;_.layers.enable(1),_.layers.enable(2);let w=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(H){let Z=M[H];return Z===void 0&&(Z=new Ur,M[H]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(H){let Z=M[H];return Z===void 0&&(Z=new Ur,M[H]=Z),Z.getGripSpace()},this.getHand=function(H){let Z=M[H];return Z===void 0&&(Z=new Ur,M[H]=Z),Z.getHandSpace()};function j(H){const Z=S.indexOf(H.inputSource);if(Z===-1)return;const oe=M[Z];oe!==void 0&&(oe.update(H.inputSource,H.frame,l||o),oe.dispatchEvent({type:H.type,data:H.inputSource}))}function L(){s.removeEventListener("select",j),s.removeEventListener("selectstart",j),s.removeEventListener("selectend",j),s.removeEventListener("squeeze",j),s.removeEventListener("squeezestart",j),s.removeEventListener("squeezeend",j),s.removeEventListener("end",L),s.removeEventListener("inputsourceschange",U);for(let H=0;H<M.length;H++){const Z=S[H];Z!==null&&(S[H]=null,M[H].disconnect(Z))}w=null,G=null,v.reset(),e.setRenderTarget(u),m=null,p=null,d=null,s=null,b=null,we.stop(),n.isPresenting=!1,e.setPixelRatio(R),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(H){r=H,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(H){a=H,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(H){l=H},this.getBaseLayer=function(){return p!==null?p:m},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(H){if(s=H,s!==null){if(u=e.getRenderTarget(),s.addEventListener("select",j),s.addEventListener("selectstart",j),s.addEventListener("selectend",j),s.addEventListener("squeeze",j),s.addEventListener("squeezestart",j),s.addEventListener("squeezeend",j),s.addEventListener("end",L),s.addEventListener("inputsourceschange",U),f.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(C),s.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const Z={antialias:s.renderState.layers===void 0?f.antialias:!0,alpha:!0,depth:f.depth,stencil:f.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,Z),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),b=new Kn(m.framebufferWidth,m.framebufferHeight,{format:Kt,type:Pn,colorSpace:e.outputColorSpace,stencilBuffer:f.stencil})}else{let Z=null,oe=null,xe=null;f.depth&&(xe=f.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Z=f.stencil?Li:Yn,oe=f.stencil?qn:An);const Me={colorFormat:t.RGBA8,depthFormat:xe,scaleFactor:r};d=new XRWebGLBinding(s,t),p=d.createProjectionLayer(Me),s.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),b=new Kn(p.textureWidth,p.textureHeight,{format:Kt,type:Pn,depthTexture:new tl(p.textureWidth,p.textureHeight,oe,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:f.stencil,colorSpace:e.outputColorSpace,samples:f.antialias?4:0});const de=e.properties.get(b);de.__ignoreDepthValues=p.ignoreDepthValues}b.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),we.setContext(s),we.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function U(H){for(let Z=0;Z<H.removed.length;Z++){const oe=H.removed[Z],xe=S.indexOf(oe);xe>=0&&(S[xe]=null,M[xe].disconnect(oe))}for(let Z=0;Z<H.added.length;Z++){const oe=H.added[Z];let xe=S.indexOf(oe);if(xe===-1){for(let de=0;de<M.length;de++)if(de>=S.length){S.push(oe),xe=de;break}else if(S[de]===null){S[de]=oe,xe=de;break}if(xe===-1)break}const Me=M[xe];Me&&Me.connect(oe)}}const D=new P,W=new P;function V(H,Z,oe){D.setFromMatrixPosition(Z.matrixWorld),W.setFromMatrixPosition(oe.matrixWorld);const xe=D.distanceTo(W),Me=Z.projectionMatrix.elements,de=oe.projectionMatrix.elements,Ve=Me[14]/(Me[10]-1),Ce=Me[14]/(Me[10]+1),N=(Me[9]+1)/Me[5],Mt=(Me[9]-1)/Me[5],_e=(Me[8]-1)/Me[0],Te=(de[8]+1)/de[0],me=Ve*_e,st=Ve*Te,Le=xe/(-_e+Te),E=Le*-_e;Z.matrixWorld.decompose(H.position,H.quaternion,H.scale),H.translateX(E),H.translateZ(Le),H.matrixWorld.compose(H.position,H.quaternion,H.scale),H.matrixWorldInverse.copy(H.matrixWorld).invert();const x=Ve+Le,O=Ce+Le,Q=me-E,$=st+(xe-E),J=N*Ce/O*x,ue=Mt*Ce/O*x;H.projectionMatrix.makePerspective(Q,$,J,ue,x,O),H.projectionMatrixInverse.copy(H.projectionMatrix).invert()}function q(H,Z){Z===null?H.matrixWorld.copy(H.matrix):H.matrixWorld.multiplyMatrices(Z.matrixWorld,H.matrix),H.matrixWorldInverse.copy(H.matrixWorld).invert()}this.updateCamera=function(H){if(s===null)return;v.texture!==null&&(H.near=v.depthNear,H.far=v.depthFar),_.near=F.near=A.near=H.near,_.far=F.far=A.far=H.far,(w!==_.near||G!==_.far)&&(s.updateRenderState({depthNear:_.near,depthFar:_.far}),w=_.near,G=_.far,A.near=w,A.far=G,F.near=w,F.far=G,A.updateProjectionMatrix(),F.updateProjectionMatrix(),H.updateProjectionMatrix());const Z=H.parent,oe=_.cameras;q(_,Z);for(let xe=0;xe<oe.length;xe++)q(oe[xe],Z);oe.length===2?V(_,A,F):_.projectionMatrix.copy(A.projectionMatrix),Y(H,_,Z)};function Y(H,Z,oe){oe===null?H.matrix.copy(Z.matrixWorld):(H.matrix.copy(oe.matrixWorld),H.matrix.invert(),H.matrix.multiply(Z.matrixWorld)),H.matrix.decompose(H.position,H.quaternion,H.scale),H.updateMatrixWorld(!0),H.projectionMatrix.copy(Z.projectionMatrix),H.projectionMatrixInverse.copy(Z.projectionMatrixInverse),H.isPerspectiveCamera&&(H.fov=sa*2*Math.atan(1/H.projectionMatrix.elements[5]),H.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(p===null&&m===null))return c},this.setFoveation=function(H){c=H,p!==null&&(p.fixedFoveation=H),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=H)},this.hasDepthSensing=function(){return v.texture!==null};let ee=null;function se(H,Z){if(h=Z.getViewerPose(l||o),g=Z,h!==null){const oe=h.views;m!==null&&(e.setRenderTargetFramebuffer(b,m.framebuffer),e.setRenderTarget(b));let xe=!1;oe.length!==_.cameras.length&&(_.cameras.length=0,xe=!0);for(let de=0;de<oe.length;de++){const Ve=oe[de];let Ce=null;if(m!==null)Ce=m.getViewport(Ve);else{const Mt=d.getViewSubImage(p,Ve);Ce=Mt.viewport,de===0&&(e.setRenderTargetTextures(b,Mt.colorTexture,p.ignoreDepthValues?void 0:Mt.depthStencilTexture),e.setRenderTarget(b))}let N=X[de];N===void 0&&(N=new Bt,N.layers.enable(de),N.viewport=new it,X[de]=N),N.matrix.fromArray(Ve.transform.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale),N.projectionMatrix.fromArray(Ve.projectionMatrix),N.projectionMatrixInverse.copy(N.projectionMatrix).invert(),N.viewport.set(Ce.x,Ce.y,Ce.width,Ce.height),de===0&&(_.matrix.copy(N.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),xe===!0&&_.cameras.push(N)}const Me=s.enabledFeatures;if(Me&&Me.includes("depth-sensing")){const de=d.getDepthInformation(oe[0]);de&&de.isValid&&de.texture&&v.init(e,de,s.renderState)}}for(let oe=0;oe<M.length;oe++){const xe=S[oe],Me=M[oe];xe!==null&&Me!==void 0&&Me.update(xe,Z,l||o)}v.render(e,_),ee&&ee(H,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),g=null}const we=new Qc;we.setAnimationLoop(se),this.setAnimationLoop=function(H){ee=H},this.dispose=function(){}}}function Cg(i,e){function t(f,u){f.matrixAutoUpdate===!0&&f.updateMatrix(),u.value.copy(f.matrix)}function n(f,u){u.color.getRGB(f.fogColor.value,Kc(i)),u.isFog?(f.fogNear.value=u.near,f.fogFar.value=u.far):u.isFogExp2&&(f.fogDensity.value=u.density)}function s(f,u,b,M,S){u.isMeshBasicMaterial||u.isMeshLambertMaterial?r(f,u):u.isMeshToonMaterial?(r(f,u),d(f,u)):u.isMeshPhongMaterial?(r(f,u),h(f,u)):u.isMeshStandardMaterial?(r(f,u),p(f,u),u.isMeshPhysicalMaterial&&m(f,u,S)):u.isMeshMatcapMaterial?(r(f,u),g(f,u)):u.isMeshDepthMaterial?r(f,u):u.isMeshDistanceMaterial?(r(f,u),v(f,u)):u.isMeshNormalMaterial?r(f,u):u.isLineBasicMaterial?(o(f,u),u.isLineDashedMaterial&&a(f,u)):u.isPointsMaterial?c(f,u,b,M):u.isSpriteMaterial?l(f,u):u.isShadowMaterial?(f.color.value.copy(u.color),f.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(f,u){f.opacity.value=u.opacity,u.color&&f.diffuse.value.copy(u.color),u.emissive&&f.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(f.map.value=u.map,t(u.map,f.mapTransform)),u.alphaMap&&(f.alphaMap.value=u.alphaMap,t(u.alphaMap,f.alphaMapTransform)),u.bumpMap&&(f.bumpMap.value=u.bumpMap,t(u.bumpMap,f.bumpMapTransform),f.bumpScale.value=u.bumpScale,u.side===Nt&&(f.bumpScale.value*=-1)),u.normalMap&&(f.normalMap.value=u.normalMap,t(u.normalMap,f.normalMapTransform),f.normalScale.value.copy(u.normalScale),u.side===Nt&&f.normalScale.value.negate()),u.displacementMap&&(f.displacementMap.value=u.displacementMap,t(u.displacementMap,f.displacementMapTransform),f.displacementScale.value=u.displacementScale,f.displacementBias.value=u.displacementBias),u.emissiveMap&&(f.emissiveMap.value=u.emissiveMap,t(u.emissiveMap,f.emissiveMapTransform)),u.specularMap&&(f.specularMap.value=u.specularMap,t(u.specularMap,f.specularMapTransform)),u.alphaTest>0&&(f.alphaTest.value=u.alphaTest);const b=e.get(u).envMap;if(b&&(f.envMap.value=b,f.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,f.reflectivity.value=u.reflectivity,f.ior.value=u.ior,f.refractionRatio.value=u.refractionRatio),u.lightMap){f.lightMap.value=u.lightMap;const M=i._useLegacyLights===!0?Math.PI:1;f.lightMapIntensity.value=u.lightMapIntensity*M,t(u.lightMap,f.lightMapTransform)}u.aoMap&&(f.aoMap.value=u.aoMap,f.aoMapIntensity.value=u.aoMapIntensity,t(u.aoMap,f.aoMapTransform))}function o(f,u){f.diffuse.value.copy(u.color),f.opacity.value=u.opacity,u.map&&(f.map.value=u.map,t(u.map,f.mapTransform))}function a(f,u){f.dashSize.value=u.dashSize,f.totalSize.value=u.dashSize+u.gapSize,f.scale.value=u.scale}function c(f,u,b,M){f.diffuse.value.copy(u.color),f.opacity.value=u.opacity,f.size.value=u.size*b,f.scale.value=M*.5,u.map&&(f.map.value=u.map,t(u.map,f.uvTransform)),u.alphaMap&&(f.alphaMap.value=u.alphaMap,t(u.alphaMap,f.alphaMapTransform)),u.alphaTest>0&&(f.alphaTest.value=u.alphaTest)}function l(f,u){f.diffuse.value.copy(u.color),f.opacity.value=u.opacity,f.rotation.value=u.rotation,u.map&&(f.map.value=u.map,t(u.map,f.mapTransform)),u.alphaMap&&(f.alphaMap.value=u.alphaMap,t(u.alphaMap,f.alphaMapTransform)),u.alphaTest>0&&(f.alphaTest.value=u.alphaTest)}function h(f,u){f.specular.value.copy(u.specular),f.shininess.value=Math.max(u.shininess,1e-4)}function d(f,u){u.gradientMap&&(f.gradientMap.value=u.gradientMap)}function p(f,u){f.metalness.value=u.metalness,u.metalnessMap&&(f.metalnessMap.value=u.metalnessMap,t(u.metalnessMap,f.metalnessMapTransform)),f.roughness.value=u.roughness,u.roughnessMap&&(f.roughnessMap.value=u.roughnessMap,t(u.roughnessMap,f.roughnessMapTransform)),e.get(u).envMap&&(f.envMapIntensity.value=u.envMapIntensity)}function m(f,u,b){f.ior.value=u.ior,u.sheen>0&&(f.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),f.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(f.sheenColorMap.value=u.sheenColorMap,t(u.sheenColorMap,f.sheenColorMapTransform)),u.sheenRoughnessMap&&(f.sheenRoughnessMap.value=u.sheenRoughnessMap,t(u.sheenRoughnessMap,f.sheenRoughnessMapTransform))),u.clearcoat>0&&(f.clearcoat.value=u.clearcoat,f.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(f.clearcoatMap.value=u.clearcoatMap,t(u.clearcoatMap,f.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,t(u.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(f.clearcoatNormalMap.value=u.clearcoatNormalMap,t(u.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===Nt&&f.clearcoatNormalScale.value.negate())),u.iridescence>0&&(f.iridescence.value=u.iridescence,f.iridescenceIOR.value=u.iridescenceIOR,f.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(f.iridescenceMap.value=u.iridescenceMap,t(u.iridescenceMap,f.iridescenceMapTransform)),u.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=u.iridescenceThicknessMap,t(u.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),u.transmission>0&&(f.transmission.value=u.transmission,f.transmissionSamplerMap.value=b.texture,f.transmissionSamplerSize.value.set(b.width,b.height),u.transmissionMap&&(f.transmissionMap.value=u.transmissionMap,t(u.transmissionMap,f.transmissionMapTransform)),f.thickness.value=u.thickness,u.thicknessMap&&(f.thicknessMap.value=u.thicknessMap,t(u.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=u.attenuationDistance,f.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(f.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(f.anisotropyMap.value=u.anisotropyMap,t(u.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=u.specularIntensity,f.specularColor.value.copy(u.specularColor),u.specularColorMap&&(f.specularColorMap.value=u.specularColorMap,t(u.specularColorMap,f.specularColorMapTransform)),u.specularIntensityMap&&(f.specularIntensityMap.value=u.specularIntensityMap,t(u.specularIntensityMap,f.specularIntensityMapTransform))}function g(f,u){u.matcap&&(f.matcap.value=u.matcap)}function v(f,u){const b=e.get(u).light;f.referencePosition.value.setFromMatrixPosition(b.matrixWorld),f.nearDistance.value=b.shadow.camera.near,f.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Pg(i,e,t,n){let s={},r={},o=[];const a=t.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(b,M){const S=M.program;n.uniformBlockBinding(b,S)}function l(b,M){let S=s[b.id];S===void 0&&(g(b),S=h(b),s[b.id]=S,b.addEventListener("dispose",f));const C=M.program;n.updateUBOMapping(b,C);const R=e.render.frame;r[b.id]!==R&&(p(b),r[b.id]=R)}function h(b){const M=d();b.__bindingPointIndex=M;const S=i.createBuffer(),C=b.__size,R=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,C,R),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,S),S}function d(){for(let b=0;b<a;b++)if(o.indexOf(b)===-1)return o.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(b){const M=s[b.id],S=b.uniforms,C=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let R=0,A=S.length;R<A;R++){const F=Array.isArray(S[R])?S[R]:[S[R]];for(let X=0,_=F.length;X<_;X++){const w=F[X];if(m(w,R,X,C)===!0){const G=w.__offset,j=Array.isArray(w.value)?w.value:[w.value];let L=0;for(let U=0;U<j.length;U++){const D=j[U],W=v(D);typeof D=="number"||typeof D=="boolean"?(w.__data[0]=D,i.bufferSubData(i.UNIFORM_BUFFER,G+L,w.__data)):D.isMatrix3?(w.__data[0]=D.elements[0],w.__data[1]=D.elements[1],w.__data[2]=D.elements[2],w.__data[3]=0,w.__data[4]=D.elements[3],w.__data[5]=D.elements[4],w.__data[6]=D.elements[5],w.__data[7]=0,w.__data[8]=D.elements[6],w.__data[9]=D.elements[7],w.__data[10]=D.elements[8],w.__data[11]=0):(D.toArray(w.__data,L),L+=W.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,G,w.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(b,M,S,C){const R=b.value,A=M+"_"+S;if(C[A]===void 0)return typeof R=="number"||typeof R=="boolean"?C[A]=R:C[A]=R.clone(),!0;{const F=C[A];if(typeof R=="number"||typeof R=="boolean"){if(F!==R)return C[A]=R,!0}else if(F.equals(R)===!1)return F.copy(R),!0}return!1}function g(b){const M=b.uniforms;let S=0;const C=16;for(let A=0,F=M.length;A<F;A++){const X=Array.isArray(M[A])?M[A]:[M[A]];for(let _=0,w=X.length;_<w;_++){const G=X[_],j=Array.isArray(G.value)?G.value:[G.value];for(let L=0,U=j.length;L<U;L++){const D=j[L],W=v(D),V=S%C;V!==0&&C-V<W.boundary&&(S+=C-V),G.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=S,S+=W.storage}}}const R=S%C;return R>0&&(S+=C-R),b.__size=S,b.__cache={},this}function v(b){const M={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(M.boundary=4,M.storage=4):b.isVector2?(M.boundary=8,M.storage=8):b.isVector3||b.isColor?(M.boundary=16,M.storage=12):b.isVector4?(M.boundary=16,M.storage=16):b.isMatrix3?(M.boundary=48,M.storage=48):b.isMatrix4?(M.boundary=64,M.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),M}function f(b){const M=b.target;M.removeEventListener("dispose",f);const S=o.indexOf(M.__bindingPointIndex);o.splice(S,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function u(){for(const b in s)i.deleteBuffer(s[b]);o=[],s={},r={}}return{bind:c,update:l,dispose:u}}class ol{constructor(e={}){const{canvas:t=Sd(),context:n=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1}=e;this.isWebGLRenderer=!0;let p;n!==null?p=n.getContextAttributes().alpha:p=o;const m=new Uint32Array(4),g=new Int32Array(4);let v=null,f=null;const u=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=dt,this._useLegacyLights=!1,this.toneMapping=Cn,this.toneMappingExposure=1;const M=this;let S=!1,C=0,R=0,A=null,F=-1,X=null;const _=new it,w=new it;let G=null;const j=new Fe(0);let L=0,U=t.width,D=t.height,W=1,V=null,q=null;const Y=new it(0,0,U,D),ee=new it(0,0,U,D);let se=!1;const we=new ga;let H=!1,Z=!1,oe=null;const xe=new Qe,Me=new Se,de=new P,Ve={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Ce(){return A===null?W:1}let N=n;function Mt(y,I){for(let B=0;B<y.length;B++){const k=y[B],z=t.getContext(k,I);if(z!==null)return z}return null}try{const y={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ua}`),t.addEventListener("webglcontextlost",$e,!1),t.addEventListener("webglcontextrestored",T,!1),t.addEventListener("webglcontextcreationerror",te,!1),N===null){const I=["webgl2","webgl","experimental-webgl"];if(M.isWebGL1Renderer===!0&&I.shift(),N=Mt(I,y),N===null)throw Mt(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&N instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),N.getShaderPrecisionFormat===void 0&&(N.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let _e,Te,me,st,Le,E,x,O,Q,$,J,ue,re,ce,be,Ue,K,qe,Be,Ae,ge,le,De,We;function tt(){_e=new Op(N),Te=new Lp(N,_e,e),_e.init(Te),le=new Sg(N,_e,Te),me=new Mg(N,_e,Te),st=new kp(N),Le=new ag,E=new yg(N,_e,me,Le,Te,le,st),x=new Ip(M),O=new Fp(M),Q=new Yd(N,Te),De=new Cp(N,_e,Q,Te),$=new zp(N,Q,st,De),J=new Wp(N,$,Q,st),Be=new Vp(N,Te,E),Ue=new Dp(Le),ue=new rg(M,x,O,_e,Te,De,Ue),re=new Cg(M,Le),ce=new cg,be=new pg(_e,Te),qe=new Rp(M,x,O,me,J,p,c),K=new xg(M,J,Te),We=new Pg(N,st,Te,me),Ae=new Pp(N,_e,st,Te),ge=new Bp(N,_e,st,Te),st.programs=ue.programs,M.capabilities=Te,M.extensions=_e,M.properties=Le,M.renderLists=ce,M.shadowMap=K,M.state=me,M.info=st}tt();const ke=new Rg(M,N);this.xr=ke,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const y=_e.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=_e.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(y){y!==void 0&&(W=y,this.setSize(U,D,!1))},this.getSize=function(y){return y.set(U,D)},this.setSize=function(y,I,B=!0){if(ke.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}U=y,D=I,t.width=Math.floor(y*W),t.height=Math.floor(I*W),B===!0&&(t.style.width=y+"px",t.style.height=I+"px"),this.setViewport(0,0,y,I)},this.getDrawingBufferSize=function(y){return y.set(U*W,D*W).floor()},this.setDrawingBufferSize=function(y,I,B){U=y,D=I,W=B,t.width=Math.floor(y*B),t.height=Math.floor(I*B),this.setViewport(0,0,y,I)},this.getCurrentViewport=function(y){return y.copy(_)},this.getViewport=function(y){return y.copy(Y)},this.setViewport=function(y,I,B,k){y.isVector4?Y.set(y.x,y.y,y.z,y.w):Y.set(y,I,B,k),me.viewport(_.copy(Y).multiplyScalar(W).floor())},this.getScissor=function(y){return y.copy(ee)},this.setScissor=function(y,I,B,k){y.isVector4?ee.set(y.x,y.y,y.z,y.w):ee.set(y,I,B,k),me.scissor(w.copy(ee).multiplyScalar(W).floor())},this.getScissorTest=function(){return se},this.setScissorTest=function(y){me.setScissorTest(se=y)},this.setOpaqueSort=function(y){V=y},this.setTransparentSort=function(y){q=y},this.getClearColor=function(y){return y.copy(qe.getClearColor())},this.setClearColor=function(){qe.setClearColor.apply(qe,arguments)},this.getClearAlpha=function(){return qe.getClearAlpha()},this.setClearAlpha=function(){qe.setClearAlpha.apply(qe,arguments)},this.clear=function(y=!0,I=!0,B=!0){let k=0;if(y){let z=!1;if(A!==null){const ae=A.texture.format;z=ae===zc||ae===Oc||ae===Fc}if(z){const ae=A.texture.type,pe=ae===Pn||ae===An||ae===fa||ae===qn||ae===Uc||ae===Nc,ye=qe.getClearColor(),Ee=qe.getClearAlpha(),Ne=ye.r,Re=ye.g,Pe=ye.b;pe?(m[0]=Ne,m[1]=Re,m[2]=Pe,m[3]=Ee,N.clearBufferuiv(N.COLOR,0,m)):(g[0]=Ne,g[1]=Re,g[2]=Pe,g[3]=Ee,N.clearBufferiv(N.COLOR,0,g))}else k|=N.COLOR_BUFFER_BIT}I&&(k|=N.DEPTH_BUFFER_BIT),B&&(k|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",$e,!1),t.removeEventListener("webglcontextrestored",T,!1),t.removeEventListener("webglcontextcreationerror",te,!1),ce.dispose(),be.dispose(),Le.dispose(),x.dispose(),O.dispose(),J.dispose(),De.dispose(),We.dispose(),ue.dispose(),ke.dispose(),ke.removeEventListener("sessionstart",kt),ke.removeEventListener("sessionend",Je),oe&&(oe.dispose(),oe=null),At.stop()};function $e(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function T(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;const y=st.autoReset,I=K.enabled,B=K.autoUpdate,k=K.needsUpdate,z=K.type;tt(),st.autoReset=y,K.enabled=I,K.autoUpdate=B,K.needsUpdate=k,K.type=z}function te(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function ne(y){const I=y.target;I.removeEventListener("dispose",ne),he(I)}function he(y){ve(y),Le.remove(y)}function ve(y){const I=Le.get(y).programs;I!==void 0&&(I.forEach(function(B){ue.releaseProgram(B)}),y.isShaderMaterial&&ue.releaseShaderCache(y))}this.renderBufferDirect=function(y,I,B,k,z,ae){I===null&&(I=Ve);const pe=z.isMesh&&z.matrixWorld.determinant()<0,ye=_l(y,I,B,k,z);me.setMaterial(k,pe);let Ee=B.index,Ne=1;if(k.wireframe===!0){if(Ee=$.getWireframeAttribute(B),Ee===void 0)return;Ne=2}const Re=B.drawRange,Pe=B.attributes.position;let ot=Re.start*Ne,Ft=(Re.start+Re.count)*Ne;ae!==null&&(ot=Math.max(ot,ae.start*Ne),Ft=Math.min(Ft,(ae.start+ae.count)*Ne)),Ee!==null?(ot=Math.max(ot,0),Ft=Math.min(Ft,Ee.count)):Pe!=null&&(ot=Math.max(ot,0),Ft=Math.min(Ft,Pe.count));const mt=Ft-ot;if(mt<0||mt===1/0)return;De.setup(z,k,ye,B,Ee);let rn,rt=Ae;if(Ee!==null&&(rn=Q.get(Ee),rt=ge,rt.setIndex(rn)),z.isMesh)k.wireframe===!0?(me.setLineWidth(k.wireframeLinewidth*Ce()),rt.setMode(N.LINES)):rt.setMode(N.TRIANGLES);else if(z.isLine){let Oe=k.linewidth;Oe===void 0&&(Oe=1),me.setLineWidth(Oe*Ce()),z.isLineSegments?rt.setMode(N.LINES):z.isLineLoop?rt.setMode(N.LINE_LOOP):rt.setMode(N.LINE_STRIP)}else z.isPoints?rt.setMode(N.POINTS):z.isSprite&&rt.setMode(N.TRIANGLES);if(z.isBatchedMesh)rt.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else if(z.isInstancedMesh)rt.renderInstances(ot,mt,z.count);else if(B.isInstancedBufferGeometry){const Oe=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,er=Math.min(B.instanceCount,Oe);rt.renderInstances(ot,mt,er)}else rt.render(ot,mt)};function Xe(y,I,B){y.transparent===!0&&y.side===Lt&&y.forceSinglePass===!1?(y.side=Nt,y.needsUpdate=!0,rs(y,I,B),y.side=Dn,y.needsUpdate=!0,rs(y,I,B),y.side=Lt):rs(y,I,B)}this.compile=function(y,I,B=null){B===null&&(B=y),f=be.get(B),f.init(),b.push(f),B.traverseVisible(function(z){z.isLight&&z.layers.test(I.layers)&&(f.pushLight(z),z.castShadow&&f.pushShadow(z))}),y!==B&&y.traverseVisible(function(z){z.isLight&&z.layers.test(I.layers)&&(f.pushLight(z),z.castShadow&&f.pushShadow(z))}),f.setupLights(M._useLegacyLights);const k=new Set;return y.traverse(function(z){const ae=z.material;if(ae)if(Array.isArray(ae))for(let pe=0;pe<ae.length;pe++){const ye=ae[pe];Xe(ye,B,z),k.add(ye)}else Xe(ae,B,z),k.add(ae)}),b.pop(),f=null,k},this.compileAsync=function(y,I,B=null){const k=this.compile(y,I,B);return new Promise(z=>{function ae(){if(k.forEach(function(pe){Le.get(pe).currentProgram.isReady()&&k.delete(pe)}),k.size===0){z(y);return}setTimeout(ae,10)}_e.get("KHR_parallel_shader_compile")!==null?ae():setTimeout(ae,10)})};let Ze=null;function yt(y){Ze&&Ze(y)}function kt(){At.stop()}function Je(){At.start()}const At=new Qc;At.setAnimationLoop(yt),typeof self<"u"&&At.setContext(self),this.setAnimationLoop=function(y){Ze=y,ke.setAnimationLoop(y),y===null?At.stop():At.start()},ke.addEventListener("sessionstart",kt),ke.addEventListener("sessionend",Je),this.render=function(y,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),ke.enabled===!0&&ke.isPresenting===!0&&(ke.cameraAutoUpdate===!0&&ke.updateCamera(I),I=ke.getCamera()),y.isScene===!0&&y.onBeforeRender(M,y,I,A),f=be.get(y,b.length),f.init(),b.push(f),xe.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),we.setFromProjectionMatrix(xe),Z=this.localClippingEnabled,H=Ue.init(this.clippingPlanes,Z),v=ce.get(y,u.length),v.init(),u.push(v),Qt(y,I,0,M.sortObjects),v.finish(),M.sortObjects===!0&&v.sort(V,q),this.info.render.frame++,H===!0&&Ue.beginShadows();const B=f.state.shadowsArray;if(K.render(B,y,I),H===!0&&Ue.endShadows(),this.info.autoReset===!0&&this.info.reset(),(ke.enabled===!1||ke.isPresenting===!1||ke.hasDepthSensing()===!1)&&qe.render(v,y),f.setupLights(M._useLegacyLights),I.isArrayCamera){const k=I.cameras;for(let z=0,ae=k.length;z<ae;z++){const pe=k[z];Sa(v,y,pe,pe.viewport)}}else Sa(v,y,I);A!==null&&(E.updateMultisampleRenderTarget(A),E.updateRenderTargetMipmap(A)),y.isScene===!0&&y.onAfterRender(M,y,I),De.resetDefaultState(),F=-1,X=null,b.pop(),b.length>0?f=b[b.length-1]:f=null,u.pop(),u.length>0?v=u[u.length-1]:v=null};function Qt(y,I,B,k){if(y.visible===!1)return;if(y.layers.test(I.layers)){if(y.isGroup)B=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(I);else if(y.isLight)f.pushLight(y),y.castShadow&&f.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||we.intersectsSprite(y)){k&&de.setFromMatrixPosition(y.matrixWorld).applyMatrix4(xe);const pe=J.update(y),ye=y.material;ye.visible&&v.push(y,pe,ye,B,de.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||we.intersectsObject(y))){const pe=J.update(y),ye=y.material;if(k&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),de.copy(y.boundingSphere.center)):(pe.boundingSphere===null&&pe.computeBoundingSphere(),de.copy(pe.boundingSphere.center)),de.applyMatrix4(y.matrixWorld).applyMatrix4(xe)),Array.isArray(ye)){const Ee=pe.groups;for(let Ne=0,Re=Ee.length;Ne<Re;Ne++){const Pe=Ee[Ne],ot=ye[Pe.materialIndex];ot&&ot.visible&&v.push(y,pe,ot,B,de.z,Pe)}}else ye.visible&&v.push(y,pe,ye,B,de.z,null)}}const ae=y.children;for(let pe=0,ye=ae.length;pe<ye;pe++)Qt(ae[pe],I,B,k)}function Sa(y,I,B,k){const z=y.opaque,ae=y.transmissive,pe=y.transparent;f.setupLightsView(B),H===!0&&Ue.setGlobalState(M.clippingPlanes,B),ae.length>0&&gl(z,ae,I,B),k&&me.viewport(_.copy(k)),z.length>0&&ss(z,I,B),ae.length>0&&ss(ae,I,B),pe.length>0&&ss(pe,I,B),me.buffers.depth.setTest(!0),me.buffers.depth.setMask(!0),me.buffers.color.setMask(!0),me.setPolygonOffset(!1)}function gl(y,I,B,k){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;const ae=Te.isWebGL2;oe===null&&(oe=new Kn(1,1,{generateMipmaps:!0,type:_e.has("EXT_color_buffer_half_float")?Ji:Pn,minFilter:Wn,samples:ae?4:0})),M.getDrawingBufferSize(Me),ae?oe.setSize(Me.x,Me.y):oe.setSize(ra(Me.x),ra(Me.y));const pe=M.getRenderTarget();M.setRenderTarget(oe),M.getClearColor(j),L=M.getClearAlpha(),L<1&&M.setClearColor(16777215,.5),M.clear();const ye=M.toneMapping;M.toneMapping=Cn,ss(y,B,k),E.updateMultisampleRenderTarget(oe),E.updateRenderTargetMipmap(oe);let Ee=!1;for(let Ne=0,Re=I.length;Ne<Re;Ne++){const Pe=I[Ne],ot=Pe.object,Ft=Pe.geometry,mt=Pe.material,rn=Pe.group;if(mt.side===Lt&&ot.layers.test(k.layers)){const rt=mt.side;mt.side=Nt,mt.needsUpdate=!0,ba(ot,B,k,Ft,mt,rn),mt.side=rt,mt.needsUpdate=!0,Ee=!0}}Ee===!0&&(E.updateMultisampleRenderTarget(oe),E.updateRenderTargetMipmap(oe)),M.setRenderTarget(pe),M.setClearColor(j,L),M.toneMapping=ye}function ss(y,I,B){const k=I.isScene===!0?I.overrideMaterial:null;for(let z=0,ae=y.length;z<ae;z++){const pe=y[z],ye=pe.object,Ee=pe.geometry,Ne=k===null?pe.material:k,Re=pe.group;ye.layers.test(B.layers)&&ba(ye,I,B,Ee,Ne,Re)}}function ba(y,I,B,k,z,ae){y.onBeforeRender(M,I,B,k,z,ae),y.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),z.onBeforeRender(M,I,B,k,y,ae),z.transparent===!0&&z.side===Lt&&z.forceSinglePass===!1?(z.side=Nt,z.needsUpdate=!0,M.renderBufferDirect(B,I,k,z,y,ae),z.side=Dn,z.needsUpdate=!0,M.renderBufferDirect(B,I,k,z,y,ae),z.side=Lt):M.renderBufferDirect(B,I,k,z,y,ae),y.onAfterRender(M,I,B,k,z,ae)}function rs(y,I,B){I.isScene!==!0&&(I=Ve);const k=Le.get(y),z=f.state.lights,ae=f.state.shadowsArray,pe=z.state.version,ye=ue.getParameters(y,z.state,ae,I,B),Ee=ue.getProgramCacheKey(ye);let Ne=k.programs;k.environment=y.isMeshStandardMaterial?I.environment:null,k.fog=I.fog,k.envMap=(y.isMeshStandardMaterial?O:x).get(y.envMap||k.environment),Ne===void 0&&(y.addEventListener("dispose",ne),Ne=new Map,k.programs=Ne);let Re=Ne.get(Ee);if(Re!==void 0){if(k.currentProgram===Re&&k.lightsStateVersion===pe)return wa(y,ye),Re}else ye.uniforms=ue.getUniforms(y),y.onBuild(B,ye,M),y.onBeforeCompile(ye,M),Re=ue.acquireProgram(ye,Ee),Ne.set(Ee,Re),k.uniforms=ye.uniforms;const Pe=k.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Pe.clippingPlanes=Ue.uniform),wa(y,ye),k.needsLights=xl(y),k.lightsStateVersion=pe,k.needsLights&&(Pe.ambientLightColor.value=z.state.ambient,Pe.lightProbe.value=z.state.probe,Pe.directionalLights.value=z.state.directional,Pe.directionalLightShadows.value=z.state.directionalShadow,Pe.spotLights.value=z.state.spot,Pe.spotLightShadows.value=z.state.spotShadow,Pe.rectAreaLights.value=z.state.rectArea,Pe.ltc_1.value=z.state.rectAreaLTC1,Pe.ltc_2.value=z.state.rectAreaLTC2,Pe.pointLights.value=z.state.point,Pe.pointLightShadows.value=z.state.pointShadow,Pe.hemisphereLights.value=z.state.hemi,Pe.directionalShadowMap.value=z.state.directionalShadowMap,Pe.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Pe.spotShadowMap.value=z.state.spotShadowMap,Pe.spotLightMatrix.value=z.state.spotLightMatrix,Pe.spotLightMap.value=z.state.spotLightMap,Pe.pointShadowMap.value=z.state.pointShadowMap,Pe.pointShadowMatrix.value=z.state.pointShadowMatrix),k.currentProgram=Re,k.uniformsList=null,Re}function Ea(y){if(y.uniformsList===null){const I=y.currentProgram.getUniforms();y.uniformsList=Fs.seqWithValue(I.seq,y.uniforms)}return y.uniformsList}function wa(y,I){const B=Le.get(y);B.outputColorSpace=I.outputColorSpace,B.batching=I.batching,B.instancing=I.instancing,B.instancingColor=I.instancingColor,B.skinning=I.skinning,B.morphTargets=I.morphTargets,B.morphNormals=I.morphNormals,B.morphColors=I.morphColors,B.morphTargetsCount=I.morphTargetsCount,B.numClippingPlanes=I.numClippingPlanes,B.numIntersection=I.numClipIntersection,B.vertexAlphas=I.vertexAlphas,B.vertexTangents=I.vertexTangents,B.toneMapping=I.toneMapping}function _l(y,I,B,k,z){I.isScene!==!0&&(I=Ve),E.resetTextureUnits();const ae=I.fog,pe=k.isMeshStandardMaterial?I.environment:null,ye=A===null?M.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:vn,Ee=(k.isMeshStandardMaterial?O:x).get(k.envMap||pe),Ne=k.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Re=!!B.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Pe=!!B.morphAttributes.position,ot=!!B.morphAttributes.normal,Ft=!!B.morphAttributes.color;let mt=Cn;k.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(mt=M.toneMapping);const rn=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,rt=rn!==void 0?rn.length:0,Oe=Le.get(k),er=f.state.lights;if(H===!0&&(Z===!0||y!==X)){const Gt=y===X&&k.id===F;Ue.setState(k,y,Gt)}let at=!1;k.version===Oe.__version?(Oe.needsLights&&Oe.lightsStateVersion!==er.state.version||Oe.outputColorSpace!==ye||z.isBatchedMesh&&Oe.batching===!1||!z.isBatchedMesh&&Oe.batching===!0||z.isInstancedMesh&&Oe.instancing===!1||!z.isInstancedMesh&&Oe.instancing===!0||z.isSkinnedMesh&&Oe.skinning===!1||!z.isSkinnedMesh&&Oe.skinning===!0||z.isInstancedMesh&&Oe.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Oe.instancingColor===!1&&z.instanceColor!==null||Oe.envMap!==Ee||k.fog===!0&&Oe.fog!==ae||Oe.numClippingPlanes!==void 0&&(Oe.numClippingPlanes!==Ue.numPlanes||Oe.numIntersection!==Ue.numIntersection)||Oe.vertexAlphas!==Ne||Oe.vertexTangents!==Re||Oe.morphTargets!==Pe||Oe.morphNormals!==ot||Oe.morphColors!==Ft||Oe.toneMapping!==mt||Te.isWebGL2===!0&&Oe.morphTargetsCount!==rt)&&(at=!0):(at=!0,Oe.__version=k.version);let Nn=Oe.currentProgram;at===!0&&(Nn=rs(k,I,z));let Ta=!1,Oi=!1,tr=!1;const Et=Nn.getUniforms(),Fn=Oe.uniforms;if(me.useProgram(Nn.program)&&(Ta=!0,Oi=!0,tr=!0),k.id!==F&&(F=k.id,Oi=!0),Ta||X!==y){Et.setValue(N,"projectionMatrix",y.projectionMatrix),Et.setValue(N,"viewMatrix",y.matrixWorldInverse);const Gt=Et.map.cameraPosition;Gt!==void 0&&Gt.setValue(N,de.setFromMatrixPosition(y.matrixWorld)),Te.logarithmicDepthBuffer&&Et.setValue(N,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&Et.setValue(N,"isOrthographic",y.isOrthographicCamera===!0),X!==y&&(X=y,Oi=!0,tr=!0)}if(z.isSkinnedMesh){Et.setOptional(N,z,"bindMatrix"),Et.setOptional(N,z,"bindMatrixInverse");const Gt=z.skeleton;Gt&&(Te.floatVertexTextures?(Gt.boneTexture===null&&Gt.computeBoneTexture(),Et.setValue(N,"boneTexture",Gt.boneTexture,E)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}z.isBatchedMesh&&(Et.setOptional(N,z,"batchingTexture"),Et.setValue(N,"batchingTexture",z._matricesTexture,E));const nr=B.morphAttributes;if((nr.position!==void 0||nr.normal!==void 0||nr.color!==void 0&&Te.isWebGL2===!0)&&Be.update(z,B,Nn),(Oi||Oe.receiveShadow!==z.receiveShadow)&&(Oe.receiveShadow=z.receiveShadow,Et.setValue(N,"receiveShadow",z.receiveShadow)),k.isMeshGouraudMaterial&&k.envMap!==null&&(Fn.envMap.value=Ee,Fn.flipEnvMap.value=Ee.isCubeTexture&&Ee.isRenderTargetTexture===!1?-1:1),Oi&&(Et.setValue(N,"toneMappingExposure",M.toneMappingExposure),Oe.needsLights&&vl(Fn,tr),ae&&k.fog===!0&&re.refreshFogUniforms(Fn,ae),re.refreshMaterialUniforms(Fn,k,W,D,oe),Fs.upload(N,Ea(Oe),Fn,E)),k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Fs.upload(N,Ea(Oe),Fn,E),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&Et.setValue(N,"center",z.center),Et.setValue(N,"modelViewMatrix",z.modelViewMatrix),Et.setValue(N,"normalMatrix",z.normalMatrix),Et.setValue(N,"modelMatrix",z.matrixWorld),k.isShaderMaterial||k.isRawShaderMaterial){const Gt=k.uniformsGroups;for(let ir=0,Ml=Gt.length;ir<Ml;ir++)if(Te.isWebGL2){const Aa=Gt[ir];We.update(Aa,Nn),We.bind(Aa,Nn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Nn}function vl(y,I){y.ambientLightColor.needsUpdate=I,y.lightProbe.needsUpdate=I,y.directionalLights.needsUpdate=I,y.directionalLightShadows.needsUpdate=I,y.pointLights.needsUpdate=I,y.pointLightShadows.needsUpdate=I,y.spotLights.needsUpdate=I,y.spotLightShadows.needsUpdate=I,y.rectAreaLights.needsUpdate=I,y.hemisphereLights.needsUpdate=I}function xl(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(y,I,B){Le.get(y.texture).__webglTexture=I,Le.get(y.depthTexture).__webglTexture=B;const k=Le.get(y);k.__hasExternalTextures=!0,k.__hasExternalTextures&&(k.__autoAllocateDepthBuffer=B===void 0,k.__autoAllocateDepthBuffer||_e.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),k.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(y,I){const B=Le.get(y);B.__webglFramebuffer=I,B.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(y,I=0,B=0){A=y,C=I,R=B;let k=!0,z=null,ae=!1,pe=!1;if(y){const Ee=Le.get(y);Ee.__useDefaultFramebuffer!==void 0?(me.bindFramebuffer(N.FRAMEBUFFER,null),k=!1):Ee.__webglFramebuffer===void 0?E.setupRenderTarget(y):Ee.__hasExternalTextures&&E.rebindTextures(y,Le.get(y.texture).__webglTexture,Le.get(y.depthTexture).__webglTexture);const Ne=y.texture;(Ne.isData3DTexture||Ne.isDataArrayTexture||Ne.isCompressedArrayTexture)&&(pe=!0);const Re=Le.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Re[I])?z=Re[I][B]:z=Re[I],ae=!0):Te.isWebGL2&&y.samples>0&&E.useMultisampledRTT(y)===!1?z=Le.get(y).__webglMultisampledFramebuffer:Array.isArray(Re)?z=Re[B]:z=Re,_.copy(y.viewport),w.copy(y.scissor),G=y.scissorTest}else _.copy(Y).multiplyScalar(W).floor(),w.copy(ee).multiplyScalar(W).floor(),G=se;if(me.bindFramebuffer(N.FRAMEBUFFER,z)&&Te.drawBuffers&&k&&me.drawBuffers(y,z),me.viewport(_),me.scissor(w),me.setScissorTest(G),ae){const Ee=Le.get(y.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+I,Ee.__webglTexture,B)}else if(pe){const Ee=Le.get(y.texture),Ne=I||0;N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,Ee.__webglTexture,B||0,Ne)}F=-1},this.readRenderTargetPixels=function(y,I,B,k,z,ae,pe){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=Le.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&pe!==void 0&&(ye=ye[pe]),ye){me.bindFramebuffer(N.FRAMEBUFFER,ye);try{const Ee=y.texture,Ne=Ee.format,Re=Ee.type;if(Ne!==Kt&&le.convert(Ne)!==N.getParameter(N.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Pe=Re===Ji&&(_e.has("EXT_color_buffer_half_float")||Te.isWebGL2&&_e.has("EXT_color_buffer_float"));if(Re!==Pn&&le.convert(Re)!==N.getParameter(N.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Re===pn&&(Te.isWebGL2||_e.has("OES_texture_float")||_e.has("WEBGL_color_buffer_float")))&&!Pe){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=y.width-k&&B>=0&&B<=y.height-z&&N.readPixels(I,B,k,z,le.convert(Ne),le.convert(Re),ae)}finally{const Ee=A!==null?Le.get(A).__webglFramebuffer:null;me.bindFramebuffer(N.FRAMEBUFFER,Ee)}}},this.copyFramebufferToTexture=function(y,I,B=0){const k=Math.pow(2,-B),z=Math.floor(I.image.width*k),ae=Math.floor(I.image.height*k);E.setTexture2D(I,0),N.copyTexSubImage2D(N.TEXTURE_2D,B,0,0,y.x,y.y,z,ae),me.unbindTexture()},this.copyTextureToTexture=function(y,I,B,k=0){const z=I.image.width,ae=I.image.height,pe=le.convert(B.format),ye=le.convert(B.type);E.setTexture2D(B,0),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,B.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,B.unpackAlignment),I.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,k,y.x,y.y,z,ae,pe,ye,I.image.data):I.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,k,y.x,y.y,I.mipmaps[0].width,I.mipmaps[0].height,pe,I.mipmaps[0].data):N.texSubImage2D(N.TEXTURE_2D,k,y.x,y.y,pe,ye,I.image),k===0&&B.generateMipmaps&&N.generateMipmap(N.TEXTURE_2D),me.unbindTexture()},this.copyTextureToTexture3D=function(y,I,B,k,z=0){if(M.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const ae=y.max.x-y.min.x+1,pe=y.max.y-y.min.y+1,ye=y.max.z-y.min.z+1,Ee=le.convert(k.format),Ne=le.convert(k.type);let Re;if(k.isData3DTexture)E.setTexture3D(k,0),Re=N.TEXTURE_3D;else if(k.isDataArrayTexture||k.isCompressedArrayTexture)E.setTexture2DArray(k,0),Re=N.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,k.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,k.unpackAlignment);const Pe=N.getParameter(N.UNPACK_ROW_LENGTH),ot=N.getParameter(N.UNPACK_IMAGE_HEIGHT),Ft=N.getParameter(N.UNPACK_SKIP_PIXELS),mt=N.getParameter(N.UNPACK_SKIP_ROWS),rn=N.getParameter(N.UNPACK_SKIP_IMAGES),rt=B.isCompressedTexture?B.mipmaps[z]:B.image;N.pixelStorei(N.UNPACK_ROW_LENGTH,rt.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,rt.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,y.min.x),N.pixelStorei(N.UNPACK_SKIP_ROWS,y.min.y),N.pixelStorei(N.UNPACK_SKIP_IMAGES,y.min.z),B.isDataTexture||B.isData3DTexture?N.texSubImage3D(Re,z,I.x,I.y,I.z,ae,pe,ye,Ee,Ne,rt.data):B.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),N.compressedTexSubImage3D(Re,z,I.x,I.y,I.z,ae,pe,ye,Ee,rt.data)):N.texSubImage3D(Re,z,I.x,I.y,I.z,ae,pe,ye,Ee,Ne,rt),N.pixelStorei(N.UNPACK_ROW_LENGTH,Pe),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,ot),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Ft),N.pixelStorei(N.UNPACK_SKIP_ROWS,mt),N.pixelStorei(N.UNPACK_SKIP_IMAGES,rn),z===0&&k.generateMipmaps&&N.generateMipmap(Re),me.unbindTexture()},this.initTexture=function(y){y.isCubeTexture?E.setTextureCube(y,0):y.isData3DTexture?E.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?E.setTexture2DArray(y,0):E.setTexture2D(y,0),me.unbindTexture()},this.resetState=function(){C=0,R=0,A=null,me.reset(),De.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return mn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===pa?"display-p3":"srgb",t.unpackColorSpace=je.workingColorSpace===js?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===dt?jn:kc}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===jn?dt:vn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class Lg extends ol{}Lg.prototype.isWebGL1Renderer=!0;class va{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Fe(e),this.near=t,this.far=n}clone(){return new va(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Dg extends lt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}}class Ig{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=na,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=Ln()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return $n("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ln()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ln()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Rt=new P;class Ws{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix4(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Rt.fromBufferAttribute(this,t),Rt.applyNormalMatrix(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Rt.fromBufferAttribute(this,t),Rt.transformDirection(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=nn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ye(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Ye(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Ye(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Ye(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Ye(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=nn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=nn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=nn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=nn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ye(t,this.array),n=Ye(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ye(t,this.array),n=Ye(n,this.array),s=Ye(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ye(t,this.array),n=Ye(n,this.array),s=Ye(s,this.array),r=Ye(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new bt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Ws(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Ti extends Un{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Fe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let gi;const Xi=new P,_i=new P,vi=new P,xi=new Se,qi=new Se,cl=new Qe,Cs=new P,Yi=new P,Ps=new P,nc=new Se,Nr=new Se,ic=new Se;class Zi extends lt{constructor(e=new Ti){if(super(),this.isSprite=!0,this.type="Sprite",gi===void 0){gi=new ut;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Ig(t,5);gi.setIndex([0,1,2,0,2,3]),gi.setAttribute("position",new Ws(n,3,0,!1)),gi.setAttribute("uv",new Ws(n,2,3,!1))}this.geometry=gi,this.material=e,this.center=new Se(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),_i.setFromMatrixScale(this.matrixWorld),cl.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),vi.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&_i.multiplyScalar(-vi.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const o=this.center;Ls(Cs.set(-.5,-.5,0),vi,o,_i,s,r),Ls(Yi.set(.5,-.5,0),vi,o,_i,s,r),Ls(Ps.set(.5,.5,0),vi,o,_i,s,r),nc.set(0,0),Nr.set(1,0),ic.set(1,1);let a=e.ray.intersectTriangle(Cs,Yi,Ps,!1,Xi);if(a===null&&(Ls(Yi.set(-.5,.5,0),vi,o,_i,s,r),Nr.set(0,1),a=e.ray.intersectTriangle(Cs,Ps,Yi,!1,Xi),a===null))return;const c=e.ray.origin.distanceTo(Xi);c<e.near||c>e.far||t.push({distance:c,point:Xi.clone(),uv:Zt.getInterpolation(Xi,Cs,Yi,Ps,nc,Nr,ic,new Se),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Ls(i,e,t,n,s,r){xi.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(qi.x=r*xi.x-s*xi.y,qi.y=s*xi.x+r*xi.y):qi.copy(xi),i.copy(e),i.x+=qi.x,i.y+=qi.y,i.applyMatrix4(cl)}class sc extends bt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Mi=new Qe,rc=new Qe,Ds=[],ac=new Jn,Ug=new Qe,ji=new fe,$i=new Qn;class oc extends fe{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new sc(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Ug)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Jn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Mi),ac.copy(e.boundingBox).applyMatrix4(Mi),this.boundingBox.union(ac)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Qn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Mi),$i.copy(e.boundingSphere).applyMatrix4(Mi),this.boundingSphere.union($i)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}raycast(e,t){const n=this.matrixWorld,s=this.count;if(ji.geometry=this.geometry,ji.material=this.material,ji.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),$i.copy(this.boundingSphere),$i.applyMatrix4(n),e.ray.intersectsSphere($i)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Mi),rc.multiplyMatrices(n,Mi),ji.matrixWorld=rc,ji.raycast(e,Ds);for(let o=0,a=Ds.length;o<a;o++){const c=Ds[o];c.instanceId=r,c.object=this,t.push(c)}Ds.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new sc(new Float32Array(this.instanceMatrix.count*3),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class xa extends Un{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Fe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const cc=new P,lc=new P,hc=new Qe,Fr=new $s,Is=new Qn;class ll extends lt{constructor(e=new ut,t=new xa){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)cc.fromBufferAttribute(t,s-1),lc.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=cc.distanceTo(lc);e.setAttribute("lineDistance",new et(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Is.copy(n.boundingSphere),Is.applyMatrix4(s),Is.radius+=r,e.ray.intersectsSphere(Is)===!1)return;hc.copy(s).invert(),Fr.copy(e.ray).applyMatrix4(hc);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=new P,h=new P,d=new P,p=new P,m=this.isLineSegments?2:1,g=n.index,f=n.attributes.position;if(g!==null){const u=Math.max(0,o.start),b=Math.min(g.count,o.start+o.count);for(let M=u,S=b-1;M<S;M+=m){const C=g.getX(M),R=g.getX(M+1);if(l.fromBufferAttribute(f,C),h.fromBufferAttribute(f,R),Fr.distanceSqToSegment(l,h,p,d)>c)continue;p.applyMatrix4(this.matrixWorld);const F=e.ray.origin.distanceTo(p);F<e.near||F>e.far||t.push({distance:F,point:d.clone().applyMatrix4(this.matrixWorld),index:M,face:null,faceIndex:null,object:this})}}else{const u=Math.max(0,o.start),b=Math.min(f.count,o.start+o.count);for(let M=u,S=b-1;M<S;M+=m){if(l.fromBufferAttribute(f,M),h.fromBufferAttribute(f,M+1),Fr.distanceSqToSegment(l,h,p,d)>c)continue;p.applyMatrix4(this.matrixWorld);const R=e.ray.origin.distanceTo(p);R<e.near||R>e.far||t.push({distance:R,point:d.clone().applyMatrix4(this.matrixWorld),index:M,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}class hl extends Un{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Fe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const dc=new Qe,oa=new $s,Us=new Qn,Ns=new P;class Ng extends lt{constructor(e=new ut,t=new hl){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Us.copy(n.boundingSphere),Us.applyMatrix4(s),Us.radius+=r,e.ray.intersectsSphere(Us)===!1)return;dc.copy(s).invert(),oa.copy(e.ray).applyMatrix4(dc);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,d=n.attributes.position;if(l!==null){const p=Math.max(0,o.start),m=Math.min(l.count,o.start+o.count);for(let g=p,v=m;g<v;g++){const f=l.getX(g);Ns.fromBufferAttribute(d,f),uc(Ns,f,c,s,e,t,this)}}else{const p=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let g=p,v=m;g<v;g++)Ns.fromBufferAttribute(d,g),uc(Ns,g,c,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function uc(i,e,t,n,s,r,o){const a=oa.distanceSqToPoint(i);if(a<t){const c=new P;oa.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,object:o})}}class Js extends Dt{constructor(e,t,n,s,r,o,a,c,l){super(e,t,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Qi extends ut{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],o=[],a=[],c=[],l=new P,h=new Se;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let d=0,p=3;d<=t;d++,p+=3){const m=n+d/t*s;l.x=e*Math.cos(m),l.y=e*Math.sin(m),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[p]/e+1)/2,h.y=(o[p+1]/e+1)/2,c.push(h.x,h.y)}for(let d=1;d<=t;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new et(o,3)),this.setAttribute("normal",new et(a,3)),this.setAttribute("uv",new et(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qi(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class St extends ut{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],d=[],p=[],m=[];let g=0;const v=[],f=n/2;let u=0;b(),o===!1&&(e>0&&M(!0),t>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new et(d,3)),this.setAttribute("normal",new et(p,3)),this.setAttribute("uv",new et(m,2));function b(){const S=new P,C=new P;let R=0;const A=(t-e)/n;for(let F=0;F<=r;F++){const X=[],_=F/r,w=_*(t-e)+e;for(let G=0;G<=s;G++){const j=G/s,L=j*c+a,U=Math.sin(L),D=Math.cos(L);C.x=w*U,C.y=-_*n+f,C.z=w*D,d.push(C.x,C.y,C.z),S.set(U,A,D).normalize(),p.push(S.x,S.y,S.z),m.push(j,1-_),X.push(g++)}v.push(X)}for(let F=0;F<s;F++)for(let X=0;X<r;X++){const _=v[X][F],w=v[X+1][F],G=v[X+1][F+1],j=v[X][F+1];h.push(_,w,j),h.push(w,G,j),R+=6}l.addGroup(u,R,0),u+=R}function M(S){const C=g,R=new Se,A=new P;let F=0;const X=S===!0?e:t,_=S===!0?1:-1;for(let G=1;G<=s;G++)d.push(0,f*_,0),p.push(0,_,0),m.push(.5,.5),g++;const w=g;for(let G=0;G<=s;G++){const L=G/s*c+a,U=Math.cos(L),D=Math.sin(L);A.x=X*D,A.y=f*_,A.z=X*U,d.push(A.x,A.y,A.z),p.push(0,_,0),R.x=U*.5+.5,R.y=D*.5*_+.5,m.push(R.x,R.y),g++}for(let G=0;G<s;G++){const j=C+G,L=w+G;S===!0?h.push(L,L+1,j):h.push(L+1,L,j),F+=3}l.addGroup(u,F,S===!0?1:2),u+=F}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new St(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Tn extends St{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new Tn(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Fi extends ut{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};const r=[],o=[];a(s),l(n),h(),this.setAttribute("position",new et(r,3)),this.setAttribute("normal",new et(r.slice(),3)),this.setAttribute("uv",new et(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(b){const M=new P,S=new P,C=new P;for(let R=0;R<t.length;R+=3)m(t[R+0],M),m(t[R+1],S),m(t[R+2],C),c(M,S,C,b)}function c(b,M,S,C){const R=C+1,A=[];for(let F=0;F<=R;F++){A[F]=[];const X=b.clone().lerp(S,F/R),_=M.clone().lerp(S,F/R),w=R-F;for(let G=0;G<=w;G++)G===0&&F===R?A[F][G]=X:A[F][G]=X.clone().lerp(_,G/w)}for(let F=0;F<R;F++)for(let X=0;X<2*(R-F)-1;X++){const _=Math.floor(X/2);X%2===0?(p(A[F][_+1]),p(A[F+1][_]),p(A[F][_])):(p(A[F][_+1]),p(A[F+1][_+1]),p(A[F+1][_]))}}function l(b){const M=new P;for(let S=0;S<r.length;S+=3)M.x=r[S+0],M.y=r[S+1],M.z=r[S+2],M.normalize().multiplyScalar(b),r[S+0]=M.x,r[S+1]=M.y,r[S+2]=M.z}function h(){const b=new P;for(let M=0;M<r.length;M+=3){b.x=r[M+0],b.y=r[M+1],b.z=r[M+2];const S=f(b)/2/Math.PI+.5,C=u(b)/Math.PI+.5;o.push(S,1-C)}g(),d()}function d(){for(let b=0;b<o.length;b+=6){const M=o[b+0],S=o[b+2],C=o[b+4],R=Math.max(M,S,C),A=Math.min(M,S,C);R>.9&&A<.1&&(M<.2&&(o[b+0]+=1),S<.2&&(o[b+2]+=1),C<.2&&(o[b+4]+=1))}}function p(b){r.push(b.x,b.y,b.z)}function m(b,M){const S=b*3;M.x=e[S+0],M.y=e[S+1],M.z=e[S+2]}function g(){const b=new P,M=new P,S=new P,C=new P,R=new Se,A=new Se,F=new Se;for(let X=0,_=0;X<r.length;X+=9,_+=6){b.set(r[X+0],r[X+1],r[X+2]),M.set(r[X+3],r[X+4],r[X+5]),S.set(r[X+6],r[X+7],r[X+8]),R.set(o[_+0],o[_+1]),A.set(o[_+2],o[_+3]),F.set(o[_+4],o[_+5]),C.copy(b).add(M).add(S).divideScalar(3);const w=f(C);v(R,_+0,b,w),v(A,_+2,M,w),v(F,_+4,S,w)}}function v(b,M,S,C){C<0&&b.x===1&&(o[M]=b.x-1),S.x===0&&S.z===0&&(o[M]=C/2/Math.PI+.5)}function f(b){return Math.atan2(b.z,-b.x)}function u(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Fi(e.vertices,e.indices,e.radius,e.details)}}class Ai extends Fi{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ai(e.radius,e.detail)}}class bi extends Fi{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new bi(e.radius,e.detail)}}class Ii extends Fi{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ii(e.radius,e.detail)}}class es extends ut{constructor(e=.5,t=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);const a=[],c=[],l=[],h=[];let d=e;const p=(t-e)/s,m=new P,g=new Se;for(let v=0;v<=s;v++){for(let f=0;f<=n;f++){const u=r+f/n*o;m.x=d*Math.cos(u),m.y=d*Math.sin(u),c.push(m.x,m.y,m.z),l.push(0,0,1),g.x=(m.x/t+1)/2,g.y=(m.y/t+1)/2,h.push(g.x,g.y)}d+=p}for(let v=0;v<s;v++){const f=v*(n+1);for(let u=0;u<n;u++){const b=u+f,M=b,S=b+n+1,C=b+n+2,R=b+1;a.push(M,S,R),a.push(S,C,R)}}this.setIndex(a),this.setAttribute("position",new et(c,3)),this.setAttribute("normal",new et(l,3)),this.setAttribute("uv",new et(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new es(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class en extends ut{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const h=[],d=new P,p=new P,m=[],g=[],v=[],f=[];for(let u=0;u<=n;u++){const b=[],M=u/n;let S=0;u===0&&o===0?S=.5/t:u===n&&c===Math.PI&&(S=-.5/t);for(let C=0;C<=t;C++){const R=C/t;d.x=-e*Math.cos(s+R*r)*Math.sin(o+M*a),d.y=e*Math.cos(o+M*a),d.z=e*Math.sin(s+R*r)*Math.sin(o+M*a),g.push(d.x,d.y,d.z),p.copy(d).normalize(),v.push(p.x,p.y,p.z),f.push(R+S,1-M),b.push(l++)}h.push(b)}for(let u=0;u<n;u++)for(let b=0;b<t;b++){const M=h[u][b+1],S=h[u][b],C=h[u+1][b],R=h[u+1][b+1];(u!==0||o>0)&&m.push(M,S,R),(u!==n-1||c<Math.PI)&&m.push(S,C,R)}this.setIndex(m),this.setAttribute("position",new et(g,3)),this.setAttribute("normal",new et(v,3)),this.setAttribute("uv",new et(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new en(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Ma extends Fi{constructor(e=1,t=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],s=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,s,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ma(e.radius,e.detail)}}class ts extends ut{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],c=[],l=[],h=new P,d=new P,p=new P;for(let m=0;m<=n;m++)for(let g=0;g<=s;g++){const v=g/s*r,f=m/n*Math.PI*2;d.x=(e+t*Math.cos(f))*Math.cos(v),d.y=(e+t*Math.cos(f))*Math.sin(v),d.z=t*Math.sin(f),a.push(d.x,d.y,d.z),h.x=e*Math.cos(v),h.y=e*Math.sin(v),p.subVectors(d,h).normalize(),c.push(p.x,p.y,p.z),l.push(g/s),l.push(m/n)}for(let m=1;m<=n;m++)for(let g=1;g<=s;g++){const v=(s+1)*m+g-1,f=(s+1)*(m-1)+g-1,u=(s+1)*(m-1)+g,b=(s+1)*m+g;o.push(v,f,b),o.push(f,u,b)}this.setIndex(o),this.setAttribute("position",new et(a,3)),this.setAttribute("normal",new et(c,3)),this.setAttribute("uv",new et(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ts(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Ge extends Un{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Fe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Fe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Gc,this.normalScale=new Se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class ya extends lt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Fe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}class Fg extends ya{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(lt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Fe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Or=new Qe,fc=new P,pc=new P;class dl{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Se(512,512),this.map=null,this.mapPass=null,this.matrix=new Qe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ga,this._frameExtents=new Se(1,1),this._viewportCount=1,this._viewports=[new it(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;fc.setFromMatrixPosition(e.matrixWorld),t.position.copy(fc),pc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(pc),t.updateMatrixWorld(),Or.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Or),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Or)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const mc=new Qe,Ki=new P,zr=new P;class Og extends dl{constructor(){super(new Bt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Se(4,2),this._viewportCount=6,this._viewports=[new it(2,1,1,1),new it(0,1,1,1),new it(3,1,1,1),new it(1,1,1,1),new it(3,0,1,1),new it(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Ki.setFromMatrixPosition(e.matrixWorld),n.position.copy(Ki),zr.copy(n.position),zr.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(zr),n.updateMatrixWorld(),s.makeTranslation(-Ki.x,-Ki.y,-Ki.z),mc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(mc)}}class zg extends ya{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Og}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Bg extends dl{constructor(){super(new el(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class kg extends ya{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(lt.DEFAULT_UP),this.updateMatrix(),this.target=new lt,this.shadow=new Bg}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Gg{constructor(e,t,n=0,s=1/0){this.ray=new $s(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new ma,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}intersectObject(e,t=!0,n=[]){return ca(e,this,n,t),n.sort(gc),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)ca(e[s],this,n,t);return n.sort(gc),n}}function gc(i,e){return i.distance-e.distance}function ca(i,e,t,n){if(i.layers.test(e.layers)&&i.raycast(e,t),n===!0){const s=i.children;for(let r=0,o=s.length;r<o;r++)ca(s[r],e,t,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ua}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ua);function Hg(i,e=1024){const t=document.createElement("canvas");t.width=t.height=e;const n=t.getContext("2d"),s=e/100,r=(l,h)=>[(l+50)*s,(h+50)*s];n.fillStyle="#141a26",n.fillRect(0,0,e,e);for(let l=0;l<2600;l++){const h=Math.random()*e,d=Math.random()*e,p=2+Math.random()*14,m=Math.random();n.fillStyle=m<.5?"rgba(30,40,58,0.25)":"rgba(10,14,22,0.3)",n.beginPath(),n.arc(h,d,p,0,Math.PI*2),n.fill()}n.strokeStyle="rgba(70,90,130,0.08)",n.lineWidth=1;for(let l=0;l<=100;l+=5)n.beginPath(),n.moveTo(l*s,0),n.lineTo(l*s,e),n.stroke(),n.beginPath(),n.moveTo(0,l*s),n.lineTo(e,l*s),n.stroke();for(const l of i)n.lineCap="round",n.lineJoin="round",n.strokeStyle="rgba(120,150,200,0.10)",n.lineWidth=11*s*.5,Br(n,l,r),n.strokeStyle="#2a3550",n.lineWidth=7.5*s*.5,Br(n,l,r),n.strokeStyle="rgba(150,175,220,0.14)",n.lineWidth=3.4*s*.5,Br(n,l,r);const[o,a]=r(0,0);n.strokeStyle="rgba(80,200,255,0.35)",n.lineWidth=2,n.beginPath(),n.arc(o,a,4.6*s*.5,0,Math.PI*2),n.stroke(),n.strokeStyle="rgba(80,200,255,0.15)",n.lineWidth=6,n.beginPath(),n.arc(o,a,6.2*s*.5,0,Math.PI*2),n.stroke();const c=new Js(t);return c.anisotropy=4,c.colorSpace=dt,c}function Br(i,e,t){i.beginPath();const n=e.points,[s,r]=t(n[0].x,n[0].z);i.moveTo(s,r);for(let o=1;o<n.length;o++){const[a,c]=t(n[o].x,n[o].z);i.lineTo(a,c)}i.stroke()}function la(){const i=document.createElement("canvas");i.width=i.height=64;const e=i.getContext("2d"),t=e.createRadialGradient(32,32,0,32,32,32);return t.addColorStop(0,"rgba(255,255,255,1)"),t.addColorStop(.35,"rgba(255,255,255,0.5)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,64,64),new Js(i)}function _c(i){const e=document.createElement("canvas");e.width=64,e.height=10;const t=e.getContext("2d");t.clearRect(0,0,64,10),t.fillStyle="rgba(8,10,16,0.85)",vc(t,1,1,62,8,3),t.fill();const n=Math.max(0,Math.min(1,i)),s=120*n;t.fillStyle="hsl("+s+",80%,55%)",n>.02&&(vc(t,2,2,Math.max(2,60*n),6,2),t.fill());const r=new Js(e);return r.colorSpace=dt,r}function vc(i,e,t,n,s,r){i.beginPath(),i.moveTo(e+r,t),i.arcTo(e+n,t,e+n,t+s,r),i.arcTo(e+n,t+s,e,t+s,r),i.arcTo(e,t+s,e,t,r),i.arcTo(e,t,e+n,t,r),i.closePath()}function xc(i,e,t=28){const n=document.createElement("canvas");n.width=256,n.height=96;const s=n.getContext("2d");s.clearRect(0,0,n.width,n.height),s.font="bold "+t+'px "Segoe UI", system-ui, sans-serif',s.textAlign="center",s.textBaseline="middle",s.lineWidth=5,s.strokeStyle="rgba(0,0,0,0.8)",s.strokeText(i,128,48),s.fillStyle=e,s.fillText(i,128,48);const r=new Js(n);return r.colorSpace=dt,r}function Vg(i,e,t){const n=la(),s=Hg(e.lanes),r=new fe(new is(104,104),new Ge({map:s,roughness:.95,metalness:.05}));r.rotation.x=-Math.PI/2,r.receiveShadow=t!=="low",i.add(r);const o=new fe(new es(50.5,60,64),new gn({color:329484,side:Lt}));o.rotation.x=-Math.PI/2,o.position.y=-.02,i.add(o);const a=new Ai(1,0),c=new Ge({color:3752282,roughness:.9,flatShading:!0}),l=new St(.18,.26,1.1,6),h=new Ge({color:4864038,roughness:1}),d=new Tn(1.1,2.2,7),p=new Ge({color:2906692,roughness:.9,flatShading:!0}),m=new Vt(1.4,2.2,1.4),g=new Ge({color:4871280,roughness:.85,flatShading:!0}),v=new Ii(.5,0),f=new Ge({color:7028696,emissive:4923352,emissiveIntensity:.9,roughness:.3});for(const U of e.features){let D;switch(U.kind){case"rock":D=new fe(a,c);break;case"tree":D=new fe(d,p);break;case"ruin":D=new fe(m,g);break;case"crystal":D=new fe(v,f);break}D.position.set(U.pos.x,0,U.pos.z),D.rotation.y=U.rot;const W=U.scale;if(U.kind==="tree"){const V=new Xt,q=new fe(l,h);q.position.y=.55;const Y=new fe(d,p);Y.position.y=2.1,Y.scale.setScalar(W),q.scale.setScalar(W),V.add(q,Y),V.position.set(U.pos.x,0,U.pos.z),V.rotation.y=U.rot,t!=="low"&&(Y.castShadow=!0),i.add(V);continue}D.scale.setScalar(W),U.kind==="crystal"?(D.position.y=.5*W,D.scale.set(W*.8,W*1.3,W*.8)):U.kind==="ruin"?(D.position.y=1.1*W,D.rotation.z=Math.sin(U.rot*3)*.12):(D.position.y=.35*W,D.scale.set(W,W*.7,W)),t!=="low"&&(D.castShadow=!0),i.add(D)}const u=[],b=[],M=[9064408,9064408,9064408,14176158,5232824];for(let U=0;U<e.lanes.length;U++){const W=e.lanes[U].portal,V=new Xt;V.position.set(W.x,0,W.z);const q=new fe(new ts(2.1,.28,10,28),new Ge({color:2761792,emissive:M[U],emissiveIntensity:.7,roughness:.4}));q.position.y=2.2,V.add(q);const Y=new fe(new Qi(1.85,28),new gn({color:M[U],transparent:!0,opacity:.35,side:Lt,depthWrite:!1}));Y.position.y=2.2,V.add(Y),b.push(Y);const ee=new fe(new St(2.5,2.9,.5,10),new Ge({color:3357781,roughness:.9,flatShading:!0}));ee.position.y=.25,t!=="low"&&(ee.castShadow=!0),V.add(ee);const se=new Zi(new Ti({map:n,color:M[U],transparent:!0,opacity:.5,depthWrite:!1}));se.scale.setScalar(6),se.position.y=2.2,V.add(se),i.add(V),u.push(V)}const S=new Xt,C=new fe(new St(2.6,3.2,1,8),new Ge({color:3818848,roughness:.8,flatShading:!0}));C.position.y=.5,t!=="low"&&(C.castShadow=!0),S.add(C);const R=new fe(new ts(3.4,.12,8,40),new Ge({color:2766160,emissive:3115263,emissiveIntensity:.5}));R.rotation.x=Math.PI/2,R.position.y=.35,S.add(R);const A=new fe(new Ii(1.5,0),new Ge({color:10479871,emissive:4184319,emissiveIntensity:1.4,roughness:.15,metalness:.2}));A.position.y=3,A.scale.set(1,1.5,1),t!=="low"&&(A.castShadow=!0),S.add(A);const F=new zg(5232895,30,26,1.8);F.position.y=3.2,S.add(F);const X=new Zi(new Ti({map:n,color:5232895,transparent:!0,opacity:.6,depthWrite:!1}));X.scale.setScalar(9),X.position.y=3,S.add(X);for(let U=0;U<4;U++){const D=new fe(new Ma(.35,0),new Ge({color:9427199,emissive:4172031,emissiveIntensity:1}));D.position.y=3,S.add(D)}i.add(S);const _=[],w=[],G=new es(1.05,1.3,24),j=new Qi(1.05,24);for(const U of e.pads){const D=new fe(G,new gn({color:4153231,transparent:!0,opacity:0,side:Lt,depthWrite:!1}));D.rotation.x=-Math.PI/2,D.position.set(U.pos.x,.06,U.pos.z),i.add(D),_.push(D);const W=new fe(j,new gn({color:3100543,transparent:!0,opacity:0,side:Lt,depthWrite:!1}));W.rotation.x=-Math.PI/2,W.position.set(U.pos.x,.05,U.pos.z),i.add(W),w.push(W)}const L=[];for(const U of e.lanes){const D=new ut().setFromPoints(U.points.map(V=>new P(V.x,.15,V.z))),W=new ll(D,new xa({color:16711935,transparent:!0,opacity:.8}));W.visible=!1,i.add(W),L.push(W)}return{portals:u,portalDiscs:b,bastion:S,bastionCrystal:A,bastionLight:F,padRings:_,padDiscs:w,laneLines:L}}const Wg=["crawler","wisp","brute","bulwark","shaman","colossus"],kr=96,Mc=40,yc=24,Sc=40;class Xg{constructor(e,t){this.canvas=e,this.sharedGlow=la(),this.renderer=new ol({canvas:e,antialias:!0,powerPreference:"high-performance"}),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Cc,this.renderer.toneMapping=Lc,this.renderer.toneMappingExposure=1.05,this.camera=new Bt(46,1,.1,300),this.camera.position.copy(this.camPos),this.scene.background=new Fe(658968),this.scene.fog=new va(658968,60,130);const n=new Fg(9417983,1709094,.55);this.scene.add(n);const s=new kg(16773853,1.6);s.position.set(28,42,18),s.castShadow=!0,s.shadow.mapSize.set(2048,2048),s.shadow.camera.left=-55,s.shadow.camera.right=55,s.shadow.camera.top=55,s.shadow.camera.bottom=-55,s.shadow.camera.far=120,s.shadow.bias=-4e-4,this.scene.add(s),this.world=Vg(this.scene,t,this.quality),this.buildEnemyMeshes(),this.bossGroup=this.buildBoss(),this.scene.add(this.bossGroup),this.playerGroup=this.buildPlayer(),this.scene.add(this.playerGroup),this.buildProjectileMeshes(),this.buildParticles(),this.buildPatches(),this.buildBeams(),this.buildBars(),this.buildTexts(),this.ghost=this.buildGhost(),this.rangeRing=new fe(new es(.96,1,48),new gn({color:5232895,transparent:!0,opacity:.5,side:Lt,depthWrite:!1})),this.rangeRing.rotation.x=-Math.PI/2,this.rangeRing.visible=!1,this.scene.add(this.rangeRing),this.resize()}renderer;scene=new Dg;camera;world;quality="high";enemyMeshes=new Map;bossGroup;playerGroup;towerGroups=new Map;projMeshes=new Map;points;pGeo;patchMeshes=[];beams=[];bars=[];texts=[];ghost;rangeRing;camPos=new P(0,27,21);camTarget=new P(0,0,0);shake=0;raycaster=new Gg;groundPlane=new wn(new P(0,1,0),0);dummy=new lt;tmpColor=new Fe;time=0;hoverPad=-1;hoverValid=!0;buildSelection=null;selectedTowerId=-1;showRanges=!1;barCursor=0;textCursor=0;beamCursor=0;sharedGlow;buildEnemyMeshes(){const e=[["crawler",new bi(.55,0),new Ge({color:9064408,roughness:.8,flatShading:!0})],["wisp",new en(.42,10,8),new Ge({color:5564671,emissive:3135743,emissiveIntensity:1.2,roughness:.3})],["brute",new Ai(.95,0),new Ge({color:14176094,roughness:.85,flatShading:!0})],["bulwark",new Vt(1.5,1.7,1.1),new Ge({color:10135480,roughness:.6,metalness:.3,flatShading:!0})],["shaman",new Tn(.55,1.5,6),new Ge({color:7208862,emissive:3135594,emissiveIntensity:.7,roughness:.5,flatShading:!0})],["colossus",new Ai(1.5,0),new Ge({color:11816920,roughness:.7,flatShading:!0})]];for(const[t,n,s]of e){const r=new oc(n,s,260);r.count=0,r.instanceMatrix.setUsage(ki),r.castShadow=this.quality!=="low",r.frustumCulled=!1;const o=new Fe(sn[t].color);for(let a=0;a<260;a++)r.setColorAt(a,o);r.instanceColor&&(r.instanceColor.needsUpdate=!0),this.scene.add(r),this.enemyMeshes.set(t,r)}}buildBoss(){const e=new Xt,t=new fe(new Ai(2.4,0),new Ge({color:4860554,emissive:7024600,emissiveIntensity:.5,roughness:.6,flatShading:!0}));t.position.y=2.2,t.castShadow=!0,e.add(t);const n=new fe(new Ii(1.1,0),new Ge({color:7028696,emissive:9064408,emissiveIntensity:.9,flatShading:!0}));n.position.set(0,4.2,1.2),e.add(n);for(let r=0;r<6;r++){const o=new fe(new Tn(.35,1.6,5),new Ge({color:9064408,emissive:4923352,emissiveIntensity:.6,flatShading:!0})),a=r/6*Math.PI*2;o.position.set(Math.cos(a)*2.2,2.6,Math.sin(a)*2.2),o.lookAt(Math.cos(a)*5,3.4,Math.sin(a)*5),o.rotateX(Math.PI/2),e.add(o)}const s=new fe(new en(3.4,16,12),new gn({color:9431295,transparent:!0,opacity:.22,depthWrite:!1}));return s.position.y=2.4,s.visible=!1,e.add(s),e.userData={body:t,head:n,shield:s},e.visible=!1,e}buildPlayer(){const e=new Xt,t=new Ge({color:4876959,roughness:.6,metalness:.2,flatShading:!0}),n=new Ge({color:3100543,roughness:.7,flatShading:!0}),s=new Ge({color:10479871,emissive:5232895,emissiveIntensity:1.6,roughness:.3}),r=new fe(new St(.42,.5,.9,7),t);r.position.y=1.05,r.castShadow=!0,e.add(r);const o=new fe(new bi(.32,0),t);o.position.y=1.75,e.add(o);const a=new fe(new Vt(.34,.1,.2),s);a.position.set(0,1.78,.2),e.add(a);for(const v of[-1,1]){const f=new fe(new bi(.26,0),n);f.position.set(v*.55,1.42,0),e.add(f)}const c=new fe(new St(.05,.05,1.7,5),n);c.position.set(.5,1.1,.35),c.rotation.z=-.25,e.add(c);const l=new fe(new en(.16,10,8),s);l.position.set(.66,1.92,.35),e.add(l);const h=new Xt,d=new Ge({color:13623536,roughness:.25,metalness:.85,flatShading:!0}),p=new fe(new Vt(.09,1.1,.025),d);p.position.y=.55,p.castShadow=!0;const m=new fe(new Vt(.3,.06,.09),n),g=new fe(new St(.04,.045,.3,5),new Ge({color:4864038,roughness:.9,flatShading:!0}));return g.position.y=-.15,h.add(p,m,g),h.position.set(.62,1.05,.25),h.rotation.z=-.5,e.add(h),e.userData={orb:l,sword:h},e}buildProjectileMeshes(){const e=[["bolt",new en(.26,8,6),new Ge({color:10479871,emissive:5232895,emissiveIntensity:2})],["lance",new Tn(.3,1.1,6),new Ge({color:16767055,emissive:16747586,emissiveIntensity:1.6})],["ember",new en(.4,8,6),new Ge({color:16747586,emissive:16731935,emissiveIntensity:2})],["void",new en(.5,8,6),new Ge({color:11816920,emissive:9056216,emissiveIntensity:2})]];for(const[t,n,s]of e){const r=new oc(n,s,220);r.count=0,r.instanceMatrix.setUsage(ki),r.frustumCulled=!1,this.scene.add(r),this.projMeshes.set(t,r)}}buildParticles(){this.pGeo=new ut;const e=new Float32Array(_t*3),t=new Float32Array(_t*3),n=new Float32Array(_t);this.pGeo.setAttribute("position",new bt(e,3).setUsage(ki)),this.pGeo.setAttribute("color",new bt(t,3).setUsage(ki)),this.pGeo.setAttribute("aSize",new bt(n,1).setUsage(ki));const s=new hl({size:.22,vertexColors:!0,transparent:!0,opacity:.95,depthWrite:!1,blending:$r,sizeAttenuation:!0});this.points=new Ng(this.pGeo,s),this.points.frustumCulled=!1,this.scene.add(this.points)}buildPatches(){const e=new Qi(1,24);for(let t=0;t<Sc;t++){const n=new fe(e,new gn({color:16738863,transparent:!0,opacity:.25,depthWrite:!1,side:Lt}));n.rotation.x=-Math.PI/2,n.visible=!1,this.scene.add(n),this.patchMeshes.push(n)}}buildBeams(){for(let e=0;e<yc;e++){const t=new ut;t.setAttribute("position",new bt(new Float32Array(6),3));const n=new ll(t,new xa({color:14221135,transparent:!0,opacity:.9}));n.visible=!1,n.frustumCulled=!1,this.scene.add(n),this.beams.push({line:n,life:0,max:.18})}}buildBars(){for(let e=0;e<kr;e++){const t=_c(1),n=new Zi(new Ti({map:t,transparent:!0,depthWrite:!1}));n.visible=!1,n.scale.set(1.6,.26,1),this.scene.add(n),this.bars.push({sprite:n,ratio:-1,tex:t})}}buildTexts(){for(let e=0;e<Mc;e++){const t=xc("0","#ffffff"),n=new Zi(new Ti({map:t,transparent:!0,depthWrite:!1}));n.visible=!1,n.scale.set(3.4,1.28,1),this.scene.add(n),this.texts.push({sprite:n,life:0,max:1,tex:t})}}buildGhost(){const e=new Xt,t=new Ge({color:5232895,transparent:!0,opacity:.55,emissive:3115263,emissiveIntensity:.5}),n={arcane:new St(.5,.7,1.4,8),frost:new Vt(.7,2,.7),ember:new Tn(.7,1.8,8),tesla:new St(.45,.65,1.6,8)};for(const s of Object.keys(n)){const r=new fe(n[s],t);r.position.y=.8,r.name=s,e.add(r)}return e.visible=!1,this.scene.add(e),e}resetEntities(){for(const[,e]of this.towerGroups)this.scene.remove(e);this.towerGroups.clear(),this.bossGroup.visible=!1,this.shake=0}setQuality(e){this.quality=e,e==="low"?(this.renderer.shadowMap.enabled=!1,this.renderer.setPixelRatio(1)):(this.renderer.shadowMap.enabled=!0,this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,e==="high"?2:1.5)))}resize(){const e=this.canvas.clientWidth||window.innerWidth,t=this.canvas.clientHeight||window.innerHeight;this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix()}screenToGround(e,t){this.raycaster.setFromCamera(new Se(e,t),this.camera);const n=new P;return this.raycaster.ray.intersectPlane(this.groundPlane,n),{x:n.x,y:0,z:n.z}}setBuildState(e,t,n,s,r){this.hoverPad=e,this.hoverValid=t,this.buildSelection=n,this.selectedTowerId=s,this.showRanges=r}addShake(e){this.shake=Math.min(14,this.shake+e)}handleFx(e){for(const t of e)t.type==="shake"?this.addShake(t.amount??2):t.type==="text"||t.type==="dmg"?this.spawnText(t.pos,t.msg??"",t.color??"#ffffff",t.type==="dmg"):t.type==="beam"&&t.pos&&t.pos2&&this.spawnBeam(t.pos,t.pos2,t.color??"#d8ff4f")}spawnText(e,t,n,s){if(!e)return;const r=this.texts[this.textCursor];this.textCursor=(this.textCursor+1)%Mc,r.tex.dispose(),r.tex=xc(t,n,s?34:26),r.sprite.material.map=r.tex,r.sprite.position.set(e.x,e.y+1.6,e.z),r.life=r.max=s?.8:1.2,r.sprite.visible=!0,r.sprite.material.opacity=1,r.sprite.scale.set(s?3.8:3,(s?3.8:3)*.375,1)}spawnBeam(e,t,n){const s=this.beams[this.beamCursor];this.beamCursor=(this.beamCursor+1)%yc,s.line.geometry.getAttribute("position");const r=6,o=new Float32Array(r*3);for(let a=0;a<r;a++){const c=a/(r-1),l=a>0&&a<r-1?(Math.random()-.5)*.8:0,h=a>0&&a<r-1?(Math.random()-.5)*.8:0;o[a*3]=e.x+(t.x-e.x)*c+l,o[a*3+1]=e.y+(t.y-e.y)*c+h,o[a*3+2]=e.z+(t.z-e.z)*c+l}s.line.geometry.setAttribute("position",new bt(o,3)),s.line.material.color.set(n),s.life=s.max=.16,s.line.visible=!0}sync(e,t){this.time+=t,this.updateCamera(e,t),this.updateWorld(e,t),this.updateEnemies(e),this.updateBoss(e),this.updatePlayer(e),this.updateTowers(e),this.updateProjectiles(e),this.updateParticles(e),this.updatePatches(e),this.updateBeams(t),this.updateBars(e,t),this.updateTexts(t),this.updateGhost(e),this.renderer.render(this.scene,this.camera)}updateCamera(e,t){const n=e.player,s=n.pos.x*.85,r=n.pos.z*.85;if(this.camTarget.x+=(s-this.camTarget.x)*Math.min(1,5*t),this.camTarget.z+=(r-this.camTarget.z)*Math.min(1,5*t),this.camTarget.y=0,this.shake>.05){this.shake*=Math.max(0,1-6*t);const o=this.shake*.06;this.camera.position.set(this.camTarget.x+o*(Math.random()-.5)*2,27+o*(Math.random()-.5)*2,this.camTarget.z+21+o*(Math.random()-.5)*2)}else this.camera.position.set(this.camTarget.x,27,this.camTarget.z+21);this.camera.lookAt(this.camTarget.x,1,this.camTarget.z-3)}updateWorld(e,t){const n=this.world;for(let c=0;c<n.portals.length;c++){const l=n.portals[c],h=e.phase==="combat"||e.phase==="prep",d=h?1.2:.3;l.children[0].rotation.z+=d*t;const m=n.portalDiscs[c].material;m.opacity=h?.3+.15*Math.sin(this.time*3+c):.12}const s=n.bastionCrystal;s.rotation.y+=t*.8,s.position.y=3+Math.sin(this.time*1.4)*.15;const r=e.bastionFlash>0?1:0;s.material.emissiveIntensity=1.4+r*3+.3*Math.sin(this.time*2);const o=n.bastion;for(let c=3;c<o.children.length;c++){const l=o.children[c],h=this.time*1.2+(c-3)*(Math.PI/2);l.position.set(Math.cos(h)*2.2,3+Math.sin(this.time*2+c)*.3,Math.sin(h)*2.2),l.rotation.y+=t*2}const a=e.buildMode;for(let c=0;c<n.padRings.length;c++){const l=n.padRings[c],h=n.padDiscs[c],d=e.towers.some(f=>f.padId===c&&!f.dead),p=c===this.hoverPad;let m=0,g=0,v=4153231;a&&(d?m=.08:p?(m=.9,g=.3,v=this.hoverValid?5570462:16733268):(m=.25,g=.06)),l.material.opacity=m,l.material.color.setHex(v),h.material.opacity=g,h.material.color.setHex(v)}for(const c of n.laneLines)c.visible=e.debug.showPaths}updateEnemies(e){const t=new Map;for(const n of e.enemies){if(n.kind==="boss")continue;let s=t.get(n.kind);s||(s=[],t.set(n.kind,s)),s.push(n.hp,n.maxHp,n.pos.x,n.pos.z,n.lane,n.dist,n.flash,n.freezeT,n.spawnT,n.state==="spawn"?1:0,n.slow,n.facing??0)}for(const n of Wg){const s=this.enemyMeshes.get(n),r=t.get(n)??[],o=r.length/12;s.count=o;for(let a=0;a<o;a++){const c=a*12,l=r[c+2],h=r[c+3],d=r[c+6],p=r[c+7],m=r[c+8],v=r[c+9]?Math.max(.05,1-m/.4):1;let f=0;n==="wisp"?f=.9+Math.sin(this.time*4+a)*.15:n==="shaman"?f=.75:f=.4,this.dummy.position.set(l,f,h);const u=r[c+11];this.dummy.rotation.set(0,u,0),this.dummy.scale.setScalar(v*(d>0?1.12:1)),this.dummy.updateMatrix(),s.setMatrixAt(a,this.dummy.matrix),d>0?this.tmpColor.setHex(16777215):p>0?this.tmpColor.setHex(9431295):this.tmpColor.setHex(sn[n].color),s.setColorAt(a,this.tmpColor)}s.instanceMatrix.needsUpdate=!0,s.instanceColor&&(s.instanceColor.needsUpdate=!0)}}updateBoss(e){const t=e.bossRef,n=this.bossGroup;if(!t||t.dead){n.visible=!1;return}n.visible=!0,n.position.set(t.pos.x,0,t.pos.z);const s=n.userData;s.body.rotation.y+=.01,s.body.position.y=2.2+Math.sin(this.time*2)*.2,s.head.position.y=4.2+Math.sin(this.time*2+1)*.2;const r=t.flash>0;s.body.material.emissiveIntensity=r?2:.5,s.shield.visible=t.shieldT>0,s.shield.visible&&(s.shield.material.opacity=.15+.1*Math.sin(this.time*8)),n.rotation.y=t.facing??0}updatePlayer(e){const t=e.player,n=this.playerGroup;n.position.set(t.pos.x,0,t.pos.z),n.rotation.y=t.facing;const s=t.hurtT>0;n.visible=!t.dead;const r=n.userData;if(r.orb.material.emissiveIntensity=s?3:1.6,r.sword)if(t.meleeAnim>0){const o=1-t.meleeAnim/.2,a=o*o*(3-2*o);r.sword.rotation.y=-1.4+a*2.6,r.sword.rotation.z=-.5+Math.sin(a*Math.PI)*.4}else r.sword.rotation.y=0,r.sword.rotation.z=-.5}updateTowers(e){for(const[n,s]of this.towerGroups)e.towers.some(r=>r.id===n)||(this.scene.remove(s),this.towerGroups.delete(n));for(const n of e.towers){let s=this.towerGroups.get(n.id);s||(s=this.buildTowerGroup(n.kind,n.level),s.position.set(n.pos.x,0,n.pos.z),this.scene.add(s),this.towerGroups.set(n.id,s),s.userData.spawnT=.3);const r=s.userData;if(r.spawnT>0){r.spawnT-=.016;const a=1+Math.max(0,r.spawnT)*1.5;s.scale.setScalar(2-a)}else s.scale.setScalar(1);r.head&&(r.head.rotation.y=n.headAngle);const o=n.stormCd>0;r.glow&&(r.glow.material.opacity=o?.15:.4+.15*Math.sin(this.time*4+n.id)),r.glow&&r.glow.material.color.setHex(o?11816920:Jt[n.kind].color),n.flash>0&&r.body&&(r.body.material.emissiveIntensity=2)}const t=e.towers.find(n=>n.id===this.selectedTowerId);t&&(e.buildMode||this.showRanges)?(this.rangeRing.visible=!0,this.rangeRing.position.set(t.pos.x,.07,t.pos.z),this.rangeRing.scale.setScalar(t.range),this.rangeRing.material.color.setHex(Jt[t.kind].color)):this.showRanges&&e.towers.length>0?this.rangeRing.visible=!1:this.rangeRing.visible=!1}buildTowerGroup(e,t){const n=new Xt,s=Jt[e],r=new Ge({color:s.color,roughness:.5,metalness:.3,flatShading:!0,emissive:s.color,emissiveIntensity:.25}),o=new Ge({color:3818848,roughness:.8,flatShading:!0});let a=null,c=null;switch(e){case"arcane":{const h=new fe(new St(.75,.95,.5,8),o);h.position.y=.25,a=new fe(new St(.42,.55,1.1,8),r),a.position.y=1,c=new fe(new en(.34,10,8),r),c.position.y=1.75,n.add(h,a,c);break}case"frost":{const h=new fe(new St(.8,1,.4,6),o);h.position.y=.2,a=new fe(new Vt(.7,2.1,.7),r),a.position.y=1.4,c=new fe(new Ii(.42,0),r),c.position.y=2.8,n.add(h,a,c);break}case"ember":{const h=new fe(new St(.85,1.05,.45,8),o);h.position.y=.22,a=new fe(new Tn(.75,1.9,8),r),a.position.y=1.4,c=new fe(new en(.3,8,6),r),c.position.y=2.5,n.add(h,a,c);break}case"tesla":{const h=new fe(new St(.7,.9,.4,8),o);h.position.y=.2,a=new fe(new St(.35,.5,1.5,8),r),a.position.y=1.1,c=new fe(new bi(.45,0),r),c.position.y=2.2,n.add(h,a,c);break}}a&&(a.castShadow=!0);for(let h=0;h<t-1;h++){const d=new fe(new ts(.9+h*.25,.06,6,20),new Ge({color:16767055,emissive:16754767,emissiveIntensity:.8}));d.rotation.x=Math.PI/2,d.position.y=.15+h*.12,n.add(d)}const l=new Zi(new Ti({map:la(),color:s.color,transparent:!0,opacity:.4,depthWrite:!1}));return l.scale.setScalar(2.6),l.position.y=1.6,n.add(l),n.userData={body:a,head:c,glow:l,spawnT:0},n}updateProjectiles(e){const t=new Map;for(const n of e.projectilePool){if(!n.active)continue;let s=t.get(n.kind);s||(s=[],t.set(n.kind,s)),s.push(n)}for(const[n,s]of this.projMeshes){const r=t.get(n)??[];s.count=r.length;for(let o=0;o<r.length;o++){const a=r[o];if(this.dummy.position.set(a.pos.x,a.pos.y,a.pos.z),n==="lance"){const c=Math.atan2(a.vel.x,a.vel.z);this.dummy.rotation.set(0,c,0),this.dummy.rotateX(Math.PI/2)}else this.dummy.rotation.set(0,0,0);this.dummy.scale.setScalar(1),this.dummy.updateMatrix(),s.setMatrixAt(o,this.dummy.matrix)}s.instanceMatrix.needsUpdate=!0}}updateParticles(e){const t=e.particles,n=this.pGeo.getAttribute("position"),s=this.pGeo.getAttribute("color");for(let r=0;r<t.count;r++){n.setXYZ(r,t.px[r],t.py[r],t.pz[r]);const o=Math.max(0,t.life[r]/t.maxLife[r]);s.setXYZ(r,t.cr[r]*o,t.cg[r]*o,t.cb[r]*o)}this.pGeo.setDrawRange(0,t.count),n.needsUpdate=!0,s.needsUpdate=!0}updatePatches(e){for(let t=0;t<Sc;t++){const n=this.patchMeshes[t],s=e.patches[t];if(!s){n.visible=!1;continue}n.visible=!0,n.position.set(s.pos.x,.08,s.pos.z),n.scale.setScalar(s.radius*(.9+.1*Math.sin(this.time*10+t))),n.material.opacity=.18+.14*(s.life/s.maxLife)+.05*Math.sin(this.time*12+t)}}updateBeams(e){for(const t of this.beams){if(t.life<=0){t.line.visible=!1;continue}t.life-=e,t.line.material.opacity=Math.max(0,t.life/t.max)*.9}}updateBars(e,t){const n=[];for(const r of e.enemies)r.dead||r.hp>=r.maxHp||n.push({x:r.pos.x,y:r.pos.y+r.radius*2+.7,z:r.pos.z,hp:r.hp,max:r.maxHp,scale:r.radius*1.8});for(const r of e.towers)r.hp>=r.maxHp||n.push({x:r.pos.x,y:3.2,z:r.pos.z,hp:r.hp,max:r.maxHp,scale:1.6});let s=0;for(let r=0;r<kr&&s<n.length;r++){const o=this.bars[r],a=n[s++];o.sprite.visible=!0,o.sprite.position.set(a.x,a.y,a.z),o.sprite.scale.set(a.scale,a.scale*.16,1);const c=a.hp/a.max;Math.abs(c-o.ratio)>.02&&(o.ratio=c,o.tex.dispose(),o.tex=_c(c),o.sprite.material.map=o.tex)}for(let r=s;r<kr;r++)this.bars[r].sprite.visible=!1}updateTexts(e){for(const t of this.texts){if(t.life<=0){t.sprite.visible=!1;continue}t.life-=e,t.sprite.position.y+=e*1.6,t.sprite.material.opacity=Math.max(0,t.life/t.max)}}updateGhost(e){const t=this.buildSelection;if(!e.buildMode||!t||this.hoverPad<0){this.ghost.visible=!1;return}const n=e.arena.pads[this.hoverPad];this.ghost.visible=!0,this.ghost.position.set(n.pos.x,0,n.pos.z);for(const o of this.ghost.children)o.visible=o.name===t;const s=this.ghost.children.find(o=>o.name===t).material;s.color.setHex(this.hoverValid?5570462:16733268),s.emissive.setHex(this.hoverValid?3135594:14167855);const r=ha(t,1);this.rangeRing.visible=!0,this.rangeRing.position.set(n.pos.x,.07,n.pos.z),this.rangeRing.scale.setScalar(r.range),this.rangeRing.material.color.setHex(this.hoverValid?5570462:16733268),this.rangeRing.material.opacity=.4}}class qg{keys=new Set;mouseNdc={x:0,y:0};mouseDown=!1;rightDown=!1;dashPressed=!1;qPressed=!1;ePressed=!1;rPressed=!1;fPressed=!1;clickPos=null;onTab=null;onEscape=null;onF2=null;canvas;enabled=!0;constructor(e){this.canvas=e,window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("mousemove",this.onMouseMove),e.addEventListener("mousedown",this.onMouseDown),window.addEventListener("mouseup",this.onMouseUp),e.addEventListener("contextmenu",this.onContextMenu),window.addEventListener("contextmenu",this.onContextMenu),window.addEventListener("blur",this.onBlur)}destroy(){window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("mousemove",this.onMouseMove),this.canvas.removeEventListener("mousedown",this.onMouseDown),window.removeEventListener("mouseup",this.onMouseUp),this.canvas.removeEventListener("contextmenu",this.onContextMenu),window.removeEventListener("contextmenu",this.onContextMenu),window.removeEventListener("blur",this.onBlur)}onContextMenu=e=>e.preventDefault();onKeyDown=e=>{if(!this.enabled)return;const t=e.key.toLowerCase();if(t==="tab"){e.preventDefault(),this.onTab?.();return}if(t==="escape"){this.onEscape?.();return}if(t==="f2"){e.preventDefault(),this.onF2?.();return}t===" "&&(e.preventDefault(),this.keys.has(" ")||(this.dashPressed=!0)),t==="q"&&!this.keys.has("q")&&(this.qPressed=!0),t==="e"&&!this.keys.has("e")&&(this.ePressed=!0),t==="r"&&!this.keys.has("r")&&(this.rPressed=!0),t==="f"&&!this.keys.has("f")&&(this.fPressed=!0),this.keys.add(t)};onKeyUp=e=>{this.keys.delete(e.key.toLowerCase())};onMouseMove=e=>{const t=this.canvas.getBoundingClientRect();this.mouseNdc.x=(e.clientX-t.left)/t.width*2-1,this.mouseNdc.y=-((e.clientY-t.top)/t.height)*2+1};onMouseDown=e=>{if(this.enabled)if(e.button===0){this.mouseDown=!0;const t=this.canvas.getBoundingClientRect();this.clickPos={x:e.clientX-t.left,y:e.clientY-t.top}}else e.button===2&&(this.rightDown=!0)};onMouseUp=e=>{e.button===0&&(this.mouseDown=!1),e.button===2&&(this.rightDown=!1)};onBlur=()=>{this.keys.clear(),this.mouseDown=!1,this.rightDown=!1};get moveX(){let e=0;return this.keys.has("d")&&(e+=1),this.keys.has("a")&&(e-=1),e}get moveY(){let e=0;return this.keys.has("w")&&(e+=1),this.keys.has("s")&&(e-=1),e}snapshot(){const e={moveX:this.moveX,moveY:this.moveY,aimNdc:{...this.mouseNdc},firing:this.mouseDown&&this.enabled,lance:this.rightDown&&this.enabled,dash:this.dashPressed,q:this.qPressed,e:this.ePressed,r:this.rPressed,f:this.fPressed};return this.dashPressed=this.qPressed=this.ePressed=this.rPressed=this.fPressed=!1,e}}class Yg{root;el={};cb;diff="normal";settings={music:.5,sfx:.7,quality:"high"};announceTimer=null;constructor(e,t){this.root=e,this.cb=t,this.build()}setDifficulty(e){this.diff=e,this.refreshMenu()}setSettings(e){this.settings=e}build(){const e=this.root;e.innerHTML=['<div class="screen menu-screen" id="menu-screen">','  <div class="menu-inner">','    <h1 class="game-title">LAST BASTION</h1>','    <p class="tagline">Hold the crystal. Outlast the void.</p>','    <div class="menu-col">','      <div class="menu-section">',"        <label>Difficulty</label>",'        <div class="diff-row">','          <button class="btn diff-btn" data-diff="easy">Easy</button>','          <button class="btn diff-btn" data-diff="normal">Normal</button>','          <button class="btn diff-btn" data-diff="hard">Hard</button>',"        </div>",'        <p class="diff-desc" id="diff-desc"></p>',"      </div>",'      <button class="btn primary big" id="btn-start">Start Defense</button>','      <div class="menu-row">','        <button class="btn" id="btn-controls">Controls</button>','        <button class="btn" id="btn-settings">Settings</button>',"      </div>",'      <p class="best-wave" id="best-wave"></p>',"    </div>","  </div>",'  <div class="modal hidden" id="controls-modal">',"    <h2>Controls</h2>",'    <div class="controls-grid">',"      <div><b>WASD</b><span>Move</span></div>","      <div><b>Mouse</b><span>Aim</span></div>","      <div><b>Auto</b><span>Melee swing (enemies in reach)</span></div>","      <div><b>Left Click</b><span>Bolt attack</span></div>","      <div><b>Right Click</b><span>Lance (piercing, cooldown)</span></div>","      <div><b>Space</b><span>Dash</span></div>","      <div><b>Q</b><span>Ground Slam</span></div>","      <div><b>E</b><span>Arcane Volley</span></div>","      <div><b>R</b><span>Blink (unlockable)</span></div>","      <div><b>F</b><span>Overcharge (unlockable)</span></div>","      <div><b>Tab</b><span>Build mode</span></div>","      <div><b>Esc</b><span>Pause</span></div>","      <div><b>F2</b><span>Debug panel</span></div>","    </div>",'    <button class="btn" data-close>Close</button>',"  </div>",'  <div class="modal hidden" id="settings-modal">',"    <h2>Settings</h2>",'    <label>Music <input type="range" id="set-music" min="0" max="1" step="0.05"></label>','    <label>SFX <input type="range" id="set-sfx" min="0" max="1" step="0.05"></label>',"    <label>Quality",'      <select id="set-quality">','        <option value="low">Low</option>','        <option value="medium">Medium</option>','        <option value="high">High</option>',"      </select>","    </label>",'    <button class="btn" data-close>Close</button>',"  </div>","</div>",'<div class="hud hidden" id="hud">','  <div class="hud-top">','    <div class="panel bastion-panel">','      <div class="panel-label">BASTION</div>','      <div class="hp-bar big"><div class="hp-fill" id="bastion-hp-fill"></div><span class="hp-text" id="bastion-hp-text"></span></div>',"    </div>",'    <div class="panel wave-panel">','      <div class="wave-num" id="wave-num">WAVE 1</div>','      <div class="wave-sub" id="wave-sub"></div>','      <div class="enemies-left" id="enemies-left"></div>',"    </div>",'    <div class="panel essence-panel">','      <div class="essence-icon">&#9672;</div>','      <div class="essence-val" id="essence-val">0</div>',"    </div>","  </div>",'  <div class="boss-bar-wrap hidden" id="boss-bar-wrap">','    <div class="boss-name">THE RIFT BEHEMOTH</div>','    <div class="hp-bar boss"><div class="hp-fill" id="boss-hp-fill"></div></div>',"  </div>",'  <div class="prep-panel hidden" id="prep-panel">','    <div class="prep-title">NEXT WAVE</div>','    <div class="prep-composition" id="prep-composition"></div>','    <div class="prep-count" id="prep-count"></div>','    <button class="btn primary" id="btn-early">Start Wave Early <span class="early-bonus" id="early-bonus"></span></button>',"  </div>",'  <div class="hud-bottom">','    <div class="panel player-panel">','      <div class="panel-label">GUARDIAN</div>','      <div class="hp-bar"><div class="hp-fill" id="player-hp-fill"></div><span class="hp-text" id="player-hp-text"></span></div>',"    </div>",'    <div class="abilities" id="abilities"></div>','    <div class="build-hint" id="build-hint">TAB &#8212; Build Mode</div>',"  </div>",'  <div class="build-bar hidden" id="build-bar"></div>','  <div class="tower-panel hidden" id="tower-panel"></div>','  <div class="upgrades-strip hidden" id="upgrades-strip"></div>','  <div class="announce-wrap"><div class="announce" id="announce"></div><div class="announce-sub" id="announce-sub"></div></div>',"</div>",'<div class="screen pause-screen hidden" id="pause-screen">','  <div class="menu-inner small">','    <h1 class="pause-title">PAUSED</h1>','    <button class="btn primary big" id="btn-resume">Resume</button>','    <div class="menu-row">','      <button class="btn" id="btn-pause-settings">Settings</button>','      <button class="btn danger" id="btn-quit">Quit to Menu</button>',"    </div>","  </div>","</div>",'<div class="screen upgrade-screen hidden" id="upgrade-screen">','  <div class="upgrade-inner">','    <h1 class="upgrade-title">THE BASTION RESONATES</h1>','    <p class="upgrade-sub">Choose a boon for the defense</p>','    <div class="cards" id="cards"></div>',"  </div>","</div>",'<div class="screen end-screen hidden" id="end-screen">','  <div class="menu-inner small">','    <h1 id="end-title">VICTORY</h1>','    <p id="end-sub"></p>','    <div class="end-stats" id="end-stats"></div>','    <button class="btn primary big" id="btn-again">Defend Again</button>','    <button class="btn" id="btn-end-menu">Main Menu</button>',"  </div>","</div>",'<div class="debug-panel hidden" id="debug-panel"></div>'].join(`
`),this.wire(),this.refreshMenu()}$(e){return this.el[e]||(this.el[e]=this.root.querySelector("#"+e)),this.el[e]}wire(){const e=t=>this.$(t);this.root.querySelectorAll(".diff-btn").forEach(t=>{t.addEventListener("click",()=>{this.diff=t.dataset.diff,this.refreshMenu()})}),e("btn-start").addEventListener("click",()=>this.cb.onStartGame(this.diff)),e("btn-controls").addEventListener("click",()=>e("controls-modal").classList.remove("hidden")),e("btn-settings").addEventListener("click",()=>{e("settings-modal").classList.remove("hidden"),this.syncSettingsInputs()}),this.root.querySelectorAll("[data-close]").forEach(t=>t.addEventListener("click",()=>{t.parentElement.classList.add("hidden")})),e("set-music").addEventListener("input",()=>this.emitSettings()),e("set-sfx").addEventListener("input",()=>this.emitSettings()),e("set-quality").addEventListener("change",()=>this.emitSettings()),e("btn-early").addEventListener("click",()=>this.cb.onStartEarly()),e("btn-resume").addEventListener("click",()=>this.cb.onResume()),e("btn-quit").addEventListener("click",()=>this.cb.onQuitToMenu()),e("btn-pause-settings").addEventListener("click",()=>{e("settings-modal").classList.remove("hidden"),this.syncSettingsInputs()}),e("btn-again").addEventListener("click",()=>this.cb.onRestart()),e("btn-end-menu").addEventListener("click",()=>this.cb.onQuitToMenu())}syncSettingsInputs(){this.$("set-music").value=String(this.settings.music),this.$("set-sfx").value=String(this.settings.sfx),this.$("set-quality").value=this.settings.quality}emitSettings(){this.settings={music:parseFloat(this.$("set-music").value),sfx:parseFloat(this.$("set-sfx").value),quality:this.$("set-quality").value},this.cb.onSettings(this.settings)}refreshMenu(){this.root.querySelectorAll(".diff-btn").forEach(t=>{t.classList.toggle("active",t.dataset.diff===this.diff)});const e={easy:"Fewer, slower enemies. Generous Essence. Longer preparation.",normal:"The intended experience.",hard:"Faster, tougher swarms. Scarce Essence. Short preparation."};this.$("diff-desc").textContent=e[this.diff]}showBestWave(e){this.$("best-wave").textContent=e>0?"Best run: wave "+e+" of "+un.length:"No completed runs yet"}showMenu(){this.closeModals(),this.show("menu-screen"),this.hide("hud"),this.hide("pause-screen"),this.hide("upgrade-screen"),this.hide("end-screen"),this.hide("debug-panel")}showHud(){this.hide("menu-screen"),this.hide("pause-screen"),this.hide("upgrade-screen"),this.hide("end-screen"),this.show("hud")}showPause(){this.show("pause-screen"),this.hide("hud")}hidePause(){this.hide("pause-screen"),this.show("hud")}closeModals(){let e=!1;for(const t of["settings-modal","controls-modal"]){const n=this.$(t);n&&!n.classList.contains("hidden")&&(n.classList.add("hidden"),e=!0)}return e}showUpgrade(e){this.show("upgrade-screen");const t=this.$("cards");t.innerHTML="";for(const n of e){const s=document.createElement("div");s.className="card cat-"+n.category,s.innerHTML='<div class="card-icon">'+n.icon+'</div><div class="card-name">'+n.name+'</div><div class="card-desc">'+n.desc+'</div><div class="card-cat">'+n.category+"</div>",s.addEventListener("click",()=>this.cb.onChooseCard(n.id)),t.appendChild(s)}}showEnd(e,t){this.show("end-screen"),this.$("end-title").textContent=e?"THE BASTION STANDS":"THE BASTION HAS FALLEN",this.$("end-title").className=e?"end-title victory":"end-title defeat",this.$("end-sub").textContent=e?"The Rift Behemoth is destroyed. The crystal endures.":"The void swallows the last light. Wave "+t.wave+" of "+un.length+".";const n=Math.floor(t.time/60),s=Math.floor(t.time%60);this.$("end-stats").innerHTML="<div><b>"+t.wave+"</b><span>waves reached</span></div><div><b>"+t.kills+"</b><span>void creatures slain</span></div><div><b>"+t.essence+"</b><span>essence gathered</span></div><div><b>"+t.towers+"</b><span>towers built</span></div><div><b>"+n+":"+s.toString().padStart(2,"0")+"</b><span>time defended</span></div>"}show(e){this.$(e).classList.remove("hidden")}hide(e){this.$(e).classList.add("hidden")}updateHud(e){if(this.$("hud").classList.contains("hidden"))return;const t=e.bastionHp/e.bastionMaxHp,n=this.$("bastion-hp-fill");n.style.width=(t*100).toFixed(1)+"%",n.className="hp-fill"+(t<.3?" low":t<.6?" mid":""),this.$("bastion-hp-text").textContent=Math.ceil(e.bastionHp)+" / "+e.bastionMaxHp;const s=e.player.hp/e.player.maxHp,r=this.$("player-hp-fill");r.style.width=(s*100).toFixed(1)+"%",r.className="hp-fill"+(s<.3?" low":s<.6?" mid":""),this.$("player-hp-text").textContent=Math.ceil(e.player.hp)+" / "+e.player.maxHp,this.$("essence-val").textContent=String(Math.floor(e.essence));const o=e.phase==="combat";this.$("wave-num").textContent=e.wave>0?"WAVE "+e.wave+" / "+un.length:"STANDBY",this.$("wave-sub").textContent=e.wave>0&&e.wave<=un.length?un[e.wave-1].label:"";const a=e.enemies.length+e.spawnQueue.length;this.$("enemies-left").textContent=o?a+" enemies remaining":"";const c=e.bossRef,l=this.$("boss-bar-wrap");c&&!c.dead&&(e.phase==="combat"||e.phase==="prep")?(l.classList.remove("hidden"),this.$("boss-hp-fill").style.width=(c.hp/c.maxHp*100).toFixed(1)+"%"):l.classList.add("hidden");const h=this.$("prep-panel");if(e.phase==="prep"&&e.wave>0){h.classList.remove("hidden");const d=_h(e.wave,e.difficulty);this.$("prep-composition").innerHTML=d.map(m=>'<span class="comp-item"><i style="background:#'+m.color.toString(16).padStart(6,"0")+'"></i>'+m.count+" "+m.name+(m.count>1?"s":"")+"</span>").join(""),this.$("prep-count").textContent="Starting in: "+Math.ceil(e.prepTime)+"s";const p=Math.round(e.prepTime*2*e.mods.earlyBonusMult);this.$("early-bonus").textContent=p>0?"(+"+p+" essence)":""}else h.classList.add("hidden");this.updateAbilities(e),this.updateBuildBar(e),this.updateTowerPanel(e),this.updateUpgradesStrip(e),this.$("build-hint").classList.toggle("active",e.buildMode),this.$("build-hint").textContent=e.buildMode?"TAB - Exit Build Mode":"TAB - Build Mode"}updateAbilities(e){const t=this.$("abilities"),n=["Q","E","R","F"];t.children.length!==4&&(t.innerHTML=n.map(a=>'<div class="ability" data-key="'+a+'"><div class="ability-cd"></div><div class="ability-key">'+a+'</div><div class="ability-name"></div></div>').join(""));const s={Q:this.cdQ,E:this.cdE,R:this.cdR,F:this.cdF},r={Q:fn.Q.cd,E:fn.E.cd,R:fn.R.cd,F:fn.F.cd},o={Q:!1,E:!1,R:!e.mods.blink,F:!e.mods.overcharge};for(const a of n){const c=t.querySelector('[data-key="'+a+'"]'),l=s[a];c.querySelector(".ability-cd").style.height=(l/r[a]*100).toFixed(1)+"%",c.querySelector(".ability-name").textContent=fn[a].name,c.classList.toggle("locked",o[a]),c.classList.toggle("ready",l<=0&&!o[a])}}cdQ=0;cdE=0;cdR=0;cdF=0;setCds(e,t,n,s){this.cdQ=e,this.cdE=t,this.cdR=n,this.cdF=s}updateBuildBar(e){const t=this.$("build-bar");if(!e.buildMode){t.classList.add("hidden");return}if(t.classList.remove("hidden"),t.children.length===0){for(const s of El){const r=Jt[s],o=document.createElement("button");o.className="tower-btn",o.dataset.kind=s,o.innerHTML='<div class="tower-icon" style="color:#'+r.color.toString(16).padStart(6,"0")+'">'+r.icon+'</div><div class="tower-name">'+r.name+'</div><div class="tower-cost">&#9672; '+r.cost+"</div>",o.addEventListener("click",()=>this.cb.onBuildSelect(s)),t.appendChild(o)}const n=document.createElement("button");n.className="tower-btn exit",n.innerHTML='<div class="tower-icon">&#10005;</div><div class="tower-name">Exit</div><div class="tower-cost">TAB</div>',n.addEventListener("click",()=>this.cb.onBuildSelect(null)),t.appendChild(n)}for(const n of t.children){const s=n,r=s.dataset.kind;r&&(s.classList.toggle("selected",e.buildSelection===r),s.classList.toggle("unaffordable",e.essence<Jt[r].cost))}}updateTowerPanel(e){const t=this.$("tower-panel"),n=e.towers.find(a=>a.id===e.selectedTowerId);if(!n||!e.buildMode){t.classList.add("hidden");return}t.classList.remove("hidden");const s=Jt[n.kind],r=n.level<3?s.upgrades[n.level-1]:null,o=Math.round(n.invested*e.mods.sellRefund);t.innerHTML='<div class="tp-title" style="color:#'+s.color.toString(16).padStart(6,"0")+'">'+s.icon+" "+s.name+' <span class="tp-level">LV'+n.level+'</span></div><div class="tp-stats"><span>DMG '+Math.round(n.damage)+"</span><span>RNG "+Math.round(n.range)+"</span><span>SPD "+(1/n.interval).toFixed(2)+"/s</span><span>HP "+Math.ceil(n.hp)+"/"+n.maxHp+"</span></div>"+(r?'<button class="btn primary tp-btn" id="tp-upgrade"'+(e.essence<r.cost?" disabled":"")+">Upgrade: "+r.name+" (&#9672; "+r.cost+')</button><p class="tp-desc">'+r.desc+"</p>":'<p class="tp-desc">Fully upgraded.</p>')+'<button class="btn tp-btn" id="tp-sell">Sell (&#9672; '+o+")</button>",r&&t.querySelector("#tp-upgrade").addEventListener("click",()=>this.cb.onUpgradeTower()),t.querySelector("#tp-sell").addEventListener("click",()=>this.cb.onSellTower())}updateUpgradesStrip(e){const t=this.$("upgrades-strip");if(e.acquiredCards.length===0){t.classList.add("hidden");return}t.classList.remove("hidden");const n=e.acquiredCards.map(s=>{const r=Yr.find(o=>o.id===s);return r?'<span class="upg-icon" title="'+r.name+": "+r.desc+'">'+r.icon+"</span>":""}).join("");t.innerHTML=n}announce(e,t,n="#9fe8ff"){const s=this.$("announce"),r=this.$("announce-sub");s.textContent=e,s.style.color=n,r.textContent=t,s.classList.remove("show"),s.offsetWidth,s.classList.add("show"),this.announceTimer&&window.clearTimeout(this.announceTimer),this.announceTimer=window.setTimeout(()=>s.classList.remove("show"),2600)}showDebug(e){this.$("debug-panel").classList.toggle("hidden",!e)}updateDebug(e){const t=this.$("debug-panel");t.classList.contains("hidden")||(t.innerHTML='<div class="dbg-title">DEBUG (F2)</div><div class="dbg-row"><span>FPS</span><b>'+e.fps.toFixed(0)+'</b></div><div class="dbg-row"><span>Frame</span><b>'+e.frameMs.toFixed(2)+' ms</b></div><div class="dbg-row"><span>Enemies</span><b>'+e.enemies+'</b></div><div class="dbg-row"><span>Projectiles</span><b>'+e.projectiles+'</b></div><div class="dbg-row"><span>Towers</span><b>'+e.towers+'</b></div><div class="dbg-row"><span>Particles</span><b>'+e.particles+'</b></div><div class="dbg-row"><span>Essence</span><b>'+Math.floor(e.essence)+'</b></div><div class="dbg-row"><span>Bastion</span><b>'+Math.ceil(e.bastion)+'</b></div><div class="dbg-row"><span>Wave</span><b>'+e.wave+'</b></div><div class="dbg-row"><span>Speed</span><b>'+e.speed+'x</b></div><div class="dbg-btns"><button data-cmd="wave">Next Wave</button><button data-cmd="spawnpause">'+(e.spawnPaused?"Resume Spawn":"Pause Spawn")+'</button><button data-cmd="essence">+500</button><button data-cmd="dmg">Bastion -100</button><button data-cmd="killall">Kill All</button><button data-cmd="paths">'+(e.showPaths?"Hide":"Show")+' Paths</button><button data-cmd="ranges">'+(e.showRanges?"Hide":"Show")+' Ranges</button><button data-cmd="speed05">0.5x</button><button data-cmd="speed1">1x</button><button data-cmd="speed2">2x</button><button data-cmd="speed4">4x</button></div><div class="dbg-spawn"><span>Spawn:</span>'+["crawler","wisp","brute","bulwark","shaman","colossus","boss"].map(n=>'<button data-cmd="spawn" data-arg="'+n+'">'+n+"</button>").join("")+"</div>",t.querySelectorAll("button").forEach(n=>{n.addEventListener("click",()=>{this.cb.onDebug(n.dataset.cmd,n.dataset.arg)})}))}}class jg{ctx=null;master=null;sfxGain=null;musicGain=null;musicNodes=[];sfxVolume=.7;musicVolume=.4;lastPlay={};init(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}const e=window.AudioContext||window.webkitAudioContext;e&&(this.ctx=new e,this.master=this.ctx.createGain(),this.master.gain.value=.8,this.master.connect(this.ctx.destination),this.sfxGain=this.ctx.createGain(),this.sfxGain.gain.value=this.sfxVolume,this.sfxGain.connect(this.master),this.musicGain=this.ctx.createGain(),this.musicGain.gain.value=this.musicVolume*.35,this.musicGain.connect(this.master),this.startMusic())}setVolumes(e,t){this.sfxVolume=e,this.musicVolume=t,this.sfxGain&&(this.sfxGain.gain.value=e*1.25),this.musicGain&&(this.musicGain.gain.value=t*.35)}startMusic(){if(!this.ctx||!this.musicGain)return;const e=this.ctx.createBiquadFilter();e.type="lowpass",e.frequency.value=260;const t=this.ctx.createOscillator();t.frequency.value=.06;const n=this.ctx.createGain();n.gain.value=180,t.connect(n),n.connect(e.frequency),t.start();for(const s of[55,82.5,110.3]){const r=this.ctx.createOscillator();r.type="sine",r.frequency.value=s;const o=this.ctx.createGain();o.gain.value=.12,r.connect(o),o.connect(e),r.start(),this.musicNodes.push(r)}e.connect(this.musicGain),this.musicNodes.push(t)}tone(e,t,n,s,r,o=0){if(!this.ctx||!this.sfxGain)return;const a=this.ctx.currentTime+o,c=this.ctx.createOscillator();c.type=n,c.frequency.setValueAtTime(e,a),r&&c.frequency.exponentialRampToValueAtTime(Math.max(20,r),a+t);const l=this.ctx.createGain();l.gain.setValueAtTime(1e-4,a),l.gain.exponentialRampToValueAtTime(s,a+.008),l.gain.exponentialRampToValueAtTime(1e-4,a+t),c.connect(l),l.connect(this.sfxGain),c.start(a),c.stop(a+t+.02)}noise(e,t,n,s=0,r="lowpass"){if(!this.ctx||!this.sfxGain)return;const o=this.ctx.currentTime+s,a=Math.max(1,Math.floor(this.ctx.sampleRate*e)),c=this.ctx.createBuffer(1,a,this.ctx.sampleRate),l=c.getChannelData(0);for(let m=0;m<a;m++)l[m]=Math.random()*2-1;const h=this.ctx.createBufferSource();h.buffer=c;const d=this.ctx.createBiquadFilter();d.type=r,d.frequency.value=t;const p=this.ctx.createGain();p.gain.setValueAtTime(n,o),p.gain.exponentialRampToValueAtTime(1e-4,o+e),h.connect(d),d.connect(p),p.connect(this.sfxGain),h.start(o)}play(e){if(!this.ctx)return;const t=performance.now(),n=this.lastPlay[e]??0,s=e==="hit"||e==="shoot"||e==="arcane"?45:70;if(!(t-n<s))switch(this.lastPlay[e]=t,e){case"shoot":this.tone(720,.07,"square",.14,380);break;case"lance":this.tone(300,.18,"sawtooth",.14,90),this.noise(.12,1800,.08);break;case"lance_hit":this.tone(180,.12,"square",.14,60),this.noise(.1,900,.1);break;case"hit":this.tone(340,.05,"square",.11,200);break;case"arcane":this.tone(980,.06,"square",.11,620);break;case"frost":this.tone(1400,.25,"triangle",.09,2200),this.tone(1900,.3,"sine",.05,2600,.05);break;case"ember":this.noise(.2,700,.1),this.tone(140,.2,"sine",.08,60);break;case"explode":this.noise(.4,500,.22),this.tone(90,.35,"sine",.18,40);break;case"tesla":this.noise(.08,4e3,.1,0,"highpass"),this.tone(2400,.07,"square",.06,900);break;case"enemy_die":this.tone(500,.14,"triangle",.1,120),this.noise(.1,1200,.06);break;case"boss_die":this.noise(1.2,400,.3),this.tone(70,1,"sine",.25,30);break;case"spawn":this.tone(220,.3,"sine",.08,440);break;case"wave_start":this.tone(110,.5,"sawtooth",.14),this.tone(165,.5,"sawtooth",.1,void 0,.05),this.tone(220,.6,"sawtooth",.1,void 0,.1);break;case"wave_clear":this.tone(440,.12,"triangle",.12),this.tone(554,.12,"triangle",.12,void 0,.1),this.tone(659,.2,"triangle",.12,void 0,.2);break;case"victory":[523,659,784,1046].forEach((r,o)=>this.tone(r,.35,"triangle",.14,void 0,o*.18));break;case"defeat":[330,262,196,131].forEach((r,o)=>this.tone(r,.5,"sawtooth",.12,void 0,o*.25));break;case"place":this.tone(180,.08,"square",.12,120),this.noise(.06,800,.08);break;case"upgrade":this.tone(520,.1,"triangle",.12),this.tone(780,.16,"triangle",.12,void 0,.09);break;case"sell":this.tone(600,.08,"triangle",.1),this.tone(400,.12,"triangle",.1,void 0,.07);break;case"tower_hit":this.tone(120,.1,"square",.1,70);break;case"tower_destroy":this.noise(.5,600,.2),this.tone(100,.4,"sine",.16,45);break;case"bastion_hit":this.tone(70,.3,"sine",.2,40),this.noise(.15,400,.1);break;case"player_hit":this.tone(240,.15,"sawtooth",.14,90);break;case"dash":this.noise(.15,2500,.08,0,"highpass");break;case"swing":this.noise(.09,2600,.07,0,"bandpass"),this.tone(240,.08,"triangle",.06,520);break;case"slam":this.noise(.5,350,.28),this.tone(60,.45,"sine",.24,30);break;case"volley":for(let r=0;r<5;r++)this.tone(800+r*60,.05,"square",.06,500,r*.04);break;case"blink":this.tone(1200,.12,"sine",.1,2400);break;case"overcharge":this.tone(200,.6,"sawtooth",.1,600);break;case"heal":this.tone(880,.15,"sine",.06,1320);break;case"void_bolt":this.tone(160,.25,"sawtooth",.1,60);break;case"boss_warn":this.tone(55,1.2,"sawtooth",.16),this.tone(58,1.2,"sawtooth",.12,void 0,.05);break;case"boss_spawn":this.noise(1,300,.25),this.tone(45,.9,"sine",.22,30);break;case"boss_enrage":this.tone(200,.8,"sawtooth",.16,60),this.noise(.6,800,.12);break;case"boss_shield":this.tone(1600,.4,"sine",.08,2400);break;case"boss_summon":this.tone(110,.5,"sawtooth",.12,55);break;case"boss_stun":this.noise(.2,3e3,.1,0,"highpass"),this.tone(1800,.15,"square",.06,400);break}}}const ul="lastBastion.save.v1",Gr=()=>({settings:{music:.5,sfx:.7,quality:"high"},difficulty:"normal",bestWave:0,discovered:[]});function $g(){try{const i=localStorage.getItem(ul);if(!i)return Gr();const e=JSON.parse(i),t=Gr();return{settings:{...t.settings,...e.settings??{}},difficulty:["easy","normal","hard"].includes(e.difficulty)?e.difficulty:t.difficulty,bestWave:typeof e.bestWave=="number"?e.bestWave:0,discovered:Array.isArray(e.discovered)?e.discovered.filter(n=>typeof n=="string"):[]}}catch{return Gr()}}function Xs(i){try{localStorage.setItem(ul,JSON.stringify(i))}catch{}}const fl=document.getElementById("game-canvas"),Kg=document.getElementById("ui-root"),vt=$g(),Qs=new jg;Qs.setVolumes(vt.settings.sfx,vt.settings.music);const Ke=new Eh,_n=new Xg(fl,Ke.g.arena);_n.setQuality(vt.settings.quality);const Xn=new qg(fl),xt=new Yg(Kg,{onStartGame:i=>bc(i),onResume:()=>Ke.togglePause(),onQuitToMenu:()=>Zg(),onStartEarly:()=>Ke.startEarly(),onBuildSelect:i=>Qg(i),onUpgradeTower:()=>{const i=Ke.g.towers.find(e=>e.id===Ke.g.selectedTowerId);i&&ih(Ke.g,i)},onSellTower:()=>{const i=Ke.g.towers.find(e=>e.id===Ke.g.selectedTowerId);i&&sh(Ke.g,i)},onChooseCard:i=>Ke.chooseCard(i),onDebug:(i,e)=>n0(i,e),onSettings:i=>Jg(i),onRestart:()=>bc(pl)});xt.setDifficulty(vt.difficulty);xt.setSettings(vt.settings);xt.showBestWave(vt.bestWave);xt.showMenu();let pl=vt.difficulty,Os=!1,Ri=-1;function bc(i){Qs.init(),pl=i,vt.difficulty=i,Xs(vt),Ke.startRun(i),_n.resetEntities(),xt.showHud(),Ri=-1}function Zg(){const i=Ke.g;i.phase="menu",i.buildMode=!1,i.buildSelection=null,i.selectedTowerId=-1,xt.showMenu(),xt.showBestWave(vt.bestWave)}function Jg(i){vt.settings=i,Xs(vt),Qs.setVolumes(i.sfx,i.music),_n.setQuality(i.quality)}function Qg(i){const e=Ke.g;i===null?(e.buildMode=!1,e.buildSelection=null,e.selectedTowerId=-1):(e.buildMode=!0,e.buildSelection=i,e.selectedTowerId=-1)}function e0(){const i=Ke.g;i.phase!=="prep"&&i.phase!=="combat"||(i.buildMode?(i.buildMode=!1,i.buildSelection=null,i.selectedTowerId=-1):(i.buildMode=!0,i.buildSelection=null))}function t0(){if(xt.closeModals())return;const i=Ke.g;(i.phase==="prep"||i.phase==="combat"||i.phase==="upgrade"||i.phase==="paused")&&(Ke.togglePause(),i.phase==="paused"?xt.showPause():xt.hidePause())}function n0(i,e){const t=Ke.g;switch(i){case"wave":Ke.debugStartWave();break;case"spawnpause":Ke.debugToggleSpawnPause();break;case"essence":Ke.debugAddEssence(500);break;case"dmg":Ke.debugDamageBastion(100);break;case"killall":Ke.debugKillAll();break;case"paths":t.debug.showPaths=!t.debug.showPaths;break;case"ranges":t.debug.showRanges=!t.debug.showRanges;break;case"speed05":t.gameSpeed=.5;break;case"speed1":t.gameSpeed=1;break;case"speed2":t.gameSpeed=2;break;case"speed4":t.gameSpeed=4;break;case"spawn":e&&Ke.debugSpawn(e,0);break}}Xn.onTab=e0;Xn.onEscape=t0;Xn.onF2=()=>{Os=!Os,xt.showDebug(Os)};Ke.onPhaseChange=i=>{const e=Ke.g;if(i==="upgrade"){const t=Sh(e);e.pendingCards=t.map(n=>({id:n.id,name:n.name,icon:n.icon,desc:n.desc,category:n.category})),xt.showUpgrade(t)}else if(i==="gameover"||i==="victory"){Ri<0&&(Ri=1.4),e.wave>vt.bestWave&&(vt.bestWave=e.wave,Xs(vt));for(const t of e.acquiredCards)vt.discovered.includes(t)||vt.discovered.push(t);Xs(vt)}else(i==="prep"||i==="combat")&&xt.showHud()};let Ec=performance.now(),wc=60,Hr=16,Vr=0,Wr=0,Xr=0;function ml(i){requestAnimationFrame(ml);let e=(i-Ec)/1e3;Ec=i,e>.1&&(e=.1);const t=performance.now(),n=Xn.snapshot(),s=_n.screenToGround(n.aimNdc.x,n.aimNdc.y),r=Ke.g;let o=-1,a=!0;if(r.buildMode&&r.buildSelection){let l=2;for(const h of r.arena.pads){const d=Math.hypot(h.pos.x-s.x,h.pos.z-s.z);d<l&&(l=d,o=h.id)}o>=0&&(a=Tc(r,o,r.buildSelection))}if(_n.setBuildState(o,a,r.buildSelection,r.selectedTowerId,r.debug.showRanges),Xn.clickPos)if(Xn.clickPos,Xn.clickPos=null,r.buildMode&&r.phase!=="paused")if(o>=0){const l=r.towers.find(h=>h.padId===o&&!h.dead);l?(r.selectedTowerId=l.id,r.buildSelection=null):r.buildSelection&&a&&(nh(r,o,r.buildSelection),r.selectedTowerId=-1)}else r.selectedTowerId=-1;else r.selectedTowerId=-1;Ke.update(e,{moveX:n.moveX,moveY:n.moveY,aim:s,firing:n.firing&&!r.buildMode,lance:n.lance&&!r.buildMode,dash:n.dash,q:n.q,e:n.e,r:n.r,f:n.f});for(const l of r.drainFx())if(l.type==="sound")Qs.play(l.sound);else if(l.type==="announce")xt.announce(l.msg??"",l.sub??"",l.color);else if(l.type==="burst"&&l.pos){const h=l.color??"#ffffff",d=parseInt(h.slice(1,3),16)/255,p=parseInt(h.slice(3,5),16)/255,m=parseInt(h.slice(5,7),16)/255;r.particles.burst(l.pos.x,l.pos.y,l.pos.z,[d,p,m],l.value??10,l.speed??4,2.5,.7,l.size??.15)}else _n.handleFx([l]);if(Ri>0&&(Ri-=e,Ri<=0)){const l=r.phase==="victory";xt.showEnd(l,{wave:r.wave,kills:r.stats.kills,essence:Math.floor(r.stats.essenceEarned),towers:r.stats.towersBuilt,time:r.stats.time})}xt.setCds(os("Q"),os("E"),os("R"),os("F")),xt.updateHud(r),Os&&xt.updateDebug({fps:wc,frameMs:Hr,enemies:r.enemies.length,projectiles:r.projectilePool.filter(l=>l.active).length,towers:r.towers.length,particles:r.particles.count,speed:r.gameSpeed,spawnPaused:r.spawnPaused,showPaths:r.debug.showPaths,showRanges:r.debug.showRanges,essence:r.essence,bastion:r.bastionHp,wave:r.wave}),_n.sync(r,e);const c=performance.now()-t;Hr=Hr*.9+c*.1,Vr+=1/Math.max(e,.001),Wr++,Xr+=e,Xr>.5&&(wc=Vr/Wr,Vr=0,Wr=0,Xr=0)}window.addEventListener("resize",()=>_n.resize());_n.resize();requestAnimationFrame(ml);
