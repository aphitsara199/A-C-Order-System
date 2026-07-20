(()=>{
  if(!window.ACAuth?.validSession()){location.replace('Pakarang-Customer-Login.html');return}
  window.addEventListener('pageshow',()=>{if(!window.ACAuth?.validSession())location.replace('Pakarang-Customer-Login.html')});
  window.addEventListener('DOMContentLoaded',()=>document.querySelector('.top a[href="Pakarang-Customer-Login.html"]')?.addEventListener('click',()=>window.ACAuth.logout()));
})();
