// init values for controller or game objects
//var screenWidth = 600;
//var screenHeight = 600;
var time = 0;
const frameRateValue = 1000;	

//make our game object
var myGame = new Game();

//init main objects to get the game up and running
//controller sets up things and directs how things should work together, game object depends on controller to take care of details 
var myControl = new controller(myGame.gameConsts.screenWidth,myGame.gameConsts.screenHeight);

//init the actual game using controller
myControl.initGame(myGame);



//this is how we do game loop with frame rate using the 
//window.requestAnimationFrame function 
function run() 
{
    window.requestAnimationFrame(run);
    var now = new Date().getTime();
    var dt = (now - (time || now))/frameRateValue;
	myControl.update(myGame,dt);
	myControl.render(myGame);
    time = now;
    
	//***DEBUGING text lines example
    //myControl.m_Dev.debugText(myGame.m_PlayState,50,50);
}

run();

	
