(()=>{
  const fieldNames=['subdistrict','district','province','postalCode'];
  let geography=[];
  const dataReady=fetch('../assets/data/thailand-geography.json').then(response=>{if(!response.ok)throw new Error('โหลดฐานข้อมูลที่อยู่ไม่สำเร็จ');return response.json()}).then(data=>geography=Array.isArray(data)?data:[]).catch(error=>{console.error(error);return[]});
  const clean=value=>String(value||'').trim().replace(/^(?:ตำบล|ต\.|อำเภอ|อ\.|จังหวัด|จ\.)\s*/,'').toLowerCase();
  const escape=value=>String(value||'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const unique=(rows,key)=>{const seen=new Set();return rows.filter(row=>{const value=key(row);if(seen.has(value))return false;seen.add(value);return true})};
  const fields=()=>Object.fromEntries(fieldNames.map(name=>[name,document.querySelector(`[name="${name}"]`)]));
  function candidates(name,query){
    const current=fields(),province=clean(current.province?.value),district=clean(current.district?.value),subdistrict=clean(current.subdistrict?.value);
    let rows=geography;
    if(name==='subdistrict')rows=rows.filter(row=>clean(row.subdistrictNameTh).includes(query)&&(!district||clean(row.districtNameTh)===district)&&(!province||clean(row.provinceNameTh)===province));
    if(name==='district')rows=rows.filter(row=>clean(row.districtNameTh).includes(query)&&(!province||clean(row.provinceNameTh)===province));
    if(name==='province')rows=rows.filter(row=>clean(row.provinceNameTh).includes(query));
    if(name==='postalCode')rows=rows.filter(row=>String(row.postalCode).startsWith(query)&&(!subdistrict||clean(row.subdistrictNameTh)===subdistrict)&&(!district||clean(row.districtNameTh)===district)&&(!province||clean(row.provinceNameTh)===province));
    const key=name==='province'?row=>row.provinceCode:name==='district'?row=>row.districtCode:name==='postalCode'?row=>`${row.postalCode}-${row.subdistrictCode}`:row=>row.subdistrictCode;
    return unique(rows,key).slice(0,10);
  }
  function applyAddress(row,source){
    const current=fields();
    if(source==='subdistrict'||source==='postalCode')current.subdistrict.value=row.subdistrictNameTh||'';
    if(source!=='province')current.district.value=row.districtNameTh||'';
    current.province.value=row.provinceNameTh||'';
    if(source==='subdistrict'||source==='postalCode')current.postalCode.value=String(row.postalCode||'');
    document.querySelectorAll('.address-suggestions').forEach(menu=>{menu.classList.remove('open');menu.innerHTML=''});
    Object.values(current).forEach(field=>{field?.setAttribute('aria-expanded','false');field?.dispatchEvent(new Event('change',{bubbles:true}))});
  }
  function label(row){return `<span><b>ตำบล${escape(row.subdistrictNameTh)}</b><small>อำเภอ${escape(row.districtNameTh)} · จังหวัด${escape(row.provinceNameTh)}</small></span><strong>${escape(row.postalCode)}</strong>`}
  function install(input){
    if(!input||input.dataset.thaiAddress)return;input.dataset.thaiAddress='true';input.setAttribute('aria-autocomplete','list');input.setAttribute('aria-expanded','false');
    const wrap=document.createElement('div');wrap.className='address-autocomplete thai-address-autocomplete';input.parentNode.insertBefore(wrap,input);wrap.append(input);
    const menu=document.createElement('div');menu.className='address-suggestions thai-address-suggestions';menu.setAttribute('role','listbox');wrap.append(menu);let rows=[],active=-1;
    const close=()=>{menu.classList.remove('open');menu.innerHTML='';input.setAttribute('aria-expanded','false');rows=[];active=-1};
    const choose=index=>{if(!rows[index])return;applyAddress(rows[index],input.name);close()};
    const render=async()=>{await dataReady;const query=clean(input.value);if(!query){close();return}rows=candidates(input.name,query);if(!rows.length){menu.innerHTML='<div class="address-no-result">ไม่พบตำบล/อำเภอในฐานข้อมูล</div>';menu.classList.add('open');return}active=-1;menu.innerHTML=rows.map((row,index)=>`<button type="button" role="option" data-index="${index}">${label(row)}</button>`).join('');menu.classList.add('open');input.setAttribute('aria-expanded','true');menu.querySelectorAll('button').forEach(button=>button.addEventListener('mousedown',event=>{event.preventDefault();choose(Number(button.dataset.index))}))};
    input.addEventListener('input',render);input.addEventListener('focus',()=>{if(input.value)render()});input.addEventListener('keydown',event=>{if(!rows.length)return;if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();active=(active+(event.key==='ArrowDown'?1:-1)+rows.length)%rows.length;menu.querySelectorAll('button').forEach((button,index)=>button.classList.toggle('active',index===active))}else if(event.key==='Enter'&&active>=0){event.preventDefault();choose(active)}else if(event.key==='Escape')close()});input.addEventListener('blur',()=>setTimeout(close,120));
  }
  const start=()=>fieldNames.forEach(name=>install(document.querySelector(`[name="${name}"]`)));document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start):start();
})();
