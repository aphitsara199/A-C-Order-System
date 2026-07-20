import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let failures = 0;
const fail = message => { failures++; console.error(message); };
const requiredPages = [
  'Pakarang-Customer-Login.html','A-C-Customer-Register.html','A-C-Forgot-Password.html',
  'Pakarang-Customer-Order.html','A-C-Sales-Login.html','A-C-Sales-Dashboard.html',
  'Pakarang-Order.html','Pakarang-Sales-Quotation.html'
  ,'A-C-Data-Backup.html'
];
for (const name of requiredPages) if (!fs.existsSync(path.join(root, 'pages', name))) fail(`Missing page: ${name}`);
for (const name of ['Dockerfile','.dockerignore','.gcloudignore']) if (!fs.existsSync(path.join(root,name))) fail(`Missing deployment file: ${name}`);
for (const name of ['.gitignore','.nojekyll',path.join('.github','workflows','pages.yml')]) if (!fs.existsSync(path.join(root,name))) fail(`Missing GitHub Pages file: ${name}`);
for (const name of fs.readdirSync(path.join(root, 'js'), { recursive:true })) {
  if (!String(name).endsWith('.js')) continue;
  const file = path.join(root, 'js', String(name));
  try { new Function(fs.readFileSync(file, 'utf8')); } catch (error) { fail(`JS syntax: ${file}\n${error.message}`); }
}
for (const name of fs.readdirSync(path.join(root, 'assets', 'data')).filter(name => name.endsWith('.json'))) {
  const file = path.join(root, 'assets', 'data', name);
  try { JSON.parse(fs.readFileSync(file, 'utf8')); } catch (error) { fail(`Invalid JSON: ${file}\n${error.message}`); }
}
for (const directory of ['js','pages','css']) {
  for (const name of fs.readdirSync(path.join(root,directory),{recursive:true})) {
    const file=path.join(root,directory,String(name));
    if (!fs.statSync(file).isFile()||!/[.](?:js|html|css)$/.test(file)) continue;
    const source=fs.readFileSync(file,'utf8');
    if (source.includes('\uFFFD')) fail(`Broken UTF-8 replacement character: ${file}`);
  }
}
for (const name of fs.readdirSync(path.join(root, 'pages')).filter(x => x.endsWith('.html'))) {
  const file = path.join(root, 'pages', name), html = fs.readFileSync(file, 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  const duplicateIds = [...new Set(ids.filter((id,index) => ids.indexOf(id) !== index))];
  if (duplicateIds.length) fail(`Duplicate id in ${name}: ${duplicateIds.join(', ')}`);
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    const ref = match[1];
    if (/^(?:https?:|data:|javascript:)/.test(ref)) continue;
    if (!fs.existsSync(path.resolve(path.dirname(file), ref))) fail(`Missing reference: ${name} -> ${ref}`);
  }
}
const featureFiles = {
  dashboard: fs.readFileSync(path.join(root,'js','A-C-Sales-Dashboard.js'),'utf8'),
  quotation: fs.readFileSync(path.join(root,'js','Pakarang-Order.js'),'utf8'),
  customerOrder: fs.readFileSync(path.join(root,'js','Pakarang-Customer-Order.js'),'utf8'),
  apiConfig: fs.readFileSync(path.join(root,'js','services','api-config.js'),'utf8')
};
const customerAuth = fs.readFileSync(path.join(root,'js','services','customer-auth.js'),'utf8');
const customerOrderGuard = fs.readFileSync(path.join(root,'js','services','customer-order-guard.js'),'utf8');
const addressAutocomplete = fs.readFileSync(path.join(root,'js','services','address-autocomplete.js'),'utf8');
const addressFields = fs.readFileSync(path.join(root,'js','services','address-fields.js'),'utf8');
const customerOrderCss = fs.readFileSync(path.join(root,'css','Pakarang-Customer-Order.css'),'utf8');
const features = [
  ['Dashboard status all', featureFiles.dashboard, "value='all'"],
  ['Dashboard external quotation button', featureFiles.dashboard, 'newQuotation'],
  ['Dashboard customer merge', featureFiles.dashboard, 'fromDocuments'],
  ['Dashboard saved quotation viewer', featureFiles.dashboard, 'quotationOrder'],
  ['Dashboard PO edits sync to quotation', featureFiles.dashboard, 'syncEditedOrderToQuotation'],
  ['Dashboard refreshes after quotation edit', featureFiles.dashboard, 'refreshOrdersFromQuotation'],
  ['Dashboard PO product autocomplete', featureFiles.dashboard, 'showEditorProducts'],
  ['Dashboard PO unit dropdown', featureFiles.dashboard, 'ensureEditorUnitSelect'],
  ['Dashboard PO blank-row save guard', featureFiles.dashboard, "row.querySelector('.e-code').value.trim()"],
  ['Quotation external PO isolation', featureFiles.quotation, 'ac-standalone-quotation'],
  ['Quotation order backup', featureFiles.quotation, 'ac-customer-orders-backup'],
  ['Quotation order note persistence', featureFiles.quotation, 'ac-quotation-note:'],
  ['Quotation PDF Test 14 support', featureFiles.quotation, 'importTest14Order'],
  ['Quotation PDF Test 15 support', featureFiles.quotation, 'importTest15Order'],
  ['Quotation PDF Test 12 support', featureFiles.quotation, 'importTest12Order'],
  ['Quotation PDF Test 11 support', featureFiles.quotation, 'importTest11Order'],
  ['Quotation PDF input', featureFiles.quotation, "querySelector('#po-upload')"],
  ['Quotation PDF text extraction', featureFiles.quotation, 'pdfjs.getDocument'],
  ['Quotation scanned PDF OCR fallback', featureFiles.quotation, 'Tesseract.recognize'],
  ['Customer order history', featureFiles.customerOrder, 'ac-customer-orders'],
  ['Customer order total price', featureFiles.customerOrder, 'priceTotal'],
  ['Customer order line totals', featureFiles.customerOrder, 'line-total-display'],
  ['Customer order Enter submit guard', featureFiles.customerOrder, "event.key==='Enter'"],
  ['Customer order manual submit only', featureFiles.customerOrder, "saveButton.type='button'"],
  ['Customer order empty item guard', featureFiles.customerOrder, 'validateOrderItems'],
  ['Customer order personal history', featureFiles.customerOrder, 'orderHistoryButton'],
  ['Customer history hides order form', customerOrderCss, '[hidden]{display:none!important}'],
  ['Customer history follows quotation', featureFiles.customerOrder, 'quoted?.items'],
  ['Customer history PDF per order', featureFiles.customerOrder, 'history-pdf-button'],
  ['Customer history PDF delivery date', featureFiles.customerOrder, 'วันที่ส่งถึง'],
  ['Customer history PDF arrival time', featureFiles.customerOrder, 'เวลาประมาณ'],
  ['Customer history PDF order note', featureFiles.customerOrder, 'quotation.orderNote'],
  ['Customer history PDF suppresses browser footer space', featureFiles.customerOrder, 'historyPdfPageStyle'],
  ['API orders route', featureFiles.apiConfig, "orders: '/orders'"],
  ['API quotations route', featureFiles.apiConfig, "quotations: '/quotations'"]
];
for (const [label,source,needle] of features) if (!source.includes(needle)) fail(`Missing feature: ${label}`);

const uploadFixtures = [
  ['เทส.pdf','importTestOrder'],['เทส2.pdf','importTest2Order'],['เทส3.pdf','importTest3Order'],
  ['เทส4.pdf','importTest3Order'],['เทส5.pdf','importTest5Order'],['เทส6.pdf','importTest6Order'],
  ['เทส7.pdf','importTest7Order'],['เทส8.pdf','importTest8Order'],['เทส9.pdf','importTest9Order'],
  ['เทส10.pdf','importTest10Order'],['เทส11.pdf','importTest11Order'],['เทส12.pdf','importTest12Order'],
  ['เทส13.pdf','importTest13Order'],['เทส14.pdf','importTest14Order'],['เทส15.pdf','importTest15Order'],
  ['ตัวอย่าง1.pdf','importSample1Order'],['ตัวอย่างใบสั่งซื้อ.pdf','importSampleOrder']
];
for (const [fileName,handler] of uploadFixtures) {
  if (!featureFiles.quotation.includes(handler)) fail(`Missing upload handler for ${fileName}: ${handler}`);
}

const dataFlow = [
  ['Registration saves account', customerAuth, 'ac-customer-account'],
  ['Registration saves customer list', customerAuth, 'ac-customers'],
  ['Login loads account', customerAuth, 'ac-customer-account'],
  ['Login creates current customer', fs.readFileSync(path.join(root,'js','Pakarang-Customer-Login.js'),'utf8'), 'ac-current-customer'],
  ['Customer order loads current customer', featureFiles.customerOrder, 'ac-current-customer'],
  ['Customer order saves shared history', featureFiles.customerOrder, 'ac-customer-orders'],
  ['Dashboard loads shared history', featureFiles.dashboard, "read('ac-customer-orders')"],
  ['Dashboard customer detail per customer', featureFiles.dashboard, 'customer-detail-button'],
  ['Dashboard backup and recovery link', featureFiles.dashboard, 'A-C-Data-Backup.html'],
  ['Dashboard loads registered customers', featureFiles.dashboard, "read('ac-customers')"],
  ['Quotation receives dashboard order', featureFiles.quotation, "get('customerOrder')"],
  ['Quotation restores saved document', featureFiles.quotation, "get('quotationOrder')"],
  ['Quotation saves shared history', featureFiles.quotation, "setItem('ac-customer-orders'"],
  ['Quotation blocks empty save', featureFiles.quotation, 'กรุณาเพิ่มข้อมูลสินค้าอย่างน้อย 1 รายการก่อนบันทึกใบเสนอราคา'],
  ['Quotation blocks empty PDF and Excel export', featureFiles.quotation, 'event.stopImmediatePropagation()'],
  ['Quotation notifies PO dashboard', featureFiles.quotation, "setItem('ac-orders-updated-at'"],
  ['Quotation keeps PO and quoted quantities separate', featureFiles.quotation, 'quotedQuantity'],
  ['Quotation saves latest quotation', featureFiles.quotation, 'pakarang-latest-quotation']
];
for (const [label,source,needle] of dataFlow) if (!source.includes(needle)) fail(`Broken data flow: ${label}`);

const customerLoginHtml = fs.readFileSync(path.join(root,'pages','Pakarang-Customer-Login.html'),'utf8');
if (!customerLoginHtml.includes('href="A-C-Sales-Login.html"')) fail('Missing sales login entry on customer login page');
const securityChecks = [
  ['Password uses PBKDF2', customerAuth, "name:'PBKDF2'"],
  ['Password uses SHA-256', customerAuth, "hash:'SHA-256'"],
  ['Plain password removed after migration', customerAuth, 'delete secured.password'],
  ['Legacy password storage removed', customerAuth, "removeItem('ac-customer-password')"],
  ['Login attempt throttling', customerAuth, 'lockedUntil'],
  ['Login one minute lock', customerAuth, 'lockMinutes=1'],
  ['Legacy login lock clamped to one minute', customerAuth, 'state.lockedUntil>now+60000'],
  ['Login countdown display', fs.readFileSync(path.join(root,'js','Pakarang-Customer-Login.js'),'utf8'), 'setInterval(update,1000)'],
  ['Expiring customer session', customerAuth, 'expiresAt'],
  ['Login requires an existing account', fs.readFileSync(path.join(root,'js','Pakarang-Customer-Login.js'),'utf8'), 'identityMatches'],
  ['Order page requires valid login session', customerOrderGuard, 'validSession()'],
  ['Remember me stores login only', fs.readFileSync(path.join(root,'js','Pakarang-Customer-Login.js'),'utf8'), 'ac-remembered-login'],
  ['Reset attempt throttling', fs.readFileSync(path.join(root,'js','A-C-Forgot-Password.js'),'utf8'), 'RESET_ATTEMPT_KEY']
];
for (const [label,source,needle] of securityChecks) if (!source.includes(needle)) fail(`Missing security control: ${label}`);
for (const [label,needle] of [['Thai geography database','thailand-geography.json'],['Subdistrict suggestions','subdistrictNameTh'],['District autofill','districtNameTh'],['Province autofill','provinceNameTh'],['Postal code autofill','postalCode'],['Keyboard selection','ArrowDown'],['Close all suggestion menus',"querySelectorAll('.address-suggestions')"],['Programmatic fill does not reopen menus',"new Event('change'"]]) if (!addressAutocomplete.includes(needle)) fail(`Missing address autocomplete: ${label}`);
for (const [label,needle] of [['House number field','addressHouse'],['Subdistrict field','subdistrict'],['District field','district'],['Province field','province'],['Postal code field','postalCode'],['Composed address','hidden.value']]) if (!addressFields.includes(needle)) fail(`Missing structured address: ${label}`);
if (failures) process.exitCode = 1; else console.log('Project check passed');
