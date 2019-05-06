function renderNPCSprites(aDev,aGame)
{
    ////this makes a temp object of the image we want to use
    //this is so the image holder does not have to keep finding image
    tempImage1 = aDev.images.getImage("orb")
    tempImage2 = aDev.images.getImage("fireAmmo")	
     for (var i = 0; i < aGame.gameSprites.getSize(); i++)
    {	
        ////this is to make a temp object for easier code to write and understand
        tempObj = aGame.gameSprites.getIndex(i);            
        switch(tempObj.name)
        {
            case "orb":
             aDev.renderImage(tempImage1,tempObj.posX,tempObj.posY);
            break;
            case "fireAmmo":
              aDev.renderImage(tempImage2,tempObj.posX,tempObj.posY);
            break;
        }           
    }
}

function renderBullets(aDev,aGame)
{	
    ////this makes a temp object of the image we want to use
    //this is so the image holder does not have to keep finding image
    tempImage = aDev.images.getImage("bullet")	
     for (var i = 0; i < aGame.projectiles.getSize(); i++)
        {	
            ////this is to make a temp object for easier code to write and understand
            tempObj = aGame.projectiles.getIndex(i);
            aDev.renderImage(tempImage,tempObj.posX,tempObj.posY);
        }
}
	
function renderPlayer(aDev,aGame)
{
    tempImage = aDev.images.getImage("player")
    temp = aGame.player;
    if(aGame.playState == "SHIELD")
    {
        aGame.player.state = 1;
        aDev.renderClip(tempImage,temp.posX,temp.posY,temp.width,temp.height,temp.state); 				
    }       
    else if(aGame.playState == "SHOOT")
    {
        aGame.player.state = 2
        aDev.renderClip(tempImage,temp.posX,temp.posY,temp.width,temp.height,temp.state); 				
    }
    else if(aGame.playState == "SUPER")
    {
        aGame.player.state = 3;
        aDev.renderClip(tempImage,temp.posX,temp.posY,temp.width,temp.height,temp.state); 		
    }		
    else if(aGame.playState == "DEATH")
    {
        aGame.player.state = 4;
        aDev.renderClip(tempImage,temp.posX,temp.posY,temp.width,temp.height,temp.state); 		
    }      
    else
    {
        aGame.player.state = 0;
        aDev.renderClip(tempImage,temp.posX,temp.posY,temp.width,temp.height,temp.state); 
    }		
}

		