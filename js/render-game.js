function renderGameObjects(aDev,aGame)
{
    //canvas render stuff
    aDev.ctx.fillStyle = '#000';
    aDev.ctx.fillRect(0, 0, canvas.width, canvas.height);
        
    //use game state to dictate what should render
    switch(aGame.state)
    {
        case "INIT"://init-gameState
        {           
            //set up props background and title bar/splash screen
            aDev.renderImage(aDev.images.getImage("background"),aGame.backGround.posX,aGame.backGround.posY);           
            aDev.centerImage(aDev.images.getImage("splash"),aGame.splashScreen.posX,aGame.splashScreen.posX,
            aGame.splashScreen.width,aGame.splashScreen.height);      
        }
        break;
        
        case "PLAY"://play-gameState	
        {          
            aDev.renderImage(aDev.images.getImage("background"),aGame.backGround.posX,aGame.backGround.posY);
            ////functions for rendering game objects are done 
            renderNPCSprites(aDev,aGame);
            renderBullets(aDev,aGame);
            renderPlayer(aDev,aGame);           
        }
        break;

        case "PAUSE"://pause-state
        {            
            //set up props background and title bar/splash screen
            aDev.renderImage(aDev.images.getImage("background"),aGame.backGround.posX,aGame.backGround.posY);
            aDev.centerImage(aDev.images.getImage("pause"),aGame.pauseScreen.posX,aGame.pauseScreen.posX,
            aGame.pauseScreen.width,aGame.pauseScreen.height);            
        }
        break;
        case "WIN"://Win-gameState
        {
            
        }
        break;
        case "LOSE"://Lose-gameState
        {	
            aDev.renderImage(aDev.images.getImage("background"),aGame.backGround._posX,aGame.backGround.posY);            
            aDev.centerImage(aDev.images.getImage("die"),aGame.dieScreen.posX,aGame.dieScreen.posX,
            aGame.dieScreen.width,aGame.dieScreen.height);
            renderPlayer(aDev,aGame);
        }
        break;
        default:		
    }	
}