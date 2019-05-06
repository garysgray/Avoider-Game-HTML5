// init values for controller or game objects
const FRAME_RATE = 1000;	
var time = 0;

//make our game object that loads data that is particular
//to this game 
var myGame = new Game();

//controller helps set things up and directs how things should work together
//game object depends on controller to take care of coordination 
//controller uses games data to help game
var myControl = new Controller(myGame.gameConsts.screenWidth,myGame.gameConsts.screenHeight);

//init the actual game using controller but with games inards
myControl.initGame(myGame);

//this is how we do game loop with frame rate using the 
//window.requestAnimationFrame function 
function run() 
{
    window.requestAnimationFrame(run);
    var now = new Date().getTime();
    var dt = (now - (time || now))/FRAME_RATE;
	myControl.updateGame(myGame,dt);
    time = now;
    
	//***DEBUGING text lines example
    //myControl.m_Dev.debugText(myGame.playState,50,50);
}

run();

