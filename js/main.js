// init values for controller or game objects
var time = 0;
const frameRateValue = 1000;	

//make our game object that loads data that is particular
//to this game 
var myGame = new Game();

//controller helps set things up and directs how things should work together
//game object depends on controller to take care of coordination 
//controller uses games data to help game
var myControl = new controller(myGame.gameConsts.screenWidth,myGame.gameConsts.screenHeight);

//init the actual game using controller but with games inards
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

	
//get rid of name and use type which is an enum
//figure out whats up with enums and states
//have backdrop object in an array instead of menbers
//magic numbers in controller 
//figure out classes issue for game object
//make an official bug page/weird class issue with gameobject
//use objects updates correctly
//start moving code from controller to game or tools