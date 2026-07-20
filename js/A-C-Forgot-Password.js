(()=>{
  const auth=window.ACAuth,form=document.querySelector('#form'),pass=document.querySelector('#password'),confirmPass=document.querySelector('#confirm'),error=document.querySelector('#error'),phoneField=document.querySelector('[name="phone"]');
  document.querySelector('[name="username"]')?.closest('.field')?.remove();document.querySelector('.intro').textContent='กรอกเบอร์โทรศัพท์ที่ใช้สมัครสมาชิก แล้วตั้งรหัสผ่านใหม่ได้ทันที';
  phoneField.inputMode='numeric';phoneField.autocomplete='tel';phoneField.maxLength=12;phoneField.placeholder='กรอกเบอร์โทรศัพท์';pass.minLength=4;pass.maxLength=6;confirmPass.minLength=4;confirmPass.maxLength=6;
  document.querySelector('#show').onclick=event=>{const visible=pass.type==='text';pass.type=visible?'password':'text';confirmPass.type=visible?'password':'text';event.target.textContent=visible?'แสดง':'ซ่อน'};
  form.onsubmit=async event=>{
    event.preventDefault();error.style.display='none';const state=auth.attemptState(auth.RESET_ATTEMPT_KEY);
    if(state.lockedUntil>Date.now()){error.textContent='ตรวจสอบเบอร์โทรไม่สำเร็จหลายครั้ง กรุณารอ 30 นาที';error.style.display='block';return}
    const account=auth.read(localStorage,auth.ACCOUNT_KEY,{}),enteredPhone=auth.normalizePhone(phoneField.value),savedPhone=auth.normalizePhone(account.phone);
    if(!savedPhone||enteredPhone.length<9||enteredPhone!==savedPhone){const failed=auth.recordFailure(auth.RESET_ATTEMPT_KEY,5,30);error.textContent=failed.lockedUntil?'ตรวจสอบไม่สำเร็จหลายครั้ง ระบบล็อกชั่วคราว 30 นาที':'ไม่สามารถตรวจสอบข้อมูลได้ กรุณาตรวจสอบเบอร์โทรศัพท์';error.style.display='block';return}
    if(pass.value!==confirmPass.value||pass.value.length<4||pass.value.length>6){error.textContent='รหัสผ่านต้องตรงกันและมีความยาว 4-6 ตัว';error.style.display='block';return}
    const button=form.querySelector('[type="submit"]');button.disabled=true;
    try{await auth.secureAccount(account,pass.value);auth.clearFailures(auth.RESET_ATTEMPT_KEY);auth.logout();document.querySelector('#formStage').style.display='none';document.querySelector('#success').style.display='block'}
    catch(resetError){error.textContent=resetError.message||'ไม่สามารถรีเซ็ตรหัสผ่านได้';error.style.display='block'}finally{button.disabled=false}
  };
})();
