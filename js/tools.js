function device(width,height)
{
	this.m_Canvas = document.getElementById("canvas");
	this.m_Ctx = this.m_Canvas.getContext('2d');
	this.m_Canvas.width = width;
	this.m_Canvas.height = height;
	this.m_MouseDown =  false;
	this.m_Keydown =  false;
	this.m_Images = new imageHolder();
    this.audio = new audioPlayer();
	
	keysDown = {};
	keysUp = {};
	
	////device will have the render functions and it will have access to the images or have them passed in
	//so it  will be able to be passed and object and be told to rend er its image or clip 
	
	//this one takes an image object that is passed in directly 
	this.renderImage = function(aImage,aObject)
	{
		this.m_Ctx.drawImage(aImage,aObject.m_PosX,aObject.m_PosY);
	}
	
	this.renderClip = function(aClip,aObject)
	{
		this.m_Ctx.drawImage(
        aClip,
        aObject.m_State * aObject.m_Width,
        0, 
        aObject.m_Width,
		aObject.m_Height,
        aObject.m_PosX - aObject.m_Width*.5,
		aObject.m_PosY  -aObject.m_Height*.5,
        aObject.m_Width,
        aObject.m_Height);
	}
	
	this.centerImage = function(aImage,aObject)
    {
        this.m_Ctx.drawImage(aImage,aObject.m_PosX-aObject.m_Width*.5-12,aObject.m_PosY-aObject.m_Height*.5-12);
    }

	this.initKeys = function() 
	{
		window.addEventListener('keydown', function(e) 
		{
			keysDown[e.keyCode] = true;
			//console.log(e.keyCode);			
		});
	
		window.addEventListener('keyup', function(e) 
		{
			delete keysDown[e.keyCode];
			keysUp[e.keyCode] = true;			
		});	
	}
	
	this.checkKey = function(aNum)
	{	
		if(aNum in keysDown)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
    
	this.checkKeyUp = function(aNum)
	{	
		if(aNum in keysUp && (aNum in keysDown) == false)
		{
			delete keysUp[aNum];
			return true;
		}
		else
		{
			return false;
		}
	}
	
	this.setupMouse = function(sprite,aDev)
	{
		window.addEventListener('mousedown', function(e) {
			aDev.m_MouseDown = true;
		});
		window.addEventListener('mouseup', function(e) {
			aDev.m_MouseDown = false;
		});		
		window.addEventListener("mousemove", function(mouseEvent) 
		{
			sprite.m_PosX = mouseEvent.clientX - canvas.offsetLeft;
			sprite.m_PosY = mouseEvent.clientY - canvas.offsetTop;	
		});
	}
	
	this.putText = function(aString,x,y)
	{
		this.m_Ctx.fillText(aString,x,y);
	}
	
	this.centerTextX = function(aString,y)
	{
		var temp = aString.length;
		var center = (this.m_Canvas.width *.5) -temp*4;
		this.m_Ctx.fillText(aString,center,y);
	}
	
	this.centerTextXY = function(aString)
	{
		var temp = aString.length;
		var centerX = (this.m_Canvas.width *.5) -temp*3.5;
		var centerY = (this.m_Canvas.height *.5);
		
		this.m_Ctx.fillText(aString,centerX,centerY);
	}
	
	this.colorText = function(color)
	{
		this.m_Ctx.fillStyle = color.toString(); 
	}
    
	this.setFont= function(font)
	{
		this.m_Ctx.font= font.toString();
	}
    
    this.debugText = function(text,posX,posY)
    {
        this.setFont("24px Arial Black");
        this.colorText("white");		
        this.putText(text.toString(),posX,posY);
    }
}

function objHolder()
{
	this.m_Objects = new Array();

	this.addObject = function(aObject)
	{
		this.m_Objects.push(aObject);	
	}
	this.subObject = function(aIndex)
	{
		this.m_Objects.splice(aIndex,1);
	}
	this.clearObjects = function()
	{
		this.m_Objects = [];
		this.m_Objects = new Array();
	}
	this.getIndex = function(aIndex)
	{
		return this.m_Objects[aIndex];
	}
	this.getSize = function()
	{
		return this.m_Objects.length;
	}
	this.update = function(aDev,aDT)
	{
		for(var i = 0; i < this.m_Objects.length; i++)
		{
			this.m_Objects[i].update(aDev,aDT);
		}
	}
}

function sprite(aSrc,aName)
{
	this.m_Image = new Image();
	this.m_Image.src = aSrc;
    this.m_Name = aName;
   	
	this.getImage = function()
	{
		return this.m_Image;
	}	
}

function imageHolder()
{
	this.m_Images = new Array();
	
	this.addImage = function(aImage)
	{
		this.m_Images.push(aImage);	
	}
	this.getSize = function()
	{
		return this.m_Images.length;
	}

	this.getImage = function(aName)
	{
		for(var i = 0; i < this.m_Images.length; i++)
		{
			if(this.m_Images[i].m_Name == aName)
			{
				return this.m_Images[i].getImage();
				break;
			}		
		}		
	}	
}

function audioPlayer()
{
	this.m_Sounds = new Array();

	this.addSound = function(aName,aSound)
	{
        newSound = new sound(aName,aSound);
		this.m_Sounds.push(newSound);	
	}
	this.getSize = function()
	{
		return this.m_Sounds.length;
	}
	this.playSound = function(aSoundname)
	{
		for(var i = 0; i < this.m_Sounds.length; i++)
		{
			if(this.m_Sounds[i].m_Name == aSoundname)
			{
				this.m_Sounds[i].m_Sound.play();
				break;
			}		
		}
	}
}

function sound(aName,aAudio)
{
	this.m_Name = aName;
	this.m_Sound = new Audio(aAudio);
	
	this.play = function()
	{		
		this.m_Sound.play();	
	}	
}

function timer(timeToCount)
{
	this.currentTime = 0;
	this.lastTime = 0;
	this.totalTime = 0;
	this.enoughtTime = timeToCount;
	this.clock = 0;
	this.posX =0;
	this.posY = 0;
    this.active = false;
	
	this.update = function()
	{
		this.currentTime = Date.now();
		var  thisTime = this.currentTime - this.lastTime;
		this.totalTime += thisTime;
		
		if(this.clock < 1)
		{
            this.active = false;
			return true;
		}	
		if(this.totalTime > this.enoughtTime)
		{
			this.totalTime = 0;
			this.lastTime = this.currentTime;
			this.clock--;
		}
		else
		{
			this.lastTime = this.currentTime;
		}
	}	
	this.posClock = function(x,y)
	{
		this.posX = x;
		this.posY = y;
	}
	this.display = function(aDev,x,y)
	{	
		if(this.clock < 0)
		{
			this.clock = 0;
		}
		aDev.putText("TIME:  "+this.clock,x,y);

	}
	this.set = function(startAmt)
	{
        this.active = true;
		this.clock = startAmt;
	}
}