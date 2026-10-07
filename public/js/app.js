const $=s=>document.querySelector(s);
const pristine='<!doctype html>\n'+document.documentElement.outerHTML;
const cache=new Map();let current=null;
const hashId=()=>{const m=location.hash.match(/^#baustein-(\d+)$/);return m?+m[1]:null};
function categoryItems(cat){return ITEMS.filter(x=>x.cat===cat)}
function updateMenu(){const q=norm($('#search').value);const container=$('#categories');container.replaceChildren();let count=0;CATEGORY.forEach((name,c)=>{const matches=categoryItems(c).filter(x=>!q||norm(x.name+' '+TOPICS[x.station-1]+' '+x.task).includes(q));count+=matches.length;if(!matches.length)return;const links=el('div',{class:'category-items'},...matches.map(it=>el('button',{class:'item-link',type:'button',onclick:()=>openItem(it.id)},el('span',{class:'num'},String(it.id).padStart(2,'0')),el('span',{class:'name'},it.name),el('span',{class:'arrow','aria-hidden':'true'},'→'))));const box=el('details',{class:'category',open:!!q},el('summary',null,el('span',{class:'cat-number'},String(c+1).padStart(2,'0')),el('span',{class:'cat-name'},name),el('span',{class:'cat-count'},matches.length)),links);container.append(box)});$('#search-count').hidden=!q;$('#search-count').textContent=count+' Treffer';if(!count)container.append(el('p',{class:'empty'},'Kein passender Baustein. Ändere den Suchbegriff.'))}
function openOverview(push=true){if(window.speechSynthesis)speechSynthesis.cancel();$('#overview').hidden=false;$('#workpage').hidden=true;$('.worknav').hidden=true;if(push)history.pushState(null,'','#kategorien');window.scrollTo(0,0)}
function openItem(id,push=true){const it=ITEMS.find(x=>x.id===+id);if(!it){openOverview(false);return}if(window.speechSynthesis)speechSynthesis.cancel();current=it;$('#overview').hidden=true;$('#workpage').hidden=false;$('.worknav').hidden=false;$('#topic').textContent=TOPICS[it.station-1]+' · '+String(it.id).padStart(2,'0');$('#work-title').textContent=it.name;$('#task').textContent=it.task;$('#category-select').value=String(it.cat);$('#item-select').replaceChildren(...categoryItems(it.cat).map(x=>el('option',{value:x.id},String(x.id).padStart(2,'0')+' · '+x.name)));$('#item-select').value=String(it.id);$('#position').textContent=it.id+' / 69';$('#previous').disabled=it.id===1;$('#next').disabled=it.id===69;
 if(!cache.has(it.id)){const root=el('div',{class:'activity','data-asset':it.id});it.render(root);cache.set(it.id,root)}$('#activity-host').replaceChildren(cache.get(it.id));document.title=it.name+' · Ägypten';if(push)history.pushState(null,'','#baustein-'+it.id);window.scrollTo(0,0);$('#work-title').focus({preventScroll:true})}
$('#category-select').replaceChildren(...CATEGORY.map((x,i)=>el('option',{value:i},x)));
$('#category-select').onchange=e=>openItem(categoryItems(+e.target.value)[0].id);
$('#item-select').onchange=e=>openItem(+e.target.value);
$('#previous').onclick=()=>current&&openItem(Math.max(1,current.id-1));$('#next').onclick=()=>current&&openItem(Math.min(69,current.id+1));
$('#overview-button').onclick=()=>openOverview();$('#search').oninput=updateMenu;
$('#reset').onclick=()=>{if(!current)return;CLEANUP.filter(x=>x.id===current.id).forEach(x=>x.fn());CLEANUP=CLEANUP.filter(x=>x.id!==current.id);cache.delete(current.id);openItem(current.id,false)};
$('#export').onclick=()=>current&&exportAsset(current);
$('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch(e){$('#fullscreen').textContent='Browser-Vollbild nutzen'}};
 document.addEventListener('fullscreenchange',()=>$('#fullscreen').textContent=document.fullscreenElement?'Vollbild beenden':'Vollbild');
 window.addEventListener('popstate',()=>{const id=hashId();id?openItem(id,false):openOverview(false)});
 window.addEventListener('beforeunload',()=>CLEANUP.forEach(x=>x.fn()));
 updateMenu();
 const only=+document.body.dataset.only;if(only){document.body.classList.add('task-only');openItem(only,false)}else if(hashId())openItem(hashId(),false);else openOverview(false);
