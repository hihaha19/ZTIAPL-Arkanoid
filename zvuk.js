window.addEventListener("load", function() {	

	var zvuk = document.getElementById("ImageButton1");	//vypnuty zvuk 
	 
	zvuk.addEventListener("click", function() {
    var audioElem = document.getElementById('hudba_pozadie');
    if (audioElem.paused)
		audioElem.play();
    else
		audioElem.pause();
  });
 });