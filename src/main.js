import { invoke } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';

let tasks = [], currentDate = new Date(), editingId = null;
const WN = ['日','一','二','三','四','五','六'];

const $ = id => document.getElementById(id);
const taskList = $('task-list'), emptyState = $('empty-state'), dateDisplay = $('date-display');
const taskInput = $('task-input'), addBtn = $('add-btn');
const onceDate = $('once-date'), onceTime = $('once-time'), weeklyTime = $('weekly-time');
const onceConfig = $('once-config'), weeklyConfig = $('weekly-config');
const dayBtns = document.querySelectorAll('.day-btn');

// 窗口控制
$('pin-btn').addEventListener('click', async () => {
  const w = getCurrentWindow(); await w.setAlwaysOnTop(!(await w.isAlwaysOnTop()));
});
$('min-btn').addEventListener('click', async () => { await getCurrentWindow().minimize(); });
$('close-btn').addEventListener('click', async () => { await getCurrentWindow().hide(); });

// 日期
function fmt(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function updDate(){dateDisplay.textContent=`${fmt(currentDate)} 周${WN[currentDate.getDay()]}`}
$('prev-btn').onclick=()=>{currentDate.setDate(currentDate.getDate()-1);updDate();render();}
$('next-btn').onclick=()=>{currentDate.setDate(currentDate.getDate()+1);updDate();render();}
$('today-btn').onclick=()=>{currentDate=new Date();updDate();render();}
$('refresh-btn').onclick=loadTasks;

document.querySelectorAll('input[name="rtype"]').forEach(r=>r.addEventListener('change',()=>{
  onceConfig.style.display=r.value==='once'?'flex':'none';
  weeklyConfig.style.display=r.value==='weekly'?'flex':'none';
}));

dayBtns.forEach(b=>b.addEventListener('click',()=>b.classList.toggle('active')));

// 数据
async function loadTasks(){
  try{tasks=await invoke('get_tasks');render();await checkReminders();}catch(e){}
}

function filterTasks(){
  const ds=fmt(currentDate);
  return tasks.filter(t=>t.completed||t.reminder_type==='weekly'||(t.reminder_data.datetime&&t.reminder_data.datetime.startsWith(ds)))
    .sort((a,b)=>a.completed-b.completed);
}

function render(){
  const list=filterTasks();
  taskList.innerHTML='';
  if(!list.length){taskList.appendChild(emptyState);return;}
  list.forEach(t=>{
    const card=document.createElement('div');
    card.className='task-card'+(t.completed?' completed':'');
    const cb=document.createElement('input');
    cb.type='checkbox';cb.className='task-checkbox';cb.checked=t.completed;
    cb.onchange=()=>toggleComplete(t.id);
    const body=document.createElement('div');body.className='task-body';
    const ct=document.createElement('div');ct.className='task-content';ct.textContent=t.content;
    const meta=document.createElement('div');meta.className='task-meta';
    if(t.completed)meta.textContent='✅ 已完成';
    else if(t.reminder_type==='once')meta.textContent=`🔔 单次 ${(t.reminder_data.datetime||'').replace('T',' ')}`;
    else meta.textContent=`🔁 每周${t.reminder_data.days.map(d=>WN[d]).join('')} ${t.reminder_data.time}`;
    body.appendChild(ct);body.appendChild(meta);
    const eb=document.createElement('button');eb.className='action-btn';eb.textContent='✏️';
    eb.onclick=()=>startEdit(t);
    const db=document.createElement('button');db.className='action-btn delete-btn';db.textContent='×';
    db.onclick=()=>deleteTask(t.id);
    card.append(cb,body,eb,db);
    taskList.appendChild(card);
  });
}

// CRUD
taskInput.addEventListener('keydown',e=>{if(e.key==='Enter')addTask();});

async function addTask(){
  const content=taskInput.value.trim();
  if(!content)return;
  const rtype=document.querySelector('input[name="rtype"]:checked').value;
  let rd;
  if(rtype==='once'){
    rd={datetime:`${onceDate.value||fmt(new Date())}T${onceTime.value}:00`,days:[],time:'09:00'};
  } else {
    const days=[...document.querySelectorAll('.day-btn.active')].map(b=>parseInt(b.dataset.day));
    rd={datetime:null,days:days.length?days:[1],time:weeklyTime.value};
  }
  try{
    if(editingId!==null){
      const t=tasks.find(x=>x.id===editingId);
      if(t){t.content=content;t.reminder_type=rtype;t.reminder_data=rd;await invoke('update_task',{task:t});}
      editingId=null;addBtn.textContent='＋添加待办';addBtn.classList.remove('editing');
    } else {
      await invoke('add_task',{content,reminderType:rtype,reminderData:rd});
    }
    taskInput.value='';await loadTasks();taskInput.focus();
  }catch(e){}
}

function startEdit(t){
  taskInput.value=t.content;editingId=t.id;
  addBtn.textContent='✓ 更新待办';addBtn.classList.add('editing');
  if(t.reminder_type==='once'){
    document.querySelector('input[value="once"]').checked=true;
    if(t.reminder_data.datetime){const p=t.reminder_data.datetime.split('T');onceDate.value=p[0];onceTime.value=p[1].substring(0,5);}
    onceConfig.style.display='flex';weeklyConfig.style.display='none';
  } else {
    document.querySelector('input[value="weekly"]').checked=true;
    weeklyTime.value=t.reminder_data.time||'09:00';
    dayBtns.forEach(b=>b.classList.toggle('active',t.reminder_data.days.includes(parseInt(b.dataset.day))));
    onceConfig.style.display='none';weeklyConfig.style.display='flex';
  }
  taskInput.focus();
}

async function deleteTask(id){
  if(!confirm('确认删除？'))return;
  try{await invoke('delete_task',{id});await loadTasks();}catch(e){}
}

async function toggleComplete(id){
  try{await invoke('toggle_complete',{id});await loadTasks();}catch(e){}
}

async function checkReminders(){
  try{await invoke('check_and_notify');}catch(e){}
}

// 初始化
onceDate.value=fmt(new Date());updDate();
loadTasks();
setInterval(checkReminders,60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)loadTasks();});
