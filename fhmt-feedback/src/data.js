export const DEFAULT_PARTS = [
  {id:"part1",title:"Part 1",subtitle:"第一次打開網站",icon:"🏔️",description:"情境：你剛收到這個網站的連結，第一次打開它。",sections:[{title:"第一次打開網站（還沒登入）",items:[{id:"1.1",text:"網站打開後，有一個 Logo 動畫跑出來（寫著「正在匯聚靈氣」）"},{id:"1.2",text:"Logo 動畫出現時，動畫結束前不能點網站上任何東西"},{id:"1.3",text:"Logo 動畫結束後，看到首頁場景（三棟建築）"},{id:"1.4",text:"畫面順眼、文字清楚"},{id:"1.5",text:"滑鼠移動時畫面微微跟著動（電腦）；手指左右滑動時會動（手機）"},{id:"1.6",text:"看得出來哪幾棟建築可以點、「建築中」不能點"},{id:"1.7",text:"試著點建築，會跳出 Google 登入視窗或提示"},{id:"1.8",text:"右上角看得到「進入道場」圖示與「音樂」圖示"}]}]},
  {id:"part2",title:"Part 2",subtitle:"註冊 & 繳費",icon:"📝",description:"⚠️ 請使用管理方提供的「測試信用卡號」，不會真的扣款。",sections:[
    {title:"2.1　Google 登入",items:[{id:"2.1.1",text:"點「進入道場」跳出 Google 登入視窗"},{id:"2.1.2",text:"選帳號授權後回到方壺山"},{id:"2.1.3",text:"看到歡迎信 + 註冊表單"},{id:"2.1.4",text:"取消授權 → 回未登入首頁"}]},
    {title:"2.2　註冊表單",note:"欄位：姓名、Email、電話、扶引碼/清信號、生日、時辰、地址",items:[{id:"2.2.1",text:"姓名自動帶入"},{id:"2.2.2",text:"Email 唯讀"},{id:"2.2.3",text:"必填/選填欄位清楚"},{id:"2.2.4",text:"時辰有「吉時」選項"},{id:"2.2.5",text:"必填留空有紅字提示"},{id:"2.2.6",text:"歡迎信可捲動"},{id:"2.2.7",text:"隱私政策連結新分頁"}]},
    {title:"2.3　扶引碼驗證",note:"一般新會員看到扶引碼，DC 名單看到清信號。",items:[{id:"2.3.1",text:"有效碼 → 綠勾"},{id:"2.3.2",text:"無效碼 → 紅字"},{id:"2.3.3",text:"格式錯誤被擋"},{id:"2.3.4",text:"驗證不過按鈕灰色"},{id:"2.3.5",text:"驗證過按鈕可按"}]},
    {title:"2.4　繳費",items:[{id:"2.4.1",text:"另開繳費頁"},{id:"2.4.2",text:"繳費成功進首頁"},{id:"2.4.3",text:"身份正確"}]},
    {title:"2.5　中斷繳費",note:"請故意關掉繳費視窗測試。",items:[{id:"2.5.1",text:"中斷 → 小鳥紅點"},{id:"2.5.2",text:"點小鳥 → 通知"},{id:"2.5.3",text:"通知 → 保留已填資料"},{id:"2.5.4",text:"可接續繳費"},{id:"2.5.5",text:"關瀏覽器重進 → 自動彈出"}]},
  ]},
  {id:"part3",title:"Part 3",subtitle:"登入後首頁",icon:"🏯",description:"繳費完成，正式使用網站。",sections:[
    {title:"3.1　建築熱點",items:[{id:"3.1.1",text:"頭像取代進入道場圖示"},{id:"3.1.2",text:"Hover 建築名放大"},{id:"3.1.3",text:"點清信院有推進動畫"},{id:"3.1.4",text:"凝暉殿同上"},{id:"3.1.5",text:"動畫中不重複觸發"},{id:"3.1.6",text:"建築中不能點"}]},
    {title:"3.2　時段切換",note:"早上 05:00–16:00 / 黃昏 16:00–18:00 / 晚上 18:00–05:00",items:[{id:"3.2.1",text:"白天 = 早上場景"},{id:"3.2.2",text:"傍晚 = 黃昏場景"},{id:"3.2.3",text:"晚上 = 晚上場景"},{id:"3.2.4",text:"切換有淡入淡出"}]},
  ]},
  {id:"part4",title:"Part 4",subtitle:"個人設定與功能",icon:"⚙️",description:"試試各種功能。",sections:[
    {title:"4.1　Logo",items:[{id:"4.1.1",text:"Logo 固定左上"},{id:"4.1.2",text:"點 Logo 回首頁"}]},
    {title:"4.2　個人選單",items:[{id:"4.2.1",text:"電腦 Hover 展開"},{id:"4.2.2",text:"手機點擊展開"},{id:"4.2.3",text:"顯示頭像姓名等"},{id:"4.2.4",text:"可改個人資訊"},{id:"4.2.5",text:"改完同步更新"},{id:"4.2.6",text:"錯誤回報連結"},{id:"4.2.7",text:"版權隱私連結"},{id:"4.2.8",text:"登出按鈕"},{id:"4.2.9",text:"登出後真的登出"}]},
    {title:"4.3　清信弟子專屬（選填）",note:"非清信弟子可跳過。",items:[{id:"4.3.1",text:"看到扶引額度"},{id:"4.3.2",text:"看到邀請碼"},{id:"4.3.3",text:"複製邀請碼"},{id:"4.3.4",text:"非弟子不顯示"}]},
    {title:"4.4　音樂",items:[{id:"4.4.1",text:"預設靜音"},{id:"4.4.2",text:"點擊播放"},{id:"4.4.3",text:"再點靜音"},{id:"4.4.4",text:"偏好記憶"}]},
    {title:"4.5　通知中心",items:[{id:"4.5.1",text:"有通知有紅點"},{id:"4.5.2",text:"無通知無紅點"},{id:"4.5.3",text:"點開通知清單"},{id:"4.5.4",text:"點通知跳對應操作"}]},
    {title:"4.6　Footer",items:[{id:"4.6.1",text:"版權文字正確"}]},
    {title:"4.7　圖片保護",items:[{id:"4.7.1",text:"右鍵被阻擋"},{id:"4.7.2",text:"拖曳無效"}]},
  ]},
  {id:"part5",title:"Part 5",subtitle:"不同裝置檢查",icon:"📱",description:"至少用一種裝置測試。",sections:[
    {title:"5.1　電腦版",items:[{id:"5.1.1",text:"頂部排列正確"},{id:"5.1.2",text:"滑鼠視差"},{id:"5.1.3",text:"Hover + 點擊"},{id:"5.1.4",text:"歡迎信左右捲"}]},
    {title:"5.2　手機版",items:[{id:"5.2.1",text:"頂部排列正確"},{id:"5.2.2",text:"手指視差"},{id:"5.2.3",text:"直接點擊觸發"},{id:"5.2.4",text:"觸擊區域適當"},{id:"5.2.5",text:"歡迎信上下捲"},{id:"5.2.6",text:"表單不裁切"}]},
    {title:"5.3　瀏覽器相容",items:[{id:"5.3.1",text:"Chrome 電腦"},{id:"5.3.2",text:"Safari"},{id:"5.3.3",text:"Edge"},{id:"5.3.4",text:"Firefox"},{id:"5.3.5",text:"Chrome Android"}]},
  ]},
  {id:"part6",title:"Part 6",subtitle:"身份情境",icon:"👤",description:"需要不同身份的測試帳號。沒有可跳過。",sections:[{title:"身份情境測試",items:[{id:"6.1",text:"訪客 → 熱點暗"},{id:"6.2",text:"訪客點 → 登入視窗"},{id:"6.3",text:"未繳費 → 尚未解鎖"},{id:"6.4",text:"年費過期 → 尚未續費"},{id:"6.5",text:"小道童 → 凝暉殿可進"},{id:"6.6",text:"小道童 → 問童子圖示"},{id:"6.7",text:"清信 → 全功能"},{id:"6.8",text:"清信DC → 全功能"},{id:"6.9",text:"清信弟子 → 扶引欄位"},{id:"6.10",text:"過期 → 只顯示續費彈窗"}]}]},
  {id:"part7",title:"Part 7",subtitle:"後台網站體驗",icon:"🔧",description:"需要有後台帳號才能測。",sections:[
    {title:"7.1　後台登入",note:"後台是 Email + 密碼，跟前台 Google 登入不同。",items:[{id:"7.1.1",text:"看到後台登入頁"},{id:"7.1.2",text:"正確帳密登入成功"},{id:"7.1.3",text:"不存在 Email 被擋"},{id:"7.1.4",text:"密碼錯誤"},{id:"7.1.5",text:"密碼格式不符"},{id:"7.1.6",text:"無 Google 登入"},{id:"7.1.7",text:"登出回登入頁"}]},
    {title:"7.2　會員管理",note:"確認前台會員在後台看得到。",items:[{id:"7.2.1",text:"前台新會員出現"},{id:"7.2.2",text:"詳細資料完整"},{id:"7.2.3",text:"DC 標記正確"},{id:"7.2.4",text:"前台改後台同步"}]},
  ]},
  {id:"part8",title:"Part 8",subtitle:"整體感受",icon:"✨",description:"用直覺評價整體體驗。",sections:[
    {title:"8.1　好看嗎",scale:"like",items:[{id:"8.1.1",text:"整體氛圍"},{id:"8.1.2",text:"文字配色"},{id:"8.1.3",text:"動畫效果"},{id:"8.1.4",text:"美術風格"},{id:"8.1.5",text:"圖示設計"}]},
    {title:"8.2　順暢嗎",scale:"speed",items:[{id:"8.2.1",text:"開站速度"},{id:"8.2.2",text:"動畫流暢"},{id:"8.2.3",text:"切換流暢"},{id:"8.2.4",text:"手機順暢"},{id:"8.2.5",text:"表單無延遲"}]},
    {title:"8.3　好用嗎",scale:"easy",items:[{id:"8.3.1",text:"知道該做什麼"},{id:"8.3.2",text:"步驟清楚"},{id:"8.3.3",text:"功能找得到"},{id:"8.3.4",text:"專有名詞懂"},{id:"8.3.5",text:"錯誤訊息懂"}]},
  ]},
];

export const SCALES = {
  default: { options:["ok","weird","confused"], labels:{ok:"✅ 順",weird:"😕 怪",confused:"❓ 不會用"}, colors:{ok:"#5a8a3c",weird:"#c49000",confused:"#a05520"} },
  like: { options:["ok","weird","confused"], labels:{ok:"😍 很好",weird:"🙂 還行",confused:"😕 怪怪的"}, colors:{ok:"#5a8a3c",weird:"#b0953a",confused:"#a05520"} },
  speed: { options:["ok","weird","confused"], labels:{ok:"⚡ 很順",weird:"🙂 普通",confused:"🐌 有點卡"}, colors:{ok:"#5a8a3c",weird:"#b0953a",confused:"#a05520"} },
  easy: { options:["ok","weird","confused"], labels:{ok:"👍 很直覺",weird:"🙂 還 OK",confused:"😕 卡住"}, colors:{ok:"#5a8a3c",weird:"#b0953a",confused:"#a05520"} },
};

export const TOTAL = (parts) => parts.reduce((t,p) => t + p.sections.reduce((s,sec) => s + sec.items.length, 0), 0);

export function findItemText(parts, id) {
  for (const p of parts) for (const s of p.sections) for (const i of s.items) if (i.id === id) return i.text;
  return id;
}

export function findPart(parts, id) {
  for (const p of parts) for (const s of p.sections) for (const i of s.items) if (i.id === id) return p;
  return null;
}
