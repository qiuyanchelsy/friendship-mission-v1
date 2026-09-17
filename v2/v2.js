'use strict';
const CHARACTERS=[
 {id:'xiaoyong',name:'小勇',color:'#f3ca60',intro:'我喜歡冒險故事，也想聽聽你的新發現。',detail:'黃色帽T · 恐龍吊飾',hook:'恐龍吊飾',reply:'「你也喜歡恐龍嗎？我最近在看一本恐龍書。」'},
 {id:'xiaoqing',name:'小晴',color:'#ef9f79',intro:'下課一起動一動！你平常喜歡玩什麼？',detail:'運動外套 · 球形吊飾',hook:'球形吊飾',reply:'「你喜歡球類嗎？我下課也喜歡到操場走走。」'},
 {id:'ale',name:'阿樂',color:'#aec775',intro:'我喜歡音樂，也喜歡發現生活裡有趣的聲音。',detail:'自然捲髮 · 音符吊飾',hook:'音符吊飾',reply:'「這個音符好可愛！你平常喜歡聽什麼音樂？」'},
 {id:'mimi',name:'米米',color:'#c6b1e5',intro:'我喜歡畫下看到的小動物，你有喜歡的動物嗎？',detail:'淡紫外套 · 動物速寫本',hook:'小貓吊飾',reply:'「你喜歡貓嗎？我也喜歡看牠們玩耍。」'},
 {id:'axing',name:'阿星',color:'#a2c7ec',intro:'我對好多事情都很好奇，也想知道你在想什麼。',detail:'圓框眼鏡 · 星球吊飾',hook:'星球吊飾',reply:'「是有光環的星球！你平常會看星星嗎？」'},
 {id:'xiaoyu',name:'小宇',color:'#e4aa72',intro:'我喜歡拼出不同的東西，也喜歡一起想辦法。',detail:'橘棕背心 · 積木吊飾',hook:'積木吊飾',reply:'「這個積木可以拆開嗎？你喜歡拼什麼東西？」'}
];
const pair={ids:[null,null],candidate:null,selectPlayer:0};
const campaign={level:1};
function chapter(){return {title:'勇敢開口',location:'五年級教室',background:'vn-classroom.webp'};}
function avatar(p){return CHARACTERS.find(c=>c.id===pair.ids[p])||CHARACTERS[p];}
function portrait(c){return `assets/characters/${c.id}-portrait.webp`;}
function sprite(c){return `assets/characters/${c.id}-sprite.webp`;}
function roleChip(p,label){const c=avatar(p);return `<div class="role-chip"><img src="${portrait(c)}" alt=""><span>玩家 ${p+1} · ${esc(c.name)}<small>${label}</small></span></div>`;}
function picker(){const p=pair.selectPlayer,c=CHARACTERS.find(c=>c.id===pair.candidate),unavailable=pair.ids[1-p];return `<section class="selection-world"><img class="selection-background" src="assets/vn-classroom.webp" alt="陽光灑落的五年級教室"><div class="selection-heading"><p class="kicker">出發前 · ${p+1} / 2</p><h1>玩家 ${p+1}，選一位陪你冒險。</h1><p>每個角色都能勇敢開口，也可以慢慢想。${p===1?'選一位和隊友不同的角色。':'先看看，再按下確認。'}</p></div><div class="selection-layout"><div class="roster">${CHARACTERS.map(x=>`<button class="roster-card ${x.id===pair.candidate?'selected':''}" data-character="${x.id}" aria-pressed="${x.id===pair.candidate}" ${unavailable===x.id?'disabled':''} style="--accent:${x.color}"><img src="${portrait(x)}" alt="${x.detail}"><span><strong>${x.name}</strong><small>${unavailable===x.id?'隊友已選':x.detail}</small></span>${x.id===pair.candidate?'<b class="selection-check">已選</b>':''}</button>`).join('')}</div><aside class="character-preview">${c?`<img class="preview-sprite" src="${sprite(c)}" alt="${c.name}基本立繪"><div class="preview-caption"><h2>${c.name}</h2><p>${c.intro}</p></div>`:'<div class="preview-empty"><h2>你想用誰的視角<br>走進教室？</h2><p>點一張人物卡，看看他的模樣。</p></div>'}</aside></div><div class="selection-footer"><p>${p===1?`玩家 1 已選：${esc(avatar(0).name)}`:'六位角色沒有能力高低之分。'}</p><div class="button-row">${p===1?'<button class="secondary" data-action="v2_editFirst">回去選玩家 1</button>':''}${primary(c?'我選'+c.name:'先選一位角色','v2_confirmCharacter',!c)}</div></div></section>`;}
function renderV2(){
 if(state.page==='setup')return picker();
 if(state.page==='passSelect')return `<section class="handoff"><div class="handoff-inner">${roleChip(0,'角色已選好')}<h2>換玩家 2 選角色。</h2><p>把 iPad 交給隊友，<br>一起組成今天的搭檔。</p>${primary('玩家 2 準備好了','v2_second')}</div></section>`;
 if(state.page==='confirmPair')return `<section class="pair-world"><img class="selection-background" src="assets/vn-classroom.webp" alt="新學期的教室"><div class="pair-heading"><p class="kicker">雙人確認</p><h1>今天，我們一起出發。</h1><p>角色跟著你；行動者與友情偵探可以交換。</p></div><div class="pair-cards">${[0,1].map(p=>`<article><img class="pair-sprite" src="${sprite(avatar(p))}" alt="${avatar(p).name}"><div><span>玩家 ${p+1}</span><h2>${avatar(p).name}</h2><p>${p===state.actor?'行動者 · 先決定怎麼開口':'友情偵探 · 想想自己的偏好'}</p><button class="secondary" data-edit="${p}">重選角色</button></div></article>`).join('')}</div><div class="pair-footer"><button class="secondary" data-action="v2_swapRoles">交換這一輪任務</button>${primary('搭檔確認，走進教室','v2_begin')}</div></section>`;
 if(state.page==='speakA')return stage({mode:'story-screen',dialogue:dialogue(actor(),personalize(STORY.opening[state.choice].text),'v2_hearOpening','聽聽小哲怎麼說')});
 if(state.page==='speakNext')return stage({mode:'story-screen',step:4,dialogue:dialogue(actor(),personalize(STORY.next[state.next].text),'v2_hearNext','聽聽他的回應')});
 if(state.page==='noticeCharm')return stage({mode:'story-screen',step:5,dialogue:dialogue('小哲',avatar(state.actor).reply,'ending','繼續故事',{hint:`小哲注意到${actor()}的${avatar(state.actor).hook}。`})});
 if(state.page==='complete')return memoryPage();
 return null;
}
function memoryPage(){return `<section class="memory-world"><div class="memory-heading"><p class="kicker">共同回憶冊 · 第一頁</p><h1>從一句話，開始認識彼此。</h1><p>第一關完成 · 兩個人都練習了開口與回應。</p></div><article class="memory-book"><div class="memory-photo"><img class="memory-background" src="assets/vn-classroom.webp" alt="這次相遇的教室"><div class="photo-pair">${[0,1].map(p=>`<img src="${sprite(avatar(p))}" alt="玩家 ${p+1} ${avatar(p).name}">`).join('')}</div><p>${esc(avatar(0).name)} ＆ ${esc(avatar(1).name)}<small>彩虹小學 · 窗邊的新朋友</small></p></div><div class="memory-notes"><h2>今天，我們試過……</h2><div class="memory-entry">${roleChip(state.actor,'我的開場')}<p>${esc(personalize(STORY.opening[state.choice].text))}</p></div><div class="memory-entry">${roleChip(1-state.actor,'我喜歡的方式')}<p>${esc(STORY.preferences[state.preference])}</p></div><div class="memory-entry"><h3>我們一起接的下一句</h3><p>${esc(personalize(STORY.next[state.next].text))}</p></div><div class="takeaway"><h3>帶回教室的一句話</h3><p>「嗨，我叫＿＿。你平常喜歡做什麼？」</p><small>想一想：下次，你想在什麼時候試著開口？</small></div></div></article><div class="memory-actions">${primary('儲存這一頁','v2_saveMemory')}<button class="secondary" data-action="v2_replay">交換任務，再玩一次</button><button class="secondary" data-action="v2_newPair">重新選角</button></div><p id="memory-status" role="status"></p><p class="memory-footnote">完成代表練習過，不代表交朋友能力的高低。重新整理會清除本次進度。</p></section>`;}
function freshPair(){reset();pair.ids=[null,null];pair.candidate=null;pair.selectPlayer=0;state.actor=0;goto('setup');}
function v2Action(b){
 if(b.dataset.character){const c=CHARACTERS.find(x=>x.id===b.dataset.character);if(c&&c.id!==pair.ids[1-pair.selectPlayer]){pair.candidate=c.id;render();}return true;}
 if(b.dataset.edit!==undefined){pair.selectPlayer=+b.dataset.edit;pair.candidate=pair.ids[pair.selectPlayer];goto('setup');return true;}
 const a=b.dataset.action;if(!a?.startsWith('v2_'))return false;
 if(a==='v2_confirmCharacter'){if(!pair.candidate||pair.candidate===pair.ids[1-pair.selectPlayer])return true;pair.ids[pair.selectPlayer]=pair.candidate;state.names[pair.selectPlayer]=avatar(pair.selectPlayer).name;if(pair.ids.every(Boolean))goto('confirmPair');else goto('passSelect');}
 else if(a==='v2_second'){pair.selectPlayer=1;pair.candidate=pair.ids[1];goto('setup');}
 else if(a==='v2_editFirst'){pair.selectPlayer=0;pair.candidate=pair.ids[0];goto('setup');}
 else if(a==='v2_swapRoles'){state.actor=1-state.actor;render();}
 else if(a==='v2_begin'){if(pair.ids.every(Boolean)&&pair.ids[0]!==pair.ids[1]){reset();goto('intro');}}
 else if(a==='v2_hearOpening'){state.replyBeat=0;goto('responseA');}
 else if(a==='v2_hearNext'){state.replyBeat=0;goto('responseNext');}
 else if(a==='v2_replay'){reset();state.actor=1-state.actor;goto('intro');}
 else if(a==='v2_newPair')freshPair();
 else if(a==='v2_saveMemory')saveMemory();
 return true;
}
async function saveMemory(){const status=document.querySelector('#memory-status');status.textContent='正在製作回憶圖片……';const b=document.querySelector('[data-action="v2_saveMemory"]');b.disabled=true;try{
 const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=1200;const x=canvas.getContext('2d');
 const loadImage=async src=>{const im=new Image();im.src=src;await im.decode();return im;};
 const images=await Promise.all(['assets/vn-classroom.webp',...pair.ids.map((_,p)=>portrait(avatar(p)))].map(loadImage));
 x.fillStyle='#fff6df';x.fillRect(0,0,1600,1200);x.drawImage(images[0],0,0,1600,470);x.fillStyle='rgba(16,47,60,.84)';x.fillRect(0,0,1600,470);x.fillStyle='#ffe49a';x.font='bold 56px sans-serif';x.fillText('我們的第一頁友情回憶',70,100);x.fillStyle='white';x.font='30px sans-serif';x.fillText('窗邊的新朋友 · 第一關完成',70,160);
 [0,1].forEach(p=>{x.drawImage(images[p+1],70+p*750,210,190,190);x.fillStyle='#fff9e9';x.font='bold 42px sans-serif';x.fillText(avatar(p).name,290+p*750,280);x.font='28px sans-serif';x.fillText(`玩家 ${p+1} · ${p===state.actor?'行動者':'友情偵探'}`,290+p*750,335);});
 const wrap=(str,y)=>{let line='',cy=y;for(const ch of str){if(x.measureText(line+ch).width>1430){x.fillText(line,80,cy);line=ch;cy+=48;}else line+=ch;}x.fillText(line,80,cy);return cy+70;};
 let y=535;const rows=[[actor()+'的開場',personalize(STORY.opening[state.choice].text)],[detective()+'喜歡的方式',STORY.preferences[state.preference]],['我們一起接的下一句',personalize(STORY.next[state.next].text)],['帶回教室的一句話','「嗨，我叫＿＿。你平常喜歡做什麼？」']];
 for(const [label,value] of rows){x.fillStyle='#39706c';x.font='bold 28px sans-serif';x.fillText(label,80,y);x.fillStyle='#203e46';x.font='34px sans-serif';y=wrap(value,y+47);}
 x.font='24px sans-serif';x.fillText('我們都試著開口，也都好好聽過對方。',80,1140);
 const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('no image');const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='友情任務-第一頁回憶.png';link.click();setTimeout(()=>URL.revokeObjectURL(url),60000);status.textContent='回憶圖片已產生；請依瀏覽器提示下載或儲存。';
 }catch{status.textContent='這次沒有成功儲存，可以再試一次，或截圖保留這一頁。';}finally{b.disabled=false;}}
