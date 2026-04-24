import { useState, useEffect } from 'react';
import { loadQuestions, saveQuestions, loadPasscode, savePasscode as savePC, loadAllFeedbacks } from '../storage';
import { DEFAULT_PARTS, TOTAL, findItemText, findPart } from '../data';

function Ring({progress,size=40,stroke=3.5}){const r=(size-stroke)/2,c=2*Math.PI*r;return(<svg width={size} height={size} style={{transform:'rotate(-90deg)'}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,0,0,.08)" strokeWidth={stroke}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={progress>=1?'#6B8E4E':'#8B5A2B'} strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={c*(1-progress)} strokeLinecap="round" style={{transition:'stroke-dashoffset .4s'}}/></svg>);}

// ── Passcode Settings ───────────────────────────────────────
function PasscodeSettings() {
  const [code,setCode]=useState('');const [loaded,setLoaded]=useState(false);const [saving,setSaving]=useState(false);const [msg,setMsg]=useState('');
  useEffect(()=>{loadPasscode().then(c=>{setCode(c||'');setLoaded(true);});},[]);
  const handleSave=async()=>{setSaving(true);const ok=await savePC(code.trim()||null);setSaving(false);setMsg(ok?(code.trim()?'✓ 通行碼已更新':'✓ 通行碼已清除，開放進入'):'儲存失敗');setTimeout(()=>setMsg(''),3000);};
  if(!loaded)return null;
  return(<div style={{padding:'18px 20px',borderRadius:14,background:'rgba(255,255,255,.8)',border:'1px solid rgba(0,0,0,.06)',marginBottom:20}}>
    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}><span style={{fontSize:18}}>🔑</span><h3 style={{margin:0,fontSize:15,color:'#5B3A1F'}}>通行碼設定</h3></div>
    <p style={{margin:'0 0 12px',fontSize:12.5,color:'#9a8a6e',lineHeight:1.6}}>設定後，測試者必須輸入通行碼才能進入。留空 = 開放進入。更改後即時生效。</p>
    <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
      <input value={code} onChange={e=>setCode(e.target.value)} placeholder="輸入通行碼（留空 = 開放）" style={{flex:1,minWidth:200,padding:'9px 14px',borderRadius:10,border:'1px solid rgba(0,0,0,.12)',fontSize:14,fontFamily:'monospace',letterSpacing:1,background:'rgba(255,255,255,.8)',boxSizing:'border-box',outline:'none'}} />
      <button onClick={handleSave} disabled={saving} style={{padding:'9px 18px',borderRadius:10,background:'#8B5A2B',color:'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:600}}>{saving?'儲存中...':'💾 儲存'}</button>
    </div>
    {msg&&<p style={{margin:'8px 0 0',fontSize:12,color:msg.includes('失敗')?'#c44028':'#6B8E4E',fontWeight:600}}>{msg}</p>}
    <div style={{marginTop:10,padding:'8px 12px',borderRadius:8,background:code.trim()?'rgba(107,142,78,.08)':'rgba(196,144,0,.08)',border:`1px solid ${code.trim()?'rgba(107,142,78,.15)':'rgba(196,144,0,.15)'}`}}>
      <span style={{fontSize:12,color:code.trim()?'#6B8E4E':'#c49000'}}>{code.trim()?`🔒 需通行碼「${code.trim()}」才能進入`:'🔓 開放進入'}</span>
    </div>
  </div>);
}

// ── Question Editor ─────────────────────────────────────────
function QuestionEditor({parts,onSave}){
  const[data,setData]=useState(JSON.parse(JSON.stringify(parts)));const[saving,setSaving]=useState(false);const[saved,setSaved]=useState(false);const[expP,setExpP]=useState(null);const[expS,setExpS]=useState(null);
  const handleSave=async()=>{setSaving(true);const ok=await saveQuestions(data);setSaving(false);if(ok){setSaved(true);onSave(data);setTimeout(()=>setSaved(false),2000);}};
  const up=(pi,f,v)=>{const d=[...data];d[pi]={...d[pi],[f]:v};setData(d);};
  const uSec=(pi,si,f,v)=>{const d=JSON.parse(JSON.stringify(data));d[pi].sections[si][f]=v;setData(d);};
  const uItem=(pi,si,ii,f,v)=>{const d=JSON.parse(JSON.stringify(data));d[pi].sections[si].items[ii][f]=v;setData(d);};
  const addItem=(pi,si)=>{const d=JSON.parse(JSON.stringify(data));const s=d[pi].sections[si];const li=s.items.length>0?s.items[s.items.length-1].id:`${pi+1}.0`;const ps=li.split('.');ps[ps.length-1]=parseInt(ps[ps.length-1]||0)+1;s.items.push({id:ps.join('.'),text:''});setData(d);};
  const rmItem=(pi,si,ii)=>{const d=JSON.parse(JSON.stringify(data));d[pi].sections[si].items.splice(ii,1);setData(d);};
  const addSec=(pi)=>{const d=JSON.parse(JSON.stringify(data));d[pi].sections.push({title:'新段落',items:[]});setData(d);};
  const rmSec=(pi,si)=>{const d=JSON.parse(JSON.stringify(data));d[pi].sections.splice(si,1);setData(d);};
  const addP=()=>{setData([...data,{id:`part${data.length+1}`,title:`Part ${data.length+1}`,subtitle:'新分頁',icon:'📋',description:'',sections:[{title:'新段落',items:[]}]}]);};
  const rmP=(pi)=>{const d=[...data];d.splice(pi,1);setData(d);};
  const mvP=(pi,dir)=>{const d=[...data];const ni=pi+dir;if(ni<0||ni>=d.length)return;[d[pi],d[ni]]=[d[ni],d[pi]];setData(d);};
  const inp={width:'100%',padding:'8px 10px',borderRadius:8,border:'1px solid rgba(0,0,0,.1)',fontSize:13,fontFamily:'inherit',boxSizing:'border-box',outline:'none',background:'rgba(255,255,255,.8)'};
  const btn=(bg,c)=>({padding:'6px 12px',borderRadius:8,border:'none',background:bg,color:c,cursor:'pointer',fontSize:12,fontWeight:600});

  return(<div>
    <PasscodeSettings />
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,flexWrap:'wrap',gap:12}}>
      <div><h2 style={{margin:0,fontSize:18,color:'#5B3A1F'}}>📝 編輯測試題目</h2><p style={{margin:'4px 0 0',fontSize:12,color:'#9a8a6e'}}>共 {TOTAL(data)} 題 · {data.length} 個 Part</p></div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>{saved&&<span style={{fontSize:12,color:'#6B8E4E'}}>✓ 已儲存</span>}<button onClick={addP} style={btn('rgba(107,142,78,.15)','#6B8E4E')}>+ 新增 Part</button><button onClick={handleSave} disabled={saving} style={btn('#8B5A2B','#fff')}>{saving?'儲存中...':'💾 儲存題目'}</button></div>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      {data.map((part,pi)=>{const ie=expP===pi;return(<div key={pi} style={{borderRadius:14,background:'rgba(255,255,255,.75)',border:'1px solid rgba(0,0,0,.06)',overflow:'hidden'}}>
        <div onClick={()=>setExpP(ie?null:pi)} style={{padding:'14px 18px',cursor:'pointer',display:'flex',alignItems:'center',gap:10,background:ie?'rgba(139,90,43,.06)':'transparent'}}>
          <span style={{fontSize:20}}>{part.icon}</span><div style={{flex:1}}><span style={{fontSize:14,fontWeight:600,color:'#5B3A1F'}}>{part.title} — {part.subtitle}</span><span style={{fontSize:11,color:'#a09880',marginLeft:8}}>{part.sections.reduce((t,s)=>t+s.items.length,0)} 題</span></div>
          <div style={{display:'flex',gap:4}}><button onClick={e=>{e.stopPropagation();mvP(pi,-1);}} disabled={pi===0} style={{...btn('rgba(0,0,0,.05)','#6b5830'),opacity:pi===0?.3:1}}>↑</button><button onClick={e=>{e.stopPropagation();mvP(pi,1);}} disabled={pi===data.length-1} style={{...btn('rgba(0,0,0,.05)','#6b5830'),opacity:pi===data.length-1?.3:1}}>↓</button><button onClick={e=>{e.stopPropagation();if(confirm(`刪除 ${part.title}？`))rmP(pi);}} style={btn('rgba(196,80,40,.1)','#c44028')}>✕</button></div>
          <span style={{fontSize:14,color:'#a09880'}}>{ie?'▾':'▸'}</span>
        </div>
        {ie&&<div style={{padding:'0 18px 18px'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 80px',gap:8,marginBottom:12}}><div><label style={{fontSize:11,color:'#9a8a6e'}}>副標題</label><input value={part.subtitle} onChange={e=>up(pi,'subtitle',e.target.value)} style={inp}/></div><div><label style={{fontSize:11,color:'#9a8a6e'}}>圖示</label><input value={part.icon} onChange={e=>up(pi,'icon',e.target.value)} style={{...inp,width:80}}/></div></div>
          <div style={{marginBottom:12}}><label style={{fontSize:11,color:'#9a8a6e'}}>情境說明</label><textarea value={part.description||''} onChange={e=>up(pi,'description',e.target.value)} style={{...inp,minHeight:50,resize:'vertical'}}/></div>
          {part.sections.map((sec,si)=>{const sk=`${pi}-${si}`;const se=expS===sk;return(<div key={si} style={{marginBottom:10,borderRadius:10,border:'1px solid rgba(0,0,0,.06)',background:'rgba(0,0,0,.015)'}}>
            <div onClick={()=>setExpS(se?null:sk)} style={{padding:'10px 14px',cursor:'pointer',display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:13,fontWeight:600,color:'#6B4E2E',flex:1}}>{sec.title} ({sec.items.length})</span><button onClick={e=>{e.stopPropagation();if(confirm('刪除此段落？'))rmSec(pi,si);}} style={btn('rgba(196,80,40,.08)','#c44028')}>✕</button><span style={{fontSize:12,color:'#a09880'}}>{se?'▾':'▸'}</span></div>
            {se&&<div style={{padding:'0 14px 14px'}}>
              <div style={{display:'flex',gap:8,marginBottom:8}}><div style={{flex:1}}><label style={{fontSize:11,color:'#9a8a6e'}}>標題</label><input value={sec.title} onChange={e=>uSec(pi,si,'title',e.target.value)} style={inp}/></div><div style={{flex:1}}><label style={{fontSize:11,color:'#9a8a6e'}}>量表</label><select value={sec.scale||'default'} onChange={e=>uSec(pi,si,'scale',e.target.value==='default'?undefined:e.target.value)} style={{...inp,cursor:'pointer'}}><option value="default">順/怪/不會用</option><option value="like">很好/還行/怪怪的</option><option value="speed">很順/普通/有點卡</option><option value="easy">很直覺/還OK/卡住</option></select></div></div>
              <div style={{marginBottom:8}}><label style={{fontSize:11,color:'#9a8a6e'}}>備註</label><input value={sec.note||''} onChange={e=>uSec(pi,si,'note',e.target.value||undefined)} style={inp} placeholder="選填"/></div>
              {sec.items.map((item,ii)=>(<div key={ii} style={{display:'flex',gap:6,marginBottom:6,alignItems:'center'}}><input value={item.id} onChange={e=>uItem(pi,si,ii,'id',e.target.value)} style={{...inp,width:60,textAlign:'center',fontFamily:'monospace',fontSize:12}}/><input value={item.text} onChange={e=>uItem(pi,si,ii,'text',e.target.value)} style={{...inp,flex:1}} placeholder="題目內容"/><button onClick={()=>rmItem(pi,si,ii)} style={{...btn('rgba(196,80,40,.08)','#c44028'),padding:'4px 8px'}}>✕</button></div>))}
              <button onClick={()=>addItem(pi,si)} style={btn('rgba(107,142,78,.1)','#6B8E4E')}>+ 新增題目</button>
            </div>}
          </div>);})}
          <button onClick={()=>addSec(pi)} style={{...btn('rgba(107,142,78,.1)','#6B8E4E'),marginTop:4}}>+ 新增段落</button>
        </div>}
      </div>);})}
    </div>
  </div>);
}

// ── Overview + Hotspots ─────────────────────────────────────
function Overview({users,parts}){const[sel,setSel]=useState(null);const total=TOTAL(parts);const getP=u=>{if(!u?.answers)return{done:0,pct:0};const d=Object.values(u.answers).filter(a=>a?.status).length;return{done:d,pct:d/total};};
  return(<div style={{display:'grid',gridTemplateColumns:sel?'1fr 1fr':'1fr',gap:20,alignItems:'start'}}>
    <div style={{display:'flex',flexDirection:'column',gap:8}}>
      {users.length===0?<div style={{padding:40,textAlign:'center',color:'#9a8a6e',background:'rgba(255,255,255,.6)',borderRadius:14}}>還沒有人填寫。</div>
      :users.sort((a,b)=>getP(b).pct-getP(a).pct).map(u=>{const p=getP(u);const act=sel?.odName===u.odName;const wc=u.answers?Object.values(u.answers).filter(a=>a?.status==='weird').length:0;const cc=u.answers?Object.values(u.answers).filter(a=>a?.status==='confused').length:0;return(
        <button key={u.odName||u.nickname} onClick={()=>setSel(act?null:u)} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 18px',background:act?'rgba(139,90,43,.08)':'rgba(255,255,255,.7)',border:`1.5px solid ${act?'rgba(139,90,43,.25)':'rgba(0,0,0,.06)'}`,borderRadius:14,cursor:'pointer',textAlign:'left',width:'100%'}}>
          <Ring progress={p.pct}/><div style={{flex:1}}><div style={{fontSize:15,fontWeight:600,color:'#5B3A1F'}}>{u.nickname||'匿名'}</div><div style={{fontSize:12,color:'#9a8a6e',marginTop:2}}>{[u.device,u.browser,u.role].filter(Boolean).join(' · ')}</div></div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}><div style={{fontSize:16,fontWeight:700,color:p.pct>=1?'#6B8E4E':'#a09880'}}>{Math.round(p.pct*100)}%</div><div style={{display:'flex',gap:6,fontSize:11}}>{wc>0&&<span style={{color:'#c49000'}}>😕{wc}</span>}{cc>0&&<span style={{color:'#a05520'}}>❓{cc}</span>}</div></div>
        </button>);})}
    </div>
    {sel&&<div style={{position:'sticky',top:80,padding:'20px 22px',borderRadius:14,background:'rgba(255,255,255,.75)',border:'1px solid rgba(0,0,0,.06)'}}>
      <h3 style={{margin:'0 0 12px',fontSize:16,color:'#5B3A1F'}}>{sel.nickname}</h3>
      <p style={{fontSize:12,color:'#9a8a6e',margin:'0 0 12px'}}>{[sel.device,sel.browser,sel.role].filter(Boolean).join(' · ')}{sel.updatedAt&&` · ${new Date(sel.updatedAt).toLocaleString('zh-TW')}`}</p>
      {sel.answers&&Object.entries(sel.answers).filter(([,a])=>a?.status==='weird'||a?.status==='confused').map(([id,a])=>(<div key={id} style={{padding:'8px 12px',borderRadius:8,marginBottom:6,background:a.status==='confused'?'rgba(160,85,32,.06)':'rgba(196,144,0,.06)'}}><div style={{display:'flex',gap:6}}><span style={{fontSize:11,fontFamily:'monospace',color:'#9a8a6e',minWidth:36}}>{id}</span><span style={{flex:1,fontSize:12.5,color:'#3d3225'}}>{findItemText(parts,id)}</span></div>{a.comment&&<p style={{margin:'4px 0 0 42px',fontSize:12,color:'#6b5830',fontStyle:'italic'}}>「{a.comment}」</p>}</div>))}
      {sel.freeform&&Object.entries(sel.freeform).filter(([,v])=>v).map(([k,v])=>(<div key={k} style={{marginTop:8}}><div style={{fontSize:12,color:'#9a8a6e',fontWeight:600}}>{k}</div><p style={{margin:'2px 0 0',fontSize:13,color:'#3d3225',whiteSpace:'pre-wrap'}}>{v}</p></div>))}
    </div>}
  </div>);
}

function Hotspots({users,parts}){const issues={};for(const u of users){if(!u?.answers)continue;for(const[id,a]of Object.entries(u.answers)){if(a?.status==='weird'||a?.status==='confused'){if(!issues[id])issues[id]={weird:0,confused:0,total:0,comments:[]};issues[id][a.status]++;issues[id].total++;if(a.comment)issues[id].comments.push({user:u.nickname,comment:a.comment});}}}
  const sorted=Object.entries(issues).sort((a,b)=>b[1].total-a[1].total);if(sorted.length===0)return<div style={{padding:40,textAlign:'center',color:'#9a8a6e',background:'rgba(255,255,255,.6)',borderRadius:14}}>目前沒有問題項目。</div>;
  return(<div style={{display:'flex',flexDirection:'column',gap:8}}>{sorted.map(([id,d],idx)=>{const sev=d.total/users.length;const part=findPart(parts,id);return(<div key={id} style={{padding:'14px 18px',borderRadius:12,background:'rgba(255,255,255,.75)',border:`1px solid ${sev>.5?'rgba(196,80,40,.15)':'rgba(0,0,0,.06)'}`}}><div style={{display:'flex',alignItems:'flex-start',gap:10}}><span style={{fontSize:11,fontWeight:700,color:'#fff',minWidth:24,height:24,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',background:sev>.5?'#c44028':sev>.3?'#c49000':'#a09880'}}>{idx+1}</span><span style={{fontSize:12,fontFamily:'monospace',color:'#9a8a6e',minWidth:38,paddingTop:2}}>{id}</span><div style={{flex:1}}><span style={{fontSize:13,color:'#3d3225'}}>{findItemText(parts,id)}</span>{part&&<span style={{fontSize:11,color:'#b8ad9c',marginLeft:6}}>({part.subtitle})</span>}</div><div style={{display:'flex',gap:8,whiteSpace:'nowrap'}}>{d.weird>0&&<span style={{fontSize:13,color:'#c49000',fontWeight:600}}>😕{d.weird}</span>}{d.confused>0&&<span style={{fontSize:13,color:'#a05520',fontWeight:600}}>❓{d.confused}</span>}<span style={{fontSize:11,color:'#fff',padding:'2px 8px',borderRadius:10,background:sev>.5?'#c44028':'#a09880',fontWeight:600}}>{d.total}/{users.length}</span></div></div>{d.comments.length>0&&<div style={{marginTop:8,paddingLeft:72}}>{d.comments.map((c,i)=><div key={i} style={{fontSize:12,color:'#6b5830',marginBottom:3}}><strong style={{color:'#8B5A2B'}}>{c.user}</strong>：{c.comment}</div>)}</div>}</div>);})}</div>);
}

// ── Main ────────────────────────────────────────────────────
export default function AdminDashboard(){
  const[parts,setParts]=useState(null);const[users,setUsers]=useState([]);const[loading,setLoading]=useState(true);const[tab,setTab]=useState('overview');
  const init=async()=>{setLoading(true);let q=await loadQuestions();if(!q){q=DEFAULT_PARTS;await saveQuestions(q);}setParts(q);setUsers(await loadAllFeedbacks());setLoading(false);};
  useEffect(()=>{init();},[]);

  const exportCSV=()=>{if(!parts||users.length===0)return;const all=parts.flatMap(p=>p.sections.flatMap(s=>s.items.map(i=>({...i,part:p.subtitle}))));let csv='\uFEFF#,Part,題目,'+users.map(u=>`"${u.nickname}"`).join(',')+',問題數\n';for(const item of all){let wc=0;const row=[item.id,`"${item.part}"`,`"${item.text}"`];for(const u of users){const a=u.answers?.[item.id];if(a?.status==='weird'||a?.status==='confused')wc++;row.push(`"${a?.status||''}${a?.comment?` | ${a.comment}`:''}"`);}row.push(wc);csv+=row.join(',')+'\n';}csv+='\n\n自由回饋\n';for(const u of users){if(!u.freeform)continue;csv+=`\n"${u.nickname}"\n`;for(const[k,v]of Object.entries(u.freeform)){if(v)csv+=`"${k}","${v.replace(/"/g,'""')}"\n`;}}const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));a.download=`feedback-${new Date().toISOString().slice(0,10)}.csv`;a.click();};

  if(loading)return<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(160deg,#f7f0e3,#ede3d0,#e6d8c1)'}}><div style={{textAlign:'center',color:'#9a8a6e'}}><div style={{fontSize:40,marginBottom:12}}>🏔️</div>載入中...</div></div>;
  const total=parts?TOTAL(parts):0;const avgPct=users.length>0?Math.round(users.reduce((t,u)=>t+(u.answers?Object.values(u.answers).filter(a=>a?.status).length/total:0),0)/users.length*100):0;
  const issueSet=new Set();users.forEach(u=>u.answers&&Object.entries(u.answers).forEach(([id,a])=>{if(a?.status==='weird'||a?.status==='confused')issueSet.add(id);}));
  const commentCount=users.reduce((t,u)=>t+(u.answers?Object.values(u.answers).filter(a=>a?.comment).length:0)+(u.freeform?Object.values(u.freeform).filter(v=>v).length:0),0);

  return(<div style={{minHeight:'100vh',background:'linear-gradient(160deg,#f7f0e3,#ede3d0,#e6d8c1)',fontFamily:"'Noto Sans TC',-apple-system,sans-serif"}}>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&family=Noto+Serif+TC:wght@700&display=swap" rel="stylesheet"/>
    <header style={{position:'sticky',top:0,zIndex:100,padding:'14px 20px',background:'rgba(91,58,31,.95)',backdropFilter:'blur(12px)',display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}>
      <span style={{fontSize:22}}>🏔️</span><h1 style={{margin:0,fontSize:18,color:'#fff',fontFamily:"'Noto Serif TC',serif",flex:1}}>方壺山道場 — 管理儀表板</h1>
      <div style={{display:'flex',gap:8}}><button onClick={init} style={{padding:'7px 14px',borderRadius:8,background:'rgba(255,255,255,.15)',color:'#fff',border:'1px solid rgba(255,255,255,.2)',cursor:'pointer',fontSize:12}}>🔄 重新整理</button><button onClick={exportCSV} disabled={users.length===0} style={{padding:'7px 14px',borderRadius:8,background:users.length>0?'#6B8E4E':'rgba(255,255,255,.1)',color:'#fff',border:'none',cursor:users.length>0?'pointer':'default',fontSize:12}}>📥 匯出 CSV</button></div>
    </header>
    <div style={{maxWidth:1200,margin:'0 auto',padding:'24px 16px'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))',gap:14,marginBottom:28}}>
        {[{l:'測試者',v:users.length,c:'#5B3A1F'},{l:'平均完成率',v:users.length>0?`${avgPct}%`:'—',c:'#6B8E4E'},{l:'問題項目',v:issueSet.size,c:'#c49000'},{l:'留言數',v:commentCount,c:'#a05520'},{l:'題目總數',v:total,c:'#8B5A2B'}].map(s=>(<div key={s.l} style={{padding:'18px 16px',borderRadius:14,background:'rgba(255,255,255,.8)',border:'1px solid rgba(0,0,0,.06)',textAlign:'center'}}><div style={{fontSize:28,fontWeight:700,color:s.c}}>{s.v}</div><div style={{fontSize:12,color:'#9a8a6e',marginTop:4}}>{s.l}</div></div>))}
      </div>
      <div style={{display:'flex',gap:4,marginBottom:20,borderBottom:'1px solid rgba(0,0,0,.08)'}}>
        {[{id:'overview',label:'👥 測試者總覽'},{id:'hotspots',label:'🔥 問題熱點'},{id:'editor',label:'📝 編輯題目'}].map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'10px 18px',border:'none',cursor:'pointer',background:tab===t.id?'rgba(139,90,43,.1)':'transparent',borderBottom:tab===t.id?'3px solid #8B5A2B':'3px solid transparent',fontSize:14,fontWeight:tab===t.id?700:400,color:tab===t.id?'#5B3A1F':'#9a8a6e',borderRadius:'8px 8px 0 0'}}>{t.label}</button>))}
      </div>
      {tab==='overview'&&parts&&<Overview users={users} parts={parts}/>}
      {tab==='hotspots'&&parts&&<Hotspots users={users} parts={parts}/>}
      {tab==='editor'&&parts&&<QuestionEditor parts={parts} onSave={d=>setParts(d)}/>}
    </div>
  </div>);
}
