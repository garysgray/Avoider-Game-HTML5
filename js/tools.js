keysDown = {};
keysUp = {}; 

class Device
{
    constructor(width,height)
    {
        this._canvas = document.getElementById("canvas");
        this._ctx = this._canvas.getContext('2d');
        this._canvas.width = width;
        this._canvas.height = height;
        this._mouseDown =  false;
        this._keydown =  false;
        this._images = new objHolder();
        this._audio = new AudioPlayer();       
    }
    
    //getter functions
    get canvas(){return this._canvas;}
    get ctx(){return this._ctx;}
    get mouseDown(){return this._mouseDown;}
    get images(){return this._images;}
    get audio(){return this._audio;}
    
    //setter functions
    set mouseDown(newState){this._mouseDown = newState;}
    
	initKeys() 
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
    
    checkKey(aNum)
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
    
	checkKeyUp(aNum)
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
    
    setupMouse(sprite,aDev)
	{       
		window.addEventListener('mousedown', function(e) {
			aDev.mouseDown = true;
            
		});
		window.addEventListener('mouseup', function(e) {
			aDev.mouseDown = false;
            
		});		
		window.addEventListener("mousemove", function(mouseEvent) 
		{
			sprite.m_PosX = mouseEvent.clientX - canvas.offsetLeft;
			sprite.m_PosY = mouseEvent.clientY - canvas.offsetTop;	
		});
	}
    
    //this one takes an image object that is passed in directly 
	renderImage(aImage,aObject)
	{
		this._ctx.drawImage(aImage,aObject.m_PosX,aObject.m_PosY);
	}
    
    renderClip(aClip,aObject)
	{
		this._ctx.drawImage(
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
    
    centerImage(aImage,aObject)
    {
        this._ctx.drawImage(aImage,aObject.m_PosX-aObject.m_Width*.5-12,aObject.m_PosY-aObject.m_Height*.5-12);
    }
    
    putText(aString,x,y)
	{
		this._ctx.fillText(aString,x,y);
	}
	
	centerTextX(aString,y)
	{
		var temp = aString.length;
		var center = (this._canvas.width *.5) -temp*4;
		this._ctx.fillText(aString,center,y);
	}
	
	centerTextXY(aString)
	{
		var temp = aString.length;
		var centerX = (this._canvas.width *.5) -temp*3.5;
		var centerY = (this._canvas.height *.5);
		
		this._ctx.fillText(aString,centerX,centerY);
	}
	
	colorText(color)
	{
		this._ctx.fillStyle = color.toString(); 
	}
    
	setFont(font)
	{
		this._ctx.font= font.toString();
	}
    
    debugText(text,posX,posY)
    {
        this.setFont("24px Arial Black");
        this.colorText("white");		
        this.putText(text.toString(),posX,posY);
    }  
}

class Sound
{
    constructor(aName,aAudio)
    {
        this._name = aName;
        this._audio = new Audio(aAudio);
    }   
    get name()
    {
        return this._name;
    }
    get audio()
    {
        return this._audio;
    }
}

class AudioPlayer
{
    constructor()
    {
        this._sounds = new Array();
    }
	
	addSound(aName,aAudio)
	{
        var newSound = new Sound(aName,aAudio);
		this._sounds.push(newSound);	
	}
	getSize()
	{
		return this._sounds.length;
	}
	playSound(aSoundname)
	{
		for(var i = 0; i < this._sounds.length; i++)
		{
			if(this._sounds[i].name == aSoundname)
			{
				this._sounds[i].audio.play();
				break;
			}		
		}
	}
}

class Sprite
{
    constructor(aSrc,aName)
    {
        this._image = new Image();
        this._image.src = aSrc;
        this._name = aName;
    }
    get name()
	{
		return this._name;
	}
    getImage()
	{
		return this._image;
	}
}


function objHolder()
{
	this.m_Objects = new Array();
    
    this.addImage= function(aSrc,aName)
    {
        var aObject = new Sprite(aSrc,aName);
        this.m_Objects.push(aObject);
    }
       
    this.addObject= function(aSrc,aName)
    {
        var aObject = new Sprite(aSrc,aName);
        this.m_Objects.push(aObject);
    }

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
    this.getObject = function(aName)
	{
		for(var i = 0; i < this.m_Objects.length; i++)
		{
			if(this.m_Objects[i].name == aName)
			{
				return this.m_Objects[i].getImage();
				break;
			}		
		}		
	}	
}

class Timer
{
    constructor(timeToCount)
    {
        this._currentTime = 0;
        this._lastTime = 0;
        this._totalTime = 0;
        this._enoughtTime = timeToCount;
        this._clock = 0;
        this._posX =0;
        this._posY = 0;
        this._active = false;
    }
    
    get active()
	{
		return this._active;
	}
    getImage()
	{
		return this._image;
	}
    
    update()
	{
		this._currentTime = Date.now();
		var  thisTime = this._currentTime - this._lastTime;
		this._totalTime += thisTime;
		
		if(this._clock < 1)
		{
            this._active = false;
			return true;
		}	
		if(this._totalTime > this._enoughtTime)
		{
			this._totalTime = 0;
			this._lastTime = this._currentTime;
			this._clock--;
		}
		else
		{
			this._lastTime = this._currentTime;
		}
	}
    posClock(x,y)
	{
		this._posX = x;
		this._posY = y;
	}
	display(aDev,x,y)
	{	
		if(this._clock < 0)
		{
			this._clock = 0;
		}
		aDev.putText("TIME:  "+this._clock,x,y);

	}
	set(startAmt)
	{
        this._active = true;
		this._clock = startAmt;
	}	
}



// function timer(timeToCount)
// {
	// this.currentTime = 0;
	// this.lastTime = 0;
	// this.totalTime = 0;
	// this.enoughtTime = timeToCount;
	// this.clock = 0;
	// this.posX =0;
	// this.posY = 0;
    // this.active = false;
	
	// this.update = function()
	// {
		// this.currentTime = Date.now();
		// var  thisTime = this.currentTime - this.lastTime;
		// this.totalTime += thisTime;
		
		// if(this.clock < 1)
		// {
            // this.active = false;
			// return true;
		// }	
		// if(this.totalTime > this.enoughtTime)
		// {
			// this.totalTime = 0;
			// this.lastTime = this.currentTime;
			// this.clock--;
		// }
		// else
		// {
			// this.lastTime = this.currentTime;
		// }
	// }	
	// this.posClock = function(x,y)
	// {
		// this.posX = x;
		// this.posY = y;
	// }
	// this.display = function(aDev,x,y)
	// {	
		// if(this.clock < 0)
		// {
			// this.clock = 0;
		// }
		// aDev.putText("TIME:  "+this.clock,x,y);

	// }
	// this.set = function(startAmt)
	// {
        // this.active = true;
		// this.clock = startAmt;
	// }
// }

// class Sound
// {
    // constructor(aName,aAudio)
    // {
        // this._name = aName;
        // this._sound = new Audio(aAudio);

        // this.play = function()
        // {		
            // this._sound.play();	
        // }	
    // }
// }

// function device(width,height)
// {
	// this.m_Canvas = document.getElementById("canvas");
	// this.m_Ctx = this.m_Canvas.getContext('2d');
	// this.m_Canvas.width = width;
	// this.m_Canvas.height = height;
	// this.m_MouseDown =  false;
	// this.m_Keydown =  false;
	// this.m_Images = new imageHolder();
    // this.audio = new audioPlayer();
	
	// keysDown = {};
	// keysUp = {};
	
	// ////device will have the render functions and it will have access to the images or have them passed in
	// //so it  will be able to be passed and object and be told to rend er its image or clip 
	
	// //this one takes an image object that is passed in directly 
	// this.renderImage = function(aImage,aObject)
	// {
		// this.m_Ctx.drawImage(aImage,aObject.m_PosX,aObject.m_PosY);

	// }
	
	// this.renderClip = function(aClip,aObject)
	// {
		// this.m_Ctx.drawImage(
        // aClip,
        // aObject.m_State * aObject.m_Width,
        // 0, 
        // aObject.m_Width,
		// aObject.m_Height,
        // aObject.m_PosX - aObject.m_Width*.5,
		// aObject.m_PosY  -aObject.m_Height*.5,
        // aObject.m_Width,
        // aObject.m_Height);
	// }
	
	// this.centerImage = function(aImage,aObject)
    // {
        // this.m_Ctx.drawImage(aImage,aObject.m_PosX-aObject.m_Width*.5-12,aObject.m_PosY-aObject.m_Height*.5-12);
    // }

	// this.initKeys = function() 
	// {
		// window.addEventListener('keydown', function(e) 
		// {
			// keysDown[e.keyCode] = true;
			// //console.log(e.keyCode);			
		// });
	
		// window.addEventListener('keyup', function(e) 
		// {
			// delete keysDown[e.keyCode];
			// keysUp[e.keyCode] = true;			
		// });	
	// }
	
	// this.checkKey = function(aNum)
	// {	
		// if(aNum in keysDown)
		// {
			// return true;
		// }
		// else
		// {
			// return false;
		// }
	// }
    
	// this.checkKeyUp = function(aNum)
	// {	
		// if(aNum in keysUp && (aNum in keysDown) == false)
		// {
			// delete keysUp[aNum];
			// return true;
		// }
		// else
		// {
			// return false;
		// }
	// }
	
	// this.setupMouse = function(sprite,aDev)
	// {
		// window.addEventListener('mousedown', function(e) {
			// aDev.m_MouseDown = true;
		// });
		// window.addEventListener('mouseup', function(e) {
			// aDev.m_MouseDown = false;
		// });		
		// window.addEventListener("mousemove", function(mouseEvent) 
		// {
			// sprite.m_PosX = mouseEvent.clientX - canvas.offsetLeft;
			// sprite.m_PosY = mouseEvent.clientY - canvas.offsetTop;	
		// });
	// }
	
	// this.putText = function(aString,x,y)
	// {
		// this.m_Ctx.fillText(aString,x,y);
	// }
	
	// this.centerTextX = function(aString,y)
	// {
		// var temp = aString.length;
		// var center = (this.m_Canvas.width *.5) -temp*4;
		// this.m_Ctx.fillText(aString,center,y);
	// }
	
	// this.centerTextXY = function(aString)
	// {
		// var temp = aString.length;
		// var centerX = (this.m_Canvas.width *.5) -temp*3.5;
		// var centerY = (this.m_Canvas.height *.5);
		
		// this.m_Ctx.fillText(aString,centerX,centerY);
	// }
	
	// this.colorText = function(color)
	// {
		// this.m_Ctx.fillStyle = color.toString(); 
	// }
    
	// this.setFont= function(font)
	// {
		// this.m_Ctx.font= font.toString();
	// }
    
    // this.debugText = function(text,posX,posY)
    // {
        // this.setFont("24px Arial Black");
        // this.colorText("white");		
        // this.putText(text.toString(),posX,posY);
    // }
// }


// function sound(aName,aAudio)
// {
	// this.m_Name = aName;
	// this.m_Sound = new Audio(aAudio);
	
	// this.play = function()
	// {		
		// this.m_Sound.play();	
	// }	
// }


// function audioPlayer()
// {
	// this.m_Sounds = new Array();

	// this.addSound = function(aName,aSound)
	// {
        // newSound = new sound(aName,aSound);
		// this.m_Sounds.push(newSound);	
	// }
	// this.getSize = function()
	// {
		// return this.m_Sounds.length;
	// }
	// this.playSound = function(aSoundname)
	// {
		// for(var i = 0; i < this.m_Sounds.length; i++)
		// {
			// if(this.m_Sounds[i].m_Name == aSoundname)
			// {
				// this.m_Sounds[i].m_Sound.play();
				// break;
			// }		
		// }
	// }
// }

// function audioPlayer()
// {
	// this.m_Sounds = new Array();

	// this.addSound = function(aName,aAudio)
	// {
        // newSound = new Sound(aName,aAudio);
		// this.m_Sounds.push(newSound);	
	// }
	// this.getSize = function()
	// {
		// return this.m_Sounds.length;
	// }
	// this.playSound = function(aSoundname)
	// {
		// for(var i = 0; i < this.m_Sounds.length; i++)
		// {
			// if(this.m_Sounds[i].name == aSoundname)
			// {
				// this.m_Sounds[i].audio.play();
				// break;
			// }		
		// }
	// }
// }

// function sprite(aSrc,aName)
// {
	// this.m_Image = new Image();
	// this.m_Image.src = aSrc;
    // this.m_Name = aName;
   	
	// this.getImage = function()
	// {
		// return this.m_Image;
	// }	
// }

