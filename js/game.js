class Game
{
    constructor()
    {
        //this._state = { "INIT": 0, "PLAY": 1, "PAUSE": 2, "WIN":3, "LOSE":4};
        this._state = "INIT";//init
        this._score = 0;
        this._lives = 0;
        this._ammo = 0;
        this._gameConsts = new GameConsts();
        this._canvasWidth = this._gameConsts.screenWidth;
        this._canvasHeight = this._gameConsts.screenHeight;
        this._player = new player(32,29,100,100);
        //this._playState = {"AVOID":0, "SHIELD":1, "SHOOT":2 ,"SUPER": 3, "DEATH":4};
        this._playState = 0        
        this._backGround = new backDrop(600,600,0,0);
        this._splashScreen = new backDrop(400,100,this._canvasWidth*.5,this._canvasHeight*.5);
        this._pauseScreen = new backDrop(400,100,this._canvasWidth*.5,this._canvasHeight*.5);
        this._dieScreen = new backDrop(400,100,this._canvasWidth*.5,this._canvasHeight*.5);
        this._projectiles = new objHolder();
        this._gameSprites = new objHolder();            
        this._timer = new timer(1000);
    }
    
    //get functions
    get state(){return this._state;}
    get score(){return this._score;}
    get lives(){return this._lives;}
    get ammo(){return this._ammo;}
    get gameConsts(){return this._gameConsts;}
    get player(){return this._player;}   
    get playState(){return this._playState;}
    get backGround(){return this._backGround;}
    get splashScreen(){return this._splashScreen;}
    get pauseScreen(){return this._pauseScreen;}
    get dieScreen(){return this._dieScreen;}
    get projectiles(){return this._projectiles;}
    get gameSprites(){return this._gameSprites;}
    get timer(){return this._timer;}
    
    //set Functions
    set state(newState){this._state = newState;}
    set playState(newState){this._playState = newState;}
    emptyAmmo(){this._ammo =0;}    
    increaseAmmo(amount){this._ammo += amount;}
    decreaseAmmo(amount){this._ammo -= amount;}
    decreaseLives(amount){this._lives -= amount;}
    increaseScore(amount){this._score += amount;}
    
    initGame(aDev)
	{
		var sprite1 = new sprite("img/bullet.png","bullet");
		var sprite2 = new sprite("img/orb.png","orb");
        var sprite3 = new sprite("img/fire.png","fireAmmo");
        var sprite4 = new sprite("img/ships.png","player");
        
        var sprite5 = new sprite("img/stars.png","background");
		var sprite6 = new sprite("img/splash.png","splash");
        var sprite7 = new sprite("img/pause.png","pause");
        var sprite8 = new sprite("img/die.png","die");

		aDev.m_Images.addImage(sprite1);
		aDev.m_Images.addImage(sprite2);
        aDev.m_Images.addImage(sprite3);
        aDev.m_Images.addImage(sprite4);
        aDev.m_Images.addImage(sprite5);
		aDev.m_Images.addImage(sprite6);
        aDev.m_Images.addImage(sprite7);
        aDev.m_Images.addImage(sprite8);

        aDev.audio.addSound("hit","audio/hit.wav");
        aDev.audio.addSound("shoot","audio/shoot.wav");
        aDev.audio.addSound("get","audio/get.wav");
        aDev.audio.addSound("hurt","audio/hurt.wav");	
	}
    
    setGame(aDev)
	{
		this._score = 0;
		this._lives = 5;
		this._gameSprites.clearObjects();
		this._player.movePos(250,250);
        this._playState = "AVOID";
        this._ammo = 0;
        this.setMouseToPlayer(aDev,this._player);
    } 
    //this is used when the game needs an object (player) bounded to mouses location
	setMouseToPlayer(aDev,aPlayer)
	{
		aDev.setupMouse(aPlayer,aDev);
	}  
}
class GameConsts
{
    constructor()
    {
        this._BULLET_SPEED = 550;
        this._ORB_SPEED = 200;
        this._SHIELD_TIME = 3;
        this._PLAY_KEY = 32;
        this._RESET_KEY = 82;
        this._PAUSE_KEY = 80;
        this._SCREEN_WIDTH = 600;
        this._SCREEN_HEIGHT = 600;
        this._AMMO_AMOUNT = 10;
        this._SCORE_INCREASE_VALUE = 10;
    }
    //getters
    get bulletSpeed(){return this._BULLET_SPEED;}
    get orbSpeed(){return this._ORB_SPEED;}
    get shieldTime(){return this._SHIELD_TIME;}
    get playKey(){return this._PLAY_KEY;}
    get resetKey(){return this._RESET_KEY;}
    get pauseKey(){return this._PAUSE_KEY;}
    get screenWidth(){return this._SCREEN_WIDTH;}
    get screenHeight(){return this._SCREEN_HEIGHT;}
    get ammoAmount(){return this._AMMO_AMOUNT;}
    get scoreIncreaseAmount(){return this._SCORE_INCREASE_VALUE;}   
}

