function game(aWidth,aHeight)
{
    this.m_CanvasWidth = aWidth;
    this.m_CanvasHeight = aHeight;
    this.m_State = { "INIT": 0, "PLAY": 1, "PAUSE": 2, "WIN":3, "LOSE":4};
	this.m_State = "INIT";//init
    this.m_Score = 0;
	this.m_Lives = 0;
    this.m_Ammo = 0;
    this.m_gameConsts = new gameConsts();
    this.m_Player = new player(32,29,100,100);
	this.m_BackGround = new backDrop(600,600,0,0);
    this.m_Splash = new backDrop(400,100,this.m_CanvasWidth*.5,this.m_CanvasHeight*.5);
    this.m_Pause = new backDrop(400,100,this.m_CanvasWidth*.5,this.m_CanvasHeight*.5);
    this.m_Die = new backDrop(400,100,this.m_CanvasWidth*.5,this.m_CanvasHeight*.5);
    this.m_Projectiles = new objHolder();
    this.m_GameSprites = new objHolder();     
    this.m_PlayState = {"AVOID":0, "SHIELD":1, "SHOOT":2 ,"SUPER": 3, "DEATH":4};
    this.m_PlayState = 0
    this.m_Timer = new timer(1000);
    
	
	this.initGame = function(aDev)
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
	
	this.setGame = function(aDev)
	{
		this.m_Score = 0;
		this.m_Lives = 5;
		this.m_GameSprites.clearObjects();
		this.m_Player.movePos(250,250);
        this.m_PlayState = "AVOID";
        this.m_Ammo = 0;
        this.setMouseToPlayer(aDev,this.m_Player);
    } 
    //this is used when the game needs an object (player) bounded to mouses location
	this.setMouseToPlayer = function(aDev,aPlayer)
	{
		aDev.setupMouse(aPlayer,aDev);
	}  
}

function gameConsts()
{
    this.bulletSpeed = 550;
	this.orbSpeed = 200;
	this.shieldTime = 3;
    this.playKey = 32;
    this.resetKey = 82;
    this.pauseKey = 80;
}


