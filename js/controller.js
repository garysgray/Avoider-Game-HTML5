function controller(newWidth,newHeight)
{
	//our controller has a device object to control the HTML5 Canvas
    this.m_Dev = new device(newWidth,newHeight);
	//key events are wrapped in the device object as well, this sets them up
	this.m_Dev.initKeys();
	
	//helps with boundry checking and stuff
	this.buffer1 = 10;
	this.buffer2 = 20;
	this.rndRatio = 20;
	this.tempX = 0;
	this.tempY = 0;

	this.initGame = function(aGame)
	{
		aGame.initGame(this.m_Dev);
	}
	
	//*****Main Updatebased on aGame.m_State
    this.update = function(aGame,aDT)
    {		
		switch(aGame.state)
		{
			case "INIT"://init-gameState
			//this is how to reset the whole map and back to play state
			aGame.setGame(this.m_Dev);           
			//check to see if player has used input to start game
			if(this.m_Dev.checkKey(aGame.gameConsts.playKey))////spacebar key
			{
				aGame.state = "PLAY";
			}
			break;
			//////////////////////////////////////////////////////
			case "PLAY"://play-gameState	
			//**UPDATE INPUT LOGIC FUNCTIONS **
            //if the player has gotten a fire object they should be able to shoot now
            if(aGame.playState == "SHOOT")
            {
                //this is used to have an event like shooting something when player hits mouse button
                this.checkUserInput(aGame); 
            }
			//changes state of game when player uses input to pause game which takes us to something else
			this.checkforPause(aGame);
			//**UPDATE GAME OBJECTS**
			//**player 
			//this is a reminder that you can have objects update stuff  by calling their own update function 
			//or have call the function yourself under controller directly based on how abstract you wont functions called
			aGame.player.update(this.m_Dev,aDT);
			aGame.player.borderCheck(this.m_Dev);
            //this timer is to tell us when the shield timer is up and state changes to avoid
			////if timer is still going (active) then update it
			//when time is up then the player goes out of shield mode and in to avoider mode
            if(aGame.timer.active == true)
            {
                if(aGame.timer.update())
                {
                 aGame.playState = "AVOID";
                }
            }
			//**UPDATE NPC OBJECTS*
            this.updateNPCSprites(aGame,aDT);
			//function in controller Fix eventually go into another object
			this.updateProjectiles(aGame,aDT);
			//**UPDATE COLLISIONS FUNCTIONS**
			//if player is not in shield mode then we apply collisions
            if(aGame.playState != "SHIELD")
            {
                this.check_NPC_Collision(aGame);
            }
			break;
			//////////////////////////////////////////////////////
			case "PAUSE"://pause-state
			//this is to hold the position of the player in last location while in pause
			//so when they come out we can kinda put them back where they were
			//if they did not move mouse to much
				aGame.player.m_PosX = this.tempX;
				aGame.player.m_PosY = this.tempY;  
                //check to see if player has used input to un-pause game
				if(this.m_Dev.checkKeyUp(aGame.gameConsts.pauseKey))//P-key
				{	
					aGame.playState = "SHIELD"
					aGame.timer.set(aGame.gameConsts.shieldTime);
					aGame.state = "PLAY";
				}
				//little cheat to restart game
				if(this.m_Dev.checkKey(aGame.gameConsts.resetKey))//R-keyr
				{
					aGame.state = "INIT";//init gameStateo
				}
			break;
			//////////////////////////////////////////////////////
			case "WIN"://Win-gameState
			{
                //check to see if player has used input to restart game
				if(this.m_Dev.checkKey(aGame.gameConsts.resetKey))//R-key
				{
					aGame.state = "INIT";//init gameState
				}
			}
			break;
			//////////////////////////////////////////////////////
			case "LOSE"://Lose-gameState
			{	
				//this is to hold the image of the player in last location after dying
				//its to help show the death image in there location of death on screen
                aGame.player.m_PosX = this.tempX;
				aGame.player.m_PosY = this.tempY;               
				if(aGame.lives <= 0)
				{
                    console.log("no lives")
                    //check to see if player has used input to restart game
					if(this.m_Dev.checkKey(aGame.gameConsts.resetKey))//R-key
					{
						aGame.state = "INIT";//init gameState      
					}
				}
				else
				{
                    //check to see if player has used input to restart game
					if(this.m_Dev.checkKey(aGame.gameConsts.resetKey))//R-key
					{
						//clear all objects (orbs) out of arrays so that there is a fresh screen next round
						//projectiles are cleared when they hit an object or go off screen
                        aGame.emptyAmmo();
						aGame.gameSprites.clearObjects();
						aGame.state = "PLAY";
                        aGame.timer.set(aGame.gameConsts.shieldTime);
                        aGame.playState = "SHIELD";
					}
				}
			}
			break;
			//////////////////////////////////////////////////////
			default:
		}
    }
    
    this.render = function(aGame)
    {
        //canvas render stuff
        this.m_Dev.m_Ctx.fillStyle = '#000';
        this.m_Dev.m_Ctx.fillRect(0, 0, canvas.width, canvas.height);
        //canvas render text stuff
		this.m_Dev.setFont("bold 14pt Calibri");
		this.m_Dev.colorText("white");
        
        //use game state to dictate what should render
		switch(aGame.state)
		{
			case "INIT"://init-gameState
            {
                
				//set up props background and title bar/splash screen
                this.m_Dev.renderImage(this.m_Dev.m_Images.getImage("background"),aGame.backGround);
                this.m_Dev.centerImage(this.m_Dev.m_Images.getImage("splash"),aGame.splashScreen);
				//text to help player out
				this.m_Dev.centerTextX("CATCH  FIRE  BALLS  TO  GET  AMMO",this.m_Dev.m_Canvas.height-150);
				this.m_Dev.centerTextX("USE  SPACE-BAR  TO  FIRE",this.m_Dev.m_Canvas.height-100);
				this.m_Dev.centerTextX("PRESS  THE  SPACE-BAR  TO  START",this.m_Dev.m_Canvas.height-50);
            }
			break;
			
			case "PLAY"://play-gameState	
            {
				this.m_Dev.colorText("red");//changes color of font until its changed
                this.m_Dev.renderImage(this.m_Dev.m_Images.getImage("background"),aGame.backGround);
                ////functions for rendering game objects are done 
                this.renderNPCSprites(aGame);
                this.renderBullets(aGame);
				this.renderPlayer(aGame);
				////HUD
                //magic numbers
				this.m_Dev.centerTextX("Score :  "+ aGame.score.toString(),this.m_Dev.m_Canvas.height-25);
				this.m_Dev.putText("Ammo :  "+ aGame.ammo.toString(),25,this.m_Dev.m_Canvas.height-25);
				this.m_Dev.putText("Lives :  "+ aGame.lives.toString(),500,this.m_Dev.m_Canvas.height-25);	  
            }
			break;
 
			case "PAUSE"://pause-state
            {
				this.m_Dev.colorText("white");//font will be this color untill changed
				//set up props background and title bar/splash screen
                this.m_Dev.renderImage(this.m_Dev.m_Images.getImage("background"),aGame.backGround);
                this.m_Dev.centerImage(this.m_Dev.m_Images.getImage("pause"),aGame.pauseScreen);
				//text to help player out
				//magic numbers
				this.m_Dev.centerTextX("PRESS  P  TO  RESUME  GAME",this.m_Dev.m_Canvas.width/4,this.m_Dev.m_Canvas.height-50);
            }
			break;
			case "WIN"://Win-gameState
			{
				this.m_Dev.centerTextX("PRESS  THE  R  KEY  TO  PLAY",this.m_Dev.m_Canvas.width/4,this.m_Dev.m_Canvas.height-50);
			}
			break;
            //magic numbers
			case "LOSE"://Lose-gameState
			{	
				this.m_Dev.renderImage(this.m_Dev.m_Images.getImage("background"),aGame.backGround);
				this.m_Dev.centerImage(this.m_Dev.m_Images.getImage("die"),aGame.dieScreen);
					
				if(aGame.lives <= 0)
				{				
					this.m_Dev.centerTextX("SORRY  YOU  LOST,  PRESS  R  TO  RETRY",this.m_Dev.m_Canvas.width/4,this.m_Dev.m_Canvas.height-50);
				}
				else
				{
					this.m_Dev.centerTextX("SORRY  YOU  DIED,  PRESS  R  TO  REVIVE",this.m_Dev.m_Canvas.width/4,this.m_Dev.m_Canvas.height-50);
				}
				this.renderPlayer(aGame);
			}
			break;
			default:		
		}	
    }
	//**UPDATE INPUT LOGIC FUNCTIONS **
	this.checkforPause = function(aGame)
	{
		if(this.m_Dev.checkKeyUp(aGame.gameConsts.pauseKey))//P-key
		{	this.tempX = aGame.player.m_PosX;
			this.tempY= aGame.player.m_PosY;
			aGame.state = "PAUSE";//pause gameState
		}
	}
    
	 //this is used when the game needs an object (player) bounded to mouses location
	// this.setMouseToPlayer = function(aPlayer)
	// {
		// this.m_Dev.setupMouse(aPlayer,this.m_Dev);
	// }
		
	//this is an function that checks to see if the mouse button is clicked 
	//for now it adds objects to the projectilesHolder and shoots a projectile
	this.checkUserInput = function(aGame)
	{
		 if(this.m_Dev.m_MouseDown && Date.now()-aGame.player.m_ProjectileTimer > aGame.player.m_ShootDelay || 
            this.m_Dev.checkKey(aGame.gameConsts.playKey)  && Date.now()-aGame.player.m_ProjectileTimer > aGame.player.m_ShootDelay)
        {
            var bullet = new gameObject("bullet",12,12,(aGame.player.m_PosX) ,aGame.player.m_PosY ,aGame.gameConsts.bulletSpeed);
//->A2C	////this is where objects are getting adjusted to the center
            bullet.m_PosX -= bullet.m_Width*.5;
            bullet.m_PosY += bullet.m_Height*.5;
            aGame.projectiles.addObject(bullet);			
			////this is where we set the players shoot delay timer 
            aGame.player.m_ProjectileTimer = Date.now();
            ////the audio sound of shooting
            this.m_Dev.audio.playSound("shoot");          
            if(aGame.ammo <= 0)
            {
                aGame.playState = "AVOID";
            }
            else
            {
                 aGame.decreaseAmmo(1);
            }
        }
	}
	
	  //////////////////////
	//**UPDATE GAME OBJECTS**
	this.updateProjectiles = function(aGame, aDT)
	{
		 for( var i = 0; i< aGame.projectiles.getSize() ;i++)
        {
            aGame.projectiles.getIndex(i).m_PosY -= aGame.projectiles.getIndex(i).m_Speed * aDT;
			 
			 if(aGame.projectiles.getIndex(i).m_PosY < 0)
            {
                aGame.projectiles.subObject(i);
            }
        }		
		this.updateProjectilesCollision(aGame, aDT)
		
	}

    this.updateNPCSprites = function(aGame,aDT)
	{		
		if(Math.random() < 1/this.rndRatio)
		{
			//this is made to help get us a X pos  in range that will not let orb be off the screen
			//buff values help dial in perfect position
			var rndXValue = Math.floor(Math.random() *((this.m_Dev.m_Canvas.width-this.buffer1)-this.buffer2+1));		
            orb = new gameObject("orb",29,29,rndXValue,0, aGame.gameConsts.orbSpeed);
					
			for(var i = 0;i < aGame.gameSprites.getSize();i++)
			{			
				var count = 0;
				while(orb.checkObjCollision(aGame.gameSprites.getIndex(i)) )
				{
					if(count > 3)
					{
						break;
					}
					var rndXValue = Math.floor(Math.random() *((this.m_Dev.m_Canvas.width-(this.buffer1*count))-(this.buffer2*count)+1));
					orb.movePos = (rndXValue,0);
					count ++;
				}		
			}
			aGame.gameSprites.addObject(orb);        
		}
        
        if(Math.random() < 1/99)
		{
			//this is made to help get us a X pos  in range that will not let sprite be off the screen
			//buff values help dial in perfect position
			var rndXValue = Math.floor(Math.random() *((this.m_Dev.m_Canvas.width-this.buffer1)-this.buffer2+1));			
			fireAmmo = new gameObject("fireAmmo",20,20,rndXValue,0, aGame.gameConsts.orbSpeed);       
			for(var i = 0;i < aGame.gameSprites.getSize();i++)
			{
				var count = 0;
				while(fireAmmo.checkObjCollision(aGame.gameSprites.getIndex(i)) )
				{
					if(count > 3)
					{
						break;
					}
					var rndXValue = Math.floor(Math.random() *((this.m_Dev.m_Canvas.width-(this.buffer1*count))-(this.buffer2*count)+1));
					fireAmmo.movePos = (rndXValue,0);
					count ++;
				}				
			}
			aGame.gameSprites.addObject(fireAmmo);     
		}
        //magic numbers
		//check to see if sprite is off screen, if it is delete it from array
		for(var i = 0;i <  aGame.gameSprites.getSize(); i++)
		{
			 aGame.gameSprites.getIndex(i).moveDown(aDT);			 
			 if(aGame.gameSprites.getIndex(i).m_PosY > this.m_Dev.m_Canvas.height-100)
			 {
				aGame.gameSprites.subObject(i);
			 }
		}	
		
	}
    
	//////////////////////
   //**UPDATE COLLISIONS FUNCTIONS**
	this.check_NPC_Collision = function(aGame)
	{
		for(var i =0;i< aGame.gameSprites.getSize();i++)
		{
			if(aGame.player.checkObjCollision(aGame.gameSprites.getIndex(i)))
			{            
                if(aGame.gameSprites.getIndex(i).m_Name == "fireAmmo")
                {					
                    this.m_Dev.audio.playSound("get");
                    aGame.gameSprites.subObject(i);
                    aGame.playState = "SHOOT";
                    aGame.increaseAmmo(aGame.gameConsts.ammoAmount);					
                }
                else
                {
                    this.m_Dev.audio.playSound("hurt");
                    aGame.playState = "DEATH";                   
                    aGame.gameSprites.subObject(i);
                    aGame.decreaseLives(1);
                    aGame.state = "LOSE";                   
					this.tempX = aGame.player.m_PosX;
					this.tempY= aGame.player.m_PosY;                  
                }	
			}
		}
	}
	
	this.updateProjectilesCollision = function(aGame, aDT)
	{
		for( var i = 0; i< aGame.projectiles.getSize() ;i++)
        {
			for( var j = 0; j< aGame.gameSprites.getSize() ;j++)
			{
				if(aGame.projectiles.getIndex(i).checkObjCollision(aGame.gameSprites.getIndex(j)))
				{
					this.m_Dev.audio.playSound("hit");
					aGame.gameSprites.subObject(j);
					aGame.increaseScore(aGame.gameConsts.scoreIncreaseAmount);
					aGame.projectiles.subObject();
					break;
				}
			}
		}
	}
	
	//////////////////////
	////RENDER FUNCTIONS	
    this.renderNPCSprites = function(aGame)
    {
        ////this makes a temp object of the image we want to use
		//this is so the image holder does not have to keep finding image
        tempImage1 = this.m_Dev.m_Images.getImage("orb")
		tempImage2 = this.m_Dev.m_Images.getImage("fireAmmo")	
		 for (var i = 0; i < aGame.gameSprites.getSize(); i++)
        {	
			////this is to make a temp object for easier code to write and understand
			tempObj = aGame.gameSprites.getIndex(i);            
            switch(tempObj.m_Name)
			{
				case "orb":
				 this.m_Dev.renderImage(tempImage1,tempObj);
				break;
				case "fireAmmo":
				  this.m_Dev.renderImage(tempImage2,tempObj);
				break;
			}           
        }
    }
    
	this.renderBullets = function(aGame)
	{	
		////this makes a temp object of the image we want to use
		//this is so the image holder does not have to keep finding image
		tempImage = this.m_Dev.m_Images.getImage("bullet")	
		 for (var i = 0; i < aGame.projectiles.getSize(); i++)
			{	
				////this is to make a temp object for easier code to write and understand
				tempObj = aGame.projectiles.getIndex(i);
				this.m_Dev.renderImage(tempImage,tempObj);
			}
	}
	
	this.renderPlayer = function(aGame)
	{
        tempImage = this.m_Dev.m_Images.getImage("player")
		if(aGame.playState == "SHIELD")
		{
			aGame.player.m_State = 1;
			this.m_Dev.renderClip(tempImage,aGame.player); 				
		}       
        else if(aGame.playState == "SHOOT")
		{
			aGame.player.m_State = 2
			this.m_Dev.renderClip(tempImage,aGame.player); 					
		}
		else if(aGame.playState == "SUPER")
		{
			aGame.player.m_State = 3;
			this.m_Dev.renderClip(tempImage,aGame.player); 			
		}		
		else if(aGame.playState == "DEATH")
		{
			aGame.player.m_State = 4;
			this.m_Dev.renderClip(tempImage,aGame.player); 			
		}      
		else
		{
			aGame.player.m_State = 0;
			this.m_Dev.renderClip(tempImage,aGame.player); 
		}		
	}		
}
