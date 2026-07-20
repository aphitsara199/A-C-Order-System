(()=>{
  const auth=window.ACAuth,password=document.getElementById('password'),toggle=document.getElementById('toggle'),form=document.getElementById('loginForm');
  const username=form.querySelector('[name="username"]'),remember=form.querySelector('.options input[type="checkbox"]'),success=document.getElementById('message'),submitButton=form.querySelector('[type="submit"]');
  const error=document.createElement('div');error.className='message';error.setAttribute('role','alert');error.style.cssText='background:#fff0f0;color:#a33';success.after(error);
  password.minLength=4;password.maxLength=6;password.placeholder='รหัสผ่าน 4-6 ตัว';username.maxLength=60;username.autocapitalize='none';
  const remembered=localStorage.getItem('ac-remembered-login')||'';if(remembered){username.value=remembered;remember.checked=true}else remember.checked=false;
  toggle.addEventListener('click',()=>{const visible=password.type==='text';password.type=visible?'password':'text';toggle.textContent=visible?'แสดง':'ซ่อน'});
  document.getElementById('forgotButton').addEventListener('click',()=>location.href='A-C-Forgot-Password.html');
  document.getElementById('registerButton').addEventListener('click',()=>location.href='A-C-Customer-Register.html');
  const showError=message=>{error.textContent=message;error.style.display='block';success.style.display='none'};
  let countdownTimer;
  const startCountdown=lockedUntil=>{
    clearInterval(countdownTimer);submitButton.disabled=true;
    const safeLockedUntil=Math.min(lockedUntil,Date.now()+60000);
    const update=()=>{const seconds=Math.max(0,Math.min(60,Math.ceil((safeLockedUntil-Date.now())/1000)));if(seconds>0){showError(`ใส่รหัสผิดครบ 5 ครั้ง กรุณารอ ${seconds} วินาที`);return}clearInterval(countdownTimer);auth.clearFailures();submitButton.disabled=false;error.textContent='ปลดล็อกแล้ว กรุณากรอกรหัสผ่านที่ถูกต้อง';error.style.display='block';password.value='';password.focus()};
    update();countdownTimer=setInterval(update,1000);
  };
  const initialState=auth.attemptState();if(initialState.lockedUntil>Date.now())startCountdown(initialState.lockedUntil);
  form.addEventListener('submit',async event=>{
    event.preventDefault();error.style.display='none';
    const button=submitButton,entered=username.value.trim(),enteredPassword=password.value,state=auth.attemptState();
    if(state.lockedUntil>Date.now()){startCountdown(state.lockedUntil);return}
    if(!entered||enteredPassword.length<4||enteredPassword.length>6){showError('กรุณากรอกชื่อผู้ใช้หรือเบอร์โทร และรหัสผ่าน 4-6 ตัว');return}
    button.disabled=true;button.textContent='กำลังตรวจสอบ…';
    try{
      const account=auth.read(localStorage,auth.ACCOUNT_KEY,{}),enteredPhone=auth.normalizePhone(entered),savedPhone=auth.normalizePhone(account.phone);
      const identityMatches=!!account.username&&(auth.normalizeUser(entered)===auth.normalizeUser(account.username)||(enteredPhone.length>=9&&enteredPhone===savedPhone));
      const passwordMatches=identityMatches&&await auth.verifyPassword(account,enteredPassword);
      if(!identityMatches||!passwordMatches){const failed=auth.recordFailure();if(failed.lockedUntil)startCountdown(failed.lockedUntil);else showError(`ชื่อผู้ใช้ เบอร์โทร หรือรหัสผ่านไม่ถูกต้อง (ผิด ${failed.attempts.length}/5 ครั้ง)`);return}
      auth.clearFailures();const currentCustomer={company:account.company||'',contact:account.contact||account.username||'',username:account.username||'',phone:account.phone||'',taxId:account.taxId||'',address:account.address||''};
      localStorage.setItem('ac-current-customer',JSON.stringify(currentCustomer));if(remember.checked)localStorage.setItem('ac-remembered-login',entered);else localStorage.removeItem('ac-remembered-login');
      auth.createSession(account);success.style.display='block';setTimeout(()=>location.replace('Pakarang-Customer-Order.html'),350);
    }catch(loginError){showError(loginError.message||'ไม่สามารถตรวจสอบบัญชีได้ กรุณาลองใหม่')}
    finally{button.disabled=auth.attemptState().lockedUntil>Date.now();button.innerHTML='เข้าสู่ระบบ <span>→</span>'}
  });
})();
