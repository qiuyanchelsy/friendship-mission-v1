'use strict';
// Story content is separate from the visual-novel renderer.
const STORY={intro:[],opening:[],next:[],preferences:['先打招呼、介紹自己。','從眼前的東西開始聊。','問一個簡單的問題。','先給我一點時間，再慢慢聊。']};
const app=document.querySelector('#app');
const state={page:'setup',names:['小勇','小晴'],actor:0,choice:null,preference:null,next:null,selected:null,seconds:20,sound:false,practiceRound:0,beat:0,replyBeat:0,discussionDeadline:null};
let timer=null,audioContext=null;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const actor=()=>state.names[state.actor],detective=()=>state.names[1-state.actor];
const personalize=s=>s.replace('{name}',actor());
function primary(text,action,disabled=false){return `<button class="primary" data-action="${action}" ${disabled?'disabled':''}>${esc(text)}<span aria-hidden="true">▸</span></button>`;}
function stage({panel='',dialogue='',mode='',expression='neutral',step=1,turn='兩人一起',showCharacter=true,location=''}){
 const hasLater=typeof later==='function'&&state.page.startsWith('later');
 const sceneTitle=hasLater?later().title:route().title;
 const sceneLocation=hasLater?later().place:'彩虹小學 · 五年級教室';
 const sceneNumber=hasLater?String(campaign.level).padStart(2,'0'):'01';
 const sceneBackground=hasLater?`assets/${later().scene}`:'assets/vn-classroom.webp';
 const raw=dialogue.match(/data-speaker="([^"]+)"/)?.[1]||'';
 const speaker=raw==='我的心聲'?actor():raw==='換個角度想'?detective():raw;
 const active=state.names.indexOf(speaker);
 const p=state.page==='chooseB'?1-state.actor:state.page==='practice'&&state.practiceRound===1?1-state.actor:state.actor;
 const duo=mode==='story-screen',single=['choice-screen','practice-screen','reveal-screen'].includes(mode);
 const figures=!showCharacter?'':duo?[0,1].map(i=>'<div class="vn-person '+(i===0?'player-person':'partner-person')+' '+(active===i?'speaking':'listening')+'">'+characterImage(avatar(i),i===0?'left':'right',activeMood(i,speaker))+'</div>').join(''):single?'<div class="vn-person solo-person">'+characterImage(avatar(p),'left')+'</div>':'';
 const position=active===0?'speaker-left':active===1?'speaker-right':'speaker-center';
 return '<section class="vn-stage v2-stage '+mode+' '+position+'" aria-label="第'+sceneNumber+'關：'+sceneTitle+'"><img class="backdrop" src="'+sceneBackground+'" alt="'+esc(sceneLocation)+'"><div class="world-shade" aria-hidden="true"></div><div class="hud"><div class="location"><span class="chapter">'+sceneNumber+'</span><span>'+esc(sceneTitle)+'<small>'+esc(actor())+' ＆ '+esc(detective())+'</small></span></div><div class="turn-indicator"><img class="inline-avatar" src="'+portrait(avatar(active>=0?active:p))+'" alt=""><span>'+esc(turn)+'<small>'+esc(active>=0?state.names[active]:state.names[p])+' · '+step+' / 6</small></span></div></div>'+figures+panel+dialogue+'</section>';
}
function dialogue(speaker,text,action,label,{hint='',extra='',disabled=false,thought=false}={}){
 return `<section class="dialogue ${thought?'thought':''}" data-speaker="${esc(speaker)}" aria-label="${esc(speaker)}的對話"><div class="speaker">${esc(speaker==='我的心聲'?actor()+' · 心聲':speaker==='換個角度想'?detective()+' · 想一想':speaker)}</div><div class="dialogue-main"><p class="dialogue-text" tabindex="-1">${esc(text)}</p>${hint?`<p class="dialogue-hint">${esc(hint)}</p>`:''}${extra}</div><div class="dialogue-controls">${primary(label,action,disabled)}</div></section>`;
}
function choices(items){return `<div class="choice-panel" aria-label="選擇你想說的話"><p class="panel-caption">先選一句，再按下方按鈕</p><div class="choices">${items.map((item,i)=>`<button class="choice ${state.selected===i?'selected':''}" data-choice="${i}" aria-pressed="${state.selected===i}"><span class="letter" aria-hidden="true">${'ABCD'[i]}</span><span>${esc(personalize(typeof item==='string'?item:item.text))}</span><span class="chosen" aria-hidden="true">✓</span></button>`).join('')}</div></div>`;}
function render(){
 clearInterval(timer);timer=null;
 let html=renderV2();
 if(html===null)switch(state.page){
 case 'intro':{const beat=STORY.intro[state.beat];html=stage({mode:'story-screen',expression:beat.expression,dialogue:dialogue(beat.speaker,beat.text,'introNext',state.beat<2?'繼續故事':'準備打招呼',{hint:`序幕 ${state.beat+1} / 3 · ${state.beat===1?'有點緊張，也沒關係。':'每次按「繼續」，故事就向前一步。'}`,thought:beat.speaker==='我的心聲'})});break;}
 case 'passA':html=handoff(actor(),detective(),'換你決定第一句話。','A','chooseA');break;
 case 'chooseA':html=stage({mode:'choice-screen',turn:`${actor()} · 行動者`,panel:choices(STORY.opening),dialogue:dialogue('我的心聲',`${detective()}${partnerRoute().busy}。我可以怎麼開始呢？`,'lockA','鎖定這句話',{hint:`${detective()} 請先轉身。選好後，換隊友。`,disabled:state.selected===null,thought:true})});break;
 case 'passB':html=handoff(detective(),actor(),'第一個選擇已經鎖定。','B','chooseB');break;
 case 'chooseB':html=stage({mode:'choice-screen',turn:`${detective()} · 友情偵探`,step:2,panel:choices(STORY.preferences),dialogue:dialogue('換個角度想','如果是你坐在這裡，你比較喜歡別人怎麼和你開始聊天？','lockB','鎖定，一起揭曉',{hint:'選自己的偏好，不用猜隊友選了什麼。',disabled:state.selected===null})});break;
 case 'reveal':html=stage({mode:'reveal-screen',turn:'兩人一起 · 聽聽彼此',step:3,panel:`<section class="reveal-panel"><div class="answer-card"><div class="card-owner">${esc(actor())}<small>我會這樣說</small></div><p>${esc(STORY.opening[state.choice].text)}</p></div><div class="answer-card"><div class="card-owner">${esc(detective())}<small>我比較喜歡</small></div><p>${esc(STORY.preferences[state.preference])}</p></div></section>`,dialogue:dialogue('搭檔時間',`${detective()}，聽到這個開場，你會怎麼接？${actor()}，聽完隊友的想法，你想調整哪個字或語氣？`,'discussed','我們都說過了',{hint:'不同偏好都可以。兩位各說一句，再把故事繼續下去。',extra:'<p class="timer" id="timer" role="status" aria-live="off"></p>',disabled:state.seconds>0})});break;
 case 'responseA':{const r=STORY.opening[state.choice];html=stage({mode:'story-screen',expression:r.expression,step:4,panel:`<p class="scene-caption">${esc(r.gesture)}</p>`,dialogue:state.replyBeat===0?dialogue(detective(),r.reply,'responseAFeedback','聽聽友情提示'):dialogue('友情小提示',r.feedback,'bridge','繼續故事')});break;}
 case 'bridge':html=stage({mode:'story-screen',step:4,dialogue:dialogue(state.choice<2?'我的心聲':detective(),state.choice<2?`接下來，也讓${detective()}多認識我一點。`:`「對了，我叫${detective()}。你呢？」`,'chooseNext','試著接下一句',{thought:state.choice<2})});break;
 case 'chooseNext':html=stage({mode:'choice-screen',turn:'兩人一起 · 決定下一句',step:4,panel:choices(STORY.next),dialogue:dialogue('我的心聲',`現在知道對方叫${detective()}了。我想怎麼接話？`,'lockNext','就這樣說',{hint:'兩人先商量，再選一句。',disabled:state.selected===null,thought:true})});break;
 case 'responseNext':{const r=STORY.next[state.next];html=stage({mode:'story-screen',expression:r.expression,step:4,panel:`<p class="scene-caption">${esc(r.gesture)}</p>`,dialogue:state.replyBeat===0?dialogue(detective(),r.reply,'responseNextFeedback','聽聽友情提示'):dialogue('友情小提示',r.feedback,r.kind==='retry'?'chooseNext':'noticeCharm',r.kind==='retry'?'換一句，再試試':'繼續故事')});break;}
 case 'ending':html=stage({mode:'story-screen',step:5,panel:'<p class="scene-caption">窗外的風輕輕吹進來。原本陌生的座位，好像親切了一點。</p>',dialogue:dialogue('我的心聲','原來，開口不需要很厲害。問一點、分享一點，我們就開始認識彼此了。','practice','換我們真的說說看',{thought:true})});break;
 case 'practice':{const first=state.practiceRound===0?actor():detective(),second=state.practiceRound===0?detective():actor();html=stage({mode:'practice-screen',step:5,turn:`真人挑戰 · ${state.practiceRound+1} / 2`,panel:`<section class="practice-panel glass-panel"><p class="kicker">把故事帶回身邊</p><div class="practice-step"><b>先說</b><div><h3>${esc(first)}</h3><p>用一句話和 ${esc(second)} 開始聊天。</p></div></div><div class="practice-step"><b>接話</b><div><h3>${esc(second)}</h3><p>自然回答一句，也可以說「讓我想一下」。</p></div></div></section>`,dialogue:dialogue('搭檔時間',state.practiceRound===0?'現在，看看坐在你旁邊的搭檔。把剛剛想到的那句話，真的說出口。':'交換了！剛剛回答的人，這次先開口。說一句，也好好聽一句。','practiceDone',state.practiceRound===0?'說過了，交換':'兩輪都完成了',{hint:'可以照著提示說。不錄音、不評分，不用演得很厲害。'})});break;}
 }
 app.innerHTML=html;document.body.dataset.page=state.page;
 const edition=document.querySelector('.edition');if(edition)edition.textContent=`版本2 · 第 ${campaign.level||1} 關`;
 if(state.page==='reveal')startTimer();

}
function handoff(name,other,title,letter,next){return `<section class="handoff"><div class="handoff-inner"><p class="kicker">雙人交接時間</p><img class="handoff-portrait" src="${portrait(avatar(state.names.indexOf(name)))}" alt="${esc(name)}"><h2>${esc(title)}</h2><p>把 iPad 交給 <strong>${esc(name)}</strong>。<br>${esc(other)} 請先轉身，讓隊友自己想。</p>${primary(`${name} 準備好了`,next)}<p class="subtle">兩位都選好後，才一起揭曉。</p></div></section>`;}
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
 if(v2Action(b))return;
 if(b.dataset.name){state.names[Number(b.dataset.player)]=b.dataset.name;render();return;}
 if(b.dataset.choice!==undefined){state.selected=Number(b.dataset.choice);document.querySelectorAll('[data-choice]').forEach(x=>{const selected=Number(x.dataset.choice)===state.selected;x.classList.toggle('selected',selected);x.setAttribute('aria-pressed',String(selected));});const commit=document.querySelector('.dialogue-controls>.primary');if(commit)commit.disabled=false;return;}
 const action=b.dataset.action;
 if(action==='introNext'){if(state.beat<2){state.beat++;goto('intro');}else goto('passA');}
 else if(action==='lockA'){if(state.selected===null)return;state.choice=state.selected;goto('passB');}
 else if(action==='lockB'){if(state.selected===null)return;state.preference=state.selected;goto('reveal');}
 else if(action==='discussed'){state.replyBeat=0;goto('speakA');}
 else if(action==='responseAFeedback'){state.replyBeat=1;goto('responseA');}
 else if(action==='responseNextFeedback'){state.replyBeat=1;goto('responseNext');}
 else if(action==='lockNext'){if(state.selected===null)return;state.next=state.selected;state.replyBeat=0;goto('speakNext');}
 else if(action==='practiceDone'){if(state.practiceRound===0){state.practiceRound=1;goto('practice');}else goto('complete');}
 else if(action==='swap'){reset();state.actor=1-state.actor;goto('intro');}
 else if(action==='home'){freshPair();}
 else if(action)goto(action);
});
document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();if(state.page==='setup')return;if(state.page==='complete'||state.page==='setup'){freshPair();}else document.querySelector('#restart-dialog').showModal();});
document.querySelector('#settings').addEventListener('click',()=>document.querySelector('#settings-dialog').showModal());
document.querySelector('#discussion-setting').addEventListener('change',e=>{state.seconds=Number(e.target.value);if(state.page==='reveal'){state.discussionDeadline=null;render();}});
document.querySelector('#sound-setting').addEventListener('change',e=>{state.sound=e.target.checked;clickSound();});
document.querySelector('#cancel-restart').addEventListener('click',()=>document.querySelector('#restart-dialog').close());
document.querySelector('#confirm-restart').addEventListener('click',()=>{document.querySelector('#restart-dialog').close();freshPair();});
render();



