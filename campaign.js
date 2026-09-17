'use strict';
const campaign={level:1,completed:[],miniPicks:[],miniIndex:0,miniAnswers:[],miniFeedback:'',miniPassed:false,decision:0,result:null,toolPlayer:0,tools:[[],[]]};
function chapter(){return CHAPTERS[campaign.level];}
function startChapter(level,swap=true){if(swap)state.actor=1-state.actor;reset();campaign.level=level;campaign.miniPicks=[];campaign.miniIndex=0;campaign.miniAnswers=[];campaign.miniFeedback='';campaign.miniPassed=false;campaign.decision=0;campaign.result=null;goto(level===1?'intro':'c_intro');}
function chapterPanel(content,extra=''){return `<section class="activity-panel glass-panel ${extra}">${content}</section>`;}
function chapterComplete(){
 if(!campaign.completed.includes(campaign.level))campaign.completed.push(campaign.level);
 const c=chapter(),all=campaign.completed.length===7;
 return stage({mode:'complete-screen',step:6,turn:'任務完成',panel:`<section class="complete-panel glass-panel"><p class="kicker">第 ${campaign.level} 關 · ${esc(c.title)}</p><div class="badge-label">獲得技能 · ${esc(c.skill)}</div><h2>又多了一個<br>與人相處的方法。</h2><p>${esc(actor())} 和 ${esc(detective())}，你們都練習過了！</p><div class="chips"><span>已完成 ${campaign.completed.length} / 7 關</span><span>✓ 兩人都開口</span></div><div class="button-row"><button class="secondary" data-action="c_map">關卡地圖</button><button class="secondary" data-action="repeatChapter">交換任務重玩</button></div></section>`,dialogue:dialogue('友情小提示',c.summary,all?'c_tools':campaign.level<7?'nextChapter':'c_map',all?'整理友情工具箱':campaign.level<7?'交換任務，前往下一關':'看看其他任務',{hint:'完成標記只記錄練習進度，不評定交朋友的能力。'})});
}
function renderCampaign(){
 const c=chapter();
 switch(state.page){
 case 'c_map':return stage({mode:'map-screen',showCharacter:false,turn:`練習進度 ${campaign.completed.length} / 7`,panel:chapterPanel(`<p class="kicker">彩虹小學 · 友情任務地圖</p><h2>下一站，想練習什麼？</h2><p class="panel-intro">可以依序遊玩，也可以配合課堂直接選關。每關約 5–8 分鐘。</p><div class="chapter-grid">${Object.entries(CHAPTERS).map(([id,x])=>`<button class="chapter-card ${campaign.completed.includes(+id)?'done':''}" data-level="${id}"><span>${+id===7?'最終挑戰':`任務 ${id}`}</span><strong>${esc(x.title)}</strong><small>${campaign.completed.includes(+id)?'✓ 已完成 · 可重玩':esc(x.skill)}</small></button>`).join('')}</div><div class="button-row">${primary('打開友情工具箱','c_tools')}<button class="secondary" data-action="home">回首頁</button></div>`,'map-panel')});
 case 'c_intro':{const beat=c.intro[state.beat];return stage({mode:'story-screen',dialogue:dialogue(beat[0],beat[1],'c_introNext',state.beat<c.intro.length-1?'繼續故事':'準備選擇',{hint:`情境 ${state.beat+1} / ${c.intro.length}`,thought:beat[0]==='我的心聲'})});}
 case 'c_passA':return handoff(actor(),detective(),'先想想，你會怎麼做？','A','c_chooseA');
 case 'c_chooseA':return stage({mode:'choice-screen',turn:`${actor()} · 行動者`,panel:choices(c.opening.map(x=>x[0])),dialogue:dialogue('我的心聲',c.question,'c_lockA','鎖定我的選擇',{hint:`${detective()} 請先轉身。這是練習，不用猜標準答案。`,disabled:state.selected===null,thought:true})});
 case 'c_passB':return handoff(detective(),actor(),'第一個選擇已鎖定。','B','c_chooseB');
 case 'c_chooseB':return stage({mode:'choice-screen',step:2,turn:`${detective()} · 友情偵探`,panel:choices(c.preferences),dialogue:dialogue('換個角度想',c.bQuestion,'c_lockB','鎖定，一起揭曉',{hint:'依自己的經驗選擇，不用猜隊友的答案。',disabled:state.selected===null})});
 case 'c_reveal':return stage({mode:'reveal-screen',step:3,turn:'兩人一起 · 討論差異',panel:`<section class="reveal-panel"><div class="answer-card"><div class="card-owner">${esc(actor())}<small>我的想法</small></div><p>${esc(c.opening[state.choice][0])}</p></div><div class="answer-card"><div class="card-owner">${esc(detective())}<small>另一個角度</small></div><p>${esc(c.preferences[state.preference])}</p></div></section>`,dialogue:dialogue('搭檔時間',c.discussion,'c_discussed','我們都說過了',{hint:'輪流說一個想法，聽完再回應。',extra:'<p class="timer" id="campaign-timer" role="status" aria-live="off"></p>',disabled:state.seconds>0})});
 case 'c_response':return stage({mode:'story-screen',step:3,dialogue:dialogue(state.replyBeat===0?(campaign.level===7?'情境回應':'故事回應'):'友情小提示',c.opening[state.choice][state.replyBeat===0?1:2],state.replyBeat===0?'c_responseTip':'c_mini',state.replyBeat===0?'聽聽提示':'一起來試試')});
 case 'c_mini':return renderMini();
 case 'c_event':{const d=c.decisions[campaign.decision];return stage({mode:'story-screen',step:4,dialogue:dialogue(d.speaker,d.text,'c_decide','一起決定下一步')});}
 case 'c_decide':{const d=c.decisions[campaign.decision];return stage({mode:'choice-screen',step:4,turn:'兩人一起 · 共同決定',panel:choices(d.choices.map(x=>x[0])),dialogue:dialogue('我的心聲',d.question,'c_decisionLock','我們決定這樣做',{disabled:state.selected===null,thought:true})});}
 case 'c_result':{const r=campaign.result;return stage({mode:'story-screen',step:4,dialogue:dialogue(state.replyBeat===0?'故事回應':'友情小提示',r[state.replyBeat===0?1:2],state.replyBeat===0?'c_resultTip':r[3]?'c_afterDecision':'c_decide',state.replyBeat===0?'看看這個做法':r[3]?'繼續故事':'換個方法，再試試')});}
 case 'c_practice':{const first=state.practiceRound===0?actor():detective(),second=state.practiceRound===0?detective():actor();return stage({mode:'practice-screen',step:5,turn:`真人挑戰 ${state.practiceRound+1} / 2`,panel:chapterPanel(`<p class="kicker">把故事帶回身邊</p><div class="practice-step"><b>先說</b><div><h3>${esc(first)}</h3><p>${esc(c.practice[0])}</p></div></div><div class="practice-step"><b>回應</b><div><h3>${esc(second)}</h3><p>${esc(c.practice[1])}</p></div></div>`,'practice-panel'),dialogue:dialogue('搭檔時間',state.practiceRound===0?'看看身邊的隊友，真的試著說一次。':'這次交換任務，讓另一位也練習開口。','c_practiceDone',state.practiceRound===0?'完成，交換':'兩輪都完成了',{hint:'不錄音、不評分。可以照讀提示，也可以用自己的話說。'})});}
 case 'c_tools':return renderTools();
 case 'c_final':return renderFinal();
 }
}
function miniButtons(items){return `<div class="mini-grid">${items.map((text,i)=>`<button class="mini-card ${campaign.miniPicks.includes(i)?'selected':''}" data-mini="${i}" aria-pressed="${campaign.miniPicks.includes(i)}">${esc(text)}${campaign.miniPicks.includes(i)?`<b>${chapter().mini.kind==='order'?campaign.miniPicks.indexOf(i)+1:'✓'}</b>`:''}</button>`).join('')}</div>`;}
function renderMini(){
 const m=chapter().mini;let body='',ready=false;
 if(m.kind==='order'){body=miniButtons([m.items[1],m.items[2],m.items[0]]);ready=campaign.miniPicks.length===3;}
 if(m.kind==='topics'){body=miniButtons(m.items.map(x=>x[0]));ready=campaign.miniPicks.length===3;if(campaign.miniPassed)body+=`<div class="mini-result">${campaign.miniPicks.map(i=>`<p><strong>${esc(m.items[i][0])}</strong> ${esc(m.items[i][1])}</p>`).join('')}</div>`;}
 if(m.kind==='cues'){body=miniButtons(m.items);ready=campaign.miniPicks.length>=2;}
 if(m.kind==='sort'){
  if(campaign.miniIndex<m.items.length){const item=m.items[campaign.miniIndex];body=`<p class="mini-count">第 ${campaign.miniIndex+1} / ${m.items.length} 張</p><p class="sort-card">${esc(item[0])}</p><div class="sort-buttons">${m.categories.map((name,i)=>`<button class="secondary" data-sort="${i}" ${campaign.miniPassed?'disabled':''}>${esc(name)}</button>`).join('')}</div>`;}
  else body=`<p class="sort-card">每張卡都分好了！<br>${campaign.level===7?'自在地說不，是友情裡重要的界線。':'想法不等於事實，下一步也可以自己選。'}</p>`;
  ready=campaign.miniPassed||campaign.miniIndex>=m.items.length;
 }
 if(m.kind==='relay'){
  if(campaign.miniIndex<m.rounds.length){const r=m.rounds[campaign.miniIndex];body=`<p class="mini-count">對話球 ${campaign.miniIndex+1} / 3 · 小哲說</p><p class="sort-card">${esc(r.text)}</p><div class="relay-choices">${r.options.map((x,i)=>`<button class="mini-card" data-relay="${i}" ${campaign.miniPassed?'disabled':''}>${esc(x[0])}</button>`).join('')}</div>`;}
  else {const kinds=campaign.miniAnswers;body=`<p class="sort-card">我們用了：${kinds.map(esc).join(' → ')}</p><p>${kinds.every(x=>x==='問')?'你們很會問問題，接下來也可以分享自己的事情，讓聊天更有來回。':kinds.every(x=>x==='分享')?'你們分享了自己的經驗，接下來也可以問問對方。':'你們用了不同的接話方法，讓彼此都有說話機會。'}</p>`;}
  ready=campaign.miniPassed||campaign.miniIndex>=m.rounds.length;
 }
 const finished=(m.kind==='sort'&&campaign.miniIndex>=m.items.length)||(m.kind==='relay'&&campaign.miniIndex>=m.rounds.length);
 const buttonLabel=finished?'繼續故事':(m.kind==='sort'||m.kind==='relay')?'下一張／下一句':campaign.miniPassed?'繼續故事':'看看我們的選擇';
 return stage({mode:'activity-screen',step:4,turn:'兩人一起 · 友情練習',panel:chapterPanel(`<p class="kicker">${esc(m.title)}</p>${body}${campaign.miniFeedback?`<p class="mini-feedback" role="status">${esc(campaign.miniFeedback)}</p>`:''}`),dialogue:dialogue('搭檔時間',m.instruction,'c_miniContinue',buttonLabel,{hint:'可以討論、修改、再試一次；不用搶快。',disabled:!ready})});
}
function miniContinue(){
 const m=chapter().mini;
 if(m.kind==='sort'||m.kind==='relay'){
  const total=m.kind==='sort'?m.items.length:m.rounds.length;
  if(campaign.miniIndex>=total){goto('c_event');return;}
  if(!campaign.miniPassed)return;campaign.miniIndex++;campaign.miniPassed=false;campaign.miniFeedback='';goto('c_mini');return;
 }
 if(campaign.miniPassed){goto('c_event');return;}
 if(m.kind==='order'){
  if(campaign.miniPicks.join(',')==='2,0,1'){campaign.miniPassed=true;campaign.miniFeedback='先觀察 → 開口詢問 → 聽對方回答。詢問之後，也要等對方回應。';}
  else{campaign.miniFeedback='可以先了解活動，再詢問，最後聽對方的回答。依這個順序調整看看。';campaign.miniPicks=[];}
 }
 if(m.kind==='topics'&&campaign.miniPicks.length===3){campaign.miniPassed=true;campaign.miniFeedback='每人挑一句回應：問一個相關問題，或分享自己的小經驗。';}
 if(m.kind==='cues'){
  if(campaign.miniPicks.length>=2&&campaign.miniPicks.every(i=>m.valid.includes(i))){campaign.miniPassed=true;campaign.miniFeedback='這些都有可能。接下來可以問：「你是不是要去忙了？」';}
  else campaign.miniFeedback='「一定討厭我」超出了我們觀察到的證據。取消這一張，再保留至少兩種可能。';
 }
 goto('c_mini');
}
function renderTools(){
 const p=campaign.toolPlayer;
 return stage({mode:'map-screen',showCharacter:false,turn:`${state.names[p]} · 選三項`,step:6,panel:chapterPanel(`<p class="kicker">我的友情工具箱</p><h2>${esc(state.names[p])}，你想帶走哪三招？</h2><p class="panel-intro">選想練習的技能，不是挑「已經最厲害」的技能。</p><div class="tool-grid">${FRIENDSHIP_TOOLS.map((t,i)=>`<button class="mini-card ${campaign.tools[p].includes(i)?'selected':''}" data-tool="${i}" aria-pressed="${campaign.tools[p].includes(i)}">${esc(t)}${campaign.tools[p].includes(i)?' ✓':''}</button>`).join('')}</div><p class="mini-count">已選 ${campaign.tools[p].length} / 3</p><div class="button-row">${primary(p===0?'換另一位選三招':'完成我們的工具箱','c_toolsNext',campaign.tools[p].length!==3)}<button class="secondary" data-action="c_map">回關卡地圖</button></div>`,'map-panel')});
}
function renderFinal(){return stage({mode:'map-screen',showCharacter:false,step:6,turn:'我們的友情工具箱',panel:chapterPanel(`<p class="kicker">我們的友情旅程</p><h2>慢慢了解彼此，<br>也自在地做自己。</h2><p class="panel-intro">完成 ${campaign.completed.length} / 7 關；沒有排名，也沒有能力高低分。</p><div class="tool-results">${state.names.map((n,p)=>`<section class="answer-card"><h3>${esc(n)}</h3><p>${campaign.tools[p].map(i=>esc(FRIENDSHIP_TOOLS[i])).join(' · ')}</p></section>`).join('')}</div><p class="mini-feedback">這週，選一項在教室裡試試看。你打算在什麼時候、跟誰練習？</p><div class="button-row">${primary('儲存成果圖片','c_export')}<button class="secondary" data-action="c_map">回關卡地圖</button><button class="secondary" data-action="c_toolsAgain">重新選技能</button></div><p id="export-status" role="status" class="subtle"></p>`,'map-panel')});}
function campaignAction(b){
 const action=b.dataset.action;
 if(b.dataset.level){startChapter(Number(b.dataset.level),false);return true;}
 if(b.dataset.mini!==undefined){const i=Number(b.dataset.mini),m=chapter().mini;if(campaign.miniPassed)return true;const n=campaign.miniPicks.indexOf(i);if(n>=0)campaign.miniPicks.splice(n,1);else if(campaign.miniPicks.length<(m.kind==='cues'?4:3))campaign.miniPicks.push(i);campaign.miniFeedback='';render();return true;}
 if(b.dataset.sort!==undefined){const m=chapter().mini,item=m.items[campaign.miniIndex];if(!item||campaign.miniPassed)return true;if(Number(b.dataset.sort)===item[1]){campaign.miniPassed=true;campaign.miniFeedback=item[2];}else campaign.miniFeedback=`再想想：${item[2]} 可以換一類試試。`;render();return true;}
 if(b.dataset.relay!==undefined){const r=chapter().mini.rounds[campaign.miniIndex];if(!r||campaign.miniPassed)return true;const o=r.options[Number(b.dataset.relay)];campaign.miniAnswers.push(o[1]);campaign.miniPassed=true;campaign.miniFeedback=`小哲回應：${o[2]}`;render();return true;}
 if(b.dataset.tool!==undefined){const list=campaign.tools[campaign.toolPlayer],i=Number(b.dataset.tool),n=list.indexOf(i);if(n>=0)list.splice(n,1);else if(list.length<3)list.push(i);render();return true;}
 if(action==='nextChapter'){startChapter(Math.min(7,campaign.level+1));return true;}
 if(action==='repeatChapter'){startChapter(campaign.level);return true;}
 if(!action?.startsWith('c_'))return false;
 if(action==='c_introNext'){if(state.beat<chapter().intro.length-1){state.beat++;goto('c_intro');}else goto('c_passA');}
 else if(action==='c_lockA'){if(state.selected===null)return true;state.choice=state.selected;goto('c_passB');}
 else if(action==='c_lockB'){if(state.selected===null)return true;state.preference=state.selected;goto('c_reveal');}
 else if(action==='c_discussed'){state.replyBeat=0;goto('c_response');}
 else if(action==='c_responseTip'){state.replyBeat=1;goto('c_response');}
 else if(action==='c_miniContinue')miniContinue();
 else if(action==='c_decisionLock'){if(state.selected===null)return true;campaign.result=chapter().decisions[campaign.decision].choices[state.selected];state.replyBeat=0;goto('c_result');}
 else if(action==='c_resultTip'){state.replyBeat=1;goto('c_result');}
 else if(action==='c_afterDecision'){campaign.decision++;goto(campaign.decision<chapter().decisions.length?'c_event':'c_practice');}
 else if(action==='c_practiceDone'){if(state.practiceRound===0){state.practiceRound=1;goto('c_practice');}else goto('complete');}
 else if(action==='c_toolsNext'){if(campaign.tools[campaign.toolPlayer].length!==3)return true;if(campaign.toolPlayer===0){campaign.toolPlayer=1;goto('c_tools');}else goto('c_final');}
 else if(action==='c_toolsAgain'){campaign.toolPlayer=0;goto('c_tools');}
 else if(action==='c_export'){exportResult();}
 else {if(action==='c_tools')campaign.toolPlayer=0;goto(action);}
 return true;
}
function campaignTimer(){
 if(!state.discussionDeadline)state.discussionDeadline=Date.now()+state.seconds*1000;
 const tick=()=>{const seconds=Math.max(0,Math.ceil((state.discussionDeadline-Date.now())/1000));const e=document.querySelector('#campaign-timer');if(!e)return;e.textContent=seconds?`還有 ${seconds} 秒，留給彼此慢慢說。`:'兩位都說過想法，就可以繼續。';document.querySelector('[data-action="c_discussed"]').disabled=seconds>0;if(!seconds)clearInterval(timer);};tick();if(state.discussionDeadline>Date.now())timer=setInterval(tick,250);
}
async function exportResult(){
 const status=document.querySelector('#export-status');status.textContent='正在製作成果圖片……';
 try{const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=900;const ctx=canvas.getContext('2d');const img=new Image();img.src='assets/friendship-courtyard.png';await img.decode();ctx.drawImage(img,0,0,1600,900);ctx.fillStyle='rgba(15,45,60,.88)';ctx.fillRect(65,65,1470,770);ctx.fillStyle='#ffe4a0';ctx.font='bold 58px sans-serif';ctx.fillText('我們的友情工具箱',130,170);ctx.fillStyle='#fff9e7';ctx.font='30px sans-serif';ctx.fillText(`已完成 ${campaign.completed.length} / 7 個友情任務`,130,235);state.names.forEach((name,p)=>{const x=130+p*730;ctx.font='bold 44px sans-serif';ctx.fillStyle='#ffe4a0';ctx.fillText(name,x,345);ctx.font='36px sans-serif';ctx.fillStyle='#fff9e7';campaign.tools[p].forEach((i,n)=>ctx.fillText('• '+FRIENDSHIP_TOOLS[i],x,425+n*78));});ctx.font='32px sans-serif';ctx.fillText('真正的朋友，是兩個人都能自在做自己。',130,735);ctx.font='23px sans-serif';ctx.fillText(new Date().toLocaleDateString('zh-TW'),130,788);canvas.toBlob(blob=>{if(!blob){status.textContent='圖片未能產生，請再試一次。';return;}const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='我們的友情工具箱.png';a.click();setTimeout(()=>URL.revokeObjectURL(u),60000);status.textContent='成果圖片已產生；iPad 可依瀏覽器提示下載或儲存。';},'image/png');}
 catch{status.textContent='暫時無法儲存圖片，請稍後再試，或截圖保留工具箱。';}
}
