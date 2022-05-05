
window.addEventListener("DOMContentLoaded", e => {


    function openCity(evt, cityName) {
      let i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
      document.getElementById(cityName).style.display = "block";
      evt.currentTarget.className += " active";
  }
  
  function switchFunction(){
    const switchs = document.querySelector(".switch");
    const switch__indicator = document.querySelector(".switch .switch__indicator");
    let value = true;
    switchs.addEventListener("click",e =>{
      e.preventDefault();
      if(value){
        value = false
        switch__indicator.style.right = "0";
        console.log("folse");
      }else{
        value = true;
        switch__indicator.style.right = "calc(100% - 4rem)";
        console.log("true");
      }
    })
  }
  switchFunction();
  
  })