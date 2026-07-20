(()=>{
  const auth=window.ACAuth,form=document.querySelector('#form'),pass=document.querySelector('#password'),confirmPass=document.querySelector('#confirm'),error=document.querySelector('#error');
  pass.minLength=4;pass.maxLength=6;confirmPass.minLength=4;confirmPass.maxLength=6;pass.placeholder='รหัสผ่าน 4-6 ตัว';confirmPass.placeholder='กรอกอีกครั้ง';
  document.querySelector('.show').onclick=event=>{const show=pass.type==='password';pass.type=show?'text':'password';confirmPass.type=show?'text':'password';event.target.textContent=show?'ซ่อน':'แสดง'};
  form.onsubmit=async event=>{
    event.preventDefault();error.style.display='none';const data=Object.fromEntries(new FormData(form)),phone=auth.normalizePhone(data.phone),username=String(data.username||'').trim();
    if(username.length<3||username.length>60){error.textContent='ชื่อผู้ใช้ต้องมีความยาว 3-60 ตัว';error.style.display='block';return}
    if(phone.length<9||phone.length>10){error.textContent='กรุณากรอกเบอร์โทรศัพท์ 9-10 หลักให้ถูกต้อง';error.style.display='block';return}
    if(pass.value!==confirmPass.value||pass.value.length<4||pass.value.length>6){error.textContent='รหัสผ่านต้องตรงกันและมีความยาว 4-6 ตัว';error.style.display='block';return}
    const button=form.querySelector('[type="submit"]');button.disabled=true;
    try{await auth.secureAccount({...data,username,phone,registeredAt:new Date().toISOString()},pass.value);document.querySelector('#fields').style.display='none';document.querySelector('#success').style.display='block'}
    catch(saveError){error.textContent=saveError.message||'ไม่สามารถบันทึกบัญชีได้';error.style.display='block'}finally{button.disabled=false}
  };
  document.querySelector('.logo').src='../assets/images/ac-foods-shop-logo.jpg';
})();
