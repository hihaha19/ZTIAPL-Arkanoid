window.addEventListener("load", function() {
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");

	 var ball = {
      x: 200,
      y: 500,
      dx: 2,
      dy: -2,
      radius: 15
    }

	var	pozadie = document.getElementById("pozadie");
	var space = document.getElementById("space");
	var bonus = document.getElementById("bonus");
	var tehla = document.getElementById("tehla");
	var lopta = document.getElementById("lopta");
	
	var paddleHeight = 10;
	var paddleWidth = 120;
	var paddleX = (canvas.width-paddleWidth)/2;	//startovacia poloha
	var rychlost = 7;
	var bonusNaObrazovke = 0;
	
	var brickRowCount = 7;
	var brickColumnCount = 8;
	var brickWidth = 75;
	var brickHeight = 20;
	var brickPadding = 10;
	var brickOffsetTop = 30;
	var brickOffsetLeft = 30;
	var pocetTehiel = brickRowCount*brickColumnCount;
	
	var rightPressed = false;
	var leftPressed = false;
	var spacePressed = false;
	var medzernikBolStlaceny = false;

	var isPlaying=false;	
	
	var pocetBonusov = 15;
	
	var pustiZvuk = document.getElementById("ImageButton1");	//vypnuty zvuk 
	  
	pustiZvuk.addEventListener("click", function() {
    var zvuk = document.getElementById('hudba_pozadie');
    if (zvuk.paused)
		zvuk.play();
    else
		zvuk.pause();
  });

	document.getElementById("level").innerHTML = "Ľahká";
	var score = 0;

	document.getElementById("skore").innerHTML = "0";
	document.getElementById("zivoty").innerHTML = "2";


	var bricks = [];
	for (var c=0; c < brickColumnCount; c++) {
		bricks[c] = [];
		for(var r=0; r<brickRowCount; r++) {
			bricks[c][r] = {x: 0, y: 0, status: 1};
		}
	}
	
	var score = 0;
	var lives = 2;
	
	var padBonusu = {
      x: 12000,
      y: 12000,
      speed: 3,
    }
	
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	
	//Right a Left je pre IE/Edge prehliadace
	function keyDownHandler(e) {		//e je event as parameter
		if(e.key == "Right" || e.key == "ArrowRight") {
			rightPressed = true; }
			
		else if (e.key == "Left" || e.key == "ArrowLeft") {
			leftPressed = true; }
	}
	
	function keyUpHandler(e) {
		if(e.key == "Right" || e.key == "ArrowRight") {
			rightPressed = false; }
		else if (e.key == "Left" || e.key == "ArrowLeft") {
			leftPressed = false; }
	}
	
	function detekciaKolizii() {
		for (var c=0; c<brickColumnCount; c++) {
			for(var r =0; r<brickRowCount; r++) {
				var b = bricks[c][r];
				if(b.status == 1) {
				if(ball.x+30 > b.x && ball.x < b.x+brickWidth && ball.y+10 >b.y && ball.y < b.y+brickHeight) {
					ball.dy = -ball.dy;
					pocetTehiel--;
					b.status = 0;
					score++;
					document.getElementById("skore").innerHTML = score;
					if (pocetBonusov > 0) {
					if (Math.random() > 0.6 && bonusNaObrazovke == 0) {
					pocetBonusov--;
					bonusNaObrazovke = 1;
					padBonusu.x = ball.x;
					padBonusu.y = ball.y;
					vykresliPadBonusu();
						}
					}
					
					if(pocetTehiel <= 38 && pocetTehiel >= 20){
					document.getElementById("level").innerHTML = "Stredná";
						strednaObtiaznost();
					}
					
					if(pocetTehiel < 20){
					document.getElementById("level").innerHTML = "Ťažká";
						tazkaObtiaznost();
					}
					if(score == brickRowCount*brickColumnCount) {	
					window.location = "vyhra.html";
					}
				}
			}
		}
	}
}//tuto koncim

	function vykresliPozadie() {   		
		ctx.drawImage(pozadie, 0, 70);
	}
	//zrychli loptu
	function strednaObtiaznost(){
		ball.dx = -3.5;
		ball.dy = 3.5;
	}
	//zrychli loptu
	function tazkaObtiaznost(){
		ball.dx = -5.5;
		ball.dy = 5.5;
	}

	function vykresliLoptu(){	
	ctx.drawImage(lopta, ball.x-100, ball.y-52, 300, 100);
	}
	
	function vykresliPaddle() {
	ctx.drawImage(space, paddleX, canvas.height - paddleHeight + 10, paddleWidth, paddleHeight-30)
	}
	
	function vykresliTehly () {	
		for(var c=0; c<brickColumnCount; c++) {
			for(var r = 0; r<brickRowCount; r++) {

				if (bricks[c][r].status == 1) {
					var brickX = new createNewBrickColumn(c);
					var brickY = new createNewBrickRow(r);
						bricks[c][r].x = brickX.c;
						bricks[c][r].y = brickY.r;
						ctx.drawImage(tehla, brickX.c, brickY.r, brickWidth, brickHeight);
						}
					}
				}
			}
			
			
	//konstruktor
	function createNewBrickColumn(stlpec){
		this.c = (stlpec*(brickWidth+brickPadding))+brickOffsetLeft-15;
	}
	
	//konstruktor
	function createNewBrickRow(riadok){
		this.r = (riadok*(brickHeight+brickPadding))+brickOffsetTop+60;
	}
	
	function vykresliPadBonusu() {
		ctx.drawImage(bonus, padBonusu.x, padBonusu.y - 10, 50, 50);
    }

	function vykresliObdlznik(){
		ctx.fillStyle = '#00008B';
		ctx.fillRect(0, 0, canvas.width, 70);	
	}
	
	 //ak platforma zachyti padajuci bonus
	 function zachytenyBonus() {
        if ((padBonusu.y > canvas.height-55) && (padBonusu.x < paddleX + paddleWidth) && (padBonusu.x > paddleX)) {	
          padBonusu.x = 6000;	//presunie sa mimo obrazovku
          padBonusu.y = 6000;
		  bonusNaObrazovke = 0;
		  var vylepsenie = Math.random();
			if(vylepsenie >= 0 && vylepsenie < 0.2){
				lives++;
				document.getElementById("zivoty").innerHTML = lives;
				}
				
			if(vylepsenie >=0.2 && vylepsenie < 0.4){		//zvacsenie plosiny
			paddleWidth = paddleWidth+30;
				}
				
			if(vylepsenie >=0.4 && vylepsenie < 0.6){		//zrychlenie plosiny
			rychlost= rychlost+3;
				}
				
			if(vylepsenie >=0.6 && vylepsenie < 0.8 && rychlost >= 3){		//spomalenie plosiny
			rychlost= rychlost-2;
				}	
				
			if(vylepsenie >=0.8 && paddleWidth > 50){		//zmensenie plosiny
			paddleWidth = paddleWidth-25;
				}
		} 
	}	
	
	
	
	function vykresli(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	vykresliPozadie();
	vykresliObdlznik();
	vykresliTehly();
	vykresliLoptu();
	vykresliPaddle();


	zachytenyBonus();
	vykresliPadBonusu();
	
	padBonusu.y += padBonusu.speed;
	
	detekciaKolizii();
	
	if(medzernikBolStlaceny == false){
		ball.x = paddleX+30;
		ball.y = canvas.height - paddleHeight - 18;
	}
	
	document.body.onkeyup = function(e){
    if(e.keyCode == 32){
       medzernikBolStlaceny = true;
		}
	}
	
	if(medzernikBolStlaceny == true){
		ball.y += ball.dy;
		ball.x += ball.dx;
	}
	
	if (ball.x+ball.dx+30 > canvas.width-ball.radius || ball.x+ball.dx+30 < ball.radius) {		//odrazanie od stien
		ball.dx = -ball.dx;}
	
	if (ball.y+ball.dy - 70< ball.radius) {	
	ball.dy = -ball.dy; }
	
	else if  (ball.y+ball.dy > canvas.height-27) {
		if(ball.x+18 > paddleX-30 && ball.x < paddleX + paddleWidth) {
			ball.dy = -ball.dy;
		}
			
		else {
		medzernikBolStlaceny = false;
			lives--;
			document.getElementById("zivoty").innerHTML = lives;
			if(lives == 0) {				
				window.location = "prehra.html";
			}
			
			else {
				if(document.getElementById("level").innerHTML == "Ľahká"){
				ball.x = paddleX;
				ball.y = 550;
				ball.dx= 2;
				ball.dy= -2;
				paddleWidth = 120;
				rychlost = 7;
				paddleX = (canvas.width-paddleWidth)/2;
			}
			
			else if(document.getElementById("level").innerHTML == "Stredná"){
				ball.x = paddleX;
				ball.y = 550;
				ball.dx= 3.5;
				ball.dy= -3.5;
				paddleWidth = 120;
				rychlost = 7;
				paddleX = (canvas.width-paddleWidth)/2;
			}
			
			else {
				ball.x = paddleX;
				ball.y = 550;
				ball.dx= 5.5;
				ball.dy= -5.5;
				paddleWidth = 120;
				rychlost = 7;
				paddleX = (canvas.width-paddleWidth)/2;
			}
	}}}
	
	if(rightPressed) {
		paddleX += rychlost;
	if(paddleX + paddleWidth > canvas.width) {
		paddleX = canvas.width-paddleWidth; }
	}
	
	else if (leftPressed) {
		paddleX -= rychlost ;
		if(paddleX < 0) {
		paddleX = 0;}		
	}
	
	if(padBonusu.y > canvas.height) bonusNaObrazovke = 0;
	
	requestAnimationFrame(vykresli);
	}
	
vykresli();	
});