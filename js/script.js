var hide = document.getElementById("hide-side")

hide.addEventListener("click", function() {
    var sidebar = document.getElementById("side-bar")
    var content = document.getElementById("content-container")
  
    if(hide.innerHTML == "HideSideBar()"){
        sidebar.classList.add("hide-side-bar");
      
        content.classList.add("expanded-content")
        hide.innerHTML = "ViewSideBar()";
    }
    else{
     
        setTimeout(function(){
            sidebar.classList.remove("hide-side-bar");

        }, 300);
        content.classList.remove("expanded-content")
        hide.innerHTML = "HideSideBar()";
    }
  

  });
var sidebar = document.getElementById("main-menu")
function mobileMenu(){
    sidebar.classList.toggle("openMenu")

}
function hideMenu(){
    sidebar.classList.remove("openMenu")
}