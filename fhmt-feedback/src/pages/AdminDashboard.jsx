import { useState, useEffect } from "react";
import { dbGet, dbSet, dbDel } from "../firebase";

// ── 預設題目 ────────────────────────────────────────────────
const DEFAULT_PARTS = [
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

// ── Storage ─────────────────────────────────────────────────
const safeId = s => s.replace(/[.#$[\]]/g, '_');
const parseVal = r => { if (!r) return null; return typeof r === 'string' ? JSON.parse(r) : r; };
async function loadQ()        { return parseVal(await dbGet('kv/questions')); }
async function saveQ(d)       { return await dbSet('kv/questions', JSON.stringify(d)); }
async function loadPasscode() { return await dbGet('kv/passcode'); }
async function savePasscode(v){ if(!v||!v.trim()) return await dbDel('kv/passcode'); return await dbSet('kv/passcode', v.trim()); }
async function loadAllUsers() { const data=await dbGet('kv/feedbacks'); if(!data) return []; return Object.values(data).map(parseVal); }

const TOTAL=(parts)=>parts.reduce((t,p)=>t+p.sections.reduce((s,sec)=>s+sec.items.length,0),0);
function findItemText(parts,id){for(const p of parts)for(const s of p.sections)for(const i of s.items)if(i.id===id)return i.text;return id;}
function findPart(parts,id){for(const p of parts)for(const s of p.sections)for(const i of s.items)if(i.id===id)return p;return null;}
function Ring({progress,size=40,stroke=3.5}){const r=(size-stroke)/2,c=2*Math.PI*r;return(<svg width={size} height={size} style={{transform:"rotate(-90deg)"}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,0,0,.08)" strokeWidth={stroke}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={progress>=1?"#6B8E4E":"#8B5A2B"} strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={c*(1-progress)} strokeLinecap="round" style={{transition:"stroke-dashoffset .4s"}}/></svg>);}

// ── Passcode Settings ───────────────────────────────────────
function PasscodeSettings() {
  const [code, setCode] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => { loadPasscode().then(c => { setCode(c || ""); setLoaded(true); }); }, []);

  const handleSave = async () => {
    setSaving(true);
    const ok = await savePasscode(code.trim());
    setSaving(false);
    setMsg(ok ? (code.trim() ? "✓ 通行碼已更新，即時生效" : "✓ 通行碼已清除，任何人都可進入") : "儲存失敗");
    setTimeout(() => setMsg(""), 3000);
  };

  const handleClear = async () => {
    setCode("");
    setSaving(true);
    // 刪除 passcode key
    await dbDel('kv/passcode');
    setSaving(false);
    setMsg("✓ 通行碼已清除，測試回饋系統改為開放進入");
    setTimeout(() => setMsg(""), 3000);
  };

  if (!loaded) return null;

  return (
    <div style={{ padding: "18px 20px", borderRadius: 14, background: "rgba(255,255,255,.8)", border: "1px solid rgba(0,0,0,.06)", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 18 }}>🔑</span>
        <h3 style={{ margin: 0, fontSize: 15, color: "#5B3A1F" }}>通行碼設定</h3>
      </div>
      <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "#9a8a6e", lineHeight: 1.6 }}>
        設定後，測試者必須輸入通行碼才能進入回饋系統。<br />
        留空或清除 = 任何人都可進入。更改後即時生效，已經在填的人不受影響。
      </p>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <input value={code} onChange={e => setCode(e.target.value)} placeholder="輸入通行碼（留空 = 開放）"
          style={{ flex: 1, minWidth: 200, padding: "9px 14px", borderRadius: 10, border: "1px solid rgba(0,0,0,.12)", fontSize: 14, fontFamily: "monospace", letterSpacing: 1, background: "rgba(255,255,255,.8)", boxSizing: "border-box", outline: "none" }} />
        <button onClick={handleSave} disabled={saving} style={{ padding: "9px 18px", borderRadius: 10, background: "#8B5A2B", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          {saving ? "儲存中..." : "💾 儲存"}
        </button>
        {code && <button onClick={handleClear} style={{ padding: "9px 14px", borderRadius: 10, background: "rgba(196,80,40,.1)", color: "#c44028", border: "none", cursor: "pointer", fontSize: 13 }}>清除</button>}
      </div>
      {msg && <p style={{ margin: "8px 0 0", fontSize: 12, color: msg.includes("失敗") ? "#c44028" : "#6B8E4E", fontWeight: 600 }}>{msg}</p>}
      <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, background: code.trim() ? "rgba(107,142,78,.08)" : "rgba(196,144,0,.08)", border: `1px solid ${code.trim() ? "rgba(107,142,78,.15)" : "rgba(196,144,0,.15)"}` }}>
        <span style={{ fontSize: 12, color: code.trim() ? "#6B8E4E" : "#c49000" }}>
          {code.trim() ? `🔒 目前狀態：需要通行碼「${code.trim()}」才能進入` : "🔓 目前狀態：開放進入（任何人都可填寫）"}
        </span>
      </div>
    </div>
  );
}

// ── Question Editor ─────────────────────────────────────────
function QuestionEditor({parts, onSave}) {
  const [data, setData] = useState(JSON.parse(JSON.stringify(parts)));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedPart, setExpandedPart] = useState(null);
  const [expandedSec, setExpandedSec] = useState(null);

  const handleSave = async () => { setSaving(true); const ok = await saveQ(data); setSaving(false); if (ok) { setSaved(true); onSave(data); setTimeout(() => setSaved(false), 2000); } };

  const updatePart = (pi, field, val) => { const d = [...data]; d[pi] = { ...d[pi], [field]: val }; setData(d); };
  const updateSection = (pi, si, field, val) => { const d = JSON.parse(JSON.stringify(data)); d[pi].sections[si][field] = val; setData(d); };
  const updateItem = (pi, si, ii, field, val) => { const d = JSON.parse(JSON.stringify(data)); d[pi].sections[si].items[ii][field] = val; setData(d); };
  const addItem = (pi, si) => { const d = JSON.parse(JSON.stringify(data)); const sec = d[pi].sections[si]; const lastId = sec.items.length > 0 ? sec.items[sec.items.length - 1].id : `${pi + 1}.${si + 1}.0`; const pts = lastId.split('.'); const next = parseInt(pts[pts.length - 1] || 0) + 1; pts[pts.length - 1] = next; sec.items.push({ id: pts.join('.'), text: "" }); setData(d); };
  const removeItem = (pi, si, ii) => { const d = JSON.parse(JSON.stringify(data)); d[pi].sections[si].items.splice(ii, 1); setData(d); };
  const addSection = (pi) => { const d = JSON.parse(JSON.stringify(data)); d[pi].sections.push({ title: "新段落", items: [] }); setData(d); };
  const removeSection = (pi, si) => { const d = JSON.parse(JSON.stringify(data)); d[pi].sections.splice(si, 1); setData(d); };
  const addPart = () => { setData([...data, { id: `part${data.length + 1}`, title: `Part ${data.length + 1}`, subtitle: "新分頁", icon: "📋", description: "", sections: [{ title: "新段落", items: [] }] }]); };
  const removePart = (pi) => { const d = [...data]; d.splice(pi, 1); setData(d); };
  const movePart = (pi, dir) => { const d = [...data]; const ni = pi + dir; if (ni < 0 || ni >= d.length) return; [d[pi], d[ni]] = [d[ni], d[pi]]; setData(d); };

  const inp = { width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,.1)", fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", outline: "none", background: "rgba(255,255,255,.8)" };
  const btn = (bg, c) => ({ padding: "6px 12px", borderRadius: 8, border: "none", background: bg, color: c, cursor: "pointer", fontSize: 12, fontWeight: 600 });

  return (<div>
    {/* Passcode Settings */}
    <PasscodeSettings />

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
      <div><h2 style={{ margin: 0, fontSize: 18, color: "#5B3A1F" }}>📝 編輯測試題目</h2><p style={{ margin: "4px 0 0", fontSize: 12, color: "#9a8a6e" }}>共 {TOTAL(data)} 題 · {data.length} 個 Part</p></div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {saved && <span style={{ fontSize: 12, color: "#6B8E4E" }}>✓ 已儲存</span>}
        <button onClick={addPart} style={btn("rgba(107,142,78,.15)", "#6B8E4E")}>+ 新增 Part</button>
        <button onClick={handleSave} disabled={saving} style={btn("#8B5A2B", "#fff")}>{saving ? "儲存中..." : "💾 儲存題目"}</button>
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {data.map((part, pi) => {
        const isExp = expandedPart === pi;
        return (<div key={pi} style={{ borderRadius: 14, background: "rgba(255,255,255,.75)", border: "1px solid rgba(0,0,0,.06)", overflow: "hidden" }}>
          <div onClick={() => setExpandedPart(isExp ? null : pi)} style={{ padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, background: isExp ? "rgba(139,90,43,.06)" : "transparent" }}>
            <span style={{ fontSize: 20 }}>{part.icon}</span>
            <div style={{ flex: 1 }}><span style={{ fontSize: 14, fontWeight: 600, color: "#5B3A1F" }}>{part.title} — {part.subtitle}</span><span style={{ fontSize: 11, color: "#a09880", marginLeft: 8 }}>{part.sections.reduce((t, s) => t + s.items.length, 0)} 題</span></div>
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={e => { e.stopPropagation(); movePart(pi, -1); }} disabled={pi === 0} style={{ ...btn("rgba(0,0,0,.05)", "#6b5830"), opacity: pi === 0 ? .3 : 1 }}>↑</button>
              <button onClick={e => { e.stopPropagation(); movePart(pi, 1); }} disabled={pi === data.length - 1} style={{ ...btn("rgba(0,0,0,.05)", "#6b5830"), opacity: pi === data.length - 1 ? .3 : 1 }}>↓</button>
              <button onClick={e => { e.stopPropagation(); if (confirm(`刪除 ${part.title}？`)) removePart(pi); }} style={btn("rgba(196,80,40,.1)", "#c44028")}>✕</button>
            </div>
            <span style={{ fontSize: 14, color: "#a09880" }}>{isExp ? "▾" : "▸"}</span>
          </div>
          {isExp && (<div style={{ padding: "0 18px 18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px", gap: 8, marginBottom: 12 }}>
              <div><label style={{ fontSize: 11, color: "#9a8a6e" }}>副標題</label><input value={part.subtitle} onChange={e => updatePart(pi, "subtitle", e.target.value)} style={inp} /></div>
              <div><label style={{ fontSize: 11, color: "#9a8a6e" }}>圖示</label><input value={part.icon} onChange={e => updatePart(pi, "icon", e.target.value)} style={{ ...inp, width: 80 }} /></div>
            </div>
            <div style={{ marginBottom: 12 }}><label style={{ fontSize: 11, color: "#9a8a6e" }}>情境說明</label><textarea value={part.description || ""} onChange={e => updatePart(pi, "description", e.target.value)} style={{ ...inp, minHeight: 50, resize: "vertical" }} /></div>
            {part.sections.map((sec, si) => {
              const sk = `${pi}-${si}`; const se = expandedSec === sk;
              return (<div key={si} style={{ marginBottom: 10, borderRadius: 10, border: "1px solid rgba(0,0,0,.06)", background: "rgba(0,0,0,.015)" }}>
                <div onClick={() => setExpandedSec(se ? null : sk)} style={{ padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#6B4E2E", flex: 1 }}>{sec.title} <span style={{ fontWeight: 400, color: "#a09880" }}>({sec.items.length})</span></span>
                  <button onClick={e => { e.stopPropagation(); if (confirm("刪除此段落？")) removeSection(pi, si); }} style={btn("rgba(196,80,40,.08)", "#c44028")}>✕</button>
                  <span style={{ fontSize: 12, color: "#a09880" }}>{se ? "▾" : "▸"}</span>
                </div>
                {se && (<div style={{ padding: "0 14px 14px" }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <div style={{ flex: 1 }}><label style={{ fontSize: 11, color: "#9a8a6e" }}>段落標題</label><input value={sec.title} onChange={e => updateSection(pi, si, "title", e.target.value)} style={inp} /></div>
                    <div style={{ flex: 1 }}><label style={{ fontSize: 11, color: "#9a8a6e" }}>評分量表</label><select value={sec.scale || "default"} onChange={e => updateSection(pi, si, "scale", e.target.value === "default" ? undefined : e.target.value)} style={{ ...inp, cursor: "pointer" }}><option value="default">順 / 怪 / 不會用</option><option value="like">很好 / 還行 / 怪怪的</option><option value="speed">很順 / 普通 / 有點卡</option><option value="easy">很直覺 / 還 OK / 卡住</option></select></div>
                  </div>
                  <div style={{ marginBottom: 8 }}><label style={{ fontSize: 11, color: "#9a8a6e" }}>備註（選填）</label><input value={sec.note || ""} onChange={e => updateSection(pi, si, "note", e.target.value || undefined)} style={inp} placeholder="給測試者看的補充說明" /></div>
                  {sec.items.map((item, ii) => (
                    <div key={ii} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
                      <input value={item.id} onChange={e => updateItem(pi, si, ii, "id", e.target.value)} style={{ ...inp, width: 60, textAlign: "center", fontFamily: "monospace", fontSize: 12 }} />
                      <input value={item.text} onChange={e => updateItem(pi, si, ii, "text", e.target.value)} style={{ ...inp, flex: 1 }} placeholder="題目內容" />
                      <button onClick={() => removeItem(pi, si, ii)} style={{ ...btn("rgba(196,80,40,.08)", "#c44028"), padding: "4px 8px" }}>✕</button>
                    </div>
                  ))}
                  <button onClick={() => addItem(pi, si)} style={btn("rgba(107,142,78,.1)", "#6B8E4E")}>+ 新增題目</button>
                </div>)}
              </div>);
            })}
            <button onClick={() => addSection(pi)} style={{ ...btn("rgba(107,142,78,.1)", "#6B8E4E"), marginTop: 4 }}>+ 新增段落</button>
          </div>)}
        </div>);
      })}
    </div>
  </div>);
}

// ── Overview ────────────────────────────────────────────────
function Overview({ users, parts, onDelete }) {
  const [sel, setSel] = useState(null); const total = TOTAL(parts);
  const getP = u => { if (!u?.answers) return { done: 0, pct: 0 }; const d = Object.values(u.answers).filter(a => a?.status).length; return { done: d, pct: d / total }; };
  return (<div style={{ display: "grid", gridTemplateColumns: sel ? "1fr 1fr" : "1fr", gap: 20, alignItems: "start" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {users.length === 0 ? <div style={{ padding: 40, textAlign: "center", color: "#9a8a6e", background: "rgba(255,255,255,.6)", borderRadius: 14 }}><p style={{ fontSize: 18, marginBottom: 8 }}>📋</p><p style={{ margin: 0 }}>還沒有人填寫。</p></div>
        : users.sort((a, b) => getP(b).pct - getP(a).pct).map(u => {
          const p = getP(u); const act = sel?.odName === u.odName;
          const wc = u.answers ? Object.values(u.answers).filter(a => a?.status === "weird").length : 0;
          const cc = u.answers ? Object.values(u.answers).filter(a => a?.status === "confused").length : 0;
          return (<div key={u.odName || u.nickname} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setSel(act ? null : u)} style={{ flex: 1, display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: act ? "rgba(139,90,43,.08)" : "rgba(255,255,255,.7)", border: `1.5px solid ${act ? "rgba(139,90,43,.25)" : "rgba(0,0,0,.06)"}`, borderRadius: 14, cursor: "pointer", textAlign: "left" }}>
              <Ring progress={p.pct} /><div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 600, color: "#5B3A1F" }}>{u.nickname || "匿名"}</div><div style={{ fontSize: 12, color: "#9a8a6e", marginTop: 2 }}>{[u.device, u.browser, u.role].filter(Boolean).join(" · ")}</div></div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}><div style={{ fontSize: 16, fontWeight: 700, color: p.pct >= 1 ? "#6B8E4E" : "#a09880" }}>{Math.round(p.pct * 100)}%</div><div style={{ display: "flex", gap: 6, fontSize: 11 }}>{wc > 0 && <span style={{ color: "#c49000" }}>😕{wc}</span>}{cc > 0 && <span style={{ color: "#a05520" }}>❓{cc}</span>}</div></div>
            </button>
            <button onClick={() => { if(window.confirm(`確定刪除「${u.nickname}」的填寫資料？`)) { if(sel?.odName===u.odName) setSel(null); onDelete(u.odName); } }} style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(196,80,40,.1)", border: "1px solid rgba(196,80,40,.15)", color: "#c44028", cursor: "pointer", fontSize: 13, flexShrink: 0 }}>🗑</button>
          </div>);
        })}
    </div>
    {sel && (<div style={{ position: "sticky", top: 80, padding: "20px 22px", borderRadius: 14, background: "rgba(255,255,255,.75)", border: "1px solid rgba(0,0,0,.06)" }}>
      <h3 style={{ margin: "0 0 12px", fontSize: 16, color: "#5B3A1F" }}>{sel.nickname}</h3>
      <p style={{ fontSize: 12, color: "#9a8a6e", margin: "0 0 12px" }}>{[sel.device, sel.browser, sel.role].filter(Boolean).join(" · ")}{sel.updatedAt && ` · ${new Date(sel.updatedAt).toLocaleString("zh-TW")}`}</p>
      {sel.answers && Object.entries(sel.answers).filter(([, a]) => a?.status === "weird" || a?.status === "confused").map(([id, a]) => (
        <div key={id} style={{ padding: "8px 12px", borderRadius: 8, marginBottom: 6, background: a.status === "confused" ? "rgba(160,85,32,.06)" : "rgba(196,144,0,.06)", border: `1px solid ${a.status === "confused" ? "rgba(160,85,32,.15)" : "rgba(196,144,0,.15)"}` }}>
          <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}><span style={{ fontSize: 11, fontFamily: "monospace", color: "#9a8a6e", minWidth: 36 }}>{id}</span><span style={{ flex: 1, fontSize: 12.5, color: "#3d3225" }}>{findItemText(parts, id)}</span></div>
          {a.comment && <p style={{ margin: "4px 0 0 42px", fontSize: 12, color: "#6b5830", fontStyle: "italic" }}>「{a.comment}」</p>}
        </div>
      ))}
      {sel.freeform && Object.entries(sel.freeform).filter(([, v]) => v).map(([k, v]) => (<div key={k} style={{ marginTop: 8 }}><div style={{ fontSize: 12, color: "#9a8a6e", fontWeight: 600 }}>{k}</div><p style={{ margin: "2px 0 0", fontSize: 13, color: "#3d3225", whiteSpace: "pre-wrap" }}>{v}</p></div>))}
    </div>)}
  </div>);
}

// ── Hotspots ─────────────────────────────────────────────────
function Hotspots({ users, parts }) {
  const issues = {}; for (const u of users) { if (!u?.answers) continue; for (const [id, a] of Object.entries(u.answers)) { if (a?.status === "weird" || a?.status === "confused") { if (!issues[id]) issues[id] = { weird: 0, confused: 0, total: 0, comments: [] }; issues[id][a.status]++; issues[id].total++; if (a.comment) issues[id].comments.push({ user: u.nickname, comment: a.comment }); } } }
  const sorted = Object.entries(issues).sort((a, b) => b[1].total - a[1].total);
  if (sorted.length === 0) return <div style={{ padding: 40, textAlign: "center", color: "#9a8a6e", background: "rgba(255,255,255,.6)", borderRadius: 14 }}>目前沒有問題項目。</div>;
  return (<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    {sorted.map(([id, d], idx) => { const sev = d.total / users.length; const part = findPart(parts, id); return (
      <div key={id} style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(255,255,255,.75)", border: `1px solid ${sev > .5 ? "rgba(196,80,40,.15)" : "rgba(0,0,0,.06)"}` }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", minWidth: 24, height: 24, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: sev > .5 ? "#c44028" : sev > .3 ? "#c49000" : "#a09880" }}>{idx + 1}</span>
          <span style={{ fontSize: 12, fontFamily: "monospace", color: "#9a8a6e", minWidth: 38, paddingTop: 2 }}>{id}</span>
          <div style={{ flex: 1 }}><span style={{ fontSize: 13, color: "#3d3225" }}>{findItemText(parts, id)}</span>{part && <span style={{ fontSize: 11, color: "#b8ad9c", marginLeft: 6 }}>({part.subtitle})</span>}</div>
          <div style={{ display: "flex", gap: 8, whiteSpace: "nowrap" }}>{d.weird > 0 && <span style={{ fontSize: 13, color: "#c49000", fontWeight: 600 }}>😕{d.weird}</span>}{d.confused > 0 && <span style={{ fontSize: 13, color: "#a05520", fontWeight: 600 }}>❓{d.confused}</span>}<span style={{ fontSize: 11, color: "#fff", padding: "2px 8px", borderRadius: 10, background: sev > .5 ? "#c44028" : "#a09880", fontWeight: 600 }}>{d.total}/{users.length}</span></div>
        </div>
        {d.comments.length > 0 && <div style={{ marginTop: 8, paddingLeft: 72 }}>{d.comments.map((c, i) => <div key={i} style={{ fontSize: 12, color: "#6b5830", marginBottom: 3 }}><strong style={{ color: "#8B5A2B" }}>{c.user}</strong>：{c.comment}</div>)}</div>}
      </div>); })}
  </div>);
}

// ── Main Dashboard ──────────────────────────────────────────
export default function Dashboard() {
  const [parts, setParts] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  const init = async () => { setLoading(true); let q = await loadQ(); if (!q) { q = DEFAULT_PARTS; await saveQ(q); } setParts(q); setUsers(await loadAllUsers()); setLoading(false); };
  useEffect(() => { init(); }, []);

  const deleteUser = async (uid) => {
    await dbDel(`kv/feedbacks/${safeId(uid)}`);
    setUsers(prev => prev.filter(u => u.odName !== uid));
  };

  const exportCSV = () => {
    if (!parts || users.length === 0) return;
    const all = parts.flatMap(p => p.sections.flatMap(s => s.items.map(i => ({ ...i, part: p.subtitle }))));
    let csv = "\uFEFF#,Part,題目," + users.map(u => `"${u.nickname}"`).join(",") + ",問題數\n";
    for (const item of all) { let wc = 0; const row = [item.id, `"${item.part}"`, `"${item.text}"`]; for (const u of users) { const a = u.answers?.[item.id]; if (a?.status === "weird" || a?.status === "confused") wc++; row.push(`"${a?.status || ""}${a?.comment ? ` | ${a.comment}` : ""}"`); } row.push(wc); csv += row.join(",") + "\n"; }
    csv += "\n\n自由回饋\n"; for (const u of users) { if (!u.freeform) continue; csv += `\n"${u.nickname}"\n`; for (const [k, v] of Object.entries(u.freeform)) { if (v) csv += `"${k}","${v.replace(/"/g, '""')}"\n`; } }
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" })); a.download = `feedback-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  if (loading) return (<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg,#f7f0e3,#ede3d0,#e6d8c1)" }}><div style={{ textAlign: "center", color: "#9a8a6e" }}><div style={{ fontSize: 40, marginBottom: 12 }}>🏔️</div>載入中...</div></div>);

  const total = parts ? TOTAL(parts) : 0;
  const avgPct = users.length > 0 ? Math.round(users.reduce((t, u) => t + (u.answers ? Object.values(u.answers).filter(a => a?.status).length / total : 0), 0) / users.length * 100) : 0;
  const issueSet = new Set(); users.forEach(u => u.answers && Object.entries(u.answers).forEach(([id, a]) => { if (a?.status === "weird" || a?.status === "confused") issueSet.add(id); }));
  const commentCount = users.reduce((t, u) => t + (u.answers ? Object.values(u.answers).filter(a => a?.comment).length : 0) + (u.freeform ? Object.values(u.freeform).filter(v => v).length : 0), 0);

  return (<div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#f7f0e3,#ede3d0,#e6d8c1)", fontFamily: "'Noto Sans TC',-apple-system,sans-serif" }}>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&family=Noto+Serif+TC:wght@700&display=swap" rel="stylesheet" />
    <header style={{ position: "sticky", top: 0, zIndex: 100, padding: "14px 20px", background: "rgba(91,58,31,.95)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
      <span style={{ fontSize: 22 }}>🏔️</span><h1 style={{ margin: 0, fontSize: 18, color: "#fff", fontFamily: "'Noto Serif TC', serif", flex: 1 }}>方壺山道場 — 管理儀表板</h1>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={init} style={{ padding: "7px 14px", borderRadius: 8, background: "rgba(255,255,255,.15)", color: "#fff", border: "1px solid rgba(255,255,255,.2)", cursor: "pointer", fontSize: 12 }}>🔄 重新整理</button>
        <button onClick={exportCSV} disabled={users.length === 0} style={{ padding: "7px 14px", borderRadius: 8, background: users.length > 0 ? "#6B8E4E" : "rgba(255,255,255,.1)", color: "#fff", border: "none", cursor: users.length > 0 ? "pointer" : "default", fontSize: 12 }}>📥 匯出 CSV</button>
      </div>
    </header>
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
        {[{ l: "測試者", v: users.length, c: "#5B3A1F" }, { l: "平均完成率", v: users.length > 0 ? `${avgPct}%` : "—", c: "#6B8E4E" }, { l: "問題項目", v: issueSet.size, c: "#c49000" }, { l: "留言數", v: commentCount, c: "#a05520" }, { l: "題目總數", v: total, c: "#8B5A2B" }].map(s => (
          <div key={s.l} style={{ padding: "18px 16px", borderRadius: 14, background: "rgba(255,255,255,.8)", border: "1px solid rgba(0,0,0,.06)", textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.c }}>{s.v}</div><div style={{ fontSize: 12, color: "#9a8a6e", marginTop: 4 }}>{s.l}</div></div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid rgba(0,0,0,.08)" }}>
        {[{ id: "overview", label: "👥 測試者總覽" }, { id: "hotspots", label: "🔥 問題熱點" }, { id: "editor", label: "📝 編輯題目" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "10px 18px", border: "none", cursor: "pointer", background: tab === t.id ? "rgba(139,90,43,.1)" : "transparent", borderBottom: tab === t.id ? "3px solid #8B5A2B" : "3px solid transparent", fontSize: 14, fontWeight: tab === t.id ? 700 : 400, color: tab === t.id ? "#5B3A1F" : "#9a8a6e", borderRadius: "8px 8px 0 0" }}>{t.label}</button>
        ))}
      </div>
      {tab === "overview" && parts && <Overview users={users} parts={parts} onDelete={deleteUser} />}
      {tab === "hotspots" && parts && <Hotspots users={users} parts={parts} />}
      {tab === "editor" && parts && <QuestionEditor parts={parts} onSave={d => setParts(d)} />}
    </div>
  </div>);
}
