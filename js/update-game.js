function update(aDev,aGame,aDT)
{		
    switch(aGame.state)
    {
        case "INIT"://init-gameState
        //this is how to reset the whole map and back to play state
        aGame.setGame(aDev);           
        //check to see if player has used input to start game
        if(aDev.checkKey(aGame.gameConsts.playKey))////spacebar key
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
            checkUserInput(aDev,aGame); 
        }
        //changes state of game when player uses input to pause game which takes us to something else
        checkforPause(aDev,aGame);
        //**UPDATE GAME OBJECTS**
        //**player 
        //this is a reminder that you can have objects update stuff  by calling their own update function 
        //or have call the function yourself under controller directly based on how abstract you wont functions called
        aGame.player.update(aDev,aDT);
        aGame.player.borderCheck(aDev);
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
        updateNPCSprites(aDev,aGame,aDT);
        //function in controller Fix eventually go into another object
        updateProjectiles(aDev,aGame,aDT);
        //**UPDATE COLLISIONS FUNCTIONS**
        //if player is not in shield mode then we apply collisions
        if(aGame.playState != "SHIELD")
        {         
            if(check_NPC_Collision(aDev,aGame)==false)
            {
                aGame.holdX = aGame.player.posX;
                aGame.holdY = aGame.player.posY;
            }
        }
        break;
        //////////////////////////////////////////////////////
        case "PAUSE"://pause-state		
            if(aDev.checkKeyUp(aGame.gameConsts.pauseKey))//P-key
            {	
                aGame.player.posX = aGame.holdX;
                aGame.player.posY = aGame.holdY;                
                aGame.playState = "SHIELD"
                aGame.timer.set(aGame.gameConsts.shieldTime);
                aGame.state = "PLAY";
            }
            //little cheat to restart game
            if(aDev.checkKey(aGame.gameConsts.resetKey))//R-keyr
            {
                aGame.state = "INIT";//init gameStateo
            }
        break;
        //////////////////////////////////////////////////////
        case "WIN"://Win-gameState
        {
            //check to see if player has used input to restart game
            if(aDev.checkKey(aGame.gameConsts.resetKey))//R-key
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
                if(aDev.checkKey(aGame.gameConsts.resetKey))//R-key
                {
                    aGame.state = "INIT";//init gameState      
                }
            }
            else
            {
                //check to see if player has used input to restart game
                if(aDev.checkKey(aGame.gameConsts.resetKey))//R-key
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
