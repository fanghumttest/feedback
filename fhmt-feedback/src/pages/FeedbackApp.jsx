import { useState, useEffect, useCallback, useRef } from "react";
import { dbGet, dbSet } from "../firebase";

const safeId = s => s.replace(/[.#$[\]]/g, '_');

function compressToDataUrl(file, maxW = 600, quality = 0.70) {
  return new Promise(resolve => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxW / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      const webp = canvas.toDataURL('image/webp', quality);
      // 若瀏覽器不支援 WebP 則退回 JPEG
      resolve(webp.startsWith('data:image/webp') ? webp : canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });
}

const SCALES = {
  default: { options:["ok","weird","confused"], labels:{ok:"✅ 順",weird:"😕 怪",confused:"❓ 不會用"}, colors:{ok:"#5a8a3c",weird:"#c49000",confused:"#a05520"} },
  like:    { options:["ok","weird","confused"], labels:{ok:"😍 很好",weird:"🙂 還行",confused:"😕 怪怪的"}, colors:{ok:"#5a8a3c",weird:"#b0953a",confused:"#a05520"} },
  speed:   { options:["ok","weird","confused"], labels:{ok:"⚡ 很順",weird:"🙂 普通",confused:"🐌 有點卡"}, colors:{ok:"#5a8a3c",weird:"#b0953a",confused:"#a05520"} },
  easy:    { options:["ok","weird","confused"], labels:{ok:"👍 很直覺",weird:"🙂 還 OK",confused:"😕 卡住"}, colors:{ok:"#5a8a3c",weird:"#b0953a",confused:"#a05520"} },
};

const parseVal = r => { if (!r) return null; return typeof r === 'string' ? JSON.parse(r) : r; };
async function loadQ()        { return parseVal(await dbGet('kv/questions')); }
async function loadPasscode() { return await dbGet('kv/passcode'); }
async function saveF(uid, d)  { return await dbSet(`kv/feedbacks/${safeId(uid)}`, JSON.stringify(d)); }
async function loadF(uid)     { return parseVal(await dbGet(`kv/feedbacks/${safeId(uid)}`)); }

function PasscodeGate({ onPass }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const handleSubmit = async () => {
    if (!code.trim()) return;
    setChecking(true); setError("");
    const correct = await loadPasscode();
    if (!correct || code.trim() === correct) onPass();
    else setError("通行碼不正確，請確認後再試");
    setChecking(false);
  };
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(160deg,#f7f0e3,#ede3d0,#e6d8c1)",padding:20}}>
      <div style={{width:"100%",maxWidth:400,padding:"44px 32px",borderRadius:20,background:"rgba(255,255,255,.75)",backdropFilter:"blur(20px)",boxShadow:"0 8px 40px rgba(91,58,31,.08)",border:"1px solid rgba(255,255,255,.6)",textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:12}}>🔑</div>
        <h1 style={{margin:"0 0 6px",fontSize:22,color:"#5B3A1F",fontFamily:"'Noto Serif TC',serif"}}>方壺山道場</h1>
        <p style={{margin:"0 0 24px",fontSize:14,color:"#9a8a6e"}}>請輸入通行碼以進入測試回饋系統</p>
        <input value={code} onChange={e=>setCode(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} placeholder="請輸入通行碼" type="password" autoFocus style={{width:"100%",padding:"12px 16px",borderRadius:12,border:`2px solid ${error?"#c44028":"rgba(0,0,0,.12)"}`,fontSize:15,textAlign:"center",background:"rgba(255,255,255,.8)",boxSizing:"border-box",outline:"none",letterSpacing:2,fontFamily:"monospace"}} />
        {error && <p style={{margin:"8px 0 0",fontSize:13,color:"#c44028"}}>{error}</p>}
        <button onClick={handleSubmit} disabled={checking||!code.trim()} style={{width:"100%",marginTop:16,padding:"12px 0",borderRadius:12,background:code.trim()?"linear-gradient(135deg,#8B5A2B,#A67B5B)":"#d5cfc3",color:"#fff",fontSize:15,fontWeight:700,border:"none",cursor:code.trim()?"pointer":"default",letterSpacing:1}}>{checking?"驗證中...":"進入"}</button>
        <p style={{margin:"16px 0 0",fontSize:12,color:"#b8ad9c"}}>通行碼由管理方提供</p>
      </div>
    </div>
  );
}

function Chip({value,scale="default",onChange}) {
  const s=SCALES[scale]||SCALES.default;
  return (<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{s.options.map(o=>{const a=value===o;return(<button key={o} onClick={()=>onChange(a?null:o)} style={{padding:"6px 14px",borderRadius:20,border:`2px solid ${s.colors[o]}`,background:a?s.colors[o]:"transparent",color:a?"#fff":s.colors[o],fontWeight:600,fontSize:13,cursor:"pointer",transition:"all .15s",opacity:value&&!a?0.45:1,whiteSpace:"nowrap"}}>{s.labels[o]}</button>);})}</div>);
}

function Item({item,answer,scale,onAnswer,uid}) {
  const [exp,setExp]=useState(false);
  const [uploading,setUploading]=useState(false);
  const fileRef=useRef(null);
  const hc=answer?.comment?.length>0;
  const hasStatus=!!answer?.status;
  const images=answer?.images||[];

  const handleUpload=async(e)=>{
    const files=Array.from(e.target.files).slice(0,2-images.length);
    if(!files.length)return;
    e.target.value='';
    setUploading(true);
    const dataUrls=[];
    for(const f of files){
      const du=await compressToDataUrl(f);
      if(du)dataUrls.push(du);
    }
    onAnswer({...answer,images:[...images,...dataUrls]});
    setUploading(false);
  };

  const removeImg=(idx)=>onAnswer({...answer,images:images.filter((_,i)=>i!==idx)});

  return(<div style={{padding:"14px 16px",borderRadius:10,background:answer?.status==="weird"?"rgba(196,144,0,.07)":answer?.status==="confused"?"rgba(160,85,32,.07)":"rgba(255,255,255,.5)",border:`1px solid ${answer?.status==="weird"?"rgba(196,144,0,.25)":answer?.status==="confused"?"rgba(160,85,32,.2)":"rgba(0,0,0,.06)"}`,transition:"all .2s"}}>
    <div style={{display:"flex",gap:10,alignItems:"flex-start",flexWrap:"wrap"}}>
      <span style={{fontSize:12,color:"#9a8a6e",fontWeight:700,minWidth:36,paddingTop:2,fontFamily:"monospace"}}>{item.id}</span>
      <div style={{flex:1,minWidth:200}}><p style={{margin:0,fontSize:14,lineHeight:1.6,color:"#3d3225"}}>{item.text}</p></div>
      <Chip value={answer?.status} scale={scale} onChange={v=>onAnswer({...answer,status:v})} />
    </div>
    {hasStatus&&(<div style={{marginTop:10}}>
      <button onClick={()=>setExp(!exp)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:hc?"#8B5A2B":"#a09880",display:"flex",alignItems:"center",gap:4,padding:"2px 0"}}><span>{exp?"▾":"▸"}</span><span>{hc?"✎ 已留言":"想說的話..."}</span></button>
      {exp&&<textarea value={answer?.comment||""} onChange={e=>onAnswer({...answer,comment:e.target.value})} placeholder="有什麼想說的？" style={{width:"100%",marginTop:6,padding:10,borderRadius:8,fontSize:13,border:"1px solid rgba(0,0,0,.1)",background:"rgba(255,255,255,.8)",resize:"vertical",minHeight:60,fontFamily:"inherit",lineHeight:1.5,boxSizing:"border-box",outline:"none"}} />}
      <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8,flexWrap:"wrap"}}>
        {images.map((url,i)=>(
          <div key={i} style={{position:"relative"}}>
            <a href={url} target="_blank" rel="noreferrer"><img src={url} alt="" style={{width:72,height:54,objectFit:"cover",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",display:"block"}}/></a>
            <button onClick={()=>removeImg(i)} style={{position:"absolute",top:-6,right:-6,width:18,height:18,borderRadius:9,background:"#c44028",border:"none",color:"#fff",fontSize:11,cursor:"pointer",lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>×</button>
          </div>
        ))}
        {images.length<2&&(
          <label style={{display:"flex",alignItems:"center",gap:4,padding:"6px 12px",borderRadius:8,border:"1px dashed rgba(0,0,0,.18)",cursor:"pointer",fontSize:12,color:"#9a8a6e",background:"rgba(255,255,255,.5)"}}>
            {uploading?"上傳中...":"📷 附圖"}
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} style={{display:"none"}} disabled={uploading}/>
          </label>
        )}
      </div>
    </div>)}
  </div>);
}

function PartView({part,answers,onAnswer,uid}) {
  return(<div>
    <div style={{marginBottom:24}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><span style={{fontSize:28}}>{part.icon}</span><h2 style={{margin:0,fontSize:20,color:"#5B3A1F",fontFamily:"'Noto Serif TC',serif"}}>{part.title}　{part.subtitle}</h2></div>
      {part.description&&<div style={{padding:"12px 16px",borderRadius:10,background:"rgba(255,249,230,.8)",border:"1px solid rgba(212,160,23,.2)",fontSize:13,color:"#6b5830",lineHeight:1.7,whiteSpace:"pre-line",marginTop:8}}>{part.description}</div>}
    </div>
    {part.sections.map((sec,si)=>(<div key={si} style={{marginBottom:28}}>
      <h3 style={{margin:"0 0 6px",fontSize:15,color:"#6B4E2E",borderLeft:"3px solid #C89B7B",paddingLeft:10}}>{sec.title}</h3>
      {sec.note&&<p style={{margin:"0 0 10px",fontSize:12.5,color:"#9a8a6e",lineHeight:1.6,paddingLeft:14}}>{sec.note}</p>}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>{sec.items.map(item=><Item key={item.id} item={item} answer={answers[item.id]} scale={sec.scale||"default"} onAnswer={a=>onAnswer(item.id,a)} uid={uid}/>)}</div>
    </div>))}
  </div>);
}

function Freeform({answers,onAnswer}) {
  const fs=[{key:"best",title:"💚 最喜歡的地方",ph:"哪一個功能或體驗印象最好？"},{key:"improve",title:"💡 最想改善的地方",ph:"哪裡卡卡的、希望不一樣？"},{key:"bugs",title:"🐛 遇到的問題",ph:"按了沒反應、畫面跑掉……有遇到才填"},{key:"other",title:"💬 其他想說的話",ph:"任何想法都歡迎"}];
  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}><span style={{fontSize:28}}>💬</span><h2 style={{margin:0,fontSize:20,color:"#5B3A1F",fontFamily:"'Noto Serif TC',serif"}}>自由回饋</h2></div>
    <p style={{color:"#6b5830",fontSize:13.5,marginBottom:20}}>這是最後一段，你的心聲最重要。</p>
    {fs.map(f=>(<div key={f.key} style={{marginBottom:24}}><h3 style={{fontSize:15,color:"#6B4E2E",borderLeft:"3px solid #C89B7B",paddingLeft:10,margin:"0 0 8px"}}>{f.title}</h3><textarea value={answers?.[f.key]||""} onChange={e=>onAnswer(f.key,e.target.value)} placeholder={f.ph} style={{width:"100%",padding:12,borderRadius:10,fontSize:14,border:"1px solid rgba(0,0,0,.1)",background:"rgba(255,255,255,.7)",resize:"vertical",minHeight:90,fontFamily:"inherit",lineHeight:1.6,boxSizing:"border-box",outline:"none"}} /></div>))}
  </div>);
}

function Ring({progress,size=32,stroke=2.5}) {
  const r=(size-stroke)/2,c=2*Math.PI*r;
  return(<svg width={size} height={size} style={{transform:"rotate(-90deg)"}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,0,0,.08)" strokeWidth={stroke}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#6B8E4E" strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={c*(1-progress)} strokeLinecap="round" style={{transition:"stroke-dashoffset .4s"}}/></svg>);
}

function Nav({parts,cur,onSelect,answers,freeform}) {
  const fd=freeform?Object.values(freeform).filter(v=>v?.length>0).length:0;
  return(<nav style={{display:"flex",flexDirection:"column",gap:4,padding:"6px 0"}}>
    {parts.map(p=>{const total=p.sections.reduce((t,s)=>t+s.items.length,0);const done=p.sections.reduce((t,s)=>t+s.items.filter(i=>answers[i.id]?.status).length,0);const active=cur===p.id;return(
      <button key={p.id} onClick={()=>onSelect(p.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:active?"rgba(139,90,43,.1)":"transparent",border:"none",borderRadius:10,cursor:"pointer",textAlign:"left",borderLeft:active?"3px solid #8B5A2B":"3px solid transparent"}}>
        <Ring progress={total>0?done/total:0}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:active?"#5B3A1F":"#7a6a55"}}>{p.icon} {p.subtitle}</div><div style={{fontSize:11,color:"#a09880"}}>{done}/{total}</div></div>
      </button>);})}
    <button onClick={()=>onSelect("freeform")} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:cur==="freeform"?"rgba(139,90,43,.1)":"transparent",border:"none",borderRadius:10,cursor:"pointer",textAlign:"left",borderLeft:cur==="freeform"?"3px solid #8B5A2B":"3px solid transparent"}}>
      <span style={{fontSize:20,width:32,textAlign:"center"}}>💬</span><div><div style={{fontSize:13,fontWeight:600,color:cur==="freeform"?"#5B3A1F":"#7a6a55"}}>自由回饋</div><div style={{fontSize:11,color:"#a09880"}}>{fd}/4</div></div>
    </button>
  </nav>);
}

function Welcome({onStart}) {
  const [nick,setNick]=useState("");const [device,setDevice]=useState("");const [browser,setBrowser]=useState("");
  const ok=nick.trim().length>0&&device.length>0&&browser.length>0;
  const Btn=({items,val,set})=>(<div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{items.map(d=><button key={d} onClick={()=>set(d)} style={{padding:"7px 16px",borderRadius:20,border:`2px solid ${val===d?"#8B5A2B":"rgba(0,0,0,.1)"}`,background:val===d?"#8B5A2B":"transparent",color:val===d?"#fff":"#6b5830",cursor:"pointer",fontSize:13,fontWeight:500}}>{d}</button>)}</div>);
  return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(160deg,#f7f0e3,#ede3d0,#e6d8c1)",padding:20}}>
    <div style={{width:"100%",maxWidth:480,padding:"40px 32px",borderRadius:20,background:"rgba(255,255,255,.75)",backdropFilter:"blur(20px)",boxShadow:"0 8px 40px rgba(91,58,31,.08)",border:"1px solid rgba(255,255,255,.6)"}}>
      <div style={{textAlign:"center",marginBottom:28}}><div style={{fontSize:40,marginBottom:8}}>🏔️</div><h1 style={{margin:0,fontSize:24,color:"#5B3A1F",fontFamily:"'Noto Serif TC',serif"}}>方壺山道場</h1><p style={{margin:"6px 0 0",fontSize:14,color:"#9a8a6e"}}>網站測試回饋系統</p></div>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div><label style={{fontSize:13,fontWeight:600,color:"#6B4E2E",display:"block",marginBottom:4}}>暱稱 + 清信號 <span style={{color:"#c49000"}}>*</span></label><input value={nick} onChange={e=>setNick(e.target.value)} placeholder="請填入你的暱稱與清信號" style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid rgba(0,0,0,.12)",fontSize:14,background:"rgba(255,255,255,.8)",boxSizing:"border-box",outline:"none"}}/></div>
        <div><label style={{fontSize:13,fontWeight:600,color:"#6B4E2E",display:"block",marginBottom:6}}>使用裝置 <span style={{color:"#c49000"}}>*</span></label><Btn items={["電腦","手機","平板"]} val={device} set={setDevice}/></div>
        <div><label style={{fontSize:13,fontWeight:600,color:"#6B4E2E",display:"block",marginBottom:6}}>瀏覽器 <span style={{color:"#c49000"}}>*</span></label><Btn items={["Chrome","Safari","Firefox","Edge","其他"]} val={browser} set={setBrowser}/></div>
      </div>
      <button onClick={()=>ok&&onStart({nickname:nick.trim(),device,browser})} disabled={!ok} style={{width:"100%",marginTop:24,padding:"14px 0",borderRadius:12,background:ok?"linear-gradient(135deg,#8B5A2B,#A67B5B)":"#d5cfc3",color:"#fff",fontSize:15,fontWeight:700,border:"none",cursor:ok?"pointer":"default",letterSpacing:1}}>開始填寫 →</button>
      <p style={{textAlign:"center",marginTop:16,fontSize:12,color:"#b8ad9c"}}>預計 40–60 分鐘，可分次完成</p>
    </div>
  </div>);
}

export default function FeedbackApp() {
  const [authed,setAuthed]=useState(false);
  const [view,setView]=useState("welcome");
  const [parts,setParts]=useState(null);
  const [loading,setLoading]=useState(true);
  const [userInfo,setUserInfo]=useState(null);
  const [answers,setAnswers]=useState({});
  const [freeform,setFreeform]=useState({});
  const [cur,setCur]=useState(null);
  const [mobNav,setMobNav]=useState(false);
  const [saveStatus,setSaveStatus]=useState("");
  const saveT=useRef(null);
  const contentRef=useRef(null);

  useEffect(()=>{(async()=>{
    const pc=await loadPasscode(); if(!pc) setAuthed(true);
    const q=await loadQ(); if(q){setParts(q);setCur(q[0]?.id||null);}
    setLoading(false);
  })();},[]);

  const totalItems=parts?parts.reduce((t,p)=>t+p.sections.reduce((s,sec)=>s+sec.items.length,0),0):0;
  const uid=userInfo?`${userInfo.nickname}-${userInfo.device}-${userInfo.browser}`:null;

  const doSave=useCallback(async()=>{
    if(!uid)return;
    setSaveStatus("saving");
    await saveF(uid,{...userInfo,answers,freeform,updatedAt:new Date().toISOString(),odName:uid});
    setSaveStatus("saved");
    setTimeout(()=>setSaveStatus(""),2000);
  },[uid,userInfo,answers,freeform]);

  useEffect(()=>{
    if(!uid)return;
    if(saveT.current)clearTimeout(saveT.current);
    saveT.current=setTimeout(doSave,1200);
    return()=>{if(saveT.current)clearTimeout(saveT.current);};
  },[answers,freeform,doSave,uid]);

  const handleStart=async(info)=>{
    setUserInfo(info);
    const u=`${info.nickname}-${info.device}-${info.browser}`;
    const ex=await loadF(u);
    if(ex){setAnswers(ex.answers||{});setFreeform(ex.freeform||{});}
    setView("form");
  };

  const totalDone=Object.values(answers).filter(a=>a?.status).length;
  const pct=totalItems>0?Math.round(totalDone/totalItems*100):0;
  const scrollTop=()=>{contentRef.current?.scrollTo({top:0,behavior:"smooth"});};

  if(loading)return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(160deg,#f7f0e3,#ede3d0,#e6d8c1)"}}><div style={{textAlign:"center",color:"#9a8a6e"}}><div style={{fontSize:40,marginBottom:12}}>🏔️</div><p>載入中...</p></div></div>);
  if(!authed)return <PasscodeGate onPass={()=>setAuthed(true)} />;
  if(!parts||parts.length===0)return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(160deg,#f7f0e3,#ede3d0,#e6d8c1)"}}><div style={{textAlign:"center",color:"#9a8a6e",maxWidth:400,padding:20}}><div style={{fontSize:40,marginBottom:12}}>📋</div><h2 style={{color:"#5B3A1F"}}>題目尚未設定</h2><p style={{fontSize:14,lineHeight:1.7}}>請聯絡管理員到 /admin 初始化題目。</p></div></div>);
  if(view==="welcome")return <Welcome onStart={handleStart} />;

  const active=parts.find(p=>p.id===cur);
  const allIds=[...parts.map(p=>p.id),"freeform"];
  const isMob=typeof window!=="undefined"&&window.innerWidth<768;

  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",background:"linear-gradient(160deg,#f7f0e3,#ede3d0,#e6d8c1)",fontFamily:"'Noto Sans TC',-apple-system,sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&family=Noto+Serif+TC:wght@700&display=swap" rel="stylesheet" />
      <header style={{position:"sticky",top:0,zIndex:100,padding:"10px 16px",background:"rgba(247,240,227,.92)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(0,0,0,.06)",display:"flex",alignItems:"center",gap:12}}>
        {isMob&&<button onClick={()=>setMobNav(!mobNav)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:"#8B5A2B",padding:4}}>☰</button>}
        <span style={{fontSize:18}}>🏔️</span><span style={{fontSize:14,fontWeight:700,color:"#5B3A1F",fontFamily:"'Noto Serif TC',serif"}}>方壺山道場 測試回饋</span><div style={{flex:1}}/>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {saveStatus==="saving"&&<span style={{fontSize:11,color:"#c49000"}}>儲存中...</span>}
          {saveStatus==="saved"&&<span style={{fontSize:11,color:"#6B8E4E"}}>✓ 已儲存</span>}
          <div style={{padding:"4px 12px",borderRadius:16,background:pct>=100?"#6B8E4E":"rgba(139,90,43,.12)",fontSize:12,fontWeight:700,color:pct>=100?"#fff":"#8B5A2B"}}>{totalDone}/{totalItems}　{pct}%</div>
        </div>
      </header>
      <div style={{display:"flex",flex:1,minHeight:0}}>
        {!isMob&&<aside style={{width:240,minWidth:240,borderRight:"1px solid rgba(0,0,0,.06)",background:"rgba(255,255,255,.4)",overflowY:"auto",padding:"8px 6px"}}><Nav parts={parts} cur={cur} onSelect={id=>{setCur(id);scrollTop();}} answers={answers} freeform={freeform}/></aside>}
        {mobNav&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:200,background:"rgba(0,0,0,.3)",backdropFilter:"blur(4px)"}} onClick={()=>setMobNav(false)}><div style={{width:280,height:"100%",background:"rgba(247,240,227,.98)",overflowY:"auto",padding:"60px 10px 20px",boxShadow:"4px 0 20px rgba(0,0,0,.1)"}} onClick={e=>e.stopPropagation()}><Nav parts={parts} cur={cur} onSelect={id=>{setCur(id);setMobNav(false);scrollTop();}} answers={answers} freeform={freeform}/></div></div>}
        <main ref={contentRef} style={{flex:1,overflowY:"auto",padding:"24px 20px 60px",maxWidth:800,margin:"0 auto",width:"100%"}}>
          {cur==="freeform"?<Freeform answers={freeform} onAnswer={(k,v)=>setFreeform(p=>({...p,[k]:v}))}/>:active?<PartView part={active} answers={answers} onAnswer={(id,a)=>setAnswers(p=>({...p,[id]:a}))} uid={uid}/>:null}
          <div style={{display:"flex",justifyContent:"space-between",marginTop:32,paddingTop:20,borderTop:"1px solid rgba(0,0,0,.08)"}}>
            {cur!==allIds[0]?<button onClick={()=>{const i=allIds.indexOf(cur);if(i>0){setCur(allIds[i-1]);scrollTop();}}} style={{padding:"10px 20px",borderRadius:10,background:"rgba(255,255,255,.6)",border:"1px solid rgba(0,0,0,.1)",cursor:"pointer",fontSize:13,color:"#6b5830"}}>← 上一段</button>:<div/>}
            {cur!=="freeform"?<button onClick={()=>{const i=allIds.indexOf(cur);if(i<allIds.length-1){setCur(allIds[i+1]);scrollTop();}}} style={{padding:"10px 20px",borderRadius:10,background:"linear-gradient(135deg,#8B5A2B,#A67B5B)",border:"none",cursor:"pointer",fontSize:13,color:"#fff",fontWeight:600}}>下一段 →</button>
            :<button onClick={doSave} style={{padding:"10px 24px",borderRadius:10,background:"linear-gradient(135deg,#6B8E4E,#8aad6a)",border:"none",cursor:"pointer",fontSize:14,color:"#fff",fontWeight:700}}>🙏 完成送出</button>}
          </div>
        </main>
      </div>
    </div>
  );
}
