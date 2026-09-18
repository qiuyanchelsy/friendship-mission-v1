'use strict';
// Chapters 2–7: the selected pair remains the cast in every scene.
const LATER_CHAPTERS={
 2:{title:'我可以一起玩嗎？',skill:'禮貌加入',place:'下課的操場',scene:'playground.webp',lead:'下課時，{other}正在和幾位同學玩數字卡。{actor}也想加入。',thought:'我想一起玩，但他們已經開始了。我可以先看懂規則，再問問看。',prompt:'我想加入，第一句可以怎麼說？',choices:[
  ['「下一局我可以一起嗎？」','「現在這局剛好滿了，下一局可以再問問。」','先詢問，也留給正在玩的人回答的空間。',true],
  ['先站在旁邊看規則，再找適合的時候問。','{other}注意到你站在旁邊。','先觀察能幫助你了解活動，接著仍要清楚說出想法。',true],
  ['直接坐下，拿一張牌。','「等一下，那是我們正在用的牌！」','想加入也要先確認，讓原本在玩的人有準備。',false],
  ['「為什麼都沒有找我？」','「我們剛好先開始了……」','失望是真的，但直接責怪容易讓對方不知道怎麼回應。',false]],
  mini:['先觀察正在玩的規則','友善地問能不能加入','好好聽對方的回答'],decision:'這一局暫時沒有位置。接下來可以怎麼做？',answers:[
  ['「好，我下一局再問你們。」','願意等待，並不代表委屈自己；你也可以決定要等多久。',true],['「那我先去看看其他人在玩什麼。」','換一個活動，也是在替自己找新的機會。',true],['「你們就是不喜歡我！」','「現在不行」不是「永遠不喜歡你」。先分開事實和擔心。',false]],practice:['問隊友：「下一局我可以一起嗎？」','選一句回答：「可以」、「現在滿了」或「等一下可以」。'],summary:'先觀察、再詢問。現在不能加入，不等於不被喜歡。'},
 3:{title:'喜歡不一樣，也能聊',skill:'找共同點',place:'圖書館閱讀區',scene:'library.webp',lead:'閱讀時間，{actor}想分享{interest}；{other}卻說他更喜歡{otherInterest}。',thought:'喜歡不同也沒關係。我可以先聽聽對方喜歡什麼。',prompt:'對方興趣和我不同，我可以怎麼接？',choices:[
  ['「你喜歡{otherInterest}的哪個部分？」','「我喜歡可以一直發現新東西！」','好奇對方的興趣，不需要先變成專家。',true],
  ['「我還喜歡別的事情，你平常還喜歡什麼？」','「那我們可以慢慢交換介紹。」','多打開一個話題，就多一個了解彼此的機會。',true],
  ['一直介紹自己的興趣。','「嗯……可是我對這個不太熟。」','分享可以，也要留意對方想不想繼續聽。',false],
  ['「那我們沒什麼好聊的。」','「其實還有很多事可以聊啊。」','只是一個興趣不同，還不能決定你們聊不來。',false]],
  mini:['輪流介紹一件喜歡的事','問一個具體的好奇問題','分享後停一下等對方回應'],decision:'{other}說：「就算喜歡不同，也可以互相介紹。」我怎麼回？',answers:[
  ['「可以多跟我說一點嗎？」','讓對方知道你願意聽，也可以再問一個具體問題。',true],['分享一件相關的小經驗，再問他。','分享自己，也把說話機會留給對方。',true],['「這個很無聊。」','可以不喜歡，但不用貶低對方的興趣。',false]],practice:['說一個自己喜歡的東西。','問一個相關問題，或分享一件相關經驗。'],summary:'朋友不需要什麼都一樣；好奇、傾聽與分享能打開話題。'},
 4:{title:'聊天卡住了',skill:'接住話題',place:'圖書館閱讀區',scene:'library.webp',lead:'{other}說起週末的事，{actor}一時想不到下一句。',thought:'聊天停一下沒關係。我可以接住剛剛聽到的內容。',prompt:'對方分享週末的事，我怎麼接？',choices:[
  ['「你最喜歡哪個部分？」','「我喜歡那個讓人一直想知道下一步的地方！」','從剛剛的內容問下去，對方比較容易回答。',true],
  ['「我也有一個類似的小經驗。」','「真的嗎？那你說說看。」','分享相關經驗，也是一種接話。',true],
  ['「喔。」','「嗯……」','這樣回也可以；想繼續聊時，可以再加一句。',false],
  ['一直問，卻完全不分享自己。','「我也想知道你週末做了什麼。」','聊天像傳球，也把認識你的機會留給對方。',false]],
  mini:['接住對方剛剛提到的詞','問一個相關問題','分享一件自己的小事'],decision:'{other}說：「我也想知道你的週末。」我怎麼讓對話繼續來回？',answers:[
  ['分享一件週末小事，再問他。','問、接、分享，輪流把話交給彼此。',true],['「我想一下，等一下跟你說。」','聊天可以有停頓，不必每一秒都填滿。',true],['不回答，繼續一直問他。','也可以分享自己，讓對方有機會認識你。',false]],practice:['選「週末、食物或運動」開聊。','和隊友完成四句來回：問、答、接、分享。'],summary:'聊天像傳球：接住內容，也分享一點自己。'},
 5:{title:'表情偵探',skill:'觀察與確認',place:'教室旁的休息時間',scene:'vn-classroom.webp',lead:'聊天時，{other}看了一下時鐘，回答變短，身體也轉向門口。',thought:'我看到的是動作，不一定知道他的心情。我可以先想幾種可能。',prompt:'看到這些訊號，我可以先怎麼想？',choices:[
  ['「他可能趕時間，我可以問一下。」','「對，我等一下要去拿作業。」','觀察之後用問題確認，比直接猜更清楚。',true],
  ['「我目前還不確定他在想什麼。」','「我得先去拿作業。」','承認還不知道，是很好的開始。',true],
  ['「他一定討厭我。」','「我只是快來不及拿作業了。」','一個動作不能決定別人的心情。',false],
  ['「我還沒講完，要他留下。」','「可是我真的得先走了。」','你想說話，對方也有自己的需要。',false]],
  mini:['可能快上課了','可能約好時間拿作業','可能只是習慣看時間'],decision:'{other}說：「我現在真的要先走了。」我怎麼回？',answers:[
  ['「好，你先忙，我們下次聊。」','你接收到對方的需要，也留下下次聊天的空間。',true],['「了解，那我先去做別的事。」','結束一段對話不等於結束友情。',true],['「等一下啦，我還沒說完！」','對方已經清楚表達，試著尊重他的時間。',false]],practice:['先問隊友：「現在適合聊一下嗎？」','選「我想聊」、「我有點忙」或「我想安靜」回答。'],summary:'看訊號、想可能、再確認。觀察不是讀心術。'},
 6:{title:'他拒絕我了',skill:'面對拒絕',place:'放學前的校園',scene:'courtyard.webp',lead:'放學前，{actor}約{other}明天下課一起玩；{other}說已經和別人有約。',thought:'我有點失望。這是我的感受，但還不知道其他原因。',prompt:'這時候，我可以怎麼想？',choices:[
  ['「只是明天不能一起。」','「對，我明天已經有約了。」','你留意到對方真的說出的原因。',true],
  ['「我失望，但還不知道其他原因。」','「謝謝你願意聽我說。」','失望很正常；感受可以被接納。',true],
  ['「他一定討厭我。」','「我只是明天有約。」','這是擔心的想法，不是已經確認的事實。',false],
  ['「一定是我很無聊。」','「不是這樣，我只是已有安排。」','一次沒約成，不能代表你的價值。',false]],
  mini:['說出一件已知事實','承認自己有點失望','選一個讓自己放鬆的小事'],decision:'{other}說：「我今天想先自己休息。」我可以怎麼做？',answers:[
  ['「好，你先休息，我去做別的。」','朋友也可以需要獨處，不必每次都一起。',true],['先深呼吸，再找其他活動。','難過可以存在，同時選擇尊重彼此。',true],['一直追問，直到他答應。','對方已經說出需要，不用要求他改變決定。',false]],practice:['邀請隊友一起做一件事。','遇到「今天不行」或「我想自己休息」時，練習尊重地回應。'],summary:'被拒絕會失望，但一次沒約成，不代表你的價值或整段友情。'},
 7:{title:'友情交換條件',skill:'守住界線',place:'友情基地 · 校園角落',scene:'courtyard.webp',lead:'{actor}想加入活動，卻聽到有人說：「把新的彩色筆送我，才讓你加入。」',thought:'我想一起玩，但不想用東西交換。我可以清楚說出界線。',prompt:'面對這個交換條件，我怎麼做？',choices:[
  ['「我想一起玩，但不想用東西交換。」','「你真的不給嗎？」','清楚說出界線；就算對方不高興，你也可以不同意。',true],
  ['「那我先去找別人玩。」','你離開讓自己有壓力的情境。','離開也是一種保護自己的選擇。',true],
  ['為了加入，就把筆送出去。','「那你明天再帶別的來。」','你有權保留自己的物品，不需要靠送東西換被接納。',false],
  ['答應替對方做不想做的事。','「那你要記得明天也要幫我。」','友情不能靠不願意的交換綁住。',false]],
  mini:['自願分享時可以自在說不','不想同意時清楚拒絕','持續被施壓時找信任大人'],decision:'對方繼續說：「你不幫就很小氣！」我可以怎麼做？',answers:[
  ['「我還是不能答應。」然後離開。','拒絕不一定讓對方立刻接受，但你的界線仍然有效。',true],['找信任的老師，說明剛才的要求。','持續被施壓或排擠時，尋求協助是可以的。',true],['忍耐，明天帶更多東西。','多給不一定會換來安心，可以找人一起處理。',false]],practice:['練習說：「我想一起玩，但我不會用東西交換。」','隊友用溫和語氣說「可是我希望你答應」，再練習拒絕一次。'],summary:'自願分享可以很溫暖，友情卻不應以送東西或勉強自己為條件。'}
};

Object.assign(campaign,{level:1,completed:[],opening:null,decision:null,mini:[]});
const later=()=>LATER_CHAPTERS[campaign.level];
const fill=(s)=>String(s).replaceAll('{actor}',actor()).replaceAll('{other}',detective()).replaceAll('{interest}',route().interest).replaceAll('{otherInterest}',partnerRoute().interest);
function laterStage(dialogueHtml,panel='',mode='story-screen',step=1){
 const c=later(),old=chapter;
 const saved=chapter;
 // stage gets its location label from the active chapter helper below.
 return stage({mode,step,turn:`第 ${campaign.level} 關 · ${c.skill}`,panel,dialogue:dialogueHtml});
}
function laterMap(){return `<section class="map-world"><img src="assets/courtyard.webp" alt="彩虹小學校園" class="selection-background"><div class="map-heading"><p class="kicker">彩虹小學 · 友情任務地圖</p><h1>下一站，想練習什麼？</h1><p>兩位角色會繼續一起面對新的情境。</p></div><div class="chapter-grid">${Object.entries(LATER_CHAPTERS).map(([id,c])=>`<button class="chapter-card ${campaign.completed.includes(+id)?'done':''} ${campaign.level===+id?'current':''}" data-level="${id}"><span>任務 ${id}</span><strong>${c.title}</strong><small>${campaign.completed.includes(+id)?'✓ 已完成 · 可重玩':c.skill}</small></button>`).join('')}</div><div class="map-actions"><button class="secondary" data-action="v2_replay">回到第一關</button>${primary(`開始第 ${campaign.level} 關`,'v2_laterStart')}</div></section>`;}
function laterChoices(items,key){return `<div class="choice-panel later-choice-panel"><p class="panel-caption">兩人先討論，再選一句</p><div class="choices">${items.map((x,i)=>`<button class="choice ${campaign[key]===i?'selected':''}" data-later-${key}="${i}" aria-pressed="${campaign[key]===i}"><span class="letter">${'ABCD'[i]}</span><span>${esc(fill(x[0]))}</span></button>`).join('')}</div></div>`;}
function renderLater(){
 if(state.page==='chapterMap')return laterMap();
 if(campaign.level<2||campaign.level>7)return null;
 const c=later();
 if(state.page==='laterIntro'){const lines=[['旁白',fill(c.lead)],['我的心聲',c.thought],['旁白',`${actor()}和${detective()}想好要一起試試看。`]];const line=lines[state.beat];return laterStage(dialogue(line[0],line[1],'v2_laterIntro',state.beat<2?'繼續故事':'一起想想看',{thought:line[0]==='我的心聲'}),'','story-screen',1);}
 if(state.page==='laterOpening'){return laterStage(dialogue('搭檔時間',c.prompt,'v2_laterOpeningLock','決定這樣做',{hint:`${actor()}先說，${detective()}聽完後可以補充想法。`,disabled:campaign.opening===null}),laterChoices(c.choices,'opening'),'choice-screen',2);}
 if(state.page==='laterOpeningResult'){const x=c.choices[campaign.opening];return laterStage(dialogue(detective(),fill(x[1]),'v2_laterMini','把方法排一排',{hint:x[2]}),'<p class="scene-caption">'+esc(x[3]?'你們找到一個可嘗試的方法。':'這次先調整一下，再繼續練習。')+'</p>','story-screen',2);}
 if(state.page==='laterMini'){const selected=campaign.mini;return laterStage(dialogue('搭檔時間',`把「${c.skill}」拆成三個小步驟。兩人都同意，再鎖定。`,'v2_laterMiniLock','我們排好了',{hint:'每張卡都可以討論後再選。',disabled:selected.length!==3}),`<section class="activity-panel glass-panel"><p class="kicker">雙人策略卡</p><h2>把方法排成三步</h2><div class="mini-grid">${c.mini.map((x,i)=>`<button class="mini-card ${selected.includes(i)?'selected':''}" data-later-mini="${i}" aria-pressed="${selected.includes(i)}">${esc(x)}${selected.includes(i)?' ✓':''}</button>`).join('')}</div><p class="mini-count">已選 ${selected.length} / 3</p></section>`,'activity-screen',3);}
 if(state.page==='laterDecision'){return laterStage(dialogue('搭檔時間',fill(c.decision),'v2_laterDecisionLock','我們的回應',{hint:'討論哪一句既照顧自己，也尊重別人。',disabled:campaign.decision===null}),laterChoices(c.answers,'decision'),'choice-screen',4);}
 if(state.page==='laterDecisionResult'){const x=c.answers[campaign.decision];return laterStage(dialogue(detective(),x[0],'v2_laterPractice','換我們試著說說看',{hint:x[1]}),'<p class="scene-caption">'+esc(x[2]?'你們記住了這個做法。':'先不用急，知道可以換一種說法就是練習。')+'</p>','story-screen',4);}
 if(state.page==='laterPractice'){const first=state.practiceRound===0?actor():detective(),second=state.practiceRound===0?detective():actor();return laterStage(dialogue('搭檔時間',state.practiceRound===0?'現在把故事帶回你們身邊，真的練習說一次。':'交換角色，讓另一位也練習回應。','v2_laterPracticeDone',state.practiceRound===0?'完成，交換':'兩輪都完成了',{hint:'不錄音、不評分；可以照讀，也可以換成自己的話。'}),`<section class="practice-panel glass-panel"><p class="kicker">真人挑戰 · ${state.practiceRound+1} / 2</p><div class="practice-step"><b>先說</b><div><h3>${esc(first)}</h3><p>${esc(c.practice[0])}</p></div></div><div class="practice-step"><b>回應</b><div><h3>${esc(second)}</h3><p>${esc(c.practice[1])}</p></div></div></section>`,'practice-screen',5);}
 if(state.page==='laterComplete'){return laterStage(dialogue('友情小提示',c.summary,campaign.level<7?'v2_nextChapter':'v2_finalMap',campaign.level<7?'交換任務，前往下一關':'查看全部任務',{hint:`${actor()}與${detective()}完成第 ${campaign.level} 關。`}),`<section class="complete-panel glass-panel"><p class="kicker">第 ${campaign.level} 關完成</p><div class="badge-label">獲得技能 · ${esc(c.skill)}</div><h2>${esc(c.title)}</h2><p>已完成 ${campaign.completed.length} / 6 個後續任務。</p><div class="button-row"><button class="secondary" data-action="v2_map">關卡地圖</button><button class="secondary" data-action="v2_laterReplay">交換任務重玩</button></div></section>`,'complete-screen',6);}
 return null;
}
function resetLater(){state.beat=0;state.practiceRound=0;state.selected=null;campaign.opening=null;campaign.decision=null;campaign.mini=[];}
function laterAction(b){
 if(b.dataset.level!==undefined){campaign.level=+b.dataset.level;resetLater();goto('laterIntro');return true;}
 if(b.dataset.laterOpening!==undefined){campaign.opening=+b.dataset.laterOpening;render();return true;}
 if(b.dataset.laterDecision!==undefined){campaign.decision=+b.dataset.laterDecision;render();return true;}
 if(b.dataset.laterMini!==undefined){const i=+b.dataset.laterMini,n=campaign.mini.indexOf(i);if(n>=0)campaign.mini.splice(n,1);else if(campaign.mini.length<3)campaign.mini.push(i);render();return true;}
 const a=b.dataset.action;if(!a?.startsWith('v2_'))return false;
  if(a==='v2_map'){if(campaign.level<2)campaign.level=2;goto('chapterMap');return true;}
 if(a==='v2_laterStart'){resetLater();goto('laterIntro');return true;}
 if(a==='v2_laterIntro'){if(state.beat<2){state.beat++;render();}else goto('laterOpening');return true;}
 if(a==='v2_laterOpeningLock'){if(campaign.opening!==null)goto('laterOpeningResult');return true;}
 if(a==='v2_laterMini'){goto('laterMini');return true;}
 if(a==='v2_laterMiniLock'){if(campaign.mini.length===3)goto('laterDecision');return true;}
 if(a==='v2_laterDecisionLock'){if(campaign.decision!==null)goto('laterDecisionResult');return true;}
 if(a==='v2_laterPractice'){state.practiceRound=0;goto('laterPractice');return true;}
 if(a==='v2_laterPracticeDone'){if(state.practiceRound===0){state.practiceRound=1;render();}else{if(!campaign.completed.includes(campaign.level))campaign.completed.push(campaign.level);goto('laterComplete');}return true;}
 if(a==='v2_nextChapter'){campaign.level++;state.actor=1-state.actor;resetLater();goto('laterIntro');return true;}
 if(a==='v2_laterReplay'){state.actor=1-state.actor;resetLater();goto('laterIntro');return true;}
 if(a==='v2_finalMap'){goto('chapterMap');return true;}
 return false;
}
