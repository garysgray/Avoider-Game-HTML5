//import {updateProjectilesCollision} from 'functions';

function controller(newWidth,newHeight)
{
	//our controller has a device object to control the HTML5 Canvas
    this.m_Dev = new Device(newWidth,newHeight);
	//key events are wrapped in the device object as well, this sets them up
	this.m_Dev.initKeys();
	
	this.initGame = function(aGame)
	{
		aGame.initGame(this.m_Dev);
	}
	
	//*****Main Updatebased on aGame._state
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
                checkUserInput(this.m_Dev,aGame); 
            }
			//changes state of game when player uses input to pause game which takes us to something else
			checkforPause(this.m_Dev,aGame);
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
            updateNPCSprites(this.m_Dev,aGame,aDT);
			//function in controller Fix eventually go into another object
			updateProjectiles(this.m_Dev,aGame,aDT);
			//**UPDATE COLLISIONS FUNCTIONS**
			//if player is not in shield mode then we apply collisions
            if(aGame.playState != "SHIELD")
            {         
                if(check_NPC_Collision(this.m_Dev,aGame)==false)
                {
                    aGame.holdX = aGame.player.posX;
                    aGame.holdY = aGame.player.posY;
                }
            }
			break;
			//////////////////////////////////////////////////////
			case "PAUSE"://pause-state		
				if(this.m_Dev.checkKeyUp(aGame.gameConsts.pauseKey))//P-key
				{	
                    aGame.player.posX = aGame.holdX;
                    aGame.player.posY = aGame.holdY; 
                    
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
                aGame.player.posX = aGame.holdX;
				aGame.player.posY = aGame.holdY; 
                
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
        this.m_Dev.ctx.fillStyle = '#000';
        this.m_Dev.ctx.fillRect(0, 0, canvas.width, canvas.height);
        //canvas render text stuff
		this.m_Dev.setFont("bold 14pt Calibri");
		this.m_Dev.colorText("white");
        
        //use game state to dictate what should render
		switch(aGame.state)
		{
			case "INIT"://init-gameState
            {
                
				//set up props background and title bar/splash screen

                this.m_Dev.renderImage(this.m_Dev.images.getImage("background"),aGame.backGround.posX,aGame.backGround.posY);
                
                this.m_Dev.centerImage(this.m_Dev.images.getImage("splash"),aGame.splashScreen.posX,aGame.splashScreen.posX,
                aGame.splashScreen.width,aGame.splashScreen.height);

				//text to help player out
				this.m_Dev.centerTextX("CATCH  FIRE  BALLS  TO  GET  AMMO",this.m_Dev.canvas.height-150);
				this.m_Dev.centerTextX("USE  SPACE-BAR  TO  FIRE",this.m_Dev.canvas.height-100);
				this.m_Dev.centerTextX("PRESS  THE  SPACE-BAR  TO  START",this.m_Dev.canvas.height-50);
            }
			break;
			
			case "PLAY"://play-gameState	
            {
				this.m_Dev.colorText("red");//changes color of font until its changed
                this.m_Dev.renderImage(this.m_Dev.images.getImage("background"),aGame.backGround.posX,aGame.backGround.posY);
                ////functions for rendering game objects are done 
                renderNPCSprites(this.m_Dev,aGame);
                renderBullets(this.m_Dev,aGame);
				renderPlayer(this.m_Dev,aGame);
				////HUD
                //magic numbers
				this.m_Dev.centerTextX("Score :  "+ aGame.score.toString(),this.m_Dev.canvas.height-25);
				this.m_Dev.putText("Ammo :  "+ aGame.ammo.toString(),25,this.m_Dev.canvas.height-25);
				this.m_Dev.putText("Lives :  "+ aGame.lives.toString(),500,this.m_Dev.canvas.height-25);	  
            }
			break;
 
			case "PAUSE"://pause-state
            {
				this.m_Dev.colorText("white");//font will be this color untill changed
				//set up props background and title bar/splash screen
                this.m_Dev.renderImage(this.m_Dev.images.getImage("background"),aGame.backGround.posX,aGame.backGround.posY);
                this.m_Dev.centerImage(this.m_Dev.images.getImage("pause"),aGame.pauseScreen.posX,aGame.pauseScreen.posX,
                aGame.pauseScreen.width,aGame.pauseScreen.height);
				//text to help player out
				//magic numbers
				this.m_Dev.centerTextX("PRESS  P  TO  RESUME  GAME",this.m_Dev.canvas.width/4,this.m_Dev.canvas.height-50);
            }
			break;
			case "WIN"://Win-gameState
			{
				this.m_Dev.centerTextX("PRESS  THE  R  KEY  TO  PLAY",this.m_Dev.canvas.width/4,this.m_Dev.canvas.height-50);
			}
			break;
            //magic numbers
			case "LOSE"://Lose-gameState
			{	
				this.m_Dev.renderImage(this.m_Dev.images.getImage("background"),aGame.backGround._posX,aGame.backGround.posY);
				
                this.m_Dev.centerImage(this.m_Dev.images.getImage("die"),aGame.dieScreen.posX,aGame.dieScreen.posX,
                aGame.dieScreen.width,aGame.dieScreen.height);
					
				if(aGame.lives <= 0)
				{				
					this.m_Dev.centerTextX("SORRY  YOU  LOST,  PRESS  R  TO  RETRY",this.m_Dev.canvas.width/4,this.m_Dev.canvas.height-50);
				}
				else
				{
					this.m_Dev.centerTextX("SORRY  YOU  DIED,  PRESS  R  TO  REVIVE",this.m_Dev.canvas.width/4,this.m_Dev.canvas.height-50);
				}
				renderPlayer(this.m_Dev,aGame);
			}
			break;
			default:		
		}	
    }
	
}
