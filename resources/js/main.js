window.onload = function(){

	var WindowWidth = Math.max(
        document.body.scrollWidth, document.documentElement.scrollWidth,
        document.body.offsetWidth, document.documentElement.offsetWidth,
        document.body.clientWidth, document.documentElement.clientWidth
    );



	 if (WindowWidth<=1220){
	 	var state = 'hide';
	 	function show_hide_menu(){
	 		if(state == 'hide'){
	 			document.querySelector('.nav__list').style.transform = "translateY(0px)";
	 			document.querySelector('.nav__toggle').classList.add('nav__toggle-touch');
	 			state = 'show'
	 		}else{
	 			document.querySelector('.nav__list').style.transform = "translateY(-800px)";
	 			document.querySelector('.nav__toggle').classList.remove('nav__toggle-touch');
	 			state = 'hide'
	 		}
	 		
	 	}
	 	document.querySelector('.nav__toggle').addEventListener("click", show_hide_menu);
	 }
}