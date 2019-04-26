//get rid of name and use type which is an enum
//make an enum for sprites
//combine audi and sound object? 
//add adio controll to device
//make a text writer obj seperate from device
//have backdrop object in an array instead of menbers
//gameConsts should be m_gameConsts
//keys checks values shoiuld be part of game obj conts?
//magic numbers in controller 
//seters and getters ??
function gameObject(aName, aWidth,aHeight,newX,newY,aSpeed)
{
    this.m_Name = aName;	
	this.m_Width = aWidth;
	this.m_Height = aHeight;
	this.m_PosX = newX;
	this.m_PosY = newY;
	this.m_Speed = aSpeed;
    this.m_spaceBuffer = 12;
    
	this.update = function(aDev,aDT)
	{
		
	}
	//since most gameobjects will be moving downward
    //main action other then player
	this.moveDown = function(aDT)
	{   
		this.m_PosY += this.m_Speed * aDT;  
	}
    //helps for spawing game objects
	this.movePos = function(newX,newY)
	{
		this.m_PosX = newX;
		this.m_PosY = newY;
	}
       
	this.getImage = function()
	{
		return this.m_Image;
	}
	
	this.checkObjCollision = function(aObj)
	{
		if(this.m_PosX + this.m_Width*.5-this.m_spaceBuffer > aObj.m_PosX - aObj.m_Width*.5 && this.m_PosX-this.m_Width*.5-this.m_spaceBuffer < aObj.m_PosX + aObj.m_Width*.5
			&&
		   this.m_PosY + this.m_Height*.5-this.m_spaceBuffer > aObj.m_PosY - aObj.m_Height*.5 && this.m_PosY- this.m_Height*.5-this.m_spaceBuffer < aObj.m_PosY + aObj.m_Height*.5 )   
		{
			return true;
		}		
	}	
}

function player(aWidth,aHeight,newX,newY,aSpeed)
{	
	this.m_Width = aWidth;
	this.m_Height = aHeight;
	this.m_PosX = newX;
	this.m_PosY = newY;
	this.m_Speed = aSpeed;
	this.m_ProjectileTimer = Date.now();
	this.m_ShootDelay = 200;
    
	this.update = function(aDev,aDT)
	{
		
	}
    
    this.borderCheck = function(aDev)
	{
		if(this.m_PosX - this.m_Width*.5 < 0 )
		{
			this.m_PosX = this.m_Width*.5;
		}
		if(this.m_PosX + this.m_Width*.5 > aDev.m_Canvas.width)
		{	
			this.m_PosX = aDev.m_Canvas.width - this.m_Width*.5;
		}		
		if(this.m_PosY - this.m_Height*.5 < 0 )
		{
			this.m_PosY = this.m_Height*.5;
		}
		//// the -50 is for a buffer to keep player from hitting bottom for hud
		if(this.m_PosY + this.m_Height*.5 > aDev.m_Canvas.height-50)
		{		
			this.m_PosY =(aDev.m_Canvas.height-50) - this.m_Height*.5;
		}
	}
	
}
player.prototype = new gameObject()

function backDrop(aWidth,aHeight,newX,newY)
{	
	this.m_Width = aWidth;
	this.m_Height = aHeight;
	this.m_PosX = newX;
	this.m_PosY = newY;
    this.m_Speed = 0;
    this.update = function(aDev,aDT)
	{
		
	}
	
}
backDrop.prototype = new gameObject()



