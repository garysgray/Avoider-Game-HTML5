function gameObject(aName, aWidth,aHeight,newX,newY,aSpeed)
{
    this._name = aName;	
	this._width = aWidth;
	this._height = aHeight;
	this._posX = newX;
	this._posY = newY;
	this._speed = aSpeed;
    this._spaceBuffer = 12;
    this._state = 0
    
	this.update = function(aDev,aDT)
	{
		//pass
	}
	//since most gameobjects will be moving downward
    //main action other then player
	this.moveDown = function(aDT)
	{   
		this._posY += this._speed * aDT;  
	}
    //helps for spawing game objects
	this.movePos = function(newX,newY)
	{
		this._posX = newX;
		this._posY = newY;
	}
       
    this.checkObjCollision = function(aPosX,aPosY,aWidth,aHeight)
	{
        if(this._posX + this._width*.5-this._spaceBuffer > aPosX - aWidth*.5 && this._posX-this._width*.5-this._spaceBuffer < aPosX + aWidth*.5
        &&
        this._posY + this._height*.5-this._spaceBuffer > aPosY - aHeight*.5 && this._posY- this._height*.5-this._spaceBuffer < aPosY + aHeight*.5 )   
        {
        return true;
        }		
	}
     
    
    
    
    
    
}

function player(aWidth,aHeight,newX,newY,aSpeed)
{	
    //this._name = " ";	
	this._width = aWidth;
	this._height = aHeight;
	this._posX = newX;
	this._posY = newY;
	this._speed = aSpeed;
	this._projectileTimer = Date.now();
	this._shootDelay = 200;
    
	this.update = function(aDev,aDT)
	{
		//pass
	}
    
    this.borderCheck = function(aDev)
	{
		if(this._posX - this._width*.5 < 0 )
		{
			this._posX = this._width*.5;
		}
		if(this._posX + this._width*.5 > aDev.canvas.width)
		{	
			this._posX = aDev.canvas.width - this._width*.5;
		}		
		if(this._posY - this._height*.5 < 0 )
		{
			this._posY = this._height*.5;
		}
		//// the -50 is for a buffer to keep player from hitting bottom for hud
		if(this._posY + this._height*.5 > aDev.canvas.height-50)
		{		
			this._posY =(aDev.canvas.height-50) - this._height*.5;
		}
	}
	
}
player.prototype = new gameObject()

function backDrop(aWidth,aHeight,newX,newY)
{	
    //this._name = " ";
	this._width = aWidth;
	this._height = aHeight;
	this._posX = newX;
	this._posY = newY;
    this._speed = 0;
    
    this.update = function(aDev,aDT)
	{
		//pass
	}	
}
backDrop.prototype = new gameObject()





// class GameObject
// {
    // constructor(aName, aWidth,aHeight,newX,newY,aSpeed)
    // {
        // this._name = aName;	
        // this._width = aWidth;
        // this._height = aHeight;
        // this._posX = newX;
        // this._posY = newY;
        // this._speed = aSpeed;
        // this._spaceBuffer = 12;
        // this._state = 0
    // } 
    // get name(){return this._name;}
    // get width(){return this._width;}
    // get height(){return this._height;}
    // get posX(){return this._posX;}
    // get posY(){return this._posY;}
    // get speed(){return this._speed;}
    // get spaceBuffer(){return this._spaceBuffer;}
    // get state(){return this._state;}
    
    // set posX(newX)
    // {
        // this._posX = newX;
    // }
    // set posY(newY)
    // {
        // this._posY = newY;
    // }
    
    // set width(newW)
    // {
        // this._width = newW;
    // }
    // set height(newH)
    // {
        // this._height = newH;
    // }
    
    // update(aDev,aDT)
	// {
		
	// }
    
    // moveDown(aDT)
	// {   
		// this._posY += this._speed * aDT;  
	// }
    // //helps for spawing game objects
	// movePos(newX,newY)
	// {
		// this._posX = newX;
		// this._posY = newY;
	// }
       
	// // this.getImage = function()
	// // {
		// // return this.m_Image;
	// // }
	
	// checkObjCollision(m_posX,m_posy,m_width,m_Height)
	// {
		// if(this._posX + this._width*.5-this._spaceBuffer > m_posX - m_width*.5 && this._posX-this._width*.5-this._spaceBuffer < m_PosX + m_Width*.5
			// &&
		   // this._posY + this._height*.5-this._spaceBuffer > m_PosY - m_Height*.5 && this._posY- this._height*.5-this._spaceBuffer < m_PosY + m_Height*.5 )   
		// {
            // console.log("yo");
			// return true;
		// }		
	// }	
   
// }

// class BackDrop 
// {
    // constructor(aWidth,aHeight,newX,newY)
    // {
        
        // this._width = aWidth;
        // this._height = aHeight;
        // this._posX = newX;
        // this._posY = newY;
        // this._speed = 0
    // }
    
    // get width(){return this._width;}
    // get height(){return this._height;}
    // get posX(){return this._posX;}
    // get posY(){return this._posY;}
    // get speed(){return this._speed;}
    // get state(){return this._state;}
    
    // update(aDev,aDT)
	// {
		
	// }
// }
