/*
* 
* DON'T Visit http://createjs.com/ for documentation, updates and example,
* at least not for this ;-(.  Who knows maybe I'll submit it.
*
* Copyright (c) 2013 Leon Aburime at civinia.com, inc.
* 

*/
 
// namespace:
this.createjs = this.createjs||{};
 
(function() {
 
/**
 * Represents a line as defined by the points (x1, y1, x2, y2).
 *
 * @example
 *      var line = new createjs.Line({'parent': parent, 
		'child' : child });
 *
 * @class Line
 * @constructor
 * @param {Number} [x=0] X position.
 * @param {Number} [y=0] Y position.
 * @param {Number} [width=0] The width of the Rectangle.
 * @param {Number} [height=0] The height of the Rectangle.
 **/

var Line = function(  /* arguments */ ) {
    args = arguments[0];
    
    var primary = args.parent,
	secondary = args.child;
    
    //Error Handling for bad values
    if ( !primary || !secondary ) {
	
	Log( "Cannot make a connection because either first ", primary ,
	    " or second ", secondary, "is invalid" );
	
	return;
	
    }
  
    this.initialize = createjs.Container.prototype.initialize;
	this.initialize();//Setting the "container"
    this.init( args );
    this.drawAnimationLine();
    
}

//I need both properties of "Line" that  Im creating
//and "Container" because Im adding and moving Children
Line.prototype = new createjs.Container();

var l = Line.prototype;
   
    
// public properties:
 
	/** 
	 * X position of Point1. 
	 * @property x
	 * @type Number
	 **/
	l.x1 = 0;
	
	/** 
	 * Y position of Point2. 
	 * @property y
	 * @type Number
	 **/
	l.y1 = 0;
        
        /** 
	 * X position. 
	 * @property x
	 * @type Number
	 **/
	l.x2 = 0;
	
	/** 
	 * Y position. 
	 * @property y
	 * @type Number
	 **/
	l.y2 = 0;
        
        /** 
	 * First Connection. 
	 * @property 
	 * @type Object
	 **/
	l.connectionPrimary = null;
        
        /** 
	 * Second Connection. 
	 * @property 
	 * @type Object
	 **/
	l.connectionSecondary = null;
        
        /** 
	* If there is any value associated with this.
	* Good to use for Djikstra
	* @property 
	* @type Number
	**/
        l.value = 0;
        
        /** 
	* The line on the Canvas
	* Good to use for Djikstra
	* @property 
	* @type Number
	**/
         l.line = null;
		
	/** 
	 * Texts attached to the line.
	 * @property 
	 * @type Array
	 **/
	l.all_text = [];
	
	/** 
	 * Text attached to parent.
	 * @property 
	 * @type Array
	 **/
	l.parent_text = null;
	
	/** 
	 * Text attached to child.
	 * @property 
	 * @type Array
	 **/
	l.child_text = null;
	
	/** 
	 * Algorithm of Program.
	 * @property 
	 * @type String
	 **/
	l.algorithm = '';
	
	/** 
	 * If applicaple Creatjs Text value.
	 * @property 
	 * @type Null
	 **/
	l.value_text = '';
	
	/** 
	 * Graphic Line getting drawn on the canvas
	 * @property 
	 * @type Object(Graphics Object)
	 **/
	l.graphicsline = null;
	
	/** 
	 * Graphic Line getting drawn on the canvas
	 * @property 
	 * @type Object(Graphics Object)
	 **/
	l.color = null;
	
	/** 
	 * Tells if a Line has been searched
	 * @property 
	 * @type Object(Graphics Object)
	 **/
	l.searched = false;
	
	/** 
	 * Tells where the line should start drawing from.
	 * This is helpful if order or position of start matters.
	 * @property 
	 * @type Object(Node Object)
	 **/
	l.startDrawingFromNode;
	
	/** 
	 * Tells if a Line is being drawn
	 * @property 
	 **/
	l.beingDrawn = false;
	
	// constructor:
	/** 
	 * Arrays I am in
	 *  @property
	*/
        l.inArrays ;
        
        
	l.init = function(/*arguments*/) {
            
	    var args = arguments[0], primary = args.parent,
	    secondary = args.child, line = args.line,  line_values = args.line_values,
	    all_text = args.all_text, parent_text = all_text.parent_text, 
	    child_text = all_text.child_text, color = args.color,
	    algorithm = args.algorithm, show_line_value = args.show_line_value;   
	    this.value = (line_values) ?
		generateUniqueNodeId(0, 200 , line_values) : 20;
	    
	    //this.set({id:this.value})
	    this.connectionPrimary = primary;
	    this.connectionSecondary = secondary;
	    this.startDrawingFromNode = null;
	    this.searched = false;
	    this.beingDrawn = false;
	    this.inArrays = [];
	    
	    primary.connectionLines[this.id] = this;
	    secondary.connectionLines[this.id] = this;
	   
	    this.color = color || '#000';
	       
	    this.all_text = args.all_text;
	    this.parent_text = parent_text;
	    this.child_text = child_text;
	    this.algorithm = algorithm;
	    this.show_line_value = show_line_value;
	    
	    
	    this.value_text = new createjs.Text(this.value.toString(),
		"15px Arial", "#ff7700");
	    this.addChild(this.value_text);
	   
	    
	    var self = this;	    
	    	
	    $.each(this.all_text, function(index, value){
		    self.all_text[value.id] = value;
		    self.addChild(value); 			
	    });   		
			
	}
	
	l.showLineValue = function( bool ){
	    var show = ( !bool )?  bool : true;
	    
	    (show) ? this.value_text.alpha = 1 :  this.value_text.alpha = 0  ;          
	}
        l.drawAnimationLine = function(color, drawTime, startNode){    
	    
	    var primary, secondary;
	    
	    if( startNode ){
		primary = startNode;
		secondary = startNode.connectedByLine[this.id];
	    }
	    
	    else{ primary = this.connectionPrimary,
		  secondary =this.connectionSecondary;
	    }
	    	
	    primary.update_position();
	    secondary.update_position();
            
	    //If I want to dynamically change the color
	    var line_color = this.color = color || this.color;
	    
            var x_diff =  primary.x - secondary.x,
                y_diff = primary.y - secondary.y,
                
                
            x1= x_min = Math.min(primary.x, secondary.x),
	     y1= y_min = Math.min(primary.y, secondary.y),
              x2= x_max = Math.max(primary.x, secondary.x),
		y2= y_max = Math.max(primary.y, secondary.y) ,
		    val_text_offset = 2,
            	
	    quadrant =0,
            quadrant= (sign(x_diff) > 0 && sign(y_diff)>=0) ? 90 : quadrant ;
			quadrant= (sign(x_diff) >= 0 && sign(y_diff)<=0) ? 180 : quadrant ;
			quadrant= (sign(x_diff) < 0 && sign(y_diff)<0) ? 270 :quadrant ;
			 
	    //Find the angle in between to get the connections
	    //points.  Its just the best way
	    var primary_to_secondary_angle = angle = Math.atan2(y2-y1 , 
		   x2-x1) * 180 / Math.PI + quadrant ;
			 
			 //Lets set where my beginning and end points are
            if ( angle < 15 && angle >=0) {
								
		this.x1 = primary.rightConnection_Point.x;
		this.y1	= primary.rightConnection_Point.y;
		this.x2 = secondary.leftConnection_Point.x;
		this.y2	= secondary.leftConnection_Point.y;
				
            }
			
	    else if ( angle > 15 && angle <= 165    ){
		    
		    this.x1 = primary.topConnection_Point.x;
		    this.y1 = primary.topConnection_Point.y;
		    this.x2 = secondary.bottomConnection_Point.x;
		    this.y2 = secondary.bottomConnection_Point.y;
		    
	    }
			
	    else if ( angle > 165 && angle <= 195    ){
		    
		    this.x1 = primary.leftConnection_Point.x;
		    this.y1	= primary.leftConnection_Point.y;
		    this.x2 = secondary.rightConnection_Point.x;
		    this.y2	= secondary.rightConnection_Point.y;
		    
	    }
			
	    else if ( angle > 195 && angle <= 350    ){
		    
		    this.x1 = primary.bottomConnection_Point.x;
		    this.y1	= primary.bottomConnection_Point.y;
		    this.x2 = secondary.topConnection_Point.x;
		    this.y2	= secondary.topConnection_Point.y;
		    
	    }
			
	    else if ( angle >350){
		    
		    this.x1 = primary.rightConnection_Point.x;
		    this.y1	= primary.rightConnection_Point.y;
		    this.x2 = secondary.leftConnection_Point.x;
		    this.y2	= secondary.leftConnection_Point.y;
		    
	    }
	    
	    this.parent_text.x = this.x1 + 5 ;
	    this.parent_text.y = this.y1 - 20 ;
				
 	    this.child_text.x = this.x2 - 15 ;
	    this.child_text.y = this.y2 - 20 ;
	    
	    //Lets make sure the value text is shown properly if it exists
	    //Need some main function that updates the algorithm for everyone
	    var text_offset_x = 2; 
	    text_offset_x = ( (angle>= 135 && angle< 165) || angle>= 290 ) ? -25 : text_offset_x;
	    
	    this.value_text.x = Math.min(primary.getCenterPoint().x, secondary.getCenterPoint().x)
		+ (x_max - x_min)/2 + text_offset_x ;
	    this.value_text.y = Math.min(primary.getCenterPoint().y, secondary.getCenterPoint().y)
			    + (y_max - y_min)/2 +2 ;
	    
	    this.showLineValue( this.show_line_value );
	    
	    //Lets create the superficial line
	    line = new createjs.Shape();
	    
	    this.line = line;
	    this.addChild(line);
	    this.graphicsline = this.line.graphics;
	    
	    var self= this;
	    
	    if (drawTime) {
		var counter = 0, divisions =50,
		    x_interval = (self.x2 - self.x1)/divisions,
		    y_interval = (self.y2 - self.y1)/divisions,
		    x_soFar = self.x1, y_soFar = self.y1;
		
		function drawAnimationLineSlowly() {
		    
		    self.line.graphics.beginStroke(line_color).setStrokeStyle(3)
			.drawLine(x_soFar, y_soFar,
				    x_soFar + x_interval,y_soFar + y_interval  );
		   		   
		    //I fully drew the line so return
		    if ( counter++ >= divisions ) {
			return;
		    }
		    
		    else{
			
			x_soFar += x_interval ;
			y_soFar += y_interval ;
			setTimeout( drawAnimationLineSlowly, drawTime );
		    }
		    
		}
		
		drawAnimationLineSlowly();
		
		
	    }
	    else{
		
		this.line.graphics.beginStroke(line_color).setStrokeStyle(3)
		    .drawLine(this.x1,this.y1, this.x2, this.y2  );            
            }
	    
	    
	  
	}
	
	
	l.redrawLine = function (color_code, drawTime, startNode){
	    
	    
	    this.graphicsline.clear();
	    this.removeChild(this.line);
	    
	    
	    this.drawAnimationLine(color_code, drawTime, startNode); 
	    
	    
	}
	
	/**
	* Lets change the value of a Line
	* @method
	* @type Method
	**/
	l.changeLineValue = function (value){
	    
	    this.value = value || this.value;
	    this.value.trim();
	    this.value = Number(this.value);
	    
	    this.value_text.text = value.toString();
	    if(stage) {stage.update();}
	    
	}
	
	// public methods:
	
	/* Need to extend the createjs.Graphics Class to be able to draw a line */
	createjs.Graphics.prototype.drawLine = function( x1, y1, x2,y2){
    
	    /* Copying inner Command Class for Instruction
	    I dont have access to it outside the scope of Graphics Class*/
	    function Command(f, params, path) {		
		
		this.f = f;
		this.params = params;
		this.path = path==null ? true : path;
	    }
 
    
	    Command.prototype.exec = function(scope) { this.f.apply(scope, this.params); }
	    /* End of Inner Command Class */
	    
	    this._dirty = this._active = true;
	    
		
	    this._activeInstructions.push(
		    new Command(this._ctx.moveTo, [x1, y1]),
		    new Command(this._ctx.lineTo, [x2, y2])            
	    );
    
	    return this;
	}
	
	
	/**
	 * Returns a clone of the Line instance.
	 * @method clone
	 * @return {Line} a clone of the Line instance.
	 **/
	l.clone = function() {
	    return new Line(this.x1, this.y1, this.x2, this.y2);
	} 
 
	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	l.toString = function() {
	    return "[Line (x1="+this.x1+" y1="+this.y1+" x2"
                +this.x2+" y2="+this.y2t+")]";
	}
	
	 
	l.deleteLine = function(arrays_I_am_in){
	    //this.line.graphics.clear();
	    for (var i in arrays_I_am_in) {
		arrays_I_am_in[i][ this.id ] = null;
		delete arrays_I_am_in[i][ this.id ];
	    }
	    
	    for (var i in this.inArrays){
		this.inArrays[i][this.id] = null;
		delete this.inArrays[i][this.id];//<--if its and object
	    }
	    
	    this.inArrays = null;
	    //This is a problem
	    //elements_in_canvas[ this.id ] = null;
	     
	    //Remove myself from connectionLines being pointed to me
	    delete this.connectionPrimary.connectionLines[this.id];
	    delete this.connectionSecondary.connectionLines[this.id];
	    
	    delete this.connectionPrimary.getLineConnectedToNode[this.connectionSecondary.id];
	    delete this.connectionSecondary.getLineConnectedToNode[this.connectionPrimary.id];
	    
	    delete this.connectionPrimary.connectedByLine[this.id];
	    delete this.connectionSecondary.connectedByLine[this.id];
	    
	    
	    if (this.connectionPrimary.rightChild == this.connectionSecondary) {
		this.connectionPrimary.rightChild = null;
	    }	    
	    else if (this.connectionPrimary.leftChild == this.connectionSecondary) {
		this.connectionPrimary.leftChild = null;
	    }
	    
	    //Secondary connections are children
	    this.connectionSecondary.animationParent = null;
	    
	    this.graphicsline.clear();
	    this.active = false;
	    
	    (this.value_text) ? (this.value_text.text = "", delete this.value_text) : '' ;
	    
	    //Clear the text
	    $.each(this.all_text, function(index, value){
		    value.text = "";
		    delete value;
	    })
	    
	    $.each(this.children, function(index, value){			
		    delete value;
	    })
	    
	    
	    //delete this.line//should be doing this already;		
	    delete this;	
	}
	
    createjs.Line = Line;
}());

/*****************************************************************
*  Node Class
*
*
*
*
*
*
*
*
******************************************************************/
// namespace:
this.createjs = this.createjs||{};


(function() {
 
/**
 * Represents a Node.
 *
 * @example
 *      var node = new createjs.Node();
 *
 * @class Node
 **/

var Node = function(  /* arguments */ ) {
    //args = arguments;
    
    this.initialize = createjs.Container.prototype.initialize;
    this.initialize();//Setting the "container"
    this.init( arguments );
}

//I need both properties of "Line" that  Im creating
//and "Container" because Im adding and moving Children
Node.prototype = new createjs.Container();

var n = Node.prototype;

	/** 
	* Numerical value of node
	* @property 
	* @type Number
	**/
	n.value = 0;
	
	/** 
	* Color of Node
	* @property 
	* @type Number
	**/
	n.color ;
	
	/** 
	* Numerical value of node - You must run the function
	* n.calculateBalanceFactor for n.bf to be set correctly
	* @property 
	* @type Number
	**/
	n.balanceFactor = n.bf =0;

	/** 
	* X Y array of center point.
	* @property 
	* @type Array
	**/
	n.center = n.centerPoint = {};
	
	/** 
	* X Y array of left connection point.
	* @property 
	* @type Array
	**/
	n.leftConnection_Point = {};
	
	/** 
	* X Y array of right connection point.
	* @property 
	* @type Array
	**/
	n.rightConnection_Point = {};
	
	/** 
	* X Y array of top connection point.
	* @property 
	* @type Array
	**/
	n.topConnection_Point = {};
	
	/** 
	* X Y array of bottom connection point.
	* @property 
	* @type Array
	**/
	n.bottomConnection_Point = {x:0 , y: 0};

	/** 
	* Node Parent of this node
	* @property 
	* @type Object(Node) 
	**/
	n.animationParent = null;
	
	/** 
	* Line Container linking this node to parent
	* @property 
	* @type Object(Line Container)
	**/
	n.parentLine = null;
	
	/** 
	* Array of Child Nodes.
	* @property 
	* @type Array
	**/
	n.animationChildren = {};
	
	/** 
	* X Y array of center point.
	* @property 
	* @type Array
	**/
	n.animationChildrenLine = {};
	
	/** 
	* All line containers connected to this node.
	* @property 
	* @type Array
	**/
	n.connectionLines = {};
	
	/** 
	* Connected to this node via the line.id
	* @property 
	* @type Node
	**/
	//n.connectedByLine = [];
	n.connectedByLine = {};
	
	
	/** 
	* Connected to this node via the line.id
	* @property 
	* @type Node
	**/
	n.getLineConnectedToNode = {};
	
	/** 
	* Distance to node
	* @property 
	* @type Array
	**/
	n.distanceToNode = {};
	
	/** 
	* Distance to from Starting Node
	* @property 
	* @type Array
	**/
	n.distanceFromStart ={};
	
	/** 
	* GridSpace node is currently occupying
	* @property 
	* @type Object
	**/
	n.gridSpace = null;
	
	/** 
	* Bitmap Image Container 
	* @property 
	* @type Object(CreateJS Bitmap Container)
	**/
	n.bitmap_image = null;
	
	/** 
	* Actual Image with properties
	* @property 
	* @type Object(CreateJS Bitmap Container)
	**/
	n.image = null;
	
	/** 
	* Width of the node
	* @property 
	* @type Integer
	* **/
	n.width = null;
	
	/** 
	* Height of the node
	* @property 
	* @type Integer
	**/
	n.height = null;
	
	/** 
	* Left Child
	* @property 
	* @type Node
	**/
	n.leftChild = null;
	
	/** 
	* Right Child
	* @property 
	* @type Node
	**/
	n.rightChild = null;
	
	/** 
	* Am I right Child or left Child
	* @property 
	* @type Node
	**/
	n.rtp = n.relationToParent = null;
	
	/** 
	* number of Children
	* @property 
	* @type Integer
	**/
	n.numOfChildren = 0;
	
	
	/** 
	* Order number is in tree
	* @property 
	* @type Integer
	**/
	n.order = -1;
	
	/** 
	* Text of Node Value
	* @property 
	* @type String
	**/
	n.valueText;
	
	/** 
	* Additional information to be put inside node
	* @property 
	* @type String
	**/
	n.subText;
	
	/** 
	* Additional information to be put inside node
	* @property 
	* @type String
	**/
	n.superText;
	
	/** 
	* Additional information to be put OUTSIDE node
	* @property 
	* @type String
	**/
	n.outsideText;
	
	/** 
	* Lets have an overlay in case I want extra color to signal something
	* @property 
	* 
	**/
	n.overlay;
	
	/** 
	* Log function can be set to another function that logs messages or
	* defaults to console.log
	* @property 
	* 
	**/
	n.overlay;
	
	/** 
	* Lets initiate everything
	* @method
	* @type Method
	**/
	n.init  = function (args){
	    args = args[0];
	    this.set({id: args.id}).addChild(args.image,
		args.text, args.subText, args.superText, args.outsideText);
	    
	    //TODO:this id is going to cause you problems
	    //Your resetting the given createjs id and giving it a random
	    //one which could conflict with something already created. CHANGE IT!!
	    //Create node value and index it by that
	    
	    this.connectionLines = {};
	    this.animationChildrenLine = {};
	    this.animationChildren = {};
	    this.connectedByLine = {};
	    this.distanceToNode = {};
	    this.distanceFromStart = {};
	    this.getLineConnectedToNode = {};
	    
	    this.bitmap_image = args.image;
	    this.image = args.image.image;
	    
	    this.width  = this.image.width;
	    this.height = this.image.height;
	    
	    this.valueText = args.text;
	    this.subText = args.subText;
	    this.superText = args.superText;
	    this.outsideText = args.outsideText;
	    
	    this.centerPoint = { x: this.image.width/2,
              y: this.image.height/2 };
	      
	    this.value = this.id;
	    this.color = '';
	    
	    this.overlay =  new createjs.Shape(new createjs.Graphics().beginFill("#ff0000").drawCircle(50, 50, 30));
	    this.overlay.alpha = 0;
	    this.addChild(this.overlay);
	    
	    this.Log = console.log;
	}
	
	
	
	/** 
	* Return the current center Point
	* @method
	* @type Method
	**/
	n.getCenterPoint  = function (args){
	    
	    return {x:this.x + this.width/2,
		    y:this.y + this.height/2 }    
	    
	}
	
	/**
	* Get the distance of the node away from the root
	* //TODO a better more comprehensive message for this error
	**/
	n.getNodeLevel = function( ) {
	    /* TODO: Need to make sure you dont
	     * execute this for stuff like Dijkstra
	    if () {
		//code
	    }
	    */
	    
	    
	    var counter = 0, self=this;
	    while (self.animationParent ) {
		self = self.animationParent;
		counter++;
	    }
	    
	    return counter;
	}
	
	/**
	* Get the sibling of the node. If no parent return null 
	* Only to be used for operations where parent has only two hildren
	**/
	n.getSibling = function(){
	    
	   if(this.animationParent){
	    var parent =  this.animationParent;
	     return ( parent.rightChild == this ) ? parent.leftChild : parent.rightChild ;
	    
	   } 
	    
	    return null;
	}
	
	/**
	* Gets the root of this node i.e. the topmost ancestor
	* and return the parent
	**/
	n.getRoot = function (){
	    
	    var current = this;
	    
	    while (current.animationParent) {
		current = current.animationParent;
	    }
	    
	    return current;
	    
	}
	
	/** 
	* Return the current center Point
	* @method
	* @type Method
	**/
	n.mbc = n.moveByCenter  = function (args){
	    
	    return {x:this.x + this.width/2,
		    y:this.y + this.height/2 }    
	    
	}

	/** 
	* Additional information to be put inside node
	* @method 
	* @type String
	**/
	n.changeSubText = function(string){	    
	    this.subText.text = string;	    
	};
	
	/** 
	* Additional information to be put inside node on top
	* @method 
	* @type String
	**/
	n.changeSuperText = function(string){	    
	    this.superText.text = string;	    
	};
	
	/** 
	* Function to change outside Text
	* @method 
	* @type String
	**/
	n.changeOutsideText = function(string){	    
	    this.outsideText.text = string;	    
	};
	
	/** 
	* Update Node Position
	* @Method 
	* @type Function
	**/
	n.update_position = function(){
	    	    
	    this.leftConnection_Point =  { x: this.x,
		y: this.y + this.image.height/2 };
	
		    this.rightConnection_Point = { x: this.x + this.image.width ,
		y: this.y + this.image.height/2 };
	
		    this.topConnection_Point = { x: this.x + this.image.width/2,
		y : this.y };
	
		    this.bottomConnection_Point = { x: this.x + this.image.width/2,
		y: this.y + this.image.height };
				    
		    return this;	
                        
	}
	
	/** 
	* Update Node Position
	* @Method 
	* @type Function
	**/
	n.breakConnection = function(breakfromNode){
	    
	    if ( !breakfromNode) {
		this.Log('Warning: Invalid Node to break from');
		return
	    }
	    
	    if( !this.getLineConnectedToNode[breakfromNode.id]){
		this.Log('Warning: Parent Node ' + this.id +'  and Child Node '+
	      breakfromNode.id +'are not connected ' +  'and dont need to be broken');
		return;
	    }	
	    
	    var parent  = this , child = breakfromNode, breakChild, breakParent, bypass;	   
		
	    //Ternary if else if to capture the true parent - child relationship
	    //just in case the relationship has been switched at some point
	    ( child.animationChildren[parent.id] ==  parent ) ? (breakChild = parent, breakParent = child) :
	    ((child.animationParent == parent ) ? (breakChild = child, breakParent = parent): '' ) ;
	    
	    if (!breakParent || !breakChild) {
		    bypass =  true;
	    }
	    //Resets the proper child and parent after testing
	    child = breakChild;
	    parent =  breakParent;
	    
	    //I want to bypass all of this if its not a parent child relationship
	    if ( bypass == null || bypass == false ) {		    
	    
		    child.animationParent = null;
		    child.relationToParent = '';
		    var templine_node = parent.animationChildrenLine[child.id] ||
			    child.animationChildrenLine[parent.id];
		    templine_node.deleteLine({1: elements_in_canvas, 2: lines_in_canvas});
		    
		    
		    parent.animationChildren[child.id] = null;
		    
		    
		    if ( parent.rightChild == child) {
			    parent.rightChild = null;
		    }
		    
		    else if ( parent.leftChild == child) {
			    parent.leftChild = null;
		    }
		    
		    parent.numOfChildren--;
		    
		    
		    this.Log("Breaking Parent - Child ( "+ breakParent.id + " ---> "
			+ breakChild.id + " ) relationship");
		    
		    
		    delete parent.animationChildren[child.id] ;
	    }	
		    
	    //If bypass is true	
	    else if( bypass==true ){
		    
		    var templine = parent.getLineConnectedToNode[child.id];
		    templine.deleteLine({1: elements_in_canvas, 2:lines_in_canvas});
		    
		    this.Log("Breaking Connection from Node "+ parent.id + " to Node "
			    + child.id );
		    
	    }
	    
	    
	    
	    		    
	    return this; 
	}
	
	/** 
	* Update Node Position
	* @Method 
	* @type Function
	**/
	n.breakAllConnections = function (){
	    
	    for (var i in this.connectedByLine) {
		this.breakConnection( this.connectedByLine[i]  );
	    }
	    
	    
	    return this;
	}
	
	/** 
	* Update Node Position
	* @Method 
	* @type Function
	**/
	n.deleteNode = function(){
	    
	    var  self = this, connections= Object.keys( this.connectionLines ) ;
	    
	    //Lets delete the lines associated with this node
	    $.each(connections, function(index, key){
		self.connectionLines[ key ].deleteLine();
	    });
	    
	    if (this.animationParent) {
		this.animationParent.numOfChildren = this.parent.numOfChildren--;
	    }
	    
	    
	    this.parent = this.rightChild =  this.leftChild = this.gridSpace.occupant = null;
	    this.gridSpace = this.animationParent = this.id = this.value =
	    this.connectionLines = this.connectedByLine = null;
	    
	    
	    createjs.Tween.get(this).to({alpha:0,visible:false},3000).to({x: -500 },400);
	    
	    
	}
	
	/** 
	* Calculate Depth of Subtree w/ this as root node
	* @Method 
	* @type Function
	**/
	n.depth  = function( node ){
	    
	    return ( node == null ) ? 0 : Math.max( this.depth(node.leftChild) ,
		    this.depth(node.rightChild)) + 1;
	        
	}
	
	/** 
	* Calculate Balance(Difference in right and left subtrees)
	* @Method 
	* @type Function
	**/
	n.cbf = n.calculateBalanceFactor = function(){
	    
	    return this.bf = n.depth( this.rightChild ) - n.depth(  this.leftChild   );
	    
	}
	
	
	/** 
	* Return the node's closest ancestor thats not balanced.
	* If all ancestors are balanced then it returns null
	* @Method 
	* @type Function
	**/
	n.findClosestAncestorNotBalanced = n.fcanb = function( ){
        
	    var node = this;
	
	    while ( node.animationParent ) {
		
		var balanced = node.cbf();
		
		if( balanced > 1 || balanced < -1 ) {
		    return node;
		}
		else {
		    node = node.animationParent  ;
		}
		
	    }
        
	    return null;
        
	}
	
	
	
	n.changeTextColor =  function(hex_color_code){
	    var self = this;
	    for (var i in self.children) {
		if (self.children[i].text != null) {
		    self.children[i].color = hex_color_code;
		}
	    }
	}
	
	var colorFilters = {'blue':[0,0,1], 'teal':[0,1,1],
	   'red':[1,0,0], 'yellow':[1,1,0], 'green':[0,1,0],
	   'purple':[1,0,1], 'white':[1,1,1], '':[1,1,1]}
	
	n.changeColor = function( color_string,args ){
	    
	    var self = this, c = colorFilters[color_string],
		img_width =  this.bitmap_image.image.width,
		img_height = this.bitmap_image.image.height ;
	    self.bitmap_image.filters = [new createjs.ColorFilter(c[0],c[1],c[2],1)];
	    self.bitmap_image.cache(0,0,img_width, img_height);
	    
	    self.color = color_string;
	    
	    if ( args && args.overlay) {
		this.changeOverlay(args.overlayHexColor, args.overlayAlpha)
	    }
	    
	}
	
	n.changeOverlay = function(hexColor, alpha){
	    var overlayAlpha = alpha || 0.0, overlayColor = hexColor || '#00000' /*'#fe0000'*/;
	    
	    
	    this.overlay.alpha = overlayAlpha;
	    this.overlay.graphics.clear();
	    this.overlay.graphics = new createjs.Graphics().beginFill(overlayColor).drawCircle(50, 50, 30);
	
	}
	
	function hexToRGBColorFilter(hex, alpha) {
	    
	    /* this was previously in another function
	    var bm_img = this.bitmap_image, hex = hex_color || "#fe0000",
		alpha = user_alpha || 1 ,filter  = hexToRGBColorFilter(hex, alpha);
	    bm_img.filters =  [filter] ;
	    
	    bm_img.cache(0,0, bm_img.image.width, bm_img.image.height );
	    */
	    
	    var color = parseInt(hex.substr(1), 16);
	    var r = color >> 16;
	    var g = color >> 8 & 0xFF;
	    var b = color & 0xFFFF;
	    return new createjs.ColorFilter(0,0,0,0, r,g,b,1);
	}	


createjs.Node = Node;
}());


/*****************************************************************
*  Grid Class
*
*
*
*
*
*
*
*
******************************************************************/
// namespace:
this.createjs = this.createjs||{};



(function() {
    
    
    
  
/**
 * Represents a Node.
 *
 * @example
 *      var node = new createjs.Node();
 *
 * @class Node
 **/

var Grid = function(  /* arguments */ ) {
    //args = arguments;
    
    this.initialize = createjs.Container.prototype.initialize;
    this.initialize();//Setting the "container" for the grid
    this.init( arguments );
}

//Lets create a grid for easier handling of movements in the puzzle
//and "Container" because Im adding and moving Children
Grid.prototype = new createjs.Container();

var g = Grid.prototype;
  
	/** 
	* Numerical value of grid
	* @property 
	* @type Number
	**/
	g.value = 0;
	
	/** 
	* Order from left to right grid is
	* @property 
	* @type Number
	**/
	g.order = 0;
	
	/** 
	* Text to display order of grid
	* @property 
	* @type Number
	**/
	g.orderText = 0;
	
	/** 
	* Text to display order of grid
	* @property 
	* @type Number
	**/
	g.superText ;
	
	/** 
	* Height of grid
	* @property 
	* @type Number
	**/
	g.height = 0;
	
    
	/** 
	* Width of grid
	* @property 
	* @type Number
	**/
	g.width = 0;
	
	/** 
	* Column grid is in
	* @property 
	* @type Number
	**/
	g.column = 0;
	
	
	/** 
	* Pointer to what is in this grid
	* @property 
	* @type Object
	**/
	g.occupant = null;
	
	/** 
	* Top, bottom, left, and right grid lines
	* @property 
	* @type Array
	**/
	g.gridLines = [];
	
	/** 
	* Array of centerPoint of grid
	* @property 
	* @type Array
	**/
	g.center = g.centerPoint = [];
    
	/** 
	* Array of top left coordinate of grid
	* @property 
	* @type Array
	**/
	g.topLeft = [];
	
	/** 
	* Array of top right coordinate of grid
	* @property 
	* @type Array
	**/
	g.topRight = [];
	
	/** 
	* Array of bottom left coordinate of grid
	* @property 
	* @type Array
	**/
	g.bottomLeft = [];
	
	/** 
	* Array of bottom right coordinate of grid
	* @property 
	* @type Array
	**/
	g.bottomRight = [];
	
	/** 
	* Grid to the left
	* @property 
	* @type Array
	**/
	g.leftGrid = null;
	
	/** 
	* Grid to the right
	* @property 
	* @type Array
	**/
	g.rightGrid = null;
	
	/** 
	* Grid to the top
	* @property 
	* @type Array
	**/
	g.topGrid = null;
	
	/** 
	* Grid to the bottom
	* @property 
	* @type Array
	**/
	g.bottomGrid = null;
	
	/** 
	* Lets initiate everything
	* @method
	* @type Method
	**/
	g.init  = function (args){
	    args = args[0];
	    
	    this.row = args.row, this.column = args.column,
	    this.height = args.height, this.width = args.width,
	    this.center = this.centerPoint = args.centerPoint, this.topLeft = args.topLeft,
	    this.topRight = args.topRight, this.bottomLeft = args.bottomLeft,
	    this.bottomRight = args.bottomRight,  this.order = args.order;
	    
	    this.drawLines(this.topLeft, this.topRight);
	    this.drawLines(this.topLeft, this.bottomLeft);
	    this.drawLines(this.topRight, this.bottomRight);
	    this.drawLines(this.bottomLeft, this.bottomRight);
	    
	    
	    this.showLines();
	    
	    this.orderText = new createjs.Text(this.order,
		12 + "px Arial", "#000");
	    
	    this.orderText.x = this.bottomLeft.x + 5;
	    this.orderText.y = this.bottomLeft.y - 18;
	    
	    this.superText = new createjs.Text('',
		12 + "px Arial", "#000");
	    
	    this.superText.x = this.topLeft.x + this.width/2;
	    this.superText.y = this.topLeft.y + 10;
	    
	    this.addChild(this.orderText, this.superText);
	    
	}
	
	
	/** 
	* Lets draw the top, bottom, left, and right grid lines
	* @method
	* @type Method
	**/
	g.drawLines = function(point1, point2){	    
	   
	    var bg = new createjs.Shape();
	    
	    bg.graphics.beginStroke("#444")
			.moveTo(point1.x, point1.y)
			.lineTo(point2.x, point2.y);
			
	    this.addChild(bg);
	    this.gridLines.push(bg);
	}
	
	/** 
	* Lets show the all the lines
	* @method
	* @type Method
	**/
	g.showLines = function(){		    
	    for (line in this.gridLines) {
		this.gridLines[line].alpha = 1;
	    }	    
	}
	
	/** 
	* Lets hide the top, bottom, left, and right grid lines
	* @method
	* @type Method
	**/
	g.hideLines = function(){	    
	    for (line in this.gridLines) {
		this.gridLines[line].alpha = 0;
	    }    
	}
	
	g.showOrder = function(bool){
	    var show = bool|| true;
	    
	    this.orderText.alpha = (show) ? 1 : 0 ; 
	    
	    
	}
	
	g.changeSuperText = function(string){
	    
	    this.superText.text = string;
	    
	    return this;
	}
	
	function searchGrids( array_of_grids, self, args ) {
	    
	    if( !array_of_grids ) {
		var msg = 'You need to pass in an array of grids to iterate through!'
		Log(msg);
		throw new Error(msg);
	    
		return;		    
	    }
	   
	   var  direction = args.direction, index = self.order + direction,
	    want_occupied_grid = args.occupied;
	   
	   while ( array_of_grids[index] ) {
	    
	     if( !array_of_grids[index].occupant && !want_occupied_grid){
		return array_of_grids[index];
	     }
	     
	     else if (array_of_grids[index].occupant && want_occupied_grid) {
		return array_of_grids[index];
	     }
	     
	     index += direction;
	    
	    }
	    
	    return null;
	    
	}
	
	g.getNextOccupiedGrid = function (array_of_grids){
	   
	   return searchGrids( array_of_grids, this, {'direction': 1, 'occupied':true} );  
	}
	
	g.getPreviousOccupiedGrid = function (array_of_grids){
	   
	   return searchGrids( array_of_grids, this, {'direction': -1, 'occupied':true} );  
	}
	
	g.getNextFreeGrid = function (array_of_grids){
	    
	    return searchGrids( array_of_grids, this, {'direction': 1, 'occupied':false} );   
	}
	
	g.getPreviousFreeGrid = function (array_of_grids){
	    
	    return searchGrids( array_of_grids, this, {'direction': -1, 'occupied':false} );   
	}
	
	
    
    
createjs.Grid = Grid;
}());






