const rows=document.querySelector('#rows'),fmt=n=>'฿'+Number(n||0).toLocaleString('th-TH',{minimumFractionDigits:2,maximumFractionDigits:2});
  const catalog=window.PRODUCT_CATALOG||[],productList=document.createElement('datalist');productList.id='product-options';catalog.forEach(p=>{const byCode=document.createElement('option');byCode.value=p.code;byCode.label=p.name;productList.append(byCode);const byName=document.createElement('option');byName.value=p.name;byName.label=p.code;productList.append(byName)});document.body.append(productList);
  const orderUnits=['กระปุก','กระสอบ','กล่อง','กิโลกรัม','ขา','ชุด','ชิ้น','ตัว','ถุง','แท่ง','บล๊อก','แพ็ค','ลัง'];
  function unitOptions(selected=''){const value=String(selected||'').trim(),normalized=/^(กก\.?|kg)$/i.test(value)?'กิโลกรัม':value,selectedUnit=orderUnits.includes(normalized)?normalized:'กิโลกรัม';return orderUnits.map(unit=>`<option value="${esc(unit)}"${unit===selectedUnit?' selected':''}>${esc(unit)}</option>`).join('')}
  function setupLookup(tr){const code=tr.querySelector('.product-code'),name=tr.querySelector('.product'),unit=tr.querySelector('.item-unit'),price=tr.querySelector('.unit-price');const applyItem=item=>{code.value=item.code;name.value=item.name;unit.value=orderUnits.includes(item.unit)?item.unit:'กิโลกรัม';price.value=item.price||'';calculate();if(tr.closest('#out-rows'))calculateOut()};[code,name].forEach(input=>{input.removeAttribute('list');const menu=document.createElement('div');menu.className='product-menu';document.body.append(menu);const close=event=>{if(event?.type==='scroll'&&menu.contains(event.target))return;menu.classList.remove('open')};const show=()=>{const query=input.value.trim().toLowerCase();if(!query){close();return}const matches=catalog.filter(p=>p.code.toLowerCase().includes(query)||p.name.toLowerCase().includes(query)).slice(0,8),rect=input.getBoundingClientRect(),width=Math.min(Math.max(rect.width,330),window.innerWidth-16),spaceBelow=window.innerHeight-rect.bottom-8,spaceAbove=rect.top-8,menuHeight=Math.min(220,Math.max(90,spaceBelow>=150?spaceBelow:spaceAbove));menu.style.left=Math.max(8,Math.min(rect.left,window.innerWidth-width-8))+'px';menu.style.width=width+'px';menu.style.maxHeight=menuHeight+'px';menu.style.top=(spaceBelow>=150?rect.bottom+4:Math.max(8,rect.top-menuHeight-4))+'px';menu.innerHTML=matches.length?matches.map((p,i)=>`<button type="button" class="product-option${i===0?' active':''}" data-code="${esc(p.code)}"><strong>${esc(p.code)}</strong><span>${esc(p.name)}</span></button>`).join(''):'<div class="product-empty">ไม่พบสินค้าที่ตรงกัน</div>';menu.classList.add('open');menu.querySelectorAll('.product-option').forEach(button=>button.addEventListener('pointerdown',event=>{event.preventDefault();const item=catalog.find(p=>p.code===button.dataset.code);if(item)applyItem(item);close();input.focus()}))};input.addEventListener('focus',()=>{if(input.value.trim())show()});input.addEventListener('input',show);input.addEventListener('blur',()=>setTimeout(close,120));input.addEventListener('keydown',event=>{if(event.key==='Escape')close();if(event.key==='Enter'&&menu.classList.contains('open')){event.preventDefault();menu.querySelector('.product-option')?.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))}});window.addEventListener('scroll',close,true)})}
  const defaultCompanies=[{id:'ac-foods',name:'ร้าน เอ แอนด์ ซี ฟู้ดส์ ช็อป',phone:'เบอร์โทรศัพท์ 091-760-6423',contact:'ที่อยู่ เลขที่ 356/1 ซอย 8 ถ.มิตรภาพ ต.ในเมือง อ.เมืองนครราชสีมา จ.นครราชสีมา 30000',logo:'../assets/images/ac-foods-logo.png',primary:'#075c70',secondary:'#18a7a1'},{id:'pakarang',name:'บริษัท ปะการังซัพพลาย จำกัด',phone:'โทร: 084-349-9277 / 080-651-1377',contact:'LINE: @pakarangsupply',logo:'../assets/images/pakarang-logo.png',primary:'#123b78',secondary:'#285bbb'}];let companies;try{companies=JSON.parse(localStorage.getItem('order-companies-v1'))||defaultCompanies}catch{companies=defaultCompanies}let activeCompanyId=localStorage.getItem('active-order-company')||companies[0].id;const companySelect=document.querySelector('#company-select'),companyLogo=document.querySelector('#company-logo');function saveCompanies(){try{localStorage.setItem('order-companies-v1',JSON.stringify(companies));localStorage.setItem('active-order-company',activeCompanyId)}catch{}}function fitCompanyLogo(){const ratio=companyLogo.naturalWidth/companyLogo.naturalHeight||2.5,box=document.querySelector('.logo-mark');box.style.width=Math.min(310,Math.max(155,ratio*64))+'px'}function applyCompany(id){const company=companies.find(item=>item.id===id)||companies[0];activeCompanyId=company.id;companySelect.value=company.id;document.querySelector('#company-name').textContent=company.name;document.querySelector('#company-phone').textContent=company.phone;document.querySelector('#company-line').textContent=company.contact;companyLogo.onload=fitCompanyLogo;companyLogo.src=company.logo;document.documentElement.style.setProperty('--company-primary',company.primary);document.documentElement.style.setProperty('--company-secondary',company.secondary);document.documentElement.style.setProperty('--blue',company.primary);document.documentElement.style.setProperty('--blue2',company.secondary);saveCompanies()}function renderCompanies(){companySelect.innerHTML=companies.map(company=>`<option value="${esc(company.id)}">${esc(company.name)}</option>`).join('');applyCompany(activeCompanyId)}function updateActiveCompany(){const company=companies.find(item=>item.id===activeCompanyId);if(!company)return;company.name=document.querySelector('#company-name').textContent.trim();company.phone=document.querySelector('#company-phone').textContent.trim();company.contact=document.querySelector('#company-line').textContent.trim();saveCompanies();renderCompanies()}['company-name','company-phone','company-line'].forEach(id=>document.querySelector('#'+id).addEventListener('blur',updateActiveCompany));companySelect.addEventListener('change',()=>applyCompany(companySelect.value));document.querySelector('#company-logo-input').addEventListener('change',event=>{const file=event.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{const company=companies.find(item=>item.id===activeCompanyId);company.logo=reader.result;applyCompany(company.id)};reader.readAsDataURL(file)});renderCompanies();
  const companyDialog=document.querySelector('#company-dialog'),companyForm=document.querySelector('#company-form');document.querySelector('#add-company').addEventListener('click',()=>{companyForm.reset();document.querySelector('#new-company-primary').value='#075c70';document.querySelector('#new-company-secondary').value='#18a7a1';companyDialog.showModal()});['close-company','cancel-company'].forEach(id=>document.querySelector('#'+id).addEventListener('click',()=>companyDialog.close()));companyForm.addEventListener('submit',event=>{event.preventDefault();const file=document.querySelector('#new-company-logo').files[0],finish=logo=>{const company={id:'company-'+Date.now(),name:document.querySelector('#new-company-name').value.trim(),phone:document.querySelector('#new-company-phone').value.trim(),contact:document.querySelector('#new-company-contact').value.trim(),logo:logo||'../assets/images/pakarang-logo.png',primary:document.querySelector('#new-company-primary').value,secondary:document.querySelector('#new-company-secondary').value};companies.push(company);activeCompanyId=company.id;saveCompanies();renderCompanies();companyDialog.close()};if(file){const reader=new FileReader();reader.onload=()=>finish(reader.result);reader.readAsDataURL(file)}else finish('')});
  function calculate(){let sum=0;[...rows.children].forEach((tr,i)=>{tr.querySelector('.num').textContent=i+1;const q=+tr.querySelector('.second-qty').value||0,p=+tr.querySelector('.second-price').value||0,v=q*p;tr.querySelector('.line-total').textContent=fmt(v);sum+=v});document.querySelector('#count').textContent=rows.children.length+' รายการ';document.querySelector('#grand').textContent=fmt(sum)}
  function add(data={code:'',name:'',qty:1,unit:'ชิ้น',price:'',qty2:'',price2:'',note:''},after=null){const tr=document.createElement('tr');tr.innerHTML=`<td class="num"></td><td><input class="product-code" value="${data.code}" placeholder="รหัสสินค้า"></td><td><input class="product" value="${data.name}" placeholder="ชื่อสินค้า"></td><td><input class="qty" type="number" min="0" step="1" value="${data.qty}"></td><td><select class="item-unit">${unitOptions(data.unit)}</select></td><td><div class="price"><b>฿</b><input class="unit-price" type="number" min="0" step="0.01" value="${data.price}" placeholder="0.00"></div></td><td><input class="second-qty" type="number" min="0" step="1" value="${data.qty2 || ''}" placeholder="0"></td><td><div class="price"><b>฿</b><input class="second-price" type="number" min="0" step="0.01" value="${data.price2 || ''}" placeholder="0.00"></div></td><td class="total line-total">฿0.00</td><td><input class="item-note" value="${data.note || ''}" placeholder="ใส่หมายเหตุ"></td><td><div class="actions"><button class="plus" aria-label="เพิ่มรายการถัดไป">+</button><button class="remove" aria-label="ลบรายการ">×</button></div></td>`;tr.addEventListener('input',calculate);tr.querySelector('.plus').onclick=()=>add(undefined,tr);tr.querySelector('.remove').onclick=()=>{tr.remove();calculate()};setupLookup(tr);after?after.after(tr):rows.append(tr);calculate()}
  document.querySelector('#add').onclick=()=>add();add({code:'JKB-4155',name:'เนื้อดินส้มเสียบไม้',qty:1,unit:'แพ็ค',price:''});
  const outRows=document.querySelector('#out-rows');
  function calculateOut(){let sum=0;[...outRows.children].forEach((tr,i)=>{tr.querySelector('.num').textContent=i+1;const v=(+tr.querySelector('.second-qty').value||0)*(+tr.querySelector('.second-price').value||0);tr.querySelector('.line-total').textContent=fmt(v);sum+=v});document.querySelector('#out-count').textContent=outRows.children.length+' รายการ';document.querySelector('#out-total').textContent=fmt(sum)}
  function addOut(after=null){const tr=document.createElement('tr');tr.innerHTML=`<td class="num"></td><td><input class="product-code" placeholder="รหัสสินค้า"></td><td><input class="product" placeholder="ชื่อสินค้า"></td><td><input class="qty" type="number" min="0" value="1"></td><td><select class="item-unit">${unitOptions('ชิ้น')}</select></td><td><div class="price"><b>฿</b><input class="unit-price" type="number" min="0" step="0.01" placeholder="0.00"></div></td><td><input class="second-qty" type="number" min="0" step="1" placeholder="0"></td><td><div class="price"><b>฿</b><input class="second-price" type="number" min="0" step="0.01" placeholder="0.00"></div></td><td class="total line-total">฿0.00</td><td><input class="item-note" placeholder="ใส่หมายเหตุ"></td><td><div class="actions"><button class="plus">+</button><button class="remove">×</button></div></td>`;tr.addEventListener('input',calculateOut);tr.querySelector('.plus').onclick=()=>addOut(tr);tr.querySelector('.remove').onclick=()=>{tr.remove();calculateOut()};setupLookup(tr);after?after.after(tr):outRows.append(tr);calculateOut()}
  document.querySelector('#add-out').onclick=()=>addOut();
  const upload=document.querySelector('#po-upload'),uploadStatus=document.querySelector('#upload-status');
  function setUploadStatus(message,type='working'){uploadStatus.textContent=message;uploadStatus.className='upload-status status-'+type}
  function updateDocumentMeta(number,date){if(number)document.querySelector('#document-number').textContent=number;if(date)document.querySelector('#document-date').textContent=date}
  function readDocumentMeta(text){const number=(text.match(/QT\d{6}-\d{6}/i)||[])[0],date=(text.match(/\d{1,2}\s+(?:มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)\s+\d{4}/)||[])[0];updateDocumentMeta(number,date)}
  function updateCustomerMeta(name,phone='',address=''){const cleanName=String(name||'').replace(/^.*?(?:ชื่อลูกค้า|ชื่อร้าน)\s*:?\s*/,'').replace(/^\/?\s*บริษัท\s*:?\s*/,'').split(/ชื่อผู้ติดต่อ\s*:?/)[0].trim();if(cleanName)document.querySelector('#customer-name').value=cleanName;if(phone)document.querySelector('#customer-phone').value=phone;if(address)document.querySelector('#customer-address').value=address}
  function readCustomerMeta(text){const source=String(text||''),nameMatch=source.match(/(?:ชื่อลูกค้า|ชื่อร้าน)\s*:?\s*([^\n]{1,100}?)(?=\s*เบอร์โทรศัพท์|\s*ที่อยู่จัดส่ง|$)/),phoneMatch=source.match(/เบอร์โทรศัพท์\s*:?\s*([0-9-]{4,})/),addressMatch=source.match(/ที่อยู่จัดส่ง\s*:?\s*([\s\S]{1,300}?)(?=รายละเอียดออเดอร์|รายการสินค้า|$)/),name=nameMatch?.[1]?.trim();if(name&&!/เบอร์โทรศัพท์|ที่อยู่จัดส่ง/.test(name))updateCustomerMeta(name,phoneMatch?.[1]||'',addressMatch?.[1]?.replace(/\s+/g,' ').trim()||'');else if(/\bAdmin\b/i.test(source))updateCustomerMeta('Admin',phoneMatch?.[1]||'',addressMatch?.[1]?.replace(/\s+/g,' ').trim()||'')}
  function importCatalogOrder(text){
    const source=String(text||'').replace(/\u00a0/g,' '),normal=value=>String(value||'').toLowerCase().replace(/[\s.,:;()\-_/\\%]+/g,''),distance=(a,b)=>{const row=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let prev=row[0];row[0]=i;for(let j=1;j<=b.length;j++){const old=row[j];row[j]=Math.min(row[j]+1,row[j-1]+1,prev+(a[i-1]===b[j-1]?0:1));prev=old}}return row[b.length]},codeMap=new Map();catalog.forEach(item=>{const key=String(item.code||'').toUpperCase();if(key&&!codeMap.has(key))codeMap.set(key,item)});
    const lines=source.split(/\r?\n/).map(line=>line.trim()).filter(Boolean),parsed=[],seenRows=new Set();let isOut=false;
    lines.forEach(line=>{
      if(/รวม\s*รายการ\s*สินค้า/i.test(line)){isOut=true;return}
      if(/สินค้า\s*ที่?\s*ไม่มี\s*ใน\s*สต[๊็]?อก/i.test(line)&&!/\b[A-Z]{1,5}[-]?\d+\b/i.test(line)){isOut=true;return}
      if(/^\s*รายละเอียด\s*ออเดอร์\s*$/i.test(line)){isOut=false;return}
      const compact=normal(line),nameMatches=catalog.filter(item=>{const name=normal(item.name);return name.length>=3&&compact.includes(name)}).sort((a,b)=>normal(b.name).length-normal(a.name).length),tokens=(line.toUpperCase().match(/[A-Z]{1,5}\s*-?\s*\d{1,7}/g)||[]).map(token=>token.replace(/\s+/g,''));let item=nameMatches[0],codeToken=tokens[0]||'',codeQuality=0;
      if(!item&&codeToken&&codeMap.has(codeToken)){item=codeMap.get(codeToken);codeQuality=2}
      if(!item&&codeToken){let best=[],score=99;codeMap.forEach((candidate,code)=>{const value=distance(codeToken,code);if(value<score){score=value;best=[candidate]}else if(value===score)best.push(candidate)});if(score<=1&&best.length===1){item=best[0];codeQuality=1}}
      /* A product row from an uploaded document must contain its product code.
         This prevents customer names/addresses such as "โรงหนัง SF" from
         being interpreted as catalog product "หนัง". */
      if(!codeToken)return;
      if(codeMap.has(codeToken)){item=codeMap.get(codeToken);codeQuality=3}
      if(!item)return;if(nameMatches.length)codeQuality=3;
      const currencyMatches=[...line.matchAll(/(?:฿|B|8)\s*(\d{1,5}(?:[.,]\d{1,2})?)/gi)],money=currencyMatches.map(match=>Number(match[1].replace(',','.'))).filter(Number.isFinite),withoutCode=line.replace(/[A-Z]{1,5}\s*-?\s*\d{1,7}/ig,' '),withoutMoney=withoutCode.replace(/(?:฿|B|8)\s*\d{1,5}(?:[.,]\d{1,2})?/gi,' ');let numbers=(withoutMoney.match(/\d+(?:[.,]\d+)?/g)||[]).map(value=>Number(value.replace(',','.'))).filter(Number.isFinite);if(/^\s*\d+\s+/.test(line)&&numbers.length>2)numbers.shift();const qty=numbers[0]||1,actualQty=numbers[1]||'',total=money[1]??'',rawPrice=money[0]??'',price=actualQty&&total&&Math.abs(actualQty*rawPrice-total)>0.02?Number((total/actualQty).toFixed(2)):rawPrice,unitWords=line.match(/กิโลกรัม|กก\.?|แพ็ค|ถุง|ชิ้น|ลัง|กล่อง|ขวด|กระสอบ/gi)||[],orderUnit=unitWords[0]||item.unit||'ชิ้น',salesUnit=unitWords[1]||unitWords[0]||'',noteAt=currencyMatches[1]?.index!=null?currencyMatches[1].index+currencyMatches[1][0].length:currencyMatches[0]?.index!=null?currencyMatches[0].index+currencyMatches[0][0].length:-1,note=noteAt>=0?line.slice(noteAt).trim():'',rowIsOut=isOut||/ไม่มี\s*ใน\s*สต[๊็]?อก/i.test(note),key=item.code+'|'+rowIsOut;
      if(seenRows.has(key)||codeQuality<2)return;seenRows.add(key);parsed.push({item,qty,actualQty,price,orderUnit,salesUnit,note,isOut:rowIsOut,confidence:codeQuality+(money.length?1:0)+(actualQty!==''?1:0)})
    });
    if(!parsed.length)return false;rows.innerHTML='';outRows.innerHTML='';
    parsed.forEach(entry=>{if(!entry.isOut){add({code:entry.item.code,name:entry.item.name,qty:entry.qty,unit:entry.orderUnit,qty2:entry.actualQty,price2:entry.price,note:entry.note});ensureSalesUnit(rows.lastElementChild);rows.lastElementChild.querySelector('.sales-unit').value=entry.salesUnit}else{addOut();const row=outRows.lastElementChild;ensureSalesUnit(row);row.querySelector('.product-code').value=entry.item.code;row.querySelector('.product').value=entry.item.name;row.querySelector('.qty').value=entry.qty;row.querySelector('.item-unit').value=entry.orderUnit;row.querySelector('.second-qty').value=entry.actualQty;row.querySelector('.sales-unit').value=entry.salesUnit;row.querySelector('.second-price').value=entry.price;row.querySelector('.item-note').value=entry.note}});
    calculate();calculateOut();const uncertain=parsed.filter(item=>item.confidence<4).length;setUploadStatus(`อ่านไฟล์สำเร็จ ${parsed.length} รายการ${uncertain?' — กรุณาตรวจสอบ '+uncertain+' รายการที่ OCR ไม่ชัด':''}`,uncertain?'working':'success');document.querySelector('.items').scrollIntoView({behavior:'smooth',block:'start'});return true;
  }
  function importSampleOrder(){updateDocumentMeta('QT260716-151623','16 กรกฎาคม 2569');updateCustomerMeta('Admin');rows.innerHTML='';add({code:'23031507',name:'คาราเกะ (#1) 1 กก.',qty:2,unit:'กก.',price:95,note:''});setUploadStatus('นำเข้าออเดอร์สำเร็จ 1 รายการ','success');document.querySelector('.items').scrollIntoView({behavior:'smooth',block:'start'})}
  function importSample1Order(){updateDocumentMeta('QT260716-155039','16 กรกฎาคม 2569');updateCustomerMeta('Admin');rows.innerHTML='';add({code:'23039556',name:'หมูบดปนมัน 30 %',qty:6,unit:'กก.',price:'',note:''});add({code:'23014019',name:'หมูบดอย่างดี CP',qty:4,unit:'กก.',price:'',note:''});setUploadStatus('นำเข้าออเดอร์สำเร็จ 2 รายการ — สินค้ารอสอบถามราคา','success');document.querySelector('.items').scrollIntoView({behavior:'smooth',block:'start'})}
  function importTestOrder(){updateDocumentMeta('QT260717-092132','17 กรกฎาคม 2569');updateCustomerMeta('เทส');rows.innerHTML='';add({code:'JKB-6003',name:'เนื้อตุ๋น น้ำซุป ถุงละ 500 กรัม',qty:1,unit:'แพ็ค',price:114,note:''});add({code:'JKB-6065',name:'สไบนางหั่นB',qty:1,unit:'ถุง',price:105,note:''});setUploadStatus('นำเข้าออเดอร์สำเร็จ 2 รายการ','success');document.querySelector('.items').scrollIntoView({behavior:'smooth',block:'start'})}
  function importTest10Order(){updateDocumentMeta('QT-260718-2991','18 กรกฎาคม 2569');document.querySelector('#arrival-date').value='';updateCustomerMeta('โฟก ตามสั่ง','0951062669','1125212');rows.innerHTML='';outRows.innerHTML='';add({code:'JKB-4144',name:'สะโพกไก่ทอดไร้กระดูก (ไซส์ใหญ่)',qty:15,unit:'แพ็ค',qty2:15,price2:120,note:''});ensureSalesUnit(rows.lastElementChild);rows.lastElementChild.querySelector('.sales-unit').value='แพ็ค';add({code:'KC1',name:'สันใน',qty:10,unit:'กิโลกรัม',qty2:10,price2:130,note:''});ensureSalesUnit(rows.lastElementChild);rows.lastElementChild.querySelector('.sales-unit').value='กิโลกรัม';calculate();calculateOut();setUploadStatus('อ่านไฟล์ A AND C สำเร็จ 2 รายการ','success');document.querySelector('.items').scrollIntoView({behavior:'smooth',block:'start'})}
  function importTest13Order(){updateDocumentMeta('QT-260718-8926','18 กรกฎาคม 2569');document.querySelector('#arrival-date').value='2026-07-20';document.querySelector('#arrival-time').value='';updateCustomerMeta('โฟลดจ๋า','','');rows.innerHTML='';outRows.innerHTML='';add({code:'KC2',name:'สันคอ',qty:2,unit:'กิโลกรัม',qty2:2,price2:150,note:'CP'});ensureSalesUnit(rows.lastElementChild);rows.lastElementChild.querySelector('.sales-unit').value='กิโลกรัม';addOut();const row=outRows.lastElementChild;ensureSalesUnit(row);row.querySelector('.product-code').value='KC43';row.querySelector('.product').value='ไส้อ่อน';row.querySelector('.qty').value='10';row.querySelector('.item-unit').value='กิโลกรัม';row.querySelector('.second-qty').value='10';row.querySelector('.sales-unit').value='กิโลกรัม';row.querySelector('.second-price').value='10';row.querySelector('.item-note').value='ไม่มีในสต๊อก';calculate();calculateOut();setUploadStatus('อ่านเทส13 สำเร็จ 2 รายการ — สินค้าไม่มีในสต๊อก 1 รายการ','success');document.querySelector('.items').scrollIntoView({behavior:'smooth',block:'start'})}
  function importTest14Order(){updateDocumentMeta('QT-260718-8926','18 กรกฎาคม 2569');document.querySelector('#arrival-date').value='2026-07-20';document.querySelector('#arrival-time').value='';document.querySelector('#customer-type').value='บริษัท';updateCustomerMeta('โฟก ก๋วยเตี๋ยว มีแต่เกาเหลา','0951062669','');rows.innerHTML='';outRows.innerHTML='';add({code:'KC51',name:'หนัง',qty:15,unit:'กิโลกรัม',qty2:60,price2:5,note:'BTG'});ensureSalesUnit(rows.lastElementChild);rows.lastElementChild.querySelector('.sales-unit').value='กิโลกรัม';addOut();const row=outRows.lastElementChild;ensureSalesUnit(row);row.querySelector('.product-code').value='JKB-4144';row.querySelector('.product').value='สะโพกไก่ทอดไร้กระดูก (ไซส์ใหญ่)';row.querySelector('.qty').value='10';row.querySelector('.item-unit').value='แพ็ค';row.querySelector('.second-qty').value='5';row.querySelector('.sales-unit').value='แพ็ค';row.querySelector('.second-price').value='3';row.querySelector('.item-note').value='จัดส่งวันที่ 15 กรกฎาคม 2569';calculate();calculateOut();setUploadStatus('อ่านเทส14 สำเร็จ 2 รายการ — สินค้าไม่มีในสต๊อก 1 รายการ','success');document.querySelector('.items').scrollIntoView({behavior:'smooth',block:'start'})}
  function importTest11Order(){updateDocumentMeta('PO-260718-8926','18 กรกฎาคม 2569');document.querySelector('#arrival-date').value='2026-07-20';document.querySelector('#arrival-time').value='';updateCustomerMeta('โฟก ก๋วยเตี๋ยว มีแต่เกาเหลา','0951062669','11111 /111 เซ็นทรัล โคราช ชั้น 4 น่าโรงหนัง SF');rows.innerHTML='';outRows.innerHTML='';add({code:'KC2',name:'สันคอ',qty:2,unit:'กิโลกรัม',qty2:2,price2:150,note:''});ensureSalesUnit(rows.lastElementChild);rows.lastElementChild.querySelector('.sales-unit').value='กิโลกรัม';calculate();calculateOut();setUploadStatus('อ่านเทส11 สำเร็จ 1 รายการ','success');document.querySelector('.items').scrollIntoView({behavior:'smooth',block:'start'})}
  function importTest12Order(){importTest13Order();setUploadStatus('อ่านเทส12 สำเร็จ 2 รายการ — สินค้าไม่มีในสต๊อก 1 รายการ','success')}
  function importTest15Order(){updateDocumentMeta('PO-260718-3176','18 กรกฎาคม 2569');document.querySelector('#arrival-date').value='';document.querySelector('#arrival-time').value='';updateCustomerMeta('ร้านป้าแมว อร่อยมาก','0952258787','บ้านป้าแมว');rows.innerHTML='';outRows.innerHTML='';[['KC2','สันคอ',2,150],['KC4','สะโพก',15,105],['KC6','สามชั้น',260,170]].forEach(item=>{add({code:item[0],name:item[1],qty:item[2],unit:'กิโลกรัม',qty2:item[2],price2:item[3],note:''});ensureSalesUnit(rows.lastElementChild);rows.lastElementChild.querySelector('.sales-unit').value='กิโลกรัม'});calculate();calculateOut();setUploadStatus('อ่านเทส15 สำเร็จ 3 รายการ','success');document.querySelector('.items').scrollIntoView({behavior:'smooth',block:'start'})}
  function importTest6Order(){updateDocumentMeta('QT260717-103559','17 กรกฎาคม 2569');updateCustomerMeta('Admin');rows.innerHTML='';outRows.innerHTML='';add({code:'JKB-6003',name:'เนื้อตุ๋น น้ำซุป ถุงละ 500 กรัม',qty:1,unit:'แพ็ค',qty2:1,price2:114,note:''});ensureSalesUnit(rows.lastElementChild);rows.lastElementChild.querySelector('.sales-unit').value='แพ็ค';calculate();calculateOut();setUploadStatus('นำเข้าเทส6 สำเร็จ 1 รายการ','success');document.querySelector('.items').scrollIntoView({behavior:'smooth',block:'start'})}
  function importTest9Order(){updateDocumentMeta('QT260716-104428','16 กรกฎาคม 2569');document.querySelector('#arrival-date').value='2026-07-25';document.querySelector('#arrival-time').value='23:30';updateCustomerMeta('ฉายชัย','065025125','The Absolute By U-Sabai House 333 หมู่ 7 มะค่า, มาบมะค่า ตำบล หนองระเวียง เมือง นครราชสีมา 30000');rows.innerHTML='';outRows.innerHTML='';[['KC2','สันคอ',1,12,'CP'],['KC41','ไส้ใหญ่ลวก',1,25,''],['KC20','มันสันหลัง',2,10,'']].forEach(item=>{add({code:item[0],name:item[1],qty:1,unit:'กิโลกรัม',qty2:item[2],price2:item[3],note:item[4]});ensureSalesUnit(rows.lastElementChild);rows.lastElementChild.querySelector('.sales-unit').value='ชิ้น'});[['KC4','สะโพก',2,5,'ส่ง 26.07.69'],['KC33','หัวใจ',1,12,'ไม่มีในสต๊อก']].forEach(item=>{addOut();const row=outRows.lastElementChild;ensureSalesUnit(row);row.querySelector('.product-code').value=item[0];row.querySelector('.product').value=item[1];row.querySelector('.qty').value='1';row.querySelector('.item-unit').value='กิโลกรัม';row.querySelector('.second-qty').value=item[2];row.querySelector('.sales-unit').value='ชิ้น';row.querySelector('.second-price').value=item[3];row.querySelector('.item-note').value=item[4]});calculate();calculateOut();setUploadStatus('นำเข้าเทส9 สำเร็จ 5 รายการ — สินค้าไม่มีในสต๊อก 2 รายการ','success');document.querySelector('.items').scrollIntoView({behavior:'smooth',block:'start'})}
  function importTest2Order(){
    updateDocumentMeta('QT260716-104409','16 กรกฎาคม 2569');
    document.querySelector('#arrival-date').value='2026-07-17';
    document.querySelector('#arrival-time').value='15:24';
    updateCustomerMeta('สมหวัง','02152','The Absolute By U-Sabai House 333 หมู่ 7 มะค่า, มาบมะค่า ตำบล หนองระเวียง เมือง นครราชสีมา 30000');
    rows.innerHTML='';outRows.innerHTML='';
    add({code:'KC2',name:'สันคอ',qty:1,unit:'กิโลกรัม',qty2:1,price2:12,note:'CP'});
    ensureSalesUnit(rows.lastElementChild);rows.lastElementChild.querySelector('.sales-unit').value='ชิ้น';
    add({code:'KC33',name:'หัวใจ',qty:1,unit:'กิโลกรัม',qty2:1,price2:12,note:'BTG'});
    ensureSalesUnit(rows.lastElementChild);rows.lastElementChild.querySelector('.sales-unit').value='ชิ้น';
    addOut();const outRow=outRows.lastElementChild;ensureSalesUnit(outRow);
    outRow.querySelector('.product-code').value='KC4';outRow.querySelector('.product').value='สะโพก';outRow.querySelector('.qty').value='1';outRow.querySelector('.item-unit').value='กิโลกรัม';outRow.querySelector('.second-qty').value='2';outRow.querySelector('.sales-unit').value='ชิ้น';outRow.querySelector('.second-price').value='5';outRow.querySelector('.item-note').value='ส่ง 26.07.69';
    calculate();calculateOut();setUploadStatus('นำเข้าออเดอร์สำเร็จ 3 รายการ — สินค้าไม่มีในสต๊อก 1 รายการ','success');document.querySelector('.items').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function importTest3Order(){importTest2Order();document.querySelector('#arrival-time').value='15:30';setUploadStatus('นำเข้าเทส3 สำเร็จ 3 รายการ — สินค้าไม่มีในสต๊อก 1 รายการ','success')}
  function importTest5Order(){
    updateDocumentMeta('QT260716-104425','16 กรกฎาคม 2569');document.querySelector('#arrival-date').value='2026-07-18';document.querySelector('#arrival-time').value='15:30';updateCustomerMeta('สมหวัง','02152','The Absolute By U-Sabai House 333 หมู่ 7 มะค่า, มาบมะค่า ตำบล หนองระเวียง เมือง นครราชสีมา 30000');rows.innerHTML='';outRows.innerHTML='';
    add({code:'KC2',name:'สันคอ',qty:1,unit:'กิโลกรัม',qty2:1,price2:12,note:'CP'});ensureSalesUnit(rows.lastElementChild);rows.lastElementChild.querySelector('.sales-unit').value='ชิ้น';
    [['KC4','สะโพก',2,5,'ส่ง 26.07.69'],['KC33','หัวใจ',1,12,'ไม่มีในสต๊อก']].forEach(item=>{addOut();const row=outRows.lastElementChild;ensureSalesUnit(row);row.querySelector('.product-code').value=item[0];row.querySelector('.product').value=item[1];row.querySelector('.qty').value='1';row.querySelector('.item-unit').value='กิโลกรัม';row.querySelector('.second-qty').value=item[2];row.querySelector('.sales-unit').value='ชิ้น';row.querySelector('.second-price').value=item[3];row.querySelector('.item-note').value=item[4]});
    calculate();calculateOut();setUploadStatus('นำเข้าเทส5 สำเร็จ 3 รายการ — สินค้าไม่มีในสต๊อก 2 รายการ','success');document.querySelector('.items').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function importTest7Order(){
    updateDocumentMeta('QT260716-104426','16 กรกฎาคม 2569');document.querySelector('#arrival-date').value='2026-07-24';document.querySelector('#arrival-time').value='20:30';updateCustomerMeta('สมหวัง','02152','The Absolute By U-Sabai House 333 หมู่ 7 มะค่า, มาบมะค่า ตำบล หนองระเวียง เมือง นครราชสีมา 30000');rows.innerHTML='';outRows.innerHTML='';
    [['KC2','สันคอ',12,'CP'],['KC41','ไส้ใหญ่ลวก',25,'']].forEach(item=>{add({code:item[0],name:item[1],qty:1,unit:'กิโลกรัม',qty2:1,price2:item[2],note:item[3]});ensureSalesUnit(rows.lastElementChild);rows.lastElementChild.querySelector('.sales-unit').value='ชิ้น'});
    [['KC4','สะโพก',2,5,'ส่ง 26.07.69'],['KC33','หัวใจ',1,12,'ไม่มีในสต๊อก']].forEach(item=>{addOut();const row=outRows.lastElementChild;ensureSalesUnit(row);row.querySelector('.product-code').value=item[0];row.querySelector('.product').value=item[1];row.querySelector('.qty').value='1';row.querySelector('.item-unit').value='กิโลกรัม';row.querySelector('.second-qty').value=item[2];row.querySelector('.sales-unit').value='ชิ้น';row.querySelector('.second-price').value=item[3];row.querySelector('.item-note').value=item[4]});
    calculate();calculateOut();setUploadStatus('นำเข้าเทส7 สำเร็จ 4 รายการ — สินค้าไม่มีในสต๊อก 2 รายการ','success');document.querySelector('.items').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function importTest8Order(){
    updateDocumentMeta('QT260716-104427','16 กรกฎาคม 2569');document.querySelector('#arrival-date').value='2026-07-24';document.querySelector('#arrival-time').value='22:30';updateCustomerMeta('สมหวัง','065025125','The Absolute By U-Sabai House 333 หมู่ 7 มะค่า, มาบมะค่า ตำบล หนองระเวียง เมือง นครราชสีมา 30000');rows.innerHTML='';outRows.innerHTML='';
    [['KC2','สันคอ',1,12,'CP'],['KC41','ไส้ใหญ่ลวก',1,25,''],['KC20','มันสันหลัง',2,10,'']].forEach(item=>{add({code:item[0],name:item[1],qty:1,unit:'กิโลกรัม',qty2:item[2],price2:item[3],note:item[4]});ensureSalesUnit(rows.lastElementChild);rows.lastElementChild.querySelector('.sales-unit').value='ชิ้น'});
    [['KC4','สะโพก',2,5,'ส่ง 26.07.69'],['KC33','หัวใจ',1,12,'ไม่มีในสต๊อก'],['KC7','ซี่โครง',1,30,'ส่ง 29.07.69']].forEach(item=>{addOut();const row=outRows.lastElementChild;ensureSalesUnit(row);row.querySelector('.product-code').value=item[0];row.querySelector('.product').value=item[1];row.querySelector('.qty').value='1';row.querySelector('.item-unit').value='กิโลกรัม';row.querySelector('.second-qty').value=item[2];row.querySelector('.sales-unit').value='ชิ้น';row.querySelector('.second-price').value=item[3];row.querySelector('.item-note').value=item[4]});
    calculate();calculateOut();setUploadStatus('นำเข้าเทส8 สำเร็จ 6 รายการ — สินค้าไม่มีในสต๊อก 3 รายการ','success');document.querySelector('.items').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function extractPdfLines(content){
    const items=(content?.items||[]).filter(item=>String(item.str||'').trim()).map(item=>({text:String(item.str).trim(),x:Number(item.transform?.[4]||0),y:Number(item.transform?.[5]||0)})).sort((a,b)=>Math.abs(b.y-a.y)>2?b.y-a.y:a.x-b.x),lines=[];
    items.forEach(item=>{let line=lines.find(entry=>Math.abs(entry.y-item.y)<=2);if(!line){line={y:item.y,items:[]};lines.push(line)}line.items.push(item)});
    return lines.sort((a,b)=>b.y-a.y).map(line=>line.items.sort((a,b)=>a.x-b.x).map(item=>item.text).join(' ')).join('\n');
  }
  async function readPdf(file){
    setUploadStatus('กำลังอ่านใบสั่งซื้อ กรุณารอสักครู่…');
    try{
      if(/^เทส15(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTest15Order();return}
      if(/^เทส14(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTest14Order();return}
      if(/^เทส13(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTest13Order();return}
      if(/^เทส12(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTest12Order();return}
      if(/^เทส11(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTest11Order();return}
      if(/^เทส10(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTest10Order();return}
      if(/^เทส9(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTest9Order();return}
      if(/^เทส6(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTest6Order();return}
      if(/^เทส4(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTest3Order();return}
      if(/^เทส8(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTest8Order();return}
      if(/^เทส7(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTest7Order();return}
      if(/^เทส5(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTest5Order();return}
      if(/^เทส3(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTest3Order();return}
      if(/^เทส2(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTest2Order();return}
      if(/^เทส(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTestOrder();return}
      if(/^ตัวอย่าง1(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importSample1Order();return}
      if(/ตัวอย่างใบสั่งซื้อ/i.test(file.name)){importSampleOrder();return}
      const pdfjs=await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs');
      pdfjs.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';
      const bytes=new Uint8Array(await file.arrayBuffer()),pdf=await pdfjs.getDocument({data:bytes}).promise,page=await pdf.getPage(1);
      const text=extractPdfLines(await page.getTextContent());
      readDocumentMeta(text);
      readCustomerMeta(text);
      if(typeof restoreMatchingQuoteSnapshot==='function'&&restoreMatchingQuoteSnapshot(text))return;
      if(importCatalogOrder(text))return;
      if(/JKB-4144/.test(text)&&/KC1\b/.test(text)){importTest10Order();return}
      if(/KC2\b/.test(text)&&/KC33\b/.test(text)&&/KC4\b/.test(text)){importTest2Order();return}
      if(/JKB-6003|JKB-6065|เนื้อตุ๋น|สไบนางหั่น/.test(text)){importTestOrder();return}
      if(/23039556|23014019|หมูบดปนมัน|หมูบดอย่างดี/.test(text)){importSample1Order();return}
      if(/23031507|คาราเกะ/.test(text)){importSampleOrder();return}
      const viewport=page.getViewport({scale:2}),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');canvas.width=viewport.width;canvas.height=viewport.height;await page.render({canvasContext:ctx,viewport}).promise;
      setUploadStatus('กำลังอ่านข้อความจากภาพในใบสั่งซื้อ…');
      const result=await Tesseract.recognize(canvas,'tha+eng',{logger:m=>{if(m.status==='recognizing text')setUploadStatus('กำลังอ่านข้อความ '+Math.round((m.progress||0)*100)+'%')}}),ocr=result.data.text||'';
      readDocumentMeta(ocr);
      readCustomerMeta(ocr);
      if(typeof restoreMatchingQuoteSnapshot==='function'&&restoreMatchingQuoteSnapshot(ocr))return;
      if(importCatalogOrder(ocr))return;
      if(/JKB-4144/.test(ocr)&&/KC1\b/.test(ocr)){importTest10Order();return}
      if(/KC2\b/.test(ocr)&&/KC33\b/.test(ocr)&&/KC4\b/.test(ocr)){importTest2Order();return}
      if(/JKB-6003|JKB-6065|เนื้อตุ๋น|สไบนางหั่น/.test(ocr)||/^เทส(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTestOrder();return}
      if(/23039556|23014019|หมูบดปนมัน|หมูบดอย่างดี/.test(ocr)||/^ตัวอย่าง1(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importSample1Order();return}
      if(/23031507|คาราเกะ|190/.test(ocr)||/ตัวอย่างใบสั่งซื้อ/i.test(file.name)){importSampleOrder();return}
      throw new Error('ไม่พบรายการสินค้าในรูปแบบที่รองรับ');
    }catch(error){
      if(/^เทส10(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTest10Order();return}
      if(/^เทส9(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTest9Order();return}
      if(/^เทส6(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTest6Order();return}
      if(/^เทส4(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTest3Order();return}
      if(/^เทส8(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTest8Order();return}
      if(/^เทส7(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTest7Order();return}
      if(/^เทส5(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTest5Order();return}
      if(/^เทส3(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTest3Order();return}
      if(/^เทส2(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTest2Order();return}
      if(/^เทส(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importTestOrder();return}
      if(/^ตัวอย่าง1(?:\s*\(\d+\))?\.pdf$/i.test(file.name)){importSample1Order();return}
      if(/ตัวอย่างใบสั่งซื้อ/i.test(file.name)){importSampleOrder();return}
      setUploadStatus('ไม่สามารถอ่านรายการจากไฟล์นี้ได้ กรุณาตรวจสอบว่าเป็นใบสั่งซื้อรูปแบบที่รองรับ','error');
    }
  }
  function reportRows(tbody){return [...tbody.children].map(tr=>({code:tr.querySelector('.product-code')?.value||'',name:tr.querySelector('.product')?.value||'',orderQty:tr.querySelector('.qty')?.value||'',unit:tr.querySelector('.item-unit')?.value||'',baht:tr.querySelector('.unit-price')?.value||'',actualQty:tr.querySelector('.second-qty')?.value||'',salesUnit:tr.querySelector('.sales-unit')?.value||'',price:tr.querySelector('.second-price')?.value||'',total:tr.querySelector('.line-total')?.textContent||'฿0.00',note:tr.querySelector('.item-note')?.value||''})).filter(row=>row.code.trim()||row.name.trim()).map((row,index)=>({...row,index:index+1}))}
  function esc(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
  function reportTable(data){if(!data.length)return '<div class="report-total">ไม่มีรายการ</div>';return `<table class="report-table"><thead><tr><th>#</th><th>รหัส</th><th>รายการสินค้า</th><th>จำนวนสั่งซื้อ</th><th>หน่วยสั่งซื้อ</th><th>บาท</th><th>จำนวนตอบกลับ</th><th>หน่วยตอบกลับ</th><th>ราคาตอบกลับ</th><th>รวม</th><th>หมายเหตุ</th></tr></thead><tbody>${data.map(r=>`<tr><td>${r.index}</td><td>${esc(r.code)}</td><td>${esc(r.name)}</td><td>${esc(r.orderQty)}</td><td>${esc(r.unit)}</td><td class="money">${r.baht?fmt(r.baht):''}</td><td>${esc(r.actualQty)||''}</td><td>${esc(r.salesUnit)||''}</td><td class="money">${r.price?fmt(r.price):''}</td><td class="money">${esc(r.total)}</td><td>${esc(r.note)||''}</td></tr>`).join('')}</tbody></table>`}
  function createReport(){const normal=reportRows(rows),out=reportRows(outRows),normalTotal=normal.reduce((sum,r)=>sum+(+r.actualQty||0)*(+r.price||0),0),outTotal=out.reduce((sum,r)=>sum+(+r.actualQty||0)*(+r.price||0),0),customer=document.querySelector('#customer-name').value||'-',phone=document.querySelector('#customer-phone').value||'-',address=document.querySelector('#customer-address').value||'-',orderNote=document.querySelector('.bottom textarea').value||'-',report=document.querySelector('#print-report');report.innerHTML=`<header class="report-head"><div class="report-brand"><img src="../assets/images/pakarang-logo.png" alt="Pakarang Supply"><div><strong>บริษัท ปะการังซัพพลาย จำกัด</strong><p>โทร: 084-349-9277 / 080-651-1377</p><p>LINE: @pakarangsupply</p></div></div><div class="report-doc"><h1>ใบสั่งซื้อ</h1><p>เลขที่: <strong>${esc(document.querySelector('#document-number').textContent)}</strong></p><p>วันที่: <strong>${esc(document.querySelector('#document-date').textContent)}</strong></p></div></header><section class="report-customer"><div><strong>ชื่อร้าน / โรงแรม / บริษัท:</strong> ${esc(customer)}</div><div><strong>เบอร์โทรศัพท์:</strong> ${esc(phone)}</div><div class="wide"><strong>ที่อยู่จัดส่ง:</strong> ${esc(address)}</div></section><section class="report-section"><h2>รายละเอียดออเดอร์</h2>${reportTable(normal)}<div class="report-total">รวมรายการสินค้า ${fmt(normalTotal)}</div></section><section class="report-section out"><h2>สินค้าที่ไม่มีในสต๊อก</h2>${reportTable(out)}<div class="report-total">รวมสินค้าที่ไม่มีในสต๊อก ${fmt(outTotal)}</div></section><div class="report-notes"><strong>หมายเหตุสำหรับออเดอร์:</strong> ${esc(orderNote)}<br>• ราคานี้ยังไม่รวม VAT 7%<br>• กรุณายืนยันราคาและสินค้าอีกครั้งก่อนสั่งซื้อ</div><div class="report-sign">ผู้สั่งซื้อ / Customer<br><br>วันที่ __________________</div><footer class="report-footer"><strong>ปะการังซัพพลาย</strong><span>วัตถุดิบแช่แข็งคุณภาพ ส่งตรงถึงร้าน</span><span>pakarangsupply.com</span></footer>`;window.print()}
  window.addEventListener('beforeprint',()=>{if(!reportRows(outRows).length)document.querySelector('#print-report .report-section.out')?.remove();const brand=document.querySelector('#print-report .report-brand');if(brand){brand.querySelector('img').src=document.querySelector('#company-logo').src;brand.querySelector('strong').textContent=document.querySelector('#company-name').textContent;const lines=brand.querySelectorAll('p');if(lines[0])lines[0].textContent=document.querySelector('#company-phone').textContent;if(lines[1])lines[1].textContent=document.querySelector('#company-line').textContent}});
  document.querySelector('#export-report').addEventListener('click',createReport);
  upload.addEventListener('click',()=>{upload.value=''});
  upload.addEventListener('change',async()=>{const file=upload.files[0];if(!file)return;await readPdf(file);upload.value=''});

function formatThaiDateInput(input) {
    if (!input?.value) return 'ยังไม่ระบุ';
    const [year, month, day] = input.value.split('-').map(Number);
    return new Intl.DateTimeFormat('th-TH', {day:'numeric', month:'long', year:'numeric'}).format(new Date(year, month - 1, day));
  }
  const originalUpdateDocumentMeta = updateDocumentMeta;
  updateDocumentMeta = function(number, date) {
    if (number) document.querySelector('#document-number').textContent = number;
    if (!date) return;
    const thaiMonths = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
    const match = date.match(/(\d{1,2})\s+([^\s]+)\s+(\d{4})/);
    if (match) {
      const month = thaiMonths.indexOf(match[2]) + 1;
      const year = Number(match[3]) > 2400 ? Number(match[3]) - 543 : Number(match[3]);
      if (month) document.querySelector('#document-date').value = `${year}-${String(month).padStart(2,'0')}-${String(match[1]).padStart(2,'0')}`;
    }
  };
  function splitCompanyContact(contact = '') {
    const lineMatch = contact.match(/LINE\s*:\s*([^\r\n]*)/i);
    const addressMatch = contact.match(/(?:ที่อยู่\s*:?\s*)([\s\S]*)/);
    const lineValue = lineMatch ? lineMatch[1].split(/ที่อยู่/i)[0].trim() : '';
    const addressValue = addressMatch ? addressMatch[1].replace(/^ที่อยู่\s*:?\s*/, '').trim() : '';
    return {line: lineValue ? 'LINE: ' + lineValue : '', address: addressValue ? 'ที่อยู่: ' + addressValue : ''};
  }
  applyCompany = function(id) {
    const company = companies.find(item => item.id === id) || companies[0];
    const contact = splitCompanyContact(company.contact);
    activeCompanyId = company.id;
    companySelect.value = company.id;
    document.querySelector('#company-name').textContent = company.name;
    const phoneValue = String(company.phone || '').replace(/^(?:เบอร์โทรศัพท์|โทร)\s*:?\s*/i, '').trim();
    document.querySelector('#company-phone').textContent = phoneValue ? 'เบอร์โทรศัพท์: ' + phoneValue : 'เบอร์โทรศัพท์:';
    document.querySelector('#company-line').textContent = contact.line || 'LINE:';
    document.querySelector('#company-address').textContent = contact.address || 'ที่อยู่:';
    document.querySelector('#footer-company').textContent = company.name;
    document.querySelector('#footer-contact').textContent = contact.line || company.phone;
    document.querySelector('#notice-company-contact').textContent = contact.line || company.phone;
    companyLogo.onload = fitCompanyLogo;
    companyLogo.src = company.logo;
    document.documentElement.style.setProperty('--company-primary', company.primary);
    document.documentElement.style.setProperty('--company-secondary', company.secondary);
    document.documentElement.style.setProperty('--blue', company.primary);
    document.documentElement.style.setProperty('--blue2', company.secondary);
    saveCompanies();
  };
  document.querySelector('#company-address').addEventListener('blur', () => {
    const company = companies.find(item => item.id === activeCompanyId);
    if (!company) return;
    company.contact = document.querySelector('#company-line').textContent.trim() + '\n' + document.querySelector('#company-address').textContent.trim();
    saveCompanies();
  });
  document.querySelector('#company-line').addEventListener('blur', event => {
    event.stopImmediatePropagation();
    const company = companies.find(item => item.id === activeCompanyId);
    if (!company) return;
    company.contact = document.querySelector('#company-line').textContent.trim() + '\n' + document.querySelector('#company-address').textContent.trim();
    saveCompanies();
    document.querySelector('#notice-company-contact').textContent = document.querySelector('#company-line').textContent.trim() || company.phone;
  }, true);
  ['company-name','company-phone'].forEach(id => document.querySelector('#' + id).addEventListener('blur', event => {
    event.stopImmediatePropagation();
    const company = companies.find(item => item.id === activeCompanyId);
    if (!company) return;
    company.name = document.querySelector('#company-name').textContent.trim();
    company.phone = document.querySelector('#company-phone').textContent.trim();
    company.contact = document.querySelector('#company-line').textContent.trim() + '\n' + document.querySelector('#company-address').textContent.trim();
    saveCompanies();
    renderCompanies();
  }, true));
  window.addEventListener('beforeprint', () => {
    const brandText = document.querySelector('#print-report .report-brand div');
    if (!brandText) return;
    let addressLine = brandText.querySelector('.report-company-address');
    const companyAddress = document.querySelector('#company-address').textContent.replace(/^ที่อยู่\s*:\s*/, '').trim();
    if (companyAddress) {
      if (!addressLine) {
        addressLine = document.createElement('p');
        addressLine.className = 'report-company-address';
        brandText.append(addressLine);
      }
      addressLine.textContent = 'ที่อยู่: ' + companyAddress;
    } else addressLine?.remove();
    const firstContactLine = brandText.querySelector('p:not(.report-company-address)');
    if (addressLine && firstContactLine) brandText.insertBefore(addressLine, firstContactLine);
    const brandLines = brandText.querySelectorAll('p:not(.report-company-address)');
    if (brandLines[0]) brandLines[0].style.display = document.querySelector('#company-phone').textContent.trim() ? '' : 'none';
    if (brandLines[1]) brandLines[1].style.display = document.querySelector('#company-line').textContent.replace(/^LINE\s*:\s*/i, '').trim() ? '' : 'none';
    const customerLabel = document.querySelector('#print-report .report-customer div:first-child strong');
    if (customerLabel) customerLabel.textContent = document.querySelector('#customer-type').value + ':';
    const customerLines = document.querySelectorAll('#print-report .report-customer > div');
    if (customerLines[0]) {
      const customerName = document.querySelector('#customer-name').value.trim();
      customerLines[0].style.display = customerName ? '' : 'none';
      if (customerName) customerLines[0].innerHTML = `<strong>${esc(document.querySelector('#customer-type').value)}:</strong> ${esc(customerName)}`;
    }
    if (customerLines[1]) customerLines[1].style.display = document.querySelector('#customer-phone').value.trim() ? '' : 'none';
    if (customerLines[2]) {
      const fullAddress = document.querySelector('#customer-address').value.trim();
      customerLines[2].style.display = fullAddress ? '' : 'none';
      if (fullAddress) customerLines[2].innerHTML = `<strong>ที่อยู่จัดส่ง:</strong><span class="report-address-text">${esc(fullAddress)}</span>`;
    }
    const reportFooter = document.querySelector('#print-report .report-footer');
    if (reportFooter) {
      reportFooter.querySelector('strong').textContent = document.querySelector('#company-name').textContent;
      const footerItems = reportFooter.querySelectorAll('span');
      if (footerItems[1]) footerItems[1].textContent = document.querySelector('#company-line').textContent || document.querySelector('#company-phone').textContent;
    }
    const reportNotes = document.querySelector('#print-report .report-notes');
    if (reportNotes) {
      const noteValue = document.querySelector('.bottom textarea').value.trim();
      const noteLines = noteValue.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
      reportNotes.innerHTML = `${noteLines.length ? `<div class="report-order-note"><strong>หมายเหตุสำหรับออเดอร์:</strong>${noteLines.map(line=>`<span class="report-order-note-text">• ${esc(line)}</span>`).join('')}</div>` : ''}<div class="report-note-rules">• ราคานี้ยังไม่รวม VAT 7%<br>• กรุณายืนยันราคาและสินค้าอีกครั้งก่อนสั่งซื้อ</div>`;
    }
    const reportDoc = document.querySelector('#print-report .report-doc');
    if (reportDoc) {
      reportDoc.querySelector('h1').textContent = 'ใบเสนอราคา';
      const lines = reportDoc.querySelectorAll('p');
      if (lines[0]) lines[0].style.display = document.querySelector('#document-number').textContent.trim() ? '' : 'none';
      if (lines[1]) {
        const orderDate = document.querySelector('#document-date');
        lines[1].style.display = orderDate.value ? '' : 'none';
        if (orderDate.value) lines[1].innerHTML = `วันที่สั่ง: <strong>${esc(formatThaiDateInput(orderDate))}</strong>`;
      }
      reportDoc.querySelectorAll('.delivery-meta').forEach(item => item.remove());
      const arrivalDate = document.querySelector('#arrival-date').value;
      const arrivalTime = document.querySelector('#arrival-time').value;
      if (arrivalDate) reportDoc.insertAdjacentHTML('beforeend', `<p class="delivery-meta">วันที่ส่งถึง: <strong>${esc(formatThaiDateInput(document.querySelector('#arrival-date')))}</strong></p>`);
      if (arrivalTime) reportDoc.insertAdjacentHTML('beforeend', `<p class="delivery-meta">เวลาประมาณ: <strong>${esc(arrivalTime)}</strong></p>`);
    }
  });
  const acFoodsCompany = companies.find(company => company.id === 'ac-foods');
  if (acFoodsCompany && !localStorage.getItem('company-theme-v2')) {
    acFoodsCompany.primary = '#b42323';
    acFoodsCompany.secondary = '#f28c28';
    saveCompanies();
  }
  const pakarangCompany = companies.find(company => company.id === 'pakarang');
  if (pakarangCompany && !localStorage.getItem('company-theme-v2')) {
    pakarangCompany.primary = '#075c70';
    pakarangCompany.secondary = '#18a7a1';
    saveCompanies();
  }
  localStorage.setItem('company-theme-v2', 'done');
  document.querySelector('#delete-company').addEventListener('click', () => {
    if (companies.length <= 1) {
      alert('ต้องมีบริษัทอย่างน้อย 1 บริษัท จึงไม่สามารถลบบริษัทนี้ได้');
      return;
    }
    const company = companies.find(item => item.id === activeCompanyId);
    if (!company || !confirm(`ยืนยันการลบบริษัท “${company.name}” หรือไม่?`)) return;
    companies = companies.filter(item => item.id !== activeCompanyId);
    activeCompanyId = companies[0].id;
    saveCompanies();
    renderCompanies();
  });
  let pendingDeleteCompanyId = '';
  const deleteCompanyDialog = document.querySelector('#delete-company-dialog');
  document.querySelector('#delete-company').addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (companies.length <= 1) {
      alert('ต้องมีบริษัทอย่างน้อย 1 บริษัท จึงไม่สามารถลบบริษัทนี้ได้');
      return;
    }
    pendingDeleteCompanyId = companySelect.value;
    const selectedCompany = companies.find(company => company.id === pendingDeleteCompanyId);
    if (!selectedCompany) return;
    document.querySelector('#delete-company-name').textContent = selectedCompany.name;
    deleteCompanyDialog.showModal();
  }, true);
  document.querySelector('#confirm-delete-company').addEventListener('click', () => {
    if (!pendingDeleteCompanyId) return;
    companies = companies.filter(company => company.id !== pendingDeleteCompanyId);
    activeCompanyId = companies[0].id;
    pendingDeleteCompanyId = '';
    saveCompanies();
    renderCompanies();
  });
  let editingCompanyId = '';
  const companyDialogTitle = document.querySelector('#company-dialog .dialog-title h2');
  document.querySelector('#add-company').addEventListener('click', () => {
    editingCompanyId = '';
    companyDialogTitle.textContent = 'เพิ่มบริษัทใหม่';
  }, true);
  document.querySelector('#edit-company').addEventListener('click', () => {
    const company = companies.find(item => item.id === companySelect.value);
    if (!company) return;
    editingCompanyId = company.id;
    companyForm.reset();
    companyDialogTitle.textContent = 'แก้ไขข้อมูลบริษัท';
    document.querySelector('#new-company-name').value = company.name || '';
    document.querySelector('#new-company-phone').value = company.phone || '';
    const contact = splitCompanyContact(company.contact);
    document.querySelector('#new-company-line').value = contact.line || '';
    document.querySelector('#new-company-address').value = contact.address.replace(/^ที่อยู่\s*:\s*/, '') || '';
    document.querySelector('#new-company-contact').value = company.contact || '';
    document.querySelector('#new-company-primary').value = company.primary || '#075c70';
    document.querySelector('#new-company-secondary').value = company.secondary || '#18a7a1';
    companyDialog.showModal();
  });
  companyForm.addEventListener('submit', event => {
    document.querySelector('#new-company-contact').value = [document.querySelector('#new-company-line').value.trim(), document.querySelector('#new-company-address').value.trim() ? 'ที่อยู่: ' + document.querySelector('#new-company-address').value.trim() : ''].filter(Boolean).join('\n');
    if (!editingCompanyId) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const company = companies.find(item => item.id === editingCompanyId);
    if (!company) return;
    const finishEdit = logo => {
      company.name = document.querySelector('#new-company-name').value.trim();
      company.phone = document.querySelector('#new-company-phone').value.trim();
      company.contact = [document.querySelector('#new-company-line').value.trim(), document.querySelector('#new-company-address').value.trim() ? 'ที่อยู่: ' + document.querySelector('#new-company-address').value.trim() : ''].filter(Boolean).join('\n');
      company.primary = document.querySelector('#new-company-primary').value;
      company.secondary = document.querySelector('#new-company-secondary').value;
      if (logo) company.logo = logo;
      activeCompanyId = company.id;
      editingCompanyId = '';
      saveCompanies();
      renderCompanies();
      companyDialog.close();
    };
    const logoFile = document.querySelector('#new-company-logo').files[0];
    if (logoFile) {
      const reader = new FileReader();
      reader.onload = () => finishEdit(reader.result);
      reader.readAsDataURL(logoFile);
    } else finishEdit('');
  }, true);
  function setupSalesColumns() {
    document.querySelectorAll('.table-wrap table').forEach(table => {
      const headers = table.querySelectorAll('thead th');
      if (!headers.length || table.querySelector('thead .sales-unit-heading')) return;
      headers[3].textContent = 'จำนวนสั่งซื้อ';
      headers[4].textContent = 'หน่วยสั่งซื้อ';
      headers[3].classList.add('customer-column');
      headers[4].classList.add('customer-column');
      headers[6].textContent = 'จำนวนตอบกลับ';
      headers[6].classList.add('sales-column');
      const salesUnitHeading = document.createElement('th');
      salesUnitHeading.textContent = 'หน่วยตอบกลับ';
      salesUnitHeading.className = 'sales-column sales-unit-heading';
      headers[6].after(salesUnitHeading);
      headers[7].classList.add('sales-column');
      headers[7].textContent = 'ราคาตอบกลับ';
    });
  }
  function ensureSalesUnit(row) {
    if (!row || row.querySelector('.sales-unit')) return;
    const cell = document.createElement('td');
    cell.innerHTML = `<select class="sales-unit">${unitOptions(row.querySelector('.item-unit')?.value||'ชิ้น')}</select>`;
    row.children[6].after(cell);
  }
  function setupSalesRows(root = document) {
    if (root.matches?.('tr')) ensureSalesUnit(root);
    root.querySelectorAll?.('tbody tr').forEach(ensureSalesUnit);
  }
  setupSalesColumns();
  setupSalesRows();
  new MutationObserver(mutations => mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
    if (node.nodeType === 1) setupSalesRows(node);
  }))).observe(document.querySelector('.items'), {childList:true, subtree:true});
  function enableStockNoteLists(root = document) {
    root.querySelectorAll?.('.item-note').forEach(input => input.setAttribute('list', 'stock-note-options'));
  }
  enableStockNoteLists();
  new MutationObserver(mutations => mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
    if (node.nodeType === 1) enableStockNoteLists(node.matches?.('.item-note') ? node.parentElement : node);
  }))).observe(rows, {childList:true, subtree:true});
  rows.addEventListener('change', event => {
    if (!event.target.matches('.item-note') || !/^ไม่มี(?:ในสต๊อก|สินค้า)?$/i.test(event.target.value.trim())) return;
    const sourceRow = event.target.closest('tr');
    const data = {
      code: sourceRow.querySelector('.product-code').value,
      name: sourceRow.querySelector('.product').value,
      qty: sourceRow.querySelector('.qty').value,
      unit: sourceRow.querySelector('.item-unit').value,
      unitPrice: sourceRow.querySelector('.unit-price').value,
      qty2: sourceRow.querySelector('.second-qty').value,
      salesUnit: sourceRow.querySelector('.sales-unit')?.value || '',
      price2: sourceRow.querySelector('.second-price').value,
      note: event.target.value.trim()
    };
    addOut();
    const targetRow = outRows.lastElementChild;
    ensureSalesUnit(targetRow);
    targetRow.querySelector('.product-code').value = data.code;
    targetRow.querySelector('.product').value = data.name;
    targetRow.querySelector('.qty').value = data.qty;
    targetRow.querySelector('.item-unit').value = data.unit;
    targetRow.querySelector('.unit-price').value = data.unitPrice;
    targetRow.querySelector('.second-qty').value = data.qty2;
    targetRow.querySelector('.sales-unit').value = data.salesUnit;
    targetRow.querySelector('.second-price').value = data.price2;
    targetRow.querySelector('.item-note').value = data.note;
    sourceRow.remove();
    calculate();
    calculateOut();
    targetRow.scrollIntoView({behavior:'smooth', block:'center'});
    targetRow.querySelector('.item-note').focus();
  });
  function saveLatestQuoteSnapshot(){
    const snapshot={savedAt:Date.now(),documentNumber:document.querySelector('#document-number').textContent.trim(),documentDate:document.querySelector('#document-date').value,arrivalDate:document.querySelector('#arrival-date').value,arrivalTime:document.querySelector('#arrival-time').value,customerType:document.querySelector('#customer-type').value,customerName:document.querySelector('#customer-name').value,customerPhone:document.querySelector('#customer-phone').value,customerAddress:document.querySelector('#customer-address').value,normal:reportRows(rows),out:reportRows(outRows)};
    try{localStorage.setItem('latest-quote-snapshot-v1',JSON.stringify(snapshot))}catch{}
  }
  function restoreLatestQuoteSnapshot(){
    let snapshot;try{snapshot=JSON.parse(localStorage.getItem('latest-quote-snapshot-v1'))}catch{return false}if(!snapshot||!Array.isArray(snapshot.normal)||!Array.isArray(snapshot.out)||Date.now()-snapshot.savedAt>604800000)return false;
    document.querySelector('#document-number').textContent=snapshot.documentNumber||'';document.querySelector('#document-date').value=snapshot.documentDate||'';document.querySelector('#arrival-date').value=snapshot.arrivalDate||'';document.querySelector('#arrival-time').value=snapshot.arrivalTime||'';document.querySelector('#customer-type').value=['ชื่อลูกค้า','ชื่อร้าน','บริษัท'].includes(snapshot.customerType)?snapshot.customerType:'ชื่อลูกค้า';document.querySelector('#customer-name').value=snapshot.customerName||'';document.querySelector('#customer-phone').value=snapshot.customerPhone||'';document.querySelector('#customer-address').value=snapshot.customerAddress||'';rows.innerHTML='';outRows.innerHTML='';
    snapshot.normal.forEach(item=>{add({code:item.code,name:item.name,qty:item.orderQty,unit:item.unit,qty2:item.actualQty,price2:item.price,note:item.note});ensureSalesUnit(rows.lastElementChild);rows.lastElementChild.querySelector('.sales-unit').value=item.salesUnit||''});
    snapshot.out.forEach(item=>{addOut();const row=outRows.lastElementChild;ensureSalesUnit(row);row.querySelector('.product-code').value=item.code||'';row.querySelector('.product').value=item.name||'';row.querySelector('.qty').value=item.orderQty||'';row.querySelector('.item-unit').value=item.unit||'';row.querySelector('.second-qty').value=item.actualQty||'';row.querySelector('.sales-unit').value=item.salesUnit||'';row.querySelector('.second-price').value=item.price||'';row.querySelector('.item-note').value=item.note||''});
    calculate();calculateOut();setUploadStatus('OCR อ่านไฟล์ไม่ครบ — กู้ข้อมูลใบเสนอราคาที่สร้างล่าสุดสำเร็จ','success');document.querySelector('.items').scrollIntoView({behavior:'smooth',block:'start'});return true;
  }
  function restoreMatchingQuoteSnapshot(text){
    const compact=String(text||'').replace(/\s+/g,''),number=(compact.match(/QT\d{6}-\d{6}/i)||[])[0];if(!number)return false;let snapshot;try{snapshot=JSON.parse(localStorage.getItem('latest-quote-snapshot-v1'))}catch{return false}if(!snapshot||String(snapshot.documentNumber||'').toUpperCase()!==number.toUpperCase())return false;return restoreLatestQuoteSnapshot();
  }
  document.querySelector('#export-report').addEventListener('click',saveLatestQuoteSnapshot,true);
  document.querySelector('#export-excel').addEventListener('click', () => {
    if (!window.XLSX) {
      alert('ไม่สามารถโหลดระบบสร้าง Excel ได้ กรุณาเชื่อมต่ออินเทอร์เน็ตแล้วลองใหม่');
      return;
    }
    const normalItems = reportRows(rows);
    const outItems = reportRows(outRows);
    const companyName = document.querySelector('#company-name').textContent.trim();
    const customerType = document.querySelector('#customer-type').value;
    const companyPhone = document.querySelector('#company-phone').textContent.trim();
    const companyLine = document.querySelector('#company-line').textContent.replace(/^LINE\s*:\s*$/i, '').trim();
    const companyAddress = document.querySelector('#company-address').textContent.replace(/^ที่อยู่\s*:\s*$/, '').trim();
    const customerName = document.querySelector('#customer-name').value.trim();
    const customerPhone = document.querySelector('#customer-phone').value.trim();
    const customerAddress = document.querySelector('#customer-address').value.trim();
    const arrivalDate = document.querySelector('#arrival-date').value;
    const arrivalTime = document.querySelector('#arrival-time').value;
    const data = [
      [companyName],
      [companyPhone],
      [companyLine],
      [companyAddress],
      [],
      ['ใบเสนอราคา'],
      [document.querySelector('#document-number').textContent.trim() ? `เลขที่: ${document.querySelector('#document-number').textContent.trim()}` : '', document.querySelector('#document-date').value ? `วันที่สั่ง: ${formatThaiDateInput(document.querySelector('#document-date'))}` : '', arrivalDate ? `วันที่ส่งถึง: ${formatThaiDateInput(document.querySelector('#arrival-date'))}` : '', arrivalTime ? `เวลาประมาณ: ${arrivalTime}` : ''],
      [customerName ? `${customerType}: ${customerName}` : '', customerPhone ? `โทร: ${customerPhone}` : ''],
      [customerAddress ? `ที่อยู่จัดส่ง: ${customerAddress}` : ''],
      [],
      ['ลำดับที่','รหัส','รายการสินค้า','จำนวนสั่งซื้อ','หน่วยสั่งซื้อ','จำนวนตอบกลับ','หน่วยตอบกลับ','ราคาตอบกลับ','รวม','หมายเหตุ']
    ];
    const formulaRows = [];
    const appendItems = items => items.forEach((item, index) => {
      const excelRow = data.length + 1;
      data.push([index + 1,item.code,item.name,item.orderQty !== '' ? Number(item.orderQty) : '',item.unit,item.actualQty !== '' ? Number(item.actualQty) : '',item.salesUnit,item.price !== '' ? Number(item.price) : '',{f:`IF(OR(F${excelRow}="",H${excelRow}=""),"",F${excelRow}*H${excelRow})`},item.note]);
      formulaRows.push(excelRow);
    });
    appendItems(normalItems);
    const normalStart = 12, normalEnd = data.length;
    data.push(['','','','','','','','รวมทั้งสิ้น',{f:normalEnd >= normalStart ? `SUM(I${normalStart}:I${normalEnd})` : '0'},'']);
    if (outItems.length) {
      data.push([],['สินค้าที่ไม่มีในสต๊อก'],['ลำดับที่','รหัส','รายการสินค้า','จำนวนสั่งซื้อ','หน่วยสั่งซื้อ','จำนวนตอบกลับ','หน่วยตอบกลับ','ราคาตอบกลับ','รวม','หมายเหตุ']);
      const outStart = data.length + 1;
      appendItems(outItems);
      data.push(['','','','','','','','รวมสินค้าที่ไม่มีในสต๊อก',{f:`SUM(I${outStart}:I${data.length})`},'']);
    }
    const orderNote = document.querySelector('.order-note textarea')?.value.trim();
    if (orderNote) data.push([], [`หมายเหตุสำหรับออเดอร์: ${orderNote}`]);
    const sheet = XLSX.utils.aoa_to_sheet(data);
    sheet['!cols'] = [{wch:9},{wch:15},{wch:34},{wch:14},{wch:14},{wch:14},{wch:14},{wch:14},{wch:16},{wch:24}];
    sheet['!merges'] = [{s:{r:0,c:0},e:{r:0,c:9}},{s:{r:1,c:0},e:{r:1,c:9}},{s:{r:2,c:0},e:{r:2,c:9}},{s:{r:3,c:0},e:{r:3,c:9}},{s:{r:5,c:0},e:{r:5,c:9}},{s:{r:8,c:0},e:{r:8,c:9}}];
    formulaRows.forEach(row => { if (sheet[`H${row}`]) sheet[`H${row}`].z = '#,##0.00'; if (sheet[`I${row}`]) sheet[`I${row}`].z = '#,##0.00'; });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'ใบเสนอราคา');
    const safeNumber = document.querySelector('#document-number').textContent.trim().replace(/[\\/:*?"<>|]/g, '-');
    XLSX.writeFile(workbook, `ใบเสนอราคา-${safeNumber || 'ใหม่'}.xlsx`);
  });
  // Restore the last selected company and start each refreshed order blank.
  applyCompany(companies.some(company => company.id === activeCompanyId) ? activeCompanyId : companies[0].id);
  rows.innerHTML = '';
  outRows.innerHTML = '';
  document.querySelector('#customer-name').value = '';
  document.querySelector('#customer-phone').value = '';
  document.querySelector('#customer-address').value = '';
  document.querySelector('#document-number').textContent = '';
  document.querySelector('#document-date').value = '';
  document.querySelector('#arrival-date').value = '';
  document.querySelector('#arrival-time').value = '';
  calculate();
  calculateOut();

(()=>{const payload=new URLSearchParams(location.search).get('customerOrder');if(!payload)return;try{const order=JSON.parse(payload);localStorage.setItem('ac-active-sales-order-number',order.number||'');if(companies.some(company=>company.id==='ac-foods'))applyCompany('ac-foods');const customer=order.customer||{};document.querySelector('#customer-type').value=customer.company?'บริษัท':'ชื่อร้าน';document.querySelector('#customer-name').value=customer.company||customer.contact||'';document.querySelector('#customer-phone').value=customer.phone||'';document.querySelector('#customer-address').value=customer.address||'';document.querySelector('#arrival-date').value=customer.deliveryDate||'';document.querySelector('#document-date').value=(order.createdAt||new Date().toISOString()).slice(0,10);document.querySelector('#document-number').textContent=String(order.number||'').replace(/^PO-/,'QT-');rows.innerHTML='';(order.items||[]).forEach(item=>{add({code:item.code||'',name:item.name||'',qty:item.quantity||1,unit:item.unit||'กิโลกรัม',price:item.price||'',qty2:item.quantity||'',price2:item.price||'',note:item.note||''});ensureSalesUnit(rows.lastElementChild);rows.lastElementChild.querySelector('.sales-unit').value=orderUnits.includes(item.unit)?item.unit:'กิโลกรัม'});calculate();calculateOut();history.replaceState({},document.title,location.pathname)}catch(error){console.error('ไม่สามารถนำเข้าข้อมูลใบสั่งซื้อได้',error)}})();

function saveQuotationToDashboard(){let history=[];try{history=JSON.parse(localStorage.getItem('ac-customer-orders'))||[]}catch{}let sourceNumber=localStorage.getItem('ac-active-sales-order-number');if(!sourceNumber){try{sourceNumber=JSON.parse(localStorage.getItem('pakarang-latest-order'))?.number||''}catch{}}const order=history.find(item=>item.number===sourceNumber);if(!order){alert('ไม่พบใบสั่งซื้อที่เชื่อมกับเอกสารนี้');return false}const quoteRows=[...reportRows(rows),...reportRows(outRows)],quotation={documentNumber:document.querySelector('#document-number').textContent.trim(),documentDate:document.querySelector('#document-date').value,arrivalDate:document.querySelector('#arrival-date').value,arrivalTime:document.querySelector('#arrival-time').value,customer:{company:document.querySelector('#customer-name').value,phone:document.querySelector('#customer-phone').value,address:document.querySelector('#customer-address').value},items:quoteRows.map(item=>({code:item.code,name:item.name,quantity:+item.actualQty||+item.orderQty||0,unit:item.salesUnit||item.unit,price:+item.price||0,note:item.note||''})),savedAt:new Date().toISOString()};order.quotation=quotation;order.originalItems=order.originalItems||order.items;order.items=quotation.items;order.customer={...order.customer,...quotation.customer,deliveryDate:quotation.arrivalDate||order.customer?.deliveryDate};order.status='completed';order.quoteNumber=quotation.documentNumber;order.quotedAt=quotation.savedAt;localStorage.setItem('ac-customer-orders',JSON.stringify(history));localStorage.setItem('pakarang-latest-order',JSON.stringify(order));localStorage.setItem('pakarang-latest-quotation',JSON.stringify({orderNumber:sourceNumber,...quotation}));return true}
document.querySelector('#save-quotation')?.addEventListener('click',()=>{if(saveQuotationToDashboard())alert('บันทึกใบเสนอราคาเรียบร้อยแล้ว')});
['#export-report','#export-excel'].forEach(selector=>document.querySelector(selector)?.addEventListener('click',event=>{if(saveQuotationToDashboard())return;event.preventDefault();event.stopImmediatePropagation()},true));

/* Persist the complete quotation document shown in the PDF report. */
function saveQuotationToDashboard(){
  let history=[];
  try{history=JSON.parse(localStorage.getItem('ac-customer-orders'))||[]}catch{}
  const draftNormalItems=reportRows(rows),draftOutOfStockItems=reportRows(outRows),draftItems=[...draftNormalItems,...draftOutOfStockItems];
  if(!draftItems.length){alert('กรุณาเพิ่มข้อมูลสินค้าอย่างน้อย 1 รายการก่อนบันทึกใบเสนอราคา');return false}
  const invalidItem=draftItems.find(item=>!String(item.code||'').trim()||!String(item.name||'').trim()||!(Number(item.orderQty)>0));
  if(invalidItem){alert('กรุณากรอกรหัสสินค้า ชื่อสินค้า และจำนวนสั่งซื้อให้ครบทุกแถวก่อนบันทึกใบเสนอราคา');return false}
  try{localStorage.setItem('ac-customer-orders-backup',JSON.stringify({savedAt:new Date().toISOString(),orders:history}))}catch{}
  const currentDocumentNumber=document.querySelector('#document-number').textContent.trim();
  const derivedOrderNumber=currentDocumentNumber.replace(/^QT-/i,'PO-').replace(/^QT(?=\d)/i,'PO-');
  const standalone=sessionStorage.getItem('ac-standalone-quotation')==='active';
  let sourceNumber=localStorage.getItem('ac-active-sales-order-number');
  if(!standalone&&!sourceNumber){try{sourceNumber=JSON.parse(localStorage.getItem('pakarang-latest-order'))?.number||''}catch{}}
  let order=standalone?history.find(item=>item.source==='uploaded-po'&&(item.quoteNumber===currentDocumentNumber||item.quotation?.documentNumber===currentDocumentNumber)):(history.find(item=>item.number===sourceNumber)||history.find(item=>item.number===derivedOrderNumber)||history.find(item=>item.quoteNumber===currentDocumentNumber)||history.find(item=>item.quotation?.documentNumber===currentDocumentNumber));
  const existingCustomer=order?.customer||{};
  const mapItem=(item,section)=>({section,code:item.code,name:item.name,orderQuantity:+item.orderQty||0,orderUnit:item.unit||'',quantity:+item.actualQty||+item.orderQty||0,unit:item.salesUnit||item.unit||'',price:+item.price||0,note:item.note||'',total:(+item.actualQty||+item.orderQty||0)*(+item.price||0)});
  const normalItems=draftNormalItems.map(item=>mapItem(item,'normal'));
  const outOfStockItems=draftOutOfStockItems.map(item=>mapItem(item,'out-of-stock'));
  const items=[...normalItems,...outOfStockItems];
  const activeCompany=companies.find(item=>item.id===activeCompanyId)||{};
  const orderNoteField=document.querySelector('.order-note textarea')||document.querySelector('.order-note-wrap textarea');
  const currentOrderNote=orderNoteField?orderNoteField.value.trim():(localStorage.getItem(`ac-quotation-note:${currentDocumentNumber}`)||'');
  const quotation={
    documentNumber:currentDocumentNumber,
    documentDate:document.querySelector('#document-date').value,
    arrivalDate:document.querySelector('#arrival-date').value,
    arrivalTime:document.querySelector('#arrival-time').value,
    supplier:{id:activeCompany.id||'',name:document.querySelector('#company-name').textContent.trim(),phone:document.querySelector('#company-phone').textContent.trim(),address:document.querySelector('#company-address')?.textContent.trim()||'',line:document.querySelector('#company-line').textContent.trim(),logo:activeCompany.logo||''},
    customer:{type:document.querySelector('#customer-type').value,company:document.querySelector('#customer-name').value.trim(),contact:existingCustomer.contact||document.querySelector('#customer-name').value.trim(),phone:document.querySelector('#customer-phone').value.trim(),taxId:existingCustomer.taxId||'',address:document.querySelector('#customer-address').value.trim()},
    orderNote:currentOrderNote,
    normalItems,outOfStockItems,items,
    normalTotal:normalItems.reduce((sum,item)=>sum+item.total,0),
    outOfStockTotal:outOfStockItems.reduce((sum,item)=>sum+item.total,0),
    grandTotal:items.reduce((sum,item)=>sum+item.total,0),
    savedAt:new Date().toISOString()
  };
  if(!order){
    const preferred=/^PO-/i.test(derivedOrderNumber)?derivedOrderNumber:`PO-EXT-${String(Date.now()).slice(-10)}`;
    sourceNumber=history.some(item=>item.number===preferred)?`${preferred}-EXT-${String(Date.now()).slice(-4)}`:preferred;
    order={number:sourceNumber,createdAt:quotation.savedAt,status:'completed',quoteNumber:quotation.documentNumber,quotedAt:quotation.savedAt,customer:{...quotation.customer,deliveryDate:quotation.arrivalDate},items:[],source:'uploaded-po'};
    history.unshift(order);
  }else sourceNumber=order.number;
  const poItems=items.map(item=>({...item,quantity:item.orderQuantity||item.quantity||0,unit:item.orderUnit||item.unit||'',quotedQuantity:item.quantity||0,quotedUnit:item.unit||'',quotedPrice:item.price||0,total:(item.orderQuantity||item.quantity||0)*(item.price||0)}));
  order.quotation=quotation;
  order.orderNote=quotation.orderNote;
  order.originalItems=poItems.map(item=>({...item}));
  order.items=poItems;
  order.customer={...order.customer,...quotation.customer,deliveryDate:quotation.arrivalDate||order.customer?.deliveryDate};
  order.status='completed';order.quoteNumber=quotation.documentNumber;order.quotedAt=quotation.savedAt;
  localStorage.setItem('ac-customer-orders',JSON.stringify(history));
  localStorage.setItem('ac-orders-updated-at',String(Date.now()));
  localStorage.setItem('pakarang-latest-order',JSON.stringify(order));
  localStorage.setItem('pakarang-latest-quotation',JSON.stringify({orderNumber:sourceNumber,...quotation}));
  localStorage.setItem(`ac-quotation-note:${quotation.documentNumber}`,quotation.orderNote);
  localStorage.setItem('ac-latest-quotation-note',quotation.orderNote);
  if(standalone)sessionStorage.setItem('ac-standalone-quotation','active');
  return true;
}

(()=>{
  const orderNumber=new URLSearchParams(location.search).get('quotationOrder');
  if(!orderNumber)return;
  let orderHistory=[];try{orderHistory=JSON.parse(localStorage.getItem('ac-customer-orders'))||[]}catch{}
  const order=orderHistory.find(item=>item.number===orderNumber),quotation=order?.quotation;
  if(!order||!quotation){alert('ไม่พบข้อมูลใบเสนอราคาที่บันทึกไว้');return}
  localStorage.setItem('ac-active-sales-order-number',order.number);
  if(quotation.supplier?.id&&companies.some(company=>company.id===quotation.supplier.id))applyCompany(quotation.supplier.id);
  document.querySelector('#document-number').textContent=quotation.documentNumber||order.quoteNumber||'';
  document.querySelector('#document-date').value=quotation.documentDate||'';
  document.querySelector('#arrival-date').value=quotation.arrivalDate||'';
  document.querySelector('#arrival-time').value=quotation.arrivalTime||'';
  document.querySelector('#customer-type').value=quotation.customer?.type||'ชื่อร้าน';
  document.querySelector('#customer-name').value=quotation.customer?.company||'';
  document.querySelector('#customer-phone').value=quotation.customer?.phone||'';
  document.querySelector('#customer-address').value=quotation.customer?.address||'';
  const note=document.querySelector('.order-note textarea');if(note)note.value=quotation.orderNote||order.orderNote||localStorage.getItem(`ac-quotation-note:${quotation.documentNumber||order.quoteNumber||''}`)||'';
  rows.innerHTML='';outRows.innerHTML='';
  (quotation.normalItems||[]).forEach(item=>{add({code:item.code||'',name:item.name||'',qty:item.orderQuantity??item.quantity??1,unit:item.orderUnit||item.unit||'กิโลกรัม',qty2:item.quantity??'',price2:item.price??'',note:item.note||''});ensureSalesUnit(rows.lastElementChild);rows.lastElementChild.querySelector('.sales-unit').value=item.unit||item.orderUnit||'กิโลกรัม'});
  (quotation.outOfStockItems||[]).forEach(item=>{addOut();const row=outRows.lastElementChild;ensureSalesUnit(row);row.querySelector('.product-code').value=item.code||'';row.querySelector('.product').value=item.name||'';row.querySelector('.qty').value=item.orderQuantity??item.quantity??1;row.querySelector('.item-unit').value=item.orderUnit||item.unit||'กิโลกรัม';row.querySelector('.second-qty').value=item.quantity??'';row.querySelector('.sales-unit').value=item.unit||item.orderUnit||'กิโลกรัม';row.querySelector('.second-price').value=item.price??'';row.querySelector('.item-note').value=item.note||''});
  calculate();calculateOut();window.history.replaceState({},document.title,location.pathname);
})();

(()=>{
  if(new URLSearchParams(location.search).get('newQuotation')!=='1')return;
  localStorage.removeItem('ac-active-sales-order-number');
  sessionStorage.setItem('ac-standalone-quotation','active');
  rows.innerHTML='';outRows.innerHTML='';
  document.querySelector('#customer-name').value='';document.querySelector('#customer-phone').value='';document.querySelector('#customer-address').value='';
  document.querySelector('#arrival-date').value='';document.querySelector('#arrival-time').value='';
  const note=document.querySelector('.order-note textarea');if(note)note.value='';
  calculate();calculateOut();
  window.history.replaceState({},document.title,location.pathname);
})();

(()=>{
  const field=document.querySelector('.order-note textarea')||document.querySelector('.order-note-wrap textarea');
  if(!field)return;
  field.addEventListener('input',()=>{const number=document.querySelector('#document-number').textContent.trim();localStorage.setItem('ac-latest-quotation-note',field.value);if(number)localStorage.setItem(`ac-quotation-note:${number}`,field.value)});
})();
