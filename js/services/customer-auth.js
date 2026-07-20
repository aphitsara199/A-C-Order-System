window.ACAuth=(()=>{
  const ACCOUNT_KEY='ac-customer-account';
  const SESSION_KEY='ac-customer-session';
  const ATTEMPT_KEY='ac-customer-login-attempts';
  const RESET_ATTEMPT_KEY='ac-customer-reset-attempts';
  const SESSION_AGE=8*60*60*1000;
  const encoder=new TextEncoder();
  const read=(storage,key,fallback=null)=>{try{return JSON.parse(storage.getItem(key))??fallback}catch{return fallback}};
  const normalizePhone=value=>String(value||'').replace(/\D/g,'');
  const normalizeUser=value=>String(value||'').trim().toLowerCase();
  const randomHex=bytes=>{const data=new Uint8Array(bytes);crypto.getRandomValues(data);return [...data].map(value=>value.toString(16).padStart(2,'0')).join('')};
  async function hashPassword(password,salt){
    if(!crypto?.subtle)throw new Error('กรุณาเปิดระบบผ่าน http://localhost:3000 เพื่อใช้งานอย่างปลอดภัย');
    const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);
    const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:encoder.encode(salt),iterations:120000,hash:'SHA-256'},key,256);
    return [...new Uint8Array(bits)].map(value=>value.toString(16).padStart(2,'0')).join('');
  }
  async function secureAccount(account,password){
    const salt=randomHex(16),passwordHash=await hashPassword(password,salt);
    const secured={...account,passwordHash,passwordSalt:salt,passwordUpdatedAt:new Date().toISOString()};
    delete secured.password;
    localStorage.setItem(ACCOUNT_KEY,JSON.stringify(secured));
    localStorage.removeItem('ac-customer-password');
    let customers=read(localStorage,'ac-customers',[]);if(!Array.isArray(customers))customers=[];
    const index=customers.findIndex(item=>normalizeUser(item.username)===normalizeUser(secured.username)||normalizePhone(item.phone)===normalizePhone(secured.phone));
    if(index>=0)customers[index]={...customers[index],...secured};else customers.unshift(secured);
    localStorage.setItem('ac-customers',JSON.stringify(customers));
    return secured;
  }
  async function verifyPassword(account,password){
    if(account?.passwordHash&&account?.passwordSalt)return (await hashPassword(password,account.passwordSalt))===account.passwordHash;
    const legacy=localStorage.getItem('ac-customer-password')||account?.password||'';
    if(!legacy||password!==legacy)return false;
    await secureAccount(account,password);
    return true;
  }
  function attemptState(key=ATTEMPT_KEY){
    const state=read(localStorage,key,{attempts:[],lockedUntil:0}),now=Date.now();
    state.attempts=(state.attempts||[]).filter(time=>now-time<15*60*1000);
    // Convert lock times left by the previous 15-minute rule to the new 60-second rule.
    if(key===ATTEMPT_KEY&&state.lockedUntil>now+60000)state.lockedUntil=now+60000;
    if(state.lockedUntil&&state.lockedUntil<=now){state.lockedUntil=0;state.attempts=[]}
    localStorage.setItem(key,JSON.stringify(state));return state;
  }
  function recordFailure(key=ATTEMPT_KEY,max=5,lockMinutes=1){const state=attemptState(key);state.attempts.push(Date.now());if(state.attempts.length>=max)state.lockedUntil=Date.now()+lockMinutes*60*1000;localStorage.setItem(key,JSON.stringify(state));return state}
  function clearFailures(key=ATTEMPT_KEY){localStorage.removeItem(key)}
  function createSession(account){
    const session={id:randomHex(24),createdAt:Date.now(),expiresAt:Date.now()+SESSION_AGE,username:account.username||'',phone:normalizePhone(account.phone)};
    sessionStorage.setItem(SESSION_KEY,JSON.stringify(session));return session;
  }
  function validSession(){const session=read(sessionStorage,SESSION_KEY,null);return !!(session?.id&&session.expiresAt>Date.now())}
  function logout(){sessionStorage.removeItem(SESSION_KEY);localStorage.removeItem('ac-current-customer')}
  return {ACCOUNT_KEY,ATTEMPT_KEY,RESET_ATTEMPT_KEY,normalizePhone,normalizeUser,read,hashPassword,secureAccount,verifyPassword,attemptState,recordFailure,clearFailures,createSession,validSession,logout};
})();
