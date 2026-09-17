'use strict';
// Each route has its own motivation, approach, shared activity and reflection.
const ROUTES={
 xiaoyong:{title:'勇氣從一句話開始',thought:'想認識新同學，就像探險的第一步。我可以先走近一點，不用一下子說很多。',greeting:'嗨！我叫小勇，可以認識你嗎？',share:'我喜歡冒險故事，但換到新班級，我也會緊張。',interest:'恐龍和冒險故事',object:'恐龍吊飾',observation:'那隻小恐龍好可愛！你喜歡恐龍嗎？',answer:'對！我最喜歡三角龍，牠看起來很有精神。',busy:'正把恐龍吊飾從書包帶上拉出來',invite:'下課要不要一起去找教室的閱讀角？我們可以各挑一本想看的書。',reply:'好啊！我想找一本冒險故事，等你選好，我們再交換介紹。',ending:'我原本以為勇敢就是一直說話。原來，邀請之後停下來，才聽得到對方的想法。'},
 xiaoqing:{title:'一個邀請，留一點空間',thought:'下課好想找人一起玩。不過，先問問對方喜歡什麼，再決定活動吧。',greeting:'嗨，我叫小晴！下課你通常喜歡做什麼？',share:'我喜歡打球，不過我也喜歡慢慢散步聊天。',interest:'打球和散步',object:'籃球吊飾',observation:'你的籃球吊飾好特別！你喜歡打球嗎？',answer:'喜歡！但不一定要比賽，我也喜歡兩個人輕輕傳球。',busy:'輕輕轉動書包上的籃球吊飾',invite:'下課一起到走廊看看操場好嗎？想打球或只想聊天，都可以告訴我。',reply:'好！我們先看看操場，有空位再決定要不要玩。',ending:'一起玩不代表一定要照我的計畫。讓對方也能選，才像兩個人的活動。'},
 ale:{title:'先聽見，再接上',thought:'椅子移動的聲音好像節奏。我想分享，又怕打斷對方。先打聲招呼好了。',greeting:'嗨，我叫阿樂。你平常會聽音樂嗎？',share:'我喜歡找生活裡的節奏，也想聽你喜歡的聲音。',interest:'音樂和生活裡的節奏',object:'音符吊飾',observation:'你的書包上有音符！你喜歡音樂嗎？',answer:'對！我喜歡打節奏，不過上課時我會把鼓棒收好。',busy:'把鼓棒放好，再整理音符吊飾',invite:'下課要不要一起找三種校園的聲音？我會先聽你說，再分享我聽到的。',reply:'好！我先找一種，你再接一種，就像輪流接節奏。',ending:'聊天也像節奏，有說話，也有停頓。留一拍，對方才能接進來。'},
 mimi:{title:'慢慢靠近的一小步',thought:'我有點想聊天，又怕突然開口很奇怪。可以從眼前看到的小東西開始吧。',greeting:'嗨，我叫米米。我可以坐在這裡和你聊一下嗎？',share:'我喜歡畫小動物。剛認識的時候，我通常會慢慢說。',interest:'小動物和畫畫',object:'小貓吊飾',observation:'這個小貓吊飾好可愛！你喜歡貓嗎？',answer:'喜歡！我也常把看到的小動物畫在速寫本裡。',busy:'把小貓吊飾放到桌邊，收好速寫本',invite:'下課要不要一起看看窗外？我們可以各說一個想畫下來的小細節，不用畫得很厲害。',reply:'好呀。我想先找一片形狀特別的葉子，你找到時再告訴我。',ending:'不用一次說很多，短短一句也能開始。對方願意等，我就能慢慢說出自己的想法。'},
 axing:{title:'好奇，也記得等回答',thought:'我腦中有好多問題！先選一個容易回答的，聽完再問下一個。',greeting:'嗨，我叫阿星！你有最近很好奇的事情嗎？',share:'我喜歡看星星。有時問題太多，我會提醒自己先聽完。',interest:'星星和好奇的問題',object:'星球吊飾',observation:'這顆星球有光環！你喜歡看星星嗎？',answer:'喜歡！這是土星。我也想知道其他人對什麼好奇。',busy:'扶好圓框眼鏡，把星球吊飾擺正',invite:'下課一起到窗邊看雲好嗎？我們各說一個好奇的問題，不知道答案也沒關係。',reply:'好！我想先問那朵雲像什麼，再聽你的想法。',ending:'問問題是因為想認識對方，不是考對方。一次問一點，也接受「我不知道」。'},
 xiaoyu:{title:'一起想，比自己決定好',thought:'我很喜歡找方法，但還不認識對方。先聊聊，再問他想不想一起做。',greeting:'嗨，我叫小宇。你喜歡拼東西，還是做別的活動？',share:'我喜歡拼積木，也喜歡看別人用不同的方法完成作品。',interest:'積木和一起想辦法',object:'積木吊飾',observation:'你的吊飾是積木耶！你平常喜歡拼什麼？',answer:'我喜歡拼小房子。同一盒積木，每個人都能拼出不同的東西。',busy:'確認書包上的積木吊飾有沒有扣好',invite:'下課一起看看教室有哪些可以合作的活動好嗎？你先挑一種，我們再一起想玩法。',reply:'好！我們先各提一個點子，再找兩個人都想試的。',ending:'合作的第一步，是先問對方想不想參加。別人的方法和我不同，也可能很好玩。'}
};
const BASE_FACING={xiaoyong:'left',xiaoqing:'right',ale:'right',mimi:'left',axing:'left',xiaoyu:'left'};
function route(){return ROUTES[avatar(state.actor).id];}
function partnerRoute(){return ROUTES[avatar(1-state.actor).id];}
function facingClass(c,side,mood='neutral'){const source=mood==='happy'?(c.id==='axing'?'left':'right'):BASE_FACING[c.id];return source===(side==='left'?'right':'left')?'':'mirror';}
function characterImage(c,side,mood='neutral',cls=''){return `<img class="${cls} ${facingClass(c,side,mood)}" data-character-id="${c.id}" data-side="${side}" data-facing="${side==='left'?'right':'left'}" data-expression="${mood}" src="${sprite(c,mood)}" alt="${c.name} · ${mood==='happy'?'開心回應':'聆聽'} · 面向${side==='left'?'右':'左'}方">`;}
function configureStory(){
 const a=route(),b=partnerRoute(),name=detective();
 STORY.intro=[{speaker:'旁白',text:`新學期的第一天，${actor()}走進五年級教室。窗邊的${name}${b.busy}。`},{speaker:'我的心聲',text:a.thought},{speaker:'旁白',text:`${actor()}注意到${name}的${b.object}，決定從一個小小的招呼開始。`}];
 STORY.opening=[
 {text:`「${a.greeting}」`,reply:`「我叫${name}！我喜歡${b.interest}。你呢？」`,feedback:'介紹自己，也留一個容易回答的問題，對方就有機會把話接回來。',expression:'happy',gesture:`${name}轉過身，笑著回應。`},
 {text:`「${b.observation}」`,reply:`「${b.answer}對了，我叫${name}！」`,feedback:'從看到的東西開始聊，再聽對方怎麼說。不用假裝自己也有相同興趣。',expression:'happy',gesture:`${name}指了指自己的${b.object}。`},
 {text:'先看著對方，暫時不說話。',reply:'「嗯……你想找我聊天嗎？可以慢慢說。」',feedback:'先觀察也可以。準備好後，加一句「嗨」，就能讓對方知道你的意思。',expression:'neutral',gesture:`${name}停下動作，等著${actor()}。`},
 {text:'「欸！」',reply:'「嗯？你是在叫我嗎？」',feedback:'對方注意到你了，卻還不知道你想說什麼。可以再介紹自己，或說明你看到的事情。',expression:'neutral',gesture:`${name}抬起頭，還不確定發生什麼事。`}];
 STORY.next=[
 {text:`「${a.share}你呢？」`,reply:`「我喜歡${b.interest}。我們喜歡的不一樣，也可以一起聊聊！」`,feedback:'分享自己的興趣，再認真聽對方說。朋友不需要每件事都一樣。',expression:'happy',gesture:`${name}露出笑容，${actor()}也放鬆了一些。`,kind:'continue'},
 {text:`「我叫${actor()}。剛換到這一班，我也有點緊張。」`,reply:'「我也是。有人先和我說話，就沒那麼緊張了。」',feedback:'分享願意說的感受，能讓彼此更靠近；不必勉強透露不想說的事情。',expression:'happy',gesture:`${name}點點頭，兩人不再急著找話題。`,kind:'continue'},
 {text:'「喔。」',reply:'「嗯……」',feedback:'短短回答也可以。如果還想繼續聊，可以補一句自己的想法。',expression:'neutral',gesture:'兩個人安靜了一下。還有機會再接一句。',kind:'retry'},
 {text:'「你成績好嗎？」',reply:'「我現在不太想聊成績，可以聊別的嗎？」',feedback:'對方說出了界線。尊重這個選擇，再換一個輕鬆的話題。',expression:'neutral',gesture:`${name}輕輕搖頭，${actor()}決定換個話題。`,kind:'retry'}];
}
function activeMood(p,speaker){if(['noticeCharm','invitePartner','acceptInvite','ending','complete'].includes(state.page))return 'happy';if(speaker!==state.names[p])return 'neutral';if(state.page==='speakA')return state.choice<2?'happy':'neutral';if(state.page==='responseA'&&state.replyBeat===0)return STORY.opening[state.choice].expression;if(state.page==='speakNext'||(state.page==='responseNext'&&state.replyBeat===0))return STORY.next[state.next].expression;return 'neutral';}
function routePage(){
 const a=route(),b=partnerRoute();
 if(state.page==='speakA')return stage({mode:'story-screen',dialogue:dialogue(state.choice===2?'我的心聲':actor(),state.choice===2?'我先想一想，準備好再開口。':STORY.opening[state.choice].text,'v2_hearOpening',`聽聽${detective()}怎麼說`)});
 if(state.page==='noticeCharm')return stage({mode:'story-screen',step:5,dialogue:dialogue(detective(),`「你喜歡${a.interest}呀。我也想多聽一點！」`,'invitePartner','說出一個小邀請',{hint:`${detective()}記住了${actor()}剛剛分享的事。`})});
 if(state.page==='invitePartner')return stage({mode:'story-screen',step:5,dialogue:dialogue(actor(),`「${a.invite}」`,'acceptInvite','給對方時間回答')});
 if(state.page==='acceptInvite')return stage({mode:'story-screen',step:5,dialogue:dialogue(detective(),`「可以呀！不過我們先做一小段就好。之後我也想和你聊聊${b.interest}。」`,'ending','記住彼此的想法',{hint:'答應一起試試，也可以說出自己的時間與想法。'})});
 if(state.page==='ending')return stage({mode:'story-screen',step:5,dialogue:dialogue('我的心聲',a.ending,'practice','換我們真的說說看',{thought:true,hint:`${actor()}與${detective()}，留下了第一個共同約定。`})});
 return null;
}
