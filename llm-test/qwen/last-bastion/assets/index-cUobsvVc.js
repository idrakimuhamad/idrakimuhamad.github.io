(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();class Nl{s;constructor(e=1337){this.s=e>>>0}next(){let e=this.s+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}range(e,t){return e+(t-e)*this.next()}int(e,t){return Math.floor(this.range(e,t+1))}pick(e){return e[Math.floor(this.next()*e.length)]}}function zl(i,e){const t=[],n=i.length;for(let s=0;s<n-1;s++){const r=i[Math.max(0,s-1)],o=i[s],a=i[s+1],c=i[Math.min(n-1,s+2)];for(let h=0;h<e;h++){const l=h/e,d=l*l,u=d*l,m=.5*(2*o.x+(-r.x+a.x)*l+(2*r.x-5*o.x+4*a.x-c.x)*d+(-r.x+3*o.x-3*a.x+c.x)*u),g=.5*(2*o.z+(-r.z+a.z)*l+(2*r.z-5*o.z+4*a.z-c.z)*d+(-r.z+3*o.z-3*a.z+c.z)*u);t.push({x:m,y:0,z:g})}}return t.push({...i[n-1]}),t}function Vi(i,e){const t=zl(e,14),n=[0];for(let s=1;s<t.length;s++){const r=t[s-1],o=t[s];n.push(n[s-1]+Math.hypot(o.x-r.x,o.z-r.z))}return{name:i,points:t,cum:n,length:n[n.length-1],portal:{...t[0]}}}function Ol(i=20240607){const e=new Nl(i),t={x:0,y:0,z:0},n=[Vi("north",[{x:4,y:0,z:-46},{x:-6,y:0,z:-38},{x:2,y:0,z:-28},{x:-3,y:0,z:-18},{x:1,y:0,z:-9},t]),Vi("east",[{x:44,y:0,z:14},{x:36,y:0,z:4},{x:28,y:0,z:12},{x:19,y:0,z:6},{x:10,y:0,z:3},t]),Vi("west",[{x:-42,y:0,z:18},{x:-34,y:0,z:10},{x:-26,y:0,z:16},{x:-17,y:0,z:8},{x:-9,y:0,z:4},t]),Vi("northeast",[{x:36,y:0,z:-32},{x:28,y:0,z:-26},{x:22,y:0,z:-20},{x:13,y:0,z:-12},t]),Vi("northwest",[{x:-36,y:0,z:-32},{x:-28,y:0,z:-26},{x:-22,y:0,z:-20},{x:-13,y:0,z:-12},t])],s=[];let r=0;const o=(d,u,m)=>{const g=n[d],x=g.length-u;let p=1;for(;p<g.cum.length-1&&g.cum[p]<x;)p++;const f=g.points[p-1],y=g.points[p],M=g.cum[p]-g.cum[p-1]||1,S=(x-g.cum[p-1])/M,C=f.x+(y.x-f.x)*S,R=f.z+(y.z-f.z)*S,A=y.x-f.x,N=y.z-f.z,X=Math.hypot(A,N)||1,_=-N/X,T=A/X;s.push({id:r++,pos:{x:C+_*m,y:0,z:R+T*m},lane:d,dist:u})};for(let d=0;d<n.length;d++)for(const u of[7,13,19,26,33])o(d,u,-5.2),o(d,u,5.2);for(let d=0;d<6;d++){const u=d/6*Math.PI*2+.35;s.push({id:r++,pos:{x:Math.cos(u)*6.5,y:0,z:Math.sin(u)*6.5},lane:-1,dist:6.5})}const a=[],c=n.flatMap(d=>d.points),h=(d,u,m)=>c.some(g=>Math.hypot(g.x-d,g.z-u)<m);let l=0;for(;a.length<46&&l++<400;){const d=e.range(0,Math.PI*2),u=e.range(9,48),m=Math.cos(d)*u,g=Math.sin(d)*u;if(Math.abs(m)<7&&Math.abs(g)<7||h(m,g,4.5)||s.some(f=>Math.hypot(f.pos.x-m,f.pos.z-g)<4))continue;const x=e.next(),p=x<.4?"rock":x<.6?"tree":x<.85?"ruin":"crystal";a.push({pos:{x:m,y:0,z:g},scale:e.range(.7,1.6),rot:e.range(0,Math.PI*2),kind:p})}return{lanes:n,pads:s,features:a,radius:50}}function ia(i,e,t){const n=Math.max(0,Math.min(i.length,e));let s=1;for(;s<i.cum.length-1&&i.cum[s]<n;)s++;const r=i.points[s-1],o=i.points[s],a=i.cum[s]-i.cum[s-1]||1,c=(n-i.cum[s-1])/a;t.x=r.x+(o.x-r.x)*c,t.z=r.z+(o.z-r.z)*c,t.y=0;const h=o.x-r.x,l=o.z-r.z,d=Math.hypot(h,l)||1;return t.hx=h/d,t.hz=l/d,t}function ka(i,e,t){const n=ia(i,e,t),s=n.hx??1,r=n.hz??0;return t.x=-r,t.z=s,t.y=0,t}const $t={burn:{dps:6,dur:3},chill:{amt:.45,dur:2.2},shock:{dur:2,vuln:.2},mark:{dur:4,vuln:.3},meltBurnMult:1.8,detonateRadius:3.2,detonateDmg:26},ln={crawler:{kind:"crawler",name:"Crawler",hp:42,speed:3.4,radius:.55,damage:6,attackRange:1.6,attackInterval:1,essence:4,color:9064408},wisp:{kind:"wisp",name:"Wisp",hp:20,speed:6.2,radius:.42,damage:3,attackRange:1.4,attackInterval:.8,essence:3,color:5564671,aggroPlayer:!0,contact:4,phase:!0},brute:{kind:"brute",name:"Brute",hp:220,speed:1.9,radius:.95,damage:18,attackRange:2.2,attackInterval:1.6,essence:12,color:14176094,charge:!0},bulwark:{kind:"bulwark",name:"Bulwark",hp:300,speed:1.6,radius:.85,damage:14,attackRange:2,attackInterval:1.4,essence:14,color:10135480,armor:4,raidTowers:!0,shieldFacing:!0},shaman:{kind:"shaman",name:"Shaman",hp:90,speed:2.6,radius:.6,damage:8,attackRange:1.8,attackInterval:1.2,essence:10,color:7208862,heal:14,healRadius:7,hex:!0},colossus:{kind:"colossus",name:"Colossus",hp:900,speed:1.5,radius:1.5,damage:30,attackRange:2.8,attackInterval:2,essence:60,color:11816920,raidTowers:!0,elite:!0,slam:!0},boss:{kind:"boss",name:"The Rift Behemoth",hp:5200,speed:1.15,radius:2.6,damage:45,attackRange:4,attackInterval:2.2,essence:400,color:7024600,raidTowers:!0}},ps={arcane:[{variant:"arcane_prism",name:"Prism Refraction",icon:"◈",cost:220,color:10484991,desc:"Bolts pierce every enemy in a line and gain +range. Shreds straight lines."},{variant:"arcane_void",name:"Void Lattice",icon:"✧",cost:240,color:11561983,desc:"Bolts Arcane-Mark targets (+30% damage taken) and apply Shock. Slower, devastating."}],frost:[{variant:"frost_aurora",name:"Aurora Field",icon:"❋",cost:230,color:734e4,desc:"Pulse becomes a wide chill field that slows and damages a large area, stacking chill."},{variant:"frost_rime",name:"Rime Crystal",icon:"❆",cost:250,color:14218495,desc:"Hardens enemies: heavy chill and periodically FREEZES them solid. Crystal shards on hit."}],ember:[{variant:"ember_inferno",name:"Inferno Bloom",icon:"✺",cost:240,color:16756802,desc:"Blasts leave a lingering Inferno that burns everything. Burn stacks and spreads."},{variant:"ember_meteor",name:"Meteor Call",icon:"☄",cost:260,color:16739138,desc:"Calls down meteors that Shock (stun) on impact. Massive splash, telegraphed."}],tesla:[{variant:"tesla_storm",name:"Storm Front",icon:"ϟ",cost:250,color:15400826,desc:"Lightning arcs to many more targets and applies Shock. Storms the whole cluster."},{variant:"tesla_capacitor",name:"Capacitor Bank",icon:"⚡",cost:270,color:16773199,desc:"Charges up; when full it unleashes a Capacitor Nova — a huge chain burst that Resets."}]},nn={arcane:{kind:"arcane",name:"Arcane Turret",icon:"✦",cost:60,range:11,interval:.42,damage:11,color:5232895,desc:"Fast single-target bolts. Cheap and reliable.",upgrades:[{name:"Overclocked Coils",desc:"+45% damage, +20% fire rate",cost:70},{name:"Prism Head",desc:"Bolts pierce one extra enemy, +2 range",cost:120}],evolutions:ps.arcane},frost:{kind:"frost",name:"Frost Obelisk",icon:"❄",cost:90,range:9,interval:1.5,damage:14,color:9431295,desc:"Slow pulse that damages and chills enemies in an area.",upgrades:[{name:"Deep Cold",desc:"Stronger chill (60% slow), +1 range",cost:100},{name:"Glacial Crown",desc:"Pulse deals 2x damage, +30% slow duration",cost:150}],evolutions:ps.frost},ember:{kind:"ember",name:"Ember Spire",icon:"☄",cost:110,range:13,interval:1.9,damage:26,color:16747586,desc:"Lobs explosive arcs that splash-damage groups.",upgrades:[{name:"Volatile Payload",desc:"+60% damage, +splash radius",cost:120},{name:"Molten Core",desc:"-25% cooldown, bigger blast",cost:170}],evolutions:ps.ember},tesla:{kind:"tesla",name:"Tesla Pylon",icon:"⚡",cost:160,range:10,interval:1.1,damage:22,color:14221135,desc:"Lightning arcs that chain between clustered enemies.",upgrades:[{name:"Conductive Lattice",desc:"Chains to 2 extra enemies",cost:150},{name:"Storm Engine",desc:"+50% damage, shorter cooldown",cost:200}],evolutions:ps.tesla}},Bl=["arcane","frost","ember","tesla"];function Ma(i,e){const t=nn[i];switch(i){case"arcane":return e===1?{range:t.range,interval:t.interval,damage:t.damage}:e===2?{range:t.range,interval:t.interval*.8,damage:t.damage*1.45}:{range:t.range+2,interval:t.interval*.8,damage:t.damage*1.45};case"frost":return e===1?{range:t.range,interval:t.interval,damage:t.damage}:e===2?{range:t.range+1,interval:t.interval,damage:t.damage}:{range:t.range+1,interval:t.interval*.85,damage:t.damage*2};case"ember":return e===1?{range:t.range,interval:t.interval,damage:t.damage}:e===2?{range:t.range,interval:t.interval,damage:t.damage*1.6}:{range:t.range+1,interval:t.interval*.75,damage:t.damage*1.6};case"tesla":return e===1?{range:t.range,interval:t.interval,damage:t.damage}:e===2?{range:t.range,interval:t.interval,damage:t.damage}:{range:t.range+1,interval:t.interval*.7,damage:t.damage*1.5}}}const sa=[{id:"atk_speed",name:"Haste Sigil",icon:"⚔",desc:"+20% attack speed",category:"guardian"},{id:"pierce",name:"Piercing Shot",icon:"➹",desc:"Primary bolts pierce one enemy",category:"guardian"},{id:"crit",name:"Rune of Cinders",icon:"✷",desc:"15% chance to deal double damage",category:"guardian"},{id:"crit_essence",name:"Essence Leech",icon:"❖",desc:"Critical hits grant +4 Essence",category:"economy"},{id:"dash_fire",name:"Blazing Dash",icon:"🔥",desc:"Dash leaves burning ground behind",category:"guardian"},{id:"lance_kb",name:"Shock Lance",icon:"≋",desc:"Lance gains knockback",category:"guardian"},{id:"vitality",name:"Aegis Plating",icon:"⛨",desc:"+40 max HP and full heal",category:"guardian"},{id:"swift",name:"Wind Steps",icon:"🌀",desc:"+12% movement speed",category:"guardian"},{id:"arcane_ricochet",name:"Ricochet Prisms",icon:"◇",desc:"Arcane Turret bolts bounce to one extra target",category:"tower"},{id:"frost_freeze",name:"Absolute Zero",icon:"❆",desc:"Frost Obelisks freeze heavily slowed enemies",category:"tower"},{id:"ember_fire",name:"Scorched Earth",icon:"♨",desc:"Ember Spires leave burning ground on impact",category:"tower"},{id:"tesla_chain",name:"Storm Conduit",icon:"ϟ",desc:"Tesla Pylons chain to one additional enemy",category:"tower"},{id:"essence_15",name:"Essence Attunement",icon:"◈",desc:"Enemies drop +15% Essence",category:"economy"},{id:"early_double",name:"Eager Guardian",icon:"⏵",desc:"Starting waves early gives double bonus",category:"economy"},{id:"refund",name:"Salvage Rites",icon:"♻",desc:"Selling towers refunds 80% instead of 60%",category:"economy"},{id:"blink",name:"Blink Step",icon:"⇢",desc:"Unlocks Blink: teleport a short distance (F)",category:"ability"},{id:"overcharge",name:"Overcharge",icon:"⚛",desc:"Unlocks Overcharge: nearby towers fire 80% faster for 6s (F)",category:"ability"},{id:"conduit",name:"Conduit Blade",icon:"⚔",desc:"Your melee channels 35% of your best tower's damage and its elemental status",category:"ability"},{id:"resonance",name:"Resonance",icon:"◉",desc:"Dashing through an enemy detonates all of its elemental statuses for bonus damage",category:"ability"},{id:"status_boost",name:"Elemental Mastery",icon:"✴",desc:"All elemental statuses (burn, chill, shock, mark) last 40% longer",category:"tower"},{id:"vuln",name:"Fracture",icon:"✖",desc:"Marked and Shocked enemies take 15% more damage than usual",category:"tower"}],He=(i,e,t,n=0,s=!1)=>({kind:i,count:e,interval:t,delay:n,elite:s}),_n=[{label:"First Stirrings",era:0,groups:[He("crawler",8,1.1)]},{label:"The Swarm Gathers",era:0,groups:[He("crawler",12,.9),He("wisp",3,1.4,4)]},{label:"Hunters in the Dark",era:0,groups:[He("wisp",8,.8),He("crawler",10,.9,2)]},{label:"Heavy Footfalls",era:1,groups:[He("brute",3,3),He("crawler",12,.8,2),He("wisp",4,1,6)]},{label:"The Colossus Stirs",era:1,groups:[He("colossus",1,1),He("crawler",10,.8,3),He("wisp",6,.9,5)]},{label:"Every Gate Opens",era:1,hazard:"rift_storm",warning:{msg:"RIFT STORM INBOUND",sub:"Void lightning will crack the field — keep your towers scattered",color:"#b44fd8"},groups:[He("crawler",14,.7),He("wisp",8,.8,3),He("brute",3,2.6,6)]},{label:"Iron Procession",era:2,groups:[He("bulwark",4,2.4),He("crawler",14,.7,2),He("wisp",6,.9,8)]},{label:"Whispers of the Void",era:2,hazard:"ember_tide",warning:{msg:"EMBER TIDE",sub:"Waves of fire will sweep across the arena — position to dodge the burns",color:"#ff8c42"},groups:[He("shaman",3,3),He("bulwark",3,2.6,4),He("wisp",10,.7,6),He("crawler",10,.8,10)]},{label:"The Great Assault",era:2,groups:[He("brute",5,2.2),He("bulwark",4,2.2,3),He("shaman",3,3,6),He("crawler",18,.6,2),He("wisp",10,.7,8)]},{label:"Elite Vanguard",era:3,hazard:"frost_nova",warning:{msg:"FROST NOVA",sub:"Icy shockwaves will freeze the field — burn and shock melt through it",color:"#8fe8ff"},groups:[He("colossus",2,6),He("bulwark",5,2,4),He("shaman",4,2.6,8),He("wisp",14,.6,10),He("crawler",16,.6,12)]},{label:"The Rift Behemoth",era:3,groups:[He("boss",1,1,2)]}],kl=[3,6,9],ra=[{name:"The Shattered Vale",fog:658970,fogDensity:.02,ambient:2766160,ambientI:.5,sun:8956671,sunI:.7,ground:1317418},{name:"The Ashen March",fog:1314322,fogDensity:.024,ambient:4863280,ambientI:.45,sun:16750950,sunI:.6,ground:1709080},{name:"The Burning Reach",fog:1707530,fogDensity:.028,ambient:5911840,ambientI:.5,sun:16759637,sunI:.85,ground:2102286},{name:"The Void Threshold",fog:1051166,fogDensity:.032,ambient:3811930,ambientI:.55,sun:12281599,sunI:.9,ground:1445412}],rr={rift_storm:{interval:6.5,radius:4.5,telegraph:1.6,dps:0,color:11816920},ember_tide:{interval:8,radius:5.5,telegraph:1.8,dps:14,color:16747586},frost_nova:{interval:7.5,radius:6,telegraph:1.6,dps:0,color:9431295}},Gl=[{name:"Last Bastion",icon:"⛨",color:5232895,desc:"The final wall.",hpBonus:0,aura:0},{name:"Warded Bastion",icon:"⛨",color:7208862,desc:"Warded: nearby towers fire 15% faster.",hpBonus:200,aura:.15},{name:"Aegis Bastion",icon:"⛨",color:16767055,desc:"Aegis: reflects 20% damage to attackers, +aura.",hpBonus:400,aura:.25},{name:"Radiant Bastion",icon:"⛨",color:16747775,desc:"Radiant: pulses light that burns nearby, +aura.",hpBonus:700,aura:.4}],tn={max:100,gainKill:1.4,gainBastion:6,gainPlayer:3,duration:5,cd:20,radius:14,damage:120,healBastion:120,color:"#ffd84f"},ar={easy:{hp:.8,speed:.92,count:.8,essence:1.25,prep:35,bossHp:.8,bossSpeed:.95,label:"Easy"},normal:{hp:1,speed:1,count:1,essence:1,prep:25,bossHp:1,bossSpeed:1,label:"Normal"},hard:{hp:1.35,speed:1.1,count:1.25,essence:.85,prep:20,bossHp:1.4,bossSpeed:1.12,label:"Hard"}},Hl=140,Ga=1e3,Ha=120,Vl=.6,Wl=2,xt=2400;class Xl{count=0;px=new Float32Array(xt);py=new Float32Array(xt);pz=new Float32Array(xt);vx=new Float32Array(xt);vy=new Float32Array(xt);vz=new Float32Array(xt);life=new Float32Array(xt);maxLife=new Float32Array(xt);size=new Float32Array(xt);cr=new Float32Array(xt);cg=new Float32Array(xt);cb=new Float32Array(xt);gravity=new Float32Array(xt);drag=new Float32Array(xt);spawn(e,t,n,s){const r=s.count??8;for(let o=0;o<r;o++){if(this.count>=xt)return;const a=this.count++,c=Math.random()*Math.PI*2,h=(s.speed??3)*(.4+Math.random()*.8),l=s.spread??1;this.px[a]=e,this.py[a]=t,this.pz[a]=n,this.vx[a]=Math.cos(c)*h*l,this.vy[a]=(s.up??2)*(.5+Math.random()*.8),this.vz[a]=Math.sin(c)*h*l;const d=(s.life??.6)*(.6+Math.random()*.7);this.life[a]=d,this.maxLife[a]=d,this.size[a]=(s.size??.14)*(.6+Math.random()*.8),this.cr[a]=s.color[0],this.cg[a]=s.color[1],this.cb[a]=s.color[2],this.gravity[a]=s.gravity??6,this.drag[a]=s.drag??.9}}burst(e,t,n,s,r=10,o=4,a=2.5,c=.7,h=.15){this.spawn(e,t,n,{count:r,speed:o,up:a,life:c,size:h,color:s})}update(e){let t=0;for(;t<this.count;){if(this.life[t]-=e,this.life[t]<=0){const s=--this.count;t!==s&&(this.px[t]=this.px[s],this.py[t]=this.py[s],this.pz[t]=this.pz[s],this.vx[t]=this.vx[s],this.vy[t]=this.vy[s],this.vz[t]=this.vz[s],this.life[t]=this.life[s],this.maxLife[t]=this.maxLife[s],this.size[t]=this.size[s],this.cr[t]=this.cr[s],this.cg[t]=this.cg[s],this.cb[t]=this.cb[s],this.gravity[t]=this.gravity[s],this.drag[t]=this.drag[s]);continue}const n=Math.max(0,1-this.drag[t]*e);this.vx[t]*=n,this.vz[t]*=n,this.vy[t]=this.vy[t]*n-this.gravity[t]*e,this.px[t]+=this.vx[t]*e,this.py[t]+=this.vy[t]*e,this.pz[t]+=this.vz[t]*e,this.py[t]<.02&&(this.py[t]=.02,this.vy[t]*=-.3),t++}}}const ql=i=>[(i>>16&255)/255,(i>>8&255)/255,(i&255)/255],Yl=260,jl=220,$l=64,Kl=40;class Va{arena=Ol();phase="menu";paused=!1;difficulty="normal";essence=Hl;bastionHp=Ga;bastionMaxHp=Ga;bastionFlash=0;bastionTier=0;bastionAuraT=0;bastionReflect=!1;wave=0;prepTime=0;prepTotal=25;spawnPaused=!1;spawnQueue=[];spawnTimer=0;enemiesAlive=0;era=0;eraBlend=1;enemies=[];towers=[];projectiles=[];patches=[];nextId=1;player=Zl();mods=Jl();stats={kills:0,essenceEarned:0,towersBuilt:0,damageDealt:0,time:0};gameSpeed=1;time=0;fx=[];bossRef=null;particles=new Xl;ultimate={charge:0,max:tn.max,active:!1,activeT:0,cd:0};cinematic={slowMo:1,slowMoT:0,shake:0,flash:0,flashColor:"#ffffff",zoom:1,zoomT:0};hazard=null;buildMode=!1;buildSelection=null;selectedTowerId=-1;acquiredCards=[];pendingCards=[];debug={showPaths:!1,showRanges:!1,spawnPaused:!1};enemyPool=[];projectilePool=[];constructor(){for(let e=0;e<Yl;e++)this.enemyPool.push(Ql());for(let e=0;e<jl;e++)this.projectilePool.push(eh())}pushFx(e){this.fx.push(e)}drainFx(){const e=this.fx;return this.fx=[],e}addEssence(e){this.essence+=e,this.stats.essenceEarned+=Math.max(0,e)}addUltimateCharge(e){const t=this.ultimate;t.active||(t.charge=Math.min(t.max,t.charge+e))}spawnEnemy(e,t,n=!1){const s=this.enemyPool.find(a=>!a.active);if(!s)return null;const o=this.arena.lanes[t].points[0];return s.active=!0,s.id=this.nextId++,s.kind=e,s.elite=n,s.pos={x:o.x,y:0,z:o.z},s.lane=t,s.dist=0,s.lateral=0,s.lateralTarget=(Math.random()-.5)*4,s.state="spawn",s.spawnT=.4,s.attackCd=0,s.target=null,s.targetId=-1,s.slow=0,s.slowT=0,s.freezeT=0,s.buffT=0,s.flash=0,s.dead=!1,s.healTick=0,s.hexCd=3+Math.random()*3,s.status=Oc(),s.summonCd=4,s.boltCd=3,s.shieldCd=8,s.shieldT=0,s.enraged=!1,s.phase=1,s.phaseT=0,s.phaseCd=2+Math.random()*2,s.untargetable=!1,s.chargeState="idle",s.chargeT=0,s.chargeDir={x:0,y:0,z:0},s.chargeCd=3+Math.random()*3,s.hexTargetId=-1,s.slamCd=4,s.slamTelegraph=0,this.enemies.push(s),this.enemiesAlive++,s}killEnemy(e){if(e.dead)return;e.dead=!0,e.active=!1,this.enemiesAlive--,this.stats.kills++;const t=this.enemies.indexOf(e);t>=0&&this.enemies.splice(t,1),this.enemyPool.push(e),this.bossRef===e&&(this.bossRef=null)}spawnTower(e,t){if(this.towers.length>=$l)return null;const n=this.arena.pads[t],s={id:this.nextId++,kind:e,level:1,variant:null,pos:{x:n.pos.x,y:0,z:n.pos.z},padId:t,range:0,interval:0,damage:0,cd:0,hp:140,maxHp:140,headAngle:0,invested:0,flash:0,dead:!1,stormCd:0,stormCdMax:0,anim:0,evolveAnim:0,charge:0};return this.towers.push(s),this.stats.towersBuilt++,s}removeTower(e){e.dead=!0;const t=this.towers.indexOf(e);t>=0&&this.towers.splice(t,1),this.selectedTowerId===e.id&&(this.selectedTowerId=-1)}allocProjectile(){return this.projectilePool.find(e=>!e.active)??null}addPatch(e,t,n,s){this.patches.length>=Kl&&this.patches.shift();const r={pos:{x:e.x,y:e.y,z:e.z},radius:t,life:n,maxLife:n,dps:s,tick:0};this.patches.push(r)}setHazard(e){if(!e){this.hazard=null;return}const t=rr[e];this.hazard={kind:e,active:!0,t:t.interval,interval:t.interval,pos:{x:0,y:0,z:0},pos2:{x:0,y:0,z:0},radius:t.radius,telegraph:t.telegraph,struck:!1}}}function Oc(){return{burnT:0,burnDps:0,chillT:0,chillAmt:0,shockT:0,markT:0,burnSrc:-1,chillSrc:-1,shockSrc:-1}}function Zl(){return{pos:{x:0,y:0,z:8},aim:{x:0,y:0,z:0},hp:Ha,maxHp:Ha,speed:8.5,fireCd:0,lanceCd:0,dashCd:0,dashT:0,dashDir:{x:0,y:0,z:0},invulnT:0,hurtT:0,facing:0,dead:!1,meleeCd:0,meleeAnim:0,meleeAngle:0,conduitTowerId:-1}}function Jl(){return{attackSpeed:1,pierce:0,critChance:0,critEssence:!1,dashFire:!1,lanceKnockback:!1,maxHpBonus:0,moveSpeed:1,arcaneRicochet:0,frostFreeze:!1,emberFire:!1,teslaChainBonus:0,essenceMult:1,earlyBonusMult:1,sellRefund:.6,blink:!1,overcharge:!1,overchargeT:0,overchargeCd:0,conduit:0,resonance:!1,statusBoost:1,vulnBonus:0}}function Ql(){return{id:0,kind:"crawler",pos:{x:0,y:0,z:0},hp:0,maxHp:0,speed:0,radius:.5,lane:0,dist:0,lateral:0,lateralTarget:0,state:"spawn",spawnT:0,attackCd:0,target:null,targetId:-1,slow:0,slowT:0,freezeT:0,buffT:0,flash:0,dead:!1,elite:!1,status:Oc(),healTick:0,hexCd:0,summonCd:0,boltCd:0,shieldCd:0,shieldT:0,enraged:!1,phase:1,phaseT:0,phaseCd:0,untargetable:!1,chargeState:"idle",chargeT:0,chargeDir:{x:0,y:0,z:0},chargeCd:0,hexTargetId:-1,slamCd:0,slamTelegraph:0,active:!1,facing:0}}function eh(){return{active:!1,kind:"bolt",pos:{x:0,y:0,z:0},vel:{x:0,y:0,z:0},life:0,dmg:0,radius:.3,from:-1,pierce:0,bounces:0,splash:0,color:16777215,hit:[],arcT:0,arcFrom:{x:0,y:0,z:0},arcTo:{x:0,y:0,z:0},arcDur:0,arcH:0,trailT:0,status:null,statusPower:0,mark:!1}}function rs(i,e,t,n,s=1){if(e.dead||e.state==="spawn")return;const r=i.mods.statusBoost,o=e.status;switch(t){case"burn":{const a=$t.burn.dps*s,c=o.chillT>0;o.burnDps=Math.max(o.burnDps,a*(c?$t.meltBurnMult:1)),o.burnT=Math.max(o.burnT,$t.burn.dur*r),o.burnSrc=n,c&&(i.pushFx({type:"text",msg:"MELT",pos:{x:e.pos.x,y:1.6,z:e.pos.z},color:"#ff8c42"}),i.pushFx({type:"burst",pos:{x:e.pos.x,y:.8,z:e.pos.z},color:"#ff8c42",value:8,size:.12,speed:3}));break}case"chill":{const a=Math.min(.8,$t.chill.amt*s);o.chillAmt=Math.max(o.chillAmt,a),o.chillT=Math.max(o.chillT,$t.chill.dur*r),o.chillSrc=n;break}case"shock":{o.shockT=Math.max(o.shockT,$t.shock.dur*r),o.shockSrc=n,o.burnT>0&&ya(i,e);break}case"mark":{o.markT=Math.max(o.markT,$t.mark.dur*r);break}}}function ya(i,e){const t=$t.detonateRadius,n=e.status.burnDps;e.status.burnT=0,e.status.burnDps=0,i.pushFx({type:"sound",sound:"explode"}),i.pushFx({type:"shake",amount:3}),i.pushFx({type:"burst",pos:{x:e.pos.x,y:.6,z:e.pos.z},color:"#ff8c42",value:30,size:.2,speed:6}),i.pushFx({type:"text",msg:"DETONATE",pos:{x:e.pos.x,y:1.8,z:e.pos.z},color:"#ffd84f"});for(const s of i.enemies){if(s===e||s.dead||s.state==="spawn")continue;const r=s.pos.x-e.pos.x,o=s.pos.z-e.pos.z;r*r+o*o<t*t&&(sn(i,s,$t.detonateDmg*(1+n*.15)),s.status.burnT>0&&ya(i,s))}}function th(i,e){const t=e.status;let n=0;return t.shockT>0&&(n+=$t.shock.vuln),t.markT>0&&(n+=$t.mark.vuln),(t.shockT>0||t.markT>0)&&(n+=i.mods.vulnBonus),1+n}function nh(i,e,t){if(e.dead||e.state==="spawn")return!1;const n=e.status;let s=!1;return n.burnT>0&&(n.burnT-=t,e.hp-=n.burnDps*t,Math.random()<t*8&&i.particles.burst(e.pos.x,.5+Math.random()*.6,e.pos.z,[1,.55,.25],1,1.5,1.2,.5,.12),e.hp<=0&&(s=!0)),n.chillT>0&&(n.chillT-=t,e.slow=Math.max(e.slow,n.chillAmt),e.slowT=Math.max(e.slowT,.2)),n.shockT>0&&(n.shockT-=t),n.markT>0&&(n.markT-=t),s&&sn(i,e,1,{}),s}function ih(i,e){if(e.dead)return;const t=e.status;let n=0;t.burnT>0&&(ya(i,e),n++),t.shockT>0&&(i.pushFx({type:"burst",pos:{x:e.pos.x,y:.8,z:e.pos.z},color:"#d8ff4f",value:16,size:.15,speed:5}),t.shockT=0,n++),t.markT>0&&(t.markT=0,n++),t.chillT>0&&(i.pushFx({type:"burst",pos:{x:e.pos.x,y:.8,z:e.pos.z},color:"#8fe8ff",value:10,size:.12,speed:3}),t.chillT=0,t.chillAmt=0,n++),n>0&&(sn(i,e,12*n),i.addUltimateCharge(4*n),i.pushFx({type:"text",msg:"RESONANCE",pos:{x:e.pos.x,y:2,z:e.pos.z},color:"#ffd84f"}))}const ms={x:0,y:0,z:0},Wa={x:0,y:0,z:0};function sh(i,e){const t=i.player;for(let n=i.enemies.length-1;n>=0;n--){const s=i.enemies[n],r=ln[s.kind];if(s.flash>0&&(s.flash-=e),s.slowT>0&&(s.slowT-=e,s.slowT<=0&&(s.slow=0)),s.freezeT>0&&(s.freezeT-=e),s.buffT>0&&(s.buffT-=e),s.shieldT>0&&(s.shieldT-=e),nh(i,s,e))continue;if(s.phaseT>0&&(s.phaseT-=e,s.phaseT<=0&&(s.untargetable=!1)),s.slamTelegraph>0&&(s.slamTelegraph-=e),s.kbX||s.kbZ){s.pos.x+=(s.kbX??0)*e,s.pos.z+=(s.kbZ??0)*e;const h=Math.max(0,1-6*e);s.kbX=(s.kbX??0)*h,s.kbZ=(s.kbZ??0)*h}if(s.state==="spawn"){s.spawnT-=e,s.spawnT<=0&&(s.state="walk");continue}if(s.freezeT>0)continue;const o=(1-s.slow)*(s.buffT>0?1.35:1)*(s.enraged?1.4:1),a=s.speed*o;if(s.kind!=="boss"&&rh(i,s,!!r.raidTowers,!!r.aggroPlayer),r.heal&&s.state==="walk"&&(s.healTick-=e,s.healTick<=0)){s.healTick=.5;for(const h of i.enemies){if(h===s||h.dead||h.hp>=h.maxHp)continue;const l=h.pos.x-s.pos.x,d=h.pos.z-s.pos.z;l*l+d*d<(r.healRadius??7)*(r.healRadius??7)&&(h.hp=Math.min(h.maxHp,h.hp+r.heal*.5))}i.pushFx({type:"sound",sound:"heal"})}r.hex&&fh(i,s,e),r.phase&&hh(i,s,e),r.charge&&dh(i,s,e),r.slam&&uh(i,s,e),s.kind==="boss"&&ph(i,s,e);const c=ah(i,s);if(c){const h=c.x-s.pos.x,l=c.z-s.pos.z;if(Math.hypot(h,l)<=r.attackRange)s.state="attack",s.attackCd-=e,s.attackCd<=0&&(s.attackCd=r.attackInterval*(s.enraged?.6:1),oh(i,s,c));else{s.state="walk",s.dist+=a*e;const u=i.arena.lanes[s.lane];u.length-s.dist>2?(s.lateral+=(s.lateralTarget-s.lateral)*Math.min(1,2.5*e),Math.abs(s.lateralTarget-s.lateral)<.2&&Math.random()<.4*e&&(s.lateralTarget=(Math.random()-.5)*4.5)):s.lateral*=Math.max(0,1-3*e);const g=ia(u,s.dist,ms),x=ka(u,s.dist,Wa);if(s.pos.x=g.x+x.x*s.lateral,s.pos.z=g.z+x.z*s.lateral,Math.abs(s.kbX??0)<.5){const p=ms.hx??0,f=ms.hz??0;s.facing=Math.atan2(p,f)}if(r.contact&&!t.dead){const p=t.pos.x-s.pos.x,f=t.pos.z-s.pos.z;p*p+f*f<(s.radius+.6)*(s.radius+.6)&&Oi(i,r.contact,s.pos)}}}else{s.dist+=a*e;const h=i.arena.lanes[s.lane],l=ia(h,s.dist,ms),d=ka(h,s.dist,Wa);s.pos.x=l.x+d.x*s.lateral,s.pos.z=l.z+d.z*s.lateral,s.dist>=h.length-r.attackRange&&(s.state="attack",s.attackCd-=e,s.attackCd<=0&&(s.attackCd=r.attackInterval*(s.enraged?.6:1),ch(i,s,r.damage),i.pushFx({type:"sound",sound:"bastion_hit"})))}}}function rh(i,e,t,n){if(e.target==="tower"){const s=i.towers.find(r=>r.id===e.targetId);if(s&&!s.dead){const r=s.pos.x-e.pos.x,o=s.pos.z-e.pos.z;if(r*r+o*o<12*12)return}e.target=null}if(e.target==="player"){if(i.player.dead){e.target=null;return}const s=i.player.pos.x-e.pos.x,r=i.player.pos.z-e.pos.z;if(s*s+r*r<14*14)return;e.target=null}if(n&&!i.player.dead){const s=i.player.pos.x-e.pos.x,r=i.player.pos.z-e.pos.z;if(s*s+r*r<6*6){e.target="player";return}}if(t){let s=null;for(const r of i.towers){if(r.dead)continue;const o=r.pos.x-e.pos.x,a=r.pos.z-e.pos.z,c=o*o+a*a;c<8*8&&(!s||c<s.d)&&(s={id:r.id,d:c})}if(s){e.target="tower",e.targetId=s.id;return}}e.target=null}function ah(i,e){if(e.target==="player"&&!i.player.dead)return i.player.pos;if(e.target==="tower"){const t=i.towers.find(n=>n.id===e.targetId);if(t&&!t.dead)return t.pos}return null}function oh(i,e,t){const n=ln[e.kind];if(e.target==="player")Oi(i,n.damage,t);else if(e.target==="tower"){const s=i.towers.find(r=>r.id===e.targetId);s&&!s.dead&&(s.hp-=n.damage,s.flash=.15,i.pushFx({type:"sound",sound:"tower_hit"}),s.hp<=0&&(i.pushFx({type:"announce",msg:"TOWER DESTROYED",sub:nn[s.kind].name,color:"#ff7d6b"}),i.pushFx({type:"sound",sound:"tower_destroy"}),i.removeTower(s),i.pushFx({type:"shake",amount:4})))}}function ch(i,e,t){i.bastionHp-=t,i.bastionFlash=.2,i.pushFx({type:"shake",amount:3}),i.addUltimateCharge(tn.gainBastion),i.bastionHp<=0&&(i.bastionHp=0,i.phase="gameover",i.pushFx({type:"sound",sound:"defeat"}),i.pushFx({type:"shake",amount:14}))}function Oi(i,e,t){const n=i.player;if(n.dead||n.invulnT>0)return;n.hp-=e,n.hurtT=.3,n.invulnT=.5,i.pushFx({type:"sound",sound:"player_hit"}),i.pushFx({type:"shake",amount:5});const s=n.pos.x-t.x,r=n.pos.z-t.z,o=Math.hypot(s,r)||1;n.pos.x+=s/o*.6,n.pos.z+=r/o*.6,n.hp<=0&&(n.hp=0,n.dead=!0,i.phase="gameover",i.pushFx({type:"sound",sound:"defeat"}),i.pushFx({type:"announce",msg:"THE GUARDIAN HAS FALLEN",sub:"The Bastion is lost"}))}function sn(i,e,t,n={}){if(e.dead||e.state==="spawn")return!1;if(e.kind==="boss"&&e.shieldT>0)return i.pushFx({type:"text",msg:"SHIELDED",pos:{x:e.pos.x,y:2.4,z:e.pos.z},color:"#8fe8ff"}),!1;const s=ln[e.kind];let r=t;if(r*=th(i,e),s.shieldFacing&&n.fromDir){const o=Math.sin(e.facing??0),a=Math.cos(e.facing??0);o*n.fromDir.x+a*n.fromDir.z>.5&&(r*=.4)}return s.armor&&(r=Math.max(1,r-s.armor)),e.hp-=r,e.flash=.12,i.stats.damageDealt+=r,n.kb&&n.kbStrength&&(e.kbX=(e.kbX??0)+n.kb.x*n.kbStrength,e.kbZ=(e.kbZ??0)+n.kb.z*n.kbStrength),e.hp<=0?(lh(i,e),!0):!1}function lh(i,e){const t=ln[e.kind],n=Math.round(t.essence*i.mods.essenceMult*(e.elite?2:1));i.addEssence(n),i.addUltimateCharge(tn.gainKill*(e.elite?2:1)),ql(t.color),i.pushFx({type:"sound",sound:e.kind==="boss"?"boss_die":"enemy_die"}),i.pushFx({type:"shake",amount:e.kind==="brute"||e.kind==="colossus"||e.kind==="boss"?4:1}),i.pushFx({type:"text",msg:"+"+n,pos:{x:e.pos.x,y:1.2,z:e.pos.z},color:"#7dffb0"}),i.pushFx({type:"burst",pos:{x:e.pos.x,y:.6,z:e.pos.z},color:"#"+t.color.toString(16).padStart(6,"0"),value:e.kind==="boss"?80:e.kind==="brute"||e.kind==="colossus"?30:14,size:e.radius*.5,speed:4+e.radius*3}),i.pushFx({type:"burst",pos:{x:e.pos.x,y:.4,z:e.pos.z},color:"#7dffb0",value:6,size:.1,speed:2}),e.kind==="boss"&&(i.pushFx({type:"cinematic",slowMo:.25,slowMoT:1.6,flash:.9,flashColor:"#ffffff",zoom:1.5,zoomT:1.6,shake:16}),i.pushFx({type:"announce",msg:"THE BEHEMOTH IS SLAIN",sub:"The rift collapses",color:"#ffd84f"})),i.killEnemy(e)}function hh(i,e,t){e.phaseCd-=t,e.phaseCd<=0&&!e.untargetable&&(e.untargetable=!0,e.phaseT=.9,e.phaseCd=3.5+Math.random()*2.5,i.particles.burst(e.pos.x,.6,e.pos.z,[.33,.91,1],6,1.5,1,.4,.1))}function dh(i,e,t,n){if(e.chargeState==="idle"){if(e.chargeCd-=t,e.chargeCd<=0&&e.dist>10&&e.dist<40){e.chargeState="windup",e.chargeT=.7;const s=i.player;let r=0,o=0;s.dead||(r=s.pos.x-e.pos.x,o=s.pos.z-e.pos.z);const a=Math.hypot(r,o);a>.1?e.chargeDir={x:r/a,y:0,z:o/a}:e.chargeDir={x:Math.sin(e.facing??0),y:0,z:Math.cos(e.facing??0)}}}else if(e.chargeState==="windup")e.chargeT-=t,e.chargeT<=0&&(e.chargeState="charge",e.chargeT=.55,i.pushFx({type:"sound",sound:"swing"}));else if(e.chargeState==="charge"){e.chargeT-=t;const s=16;e.pos.x+=e.chargeDir.x*s*t,e.pos.z+=e.chargeDir.z*s*t;const r=i.player;if(!r.dead){const o=r.pos.x-e.pos.x,a=r.pos.z-e.pos.z;o*o+a*a<(e.radius+.8)*(e.radius+.8)&&Oi(i,22,e.pos)}for(const o of i.towers){if(o.dead)continue;const a=o.pos.x-e.pos.x,c=o.pos.z-e.pos.z;a*a+c*c<(e.radius+.9)*(e.radius+.9)&&(o.hp-=30,o.flash=.15,o.hp<=0&&(i.pushFx({type:"sound",sound:"tower_destroy"}),i.removeTower(o)))}e.chargeT<=0&&(e.chargeState="idle",e.chargeCd=4+Math.random()*3)}}function uh(i,e,t){if(e.slamCd-=t,e.slamCd<=0&&e.state==="walk"&&(e.slamCd=5+Math.random()*2,e.slamTelegraph=.8),e.slamTelegraph>0&&e.slamTelegraph<.02){i.pushFx({type:"sound",sound:"slam"}),i.pushFx({type:"shake",amount:8}),i.pushFx({type:"burst",pos:{x:e.pos.x,y:.2,z:e.pos.z},color:"#b44fd8",value:40,size:.3,speed:8});const s=i.player;if(!s.dead){const r=s.pos.x-e.pos.x,o=s.pos.z-e.pos.z;r*r+o*o<4.5*4.5&&Oi(i,18,e.pos)}for(const r of i.towers){if(r.dead)continue;const o=r.pos.x-e.pos.x,a=r.pos.z-e.pos.z;o*o+a*a<4.5*4.5&&(r.hp-=25,r.flash=.15,r.hp<=0&&i.removeTower(r))}}}function fh(i,e,t){if(e.hexCd-=t,e.hexCd<=0){e.hexCd=5+Math.random()*3;let n=null,s=14*14;for(const r of i.towers){if(r.dead)continue;const o=r.pos.x-e.pos.x,a=r.pos.z-e.pos.z,c=o*o+a*a;c<s&&(s=c,n=r)}n&&(n.stormCd=4,n.stormCdMax=4,e.hexTargetId=n.id,i.pushFx({type:"sound",sound:"void_bolt"}),i.pushFx({type:"beam",pos:{x:e.pos.x,y:1.2,z:e.pos.z},pos2:{x:n.pos.x,y:1.6,z:n.pos.z},color:"#6dff9e"}),i.pushFx({type:"text",msg:"HEXED",pos:{x:n.pos.x,y:2.4,z:n.pos.z},color:"#6dff9e"}))}}function ph(i,e,t){const n=e.hp/e.maxHp,s=n>.66?1:n>.33?2:3;if(s!==e.phase){e.phase=s,e.enraged=s>=2;const r=[{msg:"THE BEHEMOTH STIRS",sub:"Phase 2 — it summons the void",color:"#b44fd8"},{msg:"THE BEHEMOTH RAGES",sub:"Phase 3 — desperate fury",color:"#ff7d6b"}][s-2]??{msg:"THE BEHEMOTH STIRS",sub:"It fights harder",color:"#b44fd8"};i.pushFx({type:"cinematic",slowMo:.3,slowMoT:1.2,flash:.7,flashColor:"#b44fd8",zoom:1.4,zoomT:1.2,shake:12}),i.pushFx({type:"announce",msg:r.msg,sub:r.sub,color:r.color}),i.pushFx({type:"sound",sound:"boss_enrage"}),s===2&&(e.shieldT=2.5)}if(e.summonCd-=t,e.summonCd<=0){e.summonCd=e.phase===3?6:e.phase===2?8:11;const r=e.phase===3?5:e.phase===2?4:3;for(let o=0;o<r;o++){const a=(e.lane+o)%3,c=i.spawnEnemy("crawler",a);c&&(c.hp=42*gh(i),c.maxHp=c.hp,c.speed=3.4,c.radius=.55,c.dist=Math.max(0,e.dist-6-o*2))}i.pushFx({type:"sound",sound:"boss_summon"}),i.pushFx({type:"shake",amount:3})}if(e.boltCd-=t,e.boltCd<=0){e.boltCd=e.phase===3?1.6:e.phase===2?2.4:3.4;const r=i.player,o=!r.dead&&Math.hypot(r.pos.x-e.pos.x,r.pos.z-e.pos.z)<26?r.pos:{x:0,z:0},a=e.phase===3?3:e.phase===2?2:1;for(let c=0;c<a;c++){const h=(c-(a-1)/2)*.25,l=o.x+Math.sin(h)*3,d=o.z+Math.cos(h)*3;_h(i,e,{x:l,z:d},e.phase===3?28:e.phase===2?22:18,o===r.pos?-1:-2)}}e.shieldCd-=t,e.shieldCd<=0&&(e.shieldCd=e.phase===3?16:e.phase===2?12:14,e.shieldT=e.phase===3?2:3,i.pushFx({type:"announce",msg:"VOID SHIELD",sub:"The Behemoth is invulnerable",color:"#8fe8ff"}),i.pushFx({type:"sound",sound:"boss_shield"})),mh(e,t,i)}const Xa=new Map;function mh(i,e,t){let n=Xa.get(i.id)??6;if(n-=e,n<=0){n=i.phase===3?7:i.phase===2?9:12;let s=0;for(const r of t.towers){if(r.dead||s>=2)continue;const o=r.pos.x-i.pos.x,a=r.pos.z-i.pos.z;o*o+a*a<9*9&&(r.stormCd=5,r.stormCdMax=5,s++)}s>0&&(t.pushFx({type:"announce",msg:"TOWERS SUPPRESSED",sub:s+" defense"+(s>1?"s":"")+" disabled",color:"#b44fd8"}),t.pushFx({type:"sound",sound:"boss_stun"}),t.pushFx({type:"shake",amount:4}))}Xa.set(i.id,n)}function gh(i){return i.difficulty==="easy"?.8:i.difficulty==="hard"?1.35:1}function _h(i,e,t,n,s){const r=i.allocProjectile();if(!r)return;r.active=!0,r.kind="void",r.pos={x:e.pos.x,y:1.6,z:e.pos.z};const o=t.x-r.pos.x,a=t.z-r.pos.z,c=Math.hypot(o,a)||1,h=14;r.vel={x:o/c*h,y:0,z:a/c*h},r.life=4,r.dmg=n,r.radius=.5,r.from=s,r.color=11816920,r.hit=[],i.pushFx({type:"sound",sound:"void_bolt"})}function xh(i,e){let t=null,n=-1;for(const s of i.enemies){if(s.dead||s.state==="spawn"||s.untargetable)continue;const r=s.pos.x-e.pos.x,o=s.pos.z-e.pos.z,a=r*r+o*o;if(a>e.range*e.range)continue;const c=s.dist-a*.01;c>n&&(n=c,t=s)}return t}function vh(i,e){const t=i.mods.overchargeT>0;for(const n of i.towers){if(n.flash>0&&(n.flash-=e),n.evolveAnim>0&&(n.evolveAnim-=e),n.stormCd>0){n.stormCd-=e;continue}n.anim>0&&(n.anim-=e);const s=i.bastionTier,r=s>0&&Math.hypot(n.pos.x,n.pos.z)<10?Mh[s]:0,o=(t&&Math.hypot(n.pos.x-i.player.pos.x,n.pos.z-i.player.pos.z)<14?1/1.8:1)*(1+r);if(n.cd-=e*o,n.variant==="tesla_capacitor"&&(n.charge=Math.min(1,n.charge+e/4.5)),n.cd>0)continue;const a=xh(i,n);if(!a){n.cd=0;continue}const c=a.pos.x-n.pos.x,h=a.pos.z-n.pos.z;let d=Math.atan2(c,h)-n.headAngle;for(;d>Math.PI;)d-=Math.PI*2;for(;d<-Math.PI;)d+=Math.PI*2;switch(n.headAngle+=d*Math.min(1,12*e),n.cd=n.interval,n.anim=.25,n.kind){case"arcane":yh(i,n,a);break;case"frost":Sh(i,n);break;case"ember":bh(i,n,a);break;case"tesla":Eh(i,n,a);break}}}const Mh=[0,.15,.25,.4];function yh(i,e,t){const n=i.allocProjectile();if(!n)return;n.active=!0,n.kind="bolt",n.pos={x:e.pos.x,y:1.5,z:e.pos.z};const s=t.pos.x-n.pos.x,r=t.pos.z-n.pos.z,o=Math.hypot(s,r)||1,a=26;n.vel={x:s/o*a,y:0,z:r/o*a},n.life=1.2,n.dmg=e.damage,n.radius=.28,n.from=e.id,n.color=5232895,n.pierce=e.variant==="arcane_prism"?99:e.level>=3?1:0,n.bounces=i.mods.arcaneRicochet>0?1:0,n.splash=0,n.hit=[],n.arcT=0,n.trailT=0,e.variant==="arcane_void"?(n.status="mark",n.statusPower=1,n.mark=!0,n.color=11561983):(n.status=null,n.mark=!1),i.pushFx({type:"sound",sound:"arcane"})}function Sh(i,e){let t=!1;const n=e.variant==="frost_aurora",s=e.variant==="frost_rime",r=n?e.range+2:e.range;for(const o of i.enemies){if(o.dead||o.state==="spawn"||o.untargetable)continue;const a=o.pos.x-e.pos.x,c=o.pos.z-e.pos.z;if(a*a+c*c>r*r)continue;t=!0;const l=s?.7:n?.55:e.level>=2?.6:.45,d=e.level>=3?2.6:1.8;o.slow=Math.max(o.slow,l),o.slowT=Math.max(o.slowT,d),i.mods.frostFreeze&&o.slow>=.6&&(o.freezeT=Math.max(o.freezeT,1.2)),s&&Math.random()<.35&&(o.freezeT=Math.max(o.freezeT,1)),rs(i,o,"chill",e.id,n?1.2:1);const u={x:(o.pos.x-e.pos.x)/(Math.hypot(a,c)||1),y:0,z:(o.pos.z-e.pos.z)/(Math.hypot(a,c)||1)};sn(i,o,e.damage,{fromDir:u})}t&&(i.pushFx({type:"sound",sound:"frost"}),n&&i.pushFx({type:"burst",pos:{x:e.pos.x,y:1,z:e.pos.z},color:"#6fffe0",value:12,size:.2,speed:2}))}function bh(i,e,t){const n=i.allocProjectile();if(!n)return;n.active=!0,n.kind="ember",n.pos={x:e.pos.x,y:1.8,z:e.pos.z},n.arcFrom={x:n.pos.x,y:1.8,z:n.pos.z},n.arcTo={x:t.pos.x+(t.kbX??0)*.1,y:0,z:t.pos.z+(t.kbZ??0)*.1};const s=Math.hypot(n.arcTo.x-n.arcFrom.x,n.arcTo.z-n.arcFrom.z);n.arcDur=Math.max(.5,s/18),n.arcT=0,n.arcH=3+s*.12,n.life=n.arcDur+.1,n.dmg=e.damage,n.radius=.4,n.from=e.id,n.color=e.variant==="ember_meteor"?16739138:16747586,n.pierce=0,n.bounces=0,n.splash=e.variant==="ember_meteor"?5.5:e.level>=2?3.4:2.6,n.hit=[],n.trailT=0,n.status="burn",n.statusPower=e.variant==="ember_inferno"?1.5:1,i.pushFx({type:"sound",sound:"ember"})}function Eh(i,e,t){const n=e.variant==="tesla_storm",s=e.variant==="tesla_capacitor";if(s&&e.charge<1)return;const r=n?8:3+(e.level>=2?1:0)+i.mods.teslaChainBonus,o=new Set;let a=t,c=e.damage*(s?2.2:1),h=e.pos.x,l=1.6,d=e.pos.z;for(i.pushFx({type:"sound",sound:s?"explode":"tesla"}),s&&(e.charge=0,i.pushFx({type:"shake",amount:5}),i.pushFx({type:"burst",pos:{x:e.pos.x,y:1.6,z:e.pos.z},color:"#fff04f",value:30,size:.25,speed:6}),i.pushFx({type:"text",msg:"CAPACITOR NOVA",pos:{x:e.pos.x,y:2.6,z:e.pos.z},color:"#fff04f"}));a&&o.size<r;){o.add(a.id);const u={x:(a.pos.x-h)/(Math.hypot(a.pos.x-h,a.pos.z-d)||1),y:0,z:(a.pos.z-d)/(Math.hypot(a.pos.x-h,a.pos.z-d)||1)};sn(i,a,c,{fromDir:u}),rs(i,a,"shock",e.id,n?1.2:.8),i.pushFx({type:"beam",pos:{x:h,y:l,z:d},pos2:{x:a.pos.x,y:1.2,z:a.pos.z},color:s?"#fff04f":"#d8ff4f"}),h=a.pos.x,l=1.2,d=a.pos.z,c*=.75;let m=null,g=6.5*6.5;for(const x of i.enemies){if(x.dead||x.state==="spawn"||x.untargetable||o.has(x.id))continue;const p=x.pos.x-a.pos.x,f=x.pos.z-a.pos.z,y=p*p+f*f;y<g&&(g=y,m=x)}a=m}}function Sa(i,e,t){const n=nn[t];return!(i.essence<n.cost||i.towers.some(s=>s.padId===e&&!s.dead))}function Bc(i,e,t){if(!Sa(i,e,t))return!1;const n=nn[t];i.addEssence(-n.cost);const s=i.spawnTower(t,e);if(!s)return!1;const r=Ma(t,1);return s.range=r.range,s.interval=r.interval,s.damage=r.damage,s.invested=n.cost,i.pushFx({type:"sound",sound:"place"}),i.pushFx({type:"shake",amount:1}),!0}function Th(i,e){if(e.level>=3)return!1;const t=nn[e.kind],n=t.upgrades[e.level-1];if(i.essence<n.cost)return!1;i.addEssence(-n.cost),e.level++,e.invested+=n.cost,e.hp=e.maxHp;const s=Ma(e.kind,e.level);return e.range=s.range,e.interval=s.interval,e.damage=s.damage,i.pushFx({type:"sound",sound:"upgrade"}),i.pushFx({type:"announce",msg:t.name.toUpperCase()+" LV"+e.level,sub:n.name,color:"#7dffb0"}),!0}function wh(i,e){const t=Math.round(e.invested*(i.mods.sellRefund>0?i.mods.sellRefund:Vl));return i.addEssence(t),i.removeTower(e),i.pushFx({type:"sound",sound:"sell"}),t}const qa=2.2,Ah=1.15,Rh=.45,Ch=.2,xn={Q:{name:"Ground Slam",cd:8,desc:"Radial knockback around you"},E:{name:"Arcane Volley",cd:10,desc:"Burst of 8 bolts"},R:{name:"Blink",cd:6,desc:"Teleport toward aim (unlocked)"},F:{name:"Overcharge",cd:25,desc:"Nearby towers fire faster for 6s (unlocked)"}},ct={Q:0,E:0,R:0,F:0};function Ph(){ct.Q=0,ct.E=0,ct.R=0,ct.F=0}function gs(i){return ct[i]}function Lh(i,e,t){const n=i.player;if(n.dead)return;n.invulnT>0&&(n.invulnT-=e),n.hurtT>0&&(n.hurtT-=e),n.fireCd>0&&(n.fireCd-=e),n.lanceCd>0&&(n.lanceCd-=e),n.dashCd>0&&(n.dashCd-=e),ct.Q=Math.max(0,ct.Q-e),ct.E=Math.max(0,ct.E-e),ct.R=Math.max(0,ct.R-e),ct.F=Math.max(0,ct.F-e);const s=t.aim.x-n.pos.x,r=t.aim.z-n.pos.z;s*s+r*r>.05&&(n.facing=Math.atan2(s,r));const o=n.speed*i.mods.moveSpeed;if(n.dashT>0){if(n.dashT-=e,n.pos.x+=n.dashDir.x*26*e,n.pos.z+=n.dashDir.z*26*e,i.mods.dashFire&&i.addPatch({x:n.pos.x,y:0,z:n.pos.z},1.1,.5,14),i.mods.resonance)for(const l of i.enemies){if(l.dead||l.state==="spawn")continue;const d=l.pos.x-n.pos.x,u=l.pos.z-n.pos.z;d*d+u*u<(l.radius+1.1)*(l.radius+1.1)&&ih(i,l)}}else{let l=t.moveX,d=t.moveY;const u=Math.hypot(l,d);u>1&&(l/=u,d/=u),n.pos.x+=l*o*e,n.pos.z+=-d*o*e}const a=i.arena.radius-2,c=Math.hypot(n.pos.x,n.pos.z);if(c>a&&(n.pos.x*=a/c,n.pos.z*=a/c),t.dash&&n.dashCd<=0&&n.dashT<=0){n.dashCd=2.5,n.dashT=.18,n.invulnT=Math.max(n.invulnT,.3);let l=t.moveX,d=-t.moveY;const u=Math.hypot(l,d);u<.1?(l=Math.sin(n.facing),d=Math.cos(n.facing)):(l/=u,d/=u),n.dashDir={x:l,y:0,z:d},i.pushFx({type:"sound",sound:"dash"})}if(n.meleeAnim>0&&(n.meleeAnim-=e,n.facing=n.meleeAngle),n.meleeCd>0&&(n.meleeCd-=e),n.meleeCd<=0&&n.meleeAnim<=0&&n.dashT<=0){let l=null,d=1/0;for(const u of i.enemies){if(u.dead||u.state==="spawn")continue;const m=u.pos.x-n.pos.x,g=u.pos.z-n.pos.z,x=Math.hypot(m,g)-u.radius;x<qa&&x<d&&(l=u,d=x)}if(l){const u=Math.atan2(l.pos.x-n.pos.x,l.pos.z-n.pos.z);n.facing=u,n.meleeAngle=u,n.meleeCd=Rh/i.mods.attackSpeed,n.meleeAnim=Ch;let m=!1;for(const g of i.enemies){if(g.dead||g.state==="spawn")continue;const x=g.pos.x-n.pos.x,p=g.pos.z-n.pos.z;if(Math.hypot(x,p)>qa+g.radius)continue;let y=Math.atan2(x,p)-u;for(;y>Math.PI;)y-=Math.PI*2;for(;y<-Math.PI;)y+=Math.PI*2;if(Math.abs(y)>Ah)continue;const M={x:Math.sin(u)*5,y:0,z:Math.cos(u)*5};let S=9*i.mods.attackSpeed;if(i.mods.conduit>0&&(S+=kc(i)*i.mods.conduit),sn(i,g,S,{kb:M,kbStrength:.5}),i.mods.conduit>0){const C=Uh(i);C&&Ih(i,g,C)}m=!0}i.pushFx({type:"sound",sound:"swing"}),m&&(i.pushFx({type:"sound",sound:"hit"}),i.pushFx({type:"burst",pos:{x:n.pos.x+Math.sin(u)*1.7,y:.9,z:n.pos.z+Math.cos(u)*1.7},color:"#ffe8c8",value:5,size:.08,speed:3}))}}if(t.firing&&n.fireCd<=0){n.fireCd=.34/i.mods.attackSpeed;const l=i.allocProjectile();if(l){l.active=!0,l.kind="bolt",l.pos={x:n.pos.x+Math.sin(n.facing)*.8,y:1.2,z:n.pos.z+Math.cos(n.facing)*.8};const d=t.aim.x-l.pos.x,u=t.aim.z-l.pos.z,m=Math.hypot(d,u)||1,g=30;l.vel={x:d/m*g,y:0,z:u/m*g},l.life=1;const x=Math.random()<i.mods.critChance;l.dmg=(x?28:14)*i.mods.attackSpeed,l.radius=.26,l.from=-1,l.color=x?16767055:10479871,l.pierce=i.mods.pierce,l.bounces=0,l.splash=0,l.hit=[],l.arcT=0,l.trailT=0,i.pushFx({type:"sound",sound:"shoot"}),x&&i.mods.critEssence&&i.addEssence(4)}}if(t.lance&&n.lanceCd<=0){n.lanceCd=1.3;const l=i.allocProjectile();if(l){l.active=!0,l.kind="lance",l.pos={x:n.pos.x+Math.sin(n.facing)*.8,y:1.3,z:n.pos.z+Math.cos(n.facing)*.8};const d=t.aim.x-l.pos.x,u=t.aim.z-l.pos.z,m=Math.hypot(d,u)||1;l.vel={x:d/m*22,y:0,z:u/m*22},l.life=1.4,l.dmg=34,l.radius=.45,l.from=-1,l.color=16758863,l.pierce=2,l.bounces=0,l.splash=0,l.hit=[],l.arcT=0,l.trailT=0,i.pushFx({type:"sound",sound:"lance"})}}t.q&&ct.Q<=0&&(ct.Q=xn.Q.cd,Nh(i)),t.e&&ct.E<=0&&(ct.E=xn.E.cd,zh(i)),t.r&&ct.R<=0&&i.mods.blink&&(ct.R=xn.R.cd,Oh(i,t.aim)),t.f&&ct.F<=0&&i.mods.overcharge&&(ct.F=xn.F.cd,i.mods.overchargeT=6,i.pushFx({type:"sound",sound:"overcharge"}),i.pushFx({type:"announce",msg:"OVERCHARGE",sub:"Nearby towers fire 80% faster",color:"#d8ff4f"}));const h=i.ultimate;h.cd>0&&(h.cd-=e),h.active&&(h.activeT-=e,h.activeT<=0&&(h.active=!1,h.charge=0,h.cd=tn.cd)),t.ultimate&&h.charge>=h.max&&!h.active&&h.cd<=0&&Dh(i)}function Dh(i){const e=i.player,t=i.ultimate;t.active=!0,t.activeT=tn.duration,i.pushFx({type:"sound",sound:"ultimate"}),i.pushFx({type:"ultimate",pos:{x:e.pos.x,y:0,z:e.pos.z},color:"#ffd84f"}),i.pushFx({type:"cinematic",slowMo:.35,slowMoT:.9,flash:.8,flashColor:"#fff0c0",zoom:1.35,zoomT:.9,shake:14}),i.pushFx({type:"announce",msg:"BASTION NOVA",sub:"The guardian unleashes its full power",color:"#ffd84f"});const n=tn.radius;for(const s of i.enemies){if(s.dead||s.state==="spawn")continue;const r=s.pos.x-e.pos.x,o=s.pos.z-e.pos.z,a=Math.hypot(r,o);if(a<n){const c={x:r/(a||1)*14,y:0,z:o/(a||1)*14};sn(i,s,tn.damage,{kb:c,kbStrength:2.2})}}i.bastionHp=Math.min(i.bastionMaxHp,i.bastionHp+tn.healBastion)}function Ih(i,e,t){rs(i,e,t,-1,1)}let qs={dmg:0,status:null,t:-1};function kc(i){const e=i.time;if(qs.t<e-.3){let t=0,n=null;for(const s of i.towers)s.dead||s.damage>t&&(t=s.damage,n=Fh(s.kind));qs={dmg:t,status:n,t:e}}return qs.dmg}function Uh(i){return kc(i),qs.status}function Fh(i){switch(i){case"ember":return"burn";case"frost":return"chill";case"tesla":return"shock";case"arcane":return"mark";default:return null}}function Nh(i){const e=i.player;i.pushFx({type:"sound",sound:"slam"}),i.pushFx({type:"shake",amount:7}),i.pushFx({type:"burst",pos:{x:e.pos.x,y:.3,z:e.pos.z},color:"#9fe8ff",value:40,size:.2,speed:9});for(const t of i.enemies){if(t.dead||t.state==="spawn")continue;const n=t.pos.x-e.pos.x,s=t.pos.z-e.pos.z,r=Math.hypot(n,s);if(r<5.2){const o={x:n/(r||1)*10,y:0,z:s/(r||1)*10};sn(i,t,22,{kb:o,kbStrength:1.6})}}}function zh(i){const e=i.player;i.pushFx({type:"sound",sound:"volley"});for(let t=0;t<8;t++){const n=i.allocProjectile();if(!n)return;const s=(t-3.5)*.16,r=e.facing+s;e.aim.x,e.aim.z;const o=Math.sin(r),a=Math.cos(r);n.active=!0,n.kind="bolt",n.pos={x:e.pos.x+o*.8,y:1.2,z:e.pos.z+a*.8},n.vel={x:o*28,y:0,z:a*28},n.life=.9,n.dmg=11,n.radius=.24,n.from=-1,n.color=5232895,n.pierce=0,n.bounces=0,n.splash=0,n.hit=[],n.arcT=0,n.trailT=0}}function Oh(i,e){const t=i.player,n=e.x-t.pos.x,s=e.z-t.pos.z,r=Math.hypot(n,s),o=Math.min(9,Math.max(3,r*.6));i.pushFx({type:"burst",pos:{x:t.pos.x,y:.8,z:t.pos.z},color:"#9fe8ff",value:14,size:.15,speed:4}),t.pos.x+=n/(r||1)*o,t.pos.z+=s/(r||1)*o,i.pushFx({type:"burst",pos:{x:t.pos.x,y:.8,z:t.pos.z},color:"#9fe8ff",value:14,size:.15,speed:4}),i.pushFx({type:"sound",sound:"blink"})}function Bh(i,e){for(const t of i.projectilePool){if(!t.active)continue;if(t.life-=e,t.life<=0){t.active=!1;continue}if(t.kind==="ember"){t.arcT+=e;const s=Math.min(1,t.arcT/t.arcDur);t.pos.x=t.arcFrom.x+(t.arcTo.x-t.arcFrom.x)*s,t.pos.z=t.arcFrom.z+(t.arcTo.z-t.arcFrom.z)*s,t.pos.y=t.arcFrom.y+t.arcH*4*s*(1-s),s>=1&&(t.active=!1,Gh(i,t));continue}if(t.pos.x+=t.vel.x*e,t.pos.y+=t.vel.y*e,t.pos.z+=t.vel.z*e,t.from>=0||t.from===-1||t.from===-2){if(t.from===-2){const r=i.player;if(!r.dead){const c=r.pos.x-t.pos.x,h=r.pos.z-t.pos.z;if(c*c+h*h<(t.radius+.6)*(t.radius+.6)){t.active=!1,Oi(i,t.dmg,t.pos),i.pushFx({type:"burst",pos:{x:t.pos.x,y:1,z:t.pos.z},color:"#b44fd8",value:12,size:.15,speed:4});continue}}const o=0-t.pos.x,a=0-t.pos.z;if(o*o+a*a<2.2*2.2){t.active=!1,i.bastionHp=Math.max(0,i.bastionHp-t.dmg),i.bastionFlash=.2,i.pushFx({type:"shake",amount:4}),i.pushFx({type:"burst",pos:{x:t.pos.x,y:1,z:t.pos.z},color:"#b44fd8",value:12,size:.15,speed:4}),i.bastionHp<=0&&(i.phase="gameover",i.pushFx({type:"sound",sound:"defeat"}));continue}continue}e:for(const r of i.enemies){if(r.dead||r.state==="spawn"||r.untargetable||t.hit.includes(r.id))continue;const o=r.pos.x-t.pos.x,a=r.pos.z-t.pos.z,c=t.radius+r.radius;if(o*o+a*a>=c*c)continue;t.hit.push(r.id);const h={x:t.vel.x,y:0,z:t.vel.z},l=t.kind==="lance"?i.mods.lanceKnockback?2.4:1:.4,d={x:t.vel.x,y:0,z:t.vel.z};if(sn(i,r,t.dmg,{kb:h,kbStrength:l,fromDir:d}),t.from===-1&&i.addUltimateCharge(tn.gainPlayer),t.status&&rs(i,r,t.status,t.from>=0?t.from:-1,t.statusPower),t.mark&&rs(i,r,"mark",t.from>=0?t.from:-1,1),i.pushFx({type:"sound",sound:t.kind==="lance"?"lance_hit":"hit"}),i.pushFx({type:"burst",pos:{x:t.pos.x,y:.8,z:t.pos.z},color:"#"+t.color.toString(16).padStart(6,"0"),value:6,size:.12,speed:3}),t.pierce>0){t.pierce--;continue}if(t.bounces>0){const u=kh(i,t,r);if(u){t.bounces--;const m=u.pos.x-t.pos.x,g=u.pos.z-t.pos.z,x=Math.hypot(m,g)||1;t.vel={x:m/x*26,y:0,z:g/x*26},t.life=.5;continue}}t.active=!1;break e}}const n=i.arena.radius+4;t.pos.x*t.pos.x+t.pos.z*t.pos.z>n*n&&(t.active=!1)}}function kh(i,e,t){let n=null,s=9*9;for(const r of i.enemies){if(r.dead||r.state==="spawn"||r===t||e.hit.includes(r.id))continue;const o=r.pos.x-e.pos.x,a=r.pos.z-e.pos.z,c=o*o+a*a;c<s&&(s=c,n=r)}return n}function Gh(i,e){i.pushFx({type:"sound",sound:"explode"}),i.pushFx({type:"shake",amount:2}),i.pushFx({type:"burst",pos:{x:e.pos.x,y:.4,z:e.pos.z},color:"#ff8c42",value:26,size:.2,speed:7}),i.pushFx({type:"burst",pos:{x:e.pos.x,y:.3,z:e.pos.z},color:"#ffd84f",value:10,size:.12,speed:3});for(const t of i.enemies){if(t.dead||t.state==="spawn")continue;const n=t.pos.x-e.pos.x,s=t.pos.z-e.pos.z,r=Math.hypot(n,s);if(r<e.splash+t.radius){const o=1-r/(e.splash+t.radius)*.5,a={x:n/(r||1),y:0,z:s/(r||1)};sn(i,t,e.dmg*o,{kb:a,kbStrength:3})}}i.mods.emberFire&&i.addPatch({x:e.pos.x,y:0,z:e.pos.z},e.splash*.8,2.2,12)}function Hh(i,e){for(let t=i.patches.length-1;t>=0;t--){const n=i.patches[t];if(n.life-=e,n.life<=0){i.patches.splice(t,1);continue}if(n.tick-=e,n.tick<=0){n.tick=.4;for(const s of i.enemies){if(s.dead||s.state==="spawn")continue;const r=s.pos.x-n.pos.x,o=s.pos.z-n.pos.z;r*r+o*o<(n.radius+s.radius)*(n.radius+s.radius)&&sn(i,s,n.dps*.4)}}}}function Vh(i,e="normal"){const t=_n[i-1];if(!t)return[];const n=ar[e],s=[];for(const r of t.groups){const o=s.find(c=>c.kind===r.kind),a=Math.max(1,Math.round(r.count*n.count));o?o.count+=a:s.push({kind:r.kind,count:a,name:ln[r.kind].name,color:ln[r.kind].color})}return s}function Wh(i,e){const t=_n[e-1],n=ar[i.difficulty];if(!t)return;const s=[],r=e>=6?5:3;let o=Math.floor(Math.random()*r);for(const a of t.groups){const c=Math.max(1,Math.round(a.count*n.count));for(let h=0;h<c;h++){const l=a.kind==="boss"?0:(o+h)%r;s.push({kind:a.kind,t:a.delay+h*a.interval,elite:!!a.elite,lane:l})}}s.sort((a,c)=>a.t-c.t),i.spawnQueue=s,i.spawnTimer=0}function aa(i,e){const t=_n[e-1];i.wave=e,i.phase="prep",i.prepTotal=ar[i.difficulty].prep,i.prepTime=i.prepTotal,i.buildMode=!1,i.buildSelection=null,i.selectedTowerId=-1;const n=t?.era??0;n!==i.era&&(i.era=n,i.eraBlend=0,i.pushFx({type:"announce",msg:ra[n].name.toUpperCase(),sub:"The battlefield shifts...",color:"#b48cff"})),i.setHazard(t?.hazard),e===11?(i.pushFx({type:"announce",msg:"THE RIFT BEHEMOTH",sub:"It stirs beyond the gate..."}),i.pushFx({type:"sound",sound:"boss_warn"})):t?.warning?(i.pushFx({type:"announce",msg:t.warning.msg,sub:t.warning.sub,color:t.warning.color}),i.pushFx({type:"sound",sound:"wave_warn"})):i.pushFx({type:"announce",msg:"WAVE "+e,sub:t?.label??""})}function Gc(i,e=!1){if(i.phase==="prep"){if(e){const t=Math.round(i.prepTime*Wl*i.mods.earlyBonusMult);t>0&&(i.addEssence(t),i.pushFx({type:"text",msg:"+"+t+" Essence (early start)",pos:{x:0,y:4,z:0},color:"#7dffb0"}))}i.phase="combat",Wh(i,i.wave),i.pushFx({type:"sound",sound:"wave_start"}),i.pushFx({type:"announce",msg:"WAVE "+i.wave,sub:"Defend the Bastion!"})}}function Xh(i,e){i.prepTime-=e,i.prepTime<=0&&Gc(i,!1)}function qh(i,e){if(!i.spawnPaused&&i.spawnQueue.length>0)for(i.spawnTimer+=e;i.spawnQueue.length>0&&i.spawnQueue[0].t<=i.spawnTimer;){const n=i.spawnQueue.shift(),s=i.spawnEnemy(n.kind,n.lane,n.elite);if(s){const r=ln[n.kind],o=ar[i.difficulty];let a=r.hp*o.hp;n.elite&&(a*=2.2),n.kind==="boss"&&(a=r.hp*o.bossHp),s.hp=a,s.maxHp=a,s.speed=r.speed*o.speed*(n.kind==="boss"&&o.bossSpeed?o.bossSpeed:1),s.radius=r.radius,n.kind==="boss"&&(i.bossRef=s),i.pushFx({type:"sound",sound:n.kind==="boss"?"boss_spawn":"spawn"})}}return i.spawnQueue.length===0&&i.enemies.length===0}function Yh(i){const e=30+i.wave*6;i.addEssence(e),i.pushFx({type:"text",msg:"Wave "+i.wave+" cleared  +"+e+" Essence",pos:{x:0,y:5,z:0},color:"#7dffb0"}),i.pushFx({type:"sound",sound:"wave_clear"});const t=i.wave+1;if(t>_n.length){i.phase="victory",i.pushFx({type:"sound",sound:"victory"});return}if(kl.includes(i.wave)){i.phase="upgrade";return}aa(i,t)}function jh(i){const e=new Set(i.acquiredCards),t=sa.filter(a=>!e.has(a.id)),n=sa,s=t.length>=3?t:n,r=[],o=[...s];for(let a=0;a<3&&o.length>0;a++){const c=Math.floor(Math.random()*o.length);r.push(o.splice(c,1)[0])}return r}function $h(i,e){const t=i.mods;switch(i.acquiredCards.push(e),e){case"atk_speed":t.attackSpeed*=1.2;break;case"pierce":t.pierce+=1;break;case"crit":t.critChance=Math.min(.6,t.critChance+.15);break;case"crit_essence":t.critEssence=!0;break;case"dash_fire":t.dashFire=!0;break;case"lance_kb":t.lanceKnockback=!0;break;case"vitality":t.maxHpBonus+=40,i.player.maxHp+=40,i.player.hp=i.player.maxHp;break;case"swift":t.moveSpeed*=1.12;break;case"arcane_ricochet":t.arcaneRicochet+=1;break;case"frost_freeze":t.frostFreeze=!0;break;case"ember_fire":t.emberFire=!0;break;case"tesla_chain":t.teslaChainBonus+=1;break;case"essence_15":t.essenceMult*=1.15;break;case"early_double":t.earlyBonusMult*=2;break;case"refund":t.sellRefund=.8;break;case"blink":t.blink=!0;break;case"overcharge":t.overcharge=!0;break;case"conduit":t.conduit=Math.max(t.conduit,.35);break;case"resonance":t.resonance=!0;break;case"status_boost":t.statusBoost*=1.4;break;case"vuln":t.vulnBonus+=.15;break}}function Kh(i,e){const t=i.hazard;if(!t||!t.active)return;const n=rr[t.kind];if(t.t-=e,!(t.t>n.telegraph)){if(!t.struck){const s=Math.random()*Math.PI*2,r=4+Math.random()*10;t.pos={x:Math.cos(s)*r,y:0,z:Math.sin(s)*r},t.radius=n.radius,t.struck=!0,i.pushFx({type:"hazard",hazard:t.kind,pos:{x:t.pos.x,y:0,z:t.pos.z},size:n.radius})}t.t<=0&&(Zh(i,t.pos,t.radius,t.kind),t.t=n.interval,t.struck=!1)}}function Zh(i,e,t,n){const s=rr[n];switch(i.pushFx({type:"shake",amount:5}),n){case"rift_storm":{i.pushFx({type:"sound",sound:"void_bolt"}),i.pushFx({type:"burst",pos:{x:e.x,y:1,z:e.z},color:"#b44fd8",value:40,size:.3,speed:9}),i.pushFx({type:"beam",pos:{x:e.x,y:12,z:e.z},pos2:{x:e.x,y:0,z:e.z},color:"#b44fd8"});let r=0;for(const o of i.towers){if(o.dead)continue;const a=o.pos.x-e.x,c=o.pos.z-e.z;a*a+c*c<t*t&&(o.stormCd=2.5,o.stormCdMax=2.5,r++)}r>0&&i.pushFx({type:"text",msg:"STORM",pos:{x:e.x,y:3,z:e.z},color:"#b44fd8"});break}case"ember_tide":{i.pushFx({type:"sound",sound:"explode"}),i.pushFx({type:"burst",pos:{x:e.x,y:.5,z:e.z},color:"#ff8c42",value:60,size:.35,speed:10});const r=i.player;if(!r.dead){const o=r.pos.x-e.x,a=r.pos.z-e.z;o*o+a*a<t*t&&Oi(i,16,e)}i.addPatch(e,t*.8,2.5,s.dps);break}case"frost_nova":{i.pushFx({type:"sound",sound:"frost"}),i.pushFx({type:"burst",pos:{x:e.x,y:.5,z:e.z},color:"#8fe8ff",value:50,size:.3,speed:8});for(const r of i.enemies){if(r.dead||r.state==="spawn")continue;const o=r.pos.x-e.x,a=r.pos.z-e.z;o*o+a*a<t*t&&(r.slow=Math.max(r.slow,.5),r.slowT=Math.max(r.slowT,2),r.freezeT=Math.max(r.freezeT,.8))}break}}}class Jh{g=new Va;onPhaseChange=null;constructor(){}startRun(e){this.g=new Va,this.g.difficulty=e,Ph(),aa(this.g,1),this.notifyPhase()}notifyPhase(){this.onPhaseChange&&this.onPhaseChange(this.g.phase)}togglePause(){this.g.phase==="paused"?this.g.phase=this.pausedInto:(this.g.phase==="prep"||this.g.phase==="combat"||this.g.phase==="upgrade")&&(this.pausedInto=this.g.phase,this.g.phase="paused"),this.notifyPhase()}pausedInto="prep";chooseCard(e){$h(this.g,e),this.g.pendingCards=[],this.g.phase="prep";const t=this.g.wave+1;aa(this.g,t),this.notifyPhase()}startEarly(){this.g.phase==="prep"&&(Gc(this.g,!0),this.notifyPhase())}update(e,t){const n=this.g;if(n.phase==="menu"||n.phase==="gameover"||n.phase==="victory"||n.phase==="upgrade"){n.time+=e,n.particles.update(e);return}if(n.phase==="paused")return;const s=n.cinematic;let r=1;s.slowMoT>0&&(s.slowMoT-=e,r=s.slowMo),s.flash>0&&(s.flash-=e*2.2),s.zoomT>0?s.zoomT-=e:s.zoom=1;const o=e*n.gameSpeed*r;n.time+=o,n.stats.time+=o,n.mods.overchargeT>0&&(n.mods.overchargeT-=o),n.bastionFlash>0&&(n.bastionFlash-=o),n.eraBlend<1&&(n.eraBlend=Math.min(1,n.eraBlend+e/3)),Lh(n,o,t),n.phase==="prep"?Xh(n,o):n.phase==="combat"&&qh(n,o)&&Yh(n),sh(n,o),vh(n,o),Bh(n,o),Hh(n,o),Kh(n,o),n.particles.update(o),n.phase!==this.lastPhase&&this.notifyPhase(),this.lastPhase=n.phase}lastPhase="menu";debugStartWave(){this.g.phase==="prep"?this.startEarly():this.g.phase}debugAddEssence(e=500){this.g.addEssence(e)}debugDamageBastion(e=100){this.g.bastionHp=Math.max(0,this.g.bastionHp-e),this.g.bastionHp<=0&&(this.g.phase="gameover",this.notifyPhase())}debugSpawn(e,t=0){const n=this.g.spawnEnemy(e,t);if(n){const s=ln[e];n.hp=s.hp,n.maxHp=s.hp,n.speed=s.speed,n.radius=s.radius,e==="boss"&&(n.hp=s.hp*1,n.maxHp=n.hp,this.g.bossRef=n)}}debugKillAll(){for(const e of[...this.g.enemies])this.g.killEnemy(e)}debugToggleSpawnPause(){this.g.spawnPaused=!this.g.spawnPaused}}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ba="161",Qh=0,Ya=1,ed=2,Hc=1,Vc=2,gn=3,Fn=0,Ft=1,bt=2,Dn=0,Ai=1,$s=2,ja=3,$a=4,td=5,Xn=100,nd=101,id=102,Ka=103,Za=104,sd=200,rd=201,ad=202,od=203,oa=204,ca=205,cd=206,ld=207,hd=208,dd=209,ud=210,fd=211,pd=212,md=213,gd=214,_d=0,xd=1,vd=2,Ks=3,Md=4,yd=5,Sd=6,bd=7,Wc=0,Ed=1,Td=2,In=0,wd=1,Ad=2,Rd=3,Xc=4,Cd=5,Pd=6,qc=300,Di=301,Ii=302,la=303,ha=304,or=306,da=1e3,Kt=1001,ua=1002,Lt=1003,Ja=1004,Wi=1005,Ut=1006,_r=1007,Yn=1008,Un=1009,Ld=1010,Dd=1011,Ea=1012,Yc=1013,Ln=1014,vn=1015,as=1016,jc=1017,$c=1018,$n=1020,Id=1021,Zt=1023,Ud=1024,Fd=1025,Kn=1026,Ui=1027,Nd=1028,Kc=1029,zd=1030,Zc=1031,Jc=1033,xr=33776,vr=33777,Mr=33778,yr=33779,Qa=35840,eo=35841,to=35842,no=35843,Qc=36196,io=37492,so=37496,ro=37808,ao=37809,oo=37810,co=37811,lo=37812,ho=37813,uo=37814,fo=37815,po=37816,mo=37817,go=37818,_o=37819,xo=37820,vo=37821,Sr=36492,Mo=36494,yo=36495,Od=36283,So=36284,bo=36285,Eo=36286,el=3e3,Zn=3001,Bd=3200,kd=3201,tl=0,Gd=1,Wt="",dt="srgb",Sn="srgb-linear",Ta="display-p3",cr="display-p3-linear",Zs="linear",nt="srgb",Js="rec709",Qs="p3",ii=7680,To=519,Hd=512,Vd=513,Wd=514,nl=515,Xd=516,qd=517,Yd=518,jd=519,fa=35044,Xi=35048,wo="300 es",pa=1035,Mn=2e3,er=2001;class Bi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const s=this._listeners[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}}const wt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ao=1234567;const ns=Math.PI/180,os=180/Math.PI;function yn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(wt[i&255]+wt[i>>8&255]+wt[i>>16&255]+wt[i>>24&255]+"-"+wt[e&255]+wt[e>>8&255]+"-"+wt[e>>16&15|64]+wt[e>>24&255]+"-"+wt[t&63|128]+wt[t>>8&255]+"-"+wt[t>>16&255]+wt[t>>24&255]+wt[n&255]+wt[n>>8&255]+wt[n>>16&255]+wt[n>>24&255]).toLowerCase()}function Dt(i,e,t){return Math.max(e,Math.min(t,i))}function wa(i,e){return(i%e+e)%e}function $d(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Kd(i,e,t){return i!==e?(t-i)/(e-i):0}function is(i,e,t){return(1-t)*i+t*e}function Zd(i,e,t,n){return is(i,e,1-Math.exp(-t*n))}function Jd(i,e=1){return e-Math.abs(wa(i,e*2)-e)}function Qd(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function eu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function tu(i,e){return i+Math.floor(Math.random()*(e-i+1))}function nu(i,e){return i+Math.random()*(e-i)}function iu(i){return i*(.5-Math.random())}function su(i){i!==void 0&&(Ao=i);let e=Ao+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function ru(i){return i*ns}function au(i){return i*os}function ma(i){return(i&i-1)===0&&i!==0}function ou(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function tr(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function cu(i,e,t,n,s){const r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),h=r((e+n)/2),l=o((e+n)/2),d=r((e-n)/2),u=o((e-n)/2),m=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*l,c*d,c*u,a*h);break;case"YZY":i.set(c*u,a*l,c*d,a*h);break;case"ZXZ":i.set(c*d,c*u,a*l,a*h);break;case"XZX":i.set(a*l,c*g,c*m,a*h);break;case"YXY":i.set(c*m,a*l,c*g,a*h);break;case"ZYZ":i.set(c*g,c*m,a*l,a*h);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Jt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function qe(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const _s={DEG2RAD:ns,RAD2DEG:os,generateUUID:yn,clamp:Dt,euclideanModulo:wa,mapLinear:$d,inverseLerp:Kd,lerp:is,damp:Zd,pingpong:Jd,smoothstep:Qd,smootherstep:eu,randInt:tu,randFloat:nu,randFloatSpread:iu,seededRandom:su,degToRad:ru,radToDeg:au,isPowerOfTwo:ma,ceilPowerOfTwo:ou,floorPowerOfTwo:tr,setQuaternionFromProperEuler:cu,normalize:qe,denormalize:Jt};class Se{constructor(e=0,t=0){Se.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Dt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Oe{constructor(e,t,n,s,r,o,a,c,h){Oe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,h)}set(e,t,n,s,r,o,a,c,h){const l=this.elements;return l[0]=e,l[1]=s,l[2]=a,l[3]=t,l[4]=r,l[5]=c,l[6]=n,l[7]=o,l[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],c=n[6],h=n[1],l=n[4],d=n[7],u=n[2],m=n[5],g=n[8],x=s[0],p=s[3],f=s[6],y=s[1],M=s[4],S=s[7],C=s[2],R=s[5],A=s[8];return r[0]=o*x+a*y+c*C,r[3]=o*p+a*M+c*R,r[6]=o*f+a*S+c*A,r[1]=h*x+l*y+d*C,r[4]=h*p+l*M+d*R,r[7]=h*f+l*S+d*A,r[2]=u*x+m*y+g*C,r[5]=u*p+m*M+g*R,r[8]=u*f+m*S+g*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],h=e[7],l=e[8];return t*o*l-t*a*h-n*r*l+n*a*c+s*r*h-s*o*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],h=e[7],l=e[8],d=l*o-a*h,u=a*c-l*r,m=h*r-o*c,g=t*d+n*u+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return e[0]=d*x,e[1]=(s*h-l*n)*x,e[2]=(a*n-s*o)*x,e[3]=u*x,e[4]=(l*t-s*c)*x,e[5]=(s*r-a*t)*x,e[6]=m*x,e[7]=(n*c-h*t)*x,e[8]=(o*t-n*r)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){const c=Math.cos(r),h=Math.sin(r);return this.set(n*c,n*h,-n*(c*o+h*a)+o+e,-s*h,s*c,-s*(-h*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(br.makeScale(e,t)),this}rotate(e){return this.premultiply(br.makeRotation(-e)),this}translate(e,t){return this.premultiply(br.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const br=new Oe;function il(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function nr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function lu(){const i=nr("canvas");return i.style.display="block",i}const Ro={};function Jn(i){i in Ro||(Ro[i]=!0,console.warn(i))}const Co=new Oe().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Po=new Oe().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),xs={[Sn]:{transfer:Zs,primaries:Js,toReference:i=>i,fromReference:i=>i},[dt]:{transfer:nt,primaries:Js,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[cr]:{transfer:Zs,primaries:Qs,toReference:i=>i.applyMatrix3(Po),fromReference:i=>i.applyMatrix3(Co)},[Ta]:{transfer:nt,primaries:Qs,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Po),fromReference:i=>i.applyMatrix3(Co).convertLinearToSRGB()}},hu=new Set([Sn,cr]),je={enabled:!0,_workingColorSpace:Sn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!hu.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,e,t){if(this.enabled===!1||e===t||!e||!t)return i;const n=xs[e].toReference,s=xs[t].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,e){return this.convert(i,this._workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this._workingColorSpace)},getPrimaries:function(i){return xs[i].primaries},getTransfer:function(i){return i===Wt?Zs:xs[i].transfer}};function Ri(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Er(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let si;class sl{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{si===void 0&&(si=nr("canvas")),si.width=e.width,si.height=e.height;const n=si.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=si}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=nr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ri(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Ri(t[n]/255)*255):t[n]=Ri(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let du=0;class rl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:du++}),this.uuid=yn(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Tr(s[o].image)):r.push(Tr(s[o]))}else r=Tr(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Tr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?sl.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let uu=0;class It extends Bi{constructor(e=It.DEFAULT_IMAGE,t=It.DEFAULT_MAPPING,n=Kt,s=Kt,r=Ut,o=Yn,a=Zt,c=Un,h=It.DEFAULT_ANISOTROPY,l=Wt){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:uu++}),this.uuid=yn(),this.name="",this.source=new rl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=h,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Se(0,0),this.repeat=new Se(1,1),this.center=new Se(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Oe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof l=="string"?this.colorSpace=l:(Jn("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=l===Zn?dt:Wt),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==qc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case da:e.x=e.x-Math.floor(e.x);break;case Kt:e.x=e.x<0?0:1;break;case ua:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case da:e.y=e.y-Math.floor(e.y);break;case Kt:e.y=e.y<0?0:1;break;case ua:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Jn("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===dt?Zn:el}set encoding(e){Jn("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===Zn?dt:Wt}}It.DEFAULT_IMAGE=null;It.DEFAULT_MAPPING=qc;It.DEFAULT_ANISOTROPY=1;class it{constructor(e=0,t=0,n=0,s=1){it.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const c=e.elements,h=c[0],l=c[4],d=c[8],u=c[1],m=c[5],g=c[9],x=c[2],p=c[6],f=c[10];if(Math.abs(l-u)<.01&&Math.abs(d-x)<.01&&Math.abs(g-p)<.01){if(Math.abs(l+u)<.1&&Math.abs(d+x)<.1&&Math.abs(g+p)<.1&&Math.abs(h+m+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const M=(h+1)/2,S=(m+1)/2,C=(f+1)/2,R=(l+u)/4,A=(d+x)/4,N=(g+p)/4;return M>S&&M>C?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=R/n,r=A/n):S>C?S<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),n=R/s,r=N/s):C<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),n=A/r,s=N/r),this.set(n,s,r,t),this}let y=Math.sqrt((p-g)*(p-g)+(d-x)*(d-x)+(u-l)*(u-l));return Math.abs(y)<.001&&(y=1),this.x=(p-g)/y,this.y=(d-x)/y,this.z=(u-l)/y,this.w=Math.acos((h+m+f-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class fu extends Bi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new it(0,0,e,t),this.scissorTest=!1,this.viewport=new it(0,0,e,t);const s={width:e,height:t,depth:1};n.encoding!==void 0&&(Jn("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Zn?dt:Wt),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ut,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new It(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new rl(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ei extends fu{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class al extends It{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Lt,this.minFilter=Lt,this.wrapR=Kt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class pu extends It{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Lt,this.minFilter=Lt,this.wrapR=Kt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class hs{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let c=n[s+0],h=n[s+1],l=n[s+2],d=n[s+3];const u=r[o+0],m=r[o+1],g=r[o+2],x=r[o+3];if(a===0){e[t+0]=c,e[t+1]=h,e[t+2]=l,e[t+3]=d;return}if(a===1){e[t+0]=u,e[t+1]=m,e[t+2]=g,e[t+3]=x;return}if(d!==x||c!==u||h!==m||l!==g){let p=1-a;const f=c*u+h*m+l*g+d*x,y=f>=0?1:-1,M=1-f*f;if(M>Number.EPSILON){const C=Math.sqrt(M),R=Math.atan2(C,f*y);p=Math.sin(p*R)/C,a=Math.sin(a*R)/C}const S=a*y;if(c=c*p+u*S,h=h*p+m*S,l=l*p+g*S,d=d*p+x*S,p===1-a){const C=1/Math.sqrt(c*c+h*h+l*l+d*d);c*=C,h*=C,l*=C,d*=C}}e[t]=c,e[t+1]=h,e[t+2]=l,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,o){const a=n[s],c=n[s+1],h=n[s+2],l=n[s+3],d=r[o],u=r[o+1],m=r[o+2],g=r[o+3];return e[t]=a*g+l*d+c*m-h*u,e[t+1]=c*g+l*u+h*d-a*m,e[t+2]=h*g+l*m+a*u-c*d,e[t+3]=l*g-a*d-c*u-h*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,h=a(n/2),l=a(s/2),d=a(r/2),u=c(n/2),m=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=u*l*d+h*m*g,this._y=h*m*d-u*l*g,this._z=h*l*g+u*m*d,this._w=h*l*d-u*m*g;break;case"YXZ":this._x=u*l*d+h*m*g,this._y=h*m*d-u*l*g,this._z=h*l*g-u*m*d,this._w=h*l*d+u*m*g;break;case"ZXY":this._x=u*l*d-h*m*g,this._y=h*m*d+u*l*g,this._z=h*l*g+u*m*d,this._w=h*l*d-u*m*g;break;case"ZYX":this._x=u*l*d-h*m*g,this._y=h*m*d+u*l*g,this._z=h*l*g-u*m*d,this._w=h*l*d+u*m*g;break;case"YZX":this._x=u*l*d+h*m*g,this._y=h*m*d+u*l*g,this._z=h*l*g-u*m*d,this._w=h*l*d-u*m*g;break;case"XZY":this._x=u*l*d-h*m*g,this._y=h*m*d-u*l*g,this._z=h*l*g+u*m*d,this._w=h*l*d+u*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],h=t[2],l=t[6],d=t[10],u=n+a+d;if(u>0){const m=.5/Math.sqrt(u+1);this._w=.25/m,this._x=(l-c)*m,this._y=(r-h)*m,this._z=(o-s)*m}else if(n>a&&n>d){const m=2*Math.sqrt(1+n-a-d);this._w=(l-c)/m,this._x=.25*m,this._y=(s+o)/m,this._z=(r+h)/m}else if(a>d){const m=2*Math.sqrt(1+a-n-d);this._w=(r-h)/m,this._x=(s+o)/m,this._y=.25*m,this._z=(c+l)/m}else{const m=2*Math.sqrt(1+d-n-a);this._w=(o-s)/m,this._x=(r+h)/m,this._y=(c+l)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Dt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,h=t._z,l=t._w;return this._x=n*l+o*a+s*h-r*c,this._y=s*l+o*c+r*a-n*h,this._z=r*l+o*h+n*c-s*a,this._w=o*l-n*a-s*c-r*h,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const m=1-t;return this._w=m*o+t*this._w,this._x=m*n+t*this._x,this._y=m*s+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}const h=Math.sqrt(c),l=Math.atan2(h,a),d=Math.sin((1-t)*l)/h,u=Math.sin(t*l)/h;return this._w=o*d+this._w*u,this._x=n*d+this._x*u,this._y=s*d+this._y*u,this._z=r*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(t*Math.cos(s),n*Math.sin(r),n*Math.cos(r),t*Math.sin(s))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,n=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Lo.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Lo.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,h=2*(o*s-a*n),l=2*(a*t-r*s),d=2*(r*n-o*t);return this.x=t+c*h+o*d-a*l,this.y=n+c*l+a*h-r*d,this.z=s+c*d+r*l-o*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return wr.copy(this).projectOnVector(e),this.sub(wr)}reflect(e){return this.sub(wr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Dt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const wr=new P,Lo=new hs;class ti{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(qt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(qt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=qt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,qt):qt.fromBufferAttribute(r,o),qt.applyMatrix4(e.matrixWorld),this.expandByPoint(qt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),vs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),vs.copy(n.boundingBox)),vs.applyMatrix4(e.matrixWorld),this.union(vs)}const s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,qt),qt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(qi),Ms.subVectors(this.max,qi),ri.subVectors(e.a,qi),ai.subVectors(e.b,qi),oi.subVectors(e.c,qi),bn.subVectors(ai,ri),En.subVectors(oi,ai),kn.subVectors(ri,oi);let t=[0,-bn.z,bn.y,0,-En.z,En.y,0,-kn.z,kn.y,bn.z,0,-bn.x,En.z,0,-En.x,kn.z,0,-kn.x,-bn.y,bn.x,0,-En.y,En.x,0,-kn.y,kn.x,0];return!Ar(t,ri,ai,oi,Ms)||(t=[1,0,0,0,1,0,0,0,1],!Ar(t,ri,ai,oi,Ms))?!1:(ys.crossVectors(bn,En),t=[ys.x,ys.y,ys.z],Ar(t,ri,ai,oi,Ms))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,qt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(qt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(dn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),dn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),dn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),dn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),dn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),dn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),dn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),dn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(dn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const dn=[new P,new P,new P,new P,new P,new P,new P,new P],qt=new P,vs=new ti,ri=new P,ai=new P,oi=new P,bn=new P,En=new P,kn=new P,qi=new P,Ms=new P,ys=new P,Gn=new P;function Ar(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Gn.fromArray(i,r);const a=s.x*Math.abs(Gn.x)+s.y*Math.abs(Gn.y)+s.z*Math.abs(Gn.z),c=e.dot(Gn),h=t.dot(Gn),l=n.dot(Gn);if(Math.max(-Math.max(c,h,l),Math.min(c,h,l))>a)return!1}return!0}const mu=new ti,Yi=new P,Rr=new P;class ni{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):mu.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Yi.subVectors(e,this.center);const t=Yi.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Yi,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Rr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Yi.copy(e.center).add(Rr)),this.expandByPoint(Yi.copy(e.center).sub(Rr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const un=new P,Cr=new P,Ss=new P,Tn=new P,Pr=new P,bs=new P,Lr=new P;class lr{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,un)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=un.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(un.copy(this.origin).addScaledVector(this.direction,t),un.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Cr.copy(e).add(t).multiplyScalar(.5),Ss.copy(t).sub(e).normalize(),Tn.copy(this.origin).sub(Cr);const r=e.distanceTo(t)*.5,o=-this.direction.dot(Ss),a=Tn.dot(this.direction),c=-Tn.dot(Ss),h=Tn.lengthSq(),l=Math.abs(1-o*o);let d,u,m,g;if(l>0)if(d=o*c-a,u=o*a-c,g=r*l,d>=0)if(u>=-g)if(u<=g){const x=1/l;d*=x,u*=x,m=d*(d+o*u+2*a)+u*(o*d+u+2*c)+h}else u=r,d=Math.max(0,-(o*u+a)),m=-d*d+u*(u+2*c)+h;else u=-r,d=Math.max(0,-(o*u+a)),m=-d*d+u*(u+2*c)+h;else u<=-g?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-c),r),m=-d*d+u*(u+2*c)+h):u<=g?(d=0,u=Math.min(Math.max(-r,-c),r),m=u*(u+2*c)+h):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-c),r),m=-d*d+u*(u+2*c)+h);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),m=-d*d+u*(u+2*c)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Cr).addScaledVector(Ss,u),m}intersectSphere(e,t){un.subVectors(e.center,this.origin);const n=un.dot(this.direction),s=un.dot(un)-n*n,r=e.radius*e.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,c;const h=1/this.direction.x,l=1/this.direction.y,d=1/this.direction.z,u=this.origin;return h>=0?(n=(e.min.x-u.x)*h,s=(e.max.x-u.x)*h):(n=(e.max.x-u.x)*h,s=(e.min.x-u.x)*h),l>=0?(r=(e.min.y-u.y)*l,o=(e.max.y-u.y)*l):(r=(e.max.y-u.y)*l,o=(e.min.y-u.y)*l),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(e.min.z-u.z)*d,c=(e.max.z-u.z)*d):(a=(e.max.z-u.z)*d,c=(e.min.z-u.z)*d),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,un)!==null}intersectTriangle(e,t,n,s,r){Pr.subVectors(t,e),bs.subVectors(n,e),Lr.crossVectors(Pr,bs);let o=this.direction.dot(Lr),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Tn.subVectors(this.origin,e);const c=a*this.direction.dot(bs.crossVectors(Tn,bs));if(c<0)return null;const h=a*this.direction.dot(Pr.cross(Tn));if(h<0||c+h>o)return null;const l=-a*Tn.dot(Lr);return l<0?null:this.at(l/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Qe{constructor(e,t,n,s,r,o,a,c,h,l,d,u,m,g,x,p){Qe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,h,l,d,u,m,g,x,p)}set(e,t,n,s,r,o,a,c,h,l,d,u,m,g,x,p){const f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=s,f[1]=r,f[5]=o,f[9]=a,f[13]=c,f[2]=h,f[6]=l,f[10]=d,f[14]=u,f[3]=m,f[7]=g,f[11]=x,f[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Qe().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/ci.setFromMatrixColumn(e,0).length(),r=1/ci.setFromMatrixColumn(e,1).length(),o=1/ci.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),h=Math.sin(s),l=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const u=o*l,m=o*d,g=a*l,x=a*d;t[0]=c*l,t[4]=-c*d,t[8]=h,t[1]=m+g*h,t[5]=u-x*h,t[9]=-a*c,t[2]=x-u*h,t[6]=g+m*h,t[10]=o*c}else if(e.order==="YXZ"){const u=c*l,m=c*d,g=h*l,x=h*d;t[0]=u+x*a,t[4]=g*a-m,t[8]=o*h,t[1]=o*d,t[5]=o*l,t[9]=-a,t[2]=m*a-g,t[6]=x+u*a,t[10]=o*c}else if(e.order==="ZXY"){const u=c*l,m=c*d,g=h*l,x=h*d;t[0]=u-x*a,t[4]=-o*d,t[8]=g+m*a,t[1]=m+g*a,t[5]=o*l,t[9]=x-u*a,t[2]=-o*h,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){const u=o*l,m=o*d,g=a*l,x=a*d;t[0]=c*l,t[4]=g*h-m,t[8]=u*h+x,t[1]=c*d,t[5]=x*h+u,t[9]=m*h-g,t[2]=-h,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){const u=o*c,m=o*h,g=a*c,x=a*h;t[0]=c*l,t[4]=x-u*d,t[8]=g*d+m,t[1]=d,t[5]=o*l,t[9]=-a*l,t[2]=-h*l,t[6]=m*d+g,t[10]=u-x*d}else if(e.order==="XZY"){const u=o*c,m=o*h,g=a*c,x=a*h;t[0]=c*l,t[4]=-d,t[8]=h*l,t[1]=u*d+x,t[5]=o*l,t[9]=m*d-g,t[2]=g*d-m,t[6]=a*l,t[10]=x*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(gu,e,_u)}lookAt(e,t,n){const s=this.elements;return zt.subVectors(e,t),zt.lengthSq()===0&&(zt.z=1),zt.normalize(),wn.crossVectors(n,zt),wn.lengthSq()===0&&(Math.abs(n.z)===1?zt.x+=1e-4:zt.z+=1e-4,zt.normalize(),wn.crossVectors(n,zt)),wn.normalize(),Es.crossVectors(zt,wn),s[0]=wn.x,s[4]=Es.x,s[8]=zt.x,s[1]=wn.y,s[5]=Es.y,s[9]=zt.y,s[2]=wn.z,s[6]=Es.z,s[10]=zt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],c=n[8],h=n[12],l=n[1],d=n[5],u=n[9],m=n[13],g=n[2],x=n[6],p=n[10],f=n[14],y=n[3],M=n[7],S=n[11],C=n[15],R=s[0],A=s[4],N=s[8],X=s[12],_=s[1],T=s[5],G=s[9],j=s[13],L=s[2],U=s[6],D=s[10],W=s[14],V=s[3],q=s[7],Y=s[11],ee=s[15];return r[0]=o*R+a*_+c*L+h*V,r[4]=o*A+a*T+c*U+h*q,r[8]=o*N+a*G+c*D+h*Y,r[12]=o*X+a*j+c*W+h*ee,r[1]=l*R+d*_+u*L+m*V,r[5]=l*A+d*T+u*U+m*q,r[9]=l*N+d*G+u*D+m*Y,r[13]=l*X+d*j+u*W+m*ee,r[2]=g*R+x*_+p*L+f*V,r[6]=g*A+x*T+p*U+f*q,r[10]=g*N+x*G+p*D+f*Y,r[14]=g*X+x*j+p*W+f*ee,r[3]=y*R+M*_+S*L+C*V,r[7]=y*A+M*T+S*U+C*q,r[11]=y*N+M*G+S*D+C*Y,r[15]=y*X+M*j+S*W+C*ee,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],h=e[13],l=e[2],d=e[6],u=e[10],m=e[14],g=e[3],x=e[7],p=e[11],f=e[15];return g*(+r*c*d-s*h*d-r*a*u+n*h*u+s*a*m-n*c*m)+x*(+t*c*m-t*h*u+r*o*u-s*o*m+s*h*l-r*c*l)+p*(+t*h*d-t*a*m-r*o*d+n*o*m+r*a*l-n*h*l)+f*(-s*a*l-t*c*d+t*a*u+s*o*d-n*o*u+n*c*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],h=e[7],l=e[8],d=e[9],u=e[10],m=e[11],g=e[12],x=e[13],p=e[14],f=e[15],y=d*p*h-x*u*h+x*c*m-a*p*m-d*c*f+a*u*f,M=g*u*h-l*p*h-g*c*m+o*p*m+l*c*f-o*u*f,S=l*x*h-g*d*h+g*a*m-o*x*m-l*a*f+o*d*f,C=g*d*c-l*x*c-g*a*u+o*x*u+l*a*p-o*d*p,R=t*y+n*M+s*S+r*C;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/R;return e[0]=y*A,e[1]=(x*u*r-d*p*r-x*s*m+n*p*m+d*s*f-n*u*f)*A,e[2]=(a*p*r-x*c*r+x*s*h-n*p*h-a*s*f+n*c*f)*A,e[3]=(d*c*r-a*u*r-d*s*h+n*u*h+a*s*m-n*c*m)*A,e[4]=M*A,e[5]=(l*p*r-g*u*r+g*s*m-t*p*m-l*s*f+t*u*f)*A,e[6]=(g*c*r-o*p*r-g*s*h+t*p*h+o*s*f-t*c*f)*A,e[7]=(o*u*r-l*c*r+l*s*h-t*u*h-o*s*m+t*c*m)*A,e[8]=S*A,e[9]=(g*d*r-l*x*r-g*n*m+t*x*m+l*n*f-t*d*f)*A,e[10]=(o*x*r-g*a*r+g*n*h-t*x*h-o*n*f+t*a*f)*A,e[11]=(l*a*r-o*d*r-l*n*h+t*d*h+o*n*m-t*a*m)*A,e[12]=C*A,e[13]=(l*x*s-g*d*s+g*n*u-t*x*u-l*n*p+t*d*p)*A,e[14]=(g*a*s-o*x*s-g*n*c+t*x*c+o*n*p-t*a*p)*A,e[15]=(o*d*s-l*a*s+l*n*c-t*d*c-o*n*u+t*a*u)*A,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,c=e.z,h=r*o,l=r*a;return this.set(h*o+n,h*a-s*c,h*c+s*a,0,h*a+s*c,l*a+n,l*c-s*o,0,h*c-s*a,l*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,h=r+r,l=o+o,d=a+a,u=r*h,m=r*l,g=r*d,x=o*l,p=o*d,f=a*d,y=c*h,M=c*l,S=c*d,C=n.x,R=n.y,A=n.z;return s[0]=(1-(x+f))*C,s[1]=(m+S)*C,s[2]=(g-M)*C,s[3]=0,s[4]=(m-S)*R,s[5]=(1-(u+f))*R,s[6]=(p+y)*R,s[7]=0,s[8]=(g+M)*A,s[9]=(p-y)*A,s[10]=(1-(u+x))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=ci.set(s[0],s[1],s[2]).length();const o=ci.set(s[4],s[5],s[6]).length(),a=ci.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Yt.copy(this);const h=1/r,l=1/o,d=1/a;return Yt.elements[0]*=h,Yt.elements[1]*=h,Yt.elements[2]*=h,Yt.elements[4]*=l,Yt.elements[5]*=l,Yt.elements[6]*=l,Yt.elements[8]*=d,Yt.elements[9]*=d,Yt.elements[10]*=d,t.setFromRotationMatrix(Yt),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=Mn){const c=this.elements,h=2*r/(t-e),l=2*r/(n-s),d=(t+e)/(t-e),u=(n+s)/(n-s);let m,g;if(a===Mn)m=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===er)m=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=l,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=Mn){const c=this.elements,h=1/(t-e),l=1/(n-s),d=1/(o-r),u=(t+e)*h,m=(n+s)*l;let g,x;if(a===Mn)g=(o+r)*d,x=-2*d;else if(a===er)g=r*d,x=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*h,c[4]=0,c[8]=0,c[12]=-u,c[1]=0,c[5]=2*l,c[9]=0,c[13]=-m,c[2]=0,c[6]=0,c[10]=x,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const ci=new P,Yt=new Qe,gu=new P(0,0,0),_u=new P(1,1,1),wn=new P,Es=new P,zt=new P,Do=new Qe,Io=new hs;class hr{constructor(e=0,t=0,n=0,s=hr.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],h=s[5],l=s[9],d=s[2],u=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(Dt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-l,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Dt(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Dt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,m),this._z=Math.atan2(-o,h)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Dt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,m),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,h));break;case"YZX":this._z=Math.asin(Dt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-l,h),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-Dt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,h),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-l,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Do.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Do,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Io.setFromEuler(this),this.setFromQuaternion(Io,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}hr.DEFAULT_ORDER="XYZ";class Aa{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let xu=0;const Uo=new P,li=new hs,fn=new Qe,Ts=new P,ji=new P,vu=new P,Mu=new hs,Fo=new P(1,0,0),No=new P(0,1,0),zo=new P(0,0,1),yu={type:"added"},Su={type:"removed"};class lt extends Bi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:xu++}),this.uuid=yn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=lt.DEFAULT_UP.clone();const e=new P,t=new hr,n=new hs,s=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Qe},normalMatrix:{value:new Oe}}),this.matrix=new Qe,this.matrixWorld=new Qe,this.matrixAutoUpdate=lt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=lt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Aa,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return li.setFromAxisAngle(e,t),this.quaternion.multiply(li),this}rotateOnWorldAxis(e,t){return li.setFromAxisAngle(e,t),this.quaternion.premultiply(li),this}rotateX(e){return this.rotateOnAxis(Fo,e)}rotateY(e){return this.rotateOnAxis(No,e)}rotateZ(e){return this.rotateOnAxis(zo,e)}translateOnAxis(e,t){return Uo.copy(e).applyQuaternion(this.quaternion),this.position.add(Uo.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Fo,e)}translateY(e){return this.translateOnAxis(No,e)}translateZ(e){return this.translateOnAxis(zo,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(fn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ts.copy(e):Ts.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ji.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?fn.lookAt(ji,Ts,this.up):fn.lookAt(Ts,ji,this.up),this.quaternion.setFromRotationMatrix(fn),s&&(fn.extractRotation(s.matrixWorld),li.setFromRotationMatrix(fn),this.quaternion.premultiply(li.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(yu)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Su)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),fn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),fn.multiply(e.parent.matrixWorld)),e.applyMatrix4(fn),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ji,e,vu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ji,Mu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++){const r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++){const a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let h=0,l=c.length;h<l;h++){const d=c[h];r(e.shapes,d)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,h=this.material.length;c<h;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){const a=o(e.geometries),c=o(e.materials),h=o(e.textures),l=o(e.images),d=o(e.shapes),u=o(e.skeletons),m=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),h.length>0&&(n.textures=h),l.length>0&&(n.images=l),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const c=[];for(const h in a){const l=a[h];delete l.metadata,c.push(l)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}lt.DEFAULT_UP=new P(0,1,0);lt.DEFAULT_MATRIX_AUTO_UPDATE=!0;lt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const jt=new P,pn=new P,Dr=new P,mn=new P,hi=new P,di=new P,Oo=new P,Ir=new P,Ur=new P,Fr=new P;class Qt{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),jt.subVectors(e,t),s.cross(jt);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){jt.subVectors(s,t),pn.subVectors(n,t),Dr.subVectors(e,t);const o=jt.dot(jt),a=jt.dot(pn),c=jt.dot(Dr),h=pn.dot(pn),l=pn.dot(Dr),d=o*h-a*a;if(d===0)return r.set(0,0,0),null;const u=1/d,m=(h*c-a*l)*u,g=(o*l-a*c)*u;return r.set(1-m-g,g,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,mn)===null?!1:mn.x>=0&&mn.y>=0&&mn.x+mn.y<=1}static getInterpolation(e,t,n,s,r,o,a,c){return this.getBarycoord(e,t,n,s,mn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,mn.x),c.addScaledVector(o,mn.y),c.addScaledVector(a,mn.z),c)}static isFrontFacing(e,t,n,s){return jt.subVectors(n,t),pn.subVectors(e,t),jt.cross(pn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return jt.subVectors(this.c,this.b),pn.subVectors(this.a,this.b),jt.cross(pn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Qt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Qt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return Qt.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return Qt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Qt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let o,a;hi.subVectors(s,n),di.subVectors(r,n),Ir.subVectors(e,n);const c=hi.dot(Ir),h=di.dot(Ir);if(c<=0&&h<=0)return t.copy(n);Ur.subVectors(e,s);const l=hi.dot(Ur),d=di.dot(Ur);if(l>=0&&d<=l)return t.copy(s);const u=c*d-l*h;if(u<=0&&c>=0&&l<=0)return o=c/(c-l),t.copy(n).addScaledVector(hi,o);Fr.subVectors(e,r);const m=hi.dot(Fr),g=di.dot(Fr);if(g>=0&&m<=g)return t.copy(r);const x=m*h-c*g;if(x<=0&&h>=0&&g<=0)return a=h/(h-g),t.copy(n).addScaledVector(di,a);const p=l*g-m*d;if(p<=0&&d-l>=0&&m-g>=0)return Oo.subVectors(r,s),a=(d-l)/(d-l+(m-g)),t.copy(s).addScaledVector(Oo,a);const f=1/(p+x+u);return o=x*f,a=u*f,t.copy(n).addScaledVector(hi,o).addScaledVector(di,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const ol={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},An={h:0,s:0,l:0},ws={h:0,s:0,l:0};function Nr(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Re{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=dt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,je.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=je.workingColorSpace){return this.r=e,this.g=t,this.b=n,je.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=je.workingColorSpace){if(e=wa(e,1),t=Dt(t,0,1),n=Dt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Nr(o,r,e+1/3),this.g=Nr(o,r,e),this.b=Nr(o,r,e-1/3)}return je.toWorkingColorSpace(this,s),this}setStyle(e,t=dt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=dt){const n=ol[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ri(e.r),this.g=Ri(e.g),this.b=Ri(e.b),this}copyLinearToSRGB(e){return this.r=Er(e.r),this.g=Er(e.g),this.b=Er(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=dt){return je.fromWorkingColorSpace(At.copy(this),e),Math.round(Dt(At.r*255,0,255))*65536+Math.round(Dt(At.g*255,0,255))*256+Math.round(Dt(At.b*255,0,255))}getHexString(e=dt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=je.workingColorSpace){je.fromWorkingColorSpace(At.copy(this),t);const n=At.r,s=At.g,r=At.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,h;const l=(a+o)/2;if(a===o)c=0,h=0;else{const d=o-a;switch(h=l<=.5?d/(o+a):d/(2-o-a),o){case n:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-n)/d+2;break;case r:c=(n-s)/d+4;break}c/=6}return e.h=c,e.s=h,e.l=l,e}getRGB(e,t=je.workingColorSpace){return je.fromWorkingColorSpace(At.copy(this),t),e.r=At.r,e.g=At.g,e.b=At.b,e}getStyle(e=dt){je.fromWorkingColorSpace(At.copy(this),e);const t=At.r,n=At.g,s=At.b;return e!==dt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(An),this.setHSL(An.h+e,An.s+t,An.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(An),e.getHSL(ws);const n=is(An.h,ws.h,t),s=is(An.s,ws.s,t),r=is(An.l,ws.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const At=new Re;Re.NAMES=ol;let bu=0;class zn extends Bi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:bu++}),this.uuid=yn(),this.name="",this.type="Material",this.blending=Ai,this.side=Fn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=oa,this.blendDst=ca,this.blendEquation=Xn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Re(0,0,0),this.blendAlpha=0,this.depthFunc=Ks,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=To,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ii,this.stencilZFail=ii,this.stencilZPass=ii,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ai&&(n.blending=this.blending),this.side!==Fn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==oa&&(n.blendSrc=this.blendSrc),this.blendDst!==ca&&(n.blendDst=this.blendDst),this.blendEquation!==Xn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ks&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==To&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ii&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ii&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ii&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(t){const r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class en extends zn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Re(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Wc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ht=new P,As=new Se;class Et{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=fa,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=vn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return Jn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)As.fromBufferAttribute(this,t),As.applyMatrix3(e),this.setXY(t,As.x,As.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)ht.fromBufferAttribute(this,t),ht.applyMatrix3(e),this.setXYZ(t,ht.x,ht.y,ht.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)ht.fromBufferAttribute(this,t),ht.applyMatrix4(e),this.setXYZ(t,ht.x,ht.y,ht.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)ht.fromBufferAttribute(this,t),ht.applyNormalMatrix(e),this.setXYZ(t,ht.x,ht.y,ht.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)ht.fromBufferAttribute(this,t),ht.transformDirection(e),this.setXYZ(t,ht.x,ht.y,ht.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Jt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=qe(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Jt(t,this.array)),t}setX(e,t){return this.normalized&&(t=qe(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Jt(t,this.array)),t}setY(e,t){return this.normalized&&(t=qe(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Jt(t,this.array)),t}setZ(e,t){return this.normalized&&(t=qe(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Jt(t,this.array)),t}setW(e,t){return this.normalized&&(t=qe(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=qe(t,this.array),n=qe(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=qe(t,this.array),n=qe(n,this.array),s=qe(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=qe(t,this.array),n=qe(n,this.array),s=qe(s,this.array),r=qe(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==fa&&(e.usage=this.usage),e}}class cl extends Et{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class ll extends Et{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class et extends Et{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Eu=0;const Ht=new Qe,zr=new lt,ui=new P,Ot=new ti,$i=new ti,_t=new P;class ft extends Bi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Eu++}),this.uuid=yn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(il(e)?ll:cl)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Oe().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Ht.makeRotationFromQuaternion(e),this.applyMatrix4(Ht),this}rotateX(e){return Ht.makeRotationX(e),this.applyMatrix4(Ht),this}rotateY(e){return Ht.makeRotationY(e),this.applyMatrix4(Ht),this}rotateZ(e){return Ht.makeRotationZ(e),this.applyMatrix4(Ht),this}translate(e,t,n){return Ht.makeTranslation(e,t,n),this.applyMatrix4(Ht),this}scale(e,t,n){return Ht.makeScale(e,t,n),this.applyMatrix4(Ht),this}lookAt(e){return zr.lookAt(e),zr.updateMatrix(),this.applyMatrix4(zr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ui).negate(),this.translate(ui.x,ui.y,ui.z),this}setFromPoints(e){const t=[];for(let n=0,s=e.length;n<s;n++){const r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new et(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ti);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Ot.setFromBufferAttribute(r),this.morphTargetsRelative?(_t.addVectors(this.boundingBox.min,Ot.min),this.boundingBox.expandByPoint(_t),_t.addVectors(this.boundingBox.max,Ot.max),this.boundingBox.expandByPoint(_t)):(this.boundingBox.expandByPoint(Ot.min),this.boundingBox.expandByPoint(Ot.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ni);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new P,1/0);return}if(e){const n=this.boundingSphere.center;if(Ot.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];$i.setFromBufferAttribute(a),this.morphTargetsRelative?(_t.addVectors(Ot.min,$i.min),Ot.expandByPoint(_t),_t.addVectors(Ot.max,$i.max),Ot.expandByPoint(_t)):(Ot.expandByPoint($i.min),Ot.expandByPoint($i.max))}Ot.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)_t.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(_t));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],c=this.morphTargetsRelative;for(let h=0,l=a.count;h<l;h++)_t.fromBufferAttribute(a,h),c&&(ui.fromBufferAttribute(e,h),_t.add(ui)),s=Math.max(s,n.distanceToSquared(_t))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.array,s=t.position.array,r=t.normal.array,o=t.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Et(new Float32Array(4*a),4));const c=this.getAttribute("tangent").array,h=[],l=[];for(let _=0;_<a;_++)h[_]=new P,l[_]=new P;const d=new P,u=new P,m=new P,g=new Se,x=new Se,p=new Se,f=new P,y=new P;function M(_,T,G){d.fromArray(s,_*3),u.fromArray(s,T*3),m.fromArray(s,G*3),g.fromArray(o,_*2),x.fromArray(o,T*2),p.fromArray(o,G*2),u.sub(d),m.sub(d),x.sub(g),p.sub(g);const j=1/(x.x*p.y-p.x*x.y);isFinite(j)&&(f.copy(u).multiplyScalar(p.y).addScaledVector(m,-x.y).multiplyScalar(j),y.copy(m).multiplyScalar(x.x).addScaledVector(u,-p.x).multiplyScalar(j),h[_].add(f),h[T].add(f),h[G].add(f),l[_].add(y),l[T].add(y),l[G].add(y))}let S=this.groups;S.length===0&&(S=[{start:0,count:n.length}]);for(let _=0,T=S.length;_<T;++_){const G=S[_],j=G.start,L=G.count;for(let U=j,D=j+L;U<D;U+=3)M(n[U+0],n[U+1],n[U+2])}const C=new P,R=new P,A=new P,N=new P;function X(_){A.fromArray(r,_*3),N.copy(A);const T=h[_];C.copy(T),C.sub(A.multiplyScalar(A.dot(T))).normalize(),R.crossVectors(N,T);const j=R.dot(l[_])<0?-1:1;c[_*4]=C.x,c[_*4+1]=C.y,c[_*4+2]=C.z,c[_*4+3]=j}for(let _=0,T=S.length;_<T;++_){const G=S[_],j=G.start,L=G.count;for(let U=j,D=j+L;U<D;U+=3)X(n[U+0]),X(n[U+1]),X(n[U+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Et(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,m=n.count;u<m;u++)n.setXYZ(u,0,0,0);const s=new P,r=new P,o=new P,a=new P,c=new P,h=new P,l=new P,d=new P;if(e)for(let u=0,m=e.count;u<m;u+=3){const g=e.getX(u+0),x=e.getX(u+1),p=e.getX(u+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,x),o.fromBufferAttribute(t,p),l.subVectors(o,r),d.subVectors(s,r),l.cross(d),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,x),h.fromBufferAttribute(n,p),a.add(l),c.add(l),h.add(l),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(p,h.x,h.y,h.z)}else for(let u=0,m=t.count;u<m;u+=3)s.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),o.fromBufferAttribute(t,u+2),l.subVectors(o,r),d.subVectors(s,r),l.cross(d),n.setXYZ(u+0,l.x,l.y,l.z),n.setXYZ(u+1,l.x,l.y,l.z),n.setXYZ(u+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)_t.fromBufferAttribute(e,t),_t.normalize(),e.setXYZ(t,_t.x,_t.y,_t.z)}toNonIndexed(){function e(a,c){const h=a.array,l=a.itemSize,d=a.normalized,u=new h.constructor(c.length*l);let m=0,g=0;for(let x=0,p=c.length;x<p;x++){a.isInterleavedBufferAttribute?m=c[x]*a.data.stride+a.offset:m=c[x]*l;for(let f=0;f<l;f++)u[g++]=h[m++]}return new Et(u,l,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new ft,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],h=e(c,n);t.setAttribute(a,h)}const r=this.morphAttributes;for(const a in r){const c=[],h=r[a];for(let l=0,d=h.length;l<d;l++){const u=h[l],m=e(u,n);c.push(m)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const h=o[a];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(e[h]=c[h]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const h=n[c];e.data.attributes[c]=h.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],l=[];for(let d=0,u=h.length;d<u;d++){const m=h[d];l.push(m.toJSON(e.data))}l.length>0&&(s[c]=l,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const s=e.attributes;for(const h in s){const l=s[h];this.setAttribute(h,l.clone(t))}const r=e.morphAttributes;for(const h in r){const l=[],d=r[h];for(let u=0,m=d.length;u<m;u++)l.push(d[u].clone(t));this.morphAttributes[h]=l}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let h=0,l=o.length;h<l;h++){const d=o[h];this.addGroup(d.start,d.count,d.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Bo=new Qe,Hn=new lr,Rs=new ni,ko=new P,fi=new P,pi=new P,mi=new P,Or=new P,Cs=new P,Ps=new Se,Ls=new Se,Ds=new Se,Go=new P,Ho=new P,Vo=new P,Is=new P,Us=new P;class he extends lt{constructor(e=new ft,t=new en){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const a=this.morphTargetInfluences;if(r&&a){Cs.set(0,0,0);for(let c=0,h=r.length;c<h;c++){const l=a[c],d=r[c];l!==0&&(Or.fromBufferAttribute(d,e),o?Cs.addScaledVector(Or,l):Cs.addScaledVector(Or.sub(t),l))}t.add(Cs)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Rs.copy(n.boundingSphere),Rs.applyMatrix4(r),Hn.copy(e.ray).recast(e.near),!(Rs.containsPoint(Hn.origin)===!1&&(Hn.intersectSphere(Rs,ko)===null||Hn.origin.distanceToSquared(ko)>(e.far-e.near)**2))&&(Bo.copy(r).invert(),Hn.copy(e.ray).applyMatrix4(Bo),!(n.boundingBox!==null&&Hn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Hn)))}_computeIntersections(e,t,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,h=r.attributes.uv,l=r.attributes.uv1,d=r.attributes.normal,u=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=u.length;g<x;g++){const p=u[g],f=o[p.materialIndex],y=Math.max(p.start,m.start),M=Math.min(a.count,Math.min(p.start+p.count,m.start+m.count));for(let S=y,C=M;S<C;S+=3){const R=a.getX(S),A=a.getX(S+1),N=a.getX(S+2);s=Fs(this,f,e,n,h,l,d,R,A,N),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),x=Math.min(a.count,m.start+m.count);for(let p=g,f=x;p<f;p+=3){const y=a.getX(p),M=a.getX(p+1),S=a.getX(p+2);s=Fs(this,o,e,n,h,l,d,y,M,S),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,x=u.length;g<x;g++){const p=u[g],f=o[p.materialIndex],y=Math.max(p.start,m.start),M=Math.min(c.count,Math.min(p.start+p.count,m.start+m.count));for(let S=y,C=M;S<C;S+=3){const R=S,A=S+1,N=S+2;s=Fs(this,f,e,n,h,l,d,R,A,N),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),x=Math.min(c.count,m.start+m.count);for(let p=g,f=x;p<f;p+=3){const y=p,M=p+1,S=p+2;s=Fs(this,o,e,n,h,l,d,y,M,S),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function Tu(i,e,t,n,s,r,o,a){let c;if(e.side===Ft?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,e.side===Fn,a),c===null)return null;Us.copy(a),Us.applyMatrix4(i.matrixWorld);const h=t.ray.origin.distanceTo(Us);return h<t.near||h>t.far?null:{distance:h,point:Us.clone(),object:i}}function Fs(i,e,t,n,s,r,o,a,c,h){i.getVertexPosition(a,fi),i.getVertexPosition(c,pi),i.getVertexPosition(h,mi);const l=Tu(i,e,t,n,fi,pi,mi,Is);if(l){s&&(Ps.fromBufferAttribute(s,a),Ls.fromBufferAttribute(s,c),Ds.fromBufferAttribute(s,h),l.uv=Qt.getInterpolation(Is,fi,pi,mi,Ps,Ls,Ds,new Se)),r&&(Ps.fromBufferAttribute(r,a),Ls.fromBufferAttribute(r,c),Ds.fromBufferAttribute(r,h),l.uv1=Qt.getInterpolation(Is,fi,pi,mi,Ps,Ls,Ds,new Se),l.uv2=l.uv1),o&&(Go.fromBufferAttribute(o,a),Ho.fromBufferAttribute(o,c),Vo.fromBufferAttribute(o,h),l.normal=Qt.getInterpolation(Is,fi,pi,mi,Go,Ho,Vo,new P),l.normal.dot(n.direction)>0&&l.normal.multiplyScalar(-1));const d={a,b:c,c:h,normal:new P,materialIndex:0};Qt.getNormal(fi,pi,mi,d.normal),l.face=d}return l}class Vt extends ft{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],h=[],l=[],d=[];let u=0,m=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new et(h,3)),this.setAttribute("normal",new et(l,3)),this.setAttribute("uv",new et(d,2));function g(x,p,f,y,M,S,C,R,A,N,X){const _=S/A,T=C/N,G=S/2,j=C/2,L=R/2,U=A+1,D=N+1;let W=0,V=0;const q=new P;for(let Y=0;Y<D;Y++){const ee=Y*T-j;for(let se=0;se<U;se++){const Te=se*_-G;q[x]=Te*y,q[p]=ee*M,q[f]=L,h.push(q.x,q.y,q.z),q[x]=0,q[p]=0,q[f]=R>0?1:-1,l.push(q.x,q.y,q.z),d.push(se/A),d.push(1-Y/N),W+=1}}for(let Y=0;Y<N;Y++)for(let ee=0;ee<A;ee++){const se=u+ee+U*Y,Te=u+ee+U*(Y+1),H=u+(ee+1)+U*(Y+1),Z=u+(ee+1)+U*Y;c.push(se,Te,Z),c.push(Te,H,Z),V+=6}a.addGroup(m,V,X),m+=V,u+=W}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Fi(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Pt(i){const e={};for(let t=0;t<i.length;t++){const n=Fi(i[t]);for(const s in n)e[s]=n[s]}return e}function wu(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function hl(i){return i.getRenderTarget()===null?i.outputColorSpace:je.workingColorSpace}const Au={clone:Fi,merge:Pt};var Ru=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Cu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Nn extends zn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ru,this.fragmentShader=Cu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Fi(e.uniforms),this.uniformsGroups=wu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class dl extends lt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Qe,this.projectionMatrix=new Qe,this.projectionMatrixInverse=new Qe,this.coordinateSystem=Mn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Rn=new P,Wo=new Se,Xo=new Se;class Bt extends dl{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=os*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ns*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return os*2*Math.atan(Math.tan(ns*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Rn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Rn.x,Rn.y).multiplyScalar(-e/Rn.z),Rn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Rn.x,Rn.y).multiplyScalar(-e/Rn.z)}getViewSize(e,t){return this.getViewBounds(e,Wo,Xo),t.subVectors(Xo,Wo)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ns*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,h=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*n/h,s*=o.width/c,n*=o.height/h}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const gi=-90,_i=1;class Pu extends lt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Bt(gi,_i,e,t);s.layers=this.layers,this.add(s);const r=new Bt(gi,_i,e,t);r.layers=this.layers,this.add(r);const o=new Bt(gi,_i,e,t);o.layers=this.layers,this.add(o);const a=new Bt(gi,_i,e,t);a.layers=this.layers,this.add(a);const c=new Bt(gi,_i,e,t);c.layers=this.layers,this.add(c);const h=new Bt(gi,_i,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,c]=t;for(const h of t)this.remove(h);if(e===Mn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===er)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,h,l]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,h),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),e.render(t,l),e.setRenderTarget(d,u,m),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class ul extends It{constructor(e,t,n,s,r,o,a,c,h,l){e=e!==void 0?e:[],t=t!==void 0?t:Di,super(e,t,n,s,r,o,a,c,h,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Lu extends ei{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];t.encoding!==void 0&&(Jn("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===Zn?dt:Wt),this.texture=new ul(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Ut}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Vt(5,5,5),r=new Nn({name:"CubemapFromEquirect",uniforms:Fi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ft,blending:Dn});r.uniforms.tEquirect.value=t;const o=new he(s,r),a=t.minFilter;return t.minFilter===Yn&&(t.minFilter=Ut),new Pu(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,s){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}}const Br=new P,Du=new P,Iu=new Oe;class Cn{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Br.subVectors(n,t).cross(Du.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Br),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Iu.getNormalMatrix(e),s=this.coplanarPoint(Br).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Vn=new ni,Ns=new P;class Ra{constructor(e=new Cn,t=new Cn,n=new Cn,s=new Cn,r=new Cn,o=new Cn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Mn){const n=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],c=s[3],h=s[4],l=s[5],d=s[6],u=s[7],m=s[8],g=s[9],x=s[10],p=s[11],f=s[12],y=s[13],M=s[14],S=s[15];if(n[0].setComponents(c-r,u-h,p-m,S-f).normalize(),n[1].setComponents(c+r,u+h,p+m,S+f).normalize(),n[2].setComponents(c+o,u+l,p+g,S+y).normalize(),n[3].setComponents(c-o,u-l,p-g,S-y).normalize(),n[4].setComponents(c-a,u-d,p-x,S-M).normalize(),t===Mn)n[5].setComponents(c+a,u+d,p+x,S+M).normalize();else if(t===er)n[5].setComponents(a,d,x,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Vn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Vn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Vn)}intersectsSprite(e){return Vn.center.set(0,0,0),Vn.radius=.7071067811865476,Vn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Vn)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(Ns.x=s.normal.x>0?e.max.x:e.min.x,Ns.y=s.normal.y>0?e.max.y:e.min.y,Ns.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Ns)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function fl(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Uu(i,e){const t=e.isWebGL2,n=new WeakMap;function s(h,l){const d=h.array,u=h.usage,m=d.byteLength,g=i.createBuffer();i.bindBuffer(l,g),i.bufferData(l,d,u),h.onUploadCallback();let x;if(d instanceof Float32Array)x=i.FLOAT;else if(d instanceof Uint16Array)if(h.isFloat16BufferAttribute)if(t)x=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else x=i.UNSIGNED_SHORT;else if(d instanceof Int16Array)x=i.SHORT;else if(d instanceof Uint32Array)x=i.UNSIGNED_INT;else if(d instanceof Int32Array)x=i.INT;else if(d instanceof Int8Array)x=i.BYTE;else if(d instanceof Uint8Array)x=i.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)x=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:g,type:x,bytesPerElement:d.BYTES_PER_ELEMENT,version:h.version,size:m}}function r(h,l,d){const u=l.array,m=l._updateRange,g=l.updateRanges;if(i.bindBuffer(d,h),m.count===-1&&g.length===0&&i.bufferSubData(d,0,u),g.length!==0){for(let x=0,p=g.length;x<p;x++){const f=g[x];t?i.bufferSubData(d,f.start*u.BYTES_PER_ELEMENT,u,f.start,f.count):i.bufferSubData(d,f.start*u.BYTES_PER_ELEMENT,u.subarray(f.start,f.start+f.count))}l.clearUpdateRanges()}m.count!==-1&&(t?i.bufferSubData(d,m.offset*u.BYTES_PER_ELEMENT,u,m.offset,m.count):i.bufferSubData(d,m.offset*u.BYTES_PER_ELEMENT,u.subarray(m.offset,m.offset+m.count)),m.count=-1),l.onUploadCallback()}function o(h){return h.isInterleavedBufferAttribute&&(h=h.data),n.get(h)}function a(h){h.isInterleavedBufferAttribute&&(h=h.data);const l=n.get(h);l&&(i.deleteBuffer(l.buffer),n.delete(h))}function c(h,l){if(h.isGLBufferAttribute){const u=n.get(h);(!u||u.version<h.version)&&n.set(h,{buffer:h.buffer,type:h.type,bytesPerElement:h.elementSize,version:h.version});return}h.isInterleavedBufferAttribute&&(h=h.data);const d=n.get(h);if(d===void 0)n.set(h,s(h,l));else if(d.version<h.version){if(d.size!==h.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(d.buffer,h,l),d.version=h.version}}return{get:o,remove:a,update:c}}class ds extends ft{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,o=t/2,a=Math.floor(n),c=Math.floor(s),h=a+1,l=c+1,d=e/a,u=t/c,m=[],g=[],x=[],p=[];for(let f=0;f<l;f++){const y=f*u-o;for(let M=0;M<h;M++){const S=M*d-r;g.push(S,-y,0),x.push(0,0,1),p.push(M/a),p.push(1-f/c)}}for(let f=0;f<c;f++)for(let y=0;y<a;y++){const M=y+h*f,S=y+h*(f+1),C=y+1+h*(f+1),R=y+1+h*f;m.push(M,S,R),m.push(S,C,R)}this.setIndex(m),this.setAttribute("position",new et(g,3)),this.setAttribute("normal",new et(x,3)),this.setAttribute("uv",new et(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ds(e.width,e.height,e.widthSegments,e.heightSegments)}}var Fu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Nu=`#ifdef USE_ALPHAHASH
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
#endif`,zu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ou=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Bu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ku=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Gu=`#ifdef USE_AOMAP
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
#endif`,Hu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Vu=`#ifdef USE_BATCHING
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
#endif`,Wu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Xu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,qu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Yu=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,ju=`#ifdef USE_IRIDESCENCE
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
#endif`,$u=`#ifdef USE_BUMPMAP
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
#endif`,Ku=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Zu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ju=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Qu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ef=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,tf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,nf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,sf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,rf=`#define PI 3.141592653589793
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
} // validated`,af=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,of=`vec3 transformedNormal = objectNormal;
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
#endif`,cf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,lf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,hf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,df=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,uf="gl_FragColor = linearToOutputTexel( gl_FragColor );",ff=`
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
}`,pf=`#ifdef USE_ENVMAP
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
#endif`,mf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,gf=`#ifdef USE_ENVMAP
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
#endif`,_f=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,xf=`#ifdef USE_ENVMAP
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
#endif`,vf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Mf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,yf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Sf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,bf=`#ifdef USE_GRADIENTMAP
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
}`,Ef=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Tf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,wf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Af=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Rf=`uniform bool receiveShadow;
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
#endif`,Cf=`#ifdef USE_ENVMAP
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
#endif`,Pf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Lf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Df=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,If=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Uf=`PhysicalMaterial material;
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
#endif`,Ff=`struct PhysicalMaterial {
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
}`,Nf=`
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
#endif`,zf=`#if defined( RE_IndirectDiffuse )
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
#endif`,Of=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Bf=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,kf=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Gf=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Hf=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Vf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Wf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Xf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,qf=`#if defined( USE_POINTS_UV )
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
#endif`,Yf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,jf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,$f=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Kf=`#ifdef USE_MORPHNORMALS
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
#endif`,Zf=`#ifdef USE_MORPHTARGETS
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
#endif`,Jf=`#ifdef USE_MORPHTARGETS
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
#endif`,Qf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,ep=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,tp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,np=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ip=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,sp=`#ifdef USE_NORMALMAP
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
#endif`,rp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ap=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,op=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,cp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,lp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,hp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,dp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,up=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,fp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,pp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,mp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,gp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,_p=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,xp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,vp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Mp=`float getShadowMask() {
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
}`,yp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Sp=`#ifdef USE_SKINNING
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
#endif`,bp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ep=`#ifdef USE_SKINNING
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
#endif`,Tp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,wp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ap=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Rp=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Cp=`#ifdef USE_TRANSMISSION
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
#endif`,Pp=`#ifdef USE_TRANSMISSION
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
#endif`,Lp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Dp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ip=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Up=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Fp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Np=`uniform sampler2D t2D;
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
}`,zp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Op=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Bp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,kp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Gp=`#include <common>
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
}`,Hp=`#if DEPTH_PACKING == 3200
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
}`,Vp=`#define DISTANCE
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
}`,Wp=`#define DISTANCE
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
}`,Xp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,qp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Yp=`uniform float scale;
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
}`,jp=`uniform vec3 diffuse;
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
}`,$p=`#include <common>
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
}`,Kp=`uniform vec3 diffuse;
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
}`,Zp=`#define LAMBERT
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
}`,Jp=`#define LAMBERT
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
}`,Qp=`#define MATCAP
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
}`,em=`#define MATCAP
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
}`,tm=`#define NORMAL
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
}`,nm=`#define NORMAL
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
}`,im=`#define PHONG
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
}`,sm=`#define PHONG
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
}`,rm=`#define STANDARD
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
}`,am=`#define STANDARD
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
}`,om=`#define TOON
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
}`,cm=`#define TOON
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
}`,lm=`uniform float size;
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
}`,hm=`uniform vec3 diffuse;
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
}`,dm=`#include <common>
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
}`,um=`uniform vec3 color;
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
}`,fm=`uniform float rotation;
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
}`,pm=`uniform vec3 diffuse;
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
}`,Ue={alphahash_fragment:Fu,alphahash_pars_fragment:Nu,alphamap_fragment:zu,alphamap_pars_fragment:Ou,alphatest_fragment:Bu,alphatest_pars_fragment:ku,aomap_fragment:Gu,aomap_pars_fragment:Hu,batching_pars_vertex:Vu,batching_vertex:Wu,begin_vertex:Xu,beginnormal_vertex:qu,bsdfs:Yu,iridescence_fragment:ju,bumpmap_pars_fragment:$u,clipping_planes_fragment:Ku,clipping_planes_pars_fragment:Zu,clipping_planes_pars_vertex:Ju,clipping_planes_vertex:Qu,color_fragment:ef,color_pars_fragment:tf,color_pars_vertex:nf,color_vertex:sf,common:rf,cube_uv_reflection_fragment:af,defaultnormal_vertex:of,displacementmap_pars_vertex:cf,displacementmap_vertex:lf,emissivemap_fragment:hf,emissivemap_pars_fragment:df,colorspace_fragment:uf,colorspace_pars_fragment:ff,envmap_fragment:pf,envmap_common_pars_fragment:mf,envmap_pars_fragment:gf,envmap_pars_vertex:_f,envmap_physical_pars_fragment:Cf,envmap_vertex:xf,fog_vertex:vf,fog_pars_vertex:Mf,fog_fragment:yf,fog_pars_fragment:Sf,gradientmap_pars_fragment:bf,lightmap_fragment:Ef,lightmap_pars_fragment:Tf,lights_lambert_fragment:wf,lights_lambert_pars_fragment:Af,lights_pars_begin:Rf,lights_toon_fragment:Pf,lights_toon_pars_fragment:Lf,lights_phong_fragment:Df,lights_phong_pars_fragment:If,lights_physical_fragment:Uf,lights_physical_pars_fragment:Ff,lights_fragment_begin:Nf,lights_fragment_maps:zf,lights_fragment_end:Of,logdepthbuf_fragment:Bf,logdepthbuf_pars_fragment:kf,logdepthbuf_pars_vertex:Gf,logdepthbuf_vertex:Hf,map_fragment:Vf,map_pars_fragment:Wf,map_particle_fragment:Xf,map_particle_pars_fragment:qf,metalnessmap_fragment:Yf,metalnessmap_pars_fragment:jf,morphcolor_vertex:$f,morphnormal_vertex:Kf,morphtarget_pars_vertex:Zf,morphtarget_vertex:Jf,normal_fragment_begin:Qf,normal_fragment_maps:ep,normal_pars_fragment:tp,normal_pars_vertex:np,normal_vertex:ip,normalmap_pars_fragment:sp,clearcoat_normal_fragment_begin:rp,clearcoat_normal_fragment_maps:ap,clearcoat_pars_fragment:op,iridescence_pars_fragment:cp,opaque_fragment:lp,packing:hp,premultiplied_alpha_fragment:dp,project_vertex:up,dithering_fragment:fp,dithering_pars_fragment:pp,roughnessmap_fragment:mp,roughnessmap_pars_fragment:gp,shadowmap_pars_fragment:_p,shadowmap_pars_vertex:xp,shadowmap_vertex:vp,shadowmask_pars_fragment:Mp,skinbase_vertex:yp,skinning_pars_vertex:Sp,skinning_vertex:bp,skinnormal_vertex:Ep,specularmap_fragment:Tp,specularmap_pars_fragment:wp,tonemapping_fragment:Ap,tonemapping_pars_fragment:Rp,transmission_fragment:Cp,transmission_pars_fragment:Pp,uv_pars_fragment:Lp,uv_pars_vertex:Dp,uv_vertex:Ip,worldpos_vertex:Up,background_vert:Fp,background_frag:Np,backgroundCube_vert:zp,backgroundCube_frag:Op,cube_vert:Bp,cube_frag:kp,depth_vert:Gp,depth_frag:Hp,distanceRGBA_vert:Vp,distanceRGBA_frag:Wp,equirect_vert:Xp,equirect_frag:qp,linedashed_vert:Yp,linedashed_frag:jp,meshbasic_vert:$p,meshbasic_frag:Kp,meshlambert_vert:Zp,meshlambert_frag:Jp,meshmatcap_vert:Qp,meshmatcap_frag:em,meshnormal_vert:tm,meshnormal_frag:nm,meshphong_vert:im,meshphong_frag:sm,meshphysical_vert:rm,meshphysical_frag:am,meshtoon_vert:om,meshtoon_frag:cm,points_vert:lm,points_frag:hm,shadow_vert:dm,shadow_frag:um,sprite_vert:fm,sprite_frag:pm},ie={common:{diffuse:{value:new Re(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Oe}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Oe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Oe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Oe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Oe},normalScale:{value:new Se(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Oe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Oe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Oe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Oe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Re(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Re(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0},uvTransform:{value:new Oe}},sprite:{diffuse:{value:new Re(16777215)},opacity:{value:1},center:{value:new Se(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}}},on={basic:{uniforms:Pt([ie.common,ie.specularmap,ie.envmap,ie.aomap,ie.lightmap,ie.fog]),vertexShader:Ue.meshbasic_vert,fragmentShader:Ue.meshbasic_frag},lambert:{uniforms:Pt([ie.common,ie.specularmap,ie.envmap,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.fog,ie.lights,{emissive:{value:new Re(0)}}]),vertexShader:Ue.meshlambert_vert,fragmentShader:Ue.meshlambert_frag},phong:{uniforms:Pt([ie.common,ie.specularmap,ie.envmap,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.fog,ie.lights,{emissive:{value:new Re(0)},specular:{value:new Re(1118481)},shininess:{value:30}}]),vertexShader:Ue.meshphong_vert,fragmentShader:Ue.meshphong_frag},standard:{uniforms:Pt([ie.common,ie.envmap,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.roughnessmap,ie.metalnessmap,ie.fog,ie.lights,{emissive:{value:new Re(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag},toon:{uniforms:Pt([ie.common,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.gradientmap,ie.fog,ie.lights,{emissive:{value:new Re(0)}}]),vertexShader:Ue.meshtoon_vert,fragmentShader:Ue.meshtoon_frag},matcap:{uniforms:Pt([ie.common,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.fog,{matcap:{value:null}}]),vertexShader:Ue.meshmatcap_vert,fragmentShader:Ue.meshmatcap_frag},points:{uniforms:Pt([ie.points,ie.fog]),vertexShader:Ue.points_vert,fragmentShader:Ue.points_frag},dashed:{uniforms:Pt([ie.common,ie.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ue.linedashed_vert,fragmentShader:Ue.linedashed_frag},depth:{uniforms:Pt([ie.common,ie.displacementmap]),vertexShader:Ue.depth_vert,fragmentShader:Ue.depth_frag},normal:{uniforms:Pt([ie.common,ie.bumpmap,ie.normalmap,ie.displacementmap,{opacity:{value:1}}]),vertexShader:Ue.meshnormal_vert,fragmentShader:Ue.meshnormal_frag},sprite:{uniforms:Pt([ie.sprite,ie.fog]),vertexShader:Ue.sprite_vert,fragmentShader:Ue.sprite_frag},background:{uniforms:{uvTransform:{value:new Oe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ue.background_vert,fragmentShader:Ue.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Ue.backgroundCube_vert,fragmentShader:Ue.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ue.cube_vert,fragmentShader:Ue.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ue.equirect_vert,fragmentShader:Ue.equirect_frag},distanceRGBA:{uniforms:Pt([ie.common,ie.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ue.distanceRGBA_vert,fragmentShader:Ue.distanceRGBA_frag},shadow:{uniforms:Pt([ie.lights,ie.fog,{color:{value:new Re(0)},opacity:{value:1}}]),vertexShader:Ue.shadow_vert,fragmentShader:Ue.shadow_frag}};on.physical={uniforms:Pt([on.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Oe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Oe},clearcoatNormalScale:{value:new Se(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Oe},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Oe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Oe},sheen:{value:0},sheenColor:{value:new Re(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Oe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Oe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Oe},transmissionSamplerSize:{value:new Se},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Oe},attenuationDistance:{value:0},attenuationColor:{value:new Re(0)},specularColor:{value:new Re(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Oe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Oe},anisotropyVector:{value:new Se},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Oe}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag};const zs={r:0,b:0,g:0};function mm(i,e,t,n,s,r,o){const a=new Re(0);let c=r===!0?0:1,h,l,d=null,u=0,m=null;function g(p,f){let y=!1,M=f.isScene===!0?f.background:null;M&&M.isTexture&&(M=(f.backgroundBlurriness>0?t:e).get(M)),M===null?x(a,c):M&&M.isColor&&(x(M,1),y=!0);const S=i.xr.getEnvironmentBlendMode();S==="additive"?n.buffers.color.setClear(0,0,0,1,o):S==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||y)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),M&&(M.isCubeTexture||M.mapping===or)?(l===void 0&&(l=new he(new Vt(1,1,1),new Nn({name:"BackgroundCubeMaterial",uniforms:Fi(on.backgroundCube.uniforms),vertexShader:on.backgroundCube.vertexShader,fragmentShader:on.backgroundCube.fragmentShader,side:Ft,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(C,R,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(l)),l.material.uniforms.envMap.value=M,l.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,l.material.uniforms.backgroundBlurriness.value=f.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,l.material.toneMapped=je.getTransfer(M.colorSpace)!==nt,(d!==M||u!==M.version||m!==i.toneMapping)&&(l.material.needsUpdate=!0,d=M,u=M.version,m=i.toneMapping),l.layers.enableAll(),p.unshift(l,l.geometry,l.material,0,0,null)):M&&M.isTexture&&(h===void 0&&(h=new he(new ds(2,2),new Nn({name:"BackgroundMaterial",uniforms:Fi(on.background.uniforms),vertexShader:on.background.vertexShader,fragmentShader:on.background.fragmentShader,side:Fn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=M,h.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,h.material.toneMapped=je.getTransfer(M.colorSpace)!==nt,M.matrixAutoUpdate===!0&&M.updateMatrix(),h.material.uniforms.uvTransform.value.copy(M.matrix),(d!==M||u!==M.version||m!==i.toneMapping)&&(h.material.needsUpdate=!0,d=M,u=M.version,m=i.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null))}function x(p,f){p.getRGB(zs,hl(i)),n.buffers.color.setClear(zs.r,zs.g,zs.b,f,o)}return{getClearColor:function(){return a},setClearColor:function(p,f=1){a.set(p),c=f,x(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(p){c=p,x(a,c)},render:g}}function gm(i,e,t,n){const s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:e.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},c=p(null);let h=c,l=!1;function d(L,U,D,W,V){let q=!1;if(o){const Y=x(W,D,U);h!==Y&&(h=Y,m(h.object)),q=f(L,W,D,V),q&&y(L,W,D,V)}else{const Y=U.wireframe===!0;(h.geometry!==W.id||h.program!==D.id||h.wireframe!==Y)&&(h.geometry=W.id,h.program=D.id,h.wireframe=Y,q=!0)}V!==null&&t.update(V,i.ELEMENT_ARRAY_BUFFER),(q||l)&&(l=!1,N(L,U,D,W),V!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(V).buffer))}function u(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function m(L){return n.isWebGL2?i.bindVertexArray(L):r.bindVertexArrayOES(L)}function g(L){return n.isWebGL2?i.deleteVertexArray(L):r.deleteVertexArrayOES(L)}function x(L,U,D){const W=D.wireframe===!0;let V=a[L.id];V===void 0&&(V={},a[L.id]=V);let q=V[U.id];q===void 0&&(q={},V[U.id]=q);let Y=q[W];return Y===void 0&&(Y=p(u()),q[W]=Y),Y}function p(L){const U=[],D=[],W=[];for(let V=0;V<s;V++)U[V]=0,D[V]=0,W[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:D,attributeDivisors:W,object:L,attributes:{},index:null}}function f(L,U,D,W){const V=h.attributes,q=U.attributes;let Y=0;const ee=D.getAttributes();for(const se in ee)if(ee[se].location>=0){const H=V[se];let Z=q[se];if(Z===void 0&&(se==="instanceMatrix"&&L.instanceMatrix&&(Z=L.instanceMatrix),se==="instanceColor"&&L.instanceColor&&(Z=L.instanceColor)),H===void 0||H.attribute!==Z||Z&&H.data!==Z.data)return!0;Y++}return h.attributesNum!==Y||h.index!==W}function y(L,U,D,W){const V={},q=U.attributes;let Y=0;const ee=D.getAttributes();for(const se in ee)if(ee[se].location>=0){let H=q[se];H===void 0&&(se==="instanceMatrix"&&L.instanceMatrix&&(H=L.instanceMatrix),se==="instanceColor"&&L.instanceColor&&(H=L.instanceColor));const Z={};Z.attribute=H,H&&H.data&&(Z.data=H.data),V[se]=Z,Y++}h.attributes=V,h.attributesNum=Y,h.index=W}function M(){const L=h.newAttributes;for(let U=0,D=L.length;U<D;U++)L[U]=0}function S(L){C(L,0)}function C(L,U){const D=h.newAttributes,W=h.enabledAttributes,V=h.attributeDivisors;D[L]=1,W[L]===0&&(i.enableVertexAttribArray(L),W[L]=1),V[L]!==U&&((n.isWebGL2?i:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](L,U),V[L]=U)}function R(){const L=h.newAttributes,U=h.enabledAttributes;for(let D=0,W=U.length;D<W;D++)U[D]!==L[D]&&(i.disableVertexAttribArray(D),U[D]=0)}function A(L,U,D,W,V,q,Y){Y===!0?i.vertexAttribIPointer(L,U,D,V,q):i.vertexAttribPointer(L,U,D,W,V,q)}function N(L,U,D,W){if(n.isWebGL2===!1&&(L.isInstancedMesh||W.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;M();const V=W.attributes,q=D.getAttributes(),Y=U.defaultAttributeValues;for(const ee in q){const se=q[ee];if(se.location>=0){let Te=V[ee];if(Te===void 0&&(ee==="instanceMatrix"&&L.instanceMatrix&&(Te=L.instanceMatrix),ee==="instanceColor"&&L.instanceColor&&(Te=L.instanceColor)),Te!==void 0){const H=Te.normalized,Z=Te.itemSize,oe=t.get(Te);if(oe===void 0)continue;const ve=oe.buffer,Me=oe.type,ue=oe.bytesPerElement,Ve=n.isWebGL2===!0&&(Me===i.INT||Me===i.UNSIGNED_INT||Te.gpuType===Yc);if(Te.isInterleavedBufferAttribute){const Pe=Te.data,F=Pe.stride,Mt=Te.offset;if(Pe.isInstancedInterleavedBuffer){for(let _e=0;_e<se.locationSize;_e++)C(se.location+_e,Pe.meshPerAttribute);L.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=Pe.meshPerAttribute*Pe.count)}else for(let _e=0;_e<se.locationSize;_e++)S(se.location+_e);i.bindBuffer(i.ARRAY_BUFFER,ve);for(let _e=0;_e<se.locationSize;_e++)A(se.location+_e,Z/se.locationSize,Me,H,F*ue,(Mt+Z/se.locationSize*_e)*ue,Ve)}else{if(Te.isInstancedBufferAttribute){for(let Pe=0;Pe<se.locationSize;Pe++)C(se.location+Pe,Te.meshPerAttribute);L.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=Te.meshPerAttribute*Te.count)}else for(let Pe=0;Pe<se.locationSize;Pe++)S(se.location+Pe);i.bindBuffer(i.ARRAY_BUFFER,ve);for(let Pe=0;Pe<se.locationSize;Pe++)A(se.location+Pe,Z/se.locationSize,Me,H,Z*ue,Z/se.locationSize*Pe*ue,Ve)}}else if(Y!==void 0){const H=Y[ee];if(H!==void 0)switch(H.length){case 2:i.vertexAttrib2fv(se.location,H);break;case 3:i.vertexAttrib3fv(se.location,H);break;case 4:i.vertexAttrib4fv(se.location,H);break;default:i.vertexAttrib1fv(se.location,H)}}}}R()}function X(){G();for(const L in a){const U=a[L];for(const D in U){const W=U[D];for(const V in W)g(W[V].object),delete W[V];delete U[D]}delete a[L]}}function _(L){if(a[L.id]===void 0)return;const U=a[L.id];for(const D in U){const W=U[D];for(const V in W)g(W[V].object),delete W[V];delete U[D]}delete a[L.id]}function T(L){for(const U in a){const D=a[U];if(D[L.id]===void 0)continue;const W=D[L.id];for(const V in W)g(W[V].object),delete W[V];delete D[L.id]}}function G(){j(),l=!0,h!==c&&(h=c,m(h.object))}function j(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:d,reset:G,resetDefaultState:j,dispose:X,releaseStatesOfGeometry:_,releaseStatesOfProgram:T,initAttributes:M,enableAttribute:S,disableUnusedAttributes:R}}function _m(i,e,t,n){const s=n.isWebGL2;let r;function o(l){r=l}function a(l,d){i.drawArrays(r,l,d),t.update(d,r,1)}function c(l,d,u){if(u===0)return;let m,g;if(s)m=i,g="drawArraysInstanced";else if(m=e.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",m===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[g](r,l,d,u),t.update(d,r,u)}function h(l,d,u){if(u===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<u;g++)this.render(l[g],d[g]);else{m.multiDrawArraysWEBGL(r,l,0,d,0,u);let g=0;for(let x=0;x<u;x++)g+=d[x];t.update(g,r,1)}}this.setMode=o,this.render=a,this.renderInstances=c,this.renderMultiDraw=h}function xm(i,e,t){let n;function s(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");n=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let a=t.precision!==void 0?t.precision:"highp";const c=r(a);c!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",c,"instead."),a=c);const h=o||e.has("WEBGL_draw_buffers"),l=t.logarithmicDepthBuffer===!0,d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),u=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),x=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),f=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),M=u>0,S=o||e.has("OES_texture_float"),C=M&&S,R=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:h,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:l,maxTextures:d,maxVertexTextures:u,maxTextureSize:m,maxCubemapSize:g,maxAttributes:x,maxVertexUniforms:p,maxVaryings:f,maxFragmentUniforms:y,vertexTextures:M,floatFragmentTextures:S,floatVertexTextures:C,maxSamples:R}}function vm(i){const e=this;let t=null,n=0,s=!1,r=!1;const o=new Cn,a=new Oe,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const m=d.length!==0||u||n!==0||s;return s=u,n=d.length,m},this.beginShadows=function(){r=!0,l(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){t=l(d,u,0)},this.setState=function(d,u,m){const g=d.clippingPlanes,x=d.clipIntersection,p=d.clipShadows,f=i.get(d);if(!s||g===null||g.length===0||r&&!p)r?l(null):h();else{const y=r?0:n,M=y*4;let S=f.clippingState||null;c.value=S,S=l(g,u,M,m);for(let C=0;C!==M;++C)S[C]=t[C];f.clippingState=S,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=y}};function h(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function l(d,u,m,g){const x=d!==null?d.length:0;let p=null;if(x!==0){if(p=c.value,g!==!0||p===null){const f=m+x*4,y=u.matrixWorldInverse;a.getNormalMatrix(y),(p===null||p.length<f)&&(p=new Float32Array(f));for(let M=0,S=m;M!==x;++M,S+=4)o.copy(d[M]).applyMatrix4(y,a),o.normal.toArray(p,S),p[S+3]=o.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,p}}function Mm(i){let e=new WeakMap;function t(o,a){return a===la?o.mapping=Di:a===ha&&(o.mapping=Ii),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===la||a===ha)if(e.has(o)){const c=e.get(o).texture;return t(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const h=new Lu(c.height);return h.fromEquirectangularTexture(i,o),e.set(o,h),o.addEventListener("dispose",s),t(h.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class pl extends dl{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,l=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,o=r+h*this.view.width,a-=l*this.view.offsetY,c=a-l*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Ei=4,qo=[.125,.215,.35,.446,.526,.582],qn=20,kr=new pl,Yo=new Re;let Gr=null,Hr=0,Vr=0;const Wn=(1+Math.sqrt(5))/2,xi=1/Wn,jo=[new P(1,1,1),new P(-1,1,1),new P(1,1,-1),new P(-1,1,-1),new P(0,Wn,xi),new P(0,Wn,-xi),new P(xi,0,Wn),new P(-xi,0,Wn),new P(Wn,xi,0),new P(-Wn,xi,0)];class $o{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){Gr=this._renderer.getRenderTarget(),Hr=this._renderer.getActiveCubeFace(),Vr=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Jo(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Zo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Gr,Hr,Vr),e.scissorTest=!1,Os(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Di||e.mapping===Ii?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Gr=this._renderer.getRenderTarget(),Hr=this._renderer.getActiveCubeFace(),Vr=this._renderer.getActiveMipmapLevel();const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ut,minFilter:Ut,generateMipmaps:!1,type:as,format:Zt,colorSpace:Sn,depthBuffer:!1},s=Ko(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ko(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=ym(r)),this._blurMaterial=Sm(r,e,t)}return s}_compileMaterial(e){const t=new he(this._lodPlanes[0],e);this._renderer.compile(t,kr)}_sceneToCubeUV(e,t,n,s){const a=new Bt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],l=this._renderer,d=l.autoClear,u=l.toneMapping;l.getClearColor(Yo),l.toneMapping=In,l.autoClear=!1;const m=new en({name:"PMREM.Background",side:Ft,depthWrite:!1,depthTest:!1}),g=new he(new Vt,m);let x=!1;const p=e.background;p?p.isColor&&(m.color.copy(p),e.background=null,x=!0):(m.color.copy(Yo),x=!0);for(let f=0;f<6;f++){const y=f%3;y===0?(a.up.set(0,c[f],0),a.lookAt(h[f],0,0)):y===1?(a.up.set(0,0,c[f]),a.lookAt(0,h[f],0)):(a.up.set(0,c[f],0),a.lookAt(0,0,h[f]));const M=this._cubeSize;Os(s,y*M,f>2?M:0,M,M),l.setRenderTarget(s),x&&l.render(g,a),l.render(e,a)}g.geometry.dispose(),g.material.dispose(),l.toneMapping=u,l.autoClear=d,e.background=p}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Di||e.mapping===Ii;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Jo()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Zo());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new he(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const c=this._cubeSize;Os(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,kr)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=jo[(s-1)%jo.length];this._blur(e,s-1,s,r,o)}t.autoClear=n}_blur(e,t,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){const c=this._renderer,h=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const l=3,d=new he(this._lodPlanes[s],h),u=h.uniforms,m=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*qn-1),x=r/g,p=isFinite(r)?1+Math.floor(l*x):qn;p>qn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${qn}`);const f=[];let y=0;for(let A=0;A<qn;++A){const N=A/x,X=Math.exp(-N*N/2);f.push(X),A===0?y+=X:A<p&&(y+=2*X)}for(let A=0;A<f.length;A++)f[A]=f[A]/y;u.envMap.value=e.texture,u.samples.value=p,u.weights.value=f,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);const{_lodMax:M}=this;u.dTheta.value=g,u.mipInt.value=M-n;const S=this._sizeLods[s],C=3*S*(s>M-Ei?s-M+Ei:0),R=4*(this._cubeSize-S);Os(t,C,R,3*S,2*S),c.setRenderTarget(t),c.render(d,kr)}}function ym(i){const e=[],t=[],n=[];let s=i;const r=i-Ei+1+qo.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);t.push(a);let c=1/a;o>i-Ei?c=qo[o-i+Ei-1]:o===0&&(c=0),n.push(c);const h=1/(a-2),l=-h,d=1+h,u=[l,l,d,l,d,d,l,l,d,d,l,d],m=6,g=6,x=3,p=2,f=1,y=new Float32Array(x*g*m),M=new Float32Array(p*g*m),S=new Float32Array(f*g*m);for(let R=0;R<m;R++){const A=R%3*2/3-1,N=R>2?0:-1,X=[A,N,0,A+2/3,N,0,A+2/3,N+1,0,A,N,0,A+2/3,N+1,0,A,N+1,0];y.set(X,x*g*R),M.set(u,p*g*R);const _=[R,R,R,R,R,R];S.set(_,f*g*R)}const C=new ft;C.setAttribute("position",new Et(y,x)),C.setAttribute("uv",new Et(M,p)),C.setAttribute("faceIndex",new Et(S,f)),e.push(C),s>Ei&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Ko(i,e,t){const n=new ei(i,e,t);return n.texture.mapping=or,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Os(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Sm(i,e,t){const n=new Float32Array(qn),s=new P(0,1,0);return new Nn({name:"SphericalGaussianBlur",defines:{n:qn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ca(),fragmentShader:`

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
		`,blending:Dn,depthTest:!1,depthWrite:!1})}function Zo(){return new Nn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ca(),fragmentShader:`

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
		`,blending:Dn,depthTest:!1,depthWrite:!1})}function Jo(){return new Nn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ca(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Dn,depthTest:!1,depthWrite:!1})}function Ca(){return`

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
	`}function bm(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const c=a.mapping,h=c===la||c===ha,l=c===Di||c===Ii;if(h||l)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let d=e.get(a);return t===null&&(t=new $o(i)),d=h?t.fromEquirectangular(a,d):t.fromCubemap(a,d),e.set(a,d),d.texture}else{if(e.has(a))return e.get(a).texture;{const d=a.image;if(h&&d&&d.height>0||l&&d&&s(d)){t===null&&(t=new $o(i));const u=h?t.fromEquirectangular(a):t.fromCubemap(a);return e.set(a,u),a.addEventListener("dispose",r),u.texture}else return null}}}return a}function s(a){let c=0;const h=6;for(let l=0;l<h;l++)a[l]!==void 0&&c++;return c===h}function r(a){const c=a.target;c.removeEventListener("dispose",r);const h=e.get(c);h!==void 0&&(e.delete(c),h.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function Em(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){const s=t(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Tm(i,e,t,n){const s={},r=new WeakMap;function o(d){const u=d.target;u.index!==null&&e.remove(u.index);for(const g in u.attributes)e.remove(u.attributes[g]);for(const g in u.morphAttributes){const x=u.morphAttributes[g];for(let p=0,f=x.length;p<f;p++)e.remove(x[p])}u.removeEventListener("dispose",o),delete s[u.id];const m=r.get(u);m&&(e.remove(m),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function a(d,u){return s[u.id]===!0||(u.addEventListener("dispose",o),s[u.id]=!0,t.memory.geometries++),u}function c(d){const u=d.attributes;for(const g in u)e.update(u[g],i.ARRAY_BUFFER);const m=d.morphAttributes;for(const g in m){const x=m[g];for(let p=0,f=x.length;p<f;p++)e.update(x[p],i.ARRAY_BUFFER)}}function h(d){const u=[],m=d.index,g=d.attributes.position;let x=0;if(m!==null){const y=m.array;x=m.version;for(let M=0,S=y.length;M<S;M+=3){const C=y[M+0],R=y[M+1],A=y[M+2];u.push(C,R,R,A,A,C)}}else if(g!==void 0){const y=g.array;x=g.version;for(let M=0,S=y.length/3-1;M<S;M+=3){const C=M+0,R=M+1,A=M+2;u.push(C,R,R,A,A,C)}}else return;const p=new(il(u)?ll:cl)(u,1);p.version=x;const f=r.get(d);f&&e.remove(f),r.set(d,p)}function l(d){const u=r.get(d);if(u){const m=d.index;m!==null&&u.version<m.version&&h(d)}else h(d);return r.get(d)}return{get:a,update:c,getWireframeAttribute:l}}function wm(i,e,t,n){const s=n.isWebGL2;let r;function o(m){r=m}let a,c;function h(m){a=m.type,c=m.bytesPerElement}function l(m,g){i.drawElements(r,g,a,m*c),t.update(g,r,1)}function d(m,g,x){if(x===0)return;let p,f;if(s)p=i,f="drawElementsInstanced";else if(p=e.get("ANGLE_instanced_arrays"),f="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[f](r,g,a,m*c,x),t.update(g,r,x)}function u(m,g,x){if(x===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let f=0;f<x;f++)this.render(m[f]/c,g[f]);else{p.multiDrawElementsWEBGL(r,g,0,a,m,0,x);let f=0;for(let y=0;y<x;y++)f+=g[y];t.update(f,r,1)}}this.setMode=o,this.setIndex=h,this.render=l,this.renderInstances=d,this.renderMultiDraw=u}function Am(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Rm(i,e){return i[0]-e[0]}function Cm(i,e){return Math.abs(e[1])-Math.abs(i[1])}function Pm(i,e,t){const n={},s=new Float32Array(8),r=new WeakMap,o=new it,a=[];for(let h=0;h<8;h++)a[h]=[h,0];function c(h,l,d){const u=h.morphTargetInfluences;if(e.isWebGL2===!0){const g=l.morphAttributes.position||l.morphAttributes.normal||l.morphAttributes.color,x=g!==void 0?g.length:0;let p=r.get(l);if(p===void 0||p.count!==x){let U=function(){j.dispose(),r.delete(l),l.removeEventListener("dispose",U)};var m=U;p!==void 0&&p.texture.dispose();const M=l.morphAttributes.position!==void 0,S=l.morphAttributes.normal!==void 0,C=l.morphAttributes.color!==void 0,R=l.morphAttributes.position||[],A=l.morphAttributes.normal||[],N=l.morphAttributes.color||[];let X=0;M===!0&&(X=1),S===!0&&(X=2),C===!0&&(X=3);let _=l.attributes.position.count*X,T=1;_>e.maxTextureSize&&(T=Math.ceil(_/e.maxTextureSize),_=e.maxTextureSize);const G=new Float32Array(_*T*4*x),j=new al(G,_,T,x);j.type=vn,j.needsUpdate=!0;const L=X*4;for(let D=0;D<x;D++){const W=R[D],V=A[D],q=N[D],Y=_*T*4*D;for(let ee=0;ee<W.count;ee++){const se=ee*L;M===!0&&(o.fromBufferAttribute(W,ee),G[Y+se+0]=o.x,G[Y+se+1]=o.y,G[Y+se+2]=o.z,G[Y+se+3]=0),S===!0&&(o.fromBufferAttribute(V,ee),G[Y+se+4]=o.x,G[Y+se+5]=o.y,G[Y+se+6]=o.z,G[Y+se+7]=0),C===!0&&(o.fromBufferAttribute(q,ee),G[Y+se+8]=o.x,G[Y+se+9]=o.y,G[Y+se+10]=o.z,G[Y+se+11]=q.itemSize===4?o.w:1)}}p={count:x,texture:j,size:new Se(_,T)},r.set(l,p),l.addEventListener("dispose",U)}let f=0;for(let M=0;M<u.length;M++)f+=u[M];const y=l.morphTargetsRelative?1:1-f;d.getUniforms().setValue(i,"morphTargetBaseInfluence",y),d.getUniforms().setValue(i,"morphTargetInfluences",u),d.getUniforms().setValue(i,"morphTargetsTexture",p.texture,t),d.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}else{const g=u===void 0?0:u.length;let x=n[l.id];if(x===void 0||x.length!==g){x=[];for(let S=0;S<g;S++)x[S]=[S,0];n[l.id]=x}for(let S=0;S<g;S++){const C=x[S];C[0]=S,C[1]=u[S]}x.sort(Cm);for(let S=0;S<8;S++)S<g&&x[S][1]?(a[S][0]=x[S][0],a[S][1]=x[S][1]):(a[S][0]=Number.MAX_SAFE_INTEGER,a[S][1]=0);a.sort(Rm);const p=l.morphAttributes.position,f=l.morphAttributes.normal;let y=0;for(let S=0;S<8;S++){const C=a[S],R=C[0],A=C[1];R!==Number.MAX_SAFE_INTEGER&&A?(p&&l.getAttribute("morphTarget"+S)!==p[R]&&l.setAttribute("morphTarget"+S,p[R]),f&&l.getAttribute("morphNormal"+S)!==f[R]&&l.setAttribute("morphNormal"+S,f[R]),s[S]=A,y+=A):(p&&l.hasAttribute("morphTarget"+S)===!0&&l.deleteAttribute("morphTarget"+S),f&&l.hasAttribute("morphNormal"+S)===!0&&l.deleteAttribute("morphNormal"+S),s[S]=0)}const M=l.morphTargetsRelative?1:1-y;d.getUniforms().setValue(i,"morphTargetBaseInfluence",M),d.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:c}}function Lm(i,e,t,n){let s=new WeakMap;function r(c){const h=n.render.frame,l=c.geometry,d=e.get(c,l);if(s.get(d)!==h&&(e.update(d),s.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const u=c.skeleton;s.get(u)!==h&&(u.update(),s.set(u,h))}return d}function o(){s=new WeakMap}function a(c){const h=c.target;h.removeEventListener("dispose",a),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:r,dispose:o}}class ml extends It{constructor(e,t,n,s,r,o,a,c,h,l){if(l=l!==void 0?l:Kn,l!==Kn&&l!==Ui)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&l===Kn&&(n=Ln),n===void 0&&l===Ui&&(n=$n),super(null,s,r,o,a,c,l,n,h),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Lt,this.minFilter=c!==void 0?c:Lt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const gl=new It,_l=new ml(1,1);_l.compareFunction=nl;const xl=new al,vl=new pu,Ml=new ul,Qo=[],ec=[],tc=new Float32Array(16),nc=new Float32Array(9),ic=new Float32Array(4);function ki(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=Qo[s];if(r===void 0&&(r=new Float32Array(s),Qo[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function pt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function mt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function dr(i,e){let t=ec[e];t===void 0&&(t=new Int32Array(e),ec[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Dm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Im(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(pt(t,e))return;i.uniform2fv(this.addr,e),mt(t,e)}}function Um(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(pt(t,e))return;i.uniform3fv(this.addr,e),mt(t,e)}}function Fm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(pt(t,e))return;i.uniform4fv(this.addr,e),mt(t,e)}}function Nm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(pt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),mt(t,e)}else{if(pt(t,n))return;ic.set(n),i.uniformMatrix2fv(this.addr,!1,ic),mt(t,n)}}function zm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(pt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),mt(t,e)}else{if(pt(t,n))return;nc.set(n),i.uniformMatrix3fv(this.addr,!1,nc),mt(t,n)}}function Om(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(pt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),mt(t,e)}else{if(pt(t,n))return;tc.set(n),i.uniformMatrix4fv(this.addr,!1,tc),mt(t,n)}}function Bm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function km(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(pt(t,e))return;i.uniform2iv(this.addr,e),mt(t,e)}}function Gm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(pt(t,e))return;i.uniform3iv(this.addr,e),mt(t,e)}}function Hm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(pt(t,e))return;i.uniform4iv(this.addr,e),mt(t,e)}}function Vm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Wm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(pt(t,e))return;i.uniform2uiv(this.addr,e),mt(t,e)}}function Xm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(pt(t,e))return;i.uniform3uiv(this.addr,e),mt(t,e)}}function qm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(pt(t,e))return;i.uniform4uiv(this.addr,e),mt(t,e)}}function Ym(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const r=this.type===i.SAMPLER_2D_SHADOW?_l:gl;t.setTexture2D(e||r,s)}function jm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||vl,s)}function $m(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Ml,s)}function Km(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||xl,s)}function Zm(i){switch(i){case 5126:return Dm;case 35664:return Im;case 35665:return Um;case 35666:return Fm;case 35674:return Nm;case 35675:return zm;case 35676:return Om;case 5124:case 35670:return Bm;case 35667:case 35671:return km;case 35668:case 35672:return Gm;case 35669:case 35673:return Hm;case 5125:return Vm;case 36294:return Wm;case 36295:return Xm;case 36296:return qm;case 35678:case 36198:case 36298:case 36306:case 35682:return Ym;case 35679:case 36299:case 36307:return jm;case 35680:case 36300:case 36308:case 36293:return $m;case 36289:case 36303:case 36311:case 36292:return Km}}function Jm(i,e){i.uniform1fv(this.addr,e)}function Qm(i,e){const t=ki(e,this.size,2);i.uniform2fv(this.addr,t)}function e0(i,e){const t=ki(e,this.size,3);i.uniform3fv(this.addr,t)}function t0(i,e){const t=ki(e,this.size,4);i.uniform4fv(this.addr,t)}function n0(i,e){const t=ki(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function i0(i,e){const t=ki(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function s0(i,e){const t=ki(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function r0(i,e){i.uniform1iv(this.addr,e)}function a0(i,e){i.uniform2iv(this.addr,e)}function o0(i,e){i.uniform3iv(this.addr,e)}function c0(i,e){i.uniform4iv(this.addr,e)}function l0(i,e){i.uniform1uiv(this.addr,e)}function h0(i,e){i.uniform2uiv(this.addr,e)}function d0(i,e){i.uniform3uiv(this.addr,e)}function u0(i,e){i.uniform4uiv(this.addr,e)}function f0(i,e,t){const n=this.cache,s=e.length,r=dr(t,s);pt(n,r)||(i.uniform1iv(this.addr,r),mt(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||gl,r[o])}function p0(i,e,t){const n=this.cache,s=e.length,r=dr(t,s);pt(n,r)||(i.uniform1iv(this.addr,r),mt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||vl,r[o])}function m0(i,e,t){const n=this.cache,s=e.length,r=dr(t,s);pt(n,r)||(i.uniform1iv(this.addr,r),mt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Ml,r[o])}function g0(i,e,t){const n=this.cache,s=e.length,r=dr(t,s);pt(n,r)||(i.uniform1iv(this.addr,r),mt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||xl,r[o])}function _0(i){switch(i){case 5126:return Jm;case 35664:return Qm;case 35665:return e0;case 35666:return t0;case 35674:return n0;case 35675:return i0;case 35676:return s0;case 5124:case 35670:return r0;case 35667:case 35671:return a0;case 35668:case 35672:return o0;case 35669:case 35673:return c0;case 5125:return l0;case 36294:return h0;case 36295:return d0;case 36296:return u0;case 35678:case 36198:case 36298:case 36306:case 35682:return f0;case 35679:case 36299:case 36307:return p0;case 35680:case 36300:case 36308:case 36293:return m0;case 36289:case 36303:case 36311:case 36292:return g0}}class x0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Zm(t.type)}}class v0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=_0(t.type)}}class M0{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(e,t[a.id],n)}}}const Wr=/(\w+)(\])?(\[|\.)?/g;function sc(i,e){i.seq.push(e),i.map[e.id]=e}function y0(i,e,t){const n=i.name,s=n.length;for(Wr.lastIndex=0;;){const r=Wr.exec(n),o=Wr.lastIndex;let a=r[1];const c=r[2]==="]",h=r[3];if(c&&(a=a|0),h===void 0||h==="["&&o+2===s){sc(t,h===void 0?new x0(a,i,e):new v0(a,i,e));break}else{let d=t.map[a];d===void 0&&(d=new M0(a),sc(t,d)),t=d}}}class Ys{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);y0(r,o,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){const a=t[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const o=e[s];o.id in t&&n.push(o)}return n}}function rc(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const S0=37297;let b0=0;function E0(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function T0(i){const e=je.getPrimaries(je.workingColorSpace),t=je.getPrimaries(i);let n;switch(e===t?n="":e===Qs&&t===Js?n="LinearDisplayP3ToLinearSRGB":e===Js&&t===Qs&&(n="LinearSRGBToLinearDisplayP3"),i){case Sn:case cr:return[n,"LinearTransferOETF"];case dt:case Ta:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function ac(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+E0(i.getShaderSource(e),o)}else return s}function w0(i,e){const t=T0(e);return`vec4 ${i}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function A0(i,e){let t;switch(e){case wd:t="Linear";break;case Ad:t="Reinhard";break;case Rd:t="OptimizedCineon";break;case Xc:t="ACESFilmic";break;case Pd:t="AgX";break;case Cd:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function R0(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.alphaToCoverage||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Ti).join(`
`)}function C0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ti).join(`
`)}function P0(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function L0(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Ti(i){return i!==""}function oc(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function cc(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const D0=/^[ \t]*#include +<([\w\d./]+)>/gm;function ga(i){return i.replace(D0,U0)}const I0=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function U0(i,e){let t=Ue[e];if(t===void 0){const n=I0.get(e);if(n!==void 0)t=Ue[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return ga(t)}const F0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function lc(i){return i.replace(F0,N0)}function N0(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function hc(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function z0(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Hc?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Vc?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===gn&&(e="SHADOWMAP_TYPE_VSM"),e}function O0(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Di:case Ii:e="ENVMAP_TYPE_CUBE";break;case or:e="ENVMAP_TYPE_CUBE_UV";break}return e}function B0(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ii:e="ENVMAP_MODE_REFRACTION";break}return e}function k0(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Wc:e="ENVMAP_BLENDING_MULTIPLY";break;case Ed:e="ENVMAP_BLENDING_MIX";break;case Td:e="ENVMAP_BLENDING_ADD";break}return e}function G0(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function H0(i,e,t,n){const s=i.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const c=z0(t),h=O0(t),l=B0(t),d=k0(t),u=G0(t),m=t.isWebGL2?"":R0(t),g=C0(t),x=P0(r),p=s.createProgram();let f,y,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Ti).join(`
`),f.length>0&&(f+=`
`),y=[m,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Ti).join(`
`),y.length>0&&(y+=`
`)):(f=[hc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ti).join(`
`),y=[m,hc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+l:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==In?"#define TONE_MAPPING":"",t.toneMapping!==In?Ue.tonemapping_pars_fragment:"",t.toneMapping!==In?A0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ue.colorspace_pars_fragment,w0("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ti).join(`
`)),o=ga(o),o=oc(o,t),o=cc(o,t),a=ga(a),a=oc(a,t),a=cc(a,t),o=lc(o),a=lc(a),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,f=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,y=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===wo?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===wo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const S=M+f+o,C=M+y+a,R=rc(s,s.VERTEX_SHADER,S),A=rc(s,s.FRAGMENT_SHADER,C);s.attachShader(p,R),s.attachShader(p,A),t.index0AttributeName!==void 0?s.bindAttribLocation(p,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function N(G){if(i.debug.checkShaderErrors){const j=s.getProgramInfoLog(p).trim(),L=s.getShaderInfoLog(R).trim(),U=s.getShaderInfoLog(A).trim();let D=!0,W=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(D=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,p,R,A);else{const V=ac(s,R,"vertex"),q=ac(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Material Name: `+G.name+`
Material Type: `+G.type+`

Program Info Log: `+j+`
`+V+`
`+q)}else j!==""?console.warn("THREE.WebGLProgram: Program Info Log:",j):(L===""||U==="")&&(W=!1);W&&(G.diagnostics={runnable:D,programLog:j,vertexShader:{log:L,prefix:f},fragmentShader:{log:U,prefix:y}})}s.deleteShader(R),s.deleteShader(A),X=new Ys(s,p),_=L0(s,p)}let X;this.getUniforms=function(){return X===void 0&&N(this),X};let _;this.getAttributes=function(){return _===void 0&&N(this),_};let T=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return T===!1&&(T=s.getProgramParameter(p,S0)),T},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=b0++,this.cacheKey=e,this.usedTimes=1,this.program=p,this.vertexShader=R,this.fragmentShader=A,this}let V0=0;class W0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new X0(e),t.set(e,n)),n}}class X0{constructor(e){this.id=V0++,this.code=e,this.usedTimes=0}}function q0(i,e,t,n,s,r,o){const a=new Aa,c=new W0,h=new Set,l=[],d=s.isWebGL2,u=s.logarithmicDepthBuffer,m=s.vertexTextures;let g=s.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(_){return h.add(_),_===0?"uv":`uv${_}`}function f(_,T,G,j,L){const U=j.fog,D=L.geometry,W=_.isMeshStandardMaterial?j.environment:null,V=(_.isMeshStandardMaterial?t:e).get(_.envMap||W),q=V&&V.mapping===or?V.image.height:null,Y=x[_.type];_.precision!==null&&(g=s.getMaxPrecision(_.precision),g!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",g,"instead."));const ee=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,se=ee!==void 0?ee.length:0;let Te=0;D.morphAttributes.position!==void 0&&(Te=1),D.morphAttributes.normal!==void 0&&(Te=2),D.morphAttributes.color!==void 0&&(Te=3);let H,Z,oe,ve;if(Y){const Ze=on[Y];H=Ze.vertexShader,Z=Ze.fragmentShader}else H=_.vertexShader,Z=_.fragmentShader,c.update(_),oe=c.getVertexShaderID(_),ve=c.getFragmentShaderID(_);const Me=i.getRenderTarget(),ue=L.isInstancedMesh===!0,Ve=L.isBatchedMesh===!0,Pe=!!_.map,F=!!_.matcap,Mt=!!V,_e=!!_.aoMap,we=!!_.lightMap,me=!!_.bumpMap,st=!!_.normalMap,De=!!_.displacementMap,E=!!_.emissiveMap,v=!!_.metalnessMap,z=!!_.roughnessMap,Q=_.anisotropy>0,$=_.clearcoat>0,J=_.iridescence>0,fe=_.sheen>0,re=_.transmission>0,ce=Q&&!!_.anisotropyMap,be=$&&!!_.clearcoatMap,Fe=$&&!!_.clearcoatNormalMap,K=$&&!!_.clearcoatRoughnessMap,Ye=J&&!!_.iridescenceMap,Be=J&&!!_.iridescenceThicknessMap,Ae=fe&&!!_.sheenColorMap,ge=fe&&!!_.sheenRoughnessMap,le=!!_.specularMap,Ie=!!_.specularColorMap,We=!!_.specularIntensityMap,tt=re&&!!_.transmissionMap,ke=re&&!!_.thicknessMap,Ke=!!_.gradientMap,w=!!_.alphaMap,te=_.alphaTest>0,ne=!!_.alphaHash,de=!!_.extensions;let xe=In;_.toneMapped&&(Me===null||Me.isXRRenderTarget===!0)&&(xe=i.toneMapping);const Xe={isWebGL2:d,shaderID:Y,shaderType:_.type,shaderName:_.name,vertexShader:H,fragmentShader:Z,defines:_.defines,customVertexShaderID:oe,customFragmentShaderID:ve,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:g,batching:Ve,instancing:ue,instancingColor:ue&&L.instanceColor!==null,supportsVertexTextures:m,outputColorSpace:Me===null?i.outputColorSpace:Me.isXRRenderTarget===!0?Me.texture.colorSpace:Sn,alphaToCoverage:!!_.alphaToCoverage,map:Pe,matcap:F,envMap:Mt,envMapMode:Mt&&V.mapping,envMapCubeUVHeight:q,aoMap:_e,lightMap:we,bumpMap:me,normalMap:st,displacementMap:m&&De,emissiveMap:E,normalMapObjectSpace:st&&_.normalMapType===Gd,normalMapTangentSpace:st&&_.normalMapType===tl,metalnessMap:v,roughnessMap:z,anisotropy:Q,anisotropyMap:ce,clearcoat:$,clearcoatMap:be,clearcoatNormalMap:Fe,clearcoatRoughnessMap:K,iridescence:J,iridescenceMap:Ye,iridescenceThicknessMap:Be,sheen:fe,sheenColorMap:Ae,sheenRoughnessMap:ge,specularMap:le,specularColorMap:Ie,specularIntensityMap:We,transmission:re,transmissionMap:tt,thicknessMap:ke,gradientMap:Ke,opaque:_.transparent===!1&&_.blending===Ai&&_.alphaToCoverage===!1,alphaMap:w,alphaTest:te,alphaHash:ne,combine:_.combine,mapUv:Pe&&p(_.map.channel),aoMapUv:_e&&p(_.aoMap.channel),lightMapUv:we&&p(_.lightMap.channel),bumpMapUv:me&&p(_.bumpMap.channel),normalMapUv:st&&p(_.normalMap.channel),displacementMapUv:De&&p(_.displacementMap.channel),emissiveMapUv:E&&p(_.emissiveMap.channel),metalnessMapUv:v&&p(_.metalnessMap.channel),roughnessMapUv:z&&p(_.roughnessMap.channel),anisotropyMapUv:ce&&p(_.anisotropyMap.channel),clearcoatMapUv:be&&p(_.clearcoatMap.channel),clearcoatNormalMapUv:Fe&&p(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:K&&p(_.clearcoatRoughnessMap.channel),iridescenceMapUv:Ye&&p(_.iridescenceMap.channel),iridescenceThicknessMapUv:Be&&p(_.iridescenceThicknessMap.channel),sheenColorMapUv:Ae&&p(_.sheenColorMap.channel),sheenRoughnessMapUv:ge&&p(_.sheenRoughnessMap.channel),specularMapUv:le&&p(_.specularMap.channel),specularColorMapUv:Ie&&p(_.specularColorMap.channel),specularIntensityMapUv:We&&p(_.specularIntensityMap.channel),transmissionMapUv:tt&&p(_.transmissionMap.channel),thicknessMapUv:ke&&p(_.thicknessMap.channel),alphaMapUv:w&&p(_.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(st||Q),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!D.attributes.uv&&(Pe||w),fog:!!U,useFog:_.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:_.flatShading===!0,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:L.isSkinnedMesh===!0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:se,morphTextureStride:Te,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&G.length>0,shadowMapType:i.shadowMap.type,toneMapping:xe,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Pe&&_.map.isVideoTexture===!0&&je.getTransfer(_.map.colorSpace)===nt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===bt,flipSided:_.side===Ft,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionDerivatives:de&&_.extensions.derivatives===!0,extensionFragDepth:de&&_.extensions.fragDepth===!0,extensionDrawBuffers:de&&_.extensions.drawBuffers===!0,extensionShaderTextureLOD:de&&_.extensions.shaderTextureLOD===!0,extensionClipCullDistance:de&&_.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:de&&_.extensions.multiDraw===!0&&n.has("WEBGL_multi_draw"),rendererExtensionFragDepth:d||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:d||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:d||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Xe.vertexUv1s=h.has(1),Xe.vertexUv2s=h.has(2),Xe.vertexUv3s=h.has(3),h.clear(),Xe}function y(_){const T=[];if(_.shaderID?T.push(_.shaderID):(T.push(_.customVertexShaderID),T.push(_.customFragmentShaderID)),_.defines!==void 0)for(const G in _.defines)T.push(G),T.push(_.defines[G]);return _.isRawShaderMaterial===!1&&(M(T,_),S(T,_),T.push(i.outputColorSpace)),T.push(_.customProgramCacheKey),T.join()}function M(_,T){_.push(T.precision),_.push(T.outputColorSpace),_.push(T.envMapMode),_.push(T.envMapCubeUVHeight),_.push(T.mapUv),_.push(T.alphaMapUv),_.push(T.lightMapUv),_.push(T.aoMapUv),_.push(T.bumpMapUv),_.push(T.normalMapUv),_.push(T.displacementMapUv),_.push(T.emissiveMapUv),_.push(T.metalnessMapUv),_.push(T.roughnessMapUv),_.push(T.anisotropyMapUv),_.push(T.clearcoatMapUv),_.push(T.clearcoatNormalMapUv),_.push(T.clearcoatRoughnessMapUv),_.push(T.iridescenceMapUv),_.push(T.iridescenceThicknessMapUv),_.push(T.sheenColorMapUv),_.push(T.sheenRoughnessMapUv),_.push(T.specularMapUv),_.push(T.specularColorMapUv),_.push(T.specularIntensityMapUv),_.push(T.transmissionMapUv),_.push(T.thicknessMapUv),_.push(T.combine),_.push(T.fogExp2),_.push(T.sizeAttenuation),_.push(T.morphTargetsCount),_.push(T.morphAttributeCount),_.push(T.numDirLights),_.push(T.numPointLights),_.push(T.numSpotLights),_.push(T.numSpotLightMaps),_.push(T.numHemiLights),_.push(T.numRectAreaLights),_.push(T.numDirLightShadows),_.push(T.numPointLightShadows),_.push(T.numSpotLightShadows),_.push(T.numSpotLightShadowsWithMaps),_.push(T.numLightProbes),_.push(T.shadowMapType),_.push(T.toneMapping),_.push(T.numClippingPlanes),_.push(T.numClipIntersection),_.push(T.depthPacking)}function S(_,T){a.disableAll(),T.isWebGL2&&a.enable(0),T.supportsVertexTextures&&a.enable(1),T.instancing&&a.enable(2),T.instancingColor&&a.enable(3),T.matcap&&a.enable(4),T.envMap&&a.enable(5),T.normalMapObjectSpace&&a.enable(6),T.normalMapTangentSpace&&a.enable(7),T.clearcoat&&a.enable(8),T.iridescence&&a.enable(9),T.alphaTest&&a.enable(10),T.vertexColors&&a.enable(11),T.vertexAlphas&&a.enable(12),T.vertexUv1s&&a.enable(13),T.vertexUv2s&&a.enable(14),T.vertexUv3s&&a.enable(15),T.vertexTangents&&a.enable(16),T.anisotropy&&a.enable(17),T.alphaHash&&a.enable(18),T.batching&&a.enable(19),_.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.skinning&&a.enable(4),T.morphTargets&&a.enable(5),T.morphNormals&&a.enable(6),T.morphColors&&a.enable(7),T.premultipliedAlpha&&a.enable(8),T.shadowMapEnabled&&a.enable(9),T.useLegacyLights&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),T.decodeVideoTexture&&a.enable(19),T.alphaToCoverage&&a.enable(20),_.push(a.mask)}function C(_){const T=x[_.type];let G;if(T){const j=on[T];G=Au.clone(j.uniforms)}else G=_.uniforms;return G}function R(_,T){let G;for(let j=0,L=l.length;j<L;j++){const U=l[j];if(U.cacheKey===T){G=U,++G.usedTimes;break}}return G===void 0&&(G=new H0(i,T,_,r),l.push(G)),G}function A(_){if(--_.usedTimes===0){const T=l.indexOf(_);l[T]=l[l.length-1],l.pop(),_.destroy()}}function N(_){c.remove(_)}function X(){c.dispose()}return{getParameters:f,getProgramCacheKey:y,getUniforms:C,acquireProgram:R,releaseProgram:A,releaseShaderCache:N,programs:l,dispose:X}}function Y0(){let i=new WeakMap;function e(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function t(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:e,remove:t,update:n,dispose:s}}function j0(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function dc(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function uc(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(d,u,m,g,x,p){let f=i[e];return f===void 0?(f={id:d.id,object:d,geometry:u,material:m,groupOrder:g,renderOrder:d.renderOrder,z:x,group:p},i[e]=f):(f.id=d.id,f.object=d,f.geometry=u,f.material=m,f.groupOrder=g,f.renderOrder=d.renderOrder,f.z=x,f.group=p),e++,f}function a(d,u,m,g,x,p){const f=o(d,u,m,g,x,p);m.transmission>0?n.push(f):m.transparent===!0?s.push(f):t.push(f)}function c(d,u,m,g,x,p){const f=o(d,u,m,g,x,p);m.transmission>0?n.unshift(f):m.transparent===!0?s.unshift(f):t.unshift(f)}function h(d,u){t.length>1&&t.sort(d||j0),n.length>1&&n.sort(u||dc),s.length>1&&s.sort(u||dc)}function l(){for(let d=e,u=i.length;d<u;d++){const m=i[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:l,sort:h}}function $0(){let i=new WeakMap;function e(n,s){const r=i.get(n);let o;return r===void 0?(o=new uc,i.set(n,[o])):s>=r.length?(o=new uc,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function K0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new Re};break;case"SpotLight":t={position:new P,direction:new P,color:new Re,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new Re,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new Re,groundColor:new Re};break;case"RectAreaLight":t={color:new Re,position:new P,halfWidth:new P,halfHeight:new P};break}return i[e.id]=t,t}}}function Z0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Se};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Se};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Se,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let J0=0;function Q0(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function eg(i,e){const t=new K0,n=Z0(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)s.probe.push(new P);const r=new P,o=new Qe,a=new Qe;function c(l,d){let u=0,m=0,g=0;for(let G=0;G<9;G++)s.probe[G].set(0,0,0);let x=0,p=0,f=0,y=0,M=0,S=0,C=0,R=0,A=0,N=0,X=0;l.sort(Q0);const _=d===!0?Math.PI:1;for(let G=0,j=l.length;G<j;G++){const L=l[G],U=L.color,D=L.intensity,W=L.distance,V=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)u+=U.r*D*_,m+=U.g*D*_,g+=U.b*D*_;else if(L.isLightProbe){for(let q=0;q<9;q++)s.probe[q].addScaledVector(L.sh.coefficients[q],D);X++}else if(L.isDirectionalLight){const q=t.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity*_),L.castShadow){const Y=L.shadow,ee=n.get(L);ee.shadowBias=Y.bias,ee.shadowNormalBias=Y.normalBias,ee.shadowRadius=Y.radius,ee.shadowMapSize=Y.mapSize,s.directionalShadow[x]=ee,s.directionalShadowMap[x]=V,s.directionalShadowMatrix[x]=L.shadow.matrix,S++}s.directional[x]=q,x++}else if(L.isSpotLight){const q=t.get(L);q.position.setFromMatrixPosition(L.matrixWorld),q.color.copy(U).multiplyScalar(D*_),q.distance=W,q.coneCos=Math.cos(L.angle),q.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),q.decay=L.decay,s.spot[f]=q;const Y=L.shadow;if(L.map&&(s.spotLightMap[A]=L.map,A++,Y.updateMatrices(L),L.castShadow&&N++),s.spotLightMatrix[f]=Y.matrix,L.castShadow){const ee=n.get(L);ee.shadowBias=Y.bias,ee.shadowNormalBias=Y.normalBias,ee.shadowRadius=Y.radius,ee.shadowMapSize=Y.mapSize,s.spotShadow[f]=ee,s.spotShadowMap[f]=V,R++}f++}else if(L.isRectAreaLight){const q=t.get(L);q.color.copy(U).multiplyScalar(D),q.halfWidth.set(L.width*.5,0,0),q.halfHeight.set(0,L.height*.5,0),s.rectArea[y]=q,y++}else if(L.isPointLight){const q=t.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity*_),q.distance=L.distance,q.decay=L.decay,L.castShadow){const Y=L.shadow,ee=n.get(L);ee.shadowBias=Y.bias,ee.shadowNormalBias=Y.normalBias,ee.shadowRadius=Y.radius,ee.shadowMapSize=Y.mapSize,ee.shadowCameraNear=Y.camera.near,ee.shadowCameraFar=Y.camera.far,s.pointShadow[p]=ee,s.pointShadowMap[p]=V,s.pointShadowMatrix[p]=L.shadow.matrix,C++}s.point[p]=q,p++}else if(L.isHemisphereLight){const q=t.get(L);q.skyColor.copy(L.color).multiplyScalar(D*_),q.groundColor.copy(L.groundColor).multiplyScalar(D*_),s.hemi[M]=q,M++}}y>0&&(e.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=ie.LTC_FLOAT_1,s.rectAreaLTC2=ie.LTC_FLOAT_2):(s.rectAreaLTC1=ie.LTC_HALF_1,s.rectAreaLTC2=ie.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=ie.LTC_FLOAT_1,s.rectAreaLTC2=ie.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=ie.LTC_HALF_1,s.rectAreaLTC2=ie.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=u,s.ambient[1]=m,s.ambient[2]=g;const T=s.hash;(T.directionalLength!==x||T.pointLength!==p||T.spotLength!==f||T.rectAreaLength!==y||T.hemiLength!==M||T.numDirectionalShadows!==S||T.numPointShadows!==C||T.numSpotShadows!==R||T.numSpotMaps!==A||T.numLightProbes!==X)&&(s.directional.length=x,s.spot.length=f,s.rectArea.length=y,s.point.length=p,s.hemi.length=M,s.directionalShadow.length=S,s.directionalShadowMap.length=S,s.pointShadow.length=C,s.pointShadowMap.length=C,s.spotShadow.length=R,s.spotShadowMap.length=R,s.directionalShadowMatrix.length=S,s.pointShadowMatrix.length=C,s.spotLightMatrix.length=R+A-N,s.spotLightMap.length=A,s.numSpotLightShadowsWithMaps=N,s.numLightProbes=X,T.directionalLength=x,T.pointLength=p,T.spotLength=f,T.rectAreaLength=y,T.hemiLength=M,T.numDirectionalShadows=S,T.numPointShadows=C,T.numSpotShadows=R,T.numSpotMaps=A,T.numLightProbes=X,s.version=J0++)}function h(l,d){let u=0,m=0,g=0,x=0,p=0;const f=d.matrixWorldInverse;for(let y=0,M=l.length;y<M;y++){const S=l[y];if(S.isDirectionalLight){const C=s.directional[u];C.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),C.direction.sub(r),C.direction.transformDirection(f),u++}else if(S.isSpotLight){const C=s.spot[g];C.position.setFromMatrixPosition(S.matrixWorld),C.position.applyMatrix4(f),C.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),C.direction.sub(r),C.direction.transformDirection(f),g++}else if(S.isRectAreaLight){const C=s.rectArea[x];C.position.setFromMatrixPosition(S.matrixWorld),C.position.applyMatrix4(f),a.identity(),o.copy(S.matrixWorld),o.premultiply(f),a.extractRotation(o),C.halfWidth.set(S.width*.5,0,0),C.halfHeight.set(0,S.height*.5,0),C.halfWidth.applyMatrix4(a),C.halfHeight.applyMatrix4(a),x++}else if(S.isPointLight){const C=s.point[m];C.position.setFromMatrixPosition(S.matrixWorld),C.position.applyMatrix4(f),m++}else if(S.isHemisphereLight){const C=s.hemi[p];C.direction.setFromMatrixPosition(S.matrixWorld),C.direction.transformDirection(f),p++}}}return{setup:c,setupView:h,state:s}}function fc(i,e){const t=new eg(i,e),n=[],s=[];function r(){n.length=0,s.length=0}function o(d){n.push(d)}function a(d){s.push(d)}function c(d){t.setup(n,d)}function h(d){t.setupView(n,d)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:t},setupLights:c,setupLightsView:h,pushLight:o,pushShadow:a}}function tg(i,e){let t=new WeakMap;function n(r,o=0){const a=t.get(r);let c;return a===void 0?(c=new fc(i,e),t.set(r,[c])):o>=a.length?(c=new fc(i,e),a.push(c)):c=a[o],c}function s(){t=new WeakMap}return{get:n,dispose:s}}class ng extends zn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Bd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class ig extends zn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const sg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,rg=`uniform sampler2D shadow_pass;
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
}`;function ag(i,e,t){let n=new Ra;const s=new Se,r=new Se,o=new it,a=new ng({depthPacking:kd}),c=new ig,h={},l=t.maxTextureSize,d={[Fn]:Ft,[Ft]:Fn,[bt]:bt},u=new Nn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Se},radius:{value:4}},vertexShader:sg,fragmentShader:rg}),m=u.clone();m.defines.HORIZONTAL_PASS=1;const g=new ft;g.setAttribute("position",new Et(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new he(g,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Hc;let f=this.type;this.render=function(R,A,N){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||R.length===0)return;const X=i.getRenderTarget(),_=i.getActiveCubeFace(),T=i.getActiveMipmapLevel(),G=i.state;G.setBlending(Dn),G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const j=f!==gn&&this.type===gn,L=f===gn&&this.type!==gn;for(let U=0,D=R.length;U<D;U++){const W=R[U],V=W.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",W,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const q=V.getFrameExtents();if(s.multiply(q),r.copy(V.mapSize),(s.x>l||s.y>l)&&(s.x>l&&(r.x=Math.floor(l/q.x),s.x=r.x*q.x,V.mapSize.x=r.x),s.y>l&&(r.y=Math.floor(l/q.y),s.y=r.y*q.y,V.mapSize.y=r.y)),V.map===null||j===!0||L===!0){const ee=this.type!==gn?{minFilter:Lt,magFilter:Lt}:{};V.map!==null&&V.map.dispose(),V.map=new ei(s.x,s.y,ee),V.map.texture.name=W.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const Y=V.getViewportCount();for(let ee=0;ee<Y;ee++){const se=V.getViewport(ee);o.set(r.x*se.x,r.y*se.y,r.x*se.z,r.y*se.w),G.viewport(o),V.updateMatrices(W,ee),n=V.getFrustum(),S(A,N,V.camera,W,this.type)}V.isPointLightShadow!==!0&&this.type===gn&&y(V,N),V.needsUpdate=!1}f=this.type,p.needsUpdate=!1,i.setRenderTarget(X,_,T)};function y(R,A){const N=e.update(x);u.defines.VSM_SAMPLES!==R.blurSamples&&(u.defines.VSM_SAMPLES=R.blurSamples,m.defines.VSM_SAMPLES=R.blurSamples,u.needsUpdate=!0,m.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new ei(s.x,s.y)),u.uniforms.shadow_pass.value=R.map.texture,u.uniforms.resolution.value=R.mapSize,u.uniforms.radius.value=R.radius,i.setRenderTarget(R.mapPass),i.clear(),i.renderBufferDirect(A,null,N,u,x,null),m.uniforms.shadow_pass.value=R.mapPass.texture,m.uniforms.resolution.value=R.mapSize,m.uniforms.radius.value=R.radius,i.setRenderTarget(R.map),i.clear(),i.renderBufferDirect(A,null,N,m,x,null)}function M(R,A,N,X){let _=null;const T=N.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(T!==void 0)_=T;else if(_=N.isPointLight===!0?c:a,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const G=_.uuid,j=A.uuid;let L=h[G];L===void 0&&(L={},h[G]=L);let U=L[j];U===void 0&&(U=_.clone(),L[j]=U,A.addEventListener("dispose",C)),_=U}if(_.visible=A.visible,_.wireframe=A.wireframe,X===gn?_.side=A.shadowSide!==null?A.shadowSide:A.side:_.side=A.shadowSide!==null?A.shadowSide:d[A.side],_.alphaMap=A.alphaMap,_.alphaTest=A.alphaTest,_.map=A.map,_.clipShadows=A.clipShadows,_.clippingPlanes=A.clippingPlanes,_.clipIntersection=A.clipIntersection,_.displacementMap=A.displacementMap,_.displacementScale=A.displacementScale,_.displacementBias=A.displacementBias,_.wireframeLinewidth=A.wireframeLinewidth,_.linewidth=A.linewidth,N.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const G=i.properties.get(_);G.light=N}return _}function S(R,A,N,X,_){if(R.visible===!1)return;if(R.layers.test(A.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&_===gn)&&(!R.frustumCulled||n.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,R.matrixWorld);const j=e.update(R),L=R.material;if(Array.isArray(L)){const U=j.groups;for(let D=0,W=U.length;D<W;D++){const V=U[D],q=L[V.materialIndex];if(q&&q.visible){const Y=M(R,q,X,_);R.onBeforeShadow(i,R,A,N,j,Y,V),i.renderBufferDirect(N,null,j,Y,R,V),R.onAfterShadow(i,R,A,N,j,Y,V)}}}else if(L.visible){const U=M(R,L,X,_);R.onBeforeShadow(i,R,A,N,j,U,null),i.renderBufferDirect(N,null,j,U,R,null),R.onAfterShadow(i,R,A,N,j,U,null)}}const G=R.children;for(let j=0,L=G.length;j<L;j++)S(G[j],A,N,X,_)}function C(R){R.target.removeEventListener("dispose",C);for(const N in h){const X=h[N],_=R.target.uuid;_ in X&&(X[_].dispose(),delete X[_])}}}function og(i,e,t){const n=t.isWebGL2;function s(){let w=!1;const te=new it;let ne=null;const de=new it(0,0,0,0);return{setMask:function(xe){ne!==xe&&!w&&(i.colorMask(xe,xe,xe,xe),ne=xe)},setLocked:function(xe){w=xe},setClear:function(xe,Xe,Ze,yt,kt){kt===!0&&(xe*=yt,Xe*=yt,Ze*=yt),te.set(xe,Xe,Ze,yt),de.equals(te)===!1&&(i.clearColor(xe,Xe,Ze,yt),de.copy(te))},reset:function(){w=!1,ne=null,de.set(-1,0,0,0)}}}function r(){let w=!1,te=null,ne=null,de=null;return{setTest:function(xe){xe?ue(i.DEPTH_TEST):Ve(i.DEPTH_TEST)},setMask:function(xe){te!==xe&&!w&&(i.depthMask(xe),te=xe)},setFunc:function(xe){if(ne!==xe){switch(xe){case _d:i.depthFunc(i.NEVER);break;case xd:i.depthFunc(i.ALWAYS);break;case vd:i.depthFunc(i.LESS);break;case Ks:i.depthFunc(i.LEQUAL);break;case Md:i.depthFunc(i.EQUAL);break;case yd:i.depthFunc(i.GEQUAL);break;case Sd:i.depthFunc(i.GREATER);break;case bd:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ne=xe}},setLocked:function(xe){w=xe},setClear:function(xe){de!==xe&&(i.clearDepth(xe),de=xe)},reset:function(){w=!1,te=null,ne=null,de=null}}}function o(){let w=!1,te=null,ne=null,de=null,xe=null,Xe=null,Ze=null,yt=null,kt=null;return{setTest:function(Je){w||(Je?ue(i.STENCIL_TEST):Ve(i.STENCIL_TEST))},setMask:function(Je){te!==Je&&!w&&(i.stencilMask(Je),te=Je)},setFunc:function(Je,Rt,rn){(ne!==Je||de!==Rt||xe!==rn)&&(i.stencilFunc(Je,Rt,rn),ne=Je,de=Rt,xe=rn)},setOp:function(Je,Rt,rn){(Xe!==Je||Ze!==Rt||yt!==rn)&&(i.stencilOp(Je,Rt,rn),Xe=Je,Ze=Rt,yt=rn)},setLocked:function(Je){w=Je},setClear:function(Je){kt!==Je&&(i.clearStencil(Je),kt=Je)},reset:function(){w=!1,te=null,ne=null,de=null,xe=null,Xe=null,Ze=null,yt=null,kt=null}}}const a=new s,c=new r,h=new o,l=new WeakMap,d=new WeakMap;let u={},m={},g=new WeakMap,x=[],p=null,f=!1,y=null,M=null,S=null,C=null,R=null,A=null,N=null,X=new Re(0,0,0),_=0,T=!1,G=null,j=null,L=null,U=null,D=null;const W=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,q=0;const Y=i.getParameter(i.VERSION);Y.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(Y)[1]),V=q>=1):Y.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),V=q>=2);let ee=null,se={};const Te=i.getParameter(i.SCISSOR_BOX),H=i.getParameter(i.VIEWPORT),Z=new it().fromArray(Te),oe=new it().fromArray(H);function ve(w,te,ne,de){const xe=new Uint8Array(4),Xe=i.createTexture();i.bindTexture(w,Xe),i.texParameteri(w,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(w,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ze=0;Ze<ne;Ze++)n&&(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)?i.texImage3D(te,0,i.RGBA,1,1,de,0,i.RGBA,i.UNSIGNED_BYTE,xe):i.texImage2D(te+Ze,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,xe);return Xe}const Me={};Me[i.TEXTURE_2D]=ve(i.TEXTURE_2D,i.TEXTURE_2D,1),Me[i.TEXTURE_CUBE_MAP]=ve(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Me[i.TEXTURE_2D_ARRAY]=ve(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Me[i.TEXTURE_3D]=ve(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),c.setClear(1),h.setClear(0),ue(i.DEPTH_TEST),c.setFunc(Ks),De(!1),E(Ya),ue(i.CULL_FACE),me(Dn);function ue(w){u[w]!==!0&&(i.enable(w),u[w]=!0)}function Ve(w){u[w]!==!1&&(i.disable(w),u[w]=!1)}function Pe(w,te){return m[w]!==te?(i.bindFramebuffer(w,te),m[w]=te,n&&(w===i.DRAW_FRAMEBUFFER&&(m[i.FRAMEBUFFER]=te),w===i.FRAMEBUFFER&&(m[i.DRAW_FRAMEBUFFER]=te)),!0):!1}function F(w,te){let ne=x,de=!1;if(w)if(ne=g.get(te),ne===void 0&&(ne=[],g.set(te,ne)),w.isWebGLMultipleRenderTargets){const xe=w.texture;if(ne.length!==xe.length||ne[0]!==i.COLOR_ATTACHMENT0){for(let Xe=0,Ze=xe.length;Xe<Ze;Xe++)ne[Xe]=i.COLOR_ATTACHMENT0+Xe;ne.length=xe.length,de=!0}}else ne[0]!==i.COLOR_ATTACHMENT0&&(ne[0]=i.COLOR_ATTACHMENT0,de=!0);else ne[0]!==i.BACK&&(ne[0]=i.BACK,de=!0);de&&(t.isWebGL2?i.drawBuffers(ne):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(ne))}function Mt(w){return p!==w?(i.useProgram(w),p=w,!0):!1}const _e={[Xn]:i.FUNC_ADD,[nd]:i.FUNC_SUBTRACT,[id]:i.FUNC_REVERSE_SUBTRACT};if(n)_e[Ka]=i.MIN,_e[Za]=i.MAX;else{const w=e.get("EXT_blend_minmax");w!==null&&(_e[Ka]=w.MIN_EXT,_e[Za]=w.MAX_EXT)}const we={[sd]:i.ZERO,[rd]:i.ONE,[ad]:i.SRC_COLOR,[oa]:i.SRC_ALPHA,[ud]:i.SRC_ALPHA_SATURATE,[hd]:i.DST_COLOR,[cd]:i.DST_ALPHA,[od]:i.ONE_MINUS_SRC_COLOR,[ca]:i.ONE_MINUS_SRC_ALPHA,[dd]:i.ONE_MINUS_DST_COLOR,[ld]:i.ONE_MINUS_DST_ALPHA,[fd]:i.CONSTANT_COLOR,[pd]:i.ONE_MINUS_CONSTANT_COLOR,[md]:i.CONSTANT_ALPHA,[gd]:i.ONE_MINUS_CONSTANT_ALPHA};function me(w,te,ne,de,xe,Xe,Ze,yt,kt,Je){if(w===Dn){f===!0&&(Ve(i.BLEND),f=!1);return}if(f===!1&&(ue(i.BLEND),f=!0),w!==td){if(w!==y||Je!==T){if((M!==Xn||R!==Xn)&&(i.blendEquation(i.FUNC_ADD),M=Xn,R=Xn),Je)switch(w){case Ai:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case $s:i.blendFunc(i.ONE,i.ONE);break;case ja:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case $a:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",w);break}else switch(w){case Ai:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case $s:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case ja:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case $a:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",w);break}S=null,C=null,A=null,N=null,X.set(0,0,0),_=0,y=w,T=Je}return}xe=xe||te,Xe=Xe||ne,Ze=Ze||de,(te!==M||xe!==R)&&(i.blendEquationSeparate(_e[te],_e[xe]),M=te,R=xe),(ne!==S||de!==C||Xe!==A||Ze!==N)&&(i.blendFuncSeparate(we[ne],we[de],we[Xe],we[Ze]),S=ne,C=de,A=Xe,N=Ze),(yt.equals(X)===!1||kt!==_)&&(i.blendColor(yt.r,yt.g,yt.b,kt),X.copy(yt),_=kt),y=w,T=!1}function st(w,te){w.side===bt?Ve(i.CULL_FACE):ue(i.CULL_FACE);let ne=w.side===Ft;te&&(ne=!ne),De(ne),w.blending===Ai&&w.transparent===!1?me(Dn):me(w.blending,w.blendEquation,w.blendSrc,w.blendDst,w.blendEquationAlpha,w.blendSrcAlpha,w.blendDstAlpha,w.blendColor,w.blendAlpha,w.premultipliedAlpha),c.setFunc(w.depthFunc),c.setTest(w.depthTest),c.setMask(w.depthWrite),a.setMask(w.colorWrite);const de=w.stencilWrite;h.setTest(de),de&&(h.setMask(w.stencilWriteMask),h.setFunc(w.stencilFunc,w.stencilRef,w.stencilFuncMask),h.setOp(w.stencilFail,w.stencilZFail,w.stencilZPass)),z(w.polygonOffset,w.polygonOffsetFactor,w.polygonOffsetUnits),w.alphaToCoverage===!0?ue(i.SAMPLE_ALPHA_TO_COVERAGE):Ve(i.SAMPLE_ALPHA_TO_COVERAGE)}function De(w){G!==w&&(w?i.frontFace(i.CW):i.frontFace(i.CCW),G=w)}function E(w){w!==Qh?(ue(i.CULL_FACE),w!==j&&(w===Ya?i.cullFace(i.BACK):w===ed?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ve(i.CULL_FACE),j=w}function v(w){w!==L&&(V&&i.lineWidth(w),L=w)}function z(w,te,ne){w?(ue(i.POLYGON_OFFSET_FILL),(U!==te||D!==ne)&&(i.polygonOffset(te,ne),U=te,D=ne)):Ve(i.POLYGON_OFFSET_FILL)}function Q(w){w?ue(i.SCISSOR_TEST):Ve(i.SCISSOR_TEST)}function $(w){w===void 0&&(w=i.TEXTURE0+W-1),ee!==w&&(i.activeTexture(w),ee=w)}function J(w,te,ne){ne===void 0&&(ee===null?ne=i.TEXTURE0+W-1:ne=ee);let de=se[ne];de===void 0&&(de={type:void 0,texture:void 0},se[ne]=de),(de.type!==w||de.texture!==te)&&(ee!==ne&&(i.activeTexture(ne),ee=ne),i.bindTexture(w,te||Me[w]),de.type=w,de.texture=te)}function fe(){const w=se[ee];w!==void 0&&w.type!==void 0&&(i.bindTexture(w.type,null),w.type=void 0,w.texture=void 0)}function re(){try{i.compressedTexImage2D.apply(i,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function ce(){try{i.compressedTexImage3D.apply(i,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function be(){try{i.texSubImage2D.apply(i,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function Fe(){try{i.texSubImage3D.apply(i,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function K(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function Ye(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function Be(){try{i.texStorage2D.apply(i,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function Ae(){try{i.texStorage3D.apply(i,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function ge(){try{i.texImage2D.apply(i,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function le(){try{i.texImage3D.apply(i,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function Ie(w){Z.equals(w)===!1&&(i.scissor(w.x,w.y,w.z,w.w),Z.copy(w))}function We(w){oe.equals(w)===!1&&(i.viewport(w.x,w.y,w.z,w.w),oe.copy(w))}function tt(w,te){let ne=d.get(te);ne===void 0&&(ne=new WeakMap,d.set(te,ne));let de=ne.get(w);de===void 0&&(de=i.getUniformBlockIndex(te,w.name),ne.set(w,de))}function ke(w,te){const de=d.get(te).get(w);l.get(te)!==de&&(i.uniformBlockBinding(te,de,w.__bindingPointIndex),l.set(te,de))}function Ke(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},ee=null,se={},m={},g=new WeakMap,x=[],p=null,f=!1,y=null,M=null,S=null,C=null,R=null,A=null,N=null,X=new Re(0,0,0),_=0,T=!1,G=null,j=null,L=null,U=null,D=null,Z.set(0,0,i.canvas.width,i.canvas.height),oe.set(0,0,i.canvas.width,i.canvas.height),a.reset(),c.reset(),h.reset()}return{buffers:{color:a,depth:c,stencil:h},enable:ue,disable:Ve,bindFramebuffer:Pe,drawBuffers:F,useProgram:Mt,setBlending:me,setMaterial:st,setFlipSided:De,setCullFace:E,setLineWidth:v,setPolygonOffset:z,setScissorTest:Q,activeTexture:$,bindTexture:J,unbindTexture:fe,compressedTexImage2D:re,compressedTexImage3D:ce,texImage2D:ge,texImage3D:le,updateUBOMapping:tt,uniformBlockBinding:ke,texStorage2D:Be,texStorage3D:Ae,texSubImage2D:be,texSubImage3D:Fe,compressedTexSubImage2D:K,compressedTexSubImage3D:Ye,scissor:Ie,viewport:We,reset:Ke}}function cg(i,e,t,n,s,r,o){const a=s.isWebGL2,c=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,h=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new WeakMap;let d;const u=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(E,v){return m?new OffscreenCanvas(E,v):nr("canvas")}function x(E,v,z,Q){let $=1;if((E.width>Q||E.height>Q)&&($=Q/Math.max(E.width,E.height)),$<1||v===!0)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap){const J=v?tr:Math.floor,fe=J($*E.width),re=J($*E.height);d===void 0&&(d=g(fe,re));const ce=z?g(fe,re):d;return ce.width=fe,ce.height=re,ce.getContext("2d").drawImage(E,0,0,fe,re),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+E.width+"x"+E.height+") to ("+fe+"x"+re+")."),ce}else return"data"in E&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+E.width+"x"+E.height+")."),E;return E}function p(E){return ma(E.width)&&ma(E.height)}function f(E){return a?!1:E.wrapS!==Kt||E.wrapT!==Kt||E.minFilter!==Lt&&E.minFilter!==Ut}function y(E,v){return E.generateMipmaps&&v&&E.minFilter!==Lt&&E.minFilter!==Ut}function M(E){i.generateMipmap(E)}function S(E,v,z,Q,$=!1){if(a===!1)return v;if(E!==null){if(i[E]!==void 0)return i[E];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let J=v;if(v===i.RED&&(z===i.FLOAT&&(J=i.R32F),z===i.HALF_FLOAT&&(J=i.R16F),z===i.UNSIGNED_BYTE&&(J=i.R8)),v===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&(J=i.R8UI),z===i.UNSIGNED_SHORT&&(J=i.R16UI),z===i.UNSIGNED_INT&&(J=i.R32UI),z===i.BYTE&&(J=i.R8I),z===i.SHORT&&(J=i.R16I),z===i.INT&&(J=i.R32I)),v===i.RG&&(z===i.FLOAT&&(J=i.RG32F),z===i.HALF_FLOAT&&(J=i.RG16F),z===i.UNSIGNED_BYTE&&(J=i.RG8)),v===i.RGBA){const fe=$?Zs:je.getTransfer(Q);z===i.FLOAT&&(J=i.RGBA32F),z===i.HALF_FLOAT&&(J=i.RGBA16F),z===i.UNSIGNED_BYTE&&(J=fe===nt?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function C(E,v,z){return y(E,z)===!0||E.isFramebufferTexture&&E.minFilter!==Lt&&E.minFilter!==Ut?Math.log2(Math.max(v.width,v.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?v.mipmaps.length:1}function R(E){return E===Lt||E===Ja||E===Wi?i.NEAREST:i.LINEAR}function A(E){const v=E.target;v.removeEventListener("dispose",A),X(v),v.isVideoTexture&&l.delete(v)}function N(E){const v=E.target;v.removeEventListener("dispose",N),T(v)}function X(E){const v=n.get(E);if(v.__webglInit===void 0)return;const z=E.source,Q=u.get(z);if(Q){const $=Q[v.__cacheKey];$.usedTimes--,$.usedTimes===0&&_(E),Object.keys(Q).length===0&&u.delete(z)}n.remove(E)}function _(E){const v=n.get(E);i.deleteTexture(v.__webglTexture);const z=E.source,Q=u.get(z);delete Q[v.__cacheKey],o.memory.textures--}function T(E){const v=E.texture,z=n.get(E),Q=n.get(v);if(Q.__webglTexture!==void 0&&(i.deleteTexture(Q.__webglTexture),o.memory.textures--),E.depthTexture&&E.depthTexture.dispose(),E.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(z.__webglFramebuffer[$]))for(let J=0;J<z.__webglFramebuffer[$].length;J++)i.deleteFramebuffer(z.__webglFramebuffer[$][J]);else i.deleteFramebuffer(z.__webglFramebuffer[$]);z.__webglDepthbuffer&&i.deleteRenderbuffer(z.__webglDepthbuffer[$])}else{if(Array.isArray(z.__webglFramebuffer))for(let $=0;$<z.__webglFramebuffer.length;$++)i.deleteFramebuffer(z.__webglFramebuffer[$]);else i.deleteFramebuffer(z.__webglFramebuffer);if(z.__webglDepthbuffer&&i.deleteRenderbuffer(z.__webglDepthbuffer),z.__webglMultisampledFramebuffer&&i.deleteFramebuffer(z.__webglMultisampledFramebuffer),z.__webglColorRenderbuffer)for(let $=0;$<z.__webglColorRenderbuffer.length;$++)z.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(z.__webglColorRenderbuffer[$]);z.__webglDepthRenderbuffer&&i.deleteRenderbuffer(z.__webglDepthRenderbuffer)}if(E.isWebGLMultipleRenderTargets)for(let $=0,J=v.length;$<J;$++){const fe=n.get(v[$]);fe.__webglTexture&&(i.deleteTexture(fe.__webglTexture),o.memory.textures--),n.remove(v[$])}n.remove(v),n.remove(E)}let G=0;function j(){G=0}function L(){const E=G;return E>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+s.maxTextures),G+=1,E}function U(E){const v=[];return v.push(E.wrapS),v.push(E.wrapT),v.push(E.wrapR||0),v.push(E.magFilter),v.push(E.minFilter),v.push(E.anisotropy),v.push(E.internalFormat),v.push(E.format),v.push(E.type),v.push(E.generateMipmaps),v.push(E.premultiplyAlpha),v.push(E.flipY),v.push(E.unpackAlignment),v.push(E.colorSpace),v.join()}function D(E,v){const z=n.get(E);if(E.isVideoTexture&&st(E),E.isRenderTargetTexture===!1&&E.version>0&&z.__version!==E.version){const Q=E.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Z(z,E,v);return}}t.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+v)}function W(E,v){const z=n.get(E);if(E.version>0&&z.__version!==E.version){Z(z,E,v);return}t.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+v)}function V(E,v){const z=n.get(E);if(E.version>0&&z.__version!==E.version){Z(z,E,v);return}t.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+v)}function q(E,v){const z=n.get(E);if(E.version>0&&z.__version!==E.version){oe(z,E,v);return}t.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+v)}const Y={[da]:i.REPEAT,[Kt]:i.CLAMP_TO_EDGE,[ua]:i.MIRRORED_REPEAT},ee={[Lt]:i.NEAREST,[Ja]:i.NEAREST_MIPMAP_NEAREST,[Wi]:i.NEAREST_MIPMAP_LINEAR,[Ut]:i.LINEAR,[_r]:i.LINEAR_MIPMAP_NEAREST,[Yn]:i.LINEAR_MIPMAP_LINEAR},se={[Hd]:i.NEVER,[jd]:i.ALWAYS,[Vd]:i.LESS,[nl]:i.LEQUAL,[Wd]:i.EQUAL,[Yd]:i.GEQUAL,[Xd]:i.GREATER,[qd]:i.NOTEQUAL};function Te(E,v,z){if(v.type===vn&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===Ut||v.magFilter===_r||v.magFilter===Wi||v.magFilter===Yn||v.minFilter===Ut||v.minFilter===_r||v.minFilter===Wi||v.minFilter===Yn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),z?(i.texParameteri(E,i.TEXTURE_WRAP_S,Y[v.wrapS]),i.texParameteri(E,i.TEXTURE_WRAP_T,Y[v.wrapT]),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,Y[v.wrapR]),i.texParameteri(E,i.TEXTURE_MAG_FILTER,ee[v.magFilter]),i.texParameteri(E,i.TEXTURE_MIN_FILTER,ee[v.minFilter])):(i.texParameteri(E,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(E,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(v.wrapS!==Kt||v.wrapT!==Kt)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(E,i.TEXTURE_MAG_FILTER,R(v.magFilter)),i.texParameteri(E,i.TEXTURE_MIN_FILTER,R(v.minFilter)),v.minFilter!==Lt&&v.minFilter!==Ut&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),v.compareFunction&&(i.texParameteri(E,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(E,i.TEXTURE_COMPARE_FUNC,se[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const Q=e.get("EXT_texture_filter_anisotropic");if(v.magFilter===Lt||v.minFilter!==Wi&&v.minFilter!==Yn||v.type===vn&&e.has("OES_texture_float_linear")===!1||a===!1&&v.type===as&&e.has("OES_texture_half_float_linear")===!1)return;(v.anisotropy>1||n.get(v).__currentAnisotropy)&&(i.texParameterf(E,Q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy)}}function H(E,v){let z=!1;E.__webglInit===void 0&&(E.__webglInit=!0,v.addEventListener("dispose",A));const Q=v.source;let $=u.get(Q);$===void 0&&($={},u.set(Q,$));const J=U(v);if(J!==E.__cacheKey){$[J]===void 0&&($[J]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,z=!0),$[J].usedTimes++;const fe=$[E.__cacheKey];fe!==void 0&&($[E.__cacheKey].usedTimes--,fe.usedTimes===0&&_(v)),E.__cacheKey=J,E.__webglTexture=$[J].texture}return z}function Z(E,v,z){let Q=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(Q=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&(Q=i.TEXTURE_3D);const $=H(E,v),J=v.source;t.bindTexture(Q,E.__webglTexture,i.TEXTURE0+z);const fe=n.get(J);if(J.version!==fe.__version||$===!0){t.activeTexture(i.TEXTURE0+z);const re=je.getPrimaries(je.workingColorSpace),ce=v.colorSpace===Wt?null:je.getPrimaries(v.colorSpace),be=v.colorSpace===Wt||re===ce?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,be);const Fe=f(v)&&p(v.image)===!1;let K=x(v.image,Fe,!1,s.maxTextureSize);K=De(v,K);const Ye=p(K)||a,Be=r.convert(v.format,v.colorSpace);let Ae=r.convert(v.type),ge=S(v.internalFormat,Be,Ae,v.colorSpace,v.isVideoTexture);Te(Q,v,Ye);let le;const Ie=v.mipmaps,We=a&&v.isVideoTexture!==!0&&ge!==Qc,tt=fe.__version===void 0||$===!0,ke=J.dataReady,Ke=C(v,K,Ye);if(v.isDepthTexture)ge=i.DEPTH_COMPONENT,a?v.type===vn?ge=i.DEPTH_COMPONENT32F:v.type===Ln?ge=i.DEPTH_COMPONENT24:v.type===$n?ge=i.DEPTH24_STENCIL8:ge=i.DEPTH_COMPONENT16:v.type===vn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),v.format===Kn&&ge===i.DEPTH_COMPONENT&&v.type!==Ea&&v.type!==Ln&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),v.type=Ln,Ae=r.convert(v.type)),v.format===Ui&&ge===i.DEPTH_COMPONENT&&(ge=i.DEPTH_STENCIL,v.type!==$n&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),v.type=$n,Ae=r.convert(v.type))),tt&&(We?t.texStorage2D(i.TEXTURE_2D,1,ge,K.width,K.height):t.texImage2D(i.TEXTURE_2D,0,ge,K.width,K.height,0,Be,Ae,null));else if(v.isDataTexture)if(Ie.length>0&&Ye){We&&tt&&t.texStorage2D(i.TEXTURE_2D,Ke,ge,Ie[0].width,Ie[0].height);for(let w=0,te=Ie.length;w<te;w++)le=Ie[w],We?ke&&t.texSubImage2D(i.TEXTURE_2D,w,0,0,le.width,le.height,Be,Ae,le.data):t.texImage2D(i.TEXTURE_2D,w,ge,le.width,le.height,0,Be,Ae,le.data);v.generateMipmaps=!1}else We?(tt&&t.texStorage2D(i.TEXTURE_2D,Ke,ge,K.width,K.height),ke&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,K.width,K.height,Be,Ae,K.data)):t.texImage2D(i.TEXTURE_2D,0,ge,K.width,K.height,0,Be,Ae,K.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){We&&tt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ke,ge,Ie[0].width,Ie[0].height,K.depth);for(let w=0,te=Ie.length;w<te;w++)le=Ie[w],v.format!==Zt?Be!==null?We?ke&&t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,w,0,0,0,le.width,le.height,K.depth,Be,le.data,0,0):t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,w,ge,le.width,le.height,K.depth,0,le.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):We?ke&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,w,0,0,0,le.width,le.height,K.depth,Be,Ae,le.data):t.texImage3D(i.TEXTURE_2D_ARRAY,w,ge,le.width,le.height,K.depth,0,Be,Ae,le.data)}else{We&&tt&&t.texStorage2D(i.TEXTURE_2D,Ke,ge,Ie[0].width,Ie[0].height);for(let w=0,te=Ie.length;w<te;w++)le=Ie[w],v.format!==Zt?Be!==null?We?ke&&t.compressedTexSubImage2D(i.TEXTURE_2D,w,0,0,le.width,le.height,Be,le.data):t.compressedTexImage2D(i.TEXTURE_2D,w,ge,le.width,le.height,0,le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):We?ke&&t.texSubImage2D(i.TEXTURE_2D,w,0,0,le.width,le.height,Be,Ae,le.data):t.texImage2D(i.TEXTURE_2D,w,ge,le.width,le.height,0,Be,Ae,le.data)}else if(v.isDataArrayTexture)We?(tt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ke,ge,K.width,K.height,K.depth),ke&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,K.width,K.height,K.depth,Be,Ae,K.data)):t.texImage3D(i.TEXTURE_2D_ARRAY,0,ge,K.width,K.height,K.depth,0,Be,Ae,K.data);else if(v.isData3DTexture)We?(tt&&t.texStorage3D(i.TEXTURE_3D,Ke,ge,K.width,K.height,K.depth),ke&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,K.width,K.height,K.depth,Be,Ae,K.data)):t.texImage3D(i.TEXTURE_3D,0,ge,K.width,K.height,K.depth,0,Be,Ae,K.data);else if(v.isFramebufferTexture){if(tt)if(We)t.texStorage2D(i.TEXTURE_2D,Ke,ge,K.width,K.height);else{let w=K.width,te=K.height;for(let ne=0;ne<Ke;ne++)t.texImage2D(i.TEXTURE_2D,ne,ge,w,te,0,Be,Ae,null),w>>=1,te>>=1}}else if(Ie.length>0&&Ye){We&&tt&&t.texStorage2D(i.TEXTURE_2D,Ke,ge,Ie[0].width,Ie[0].height);for(let w=0,te=Ie.length;w<te;w++)le=Ie[w],We?ke&&t.texSubImage2D(i.TEXTURE_2D,w,0,0,Be,Ae,le):t.texImage2D(i.TEXTURE_2D,w,ge,Be,Ae,le);v.generateMipmaps=!1}else We?(tt&&t.texStorage2D(i.TEXTURE_2D,Ke,ge,K.width,K.height),ke&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Be,Ae,K)):t.texImage2D(i.TEXTURE_2D,0,ge,Be,Ae,K);y(v,Ye)&&M(Q),fe.__version=J.version,v.onUpdate&&v.onUpdate(v)}E.__version=v.version}function oe(E,v,z){if(v.image.length!==6)return;const Q=H(E,v),$=v.source;t.bindTexture(i.TEXTURE_CUBE_MAP,E.__webglTexture,i.TEXTURE0+z);const J=n.get($);if($.version!==J.__version||Q===!0){t.activeTexture(i.TEXTURE0+z);const fe=je.getPrimaries(je.workingColorSpace),re=v.colorSpace===Wt?null:je.getPrimaries(v.colorSpace),ce=v.colorSpace===Wt||fe===re?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ce);const be=v.isCompressedTexture||v.image[0].isCompressedTexture,Fe=v.image[0]&&v.image[0].isDataTexture,K=[];for(let w=0;w<6;w++)!be&&!Fe?K[w]=x(v.image[w],!1,!0,s.maxCubemapSize):K[w]=Fe?v.image[w].image:v.image[w],K[w]=De(v,K[w]);const Ye=K[0],Be=p(Ye)||a,Ae=r.convert(v.format,v.colorSpace),ge=r.convert(v.type),le=S(v.internalFormat,Ae,ge,v.colorSpace),Ie=a&&v.isVideoTexture!==!0,We=J.__version===void 0||Q===!0,tt=$.dataReady;let ke=C(v,Ye,Be);Te(i.TEXTURE_CUBE_MAP,v,Be);let Ke;if(be){Ie&&We&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ke,le,Ye.width,Ye.height);for(let w=0;w<6;w++){Ke=K[w].mipmaps;for(let te=0;te<Ke.length;te++){const ne=Ke[te];v.format!==Zt?Ae!==null?Ie?tt&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+w,te,0,0,ne.width,ne.height,Ae,ne.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+w,te,le,ne.width,ne.height,0,ne.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ie?tt&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+w,te,0,0,ne.width,ne.height,Ae,ge,ne.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+w,te,le,ne.width,ne.height,0,Ae,ge,ne.data)}}}else{Ke=v.mipmaps,Ie&&We&&(Ke.length>0&&ke++,t.texStorage2D(i.TEXTURE_CUBE_MAP,ke,le,K[0].width,K[0].height));for(let w=0;w<6;w++)if(Fe){Ie?tt&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+w,0,0,0,K[w].width,K[w].height,Ae,ge,K[w].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+w,0,le,K[w].width,K[w].height,0,Ae,ge,K[w].data);for(let te=0;te<Ke.length;te++){const de=Ke[te].image[w].image;Ie?tt&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+w,te+1,0,0,de.width,de.height,Ae,ge,de.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+w,te+1,le,de.width,de.height,0,Ae,ge,de.data)}}else{Ie?tt&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+w,0,0,0,Ae,ge,K[w]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+w,0,le,Ae,ge,K[w]);for(let te=0;te<Ke.length;te++){const ne=Ke[te];Ie?tt&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+w,te+1,0,0,Ae,ge,ne.image[w]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+w,te+1,le,Ae,ge,ne.image[w])}}}y(v,Be)&&M(i.TEXTURE_CUBE_MAP),J.__version=$.version,v.onUpdate&&v.onUpdate(v)}E.__version=v.version}function ve(E,v,z,Q,$,J){const fe=r.convert(z.format,z.colorSpace),re=r.convert(z.type),ce=S(z.internalFormat,fe,re,z.colorSpace);if(!n.get(v).__hasExternalTextures){const Fe=Math.max(1,v.width>>J),K=Math.max(1,v.height>>J);$===i.TEXTURE_3D||$===i.TEXTURE_2D_ARRAY?t.texImage3D($,J,ce,Fe,K,v.depth,0,fe,re,null):t.texImage2D($,J,ce,Fe,K,0,fe,re,null)}t.bindFramebuffer(i.FRAMEBUFFER,E),me(v)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Q,$,n.get(z).__webglTexture,0,we(v)):($===i.TEXTURE_2D||$>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Q,$,n.get(z).__webglTexture,J),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Me(E,v,z){if(i.bindRenderbuffer(i.RENDERBUFFER,E),v.depthBuffer&&!v.stencilBuffer){let Q=a===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(z||me(v)){const $=v.depthTexture;$&&$.isDepthTexture&&($.type===vn?Q=i.DEPTH_COMPONENT32F:$.type===Ln&&(Q=i.DEPTH_COMPONENT24));const J=we(v);me(v)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,J,Q,v.width,v.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,J,Q,v.width,v.height)}else i.renderbufferStorage(i.RENDERBUFFER,Q,v.width,v.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,E)}else if(v.depthBuffer&&v.stencilBuffer){const Q=we(v);z&&me(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Q,i.DEPTH24_STENCIL8,v.width,v.height):me(v)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Q,i.DEPTH24_STENCIL8,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,E)}else{const Q=v.isWebGLMultipleRenderTargets===!0?v.texture:[v.texture];for(let $=0;$<Q.length;$++){const J=Q[$],fe=r.convert(J.format,J.colorSpace),re=r.convert(J.type),ce=S(J.internalFormat,fe,re,J.colorSpace),be=we(v);z&&me(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,be,ce,v.width,v.height):me(v)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,be,ce,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,ce,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ue(E,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,E),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(v.depthTexture).__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),D(v.depthTexture,0);const Q=n.get(v.depthTexture).__webglTexture,$=we(v);if(v.depthTexture.format===Kn)me(v)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0);else if(v.depthTexture.format===Ui)me(v)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function Ve(E){const v=n.get(E),z=E.isWebGLCubeRenderTarget===!0;if(E.depthTexture&&!v.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");ue(v.__webglFramebuffer,E)}else if(z){v.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[Q]),v.__webglDepthbuffer[Q]=i.createRenderbuffer(),Me(v.__webglDepthbuffer[Q],E,!1)}else t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer=i.createRenderbuffer(),Me(v.__webglDepthbuffer,E,!1);t.bindFramebuffer(i.FRAMEBUFFER,null)}function Pe(E,v,z){const Q=n.get(E);v!==void 0&&ve(Q.__webglFramebuffer,E,E.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&Ve(E)}function F(E){const v=E.texture,z=n.get(E),Q=n.get(v);E.addEventListener("dispose",N),E.isWebGLMultipleRenderTargets!==!0&&(Q.__webglTexture===void 0&&(Q.__webglTexture=i.createTexture()),Q.__version=v.version,o.memory.textures++);const $=E.isWebGLCubeRenderTarget===!0,J=E.isWebGLMultipleRenderTargets===!0,fe=p(E)||a;if($){z.__webglFramebuffer=[];for(let re=0;re<6;re++)if(a&&v.mipmaps&&v.mipmaps.length>0){z.__webglFramebuffer[re]=[];for(let ce=0;ce<v.mipmaps.length;ce++)z.__webglFramebuffer[re][ce]=i.createFramebuffer()}else z.__webglFramebuffer[re]=i.createFramebuffer()}else{if(a&&v.mipmaps&&v.mipmaps.length>0){z.__webglFramebuffer=[];for(let re=0;re<v.mipmaps.length;re++)z.__webglFramebuffer[re]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(J)if(s.drawBuffers){const re=E.texture;for(let ce=0,be=re.length;ce<be;ce++){const Fe=n.get(re[ce]);Fe.__webglTexture===void 0&&(Fe.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&E.samples>0&&me(E)===!1){const re=J?v:[v];z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let ce=0;ce<re.length;ce++){const be=re[ce];z.__webglColorRenderbuffer[ce]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[ce]);const Fe=r.convert(be.format,be.colorSpace),K=r.convert(be.type),Ye=S(be.internalFormat,Fe,K,be.colorSpace,E.isXRRenderTarget===!0),Be=we(E);i.renderbufferStorageMultisample(i.RENDERBUFFER,Be,Ye,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.RENDERBUFFER,z.__webglColorRenderbuffer[ce])}i.bindRenderbuffer(i.RENDERBUFFER,null),E.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),Me(z.__webglDepthRenderbuffer,E,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if($){t.bindTexture(i.TEXTURE_CUBE_MAP,Q.__webglTexture),Te(i.TEXTURE_CUBE_MAP,v,fe);for(let re=0;re<6;re++)if(a&&v.mipmaps&&v.mipmaps.length>0)for(let ce=0;ce<v.mipmaps.length;ce++)ve(z.__webglFramebuffer[re][ce],E,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+re,ce);else ve(z.__webglFramebuffer[re],E,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0);y(v,fe)&&M(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(J){const re=E.texture;for(let ce=0,be=re.length;ce<be;ce++){const Fe=re[ce],K=n.get(Fe);t.bindTexture(i.TEXTURE_2D,K.__webglTexture),Te(i.TEXTURE_2D,Fe,fe),ve(z.__webglFramebuffer,E,Fe,i.COLOR_ATTACHMENT0+ce,i.TEXTURE_2D,0),y(Fe,fe)&&M(i.TEXTURE_2D)}t.unbindTexture()}else{let re=i.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(a?re=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(re,Q.__webglTexture),Te(re,v,fe),a&&v.mipmaps&&v.mipmaps.length>0)for(let ce=0;ce<v.mipmaps.length;ce++)ve(z.__webglFramebuffer[ce],E,v,i.COLOR_ATTACHMENT0,re,ce);else ve(z.__webglFramebuffer,E,v,i.COLOR_ATTACHMENT0,re,0);y(v,fe)&&M(re),t.unbindTexture()}E.depthBuffer&&Ve(E)}function Mt(E){const v=p(E)||a,z=E.isWebGLMultipleRenderTargets===!0?E.texture:[E.texture];for(let Q=0,$=z.length;Q<$;Q++){const J=z[Q];if(y(J,v)){const fe=E.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,re=n.get(J).__webglTexture;t.bindTexture(fe,re),M(fe),t.unbindTexture()}}}function _e(E){if(a&&E.samples>0&&me(E)===!1){const v=E.isWebGLMultipleRenderTargets?E.texture:[E.texture],z=E.width,Q=E.height;let $=i.COLOR_BUFFER_BIT;const J=[],fe=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=n.get(E),ce=E.isWebGLMultipleRenderTargets===!0;if(ce)for(let be=0;be<v.length;be++)t.bindFramebuffer(i.FRAMEBUFFER,re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,re.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,re.__webglFramebuffer);for(let be=0;be<v.length;be++){J.push(i.COLOR_ATTACHMENT0+be),E.depthBuffer&&J.push(fe);const Fe=re.__ignoreDepthValues!==void 0?re.__ignoreDepthValues:!1;if(Fe===!1&&(E.depthBuffer&&($|=i.DEPTH_BUFFER_BIT),E.stencilBuffer&&($|=i.STENCIL_BUFFER_BIT)),ce&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,re.__webglColorRenderbuffer[be]),Fe===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[fe]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[fe])),ce){const K=n.get(v[be]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,K,0)}i.blitFramebuffer(0,0,z,Q,0,0,z,Q,$,i.NEAREST),h&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,J)}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ce)for(let be=0;be<v.length;be++){t.bindFramebuffer(i.FRAMEBUFFER,re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.RENDERBUFFER,re.__webglColorRenderbuffer[be]);const Fe=n.get(v[be]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.TEXTURE_2D,Fe,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,re.__webglMultisampledFramebuffer)}}function we(E){return Math.min(s.maxSamples,E.samples)}function me(E){const v=n.get(E);return a&&E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function st(E){const v=o.render.frame;l.get(E)!==v&&(l.set(E,v),E.update())}function De(E,v){const z=E.colorSpace,Q=E.format,$=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||E.format===pa||z!==Sn&&z!==Wt&&(je.getTransfer(z)===nt?a===!1?e.has("EXT_sRGB")===!0&&Q===Zt?(E.format=pa,E.minFilter=Ut,E.generateMipmaps=!1):v=sl.sRGBToLinear(v):(Q!==Zt||$!==Un)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),v}this.allocateTextureUnit=L,this.resetTextureUnits=j,this.setTexture2D=D,this.setTexture2DArray=W,this.setTexture3D=V,this.setTextureCube=q,this.rebindTextures=Pe,this.setupRenderTarget=F,this.updateRenderTargetMipmap=Mt,this.updateMultisampleRenderTarget=_e,this.setupDepthRenderbuffer=Ve,this.setupFrameBufferTexture=ve,this.useMultisampledRTT=me}function lg(i,e,t){const n=t.isWebGL2;function s(r,o=Wt){let a;const c=je.getTransfer(o);if(r===Un)return i.UNSIGNED_BYTE;if(r===jc)return i.UNSIGNED_SHORT_4_4_4_4;if(r===$c)return i.UNSIGNED_SHORT_5_5_5_1;if(r===Ld)return i.BYTE;if(r===Dd)return i.SHORT;if(r===Ea)return i.UNSIGNED_SHORT;if(r===Yc)return i.INT;if(r===Ln)return i.UNSIGNED_INT;if(r===vn)return i.FLOAT;if(r===as)return n?i.HALF_FLOAT:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===Id)return i.ALPHA;if(r===Zt)return i.RGBA;if(r===Ud)return i.LUMINANCE;if(r===Fd)return i.LUMINANCE_ALPHA;if(r===Kn)return i.DEPTH_COMPONENT;if(r===Ui)return i.DEPTH_STENCIL;if(r===pa)return a=e.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===Nd)return i.RED;if(r===Kc)return i.RED_INTEGER;if(r===zd)return i.RG;if(r===Zc)return i.RG_INTEGER;if(r===Jc)return i.RGBA_INTEGER;if(r===xr||r===vr||r===Mr||r===yr)if(c===nt)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===xr)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===vr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Mr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===yr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===xr)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===vr)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Mr)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===yr)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Qa||r===eo||r===to||r===no)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===Qa)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===eo)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===to)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===no)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Qc)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===io||r===so)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(r===io)return c===nt?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===so)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===ro||r===ao||r===oo||r===co||r===lo||r===ho||r===uo||r===fo||r===po||r===mo||r===go||r===_o||r===xo||r===vo)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(r===ro)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===ao)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===oo)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===co)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===lo)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===ho)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===uo)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===fo)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===po)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===mo)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===go)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===_o)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===xo)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===vo)return c===nt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Sr||r===Mo||r===yo)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(r===Sr)return c===nt?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Mo)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===yo)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Od||r===So||r===bo||r===Eo)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(r===Sr)return a.COMPRESSED_RED_RGTC1_EXT;if(r===So)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===bo)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Eo)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===$n?n?i.UNSIGNED_INT_24_8:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}class hg extends Bt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Xt extends lt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const dg={type:"move"};class Xr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Xt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Xt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Xt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){o=!0;for(const x of e.hand.values()){const p=t.getJointPose(x,n),f=this._getHandJoint(h,x);p!==null&&(f.matrix.fromArray(p.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=p.radius),f.visible=p!==null}const l=h.joints["index-finger-tip"],d=h.joints["thumb-tip"],u=l.position.distanceTo(d.position),m=.02,g=.005;h.inputState.pinching&&u>m+g?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&u<=m-g&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(dg)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),h!==null&&(h.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Xt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const ug=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,fg=`
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

}`;class pg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const s=new It,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}render(e,t){if(this.texture!==null){if(this.mesh===null){const n=t.cameras[0].viewport,s=new Nn({extensions:{fragDepth:!0},vertexShader:ug,fragmentShader:fg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new he(new ds(20,20),s)}e.render(this.mesh,t)}}reset(){this.texture=null,this.mesh=null}}class mg extends Bi{constructor(e,t){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,h=null,l=null,d=null,u=null,m=null,g=null;const x=new pg,p=t.getContextAttributes();let f=null,y=null;const M=[],S=[],C=new Se;let R=null;const A=new Bt;A.layers.enable(1),A.viewport=new it;const N=new Bt;N.layers.enable(2),N.viewport=new it;const X=[A,N],_=new hg;_.layers.enable(1),_.layers.enable(2);let T=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(H){let Z=M[H];return Z===void 0&&(Z=new Xr,M[H]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(H){let Z=M[H];return Z===void 0&&(Z=new Xr,M[H]=Z),Z.getGripSpace()},this.getHand=function(H){let Z=M[H];return Z===void 0&&(Z=new Xr,M[H]=Z),Z.getHandSpace()};function j(H){const Z=S.indexOf(H.inputSource);if(Z===-1)return;const oe=M[Z];oe!==void 0&&(oe.update(H.inputSource,H.frame,h||o),oe.dispatchEvent({type:H.type,data:H.inputSource}))}function L(){s.removeEventListener("select",j),s.removeEventListener("selectstart",j),s.removeEventListener("selectend",j),s.removeEventListener("squeeze",j),s.removeEventListener("squeezestart",j),s.removeEventListener("squeezeend",j),s.removeEventListener("end",L),s.removeEventListener("inputsourceschange",U);for(let H=0;H<M.length;H++){const Z=S[H];Z!==null&&(S[H]=null,M[H].disconnect(Z))}T=null,G=null,x.reset(),e.setRenderTarget(f),m=null,u=null,d=null,s=null,y=null,Te.stop(),n.isPresenting=!1,e.setPixelRatio(R),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(H){r=H,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(H){a=H,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||o},this.setReferenceSpace=function(H){h=H},this.getBaseLayer=function(){return u!==null?u:m},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(H){if(s=H,s!==null){if(f=e.getRenderTarget(),s.addEventListener("select",j),s.addEventListener("selectstart",j),s.addEventListener("selectend",j),s.addEventListener("squeeze",j),s.addEventListener("squeezestart",j),s.addEventListener("squeezeend",j),s.addEventListener("end",L),s.addEventListener("inputsourceschange",U),p.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(C),s.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const Z={antialias:s.renderState.layers===void 0?p.antialias:!0,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,Z),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),y=new ei(m.framebufferWidth,m.framebufferHeight,{format:Zt,type:Un,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil})}else{let Z=null,oe=null,ve=null;p.depth&&(ve=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Z=p.stencil?Ui:Kn,oe=p.stencil?$n:Ln);const Me={colorFormat:t.RGBA8,depthFormat:ve,scaleFactor:r};d=new XRWebGLBinding(s,t),u=d.createProjectionLayer(Me),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),y=new ei(u.textureWidth,u.textureHeight,{format:Zt,type:Un,depthTexture:new ml(u.textureWidth,u.textureHeight,oe,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0});const ue=e.properties.get(y);ue.__ignoreDepthValues=u.ignoreDepthValues}y.isXRRenderTarget=!0,this.setFoveation(c),h=null,o=await s.requestReferenceSpace(a),Te.setContext(s),Te.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function U(H){for(let Z=0;Z<H.removed.length;Z++){const oe=H.removed[Z],ve=S.indexOf(oe);ve>=0&&(S[ve]=null,M[ve].disconnect(oe))}for(let Z=0;Z<H.added.length;Z++){const oe=H.added[Z];let ve=S.indexOf(oe);if(ve===-1){for(let ue=0;ue<M.length;ue++)if(ue>=S.length){S.push(oe),ve=ue;break}else if(S[ue]===null){S[ue]=oe,ve=ue;break}if(ve===-1)break}const Me=M[ve];Me&&Me.connect(oe)}}const D=new P,W=new P;function V(H,Z,oe){D.setFromMatrixPosition(Z.matrixWorld),W.setFromMatrixPosition(oe.matrixWorld);const ve=D.distanceTo(W),Me=Z.projectionMatrix.elements,ue=oe.projectionMatrix.elements,Ve=Me[14]/(Me[10]-1),Pe=Me[14]/(Me[10]+1),F=(Me[9]+1)/Me[5],Mt=(Me[9]-1)/Me[5],_e=(Me[8]-1)/Me[0],we=(ue[8]+1)/ue[0],me=Ve*_e,st=Ve*we,De=ve/(-_e+we),E=De*-_e;Z.matrixWorld.decompose(H.position,H.quaternion,H.scale),H.translateX(E),H.translateZ(De),H.matrixWorld.compose(H.position,H.quaternion,H.scale),H.matrixWorldInverse.copy(H.matrixWorld).invert();const v=Ve+De,z=Pe+De,Q=me-E,$=st+(ve-E),J=F*Pe/z*v,fe=Mt*Pe/z*v;H.projectionMatrix.makePerspective(Q,$,J,fe,v,z),H.projectionMatrixInverse.copy(H.projectionMatrix).invert()}function q(H,Z){Z===null?H.matrixWorld.copy(H.matrix):H.matrixWorld.multiplyMatrices(Z.matrixWorld,H.matrix),H.matrixWorldInverse.copy(H.matrixWorld).invert()}this.updateCamera=function(H){if(s===null)return;x.texture!==null&&(H.near=x.depthNear,H.far=x.depthFar),_.near=N.near=A.near=H.near,_.far=N.far=A.far=H.far,(T!==_.near||G!==_.far)&&(s.updateRenderState({depthNear:_.near,depthFar:_.far}),T=_.near,G=_.far,A.near=T,A.far=G,N.near=T,N.far=G,A.updateProjectionMatrix(),N.updateProjectionMatrix(),H.updateProjectionMatrix());const Z=H.parent,oe=_.cameras;q(_,Z);for(let ve=0;ve<oe.length;ve++)q(oe[ve],Z);oe.length===2?V(_,A,N):_.projectionMatrix.copy(A.projectionMatrix),Y(H,_,Z)};function Y(H,Z,oe){oe===null?H.matrix.copy(Z.matrixWorld):(H.matrix.copy(oe.matrixWorld),H.matrix.invert(),H.matrix.multiply(Z.matrixWorld)),H.matrix.decompose(H.position,H.quaternion,H.scale),H.updateMatrixWorld(!0),H.projectionMatrix.copy(Z.projectionMatrix),H.projectionMatrixInverse.copy(Z.projectionMatrixInverse),H.isPerspectiveCamera&&(H.fov=os*2*Math.atan(1/H.projectionMatrix.elements[5]),H.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(u===null&&m===null))return c},this.setFoveation=function(H){c=H,u!==null&&(u.fixedFoveation=H),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=H)},this.hasDepthSensing=function(){return x.texture!==null};let ee=null;function se(H,Z){if(l=Z.getViewerPose(h||o),g=Z,l!==null){const oe=l.views;m!==null&&(e.setRenderTargetFramebuffer(y,m.framebuffer),e.setRenderTarget(y));let ve=!1;oe.length!==_.cameras.length&&(_.cameras.length=0,ve=!0);for(let ue=0;ue<oe.length;ue++){const Ve=oe[ue];let Pe=null;if(m!==null)Pe=m.getViewport(Ve);else{const Mt=d.getViewSubImage(u,Ve);Pe=Mt.viewport,ue===0&&(e.setRenderTargetTextures(y,Mt.colorTexture,u.ignoreDepthValues?void 0:Mt.depthStencilTexture),e.setRenderTarget(y))}let F=X[ue];F===void 0&&(F=new Bt,F.layers.enable(ue),F.viewport=new it,X[ue]=F),F.matrix.fromArray(Ve.transform.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale),F.projectionMatrix.fromArray(Ve.projectionMatrix),F.projectionMatrixInverse.copy(F.projectionMatrix).invert(),F.viewport.set(Pe.x,Pe.y,Pe.width,Pe.height),ue===0&&(_.matrix.copy(F.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),ve===!0&&_.cameras.push(F)}const Me=s.enabledFeatures;if(Me&&Me.includes("depth-sensing")){const ue=d.getDepthInformation(oe[0]);ue&&ue.isValid&&ue.texture&&x.init(e,ue,s.renderState)}}for(let oe=0;oe<M.length;oe++){const ve=S[oe],Me=M[oe];ve!==null&&Me!==void 0&&Me.update(ve,Z,h||o)}x.render(e,_),ee&&ee(H,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),g=null}const Te=new fl;Te.setAnimationLoop(se),this.setAnimationLoop=function(H){ee=H},this.dispose=function(){}}}function gg(i,e){function t(p,f){p.matrixAutoUpdate===!0&&p.updateMatrix(),f.value.copy(p.matrix)}function n(p,f){f.color.getRGB(p.fogColor.value,hl(i)),f.isFog?(p.fogNear.value=f.near,p.fogFar.value=f.far):f.isFogExp2&&(p.fogDensity.value=f.density)}function s(p,f,y,M,S){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(p,f):f.isMeshToonMaterial?(r(p,f),d(p,f)):f.isMeshPhongMaterial?(r(p,f),l(p,f)):f.isMeshStandardMaterial?(r(p,f),u(p,f),f.isMeshPhysicalMaterial&&m(p,f,S)):f.isMeshMatcapMaterial?(r(p,f),g(p,f)):f.isMeshDepthMaterial?r(p,f):f.isMeshDistanceMaterial?(r(p,f),x(p,f)):f.isMeshNormalMaterial?r(p,f):f.isLineBasicMaterial?(o(p,f),f.isLineDashedMaterial&&a(p,f)):f.isPointsMaterial?c(p,f,y,M):f.isSpriteMaterial?h(p,f):f.isShadowMaterial?(p.color.value.copy(f.color),p.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(p,f){p.opacity.value=f.opacity,f.color&&p.diffuse.value.copy(f.color),f.emissive&&p.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(p.map.value=f.map,t(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.bumpMap&&(p.bumpMap.value=f.bumpMap,t(f.bumpMap,p.bumpMapTransform),p.bumpScale.value=f.bumpScale,f.side===Ft&&(p.bumpScale.value*=-1)),f.normalMap&&(p.normalMap.value=f.normalMap,t(f.normalMap,p.normalMapTransform),p.normalScale.value.copy(f.normalScale),f.side===Ft&&p.normalScale.value.negate()),f.displacementMap&&(p.displacementMap.value=f.displacementMap,t(f.displacementMap,p.displacementMapTransform),p.displacementScale.value=f.displacementScale,p.displacementBias.value=f.displacementBias),f.emissiveMap&&(p.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,p.emissiveMapTransform)),f.specularMap&&(p.specularMap.value=f.specularMap,t(f.specularMap,p.specularMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);const y=e.get(f).envMap;if(y&&(p.envMap.value=y,p.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=f.reflectivity,p.ior.value=f.ior,p.refractionRatio.value=f.refractionRatio),f.lightMap){p.lightMap.value=f.lightMap;const M=i._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=f.lightMapIntensity*M,t(f.lightMap,p.lightMapTransform)}f.aoMap&&(p.aoMap.value=f.aoMap,p.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,p.aoMapTransform))}function o(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,f.map&&(p.map.value=f.map,t(f.map,p.mapTransform))}function a(p,f){p.dashSize.value=f.dashSize,p.totalSize.value=f.dashSize+f.gapSize,p.scale.value=f.scale}function c(p,f,y,M){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.size.value=f.size*y,p.scale.value=M*.5,f.map&&(p.map.value=f.map,t(f.map,p.uvTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function h(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.rotation.value=f.rotation,f.map&&(p.map.value=f.map,t(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function l(p,f){p.specular.value.copy(f.specular),p.shininess.value=Math.max(f.shininess,1e-4)}function d(p,f){f.gradientMap&&(p.gradientMap.value=f.gradientMap)}function u(p,f){p.metalness.value=f.metalness,f.metalnessMap&&(p.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,p.metalnessMapTransform)),p.roughness.value=f.roughness,f.roughnessMap&&(p.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,p.roughnessMapTransform)),e.get(f).envMap&&(p.envMapIntensity.value=f.envMapIntensity)}function m(p,f,y){p.ior.value=f.ior,f.sheen>0&&(p.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),p.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(p.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,p.sheenColorMapTransform)),f.sheenRoughnessMap&&(p.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,p.sheenRoughnessMapTransform))),f.clearcoat>0&&(p.clearcoat.value=f.clearcoat,p.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(p.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,p.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(p.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Ft&&p.clearcoatNormalScale.value.negate())),f.iridescence>0&&(p.iridescence.value=f.iridescence,p.iridescenceIOR.value=f.iridescenceIOR,p.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(p.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,p.iridescenceMapTransform)),f.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),f.transmission>0&&(p.transmission.value=f.transmission,p.transmissionSamplerMap.value=y.texture,p.transmissionSamplerSize.value.set(y.width,y.height),f.transmissionMap&&(p.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,p.transmissionMapTransform)),p.thickness.value=f.thickness,f.thicknessMap&&(p.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=f.attenuationDistance,p.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(p.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(p.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=f.specularIntensity,p.specularColor.value.copy(f.specularColor),f.specularColorMap&&(p.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,p.specularColorMapTransform)),f.specularIntensityMap&&(p.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,f){f.matcap&&(p.matcap.value=f.matcap)}function x(p,f){const y=e.get(f).light;p.referencePosition.value.setFromMatrixPosition(y.matrixWorld),p.nearDistance.value=y.shadow.camera.near,p.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function _g(i,e,t,n){let s={},r={},o=[];const a=t.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(y,M){const S=M.program;n.uniformBlockBinding(y,S)}function h(y,M){let S=s[y.id];S===void 0&&(g(y),S=l(y),s[y.id]=S,y.addEventListener("dispose",p));const C=M.program;n.updateUBOMapping(y,C);const R=e.render.frame;r[y.id]!==R&&(u(y),r[y.id]=R)}function l(y){const M=d();y.__bindingPointIndex=M;const S=i.createBuffer(),C=y.__size,R=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,C,R),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,S),S}function d(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){const M=s[y.id],S=y.uniforms,C=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let R=0,A=S.length;R<A;R++){const N=Array.isArray(S[R])?S[R]:[S[R]];for(let X=0,_=N.length;X<_;X++){const T=N[X];if(m(T,R,X,C)===!0){const G=T.__offset,j=Array.isArray(T.value)?T.value:[T.value];let L=0;for(let U=0;U<j.length;U++){const D=j[U],W=x(D);typeof D=="number"||typeof D=="boolean"?(T.__data[0]=D,i.bufferSubData(i.UNIFORM_BUFFER,G+L,T.__data)):D.isMatrix3?(T.__data[0]=D.elements[0],T.__data[1]=D.elements[1],T.__data[2]=D.elements[2],T.__data[3]=0,T.__data[4]=D.elements[3],T.__data[5]=D.elements[4],T.__data[6]=D.elements[5],T.__data[7]=0,T.__data[8]=D.elements[6],T.__data[9]=D.elements[7],T.__data[10]=D.elements[8],T.__data[11]=0):(D.toArray(T.__data,L),L+=W.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,G,T.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(y,M,S,C){const R=y.value,A=M+"_"+S;if(C[A]===void 0)return typeof R=="number"||typeof R=="boolean"?C[A]=R:C[A]=R.clone(),!0;{const N=C[A];if(typeof R=="number"||typeof R=="boolean"){if(N!==R)return C[A]=R,!0}else if(N.equals(R)===!1)return N.copy(R),!0}return!1}function g(y){const M=y.uniforms;let S=0;const C=16;for(let A=0,N=M.length;A<N;A++){const X=Array.isArray(M[A])?M[A]:[M[A]];for(let _=0,T=X.length;_<T;_++){const G=X[_],j=Array.isArray(G.value)?G.value:[G.value];for(let L=0,U=j.length;L<U;L++){const D=j[L],W=x(D),V=S%C;V!==0&&C-V<W.boundary&&(S+=C-V),G.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=S,S+=W.storage}}}const R=S%C;return R>0&&(S+=C-R),y.__size=S,y.__cache={},this}function x(y){const M={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(M.boundary=4,M.storage=4):y.isVector2?(M.boundary=8,M.storage=8):y.isVector3||y.isColor?(M.boundary=16,M.storage=12):y.isVector4?(M.boundary=16,M.storage=16):y.isMatrix3?(M.boundary=48,M.storage=48):y.isMatrix4?(M.boundary=64,M.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),M}function p(y){const M=y.target;M.removeEventListener("dispose",p);const S=o.indexOf(M.__bindingPointIndex);o.splice(S,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function f(){for(const y in s)i.deleteBuffer(s[y]);o=[],s={},r={}}return{bind:c,update:h,dispose:f}}class yl{constructor(e={}){const{canvas:t=lu(),context:n=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:l="default",failIfMajorPerformanceCaveat:d=!1}=e;this.isWebGLRenderer=!0;let u;n!==null?u=n.getContextAttributes().alpha:u=o;const m=new Uint32Array(4),g=new Int32Array(4);let x=null,p=null;const f=[],y=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=dt,this._useLegacyLights=!1,this.toneMapping=In,this.toneMappingExposure=1;const M=this;let S=!1,C=0,R=0,A=null,N=-1,X=null;const _=new it,T=new it;let G=null;const j=new Re(0);let L=0,U=t.width,D=t.height,W=1,V=null,q=null;const Y=new it(0,0,U,D),ee=new it(0,0,U,D);let se=!1;const Te=new Ra;let H=!1,Z=!1,oe=null;const ve=new Qe,Me=new Se,ue=new P,Ve={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Pe(){return A===null?W:1}let F=n;function Mt(b,I){for(let B=0;B<b.length;B++){const k=b[B],O=t.getContext(k,I);if(O!==null)return O}return null}try{const b={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:l,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ba}`),t.addEventListener("webglcontextlost",Ke,!1),t.addEventListener("webglcontextrestored",w,!1),t.addEventListener("webglcontextcreationerror",te,!1),F===null){const I=["webgl2","webgl","experimental-webgl"];if(M.isWebGL1Renderer===!0&&I.shift(),F=Mt(I,b),F===null)throw Mt(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&F instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),F.getShaderPrecisionFormat===void 0&&(F.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let _e,we,me,st,De,E,v,z,Q,$,J,fe,re,ce,be,Fe,K,Ye,Be,Ae,ge,le,Ie,We;function tt(){_e=new Em(F),we=new xm(F,_e,e),_e.init(we),le=new lg(F,_e,we),me=new og(F,_e,we),st=new Am(F),De=new Y0,E=new cg(F,_e,me,De,we,le,st),v=new Mm(M),z=new bm(M),Q=new Uu(F,we),Ie=new gm(F,_e,Q,we),$=new Tm(F,Q,st,Ie),J=new Lm(F,$,Q,st),Be=new Pm(F,we,E),Fe=new vm(De),fe=new q0(M,v,z,_e,we,Ie,Fe),re=new gg(M,De),ce=new $0,be=new tg(_e,we),Ye=new mm(M,v,z,me,J,u,c),K=new ag(M,J,we),We=new _g(F,st,we,me),Ae=new _m(F,_e,st,we),ge=new wm(F,_e,st,we),st.programs=fe.programs,M.capabilities=we,M.extensions=_e,M.properties=De,M.renderLists=ce,M.shadowMap=K,M.state=me,M.info=st}tt();const ke=new mg(M,F);this.xr=ke,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const b=_e.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=_e.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(b){b!==void 0&&(W=b,this.setSize(U,D,!1))},this.getSize=function(b){return b.set(U,D)},this.setSize=function(b,I,B=!0){if(ke.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}U=b,D=I,t.width=Math.floor(b*W),t.height=Math.floor(I*W),B===!0&&(t.style.width=b+"px",t.style.height=I+"px"),this.setViewport(0,0,b,I)},this.getDrawingBufferSize=function(b){return b.set(U*W,D*W).floor()},this.setDrawingBufferSize=function(b,I,B){U=b,D=I,W=B,t.width=Math.floor(b*B),t.height=Math.floor(I*B),this.setViewport(0,0,b,I)},this.getCurrentViewport=function(b){return b.copy(_)},this.getViewport=function(b){return b.copy(Y)},this.setViewport=function(b,I,B,k){b.isVector4?Y.set(b.x,b.y,b.z,b.w):Y.set(b,I,B,k),me.viewport(_.copy(Y).multiplyScalar(W).floor())},this.getScissor=function(b){return b.copy(ee)},this.setScissor=function(b,I,B,k){b.isVector4?ee.set(b.x,b.y,b.z,b.w):ee.set(b,I,B,k),me.scissor(T.copy(ee).multiplyScalar(W).floor())},this.getScissorTest=function(){return se},this.setScissorTest=function(b){me.setScissorTest(se=b)},this.setOpaqueSort=function(b){V=b},this.setTransparentSort=function(b){q=b},this.getClearColor=function(b){return b.copy(Ye.getClearColor())},this.setClearColor=function(){Ye.setClearColor.apply(Ye,arguments)},this.getClearAlpha=function(){return Ye.getClearAlpha()},this.setClearAlpha=function(){Ye.setClearAlpha.apply(Ye,arguments)},this.clear=function(b=!0,I=!0,B=!0){let k=0;if(b){let O=!1;if(A!==null){const ae=A.texture.format;O=ae===Jc||ae===Zc||ae===Kc}if(O){const ae=A.texture.type,pe=ae===Un||ae===Ln||ae===Ea||ae===$n||ae===jc||ae===$c,ye=Ye.getClearColor(),Ee=Ye.getClearAlpha(),Ne=ye.r,Ce=ye.g,Le=ye.b;pe?(m[0]=Ne,m[1]=Ce,m[2]=Le,m[3]=Ee,F.clearBufferuiv(F.COLOR,0,m)):(g[0]=Ne,g[1]=Ce,g[2]=Le,g[3]=Ee,F.clearBufferiv(F.COLOR,0,g))}else k|=F.COLOR_BUFFER_BIT}I&&(k|=F.DEPTH_BUFFER_BIT),B&&(k|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Ke,!1),t.removeEventListener("webglcontextrestored",w,!1),t.removeEventListener("webglcontextcreationerror",te,!1),ce.dispose(),be.dispose(),De.dispose(),v.dispose(),z.dispose(),J.dispose(),Ie.dispose(),We.dispose(),fe.dispose(),ke.dispose(),ke.removeEventListener("sessionstart",kt),ke.removeEventListener("sessionend",Je),oe&&(oe.dispose(),oe=null),Rt.stop()};function Ke(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function w(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;const b=st.autoReset,I=K.enabled,B=K.autoUpdate,k=K.needsUpdate,O=K.type;tt(),st.autoReset=b,K.enabled=I,K.autoUpdate=B,K.needsUpdate=k,K.type=O}function te(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function ne(b){const I=b.target;I.removeEventListener("dispose",ne),de(I)}function de(b){xe(b),De.remove(b)}function xe(b){const I=De.get(b).programs;I!==void 0&&(I.forEach(function(B){fe.releaseProgram(B)}),b.isShaderMaterial&&fe.releaseShaderCache(b))}this.renderBufferDirect=function(b,I,B,k,O,ae){I===null&&(I=Ve);const pe=O.isMesh&&O.matrixWorld.determinant()<0,ye=Dl(b,I,B,k,O);me.setMaterial(k,pe);let Ee=B.index,Ne=1;if(k.wireframe===!0){if(Ee=$.getWireframeAttribute(B),Ee===void 0)return;Ne=2}const Ce=B.drawRange,Le=B.attributes.position;let ot=Ce.start*Ne,Nt=(Ce.start+Ce.count)*Ne;ae!==null&&(ot=Math.max(ot,ae.start*Ne),Nt=Math.min(Nt,(ae.start+ae.count)*Ne)),Ee!==null?(ot=Math.max(ot,0),Nt=Math.min(Nt,Ee.count)):Le!=null&&(ot=Math.max(ot,0),Nt=Math.min(Nt,Le.count));const gt=Nt-ot;if(gt<0||gt===1/0)return;Ie.setup(O,k,ye,B,Ee);let hn,rt=Ae;if(Ee!==null&&(hn=Q.get(Ee),rt=ge,rt.setIndex(hn)),O.isMesh)k.wireframe===!0?(me.setLineWidth(k.wireframeLinewidth*Pe()),rt.setMode(F.LINES)):rt.setMode(F.TRIANGLES);else if(O.isLine){let ze=k.linewidth;ze===void 0&&(ze=1),me.setLineWidth(ze*Pe()),O.isLineSegments?rt.setMode(F.LINES):O.isLineLoop?rt.setMode(F.LINE_LOOP):rt.setMode(F.LINE_STRIP)}else O.isPoints?rt.setMode(F.POINTS):O.isSprite&&rt.setMode(F.TRIANGLES);if(O.isBatchedMesh)rt.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else if(O.isInstancedMesh)rt.renderInstances(ot,gt,O.count);else if(B.isInstancedBufferGeometry){const ze=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,fr=Math.min(B.instanceCount,ze);rt.renderInstances(ot,gt,fr)}else rt.render(ot,gt)};function Xe(b,I,B){b.transparent===!0&&b.side===bt&&b.forceSinglePass===!1?(b.side=Ft,b.needsUpdate=!0,fs(b,I,B),b.side=Fn,b.needsUpdate=!0,fs(b,I,B),b.side=bt):fs(b,I,B)}this.compile=function(b,I,B=null){B===null&&(B=b),p=be.get(B),p.init(),y.push(p),B.traverseVisible(function(O){O.isLight&&O.layers.test(I.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),b!==B&&b.traverseVisible(function(O){O.isLight&&O.layers.test(I.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),p.setupLights(M._useLegacyLights);const k=new Set;return b.traverse(function(O){const ae=O.material;if(ae)if(Array.isArray(ae))for(let pe=0;pe<ae.length;pe++){const ye=ae[pe];Xe(ye,B,O),k.add(ye)}else Xe(ae,B,O),k.add(ae)}),y.pop(),p=null,k},this.compileAsync=function(b,I,B=null){const k=this.compile(b,I,B);return new Promise(O=>{function ae(){if(k.forEach(function(pe){De.get(pe).currentProgram.isReady()&&k.delete(pe)}),k.size===0){O(b);return}setTimeout(ae,10)}_e.get("KHR_parallel_shader_compile")!==null?ae():setTimeout(ae,10)})};let Ze=null;function yt(b){Ze&&Ze(b)}function kt(){Rt.stop()}function Je(){Rt.start()}const Rt=new fl;Rt.setAnimationLoop(yt),typeof self<"u"&&Rt.setContext(self),this.setAnimationLoop=function(b){Ze=b,ke.setAnimationLoop(b),b===null?Rt.stop():Rt.start()},ke.addEventListener("sessionstart",kt),ke.addEventListener("sessionend",Je),this.render=function(b,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),ke.enabled===!0&&ke.isPresenting===!0&&(ke.cameraAutoUpdate===!0&&ke.updateCamera(I),I=ke.getCamera()),b.isScene===!0&&b.onBeforeRender(M,b,I,A),p=be.get(b,y.length),p.init(),y.push(p),ve.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),Te.setFromProjectionMatrix(ve),Z=this.localClippingEnabled,H=Fe.init(this.clippingPlanes,Z),x=ce.get(b,f.length),x.init(),f.push(x),rn(b,I,0,M.sortObjects),x.finish(),M.sortObjects===!0&&x.sort(V,q),this.info.render.frame++,H===!0&&Fe.beginShadows();const B=p.state.shadowsArray;if(K.render(B,b,I),H===!0&&Fe.endShadows(),this.info.autoReset===!0&&this.info.reset(),(ke.enabled===!1||ke.isPresenting===!1||ke.hasDepthSensing()===!1)&&Ye.render(x,b),p.setupLights(M._useLegacyLights),I.isArrayCamera){const k=I.cameras;for(let O=0,ae=k.length;O<ae;O++){const pe=k[O];Ua(x,b,pe,pe.viewport)}}else Ua(x,b,I);A!==null&&(E.updateMultisampleRenderTarget(A),E.updateRenderTargetMipmap(A)),b.isScene===!0&&b.onAfterRender(M,b,I),Ie.resetDefaultState(),N=-1,X=null,y.pop(),y.length>0?p=y[y.length-1]:p=null,f.pop(),f.length>0?x=f[f.length-1]:x=null};function rn(b,I,B,k){if(b.visible===!1)return;if(b.layers.test(I.layers)){if(b.isGroup)B=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(I);else if(b.isLight)p.pushLight(b),b.castShadow&&p.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||Te.intersectsSprite(b)){k&&ue.setFromMatrixPosition(b.matrixWorld).applyMatrix4(ve);const pe=J.update(b),ye=b.material;ye.visible&&x.push(b,pe,ye,B,ue.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||Te.intersectsObject(b))){const pe=J.update(b),ye=b.material;if(k&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),ue.copy(b.boundingSphere.center)):(pe.boundingSphere===null&&pe.computeBoundingSphere(),ue.copy(pe.boundingSphere.center)),ue.applyMatrix4(b.matrixWorld).applyMatrix4(ve)),Array.isArray(ye)){const Ee=pe.groups;for(let Ne=0,Ce=Ee.length;Ne<Ce;Ne++){const Le=Ee[Ne],ot=ye[Le.materialIndex];ot&&ot.visible&&x.push(b,pe,ot,B,ue.z,Le)}}else ye.visible&&x.push(b,pe,ye,B,ue.z,null)}}const ae=b.children;for(let pe=0,ye=ae.length;pe<ye;pe++)rn(ae[pe],I,B,k)}function Ua(b,I,B,k){const O=b.opaque,ae=b.transmissive,pe=b.transparent;p.setupLightsView(B),H===!0&&Fe.setGlobalState(M.clippingPlanes,B),ae.length>0&&Ll(O,ae,I,B),k&&me.viewport(_.copy(k)),O.length>0&&us(O,I,B),ae.length>0&&us(ae,I,B),pe.length>0&&us(pe,I,B),me.buffers.depth.setTest(!0),me.buffers.depth.setMask(!0),me.buffers.color.setMask(!0),me.setPolygonOffset(!1)}function Ll(b,I,B,k){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;const ae=we.isWebGL2;oe===null&&(oe=new ei(1,1,{generateMipmaps:!0,type:_e.has("EXT_color_buffer_half_float")?as:Un,minFilter:Yn,samples:ae?4:0})),M.getDrawingBufferSize(Me),ae?oe.setSize(Me.x,Me.y):oe.setSize(tr(Me.x),tr(Me.y));const pe=M.getRenderTarget();M.setRenderTarget(oe),M.getClearColor(j),L=M.getClearAlpha(),L<1&&M.setClearColor(16777215,.5),M.clear();const ye=M.toneMapping;M.toneMapping=In,us(b,B,k),E.updateMultisampleRenderTarget(oe),E.updateRenderTargetMipmap(oe);let Ee=!1;for(let Ne=0,Ce=I.length;Ne<Ce;Ne++){const Le=I[Ne],ot=Le.object,Nt=Le.geometry,gt=Le.material,hn=Le.group;if(gt.side===bt&&ot.layers.test(k.layers)){const rt=gt.side;gt.side=Ft,gt.needsUpdate=!0,Fa(ot,B,k,Nt,gt,hn),gt.side=rt,gt.needsUpdate=!0,Ee=!0}}Ee===!0&&(E.updateMultisampleRenderTarget(oe),E.updateRenderTargetMipmap(oe)),M.setRenderTarget(pe),M.setClearColor(j,L),M.toneMapping=ye}function us(b,I,B){const k=I.isScene===!0?I.overrideMaterial:null;for(let O=0,ae=b.length;O<ae;O++){const pe=b[O],ye=pe.object,Ee=pe.geometry,Ne=k===null?pe.material:k,Ce=pe.group;ye.layers.test(B.layers)&&Fa(ye,I,B,Ee,Ne,Ce)}}function Fa(b,I,B,k,O,ae){b.onBeforeRender(M,I,B,k,O,ae),b.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),O.onBeforeRender(M,I,B,k,b,ae),O.transparent===!0&&O.side===bt&&O.forceSinglePass===!1?(O.side=Ft,O.needsUpdate=!0,M.renderBufferDirect(B,I,k,O,b,ae),O.side=Fn,O.needsUpdate=!0,M.renderBufferDirect(B,I,k,O,b,ae),O.side=bt):M.renderBufferDirect(B,I,k,O,b,ae),b.onAfterRender(M,I,B,k,O,ae)}function fs(b,I,B){I.isScene!==!0&&(I=Ve);const k=De.get(b),O=p.state.lights,ae=p.state.shadowsArray,pe=O.state.version,ye=fe.getParameters(b,O.state,ae,I,B),Ee=fe.getProgramCacheKey(ye);let Ne=k.programs;k.environment=b.isMeshStandardMaterial?I.environment:null,k.fog=I.fog,k.envMap=(b.isMeshStandardMaterial?z:v).get(b.envMap||k.environment),Ne===void 0&&(b.addEventListener("dispose",ne),Ne=new Map,k.programs=Ne);let Ce=Ne.get(Ee);if(Ce!==void 0){if(k.currentProgram===Ce&&k.lightsStateVersion===pe)return za(b,ye),Ce}else ye.uniforms=fe.getUniforms(b),b.onBuild(B,ye,M),b.onBeforeCompile(ye,M),Ce=fe.acquireProgram(ye,Ee),Ne.set(Ee,Ce),k.uniforms=ye.uniforms;const Le=k.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Le.clippingPlanes=Fe.uniform),za(b,ye),k.needsLights=Ul(b),k.lightsStateVersion=pe,k.needsLights&&(Le.ambientLightColor.value=O.state.ambient,Le.lightProbe.value=O.state.probe,Le.directionalLights.value=O.state.directional,Le.directionalLightShadows.value=O.state.directionalShadow,Le.spotLights.value=O.state.spot,Le.spotLightShadows.value=O.state.spotShadow,Le.rectAreaLights.value=O.state.rectArea,Le.ltc_1.value=O.state.rectAreaLTC1,Le.ltc_2.value=O.state.rectAreaLTC2,Le.pointLights.value=O.state.point,Le.pointLightShadows.value=O.state.pointShadow,Le.hemisphereLights.value=O.state.hemi,Le.directionalShadowMap.value=O.state.directionalShadowMap,Le.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Le.spotShadowMap.value=O.state.spotShadowMap,Le.spotLightMatrix.value=O.state.spotLightMatrix,Le.spotLightMap.value=O.state.spotLightMap,Le.pointShadowMap.value=O.state.pointShadowMap,Le.pointShadowMatrix.value=O.state.pointShadowMatrix),k.currentProgram=Ce,k.uniformsList=null,Ce}function Na(b){if(b.uniformsList===null){const I=b.currentProgram.getUniforms();b.uniformsList=Ys.seqWithValue(I.seq,b.uniforms)}return b.uniformsList}function za(b,I){const B=De.get(b);B.outputColorSpace=I.outputColorSpace,B.batching=I.batching,B.instancing=I.instancing,B.instancingColor=I.instancingColor,B.skinning=I.skinning,B.morphTargets=I.morphTargets,B.morphNormals=I.morphNormals,B.morphColors=I.morphColors,B.morphTargetsCount=I.morphTargetsCount,B.numClippingPlanes=I.numClippingPlanes,B.numIntersection=I.numClipIntersection,B.vertexAlphas=I.vertexAlphas,B.vertexTangents=I.vertexTangents,B.toneMapping=I.toneMapping}function Dl(b,I,B,k,O){I.isScene!==!0&&(I=Ve),E.resetTextureUnits();const ae=I.fog,pe=k.isMeshStandardMaterial?I.environment:null,ye=A===null?M.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Sn,Ee=(k.isMeshStandardMaterial?z:v).get(k.envMap||pe),Ne=k.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Ce=!!B.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Le=!!B.morphAttributes.position,ot=!!B.morphAttributes.normal,Nt=!!B.morphAttributes.color;let gt=In;k.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(gt=M.toneMapping);const hn=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,rt=hn!==void 0?hn.length:0,ze=De.get(k),fr=p.state.lights;if(H===!0&&(Z===!0||b!==X)){const Gt=b===X&&k.id===N;Fe.setState(k,b,Gt)}let at=!1;k.version===ze.__version?(ze.needsLights&&ze.lightsStateVersion!==fr.state.version||ze.outputColorSpace!==ye||O.isBatchedMesh&&ze.batching===!1||!O.isBatchedMesh&&ze.batching===!0||O.isInstancedMesh&&ze.instancing===!1||!O.isInstancedMesh&&ze.instancing===!0||O.isSkinnedMesh&&ze.skinning===!1||!O.isSkinnedMesh&&ze.skinning===!0||O.isInstancedMesh&&ze.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&ze.instancingColor===!1&&O.instanceColor!==null||ze.envMap!==Ee||k.fog===!0&&ze.fog!==ae||ze.numClippingPlanes!==void 0&&(ze.numClippingPlanes!==Fe.numPlanes||ze.numIntersection!==Fe.numIntersection)||ze.vertexAlphas!==Ne||ze.vertexTangents!==Ce||ze.morphTargets!==Le||ze.morphNormals!==ot||ze.morphColors!==Nt||ze.toneMapping!==gt||we.isWebGL2===!0&&ze.morphTargetsCount!==rt)&&(at=!0):(at=!0,ze.__version=k.version);let On=ze.currentProgram;at===!0&&(On=fs(k,I,O));let Oa=!1,Hi=!1,pr=!1;const Tt=On.getUniforms(),Bn=ze.uniforms;if(me.useProgram(On.program)&&(Oa=!0,Hi=!0,pr=!0),k.id!==N&&(N=k.id,Hi=!0),Oa||X!==b){Tt.setValue(F,"projectionMatrix",b.projectionMatrix),Tt.setValue(F,"viewMatrix",b.matrixWorldInverse);const Gt=Tt.map.cameraPosition;Gt!==void 0&&Gt.setValue(F,ue.setFromMatrixPosition(b.matrixWorld)),we.logarithmicDepthBuffer&&Tt.setValue(F,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&Tt.setValue(F,"isOrthographic",b.isOrthographicCamera===!0),X!==b&&(X=b,Hi=!0,pr=!0)}if(O.isSkinnedMesh){Tt.setOptional(F,O,"bindMatrix"),Tt.setOptional(F,O,"bindMatrixInverse");const Gt=O.skeleton;Gt&&(we.floatVertexTextures?(Gt.boneTexture===null&&Gt.computeBoneTexture(),Tt.setValue(F,"boneTexture",Gt.boneTexture,E)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}O.isBatchedMesh&&(Tt.setOptional(F,O,"batchingTexture"),Tt.setValue(F,"batchingTexture",O._matricesTexture,E));const mr=B.morphAttributes;if((mr.position!==void 0||mr.normal!==void 0||mr.color!==void 0&&we.isWebGL2===!0)&&Be.update(O,B,On),(Hi||ze.receiveShadow!==O.receiveShadow)&&(ze.receiveShadow=O.receiveShadow,Tt.setValue(F,"receiveShadow",O.receiveShadow)),k.isMeshGouraudMaterial&&k.envMap!==null&&(Bn.envMap.value=Ee,Bn.flipEnvMap.value=Ee.isCubeTexture&&Ee.isRenderTargetTexture===!1?-1:1),Hi&&(Tt.setValue(F,"toneMappingExposure",M.toneMappingExposure),ze.needsLights&&Il(Bn,pr),ae&&k.fog===!0&&re.refreshFogUniforms(Bn,ae),re.refreshMaterialUniforms(Bn,k,W,D,oe),Ys.upload(F,Na(ze),Bn,E)),k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Ys.upload(F,Na(ze),Bn,E),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&Tt.setValue(F,"center",O.center),Tt.setValue(F,"modelViewMatrix",O.modelViewMatrix),Tt.setValue(F,"normalMatrix",O.normalMatrix),Tt.setValue(F,"modelMatrix",O.matrixWorld),k.isShaderMaterial||k.isRawShaderMaterial){const Gt=k.uniformsGroups;for(let gr=0,Fl=Gt.length;gr<Fl;gr++)if(we.isWebGL2){const Ba=Gt[gr];We.update(Ba,On),We.bind(Ba,On)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return On}function Il(b,I){b.ambientLightColor.needsUpdate=I,b.lightProbe.needsUpdate=I,b.directionalLights.needsUpdate=I,b.directionalLightShadows.needsUpdate=I,b.pointLights.needsUpdate=I,b.pointLightShadows.needsUpdate=I,b.spotLights.needsUpdate=I,b.spotLightShadows.needsUpdate=I,b.rectAreaLights.needsUpdate=I,b.hemisphereLights.needsUpdate=I}function Ul(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(b,I,B){De.get(b.texture).__webglTexture=I,De.get(b.depthTexture).__webglTexture=B;const k=De.get(b);k.__hasExternalTextures=!0,k.__hasExternalTextures&&(k.__autoAllocateDepthBuffer=B===void 0,k.__autoAllocateDepthBuffer||_e.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),k.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(b,I){const B=De.get(b);B.__webglFramebuffer=I,B.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(b,I=0,B=0){A=b,C=I,R=B;let k=!0,O=null,ae=!1,pe=!1;if(b){const Ee=De.get(b);Ee.__useDefaultFramebuffer!==void 0?(me.bindFramebuffer(F.FRAMEBUFFER,null),k=!1):Ee.__webglFramebuffer===void 0?E.setupRenderTarget(b):Ee.__hasExternalTextures&&E.rebindTextures(b,De.get(b.texture).__webglTexture,De.get(b.depthTexture).__webglTexture);const Ne=b.texture;(Ne.isData3DTexture||Ne.isDataArrayTexture||Ne.isCompressedArrayTexture)&&(pe=!0);const Ce=De.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Ce[I])?O=Ce[I][B]:O=Ce[I],ae=!0):we.isWebGL2&&b.samples>0&&E.useMultisampledRTT(b)===!1?O=De.get(b).__webglMultisampledFramebuffer:Array.isArray(Ce)?O=Ce[B]:O=Ce,_.copy(b.viewport),T.copy(b.scissor),G=b.scissorTest}else _.copy(Y).multiplyScalar(W).floor(),T.copy(ee).multiplyScalar(W).floor(),G=se;if(me.bindFramebuffer(F.FRAMEBUFFER,O)&&we.drawBuffers&&k&&me.drawBuffers(b,O),me.viewport(_),me.scissor(T),me.setScissorTest(G),ae){const Ee=De.get(b.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+I,Ee.__webglTexture,B)}else if(pe){const Ee=De.get(b.texture),Ne=I||0;F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,Ee.__webglTexture,B||0,Ne)}N=-1},this.readRenderTargetPixels=function(b,I,B,k,O,ae,pe){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=De.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&pe!==void 0&&(ye=ye[pe]),ye){me.bindFramebuffer(F.FRAMEBUFFER,ye);try{const Ee=b.texture,Ne=Ee.format,Ce=Ee.type;if(Ne!==Zt&&le.convert(Ne)!==F.getParameter(F.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Le=Ce===as&&(_e.has("EXT_color_buffer_half_float")||we.isWebGL2&&_e.has("EXT_color_buffer_float"));if(Ce!==Un&&le.convert(Ce)!==F.getParameter(F.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Ce===vn&&(we.isWebGL2||_e.has("OES_texture_float")||_e.has("WEBGL_color_buffer_float")))&&!Le){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=b.width-k&&B>=0&&B<=b.height-O&&F.readPixels(I,B,k,O,le.convert(Ne),le.convert(Ce),ae)}finally{const Ee=A!==null?De.get(A).__webglFramebuffer:null;me.bindFramebuffer(F.FRAMEBUFFER,Ee)}}},this.copyFramebufferToTexture=function(b,I,B=0){const k=Math.pow(2,-B),O=Math.floor(I.image.width*k),ae=Math.floor(I.image.height*k);E.setTexture2D(I,0),F.copyTexSubImage2D(F.TEXTURE_2D,B,0,0,b.x,b.y,O,ae),me.unbindTexture()},this.copyTextureToTexture=function(b,I,B,k=0){const O=I.image.width,ae=I.image.height,pe=le.convert(B.format),ye=le.convert(B.type);E.setTexture2D(B,0),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,B.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,B.unpackAlignment),I.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,k,b.x,b.y,O,ae,pe,ye,I.image.data):I.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,k,b.x,b.y,I.mipmaps[0].width,I.mipmaps[0].height,pe,I.mipmaps[0].data):F.texSubImage2D(F.TEXTURE_2D,k,b.x,b.y,pe,ye,I.image),k===0&&B.generateMipmaps&&F.generateMipmap(F.TEXTURE_2D),me.unbindTexture()},this.copyTextureToTexture3D=function(b,I,B,k,O=0){if(M.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const ae=b.max.x-b.min.x+1,pe=b.max.y-b.min.y+1,ye=b.max.z-b.min.z+1,Ee=le.convert(k.format),Ne=le.convert(k.type);let Ce;if(k.isData3DTexture)E.setTexture3D(k,0),Ce=F.TEXTURE_3D;else if(k.isDataArrayTexture||k.isCompressedArrayTexture)E.setTexture2DArray(k,0),Ce=F.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,k.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,k.unpackAlignment);const Le=F.getParameter(F.UNPACK_ROW_LENGTH),ot=F.getParameter(F.UNPACK_IMAGE_HEIGHT),Nt=F.getParameter(F.UNPACK_SKIP_PIXELS),gt=F.getParameter(F.UNPACK_SKIP_ROWS),hn=F.getParameter(F.UNPACK_SKIP_IMAGES),rt=B.isCompressedTexture?B.mipmaps[O]:B.image;F.pixelStorei(F.UNPACK_ROW_LENGTH,rt.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,rt.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,b.min.x),F.pixelStorei(F.UNPACK_SKIP_ROWS,b.min.y),F.pixelStorei(F.UNPACK_SKIP_IMAGES,b.min.z),B.isDataTexture||B.isData3DTexture?F.texSubImage3D(Ce,O,I.x,I.y,I.z,ae,pe,ye,Ee,Ne,rt.data):B.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),F.compressedTexSubImage3D(Ce,O,I.x,I.y,I.z,ae,pe,ye,Ee,rt.data)):F.texSubImage3D(Ce,O,I.x,I.y,I.z,ae,pe,ye,Ee,Ne,rt),F.pixelStorei(F.UNPACK_ROW_LENGTH,Le),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,ot),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Nt),F.pixelStorei(F.UNPACK_SKIP_ROWS,gt),F.pixelStorei(F.UNPACK_SKIP_IMAGES,hn),O===0&&k.generateMipmaps&&F.generateMipmap(Ce),me.unbindTexture()},this.initTexture=function(b){b.isCubeTexture?E.setTextureCube(b,0):b.isData3DTexture?E.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?E.setTexture2DArray(b,0):E.setTexture2D(b,0),me.unbindTexture()},this.resetState=function(){C=0,R=0,A=null,me.reset(),Ie.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Mn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Ta?"display-p3":"srgb",t.unpackColorSpace=je.workingColorSpace===cr?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===dt?Zn:el}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===Zn?dt:Sn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class xg extends yl{}xg.prototype.isWebGL1Renderer=!0;class Pa{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Re(e),this.near=t,this.far=n}clone(){return new Pa(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class vg extends lt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}}class Mg{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=fa,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=yn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return Jn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=yn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=yn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ct=new P;class ir{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix4(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyNormalMatrix(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.transformDirection(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Jt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=qe(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=qe(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=qe(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=qe(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=qe(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Jt(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Jt(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Jt(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Jt(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=qe(t,this.array),n=qe(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=qe(t,this.array),n=qe(n,this.array),s=qe(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=qe(t,this.array),n=qe(n,this.array),s=qe(s,this.array),r=qe(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Et(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new ir(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Ci extends zn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Re(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let vi;const Ki=new P,Mi=new P,yi=new P,Si=new Se,Zi=new Se,Sl=new Qe,Bs=new P,Ji=new P,ks=new P,pc=new Se,qr=new Se,mc=new Se;class ss extends lt{constructor(e=new Ci){if(super(),this.isSprite=!0,this.type="Sprite",vi===void 0){vi=new ft;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Mg(t,5);vi.setIndex([0,1,2,0,2,3]),vi.setAttribute("position",new ir(n,3,0,!1)),vi.setAttribute("uv",new ir(n,2,3,!1))}this.geometry=vi,this.material=e,this.center=new Se(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Mi.setFromMatrixScale(this.matrixWorld),Sl.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),yi.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Mi.multiplyScalar(-yi.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const o=this.center;Gs(Bs.set(-.5,-.5,0),yi,o,Mi,s,r),Gs(Ji.set(.5,-.5,0),yi,o,Mi,s,r),Gs(ks.set(.5,.5,0),yi,o,Mi,s,r),pc.set(0,0),qr.set(1,0),mc.set(1,1);let a=e.ray.intersectTriangle(Bs,Ji,ks,!1,Ki);if(a===null&&(Gs(Ji.set(-.5,.5,0),yi,o,Mi,s,r),qr.set(0,1),a=e.ray.intersectTriangle(Bs,ks,Ji,!1,Ki),a===null))return;const c=e.ray.origin.distanceTo(Ki);c<e.near||c>e.far||t.push({distance:c,point:Ki.clone(),uv:Qt.getInterpolation(Ki,Bs,Ji,ks,pc,qr,mc,new Se),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Gs(i,e,t,n,s,r){Si.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Zi.x=r*Si.x-s*Si.y,Zi.y=s*Si.x+r*Si.y):Zi.copy(Si),i.copy(e),i.x+=Zi.x,i.y+=Zi.y,i.applyMatrix4(Sl)}class gc extends Et{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const bi=new Qe,_c=new Qe,Hs=[],xc=new ti,yg=new Qe,Qi=new he,es=new ni;class vc extends he{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new gc(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,yg)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ti),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,bi),xc.copy(e.boundingBox).applyMatrix4(bi),this.boundingBox.union(xc)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ni),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,bi),es.copy(e.boundingSphere).applyMatrix4(bi),this.boundingSphere.union(es)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}raycast(e,t){const n=this.matrixWorld,s=this.count;if(Qi.geometry=this.geometry,Qi.material=this.material,Qi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),es.copy(this.boundingSphere),es.applyMatrix4(n),e.ray.intersectsSphere(es)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,bi),_c.multiplyMatrices(n,bi),Qi.matrixWorld=_c,Qi.raycast(e,Hs);for(let o=0,a=Hs.length;o<a;o++){const c=Hs[o];c.instanceId=r,c.object=this,t.push(c)}Hs.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new gc(new Float32Array(this.instanceMatrix.count*3),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class La extends zn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Re(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Mc=new P,yc=new P,Sc=new Qe,Yr=new lr,Vs=new ni;class bl extends lt{constructor(e=new ft,t=new La){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Mc.fromBufferAttribute(t,s-1),yc.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Mc.distanceTo(yc);e.setAttribute("lineDistance",new et(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Vs.copy(n.boundingSphere),Vs.applyMatrix4(s),Vs.radius+=r,e.ray.intersectsSphere(Vs)===!1)return;Sc.copy(s).invert(),Yr.copy(e.ray).applyMatrix4(Sc);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,h=new P,l=new P,d=new P,u=new P,m=this.isLineSegments?2:1,g=n.index,p=n.attributes.position;if(g!==null){const f=Math.max(0,o.start),y=Math.min(g.count,o.start+o.count);for(let M=f,S=y-1;M<S;M+=m){const C=g.getX(M),R=g.getX(M+1);if(h.fromBufferAttribute(p,C),l.fromBufferAttribute(p,R),Yr.distanceSqToSegment(h,l,u,d)>c)continue;u.applyMatrix4(this.matrixWorld);const N=e.ray.origin.distanceTo(u);N<e.near||N>e.far||t.push({distance:N,point:d.clone().applyMatrix4(this.matrixWorld),index:M,face:null,faceIndex:null,object:this})}}else{const f=Math.max(0,o.start),y=Math.min(p.count,o.start+o.count);for(let M=f,S=y-1;M<S;M+=m){if(h.fromBufferAttribute(p,M),l.fromBufferAttribute(p,M+1),Yr.distanceSqToSegment(h,l,u,d)>c)continue;u.applyMatrix4(this.matrixWorld);const R=e.ray.origin.distanceTo(u);R<e.near||R>e.far||t.push({distance:R,point:d.clone().applyMatrix4(this.matrixWorld),index:M,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}class El extends zn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Re(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const bc=new Qe,_a=new lr,Ws=new ni,Xs=new P;class Sg extends lt{constructor(e=new ft,t=new El){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ws.copy(n.boundingSphere),Ws.applyMatrix4(s),Ws.radius+=r,e.ray.intersectsSphere(Ws)===!1)return;bc.copy(s).invert(),_a.copy(e.ray).applyMatrix4(bc);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,h=n.index,d=n.attributes.position;if(h!==null){const u=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let g=u,x=m;g<x;g++){const p=h.getX(g);Xs.fromBufferAttribute(d,p),Ec(Xs,p,c,s,e,t,this)}}else{const u=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let g=u,x=m;g<x;g++)Xs.fromBufferAttribute(d,g),Ec(Xs,g,c,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Ec(i,e,t,n,s,r,o){const a=_a.distanceSqToPoint(i);if(a<t){const c=new P;_a.closestPointToPoint(i,c),c.applyMatrix4(n);const h=s.ray.origin.distanceTo(c);if(h<s.near||h>s.far)return;r.push({distance:h,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,object:o})}}class ur extends It{constructor(e,t,n,s,r,o,a,c,h){super(e,t,n,s,r,o,a,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class cs extends ft{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],o=[],a=[],c=[],h=new P,l=new Se;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let d=0,u=3;d<=t;d++,u+=3){const m=n+d/t*s;h.x=e*Math.cos(m),h.y=e*Math.sin(m),o.push(h.x,h.y,h.z),a.push(0,0,1),l.x=(o[u]/e+1)/2,l.y=(o[u+1]/e+1)/2,c.push(l.x,l.y)}for(let d=1;d<=t;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new et(o,3)),this.setAttribute("normal",new et(a,3)),this.setAttribute("uv",new et(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new cs(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class St extends ft{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const h=this;s=Math.floor(s),r=Math.floor(r);const l=[],d=[],u=[],m=[];let g=0;const x=[],p=n/2;let f=0;y(),o===!1&&(e>0&&M(!0),t>0&&M(!1)),this.setIndex(l),this.setAttribute("position",new et(d,3)),this.setAttribute("normal",new et(u,3)),this.setAttribute("uv",new et(m,2));function y(){const S=new P,C=new P;let R=0;const A=(t-e)/n;for(let N=0;N<=r;N++){const X=[],_=N/r,T=_*(t-e)+e;for(let G=0;G<=s;G++){const j=G/s,L=j*c+a,U=Math.sin(L),D=Math.cos(L);C.x=T*U,C.y=-_*n+p,C.z=T*D,d.push(C.x,C.y,C.z),S.set(U,A,D).normalize(),u.push(S.x,S.y,S.z),m.push(j,1-_),X.push(g++)}x.push(X)}for(let N=0;N<s;N++)for(let X=0;X<r;X++){const _=x[X][N],T=x[X+1][N],G=x[X+1][N+1],j=x[X][N+1];l.push(_,T,j),l.push(T,G,j),R+=6}h.addGroup(f,R,0),f+=R}function M(S){const C=g,R=new Se,A=new P;let N=0;const X=S===!0?e:t,_=S===!0?1:-1;for(let G=1;G<=s;G++)d.push(0,p*_,0),u.push(0,_,0),m.push(.5,.5),g++;const T=g;for(let G=0;G<=s;G++){const L=G/s*c+a,U=Math.cos(L),D=Math.sin(L);A.x=X*D,A.y=p*_,A.z=X*U,d.push(A.x,A.y,A.z),u.push(0,_,0),R.x=U*.5+.5,R.y=D*.5*_+.5,m.push(R.x,R.y),g++}for(let G=0;G<s;G++){const j=C+G,L=T+G;S===!0?l.push(L,L+1,j):l.push(L+1,L,j),N+=3}h.addGroup(f,N,S===!0?1:2),f+=N}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new St(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Pn extends St{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new Pn(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Gi extends ft{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};const r=[],o=[];a(s),h(n),l(),this.setAttribute("position",new et(r,3)),this.setAttribute("normal",new et(r.slice(),3)),this.setAttribute("uv",new et(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(y){const M=new P,S=new P,C=new P;for(let R=0;R<t.length;R+=3)m(t[R+0],M),m(t[R+1],S),m(t[R+2],C),c(M,S,C,y)}function c(y,M,S,C){const R=C+1,A=[];for(let N=0;N<=R;N++){A[N]=[];const X=y.clone().lerp(S,N/R),_=M.clone().lerp(S,N/R),T=R-N;for(let G=0;G<=T;G++)G===0&&N===R?A[N][G]=X:A[N][G]=X.clone().lerp(_,G/T)}for(let N=0;N<R;N++)for(let X=0;X<2*(R-N)-1;X++){const _=Math.floor(X/2);X%2===0?(u(A[N][_+1]),u(A[N+1][_]),u(A[N][_])):(u(A[N][_+1]),u(A[N+1][_+1]),u(A[N+1][_]))}}function h(y){const M=new P;for(let S=0;S<r.length;S+=3)M.x=r[S+0],M.y=r[S+1],M.z=r[S+2],M.normalize().multiplyScalar(y),r[S+0]=M.x,r[S+1]=M.y,r[S+2]=M.z}function l(){const y=new P;for(let M=0;M<r.length;M+=3){y.x=r[M+0],y.y=r[M+1],y.z=r[M+2];const S=p(y)/2/Math.PI+.5,C=f(y)/Math.PI+.5;o.push(S,1-C)}g(),d()}function d(){for(let y=0;y<o.length;y+=6){const M=o[y+0],S=o[y+2],C=o[y+4],R=Math.max(M,S,C),A=Math.min(M,S,C);R>.9&&A<.1&&(M<.2&&(o[y+0]+=1),S<.2&&(o[y+2]+=1),C<.2&&(o[y+4]+=1))}}function u(y){r.push(y.x,y.y,y.z)}function m(y,M){const S=y*3;M.x=e[S+0],M.y=e[S+1],M.z=e[S+2]}function g(){const y=new P,M=new P,S=new P,C=new P,R=new Se,A=new Se,N=new Se;for(let X=0,_=0;X<r.length;X+=9,_+=6){y.set(r[X+0],r[X+1],r[X+2]),M.set(r[X+3],r[X+4],r[X+5]),S.set(r[X+6],r[X+7],r[X+8]),R.set(o[_+0],o[_+1]),A.set(o[_+2],o[_+3]),N.set(o[_+4],o[_+5]),C.copy(y).add(M).add(S).divideScalar(3);const T=p(C);x(R,_+0,y,T),x(A,_+2,M,T),x(N,_+4,S,T)}}function x(y,M,S,C){C<0&&y.x===1&&(o[M]=y.x-1),S.x===0&&S.z===0&&(o[M]=C/2/Math.PI+.5)}function p(y){return Math.atan2(y.z,-y.x)}function f(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gi(e.vertices,e.indices,e.radius,e.details)}}class Pi extends Gi{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Pi(e.radius,e.detail)}}class wi extends Gi{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new wi(e.radius,e.detail)}}class Ni extends Gi{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ni(e.radius,e.detail)}}class Qn extends ft{constructor(e=.5,t=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);const a=[],c=[],h=[],l=[];let d=e;const u=(t-e)/s,m=new P,g=new Se;for(let x=0;x<=s;x++){for(let p=0;p<=n;p++){const f=r+p/n*o;m.x=d*Math.cos(f),m.y=d*Math.sin(f),c.push(m.x,m.y,m.z),h.push(0,0,1),g.x=(m.x/t+1)/2,g.y=(m.y/t+1)/2,l.push(g.x,g.y)}d+=u}for(let x=0;x<s;x++){const p=x*(n+1);for(let f=0;f<n;f++){const y=f+p,M=y,S=y+n+1,C=y+n+2,R=y+1;a.push(M,S,R),a.push(S,C,R)}}this.setIndex(a),this.setAttribute("position",new et(c,3)),this.setAttribute("normal",new et(h,3)),this.setAttribute("uv",new et(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qn(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class an extends ft{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let h=0;const l=[],d=new P,u=new P,m=[],g=[],x=[],p=[];for(let f=0;f<=n;f++){const y=[],M=f/n;let S=0;f===0&&o===0?S=.5/t:f===n&&c===Math.PI&&(S=-.5/t);for(let C=0;C<=t;C++){const R=C/t;d.x=-e*Math.cos(s+R*r)*Math.sin(o+M*a),d.y=e*Math.cos(o+M*a),d.z=e*Math.sin(s+R*r)*Math.sin(o+M*a),g.push(d.x,d.y,d.z),u.copy(d).normalize(),x.push(u.x,u.y,u.z),p.push(R+S,1-M),y.push(h++)}l.push(y)}for(let f=0;f<n;f++)for(let y=0;y<t;y++){const M=l[f][y+1],S=l[f][y],C=l[f+1][y],R=l[f+1][y+1];(f!==0||o>0)&&m.push(M,S,R),(f!==n-1||c<Math.PI)&&m.push(S,C,R)}this.setIndex(m),this.setAttribute("position",new et(g,3)),this.setAttribute("normal",new et(x,3)),this.setAttribute("uv",new et(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new an(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Da extends Gi{constructor(e=1,t=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],s=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,s,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Da(e.radius,e.detail)}}class ls extends ft{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],c=[],h=[],l=new P,d=new P,u=new P;for(let m=0;m<=n;m++)for(let g=0;g<=s;g++){const x=g/s*r,p=m/n*Math.PI*2;d.x=(e+t*Math.cos(p))*Math.cos(x),d.y=(e+t*Math.cos(p))*Math.sin(x),d.z=t*Math.sin(p),a.push(d.x,d.y,d.z),l.x=e*Math.cos(x),l.y=e*Math.sin(x),u.subVectors(d,l).normalize(),c.push(u.x,u.y,u.z),h.push(g/s),h.push(m/n)}for(let m=1;m<=n;m++)for(let g=1;g<=s;g++){const x=(s+1)*m+g-1,p=(s+1)*(m-1)+g-1,f=(s+1)*(m-1)+g,y=(s+1)*m+g;o.push(x,p,y),o.push(p,f,y)}this.setIndex(o),this.setAttribute("position",new et(a,3)),this.setAttribute("normal",new et(c,3)),this.setAttribute("uv",new et(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ls(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Ge extends zn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Re(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Re(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=tl,this.normalScale=new Se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Ia extends lt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Re(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}class bg extends Ia{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(lt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Re(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const jr=new Qe,Tc=new P,wc=new P;class Tl{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Se(512,512),this.map=null,this.mapPass=null,this.matrix=new Qe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ra,this._frameExtents=new Se(1,1),this._viewportCount=1,this._viewports=[new it(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Tc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Tc),wc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(wc),t.updateMatrixWorld(),jr.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(jr),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(jr)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Ac=new Qe,ts=new P,$r=new P;class Eg extends Tl{constructor(){super(new Bt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Se(4,2),this._viewportCount=6,this._viewports=[new it(2,1,1,1),new it(0,1,1,1),new it(3,1,1,1),new it(1,1,1,1),new it(3,0,1,1),new it(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),ts.setFromMatrixPosition(e.matrixWorld),n.position.copy(ts),$r.copy(n.position),$r.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt($r),n.updateMatrixWorld(),s.makeTranslation(-ts.x,-ts.y,-ts.z),Ac.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ac)}}class wl extends Ia{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Eg}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Tg extends Tl{constructor(){super(new pl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class wg extends Ia{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(lt.DEFAULT_UP),this.updateMatrix(),this.target=new lt,this.shadow=new Tg}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Ag{constructor(e,t,n=0,s=1/0){this.ray=new lr(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Aa,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}intersectObject(e,t=!0,n=[]){return xa(e,this,n,t),n.sort(Rc),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)xa(e[s],this,n,t);return n.sort(Rc),n}}function Rc(i,e){return i.distance-e.distance}function xa(i,e,t,n){if(i.layers.test(e.layers)&&i.raycast(e,t),n===!0){const s=i.children;for(let r=0,o=s.length;r<o;r++)xa(s[r],e,t,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ba}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ba);function Rg(i,e=1024){const t=document.createElement("canvas");t.width=t.height=e;const n=t.getContext("2d"),s=e/100,r=(h,l)=>[(h+50)*s,(l+50)*s];n.fillStyle="#141a26",n.fillRect(0,0,e,e);for(let h=0;h<2600;h++){const l=Math.random()*e,d=Math.random()*e,u=2+Math.random()*14,m=Math.random();n.fillStyle=m<.5?"rgba(30,40,58,0.25)":"rgba(10,14,22,0.3)",n.beginPath(),n.arc(l,d,u,0,Math.PI*2),n.fill()}n.strokeStyle="rgba(70,90,130,0.08)",n.lineWidth=1;for(let h=0;h<=100;h+=5)n.beginPath(),n.moveTo(h*s,0),n.lineTo(h*s,e),n.stroke(),n.beginPath(),n.moveTo(0,h*s),n.lineTo(e,h*s),n.stroke();for(const h of i)n.lineCap="round",n.lineJoin="round",n.strokeStyle="rgba(120,150,200,0.10)",n.lineWidth=11*s*.5,Kr(n,h,r),n.strokeStyle="#2a3550",n.lineWidth=7.5*s*.5,Kr(n,h,r),n.strokeStyle="rgba(150,175,220,0.14)",n.lineWidth=3.4*s*.5,Kr(n,h,r);const[o,a]=r(0,0);n.strokeStyle="rgba(80,200,255,0.35)",n.lineWidth=2,n.beginPath(),n.arc(o,a,4.6*s*.5,0,Math.PI*2),n.stroke(),n.strokeStyle="rgba(80,200,255,0.15)",n.lineWidth=6,n.beginPath(),n.arc(o,a,6.2*s*.5,0,Math.PI*2),n.stroke();const c=new ur(t);return c.anisotropy=4,c.colorSpace=dt,c}function Kr(i,e,t){i.beginPath();const n=e.points,[s,r]=t(n[0].x,n[0].z);i.moveTo(s,r);for(let o=1;o<n.length;o++){const[a,c]=t(n[o].x,n[o].z);i.lineTo(a,c)}i.stroke()}function va(){const i=document.createElement("canvas");i.width=i.height=64;const e=i.getContext("2d"),t=e.createRadialGradient(32,32,0,32,32,32);return t.addColorStop(0,"rgba(255,255,255,1)"),t.addColorStop(.35,"rgba(255,255,255,0.5)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,64,64),new ur(i)}function Cc(i){const e=document.createElement("canvas");e.width=64,e.height=10;const t=e.getContext("2d");t.clearRect(0,0,64,10),t.fillStyle="rgba(8,10,16,0.85)",Pc(t,1,1,62,8,3),t.fill();const n=Math.max(0,Math.min(1,i)),s=120*n;t.fillStyle="hsl("+s+",80%,55%)",n>.02&&(Pc(t,2,2,Math.max(2,60*n),6,2),t.fill());const r=new ur(e);return r.colorSpace=dt,r}function Pc(i,e,t,n,s,r){i.beginPath(),i.moveTo(e+r,t),i.arcTo(e+n,t,e+n,t+s,r),i.arcTo(e+n,t+s,e,t+s,r),i.arcTo(e,t+s,e,t,r),i.arcTo(e,t,e+n,t,r),i.closePath()}function Lc(i,e,t=28){const n=document.createElement("canvas");n.width=256,n.height=96;const s=n.getContext("2d");s.clearRect(0,0,n.width,n.height),s.font="bold "+t+'px "Segoe UI", system-ui, sans-serif',s.textAlign="center",s.textBaseline="middle",s.lineWidth=5,s.strokeStyle="rgba(0,0,0,0.8)",s.strokeText(i,128,48),s.fillStyle=e,s.fillText(i,128,48);const r=new ur(n);return r.colorSpace=dt,r}function Cg(i,e,t){const n=va(),s=Rg(e.lanes),r=new he(new ds(104,104),new Ge({map:s,roughness:.95,metalness:.05}));r.rotation.x=-Math.PI/2,r.receiveShadow=t!=="low",i.add(r);const o=new he(new Qn(50.5,60,64),new en({color:329484,side:bt}));o.rotation.x=-Math.PI/2,o.position.y=-.02,i.add(o);const a=new Pi(1,0),c=new Ge({color:3752282,roughness:.9,flatShading:!0}),h=new St(.18,.26,1.1,6),l=new Ge({color:4864038,roughness:1}),d=new Pn(1.1,2.2,7),u=new Ge({color:2906692,roughness:.9,flatShading:!0}),m=new Vt(1.4,2.2,1.4),g=new Ge({color:4871280,roughness:.85,flatShading:!0}),x=new Ni(.5,0),p=new Ge({color:7028696,emissive:4923352,emissiveIntensity:.9,roughness:.3});for(const U of e.features){let D;switch(U.kind){case"rock":D=new he(a,c);break;case"tree":D=new he(d,u);break;case"ruin":D=new he(m,g);break;case"crystal":D=new he(x,p);break}D.position.set(U.pos.x,0,U.pos.z),D.rotation.y=U.rot;const W=U.scale;if(U.kind==="tree"){const V=new Xt,q=new he(h,l);q.position.y=.55;const Y=new he(d,u);Y.position.y=2.1,Y.scale.setScalar(W),q.scale.setScalar(W),V.add(q,Y),V.position.set(U.pos.x,0,U.pos.z),V.rotation.y=U.rot,t!=="low"&&(Y.castShadow=!0),i.add(V);continue}D.scale.setScalar(W),U.kind==="crystal"?(D.position.y=.5*W,D.scale.set(W*.8,W*1.3,W*.8)):U.kind==="ruin"?(D.position.y=1.1*W,D.rotation.z=Math.sin(U.rot*3)*.12):(D.position.y=.35*W,D.scale.set(W,W*.7,W)),t!=="low"&&(D.castShadow=!0),i.add(D)}const f=[],y=[],M=[9064408,9064408,9064408,14176158,5232824];for(let U=0;U<e.lanes.length;U++){const W=e.lanes[U].portal,V=new Xt;V.position.set(W.x,0,W.z);const q=new he(new ls(2.1,.28,10,28),new Ge({color:2761792,emissive:M[U],emissiveIntensity:.7,roughness:.4}));q.position.y=2.2,V.add(q);const Y=new he(new cs(1.85,28),new en({color:M[U],transparent:!0,opacity:.35,side:bt,depthWrite:!1}));Y.position.y=2.2,V.add(Y),y.push(Y);const ee=new he(new St(2.5,2.9,.5,10),new Ge({color:3357781,roughness:.9,flatShading:!0}));ee.position.y=.25,t!=="low"&&(ee.castShadow=!0),V.add(ee);const se=new ss(new Ci({map:n,color:M[U],transparent:!0,opacity:.5,depthWrite:!1}));se.scale.setScalar(6),se.position.y=2.2,V.add(se),i.add(V),f.push(V)}const S=new Xt,C=new he(new St(2.6,3.2,1,8),new Ge({color:3818848,roughness:.8,flatShading:!0}));C.position.y=.5,t!=="low"&&(C.castShadow=!0),S.add(C);const R=new he(new ls(3.4,.12,8,40),new Ge({color:2766160,emissive:3115263,emissiveIntensity:.5}));R.rotation.x=Math.PI/2,R.position.y=.35,S.add(R);const A=new he(new Ni(1.5,0),new Ge({color:10479871,emissive:4184319,emissiveIntensity:1.4,roughness:.15,metalness:.2}));A.position.y=3,A.scale.set(1,1.5,1),t!=="low"&&(A.castShadow=!0),S.add(A);const N=new wl(5232895,30,26,1.8);N.position.y=3.2,S.add(N);const X=new ss(new Ci({map:n,color:5232895,transparent:!0,opacity:.6,depthWrite:!1}));X.scale.setScalar(9),X.position.y=3,S.add(X);for(let U=0;U<4;U++){const D=new he(new Da(.35,0),new Ge({color:9427199,emissive:4172031,emissiveIntensity:1}));D.position.y=3,S.add(D)}i.add(S);const _=[],T=[],G=new Qn(1.05,1.3,24),j=new cs(1.05,24);for(const U of e.pads){const D=new he(G,new en({color:4153231,transparent:!0,opacity:0,side:bt,depthWrite:!1}));D.rotation.x=-Math.PI/2,D.position.set(U.pos.x,.06,U.pos.z),i.add(D),_.push(D);const W=new he(j,new en({color:3100543,transparent:!0,opacity:0,side:bt,depthWrite:!1}));W.rotation.x=-Math.PI/2,W.position.set(U.pos.x,.05,U.pos.z),i.add(W),T.push(W)}const L=[];for(const U of e.lanes){const D=new ft().setFromPoints(U.points.map(V=>new P(V.x,.15,V.z))),W=new bl(D,new La({color:16711935,transparent:!0,opacity:.8}));W.visible=!1,i.add(W),L.push(W)}return{portals:f,portalDiscs:y,bastion:S,bastionCrystal:A,bastionLight:N,padRings:_,padDiscs:T,laneLines:L}}const Pg=["crawler","wisp","brute","bulwark","shaman","colossus"],Zr=96,Dc=40,Ic=24,Uc=40;class Lg{constructor(e,t){this.canvas=e,this.sharedGlow=va(),this.renderer=new yl({canvas:e,antialias:!0,powerPreference:"high-performance"}),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Vc,this.renderer.toneMapping=Xc,this.renderer.toneMappingExposure=1.05,this.camera=new Bt(46,1,.1,300),this.camera.position.copy(this.camPos),this.scene.background=new Re(658968),this.scene.fog=new Pa(658968,60,130),this.hemi=new bg(9417983,1709094,.55),this.scene.add(this.hemi),this.dir=new wg(16773853,1.6),this.dir.position.set(28,42,18),this.dir.castShadow=!0,this.dir.shadow.mapSize.set(2048,2048),this.dir.shadow.camera.left=-55,this.dir.shadow.camera.right=55,this.dir.shadow.camera.top=55,this.dir.shadow.camera.bottom=-55,this.dir.shadow.camera.far=120,this.dir.shadow.bias=-4e-4,this.scene.add(this.dir),this.world=Cg(this.scene,t,this.quality),this.buildEnemyMeshes(),this.bossGroup=this.buildBoss(),this.scene.add(this.bossGroup),this.playerGroup=this.buildPlayer(),this.scene.add(this.playerGroup),this.buildProjectileMeshes(),this.buildParticles(),this.buildPatches(),this.buildBeams(),this.buildBars(),this.buildTexts(),this.ghost=this.buildGhost(),this.rangeRing=new he(new Qn(.96,1,48),new en({color:5232895,transparent:!0,opacity:.5,side:bt,depthWrite:!1})),this.rangeRing.rotation.x=-Math.PI/2,this.rangeRing.visible=!1,this.scene.add(this.rangeRing),this.shockwave=new he(new Qn(.9,1,64),new en({color:16767055,transparent:!0,opacity:0,side:bt,depthWrite:!1,blending:$s})),this.shockwave.rotation.x=-Math.PI/2,this.shockwave.position.y=.1,this.shockwave.visible=!1,this.scene.add(this.shockwave),this.hazardRing=new he(new Qn(.85,1,48),new en({color:11816920,transparent:!0,opacity:.5,side:bt,depthWrite:!1})),this.hazardRing.rotation.x=-Math.PI/2,this.hazardRing.position.y=.12,this.hazardRing.visible=!1,this.scene.add(this.hazardRing),this.playerLight=new wl(10479871,12,12,2),this.playerLight.position.y=1.6,this.scene.add(this.playerLight),this.resize()}renderer;scene=new vg;camera;world;quality="high";enemyMeshes=new Map;bossGroup;playerGroup;towerGroups=new Map;projMeshes=new Map;points;pGeo;patchMeshes=[];beams=[];bars=[];texts=[];ghost;rangeRing;camPos=new P(0,27,21);camTarget=new P(0,0,0);shake=0;raycaster=new Ag;groundPlane=new Cn(new P(0,1,0),0);dummy=new lt;tmpColor=new Re;time=0;hoverPad=-1;hoverValid=!0;buildSelection=null;selectedTowerId=-1;showRanges=!1;barCursor=0;textCursor=0;beamCursor=0;sharedGlow;hemi;dir;zoomCur=1;shockwave;shockT=0;hazardRing;playerLight;prevEra=-1;buildEnemyMeshes(){const e=[["crawler",new wi(.55,0),new Ge({color:9064408,roughness:.8,flatShading:!0})],["wisp",new an(.42,10,8),new Ge({color:5564671,emissive:3135743,emissiveIntensity:1.2,roughness:.3})],["brute",new Pi(.95,0),new Ge({color:14176094,roughness:.85,flatShading:!0})],["bulwark",new Vt(1.5,1.7,1.1),new Ge({color:10135480,roughness:.6,metalness:.3,flatShading:!0})],["shaman",new Pn(.55,1.5,6),new Ge({color:7208862,emissive:3135594,emissiveIntensity:.7,roughness:.5,flatShading:!0})],["colossus",new Pi(1.5,0),new Ge({color:11816920,roughness:.7,flatShading:!0})]];for(const[t,n,s]of e){const r=new vc(n,s,260);r.count=0,r.instanceMatrix.setUsage(Xi),r.castShadow=this.quality!=="low",r.frustumCulled=!1;const o=new Re(ln[t].color);for(let a=0;a<260;a++)r.setColorAt(a,o);r.instanceColor&&(r.instanceColor.needsUpdate=!0),this.scene.add(r),this.enemyMeshes.set(t,r)}}buildBoss(){const e=new Xt,t=new he(new Pi(2.4,0),new Ge({color:4860554,emissive:7024600,emissiveIntensity:.5,roughness:.6,flatShading:!0}));t.position.y=2.2,t.castShadow=!0,e.add(t);const n=new he(new Ni(1.1,0),new Ge({color:7028696,emissive:9064408,emissiveIntensity:.9,flatShading:!0}));n.position.set(0,4.2,1.2),e.add(n);for(let r=0;r<6;r++){const o=new he(new Pn(.35,1.6,5),new Ge({color:9064408,emissive:4923352,emissiveIntensity:.6,flatShading:!0})),a=r/6*Math.PI*2;o.position.set(Math.cos(a)*2.2,2.6,Math.sin(a)*2.2),o.lookAt(Math.cos(a)*5,3.4,Math.sin(a)*5),o.rotateX(Math.PI/2),e.add(o)}const s=new he(new an(3.4,16,12),new en({color:9431295,transparent:!0,opacity:.22,depthWrite:!1}));return s.position.y=2.4,s.visible=!1,e.add(s),e.userData={body:t,head:n,shield:s},e.visible=!1,e}buildPlayer(){const e=new Xt,t=new Ge({color:4876959,roughness:.6,metalness:.2,flatShading:!0}),n=new Ge({color:3100543,roughness:.7,flatShading:!0}),s=new Ge({color:10479871,emissive:5232895,emissiveIntensity:1.6,roughness:.3}),r=new he(new St(.42,.5,.9,7),t);r.position.y=1.05,r.castShadow=!0,e.add(r);const o=new he(new wi(.32,0),t);o.position.y=1.75,e.add(o);const a=new he(new Vt(.34,.1,.2),s);a.position.set(0,1.78,.2),e.add(a);for(const x of[-1,1]){const p=new he(new wi(.26,0),n);p.position.set(x*.55,1.42,0),e.add(p)}const c=new he(new St(.05,.05,1.7,5),n);c.position.set(.5,1.1,.35),c.rotation.z=-.25,e.add(c);const h=new he(new an(.16,10,8),s);h.position.set(.66,1.92,.35),e.add(h);const l=new Xt,d=new Ge({color:13623536,roughness:.25,metalness:.85,flatShading:!0}),u=new he(new Vt(.09,1.1,.025),d);u.position.y=.55,u.castShadow=!0;const m=new he(new Vt(.3,.06,.09),n),g=new he(new St(.04,.045,.3,5),new Ge({color:4864038,roughness:.9,flatShading:!0}));return g.position.y=-.15,l.add(u,m,g),l.position.set(.62,1.05,.25),l.rotation.z=-.5,e.add(l),e.userData={orb:h,sword:l},e}buildProjectileMeshes(){const e=[["bolt",new an(.26,8,6),new Ge({color:10479871,emissive:5232895,emissiveIntensity:2})],["lance",new Pn(.3,1.1,6),new Ge({color:16767055,emissive:16747586,emissiveIntensity:1.6})],["ember",new an(.4,8,6),new Ge({color:16747586,emissive:16731935,emissiveIntensity:2})],["void",new an(.5,8,6),new Ge({color:11816920,emissive:9056216,emissiveIntensity:2})]];for(const[t,n,s]of e){const r=new vc(n,s,220);r.count=0,r.instanceMatrix.setUsage(Xi),r.frustumCulled=!1,this.scene.add(r),this.projMeshes.set(t,r)}}buildParticles(){this.pGeo=new ft;const e=new Float32Array(xt*3),t=new Float32Array(xt*3),n=new Float32Array(xt);this.pGeo.setAttribute("position",new Et(e,3).setUsage(Xi)),this.pGeo.setAttribute("color",new Et(t,3).setUsage(Xi)),this.pGeo.setAttribute("aSize",new Et(n,1).setUsage(Xi));const s=new El({size:.22,vertexColors:!0,transparent:!0,opacity:.95,depthWrite:!1,blending:$s,sizeAttenuation:!0});this.points=new Sg(this.pGeo,s),this.points.frustumCulled=!1,this.scene.add(this.points)}buildPatches(){const e=new cs(1,24);for(let t=0;t<Uc;t++){const n=new he(e,new en({color:16738863,transparent:!0,opacity:.25,depthWrite:!1,side:bt}));n.rotation.x=-Math.PI/2,n.visible=!1,this.scene.add(n),this.patchMeshes.push(n)}}buildBeams(){for(let e=0;e<Ic;e++){const t=new ft;t.setAttribute("position",new Et(new Float32Array(6),3));const n=new bl(t,new La({color:14221135,transparent:!0,opacity:.9}));n.visible=!1,n.frustumCulled=!1,this.scene.add(n),this.beams.push({line:n,life:0,max:.18})}}buildBars(){for(let e=0;e<Zr;e++){const t=Cc(1),n=new ss(new Ci({map:t,transparent:!0,depthWrite:!1}));n.visible=!1,n.scale.set(1.6,.26,1),this.scene.add(n),this.bars.push({sprite:n,ratio:-1,tex:t})}}buildTexts(){for(let e=0;e<Dc;e++){const t=Lc("0","#ffffff"),n=new ss(new Ci({map:t,transparent:!0,depthWrite:!1}));n.visible=!1,n.scale.set(3.4,1.28,1),this.scene.add(n),this.texts.push({sprite:n,life:0,max:1,tex:t})}}buildGhost(){const e=new Xt,t=new Ge({color:5232895,transparent:!0,opacity:.55,emissive:3115263,emissiveIntensity:.5}),n={arcane:new St(.5,.7,1.4,8),frost:new Vt(.7,2,.7),ember:new Pn(.7,1.8,8),tesla:new St(.45,.65,1.6,8)};for(const s of Object.keys(n)){const r=new he(n[s],t);r.position.y=.8,r.name=s,e.add(r)}return e.visible=!1,this.scene.add(e),e}resetEntities(){for(const[,e]of this.towerGroups)this.scene.remove(e);this.towerGroups.clear(),this.bossGroup.visible=!1,this.shake=0}setQuality(e){this.quality=e,e==="low"?(this.renderer.shadowMap.enabled=!1,this.renderer.setPixelRatio(1)):(this.renderer.shadowMap.enabled=!0,this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,e==="high"?2:1.5)))}resize(){const e=this.canvas.clientWidth||window.innerWidth,t=this.canvas.clientHeight||window.innerHeight;this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix()}screenToGround(e,t){this.raycaster.setFromCamera(new Se(e,t),this.camera);const n=new P;return this.raycaster.ray.intersectPlane(this.groundPlane,n),{x:n.x,y:0,z:n.z}}setBuildState(e,t,n,s,r){this.hoverPad=e,this.hoverValid=t,this.buildSelection=n,this.selectedTowerId=s,this.showRanges=r}addShake(e){this.shake=Math.min(14,this.shake+e)}handleFx(e){for(const t of e)t.type==="shake"?this.addShake(t.amount??2):t.type==="text"||t.type==="dmg"?this.spawnText(t.pos,t.msg??"",t.color??"#ffffff",t.type==="dmg"):t.type==="beam"&&t.pos&&t.pos2?this.spawnBeam(t.pos,t.pos2,t.color??"#d8ff4f"):t.type==="ultimate"&&t.pos?(this.shockwave.position.set(t.pos.x,.1,t.pos.z),this.shockT=.7,this.shockwave.visible=!0,this.shockwave.material.color.set(t.color??tn.color)):t.type==="evolve"&&t.pos&&this.spawnText(t.pos,"EVOLVED",t.color??"#ffffff",!1)}spawnText(e,t,n,s){if(!e)return;const r=this.texts[this.textCursor];this.textCursor=(this.textCursor+1)%Dc,r.tex.dispose(),r.tex=Lc(t,n,s?34:26),r.sprite.material.map=r.tex,r.sprite.position.set(e.x,e.y+1.6,e.z),r.life=r.max=s?.8:1.2,r.sprite.visible=!0,r.sprite.material.opacity=1,r.sprite.scale.set(s?3.8:3,(s?3.8:3)*.375,1)}spawnBeam(e,t,n){const s=this.beams[this.beamCursor];this.beamCursor=(this.beamCursor+1)%Ic,s.line.geometry.getAttribute("position");const r=6,o=new Float32Array(r*3);for(let a=0;a<r;a++){const c=a/(r-1),h=a>0&&a<r-1?(Math.random()-.5)*.8:0,l=a>0&&a<r-1?(Math.random()-.5)*.8:0;o[a*3]=e.x+(t.x-e.x)*c+h,o[a*3+1]=e.y+(t.y-e.y)*c+l,o[a*3+2]=e.z+(t.z-e.z)*c+h}s.line.geometry.setAttribute("position",new Et(o,3)),s.line.material.color.set(n),s.life=s.max=.16,s.line.visible=!0}sync(e,t){this.time+=t,this.updateEra(e,t),this.updateCamera(e,t),this.updateWorld(e,t),this.updateEnemies(e),this.updateBoss(e),this.updatePlayer(e),this.updateTowers(e),this.updateProjectiles(e),this.updateParticles(e),this.updatePatches(e),this.updateBeams(t),this.updateBars(e,t),this.updateTexts(t),this.updateGhost(e),this.updateShockwave(t),this.updateHazardRing(e),this.updatePlayerLight(e),this.renderer.render(this.scene,this.camera)}updateEra(e,t){const n=ra[e.era]??ra[0],s=Math.min(1,3*t),r=this.scene.fog,o=this.scene.background,a=new Re(n.fog);r.color.lerp(a,s),r.near=_s.lerp(r.near,60-e.era*4,s),r.far=_s.lerp(r.far,130-e.era*8,s),o.lerp(a,s),this.hemi.color.lerp(new Re(n.ambient),s),this.hemi.intensity=_s.lerp(this.hemi.intensity,n.ambientI,s),this.dir.color.lerp(new Re(n.sun),s),this.dir.intensity=_s.lerp(this.dir.intensity,n.sunI,s),this.world.bastionLight.color.lerp(new Re(Gl[e.bastionTier]?.color??n.sun),s),this.prevEra}updateShockwave(e){if(this.shockT<=0){this.shockwave.visible=!1;return}this.shockT-=e;const t=1-this.shockT/.7,n=1+t*tn.radius;this.shockwave.scale.setScalar(n),this.shockwave.material.opacity=(1-t)*.85,this.shockT<=0&&(this.shockwave.visible=!1)}updateHazardRing(e){const t=e.hazard;if(!t||!t.active||!t.struck){this.hazardRing.visible=!1;return}const n=rr[t.kind],s=1-Math.max(0,t.t)/n.telegraph;this.hazardRing.visible=!0,this.hazardRing.position.set(t.pos.x,.12,t.pos.z),this.hazardRing.scale.setScalar(t.radius*(.3+.7*s));const r=this.hazardRing.material;r.color.setHex(n.color),r.opacity=.25+.55*s+.1*Math.sin(this.time*12)}updatePlayerLight(e){const t=e.player;this.playerLight.position.set(t.pos.x,1.6,t.pos.z);const n=e.ultimate.charge/e.ultimate.max;this.playerLight.intensity=10+n*22+(e.ultimate.active?40:0),this.playerLight.color.setHex(n>.99?16767055:10479871)}updateCamera(e,t){const n=e.player,s=n.pos.x*.85,r=n.pos.z*.85;this.camTarget.x+=(s-this.camTarget.x)*Math.min(1,5*t),this.camTarget.z+=(r-this.camTarget.z)*Math.min(1,5*t),this.camTarget.y=0;const o=e.cinematic.zoomT>0?e.cinematic.zoom:1;this.zoomCur+=(o-this.zoomCur)*Math.min(1,6*t);const a=this.zoomCur,c=27/a,h=21/a;if(this.shake>.05){this.shake*=Math.max(0,1-6*t);const l=this.shake*.06;this.camera.position.set(this.camTarget.x+l*(Math.random()-.5)*2,c+l*(Math.random()-.5)*2,this.camTarget.z+h+l*(Math.random()-.5)*2)}else this.camera.position.set(this.camTarget.x,c,this.camTarget.z+h);this.camera.lookAt(this.camTarget.x,1,this.camTarget.z-3)}updateWorld(e,t){const n=this.world;for(let c=0;c<n.portals.length;c++){const h=n.portals[c],l=e.phase==="combat"||e.phase==="prep",d=l?1.2:.3;h.children[0].rotation.z+=d*t;const m=n.portalDiscs[c].material;m.opacity=l?.3+.15*Math.sin(this.time*3+c):.12}const s=n.bastionCrystal;s.rotation.y+=t*.8,s.position.y=3+Math.sin(this.time*1.4)*.15;const r=e.bastionFlash>0?1:0;s.material.emissiveIntensity=1.4+r*3+.3*Math.sin(this.time*2);const o=n.bastion;for(let c=3;c<o.children.length;c++){const h=o.children[c],l=this.time*1.2+(c-3)*(Math.PI/2);h.position.set(Math.cos(l)*2.2,3+Math.sin(this.time*2+c)*.3,Math.sin(l)*2.2),h.rotation.y+=t*2}const a=e.buildMode;for(let c=0;c<n.padRings.length;c++){const h=n.padRings[c],l=n.padDiscs[c],d=e.towers.some(p=>p.padId===c&&!p.dead),u=c===this.hoverPad;let m=0,g=0,x=4153231;a&&(d?m=.08:u?(m=.9,g=.3,x=this.hoverValid?5570462:16733268):(m=.25,g=.06)),h.material.opacity=m,h.material.color.setHex(x),l.material.opacity=g,l.material.color.setHex(x)}for(const c of n.laneLines)c.visible=e.debug.showPaths}updateEnemies(e){const t=new Map;for(const n of e.enemies){if(n.kind==="boss")continue;let s=t.get(n.kind);s||(s=[],t.set(n.kind,s));const r=n.status;s.push(n.hp,n.maxHp,n.pos.x,n.pos.z,n.lane,n.dist,n.flash,n.freezeT,n.spawnT,n.state==="spawn"?1:0,n.slow,n.facing??0,r.burnT>0?1:0,r.chillT>0?1:0,r.shockT>0?1:0,r.markT>0?1:0,n.untargetable?1:0,n.chargeState==="charge"?1:0,n.slamTelegraph>0?1:0)}for(const n of Pg){const s=this.enemyMeshes.get(n),r=t.get(n)??[],o=r.length/18;s.count=o;for(let a=0;a<o;a++){const c=a*18,h=r[c+2],l=r[c+3],d=r[c+6],u=r[c+7],m=r[c+8],g=r[c+9],x=r[c+12],p=r[c+13],f=r[c+14],y=r[c+15],M=r[c+16],S=r[c+17],C=r[c+18]??0,R=g?Math.max(.05,1-m/.4):1;let A=0;n==="wisp"?A=.9+Math.sin(this.time*4+a)*.15:n==="shaman"?A=.75:A=.4,this.dummy.position.set(h,A,l);const N=r[c+11];this.dummy.rotation.set(0,N,0);let X=1;S&&(X=1+.08*Math.sin(this.time*20)),C&&(X=1+.12*Math.sin(this.time*16)),this.dummy.scale.setScalar(R*X*(d>0?1.12:1)),this.dummy.updateMatrix(),s.setMatrixAt(a,this.dummy.matrix),d>0?this.tmpColor.setHex(16777215):M?this.tmpColor.setHex(2767450):u>0?this.tmpColor.setHex(9431295):x?this.tmpColor.setHex(16739130):p?this.tmpColor.setHex(7330047):f?this.tmpColor.setHex(14221135):y?this.tmpColor.setHex(10447871):this.tmpColor.setHex(ln[n].color),s.setColorAt(a,this.tmpColor)}s.instanceMatrix.needsUpdate=!0,s.instanceColor&&(s.instanceColor.needsUpdate=!0)}}updateBoss(e){const t=e.bossRef,n=this.bossGroup;if(!t||t.dead){n.visible=!1;return}n.visible=!0,n.position.set(t.pos.x,0,t.pos.z);const s=n.userData;s.body.rotation.y+=.01,s.body.position.y=2.2+Math.sin(this.time*2)*.2,s.head.position.y=4.2+Math.sin(this.time*2+1)*.2;const r=t.flash>0;s.body.material.emissiveIntensity=r?2:.5,s.shield.visible=t.shieldT>0,s.shield.visible&&(s.shield.material.opacity=.15+.1*Math.sin(this.time*8)),n.rotation.y=t.facing??0}updatePlayer(e){const t=e.player,n=this.playerGroup;n.position.set(t.pos.x,0,t.pos.z),n.rotation.y=t.facing;const s=t.hurtT>0;n.visible=!t.dead;const r=n.userData;if(r.orb.material.emissiveIntensity=s?3:1.6,r.sword)if(t.meleeAnim>0){const o=1-t.meleeAnim/.2,a=o*o*(3-2*o);r.sword.rotation.y=-1.4+a*2.6,r.sword.rotation.z=-.5+Math.sin(a*Math.PI)*.4}else r.sword.rotation.y=0,r.sword.rotation.z=-.5}updateTowers(e){for(const[n,s]of this.towerGroups)e.towers.some(r=>r.id===n)||(this.scene.remove(s),this.towerGroups.delete(n));for(const n of e.towers){let s=this.towerGroups.get(n.id);s||(s=this.buildTowerGroup(n.kind,n.level),s.position.set(n.pos.x,0,n.pos.z),this.scene.add(s),this.towerGroups.set(n.id,s),s.userData.spawnT=.3);const r=s.userData;if(r.spawnT>0){r.spawnT-=.016;const a=1+Math.max(0,r.spawnT)*1.5;s.scale.setScalar(2-a)}else s.scale.setScalar(1);r.head&&(r.head.rotation.y=n.headAngle);const o=n.stormCd>0;r.glow&&(r.glow.material.opacity=o?.15:.4+.15*Math.sin(this.time*4+n.id)),r.glow&&r.glow.material.color.setHex(o?11816920:nn[n.kind].color),n.flash>0&&r.body&&(r.body.material.emissiveIntensity=2)}const t=e.towers.find(n=>n.id===this.selectedTowerId);t&&(e.buildMode||this.showRanges)?(this.rangeRing.visible=!0,this.rangeRing.position.set(t.pos.x,.07,t.pos.z),this.rangeRing.scale.setScalar(t.range),this.rangeRing.material.color.setHex(nn[t.kind].color)):this.showRanges&&e.towers.length>0?this.rangeRing.visible=!1:this.rangeRing.visible=!1}buildTowerGroup(e,t){const n=new Xt,s=nn[e],r=new Ge({color:s.color,roughness:.5,metalness:.3,flatShading:!0,emissive:s.color,emissiveIntensity:.25}),o=new Ge({color:3818848,roughness:.8,flatShading:!0});let a=null,c=null;switch(e){case"arcane":{const l=new he(new St(.75,.95,.5,8),o);l.position.y=.25,a=new he(new St(.42,.55,1.1,8),r),a.position.y=1,c=new he(new an(.34,10,8),r),c.position.y=1.75,n.add(l,a,c);break}case"frost":{const l=new he(new St(.8,1,.4,6),o);l.position.y=.2,a=new he(new Vt(.7,2.1,.7),r),a.position.y=1.4,c=new he(new Ni(.42,0),r),c.position.y=2.8,n.add(l,a,c);break}case"ember":{const l=new he(new St(.85,1.05,.45,8),o);l.position.y=.22,a=new he(new Pn(.75,1.9,8),r),a.position.y=1.4,c=new he(new an(.3,8,6),r),c.position.y=2.5,n.add(l,a,c);break}case"tesla":{const l=new he(new St(.7,.9,.4,8),o);l.position.y=.2,a=new he(new St(.35,.5,1.5,8),r),a.position.y=1.1,c=new he(new wi(.45,0),r),c.position.y=2.2,n.add(l,a,c);break}}a&&(a.castShadow=!0);for(let l=0;l<t-1;l++){const d=new he(new ls(.9+l*.25,.06,6,20),new Ge({color:16767055,emissive:16754767,emissiveIntensity:.8}));d.rotation.x=Math.PI/2,d.position.y=.15+l*.12,n.add(d)}const h=new ss(new Ci({map:va(),color:s.color,transparent:!0,opacity:.4,depthWrite:!1}));return h.scale.setScalar(2.6),h.position.y=1.6,n.add(h),n.userData={body:a,head:c,glow:h,spawnT:0},n}updateProjectiles(e){const t=new Map;for(const n of e.projectilePool){if(!n.active)continue;let s=t.get(n.kind);s||(s=[],t.set(n.kind,s)),s.push(n)}for(const[n,s]of this.projMeshes){const r=t.get(n)??[];s.count=r.length;for(let o=0;o<r.length;o++){const a=r[o];if(this.dummy.position.set(a.pos.x,a.pos.y,a.pos.z),n==="lance"){const c=Math.atan2(a.vel.x,a.vel.z);this.dummy.rotation.set(0,c,0),this.dummy.rotateX(Math.PI/2)}else this.dummy.rotation.set(0,0,0);this.dummy.scale.setScalar(1),this.dummy.updateMatrix(),s.setMatrixAt(o,this.dummy.matrix)}s.instanceMatrix.needsUpdate=!0}}updateParticles(e){const t=e.particles,n=this.pGeo.getAttribute("position"),s=this.pGeo.getAttribute("color");for(let r=0;r<t.count;r++){n.setXYZ(r,t.px[r],t.py[r],t.pz[r]);const o=Math.max(0,t.life[r]/t.maxLife[r]);s.setXYZ(r,t.cr[r]*o,t.cg[r]*o,t.cb[r]*o)}this.pGeo.setDrawRange(0,t.count),n.needsUpdate=!0,s.needsUpdate=!0}updatePatches(e){for(let t=0;t<Uc;t++){const n=this.patchMeshes[t],s=e.patches[t];if(!s){n.visible=!1;continue}n.visible=!0,n.position.set(s.pos.x,.08,s.pos.z),n.scale.setScalar(s.radius*(.9+.1*Math.sin(this.time*10+t))),n.material.opacity=.18+.14*(s.life/s.maxLife)+.05*Math.sin(this.time*12+t)}}updateBeams(e){for(const t of this.beams){if(t.life<=0){t.line.visible=!1;continue}t.life-=e,t.line.material.opacity=Math.max(0,t.life/t.max)*.9}}updateBars(e,t){const n=[];for(const r of e.enemies)r.dead||r.hp>=r.maxHp||n.push({x:r.pos.x,y:r.pos.y+r.radius*2+.7,z:r.pos.z,hp:r.hp,max:r.maxHp,scale:r.radius*1.8});for(const r of e.towers)r.hp>=r.maxHp||n.push({x:r.pos.x,y:3.2,z:r.pos.z,hp:r.hp,max:r.maxHp,scale:1.6});let s=0;for(let r=0;r<Zr&&s<n.length;r++){const o=this.bars[r],a=n[s++];o.sprite.visible=!0,o.sprite.position.set(a.x,a.y,a.z),o.sprite.scale.set(a.scale,a.scale*.16,1);const c=a.hp/a.max;Math.abs(c-o.ratio)>.02&&(o.ratio=c,o.tex.dispose(),o.tex=Cc(c),o.sprite.material.map=o.tex)}for(let r=s;r<Zr;r++)this.bars[r].sprite.visible=!1}updateTexts(e){for(const t of this.texts){if(t.life<=0){t.sprite.visible=!1;continue}t.life-=e,t.sprite.position.y+=e*1.6,t.sprite.material.opacity=Math.max(0,t.life/t.max)}}updateGhost(e){const t=this.buildSelection;if(!e.buildMode||!t||this.hoverPad<0){this.ghost.visible=!1;return}const n=e.arena.pads[this.hoverPad];this.ghost.visible=!0,this.ghost.position.set(n.pos.x,0,n.pos.z);for(const o of this.ghost.children)o.visible=o.name===t;const s=this.ghost.children.find(o=>o.name===t).material;s.color.setHex(this.hoverValid?5570462:16733268),s.emissive.setHex(this.hoverValid?3135594:14167855);const r=Ma(t,1);this.rangeRing.visible=!0,this.rangeRing.position.set(n.pos.x,.07,n.pos.z),this.rangeRing.scale.setScalar(r.range),this.rangeRing.material.color.setHex(this.hoverValid?5570462:16733268),this.rangeRing.material.opacity=.4}}class Dg{keys=new Set;mouseNdc={x:0,y:0};mouseDown=!1;rightDown=!1;dashPressed=!1;qPressed=!1;ePressed=!1;rPressed=!1;fPressed=!1;ultimatePressed=!1;clickPos=null;onTab=null;onEscape=null;onF2=null;canvas;enabled=!0;constructor(e){this.canvas=e,window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("mousemove",this.onMouseMove),e.addEventListener("mousedown",this.onMouseDown),window.addEventListener("mouseup",this.onMouseUp),e.addEventListener("contextmenu",this.onContextMenu),window.addEventListener("contextmenu",this.onContextMenu),window.addEventListener("blur",this.onBlur)}destroy(){window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("mousemove",this.onMouseMove),this.canvas.removeEventListener("mousedown",this.onMouseDown),window.removeEventListener("mouseup",this.onMouseUp),this.canvas.removeEventListener("contextmenu",this.onContextMenu),window.removeEventListener("contextmenu",this.onContextMenu),window.removeEventListener("blur",this.onBlur)}onContextMenu=e=>e.preventDefault();onKeyDown=e=>{if(!this.enabled)return;const t=e.key.toLowerCase();if(t==="tab"){e.preventDefault(),this.onTab?.();return}if(t==="escape"){this.onEscape?.();return}if(t==="f2"){e.preventDefault(),this.onF2?.();return}t===" "&&(e.preventDefault(),this.keys.has(" ")||(this.dashPressed=!0)),t==="q"&&!this.keys.has("q")&&(this.qPressed=!0),t==="e"&&!this.keys.has("e")&&(this.ePressed=!0),t==="r"&&!this.keys.has("r")&&(this.rPressed=!0),t==="f"&&!this.keys.has("f")&&(this.fPressed=!0),t==="t"&&!this.keys.has("t")&&(this.ultimatePressed=!0),this.keys.add(t)};onKeyUp=e=>{this.keys.delete(e.key.toLowerCase())};onMouseMove=e=>{const t=this.canvas.getBoundingClientRect();this.mouseNdc.x=(e.clientX-t.left)/t.width*2-1,this.mouseNdc.y=-((e.clientY-t.top)/t.height)*2+1};onMouseDown=e=>{if(this.enabled)if(e.button===0){this.mouseDown=!0;const t=this.canvas.getBoundingClientRect();this.clickPos={x:e.clientX-t.left,y:e.clientY-t.top}}else e.button===2&&(this.rightDown=!0)};onMouseUp=e=>{e.button===0&&(this.mouseDown=!1),e.button===2&&(this.rightDown=!1)};onBlur=()=>{this.keys.clear(),this.mouseDown=!1,this.rightDown=!1};get moveX(){let e=0;return this.keys.has("d")&&(e+=1),this.keys.has("a")&&(e-=1),e}get moveY(){let e=0;return this.keys.has("w")&&(e+=1),this.keys.has("s")&&(e-=1),e}snapshot(){const e={moveX:this.moveX,moveY:this.moveY,aimNdc:{...this.mouseNdc},firing:this.mouseDown&&this.enabled,lance:this.rightDown&&this.enabled,dash:this.dashPressed,q:this.qPressed,e:this.ePressed,r:this.rPressed,f:this.fPressed,ultimate:this.ultimatePressed};return this.dashPressed=this.qPressed=this.ePressed=this.rPressed=this.fPressed=this.ultimatePressed=!1,e}}class Ig{root;el={};cb;diff="normal";settings={music:.5,sfx:.7,quality:"high"};announceTimer=null;constructor(e,t){this.root=e,this.cb=t,this.build()}setDifficulty(e){this.diff=e,this.refreshMenu()}setSettings(e){this.settings=e}build(){const e=this.root;e.innerHTML=['<div class="screen menu-screen" id="menu-screen">','  <div class="menu-inner">','    <h1 class="game-title">LAST BASTION</h1>','    <p class="tagline">Hold the crystal. Outlast the void.</p>','    <div class="menu-col">','      <div class="menu-section">',"        <label>Difficulty</label>",'        <div class="diff-row">','          <button class="btn diff-btn" data-diff="easy">Easy</button>','          <button class="btn diff-btn" data-diff="normal">Normal</button>','          <button class="btn diff-btn" data-diff="hard">Hard</button>',"        </div>",'        <p class="diff-desc" id="diff-desc"></p>',"      </div>",'      <button class="btn primary big" id="btn-start">Start Defense</button>','      <div class="menu-row">','        <button class="btn" id="btn-controls">Controls</button>','        <button class="btn" id="btn-settings">Settings</button>',"      </div>",'      <p class="best-wave" id="best-wave"></p>',"    </div>","  </div>",'  <div class="modal hidden" id="controls-modal">',"    <h2>Controls</h2>",'    <div class="controls-grid">',"      <div><b>WASD</b><span>Move</span></div>","      <div><b>Mouse</b><span>Aim</span></div>","      <div><b>Auto</b><span>Melee swing (enemies in reach)</span></div>","      <div><b>Left Click</b><span>Bolt attack</span></div>","      <div><b>Right Click</b><span>Lance (piercing, cooldown)</span></div>","      <div><b>Space</b><span>Dash</span></div>","      <div><b>Q</b><span>Ground Slam</span></div>","      <div><b>E</b><span>Arcane Volley</span></div>","      <div><b>R</b><span>Blink (unlockable)</span></div>","      <div><b>F</b><span>Overcharge (unlockable)</span></div>","      <div><b>Tab</b><span>Build mode</span></div>","      <div><b>Esc</b><span>Pause</span></div>","      <div><b>F2</b><span>Debug panel</span></div>","    </div>",'    <button class="btn" data-close>Close</button>',"  </div>",'  <div class="modal hidden" id="settings-modal">',"    <h2>Settings</h2>",'    <label>Music <input type="range" id="set-music" min="0" max="1" step="0.05"></label>','    <label>SFX <input type="range" id="set-sfx" min="0" max="1" step="0.05"></label>',"    <label>Quality",'      <select id="set-quality">','        <option value="low">Low</option>','        <option value="medium">Medium</option>','        <option value="high">High</option>',"      </select>","    </label>",'    <button class="btn" data-close>Close</button>',"  </div>","</div>",'<div class="hud hidden" id="hud">','  <div class="hud-top">','    <div class="panel bastion-panel">','      <div class="panel-label">BASTION</div>','      <div class="hp-bar big"><div class="hp-fill" id="bastion-hp-fill"></div><span class="hp-text" id="bastion-hp-text"></span></div>',"    </div>",'    <div class="panel wave-panel">','      <div class="wave-num" id="wave-num">WAVE 1</div>','      <div class="wave-sub" id="wave-sub"></div>','      <div class="enemies-left" id="enemies-left"></div>',"    </div>",'    <div class="panel essence-panel">','      <div class="essence-icon">&#9672;</div>','      <div class="essence-val" id="essence-val">0</div>',"    </div>","  </div>",'  <div class="boss-bar-wrap hidden" id="boss-bar-wrap">','    <div class="boss-name">THE RIFT BEHEMOTH</div>','    <div class="hp-bar boss"><div class="hp-fill" id="boss-hp-fill"></div></div>',"  </div>",'  <div class="prep-panel hidden" id="prep-panel">','    <div class="prep-title">NEXT WAVE</div>','    <div class="prep-composition" id="prep-composition"></div>','    <div class="prep-count" id="prep-count"></div>','    <button class="btn primary" id="btn-early">Start Wave Early <span class="early-bonus" id="early-bonus"></span></button>',"  </div>",'  <div class="hud-bottom">','    <div class="panel player-panel">','      <div class="panel-label">GUARDIAN</div>','      <div class="hp-bar"><div class="hp-fill" id="player-hp-fill"></div><span class="hp-text" id="player-hp-text"></span></div>',"    </div>",'    <div class="abilities" id="abilities"></div>','    <div class="build-hint" id="build-hint">TAB &#8212; Build Mode</div>',"  </div>",'  <div class="build-bar hidden" id="build-bar"></div>','  <div class="tower-panel hidden" id="tower-panel"></div>','  <div class="upgrades-strip hidden" id="upgrades-strip"></div>','  <div class="announce-wrap"><div class="announce" id="announce"></div><div class="announce-sub" id="announce-sub"></div></div>',"</div>",'<div class="screen pause-screen hidden" id="pause-screen">','  <div class="menu-inner small">','    <h1 class="pause-title">PAUSED</h1>','    <button class="btn primary big" id="btn-resume">Resume</button>','    <div class="menu-row">','      <button class="btn" id="btn-pause-settings">Settings</button>','      <button class="btn danger" id="btn-quit">Quit to Menu</button>',"    </div>","  </div>","</div>",'<div class="screen upgrade-screen hidden" id="upgrade-screen">','  <div class="upgrade-inner">','    <h1 class="upgrade-title">THE BASTION RESONATES</h1>','    <p class="upgrade-sub">Choose a boon for the defense</p>','    <div class="cards" id="cards"></div>',"  </div>","</div>",'<div class="screen end-screen hidden" id="end-screen">','  <div class="menu-inner small">','    <h1 id="end-title">VICTORY</h1>','    <p id="end-sub"></p>','    <div class="end-stats" id="end-stats"></div>','    <button class="btn primary big" id="btn-again">Defend Again</button>','    <button class="btn" id="btn-end-menu">Main Menu</button>',"  </div>","</div>",'<div class="debug-panel hidden" id="debug-panel"></div>'].join(`
`),this.wire(),this.refreshMenu()}$(e){return this.el[e]||(this.el[e]=this.root.querySelector("#"+e)),this.el[e]}wire(){const e=t=>this.$(t);this.root.querySelectorAll(".diff-btn").forEach(t=>{t.addEventListener("click",()=>{this.diff=t.dataset.diff,this.refreshMenu()})}),e("btn-start").addEventListener("click",()=>this.cb.onStartGame(this.diff)),e("btn-controls").addEventListener("click",()=>e("controls-modal").classList.remove("hidden")),e("btn-settings").addEventListener("click",()=>{e("settings-modal").classList.remove("hidden"),this.syncSettingsInputs()}),this.root.querySelectorAll("[data-close]").forEach(t=>t.addEventListener("click",()=>{t.parentElement.classList.add("hidden")})),e("set-music").addEventListener("input",()=>this.emitSettings()),e("set-sfx").addEventListener("input",()=>this.emitSettings()),e("set-quality").addEventListener("change",()=>this.emitSettings()),e("btn-early").addEventListener("click",()=>this.cb.onStartEarly()),e("btn-resume").addEventListener("click",()=>this.cb.onResume()),e("btn-quit").addEventListener("click",()=>this.cb.onQuitToMenu()),e("btn-pause-settings").addEventListener("click",()=>{e("settings-modal").classList.remove("hidden"),this.syncSettingsInputs()}),e("btn-again").addEventListener("click",()=>this.cb.onRestart()),e("btn-end-menu").addEventListener("click",()=>this.cb.onQuitToMenu())}syncSettingsInputs(){this.$("set-music").value=String(this.settings.music),this.$("set-sfx").value=String(this.settings.sfx),this.$("set-quality").value=this.settings.quality}emitSettings(){this.settings={music:parseFloat(this.$("set-music").value),sfx:parseFloat(this.$("set-sfx").value),quality:this.$("set-quality").value},this.cb.onSettings(this.settings)}refreshMenu(){this.root.querySelectorAll(".diff-btn").forEach(t=>{t.classList.toggle("active",t.dataset.diff===this.diff)});const e={easy:"Fewer, slower enemies. Generous Essence. Longer preparation.",normal:"The intended experience.",hard:"Faster, tougher swarms. Scarce Essence. Short preparation."};this.$("diff-desc").textContent=e[this.diff]}showBestWave(e){this.$("best-wave").textContent=e>0?"Best run: wave "+e+" of "+_n.length:"No completed runs yet"}showMenu(){this.closeModals(),this.show("menu-screen"),this.hide("hud"),this.hide("pause-screen"),this.hide("upgrade-screen"),this.hide("end-screen"),this.hide("debug-panel")}showHud(){this.hide("menu-screen"),this.hide("pause-screen"),this.hide("upgrade-screen"),this.hide("end-screen"),this.show("hud")}showPause(){this.show("pause-screen"),this.hide("hud")}hidePause(){this.hide("pause-screen"),this.show("hud")}closeModals(){let e=!1;for(const t of["settings-modal","controls-modal"]){const n=this.$(t);n&&!n.classList.contains("hidden")&&(n.classList.add("hidden"),e=!0)}return e}showUpgrade(e){this.show("upgrade-screen");const t=this.$("cards");t.innerHTML="";for(const n of e){const s=document.createElement("div");s.className="card cat-"+n.category,s.innerHTML='<div class="card-icon">'+n.icon+'</div><div class="card-name">'+n.name+'</div><div class="card-desc">'+n.desc+'</div><div class="card-cat">'+n.category+"</div>",s.addEventListener("click",()=>this.cb.onChooseCard(n.id)),t.appendChild(s)}}showEnd(e,t){this.show("end-screen"),this.$("end-title").textContent=e?"THE BASTION STANDS":"THE BASTION HAS FALLEN",this.$("end-title").className=e?"end-title victory":"end-title defeat",this.$("end-sub").textContent=e?"The Rift Behemoth is destroyed. The crystal endures.":"The void swallows the last light. Wave "+t.wave+" of "+_n.length+".";const n=Math.floor(t.time/60),s=Math.floor(t.time%60);this.$("end-stats").innerHTML="<div><b>"+t.wave+"</b><span>waves reached</span></div><div><b>"+t.kills+"</b><span>void creatures slain</span></div><div><b>"+t.essence+"</b><span>essence gathered</span></div><div><b>"+t.towers+"</b><span>towers built</span></div><div><b>"+n+":"+s.toString().padStart(2,"0")+"</b><span>time defended</span></div>"}show(e){this.$(e).classList.remove("hidden")}hide(e){this.$(e).classList.add("hidden")}updateHud(e){if(this.$("hud").classList.contains("hidden"))return;const t=e.bastionHp/e.bastionMaxHp,n=this.$("bastion-hp-fill");n.style.width=(t*100).toFixed(1)+"%",n.className="hp-fill"+(t<.3?" low":t<.6?" mid":""),this.$("bastion-hp-text").textContent=Math.ceil(e.bastionHp)+" / "+e.bastionMaxHp;const s=e.player.hp/e.player.maxHp,r=this.$("player-hp-fill");r.style.width=(s*100).toFixed(1)+"%",r.className="hp-fill"+(s<.3?" low":s<.6?" mid":""),this.$("player-hp-text").textContent=Math.ceil(e.player.hp)+" / "+e.player.maxHp,this.$("essence-val").textContent=String(Math.floor(e.essence));const o=e.phase==="combat";this.$("wave-num").textContent=e.wave>0?"WAVE "+e.wave+" / "+_n.length:"STANDBY",this.$("wave-sub").textContent=e.wave>0&&e.wave<=_n.length?_n[e.wave-1].label:"";const a=e.enemies.length+e.spawnQueue.length;this.$("enemies-left").textContent=o?a+" enemies remaining":"";const c=e.bossRef,h=this.$("boss-bar-wrap");c&&!c.dead&&(e.phase==="combat"||e.phase==="prep")?(h.classList.remove("hidden"),this.$("boss-hp-fill").style.width=(c.hp/c.maxHp*100).toFixed(1)+"%"):h.classList.add("hidden");const l=this.$("prep-panel");if(e.phase==="prep"&&e.wave>0){l.classList.remove("hidden");const d=Vh(e.wave,e.difficulty);this.$("prep-composition").innerHTML=d.map(m=>'<span class="comp-item"><i style="background:#'+m.color.toString(16).padStart(6,"0")+'"></i>'+m.count+" "+m.name+(m.count>1?"s":"")+"</span>").join(""),this.$("prep-count").textContent="Starting in: "+Math.ceil(e.prepTime)+"s";const u=Math.round(e.prepTime*2*e.mods.earlyBonusMult);this.$("early-bonus").textContent=u>0?"(+"+u+" essence)":""}else l.classList.add("hidden");this.updateAbilities(e),this.updateBuildBar(e),this.updateTowerPanel(e),this.updateUpgradesStrip(e),this.$("build-hint").classList.toggle("active",e.buildMode),this.$("build-hint").textContent=e.buildMode?"TAB - Exit Build Mode":"TAB - Build Mode"}updateAbilities(e){const t=this.$("abilities"),n=["Q","E","R","F"];t.children.length!==4&&(t.innerHTML=n.map(a=>'<div class="ability" data-key="'+a+'"><div class="ability-cd"></div><div class="ability-key">'+a+'</div><div class="ability-name"></div></div>').join(""));const s={Q:this.cdQ,E:this.cdE,R:this.cdR,F:this.cdF},r={Q:xn.Q.cd,E:xn.E.cd,R:xn.R.cd,F:xn.F.cd},o={Q:!1,E:!1,R:!e.mods.blink,F:!e.mods.overcharge};for(const a of n){const c=t.querySelector('[data-key="'+a+'"]'),h=s[a];c.querySelector(".ability-cd").style.height=(h/r[a]*100).toFixed(1)+"%",c.querySelector(".ability-name").textContent=xn[a].name,c.classList.toggle("locked",o[a]),c.classList.toggle("ready",h<=0&&!o[a])}}cdQ=0;cdE=0;cdR=0;cdF=0;setCds(e,t,n,s){this.cdQ=e,this.cdE=t,this.cdR=n,this.cdF=s}updateBuildBar(e){const t=this.$("build-bar");if(!e.buildMode){t.classList.add("hidden");return}if(t.classList.remove("hidden"),t.children.length===0){for(const s of Bl){const r=nn[s],o=document.createElement("button");o.className="tower-btn",o.dataset.kind=s,o.innerHTML='<div class="tower-icon" style="color:#'+r.color.toString(16).padStart(6,"0")+'">'+r.icon+'</div><div class="tower-name">'+r.name+'</div><div class="tower-cost">&#9672; '+r.cost+"</div>",o.addEventListener("click",()=>this.cb.onBuildSelect(s)),t.appendChild(o)}const n=document.createElement("button");n.className="tower-btn exit",n.innerHTML='<div class="tower-icon">&#10005;</div><div class="tower-name">Exit</div><div class="tower-cost">TAB</div>',n.addEventListener("click",()=>this.cb.onBuildSelect(null)),t.appendChild(n)}for(const n of t.children){const s=n,r=s.dataset.kind;r&&(s.classList.toggle("selected",e.buildSelection===r),s.classList.toggle("unaffordable",e.essence<nn[r].cost))}}updateTowerPanel(e){const t=this.$("tower-panel"),n=e.towers.find(a=>a.id===e.selectedTowerId);if(!n||!e.buildMode){t.classList.add("hidden");return}t.classList.remove("hidden");const s=nn[n.kind],r=n.level<3?s.upgrades[n.level-1]:null,o=Math.round(n.invested*e.mods.sellRefund);t.innerHTML='<div class="tp-title" style="color:#'+s.color.toString(16).padStart(6,"0")+'">'+s.icon+" "+s.name+' <span class="tp-level">LV'+n.level+'</span></div><div class="tp-stats"><span>DMG '+Math.round(n.damage)+"</span><span>RNG "+Math.round(n.range)+"</span><span>SPD "+(1/n.interval).toFixed(2)+"/s</span><span>HP "+Math.ceil(n.hp)+"/"+n.maxHp+"</span></div>"+(r?'<button class="btn primary tp-btn" id="tp-upgrade"'+(e.essence<r.cost?" disabled":"")+">Upgrade: "+r.name+" (&#9672; "+r.cost+')</button><p class="tp-desc">'+r.desc+"</p>":'<p class="tp-desc">Fully upgraded.</p>')+'<button class="btn tp-btn" id="tp-sell">Sell (&#9672; '+o+")</button>",r&&t.querySelector("#tp-upgrade").addEventListener("click",()=>this.cb.onUpgradeTower()),t.querySelector("#tp-sell").addEventListener("click",()=>this.cb.onSellTower())}updateUpgradesStrip(e){const t=this.$("upgrades-strip");if(e.acquiredCards.length===0){t.classList.add("hidden");return}t.classList.remove("hidden");const n=e.acquiredCards.map(s=>{const r=sa.find(o=>o.id===s);return r?'<span class="upg-icon" title="'+r.name+": "+r.desc+'">'+r.icon+"</span>":""}).join("");t.innerHTML=n}announce(e,t,n="#9fe8ff"){const s=this.$("announce"),r=this.$("announce-sub");s.textContent=e,s.style.color=n,r.textContent=t,s.classList.remove("show"),s.offsetWidth,s.classList.add("show"),this.announceTimer&&window.clearTimeout(this.announceTimer),this.announceTimer=window.setTimeout(()=>s.classList.remove("show"),2600)}showDebug(e){this.$("debug-panel").classList.toggle("hidden",!e)}updateDebug(e){const t=this.$("debug-panel");t.classList.contains("hidden")||(t.innerHTML='<div class="dbg-title">DEBUG (F2)</div><div class="dbg-row"><span>FPS</span><b>'+e.fps.toFixed(0)+'</b></div><div class="dbg-row"><span>Frame</span><b>'+e.frameMs.toFixed(2)+' ms</b></div><div class="dbg-row"><span>Enemies</span><b>'+e.enemies+'</b></div><div class="dbg-row"><span>Projectiles</span><b>'+e.projectiles+'</b></div><div class="dbg-row"><span>Towers</span><b>'+e.towers+'</b></div><div class="dbg-row"><span>Particles</span><b>'+e.particles+'</b></div><div class="dbg-row"><span>Essence</span><b>'+Math.floor(e.essence)+'</b></div><div class="dbg-row"><span>Bastion</span><b>'+Math.ceil(e.bastion)+'</b></div><div class="dbg-row"><span>Wave</span><b>'+e.wave+'</b></div><div class="dbg-row"><span>Speed</span><b>'+e.speed+'x</b></div><div class="dbg-btns"><button data-cmd="wave">Next Wave</button><button data-cmd="spawnpause">'+(e.spawnPaused?"Resume Spawn":"Pause Spawn")+'</button><button data-cmd="essence">+500</button><button data-cmd="dmg">Bastion -100</button><button data-cmd="killall">Kill All</button><button data-cmd="paths">'+(e.showPaths?"Hide":"Show")+' Paths</button><button data-cmd="ranges">'+(e.showRanges?"Hide":"Show")+' Ranges</button><button data-cmd="speed05">0.5x</button><button data-cmd="speed1">1x</button><button data-cmd="speed2">2x</button><button data-cmd="speed4">4x</button></div><div class="dbg-spawn"><span>Spawn:</span>'+["crawler","wisp","brute","bulwark","shaman","colossus","boss"].map(n=>'<button data-cmd="spawn" data-arg="'+n+'">'+n+"</button>").join("")+"</div>",t.querySelectorAll("button").forEach(n=>{n.addEventListener("click",()=>{this.cb.onDebug(n.dataset.cmd,n.dataset.arg)})}))}}class Ug{ctx=null;master=null;sfxGain=null;musicGain=null;musicNodes=[];sfxVolume=.7;musicVolume=.4;lastPlay={};droneFilter=null;droneGain=null;droneTarget=.12;musicTimer=null;step=0;nextNoteTime=0;intensity=-1;era=0;init(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}const e=window.AudioContext||window.webkitAudioContext;e&&(this.ctx=new e,this.master=this.ctx.createGain(),this.master.gain.value=.8,this.master.connect(this.ctx.destination),this.sfxGain=this.ctx.createGain(),this.sfxGain.gain.value=this.sfxVolume,this.sfxGain.connect(this.master),this.musicGain=this.ctx.createGain(),this.musicGain.gain.value=this.musicVolume*.35,this.musicGain.connect(this.master),this.startMusic())}setVolumes(e,t){this.sfxVolume=e,this.musicVolume=t,this.sfxGain&&(this.sfxGain.gain.value=e*1.25),this.musicGain&&(this.musicGain.gain.value=t*.35)}startMusic(){if(!this.ctx||!this.musicGain)return;const e=this.ctx.createBiquadFilter();e.type="lowpass",e.frequency.value=260;const t=this.ctx.createOscillator();t.frequency.value=.06;const n=this.ctx.createGain();n.gain.value=180,t.connect(n),n.connect(e.frequency),t.start();const s=this.ctx.createGain();s.gain.value=.12;for(const r of[55,82.5,110.3]){const o=this.ctx.createOscillator();o.type="sine",o.frequency.value=r;const a=this.ctx.createGain();a.gain.value=1,o.connect(a),a.connect(s),o.start(),this.musicNodes.push(o)}s.connect(e),e.connect(this.musicGain),this.musicNodes.push(t),this.droneFilter=e,this.droneGain=s,this.nextNoteTime=this.ctx.currentTime+.1,this.musicTimer=window.setInterval(()=>this.scheduleMusic(),90)}setMusicMood(e,t){if(e===this.intensity&&t===this.era||(this.intensity=e,this.era=t,!this.ctx||!this.droneFilter||!this.droneGain))return;const n=this.ctx.currentTime,s=[55,61.74,65.41,73.42],r=s[t%s.length],o=260+t*110+e*160;this.droneFilter.frequency.cancelScheduledValues(n),this.droneFilter.frequency.setTargetAtTime(o,n,1.5),this.droneTarget=e===2?.17:e===1?.14:.11,this.droneGain.gain.cancelScheduledValues(n),this.droneGain.gain.setTargetAtTime(this.droneTarget,n,1.2);const a=[1,1.5,2.005];for(let c=0;c<Math.min(3,this.musicNodes.length);c++){const h=this.musicNodes[c];h.frequency.cancelScheduledValues(n),h.frequency.setTargetAtTime(r*a[c],n,1.5)}}scheduleMusic(){if(!this.ctx||!this.musicGain||this.intensity<0)return;const e=60/100/4;for(;this.nextNoteTime<this.ctx.currentTime+.25;){const t=this.step%16,n=this.nextNoteTime;this.intensity>=1&&t%4===0&&this.musicThump(n,this.intensity===2?.3:.2),this.intensity>=1&&t%2===0&&this.musicNote(n,this.arpeggioNote(t),this.intensity===2?.1:.07),this.intensity===2&&t===0&&this.musicStab(n),this.step++,this.nextNoteTime+=e}}arpeggioNote(e){const t=[220,246.9,261.6,293.7],n=t[this.era%t.length],s=[1,1.2,1.5,1.8,2];return this.intensity===2&&e===8?n*1.41:n*s[e/2%s.length]}musicThump(e,t){if(!this.ctx||!this.musicGain)return;const n=this.ctx.createOscillator();n.type="sine",n.frequency.setValueAtTime(72,e),n.frequency.exponentialRampToValueAtTime(36,e+.16);const s=this.ctx.createGain();s.gain.setValueAtTime(t,e),s.gain.exponentialRampToValueAtTime(1e-4,e+.18),n.connect(s),s.connect(this.musicGain),n.start(e),n.stop(e+.2)}musicNote(e,t,n){if(!this.ctx||!this.musicGain)return;const s=this.ctx.createOscillator();s.type="triangle",s.frequency.value=t;const r=this.ctx.createGain();r.gain.setValueAtTime(1e-4,e),r.gain.exponentialRampToValueAtTime(n,e+.015),r.gain.exponentialRampToValueAtTime(1e-4,e+.14),s.connect(r),r.connect(this.musicGain),s.start(e),s.stop(e+.16)}musicStab(e){if(!(!this.ctx||!this.musicGain))for(const t of[110,155.6,220]){const n=this.ctx.createOscillator();n.type="sawtooth",n.frequency.value=t;const s=this.ctx.createBiquadFilter();s.type="lowpass",s.frequency.value=900;const r=this.ctx.createGain();r.gain.setValueAtTime(.09,e),r.gain.exponentialRampToValueAtTime(1e-4,e+.4),n.connect(s),s.connect(r),r.connect(this.musicGain),n.start(e),n.stop(e+.45)}}tone(e,t,n,s,r,o=0){if(!this.ctx||!this.sfxGain)return;const a=this.ctx.currentTime+o,c=this.ctx.createOscillator();c.type=n,c.frequency.setValueAtTime(e,a),r&&c.frequency.exponentialRampToValueAtTime(Math.max(20,r),a+t);const h=this.ctx.createGain();h.gain.setValueAtTime(1e-4,a),h.gain.exponentialRampToValueAtTime(s,a+.008),h.gain.exponentialRampToValueAtTime(1e-4,a+t),c.connect(h),h.connect(this.sfxGain),c.start(a),c.stop(a+t+.02)}noise(e,t,n,s=0,r="lowpass"){if(!this.ctx||!this.sfxGain)return;const o=this.ctx.currentTime+s,a=Math.max(1,Math.floor(this.ctx.sampleRate*e)),c=this.ctx.createBuffer(1,a,this.ctx.sampleRate),h=c.getChannelData(0);for(let m=0;m<a;m++)h[m]=Math.random()*2-1;const l=this.ctx.createBufferSource();l.buffer=c;const d=this.ctx.createBiquadFilter();d.type=r,d.frequency.value=t;const u=this.ctx.createGain();u.gain.setValueAtTime(n,o),u.gain.exponentialRampToValueAtTime(1e-4,o+e),l.connect(d),d.connect(u),u.connect(this.sfxGain),l.start(o)}play(e){if(!this.ctx)return;const t=performance.now(),n=this.lastPlay[e]??0,s=e==="hit"||e==="shoot"||e==="arcane"?45:70;if(!(t-n<s))switch(this.lastPlay[e]=t,e){case"shoot":this.tone(720,.07,"square",.14,380);break;case"lance":this.tone(300,.18,"sawtooth",.14,90),this.noise(.12,1800,.08);break;case"lance_hit":this.tone(180,.12,"square",.14,60),this.noise(.1,900,.1);break;case"hit":this.tone(340,.05,"square",.11,200);break;case"arcane":this.tone(980,.06,"square",.11,620);break;case"frost":this.tone(1400,.25,"triangle",.09,2200),this.tone(1900,.3,"sine",.05,2600,.05);break;case"ember":this.noise(.2,700,.1),this.tone(140,.2,"sine",.08,60);break;case"explode":this.noise(.4,500,.22),this.tone(90,.35,"sine",.18,40);break;case"tesla":this.noise(.08,4e3,.1,0,"highpass"),this.tone(2400,.07,"square",.06,900);break;case"enemy_die":this.tone(500,.14,"triangle",.1,120),this.noise(.1,1200,.06);break;case"boss_die":this.noise(1.2,400,.3),this.tone(70,1,"sine",.25,30);break;case"spawn":this.tone(220,.3,"sine",.08,440);break;case"wave_start":this.tone(110,.5,"sawtooth",.14),this.tone(165,.5,"sawtooth",.1,void 0,.05),this.tone(220,.6,"sawtooth",.1,void 0,.1);break;case"wave_clear":this.tone(440,.12,"triangle",.12),this.tone(554,.12,"triangle",.12,void 0,.1),this.tone(659,.2,"triangle",.12,void 0,.2);break;case"victory":[523,659,784,1046].forEach((r,o)=>this.tone(r,.35,"triangle",.14,void 0,o*.18));break;case"defeat":[330,262,196,131].forEach((r,o)=>this.tone(r,.5,"sawtooth",.12,void 0,o*.25));break;case"place":this.tone(180,.08,"square",.12,120),this.noise(.06,800,.08);break;case"upgrade":this.tone(520,.1,"triangle",.12),this.tone(780,.16,"triangle",.12,void 0,.09);break;case"sell":this.tone(600,.08,"triangle",.1),this.tone(400,.12,"triangle",.1,void 0,.07);break;case"tower_hit":this.tone(120,.1,"square",.1,70);break;case"tower_destroy":this.noise(.5,600,.2),this.tone(100,.4,"sine",.16,45);break;case"bastion_hit":this.tone(70,.3,"sine",.2,40),this.noise(.15,400,.1);break;case"player_hit":this.tone(240,.15,"sawtooth",.14,90);break;case"dash":this.noise(.15,2500,.08,0,"highpass");break;case"swing":this.noise(.09,2600,.07,0,"bandpass"),this.tone(240,.08,"triangle",.06,520);break;case"slam":this.noise(.5,350,.28),this.tone(60,.45,"sine",.24,30);break;case"volley":for(let r=0;r<5;r++)this.tone(800+r*60,.05,"square",.06,500,r*.04);break;case"blink":this.tone(1200,.12,"sine",.1,2400);break;case"overcharge":this.tone(200,.6,"sawtooth",.1,600);break;case"heal":this.tone(880,.15,"sine",.06,1320);break;case"void_bolt":this.tone(160,.25,"sawtooth",.1,60);break;case"boss_warn":this.tone(55,1.2,"sawtooth",.16),this.tone(58,1.2,"sawtooth",.12,void 0,.05);break;case"boss_spawn":this.noise(1,300,.25),this.tone(45,.9,"sine",.22,30);break;case"boss_enrage":this.tone(200,.8,"sawtooth",.16,60),this.noise(.6,800,.12);break;case"boss_shield":this.tone(1600,.4,"sine",.08,2400);break;case"boss_summon":this.tone(110,.5,"sawtooth",.12,55);break;case"boss_stun":this.noise(.2,3e3,.1,0,"highpass"),this.tone(1800,.15,"square",.06,400);break}}}const Al="lastBastion.save.v1",Jr=()=>({settings:{music:.5,sfx:.7,quality:"high"},difficulty:"normal",bestWave:0,discovered:[]});function Fg(){try{const i=localStorage.getItem(Al);if(!i)return Jr();const e=JSON.parse(i),t=Jr();return{settings:{...t.settings,...e.settings??{}},difficulty:["easy","normal","hard"].includes(e.difficulty)?e.difficulty:t.difficulty,bestWave:typeof e.bestWave=="number"?e.bestWave:0,discovered:Array.isArray(e.discovered)?e.discovered.filter(n=>typeof n=="string"):[]}}catch{return Jr()}}function sr(i){try{localStorage.setItem(Al,JSON.stringify(i))}catch{}}const Rl=document.getElementById("game-canvas"),Ng=document.getElementById("ui-root"),vt=Fg(),zi=new Ug;zi.setVolumes(vt.settings.sfx,vt.settings.music);const $e=new Jh,cn=new Lg(Rl,$e.g.arena);cn.setQuality(vt.settings.quality);const jn=new Dg(Rl),ut=new Ig(Ng,{onStartGame:i=>Fc(i),onResume:()=>$e.togglePause(),onQuitToMenu:()=>zg(),onStartEarly:()=>$e.startEarly(),onBuildSelect:i=>Bg(i),onUpgradeTower:()=>{const i=$e.g.towers.find(e=>e.id===$e.g.selectedTowerId);i&&Th($e.g,i)},onSellTower:()=>{const i=$e.g.towers.find(e=>e.id===$e.g.selectedTowerId);i&&wh($e.g,i)},onChooseCard:i=>$e.chooseCard(i),onDebug:(i,e)=>Hg(i,e),onSettings:i=>Og(i),onRestart:()=>Fc(Cl)});ut.setDifficulty(vt.difficulty);ut.setSettings(vt.settings);ut.showBestWave(vt.bestWave);ut.showMenu();let Cl=vt.difficulty,js=!1,Li=-1;function Fc(i){zi.init(),Cl=i,vt.difficulty=i,sr(vt),$e.startRun(i),cn.resetEntities(),ut.showHud(),Li=-1}function zg(){const i=$e.g;i.phase="menu",i.buildMode=!1,i.buildSelection=null,i.selectedTowerId=-1,ut.showMenu(),ut.showBestWave(vt.bestWave)}function Og(i){vt.settings=i,sr(vt),zi.setVolumes(i.sfx,i.music),cn.setQuality(i.quality)}function Bg(i){const e=$e.g;i===null?(e.buildMode=!1,e.buildSelection=null,e.selectedTowerId=-1):(e.buildMode=!0,e.buildSelection=i,e.selectedTowerId=-1)}function kg(){const i=$e.g;i.phase!=="prep"&&i.phase!=="combat"||(i.buildMode?(i.buildMode=!1,i.buildSelection=null,i.selectedTowerId=-1):(i.buildMode=!0,i.buildSelection=null))}function Gg(){if(ut.closeModals())return;const i=$e.g;(i.phase==="prep"||i.phase==="combat"||i.phase==="upgrade"||i.phase==="paused")&&($e.togglePause(),i.phase==="paused"?ut.showPause():ut.hidePause())}function Hg(i,e){const t=$e.g;switch(i){case"wave":$e.debugStartWave();break;case"spawnpause":$e.debugToggleSpawnPause();break;case"essence":$e.debugAddEssence(500);break;case"dmg":$e.debugDamageBastion(100);break;case"killall":$e.debugKillAll();break;case"paths":t.debug.showPaths=!t.debug.showPaths;break;case"ranges":t.debug.showRanges=!t.debug.showRanges;break;case"speed05":t.gameSpeed=.5;break;case"speed1":t.gameSpeed=1;break;case"speed2":t.gameSpeed=2;break;case"speed4":t.gameSpeed=4;break;case"spawn":e&&$e.debugSpawn(e,0);break}}jn.onTab=kg;jn.onEscape=Gg;jn.onF2=()=>{js=!js,ut.showDebug(js)};$e.onPhaseChange=i=>{const e=$e.g;if(i==="upgrade"){const t=jh(e);e.pendingCards=t.map(n=>({id:n.id,name:n.name,icon:n.icon,desc:n.desc,category:n.category})),ut.showUpgrade(t)}else if(i==="gameover"||i==="victory"){Li<0&&(Li=1.4),e.wave>vt.bestWave&&(vt.bestWave=e.wave,sr(vt));for(const t of e.acquiredCards)vt.discovered.includes(t)||vt.discovered.push(t);sr(vt)}else(i==="prep"||i==="combat")&&ut.showHud()};let Nc=performance.now(),zc=60,Qr=16,ea=0,ta=0,na=0;function Pl(i){requestAnimationFrame(Pl);let e=(i-Nc)/1e3;Nc=i,e>.1&&(e=.1);const t=performance.now(),n=jn.snapshot(),s=cn.screenToGround(n.aimNdc.x,n.aimNdc.y),r=$e.g;let o=-1,a=!0;if(r.buildMode&&r.buildSelection){let l=2;for(const d of r.arena.pads){const u=Math.hypot(d.pos.x-s.x,d.pos.z-s.z);u<l&&(l=u,o=d.id)}o>=0&&(a=Sa(r,o,r.buildSelection))}if(cn.setBuildState(o,a,r.buildSelection,r.selectedTowerId,r.debug.showRanges),jn.clickPos)if(jn.clickPos,jn.clickPos=null,r.buildMode&&r.phase!=="paused")if(o>=0){const l=r.towers.find(d=>d.padId===o&&!d.dead);l?(r.selectedTowerId=l.id,r.buildSelection=null):r.buildSelection&&a&&(Bc(r,o,r.buildSelection),r.selectedTowerId=-1)}else r.selectedTowerId=-1;else r.selectedTowerId=-1;$e.update(e,{moveX:n.moveX,moveY:n.moveY,aim:s,firing:n.firing&&!r.buildMode,lance:n.lance&&!r.buildMode,dash:n.dash,q:n.q,e:n.e,r:n.r,f:n.f,ultimate:n.ultimate});for(const l of r.drainFx())if(l.type==="sound")zi.play(l.sound);else if(l.type==="announce")ut.announce(l.msg??"",l.sub??"",l.color);else if(l.type==="burst"&&l.pos){const d=l.color??"#ffffff",u=parseInt(d.slice(1,3),16)/255,m=parseInt(d.slice(3,5),16)/255,g=parseInt(d.slice(5,7),16)/255;r.particles.burst(l.pos.x,l.pos.y,l.pos.z,[u,m,g],l.value??10,l.speed??4,2.5,.7,l.size??.15)}else cn.handleFx([l]);if(Li>0&&(Li-=e,Li<=0)){const l=r.phase==="victory";ut.showEnd(l,{wave:r.wave,kills:r.stats.kills,essence:Math.floor(r.stats.essenceEarned),towers:r.stats.towersBuilt,time:r.stats.time})}const c=r.enemies.some(l=>l.kind==="boss"&&!l.dead);zi.setMusicMood(c?2:r.phase==="combat"?1:0,r.era),ut.setCds(gs("Q"),gs("E"),gs("R"),gs("F")),ut.updateHud(r),js&&ut.updateDebug({fps:zc,frameMs:Qr,enemies:r.enemies.length,projectiles:r.projectilePool.filter(l=>l.active).length,towers:r.towers.length,particles:r.particles.count,speed:r.gameSpeed,spawnPaused:r.spawnPaused,showPaths:r.debug.showPaths,showRanges:r.debug.showRanges,essence:r.essence,bastion:r.bastionHp,wave:r.wave}),cn.sync(r,e);const h=performance.now()-t;Qr=Qr*.9+h*.1,ea+=1/Math.max(e,.001),ta++,na+=e,na>.5&&(zc=ea/ta,ea=0,ta=0,na=0)}window.addEventListener("resize",()=>cn.resize());cn.resize();requestAnimationFrame(Pl);window.__lb={game:$e,renderer:cn,audio:zi,ui:ut,placeTower:Bc,canPlace:Sa};
