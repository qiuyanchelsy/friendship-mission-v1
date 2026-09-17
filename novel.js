'use strict';
// Story content is separate from the visual-novel renderer.
const STORY={
 names:['小勇','小晴','阿樂','米米','阿星','小宇'],
 intro:[
  {speaker:'旁白',text:'新學期的第一天，你走進五年級的新教室。窗邊，坐著一位還不認識的同學。',expression:'friendly'},
  {speaker:'我的心聲',text:'他的鉛筆盒上有好多小星星……我想認識他。可是，第一句到底要說什麼？',expression:'friendly'},
  {speaker:'旁白',text:'他正低頭整理鉛筆盒，還沒開口。你深呼吸一下，準備試著打招呼。',expression:'friendly'}
 ],
 opening:[
  {text:'「嗨，你叫什麼名字？」',reply:'「我叫小哲，你呢？」',feedback:'直接問名字也可以。友善的語氣，加上一句自我介紹，對方會更容易接話。',expression:'friendly',gesture:'他抬起頭，微笑看著你。'},
  {text:'「你的鉛筆盒好酷！你喜歡小星星嗎？」',reply:'「對啊！我最喜歡這顆大的。對了，我叫小哲！」',feedback:'從眼前注意到的東西開始聊，對方比較容易回答。說出你真的感興趣的事情就好。',expression:'friendly',gesture:'他把鉛筆盒稍微往前挪，指了指上面的星星。'},
  {text:'先看著他，暫時不說話。',reply:'「嗯……你有事要找我嗎？」',feedback:'想先觀察一下也沒關係。準備好了，可以加一句「嗨」，讓對方知道你想聊天。',expression:'unsure',gesture:'他停下手邊的動作，有點疑惑地看向你。'},
  {text:'「欸！」',reply:'「嗯？你在叫我嗎？」',feedback:'對方注意到你了，但還不知道你想說什麼。可以接著介紹自己，或問一個簡單問題。',expression:'unsure',gesture:'他抬起頭，等著你說下一句。'}
 ],
 preferences:['先打招呼、介紹自己。','從眼前的東西開始聊。','問一個簡單的問題。','先給我一點時間，再慢慢聊。'],
 next:[
  {text:'「我叫{name}。你以前是哪一班的？」',reply:'「我以前是四年三班！你呢？」',feedback:'先介紹自己，再問一個容易回答的問題，對方就能把話接回來。',expression:'friendly',gesture:'小哲放下鉛筆盒，轉過來和你聊天。',kind:'continue'},
  {text:'「我剛換到這一班，也有點緊張。」',reply:'「我也是！還好我們坐旁邊。」',feedback:'分享一點自己的感受，也能讓對方更認識你。只說自己願意分享的部分就好。',expression:'friendly',gesture:'小哲笑了，你好像也沒那麼緊張了。',kind:'continue'},
  {text:'「喔。」',reply:'「嗯……」',feedback:'簡短回答不代表不友善。如果還想聊，可以補一句自我介紹，或分享一點自己的事情。',expression:'unsure',gesture:'你們安靜了一下。你還有機會再接一句。',kind:'retry'},
  {text:'「你成績好嗎？」',reply:'「還好……我不太想聊成績。」',feedback:'小哲說出了自己的界線。可以回「好，那我們聊別的」，再換一個輕鬆的話題。',expression:'unsure',gesture:'小哲有些猶豫，輕輕搖了搖頭。',kind:'retry'}
 ]
};
const app=document.querySelector('#app');
const state={page:'home',names:['小勇','小晴'],actor:0,choice:null,preference:null,next:null,selected:null,seconds:20,sound:false,practiceRound:0,beat:0,replyBeat:0,discussionDeadline:null};
let timer=null,audioContext=null;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const actor=()=>state.names[state.actor],detective=()=>state.names[1-state.actor];
const personalize=s=>s.replace('{name}',actor());
function primary(text,action,disabled=false){return `<button class="primary" data-action="${action}" ${disabled?'disabled':''}>${esc(text)}<span aria-hidden="true">▸</span></button>`;}
function stage({panel='',dialogue='',mode='',expression='friendly',step=1,turn='兩人一起',showCharacter=true,location=''}){
 const meta=chapter();location=location||'彩虹小學 · '+meta.location;
 const isProtagonist=dialogue.includes('data-speaker="我的心聲"');
 const characterFile=isProtagonist?'vn-protagonist.png':'vn-xiaozhe-friendly.png';
 const characterAlt=isProtagonist?'主角穿著黃色外套，帶著些許害羞，正在想怎麼開口。':'小哲穿著藍綠色外套，拿著星星鉛筆盒。';
 return `<section class="vn-stage ${mode} ${isProtagonist?'speaker-left':'speaker-right'}" aria-label="第 ${campaign.level} 關：${esc(meta.title)}"><img class="backdrop" src="assets/${meta.background}" alt="${esc(meta.location)}的明亮手繪場景"><div class="world-shade" aria-hidden="true"></div><div class="hud"><div class="location"><span class="chapter">${String(campaign.level).padStart(2,'0')}</span><span>${esc(location)}<small>友情任務 · ${esc(meta.title)}</small></span></div><div class="turn-indicator"><span>${esc(turn)}</span><small>${step} / 6</small></div></div>${showCharacter?`<div class="character ${expression==='unsure'?'hesitant':''}"><img src="assets/${characterFile}" alt="${characterAlt}"></div>`:''}${panel}${dialogue}</section>`;
}
function dialogue(speaker,text,action,label,{hint='',extra='',disabled=false,thought=false}={}){
 return `<section class="dialogue ${thought?'thought':''}" data-speaker="${esc(speaker)}" aria-label="${esc(speaker)}的對話"><div class="speaker">${esc(speaker)}</div><div class="dialogue-main"><p class="dialogue-text" tabindex="-1">${esc(text)}</p>${hint?`<p class="dialogue-hint">${esc(hint)}</p>`:''}${extra}</div><div class="dialogue-controls">${primary(label,action,disabled)}</div></section>`;
}
function choices(items){return `<div class="choice-panel" aria-label="選擇你想說的話"><p class="panel-caption">先選一句，再按下方按鈕</p><div class="choices">${items.map((item,i)=>`<button class="choice ${state.selected===i?'selected':''}" data-choice="${i}" aria-pressed="${state.selected===i}"><span class="letter" aria-hidden="true">${'ABCD'[i]}</span><span>${esc(personalize(typeof item==='string'?item:item.text))}</span><span class="chosen" aria-hidden="true">✓</span></button>`).join('')}</div></div>`;}
function render(){
 clearInterval(timer);timer=null;
 let html='';
 if(state.page==='complete')html=chapterComplete();
 else if(state.page.startsWith('c_'))html=renderCampaign();
 else switch(state.page){
 case 'home':html=stage({mode:'title-screen',panel:`<div class="title-panel"><p class="kicker">兩個人，一起走進故事</p><h1>友情任務<span>新朋友大挑戰</span></h1><div class="chapter-title"><b>七段故事</b>一起練習交朋友</div><p class="title-intro">新學期、新教室，<br>還有一個等你認識的新朋友。</p>${primary('兩人一起出發','setup')}<p class="title-meta">五年級 · 雙人共用 iPad · 每關約 5–8 分鐘</p></div>`,dialogue:'',step:1,turn:'六大任務＋最終挑戰'});break;
 case 'setup':html=stage({mode:'setup-screen',showCharacter:false,turn:'搭檔集合',panel:`<section class="setup-panel glass-panel"><p class="kicker">出發前，選個暱稱</p><h2>這趟冒險，你們是搭檔。</h2><p class="panel-intro">不用真名。另一位選擇時請先轉身，讓隊友自己想。</p><div class="setup-grid">${state.names.map((name,p)=>`<section class="player-box player-${p}"><h3>玩家 ${p+1} · ${p===state.actor?'行動者':'友情偵探'}</h3><p>${p===state.actor?'你會怎麼開口？':'你喜歡怎樣的開場？'}</p><div class="name-grid">${STORY.names.map(n=>`<button class="${n===name?'selected':''}" data-name="${n}" data-player="${p}" aria-pressed="${n===name}" ${state.names[1-p]===n?'disabled':''}>${n}</button>`).join('')}</div></section>`).join('')}</div>${primary('我們準備好了','c_map')}</section>`});break;
 case 'intro':{const beat=STORY.intro[state.beat];html=stage({mode:'story-screen',expression:beat.expression,dialogue:dialogue(beat.speaker,beat.text,'introNext',state.beat<2?'繼續故事':'準備打招呼',{hint:`序幕 ${state.beat+1} / 3 · ${state.beat===1?'有點緊張，也沒關係。':'每次按「繼續」，故事就向前一步。'}`,thought:beat.speaker==='我的心聲'})});break;}
 case 'passA':html=handoff(actor(),detective(),'換你決定第一句話。','A','chooseA');break;
 case 'chooseA':html=stage({mode:'choice-screen',turn:`${actor()} · 行動者`,panel:choices(STORY.opening),dialogue:dialogue('我的心聲','他還在整理鉛筆盒。我可以怎麼開始呢？','lockA','鎖定這句話',{hint:`${detective()} 請先轉身。選好後，換隊友。`,disabled:state.selected===null,thought:true})});break;
 case 'passB':html=handoff(detective(),actor(),'第一個選擇已經鎖定。','B','chooseB');break;
 case 'chooseB':html=stage({mode:'choice-screen',turn:`${detective()} · 友情偵探`,step:2,panel:choices(STORY.preferences),dialogue:dialogue('換個角度想','如果是你坐在這裡，你比較喜歡別人怎麼和你開始聊天？','lockB','鎖定，一起揭曉',{hint:'選自己的偏好，不用猜隊友選了什麼。',disabled:state.selected===null})});break;
 case 'reveal':html=stage({mode:'reveal-screen',turn:'兩人一起 · 聽聽彼此',step:3,panel:`<section class="reveal-panel"><div class="answer-card"><div class="card-owner">${esc(actor())}<small>我會這樣說</small></div><p>${esc(STORY.opening[state.choice].text)}</p></div><div class="answer-card"><div class="card-owner">${esc(detective())}<small>我比較喜歡</small></div><p>${esc(STORY.preferences[state.preference])}</p></div></section>`,dialogue:dialogue('搭檔時間',`${detective()}，聽到這個開場，你會怎麼接？${actor()}，聽完隊友的想法，你想調整哪個字或語氣？`,'discussed','我們都說過了',{hint:'不同偏好都可以。兩位各說一句，再把故事繼續下去。',extra:'<p class="timer" id="timer" role="status" aria-live="off"></p>',disabled:state.seconds>0})});break;
 case 'responseA':{const r=STORY.opening[state.choice];html=stage({mode:'story-screen',expression:r.expression,step:4,panel:`<p class="scene-caption">${esc(r.gesture)}</p>`,dialogue:state.replyBeat===0?dialogue('小哲',r.reply,'responseAFeedback','聽聽友情提示'):dialogue('友情小提示',r.feedback,'bridge','繼續故事')});break;}
 case 'bridge':html=stage({mode:'story-screen',step:4,dialogue:dialogue(state.choice<2?'我的心聲':'小哲',state.choice<2?'他叫小哲！接下來，我也可以讓他認識我。':'「對了，我叫小哲。你呢？」','chooseNext','試著接下一句',{thought:state.choice<2})});break;
 case 'chooseNext':html=stage({mode:'choice-screen',turn:'兩人一起 · 決定下一句',step:4,panel:choices(STORY.next),dialogue:dialogue('我的心聲','現在知道他叫小哲了。我可以怎麼把話接下去？','lockNext','就這樣說',{hint:'兩人先商量，再選一句。',disabled:state.selected===null,thought:true})});break;
 case 'responseNext':{const r=STORY.next[state.next];html=stage({mode:'story-screen',expression:r.expression,step:4,panel:`<p class="scene-caption">${esc(r.gesture)}</p>`,dialogue:state.replyBeat===0?dialogue('小哲',r.reply,'responseNextFeedback','聽聽友情提示'):dialogue('友情小提示',r.feedback,r.kind==='retry'?'chooseNext':'ending',r.kind==='retry'?'換一句，再試試':'繼續故事')});break;}
 case 'ending':html=stage({mode:'story-screen',step:5,panel:'<p class="scene-caption">窗外的風輕輕吹進來。原本陌生的座位，好像親切了一點。</p>',dialogue:dialogue('我的心聲','原來，開口不需要很厲害。問一點、分享一點，我們就開始認識彼此了。','practice','換我們真的說說看',{thought:true})});break;
 case 'practice':{const first=state.practiceRound===0?actor():detective(),second=state.practiceRound===0?detective():actor();html=stage({mode:'practice-screen',step:5,turn:`真人挑戰 · ${state.practiceRound+1} / 2`,panel:`<section class="practice-panel glass-panel"><p class="kicker">把故事帶回身邊</p><div class="practice-step"><b>先說</b><div><h3>${esc(first)}</h3><p>用一句話和 ${esc(second)} 開始聊天。</p></div></div><div class="practice-step"><b>接話</b><div><h3>${esc(second)}</h3><p>自然回答一句，也可以說「讓我想一下」。</p></div></div></section>`,dialogue:dialogue('搭檔時間',state.practiceRound===0?'現在，看看坐在你旁邊的搭檔。把剛剛想到的那句話，真的說出口。':'交換了！剛剛回答的人，這次先開口。說一句，也好好聽一句。','practiceDone',state.practiceRound===0?'說過了，交換':'兩輪都完成了',{hint:'可以照著提示說。不錄音、不評分，不用演得很厲害。'})});break;}
 }
 app.innerHTML=html;document.body.dataset.page=state.page;
 if(state.page==='reveal')startTimer();
 if(state.page==='c_reveal')campaignTimer();
}
function handoff(name,other,title,letter,next){return `<section class="handoff"><div class="handoff-inner"><p class="kicker">雙人交接時間</p><div class="big-letter" aria-hidden="true">${letter}</div><h2>${esc(title)}</h2><p>把 iPad 交給 <strong>${esc(name)}</strong>。<br>${esc(other)} 請先轉身，讓隊友自己想。</p>${primary(`${name} 準備好了`,next)}<p class="subtle">兩位都選好後，才一起揭曉。</p></div></section>`;}
function startTimer(){
 if(!state.discussionDeadline)state.discussionDeadline=Date.now()+state.seconds*1000;
 const tick=()=>{const remaining=Math.max(0,Math.ceil((state.discussionDeadline-Date.now())/1000));const el=document.querySelector('#timer');if(!el)return;el.textContent=remaining?`還有 ${remaining} 秒，留給彼此慢慢說。`:'有聽到彼此的想法，就可以繼續。';const b=document.querySelector('[data-action="discussed"]');b.disabled=remaining>0;if(!remaining&&timer){clearInterval(timer);timer=null;}};
 tick();if(state.discussionDeadline>Date.now())timer=setInterval(tick,250);
}
function goto(page){state.page=page;state.selected=null;render();app.focus({preventScroll:true});window.scrollTo(0,0);}
function reset(){state.choice=null;state.preference=null;state.next=null;state.selected=null;state.practiceRound=0;state.beat=0;state.replyBeat=0;state.discussionDeadline=null;}
function clickSound(){if(!state.sound)return;try{audioContext??=new(window.AudioContext||window.webkitAudioContext)();audioContext.resume();const o=audioContext.createOscillator(),g=audioContext.createGain();o.type='sine';o.frequency.setValueAtTime(520,audioContext.currentTime);o.frequency.exponentialRampToValueAtTime(720,audioContext.currentTime+.08);g.gain.setValueAtTime(.035,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.12);o.connect(g);g.connect(audioContext.destination);o.start();o.stop(audioContext.currentTime+.12);}catch{}}
app.addEventListener('click',event=>{
 const b=event.target.closest('button');if(!b||b.disabled)return;clickSound();
 if(campaignAction(b))return;
 if(b.dataset.name){state.names[Number(b.dataset.player)]=b.dataset.name;render();return;}
 if(b.dataset.choice!==undefined){state.selected=Number(b.dataset.choice);document.querySelectorAll('[data-choice]').forEach(x=>{const selected=Number(x.dataset.choice)===state.selected;x.classList.toggle('selected',selected);x.setAttribute('aria-pressed',String(selected));});const commit=document.querySelector('.dialogue-controls>.primary');if(commit)commit.disabled=false;return;}
 const action=b.dataset.action;
 if(action==='introNext'){if(state.beat<2){state.beat++;goto('intro');}else goto('passA');}
 else if(action==='lockA'){if(state.selected===null)return;state.choice=state.selected;goto('passB');}
 else if(action==='lockB'){if(state.selected===null)return;state.preference=state.selected;goto('reveal');}
 else if(action==='discussed'){state.replyBeat=0;goto('responseA');}
 else if(action==='responseAFeedback'){state.replyBeat=1;goto('responseA');}
 else if(action==='responseNextFeedback'){state.replyBeat=1;goto('responseNext');}
 else if(action==='lockNext'){if(state.selected===null)return;state.next=state.selected;state.replyBeat=0;goto('responseNext');}
 else if(action==='practiceDone'){if(state.practiceRound===0){state.practiceRound=1;goto('practice');}else goto('complete');}
 else if(action==='swap'){reset();state.actor=1-state.actor;goto('intro');}
 else if(action==='home'){reset();campaign.level=1;goto('home');}
 else if(action)goto(action);
});
document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();if(state.page==='home')return;if(state.page==='complete'||state.page==='setup'){reset();campaign.level=1;goto('home');}else document.querySelector('#restart-dialog').showModal();});
document.querySelector('#settings').addEventListener('click',()=>document.querySelector('#settings-dialog').showModal());
document.querySelector('#discussion-setting').addEventListener('change',e=>{state.seconds=Number(e.target.value);if(state.page==='reveal'||state.page==='c_reveal'){state.discussionDeadline=null;render();}});
document.querySelector('#sound-setting').addEventListener('change',e=>{state.sound=e.target.checked;clickSound();});
document.querySelector('#cancel-restart').addEventListener('click',()=>document.querySelector('#restart-dialog').close());
document.querySelector('#confirm-restart').addEventListener('click',()=>{document.querySelector('#restart-dialog').close();reset();campaign.level=1;goto('home');});
render();



