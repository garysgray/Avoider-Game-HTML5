class Controller
{
    constructor(newWidth,newHeight)
    {
        //our controller has a device object to control the HTML5 Canvas
        this._dev = new Device(newWidth,newHeight);
        //key events are wrapped in the device object as well, this sets them up
        this._dev.initKeys();
    }
    
    get dev(){return this._dev;}
    
    initGame(aGame)
	{
		aGame.initGame(this._dev);
	}
    
    updateGame(aGame,aDT)
    {
        update(this._dev,aGame,aDT)
        renderGameObjects(this._dev,aGame,aDT)
        renderText(this._dev,aGame,aDT)
    }
}
