(()=>{
  const names=['addressHouse','subdistrict','district','province','postalCode'];
  const start=()=>{
    const fields=Object.fromEntries(names.map(name=>[name,document.querySelector(`[name="${name}"]`)])),hidden=document.querySelector('[name="address"]');if(!hidden||names.some(name=>!fields[name]))return;
    const sync=()=>{fields.postalCode.value=fields.postalCode.value.replace(/\D/g,'').slice(0,5);hidden.value=[fields.addressHouse.value,fields.subdistrict.value&&`ต.${fields.subdistrict.value}`,fields.district.value&&`อ.${fields.district.value}`,fields.province.value&&`จ.${fields.province.value}`,fields.postalCode.value].filter(Boolean).join(' ').replace(/\s+/g,' ').trim()};
    const fillStructuredCustomer=()=>{let customer={};try{customer=JSON.parse(localStorage.getItem('ac-current-customer'))||JSON.parse(localStorage.getItem('ac-customer-account'))||{}}catch{};names.forEach(name=>{if(customer[name])fields[name].value=customer[name]});if(!names.some(name=>fields[name].value)&&hidden.value)fields.addressHouse.value=hidden.value;sync()};
    names.forEach(name=>{fields[name].addEventListener('input',sync);fields[name].addEventListener('change',sync)});document.querySelector('#orderForm')?.addEventListener('submit',sync,true);fillStructuredCustomer();
  };document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start):start();
})();
