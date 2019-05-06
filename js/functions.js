//**UPDATE COLLISIONS FUNCTIONS**
check_NPC_Collision = function(m_Dev,aGame)
{
    for(var i =0;i< aGame.gameSprites.getSize();i++)
    {
        temp = aGame.gameSprites.getIndex(i)
        if(aGame.player.checkObjCollision(temp.posX,temp.posY,temp.width,temp.height))           
        {            
            if(aGame.gameSprites.getIndex(i).name == "fireAmmo")
            {					
                m_Dev.audio.playSound("get");
                aGame.gameSprites.subObject(i);
                aGame.playState = "SHOOT";
                aGame.increaseAmmo(aGame.gameConsts.ammoAmount);					
            }
            else
            {
                m_Dev.audio.playSound("hurt");
                aGame.playState = "DEATH";                   
                aGame.gameSprites.subObject(i);
                aGame.decreaseLives(1);
                aGame.state = "LOSE";                   
                return false;                
            }	
        }
    }
    return true;
}

function updateProjectilesCollision(m_Dev,aGame, aDT)
{
    for( var i = 0; i< aGame.projectiles.getSize() ;i++)
    {
        for( var j = 0; j< aGame.gameSprites.getSize() ;j++)
        {
            temp = aGame.gameSprites.getIndex(j);
            if(aGame.projectiles.getIndex(i).checkObjCollision(temp.posX,temp.posY,temp.width,temp.height))
            {
                m_Dev.audio.playSound("hit");
                aGame.gameSprites.subObject(j);
                aGame.increaseScore(aGame.gameConsts.scoreIncreaseAmount);
                aGame.projectiles.subObject();
                break;
            }
        }
    }
}
   
function updateProjectiles(m_Dev,aGame, aDT)
{
    for( var i = 0; i< aGame.projectiles.getSize() ;i++)
    {
        aGame.projectiles.getIndex(i).posY -= aGame.projectiles.getIndex(i).speed * aDT;
         
        if(aGame.projectiles.getIndex(i).posY < 0)
        {
            aGame.projectiles.subObject(i);
        }
    }		
    updateProjectilesCollision(m_Dev,aGame,aDT);
}

function checkUserInput(m_Dev,aGame)
{
     if(m_Dev.mouseDown && Date.now()-aGame.player.projectileTimer > aGame.player.shootDelay || 
        m_Dev.checkKey(aGame.gameConsts.playKey)  && Date.now()-aGame.player.projectileTimer > aGame.player.shootDelay)
    {
        var bullet = new GameObject("bullet",12,12,(aGame.player.posX) ,aGame.player.posY ,aGame.gameConsts.bulletSpeed);
        //->A2C	////this is where objects are getting adjusted to the center
        bullet.posX -= bullet.width*.5;
        bullet.posY += bullet.height*.5;
        aGame.projectiles.addObject(bullet);			
        ////this is where we set the players shoot delay timer 
        aGame.player.projectileTimer = Date.now();
        ////the audio sound of shooting
        m_Dev.audio.playSound("shoot");          
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

function checkforPause(m_Dev,aGame)
{
    if(m_Dev.checkKeyUp(aGame.gameConsts.pauseKey))//P-key
    {	aGame.holdX = aGame.player.posX;
        aGame.holdY= aGame.player.posY;
        aGame.state = "PAUSE";//pause gameState
    }
}    
   
function updateNPCSprites(m_Dev,aGame,aDT)
{		
    if(Math.random() < 1/aGame.gameConsts.rndRatio)
    {
        //this is made to help get us a X pos  in range that will not let orb be off the screen
        //buff values help dial in perfect position
        var rndXValue = Math.floor(Math.random() *((m_Dev.canvas.width-aGame.gameConsts.buffer1)-aGame.gameConsts.buffer2+1));		
        orb = new GameObject("orb",29,29,rndXValue,0, aGame.gameConsts.orbSpeed);
                
        for(var i = 0;i < aGame.gameSprites.getSize();i++)
        {			
            var count = 0;
            temp = aGame.gameSprites.getIndex(i)
            while(orb.checkObjCollision(temp.posX,temp.posY,temp.width,temp.height) )
            {
                if(count > 3)
                {
                    break;
                }
                var rndXValue = Math.floor(Math.random() *((m_Dev.canvas.width-(aGame.gameConsts.buffer1*count))-(aGame.gameConsts.buffer2*count)+1));
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
        var rndXValue = Math.floor(Math.random() *((m_Dev.canvas.width-aGame.gameConsts.buffer1)-aGame.gameConsts.buffer2+1));			
        fireAmmo = new GameObject("fireAmmo",20,20,rndXValue,0, aGame.gameConsts.orbSpeed);       
        for(var i = 0;i < aGame.gameSprites.getSize();i++)
        {
            var count = 0;
            temp = aGame.gameSprites.getIndex(i);
            while(fireAmmo.checkObjCollision(temp.posX,temp.posY,temp.width,temp.height) )
            {
                if(count > 3)
                {
                    break;
                }
                var rndXValue = Math.floor(Math.random() *((m_Dev.canvas.width-(aGame.gameConsts.buffer1*count))-(aGame.gameConsts.buffer2*count)+1));
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
         if(aGame.gameSprites.getIndex(i).posY > m_Dev.canvas.height-100)
         {
            aGame.gameSprites.subObject(i);
         }
    }	 
}
    	




   