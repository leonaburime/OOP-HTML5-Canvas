/****************************************************************
 * My name is Leon Aburime and I made all this right here
 * U...S...C TROJAAAAAANSS!!
 *
 *
 *  http://davidwalsh.name/convert-canvas-image
 *
 *
 ***************************************************************/
/*TODO: Done: Tween Merge Sort
      : Create class function breakConnection for Nodes
      : Do Red Black Tree Insertion, Deletion
      : Binomial Heap Delete Minimum Delete
      : Done: Above involves changing the Binary Heap 'Resort' Function to return an array
      : Min and Max Heapify
      
*/
/********************************************************************************
********************************************************************************/
function isValidNumber(user_number) {
    var args = arguments[0] || [],
    number = user_number || args[0],
     error_message = args.error_message || 'Error: Bad User Input ( Invalid Number Maybe ??).  Please check '+
    'directions and try again.';
    
    //Strip out commas and check if a valid number
    if (!number) {
        Log(error_message);
        return false;
    }
    
    if ( !$.isNumeric(  number.replace(/,/g, '') ) ) {
       Log(error_message);
       return false;
    }
    
    return true;
}

/********************************************************************************
********************************************************************************/
function validate_user_input() {
    
    
    var args = arguments[0] || [],
    //Lets set up some defaults
    user_input = args.user_input ||  $('input#input').val() ,
   
    
    is_a_valid_number = isValidNumber(user_input);
    
    if (!is_a_valid_number) {
        return false;
    }
    
    /*
    //Strip out commas and check if a valid number
    if (!user_input) {
        Log(error_message);
        return false;
    }
    
    if ( !$.isNumeric(  user_input.replace(/,/g, '') ) ) {
       Log(error_message);
       return false;
    } 
   */
    
    
    
    if( !elements_in_canvas[Number( user_input )] ){
        Log('Error: Input Node '+ user_input +' does not exist');
       return false;
    }
    
    return true;
    
}
/********************************************************************************
 *Lets refactor the graph to get a nicer looking
********************************************************************************/
function getUnconnectedNodes() {
    
       var unconnected_nodes = nodes_in_canvas.filter(function(n){
	
	    if  (Object.keys( n.getLineConnectedToNode ).length < 1 )
		return n;
            
        })
       
    return unconnected_nodes;
}
/********************************************************************************
 *Return all the nodes that dont have parents
********************************************************************************/
function retrieve_top_node() {
	       
        return top_level_nodes =  nodes_in_canvas.filter(
            function(n){
                if( !n.animationParent   ) return n;
            });
}
/********************************************************************************
 * Breadth First Search
********************************************************************************/ 
function Breadth_First() {
    
    roots = retrieve_top_node();
 
    if ( roots.length > 1) {
        Log('Error: Binary Search cannot be performed because two or more '
            + 'nodes dont have parents. Only the root(top node) cannot have a parent');
        
        return;
    }
    
    if (!validate_user_input()) {        
        return;
    }
 
 
    var root_node = roots.shift(), current_node, 
        counter = 0 /*used for results purposes*/,
        found = false, adding_children = 0,
        target_node = elements_in_canvas[ parseInt( $('input#input').val() ) ];
    
    var queue = [];//Lets start off with an empty array
    queue.push(root_node); //Lets mark the very first node
    
     Log('\n********************************************* \n Breadth First Search '
         + '\n*********************************************\n');
    Log('Starting Search at Root Node ' + root_node.id);
            
    
    while( queue.length !=0 ) {
        counter++;
        current_node = queue.splice(0,1 )[0];
        
	
	var message;
        
        if (current_node == target_node) {          
            found = true;
	    
	    
            message = 'Node ' + target_node.id + ' found on level ' + current_node.getNodeLevel() + ' !';
            
	    tweenNodeColor(current_node, {'timeLine': tl,'message': message,
	    'startAt': start_time += tbt, 'color':'purple'});
	    
	    break;
            
        }       
        
        else{
	    
	    message = 'Node ' + current_node.id + ' and Node ' + target_node.id
                +' don\'t match. Continuing...';
            
	    tweenNodeColor(current_node, {'timeLine': tl,'message': message,
	    'startAt': start_time += tbt});
	    
            //If not found 
            ( current_node.leftChild ) ? queue.push( current_node.leftChild )   :  ''    ;
            ( current_node.rightChild ) ? queue.push( current_node.rightChild )   :  ''    ;
           
        }
        
        adding_children++;
        
    }
    
}
/********************************************************************************
 * Function Depth First Search
********************************************************************************/
function Depth_First() {
    
    roots = retrieve_top_node();
 
    if ( roots.length > 1) {
        Log('Error: Binary Search cannot be performed because two or more '
            + 'nodes dont have parents. Only the root(top node) cannot have a parent');
        
        return;
    }
    
    if (!validate_user_input()) {        
        return;
    }
    
    var root_node = roots.shift(), current_node, 
        counter = 0 /*used for results purposes*/,
        adding_children = 0,
        target_node = elements_in_canvas[ parseInt( $('input#input').val() ) ];
    
    var queue = [];//Lets start off with an empty array
    queue.push(root_node); //Lets mark the very first node
    
    Log('\n********************************************* \n Depth First Search '
         + '\n*********************************************\n');
    Log('Starting Search at Root Node ' + root_node.id);
    
    
    
    function dfs_recurse( current_node, found ) {      
        
	var message;
	
        if (current_node != target_node) {
           
	   
	   
            message = 'Node ' + current_node.id + ' and Node ' + target_node.id
                 +' don\'t match. Continuing...';
		 
	    tweenNodeColor(current_node, {'timeLine': tl,'message': message,
	    'startAt': start_time += tbt})
	    
            found = ( current_node.leftChild && !found) ? dfs_recurse ( current_node.leftChild, found ) : found;
            found = ( current_node.rightChild && !found ) ? dfs_recurse ( current_node.rightChild, found) : found; 
            
	    
	    
	    
        }
        
        else{ found = true;
            message = 'Node ' + target_node.id + ' found on level ' + current_node.getNodeLevel() + ' !';
	    
	    tweenNodeColor(current_node, {'timeLine': tl,'message': message,
	    'startAt': start_time += tbt , 'color':'purple'})
	}
        
	
	
        return found;
        
    }
    
    dfs_recurse(root_node, false);
    
    
}
/********************************************************************************
 * Minimum Spanning Tree- Try to find the least path cost that connects all
 * nodes in a graph. Implementing Prims algorithm. Fuck this was annoying!
********************************************************************************/ 
function MST(){
    
    if ( !validate_user_input({'user_input': $('input#start').val() })
         ) { //takes care of non-existent nodes       
        return;
    }    
    
    var ucn = unConnectedNodes = getUnconnectedNodes();
 
    if ( ucn.length > 0 ) {
        Log('\n Error: MST Operations cannot be performed because multiple '
            + 'nodes are not connected to the graph.');
	
        return;
    }    
    
    Log('\n********************************************* \n Minimum Spanning Tree '
        + '\n*********************************************\n');
    
    var unexplored_nodes = {},explored_lines = {},
	unexplored_lines = [], mstLines = [] , counter = 1,
	node_start = parseInt( $('input#start').val() ),
        current_node = nodes_in_canvas_by_id[ node_start ];
    
    nodes_in_canvas_by_id.filter(function(n){ n.searched = false; unexplored_nodes[n.value ] = n;});
    
    //Lets filter the lines I need to get, set some preliminary information
	//and redraw the lines to black in case the user wants to run the algorithm again
    $.each(elements_in_canvas, function(index,line){
	
	(line instanceof createjs.Line) ?
	    (line.redrawLine('#000'), line.searched=false,
		unexplored_lines[line.id] = line ) : '';       
	
    });
    
    
    //Lets Start
    while ( Object.keys(unexplored_nodes).length > 0  ) {
	
	//Remove the node from unexplored nodes and mark as searched
	delete unexplored_nodes[current_node.value];
        current_node.searched = true;
	
	message='Beginning iteration of unsearched lines connected to Node '
	    + current_node.value;
	
	tweenDrawLine( dummy=current_node/*No tweening - Just posting a message*/, {'timeLine': tl,'message': message,
		    'startAt': start_time += .5, 'onlyMessage':true} );
	
	
	var message;
	
	for (var i in current_node.connectionLines) {
	    
	    
	    
	    var line = current_node.connectionLines[i];
	    
	    
	    
	    //If theyve been searched before continue on
	    if ( !line.searched  ) {
		
		nodeConnectedTo = current_node.connectedByLine[line.id];
	    
		//Creating an object of arrays to take care of
		//multiple minimum paths and ensure they are not overwritten
		( explored_lines[line.value] ) ? explored_lines[line.value].push(line) :
		    explored_lines[line.value]= [line];
		
		//Lets mark it searched so I dont search it again and let the program
                //know I added a new line
		line.searched = true, new_line_added = true;
                
                //Im adding this line so lets remember the other node
                //that this line is connected to
		line.minPartner = current_node.connectedByLine[line.id];
	    			
		message = "Searching Line with value " + line.value +
		    " connected from Node " + current_node.value +
		    " to Node " +  nodeConnectedTo.value;
		    
		tweenDrawLine( line, {'timeLine': tl,'message': message, 'drawTime':12.5,
		    'startAt': start_time += tbt,'startDrawingFromNode':current_node} );    
		
	    }
		
	    
	}       
	
	    var minLine;       
	            
            while (  Object.keys(explored_lines).length > 0) {
                
                //Now we have all of our keys lets sort them to find the minimum index
                var keys = Object.keys(explored_lines).map(Number).sort(function(a,b){ return a - b}),
                first = keys[0];
                
                //Remember Im getting the '[0]' in explored_lines
		//because each key in explored_lines is mapped to an array
		minLine = explored_lines[first][0];
	    
            
                //If I have less than two elements of the same value that are minimum
                //lets remove the key
                if (   explored_lines[first].length  < 2) {
                   
                    delete explored_lines[first];
                    
                }
                //I have more than one line so lets remove the first one after saving
                //it for use down below
                else{
                    
                    explored_lines[first].shift();
                    
                }
                
                
                //If I searched this minLine.minPartner already then I need to delete that
                //line and go on to the next min line that is connected to an unsearched node
                if ( minLine.minPartner.searched == false ) {
                    break;
                }
                
                minLine = null;
                
            
            }
	    
            //In case Im running into an empty line because Ive searched them all
            if ( minLine ) {
                
		message = '\nLine with value ' +minLine.value + ' is current minimum from '
		 + current_node.value +' to ' + minLine.minPartner.value;
		
                //Lets highlight the lines so I know which lines are part of the MST
                tweenDrawLine( minLine, {'timeLine': tl,'message': message, 
		    'startAt': start_time += tbt, 'color': '#3B5998'} );
		
		//minLine.redrawLine("#3B5998", 15);
                
                //Now lets push them IN ORDER to print out the connections for later
                mstLines.push( minLine );                    
               
                
                //Now since I have the min line lets move to the node that HASN'T been searched
                //that the minimum Line is connected to
                current_node = minLine.minPartner;  
            
               
            }
    
    }
    
    message = 'Results:\n';
    for (var i in mstLines) { var line = mstLines[i];
	message += '  (Node '+ line.connectionPrimary.value + ' ) -- '+ line.value
	  + ' -- (Node '+ line.connectionSecondary.value + ' )\n';
    }
    
    tweenDrawLine( dummy=current_node/*No tweening - Just posting a message*/, {'timeLine': tl,'message': message,
		    'startAt': start_time += .5, 'onlyMessage':true, 'drawTime':5,} );
    
    
}
/********************************************************************************
 * Dijkstra's Algorithm
********************************************************************************/ 
function Dijkstra(){
    
    if (!validate_user_input({'user_input': $('input#start').val() })
         || !validate_user_input({'user_input': $('input#finish').val() }) ) { //takes care of non-existent nodes       
        return;
    }
    
    var ucn = unConnectedNodes = getUnconnectedNodes();
 
    if ( ucn.length > 0 ) {
        Log('Error: Dijkstra Operations cannot be performed because multiple '
            + 'nodes are not connected to the graph.');
        
        return;
    }
    
    var explored_nodes = [], explored_lines = [], unexplored_nodes = [], unexplored_lines=[], path = {},      
        infinity = 10000000, starting_node = elements_in_canvas[ parseInt( $('input#start').val() ) ],
        target_node = elements_in_canvas[ parseInt( $('input#finish').val() ) ];
	
    var temp =  {};
        //Lets filter the nodes  
        $.each(elements_in_canvas, function(index,node){            
            (node instanceof createjs.Node) ?
		(unexplored_nodes[node.id]=node, node.changeColor('white'), node.subText.text = '') : '';            
            });
        
        //Lets filter the lines I need to get, set some preliminary information
	//and redraw the lines to black in case the user wants to run the algorithm again
        $.each(lines_in_canvas, function(index,line){	    
            
            line.redrawLine('#000');
	    line.searched=false;
	    unexplored_lines[line.id]=line;       
            
        });
        
        //Lets set the distance from each node at infinity to later do minimum comparisons
        $.each(unexplored_nodes.filter(function(n){return n}) ,function(index,node){
            starting_node.distanceToNode[node.id]=infinity;
	    node.min_dijkstra_line = null;
            node.distanceFromStart =infinity; });	
        starting_node.distanceToNode[starting_node.id]= starting_node.distanceFromStart  =0;
	starting_node.changeSubText('DFS:0');
    
    //Lets get some breathing room by giving this a title and a space    
    Log('\n********************************************* \n Dijkstra\'s Algorithm '
         + '\n*********************************************\n');
     
        
    
    var message, current_node = starting_node ;
    
    while ( unexplored_nodes && current_node) {       
        
        var min = infinity,
        min_line = null;
	
	
	tweenDrawLine( dummy=current_node , {'timeLine': tl,'message': null, 
	    'startAt': start_time += tbt , 'nodeColor': 'teal', 'nodeToColor':current_node,
	    'superText':'Lowest Key','superTextNode': current_node,
	    'onlyMessage':true} );
        
	//Lets go through the current node's unexplored lines
        for(var line_index in  current_node.connectionLines) {
            
            var current_line = current_node.connectionLines[line_index];
            var nodeVisited = current_node.connectedByLine[current_line.id];
	    
	    if (current_line.searched) {
		continue;
	    }
	    
	    //If searching for C, distance from A->B, and B->C
            var exploredNodeDistanceFromStart = starting_node.distanceToNode[current_node.id]
                + current_line.value,  endfs = exploredNodeDistanceFromStart;
            
	    message = "Exploring Line " + current_line.value + " starting at Node "
		+ current_node.value + " to Node " + nodeVisited.value + "\n";
	    
	    tweenDrawLine( current_line , {'timeLine': tl,'message': message, 
		'startAt': start_time += (tbt + 1.5), 'color': '#3B5998', 'drawTime': 15,
		'startDrawingFromNode':current_node} );
	    
	    
	    //If the distance from the starting node to the current node is less than
	    //what was previously stored update the current nodes distance from start
            if( starting_node.distanceToNode[nodeVisited.id] >  exploredNodeDistanceFromStart
		   &&  !current_node.connectionLines[line_index].searched){                
                
		
		var dist = (nodeVisited.distanceFromStart < infinity ) ?
		    nodeVisited.distanceFromStart : "INFINITY" ;
		    
		message = "Visited Node " + nodeVisited.id +"'s previous distance from Start Node " +
		    starting_node.id + " of " +  dist +  " has been updated to "
		    + endfs + " via line with cost " + current_line.value +" from Current Node "
		    + current_node.id + '\n';
		
		
		
		//Lets update the distance from start for both the starting node
		//and current node
                starting_node.distanceToNode[nodeVisited.id] = 
                nodeVisited.distanceFromStart = exploredNodeDistanceFromStart;
		
		
		//Lets save the line that has the shortest path from
		//starting node in a new variable
		nodeVisited.min_dijkstra_line = current_line;
		
		
		
		
		tweenDrawLine( current_line , {'timeLine': tl,'message': message, 
		    'startAt': start_time += tbt, 'color': '#ca413b', 'onlyMessage':true,
		    'subText': 'DFS:'+endfs, 'subTextNode': nodeVisited } );
		
		
            }
            
            //Updating lines that have been explored          
            unexplored_lines[current_line.id] = null;
            explored_lines[current_line.id] = min_line;
            current_line.searched = true;
        }
        
	//Updating my 
        explored_nodes[current_node.id] = current_node;	
	delete unexplored_nodes[current_node.id] ;       
	
	//Lets take all the information out before we switch the node 
	tweenDrawLine( dummy=current_node , {'timeLine': tl,'message': null, 
	    'startAt': start_time , 'nodeColor': 'white', 'nodeToColor':current_node,
	    'superText':' ', 'superTextNode': current_node,
	    'onlyMessage':true} );
	
	//Switch to node w/ minimum distance from start node
        current_node = unexplored_nodes.slice(0).sort(function(a, b){
            return a.distanceFromStart-b.distanceFromStart     })[0];
        //starting.distanceToNode[current_node.id] = min
    }
    
    var dist = (target_node.distanceFromStart < infinity ) ?
	target_node.distanceFromStart : "Does Not Exist" ;
	
    //Now Lets print out the path sequence and color the lines red so the user can see
    var path_node = target_node, path = [];
    
    //Only the first node in the path will not have a min_dijsktra_line
    while (path_node.min_dijkstra_line  ) {
	
	tweenDrawLine( path_node.min_dijkstra_line , {'timeLine': tl,'message': null, 
		    'startAt': start_time += tbt, 'color': '#ca413b',
		    'startDrawingFromNode':path_node,'drawTime':10} );
	
	path.push(' --( ' + path_node.min_dijkstra_line.value + ' )-- ' + "Node " + path_node.id  );
	path_node = path_node.connectedByLine[path_node.min_dijkstra_line.id];
	
    }
    //Lets push the starting node since it has no 'min_dijsktra_line'
    path.push( "Path: Node " + starting_node.id);
    message = path.reverse().join("")  ;
	
    message += 'Answer: Shortest Distance from Starting Node ' + starting_node.id +
            ' to Target Node ' + target_node.id + ': ' + dist ;
    
    tweenDrawLine( dummy=current_line , {'timeLine': tl,'message': message, 
		    'startAt': start_time += tbt, 'onlyMessage': true} );
    
}

/********************************************************************************
 * Bellman-Ford Algorithm
********************************************************************************/ 
function Bellman_Ford(){
    
    if (!validate_user_input({'user_input': $('input#start').val() })
         || !validate_user_input({'user_input': $('input#finish').val() }) ) { //takes care of non-existent nodes       
        return;
    }
    
    var ucn = unConnectedNodes = getUnconnectedNodes();
 
    if ( ucn.length > 0 ) {
        Log('\n Error: Bellman-Ford Operations cannot be performed because multiple '
            + 'nodes are not connected to the graph.');
        
        return;
    }
    
    var explored_nodes = [], explored_lines = [], unexplored_nodes = [], unexplored_lines=[], path = {},      
        INFINITY = infinity = 10000000, starting_node = elements_in_canvas[ parseInt( $('input#start').val() ) ],
        finish_node = elements_in_canvas[ parseInt( $('input#finish').val() ) ];
	
    var temp =  {};
        //Lets filter the nodes  
        $.each(nodes_in_canvas, function(index,node){            
            unexplored_nodes[node.id]=node;
	    node.changeSubText('');
	    node.changeColor('white');
	    
        });
        
        //Lets filter the lines I need to get, set some preliminary information
	//and redraw the lines to black in case the user wants to run the algorithm again
        $.each(lines_in_canvas, function(index,line){
	    
	    line.redrawLine('#000');
	    line.searched=false;
	    unexplored_lines[line.id]=line;       
            
        });
        
        //Lets set the distance from each node at infinity to later do minimum comparisons
        $.each(unexplored_nodes.filter(function(n){return n}) ,function(index,node){
            starting_node.distanceToNode[node.id]=infinity;
	    node.min_bellman_ford_line = null;
            node.distanceFromStart =infinity;
	});
	
        starting_node.distanceToNode[starting_node.id]= starting_node.distanceFromStart  =0;
	
    
    var d = {};
    for (var i in unexplored_nodes){
	d[ unexplored_nodes[i].value ] = INFINITY; }
	
    d[starting_node.id] = 0;
    starting_node.changeSubText('DFS:0');
    
    //Lets get some breathing room by giving this a title and a space    
    Log('\n********************************************* \n Bellman-Ford Algorithm '
        + '\n*********************************************');
    Log('Note: All Edges are bidirectional');
     
    var current_node = starting_node;    
    
    for( i=1; i <= Object.keys(d).length - 1; i++  ) {
	
    
	for ( var j in unexplored_lines ) {	
	    var line = unexplored_lines[j], success = false, message, distanceToNode;
	    
	    message = '\nIteration number '+ i +': Relaxing line ' + line.value +' connected from '+
		line.connectionPrimary.id + ' to ' +line.connectionSecondary.id;
		
	    tweenDrawLine( line , {'timeLine': tl,'message': message, 
		'startAt': start_time += (tbt+1.5) , 'color': '#3B5998', 
		'drawTime':10} );
	    
	    if ( (d[line.connectionPrimary.id ]+ line.value ) < d[line.connectionSecondary.id]  ) {
		
		var previous_value = d[line.connectionSecondary.id];
		distanceToNode = line.connectionSecondary;
		
		d[line.connectionSecondary.id] = d[line.connectionPrimary.id ]+ line.value;
		line.connectionSecondary.min_bellman_ford_line = line;
		success = true;
		
		message = '\nPrevious distance from startNode ' + starting_node.id +' to Node ' + line.connectionSecondary.id
		   + ' updated from ' + previous_value + ' to '+ d[line.connectionSecondary.id] ;
	    }
	   	  
	    if ( (d[line.connectionSecondary.id ]+ line.value ) < d[line.connectionPrimary.id]  ) {
		
		var previous_value = d[line.connectionPrimary.id];
		distanceToNode = line.connectionPrimary;
		
		d[line.connectionPrimary.id] = d[line.connectionSecondary.id ]+ line.value;
		line.connectionPrimary.min_bellman_ford_line = line;
		success = true;
		
		message = '\nPrevious distance from startNode ' + starting_node.id +' to Node ' + line.connectionPrimary.id
		   + ' updated from ' + previous_value + ' to '+ d[line.connectionPrimary.id] ;
	    }
	    
	    if (success) {
		
		tweenDrawLine( line, {'timeLine': tl,'message': null, 
		    'startAt': start_time += tbt, 'onlyMessage':true,
		    'subTextNode': distanceToNode,'subText':'DFS:'+d[distanceToNode.id] } );
	    }
	    
	}
	
    }
  
   
    //Now lets color the lines so we see the shortest path
    var node = finish_node, cycle={};
    while( node.min_bellman_ford_line ) {		
	var line = node.min_bellman_ford_line, onlyMessage = false, message = null,
	    negativeCycle= false;
	if (/*line.id in cycle || */  d[node.connectedByLine[line.id].id] + line.value < d[node.id] ) {
	    message= "\nError: OOPS ... This graph has a negative cycle and therefore no minimum path";
	    negativeCycle = onlyMessage = true;
	    
	}
	    
	cycle[line.id] = line.value;
	
	tweenDrawLine( node.min_bellman_ford_line, {'timeLine': tl,'message': message, 
	    'startAt': start_time += tbt, 'color': '#ca413b', 'onlyMessage': onlyMessage,
	    'drawTime':10, 'startDrawingFromNode':node} );
	 
	if ( negativeCycle ) {
	    //Lets turn em all black
	    $.each(lines_in_canvas,function(index, line){	
		
	    tweenDrawLine( line, {'timeLine': tl,'message': null, 
		'startAt': start_time, 'color': '#000', 'onlyMessage': false
	    } );
		
		})
	    return;
	}
	  
	//node.min_bellman_ford_line.redrawLine('#3B5998');
	node = node.connectedByLine[node.min_bellman_ford_line.id]; 
	
    }
    
   
    
    
    
    
    
    
}


/********************************************************************************
 * PreSorting function to get all the nodes in a row
********************************************************************************/ 
function preSort(){
    
    var timeline = new TimelineLite({  }),start=0, interval= 0,
        counter = 0; nodes = {}, current_grid = current_node = null;
    
    var free_grids = grids.filter(function(g){
      if (!g.occupant) return g;
    })
    
   
   current_grid = free_grids[0]; 
    
   for(var i =0; i < nodes_in_canvas.length; i++){
      current_node = nodes_in_canvas[i];
      
      resetAllNodes();
      
      //Lets clear the timeline
      tl.clear();
      
      if (!current_node.gridSpace || current_node.gridSpace.order > current_grid.order) {
	connectGridandNode( current_node, current_grid,
	{'timeLine': timeline, 'time':1, 'startAt': start_time += interval});
	
	 current_grid = current_grid.getNextFreeGrid(grids);
      }
      
   } 
    
}
/********************************************************************************
 * Get occupied grids to iterate through
********************************************************************************/ 
function getOccupiedGrids(){
    
    var occupied_grids = grids.filter(function(g){
      if (g.occupant) return g;
    })   
   
    return occupied_grids;
    
}
/********************************************************************************
 * Get occupied grids to iterate through
********************************************************************************/ 
function getNodesAttachedToGrid(){
    
    var occupied_nodes = [];
    
    for (var grid_index in /*getOccupiedGrids()*/ grids ) {
	if(grids[grid_index].occupant)
	    occupied_nodes.push(grids[grid_index].occupant);
    }
   
    return occupied_nodes;
    
}
/********************************************************************************
 * postSort
 *
 *
********************************************************************************/
function postSort( ) {
    
    
    
    Log("\nResults: \n\nNumber of nodes- " + nodes_in_canvas.length +
		"\nNumber of comparisons- " + number_of_comparisons + 
		"\nNumber of swaps- " + number_of_swaps );
    
}
/********************************************************************************
 * Bubble Sort
 * Notes: Bubble Sort always starts at the beginning and always goes to the and
 * until nothing is swapped in a "pass"
********************************************************************************/ 
function Bubble_Sort(){
    
    preSort();
    
    var  occupied_grids = getOccupiedGrids();
    var swap_occurred, at_array_end= false, length = occupied_grids.length,
	grid_index =   0;
	
	
    //Lets Start!
    Log('\n********************************************* \n Bubble Sort '
         + '\n*********************************************\n');
    
    do{
        //restarting array order
        grid_index = 0; swap_occurred  = false, at_array_end = false;        
        
        while ( !at_array_end ){
            
	    number_of_comparisons++;
	    
	    var message = '\nComparing Node ' + occupied_grids[grid_index].occupant.value
		+ ' to Node '+ occupied_grids[grid_index + 1].occupant.value ;
	    
	    tweenMultipleNodeColor([occupied_grids[grid_index].occupant,
		occupied_grids[grid_index + 1].occupant],['teal','green'],
		{'timeLine': tl, 'message': message, 'startAt': start_time += tbt});	    
	    
            if( occupied_grids[grid_index].occupant.value >
                    occupied_grids[grid_index + 1].occupant.value) {
            
		//Lets cut down the amount of text I have to write
		//and pass along an error message
		var n1 = occupied_grids[grid_index].occupant,
		    n2 = occupied_grids[grid_index + 1].occupant,
		    print_id = n1.value,
		    message = '\nNode ' + n1.value + ' is greater than '
		    + n2.value + ' ... Swapping ';
                
                
                swapNodesbetweenGrids( n1, n2, {'timeLine': tl, 'print_id': print_id,
		    'message': message, 'startAt': start_time += tbt});
            
                
                swap_occurred = true;
                number_of_swaps++;
            }
            
             grid_index++;
            
            if ( grid_index == length - 1 ) {
                at_array_end = true;
            }        
           
        }       
                
    }while ( swap_occurred == true )
    
    postSort( );
}
/********************************************************************************
 * Insertion Sort -
********************************************************************************/ 
function Insertion_Sort(){
    
    preSort();
    
    //Lets Start!
    Log('\n********************************************* \n Insertion Sort '
         + '\n*********************************************\n');
     
    var nodes = getNodesAttachedToGrid(), swap_occurred = false,
    current_index = 1, previous_index, index_of_node_to_switch ,count = 0,
    swap_me , swap_me_too, tbt = 2;
    
    do  {     
      
            var previous_index = current_index - 1,active_node = nodes[current_index] ;    
	    
	    
	    var firstCompare= nodes[previous_index], temp_tbt = tbt,
		message = '\nComparing Node ' + nodes[current_index].value + 
                      ' to Node ' + nodes[previous_index].value ;
	    
	    tweenMultipleNodeColor([nodes[current_index],nodes[previous_index]],
		['teal','green'], {'timeLine': tl,'keepColor':[nodes[current_index]],
		'message': message, 'startAt': start_time+=tbt});
	    
      
            while ( nodes[current_index].value < nodes[previous_index].value  ) {
                         
                swap_occurred = true ;                  
                 
		temp_tbt = (nodes[previous_index] == firstCompare) ? 0 : tbt ;
		 
		var message = '\nCurrent Node ' + nodes[current_index].value + ' is smaller' +
                      ' than Node ' + nodes[previous_index].value +
                      '. Moving back to Previous Node ' ;
	    
		tweenMultipleNodeColor([nodes[current_index],nodes[previous_index]],
		    ['teal','green'], {'timeLine': tl, 'keepColor':[nodes[current_index]],
		    'message': message, 'startAt': start_time += temp_tbt});
                   
                  
                index_of_node_to_switch = nodes[previous_index].gridSpace.order;
                    
                    //You made it back the beginning
                if( previous_index <= 0) {    break; }           
                    
                previous_index--;            
            }            
            
           
            if (swap_occurred) {
              
              
              var main_node = nodes[current_index],
                all_previous_nodes_index = current_index  - 1;
              
              
              for(var i = 0; i< current_index - index_of_node_to_switch; i++){     
                
                    all_previous_nodes_index--;
              }
               var message ='Inserting Node '+ main_node.id + ' into Grid '
		    + nodes[all_previous_nodes_index+1].gridSpace.order;
		    
	       slideNodesInGrid( {'mainNode': main_node,'otherNode': nodes[all_previous_nodes_index+1],
		    'timeLine': tl, 'print_id': main_node.id,'direction':1,
		    'message': message, 'startAt': start_time += tbt} )
		          
              //KEEP THIS - arr.splice(to , 0, arr.splice(from,1)[0])
              nodes.splice(index_of_node_to_switch , 0, nodes.splice(current_index,1)[0])
              
            }    
            swap_occurred = false;       
      
	    //Lets change the color back
	    tweenNodeColor(active_node, {'timeLine': tl,'message':null,
	    'startAt': start_time += tbt, 'color':'white'});
      
            current_index++;
            if(current_index == nodes.length  ) break ;
 
    }while ( !swap_occurred )    
    
    postSort( );
}
/********************************************************************************
 * Merge Sort 
 * Notes: Recursively split up the lists until the length is one.
 * Now coming out of recursion compare values of the beginning arrays, cut of
 * the minimum from whichever array it is in and append to new array and compare
 * the beginning of the remaining arrays. Do this until both returned arrays
 * are gone
********************************************************************************/ 
function Merge_Sort(){
    
   preSort();
   
   
   Log('\n********************************************* \n Merge Sort '
         + '\n*********************************************\n');
   
   var message, nodes = getNodesAttachedToGrid(), number_of_partitions = -1,
        INFINITY = 1000000 , b = [] , c= [];
   
     
   // Modified from Analysis of Algorithms(SedgeWick, Flajolet - 2nd Ed.)
   // p. 8 Program 1.1
   function mergesort(a, lo, hi) {
       
    
        //Array is only size 1 so lets return
        if (hi <= lo) {
            return;
        }
        
        //Lets recursively split up the array until we get arrays
        //of size 1
        var  mid = lo + Math.ceil(  (hi - lo)/2 - 1 ), free_grids = [];
        mergesort(a, lo, mid);
        mergesort(a, mid + 1, hi);
	
        start_time +=tbt;
		
        //Lets copy the first(lower) half values of the main array
        //into temp array b for manipulation
        for (var k = lo; k <= mid; k++) {
            b[k - lo] = a[k];
	    
	    free_grids.push( b[k - lo].gridSpace );
	    
	    tweenDrawLine( dummy=current_node/*No tweening - Just posting a message*/,
		{'timeLine': tl, 
		'outsideTextNode': b[k - lo], 'outsideText':'Partition A',
		'startAt': start_time  , 'onlyMessage':true} );
	    
	    tweenNowhere(b[k - lo],{'timeLine': tl, 'startAt': start_time  ,'detachFromGrid':true  });
	    
        }
        
        //Lets copy the second(higher) half values of the main array
        //into temp array c for manipulation
        for ( var k = mid + 1; k <= hi; k++ ) {
            c[k - mid - 1] = a[k];
	    
	    free_grids.push( c[k - mid - 1].gridSpace );
	    
	    tweenDrawLine( dummy=current_node/*No tweening - Just posting a message*/,
		{'timeLine': tl, 
		'outsideTextNode': c[k - mid - 1], 'outsideText':'Partition B',
		'startAt': start_time  , 'onlyMessage':true} );
	    
	    tweenNowhere(c[k - mid - 1],{'timeLine': tl, 'startAt': start_time  ,'detachFromGrid':true  });
        }
	
	
        //Lets add Infinity to the end of both arrays so we know to stop 
        //comparing when we are at the end for memory indexing errors!
        b[mid - lo + 1] = {value: INFINITY }; //Creating an object here to be access 'value'
        c[hi - mid] = {value: INFINITY};//like my other nodes
        
        var i = 0, j = 0, temp, old_index;
        
        for (var k = lo; k <= hi; k++) {
            
            //Lets remember the current node in array index
            //we're about to swap
            temp = a[k];
	    
	    var smaller , bigger;
	    //if ( c[j].value == INFINITY ||  b[i].value == INFINITY ) {continue;   }
	    
	     number_of_comparisons++;
	    
	    if ( c[j].value < b[i].value ) {
		smaller = c[j];
		bigger = b[i];
		a[k] = c[j++];
	    }
	    else{
		smaller = b[i];
		bigger = c[j];
		a[k] = b[i++];
	    }
	    
	    var message = '\nComparing Node ' + c[j].value + ' to ' + ' Node ' + b[i].value
	     + '\n\nPlacing smaller Node' + smaller.id + ' in grid ' + free_grids[0].order;
	    
	    if (!( smaller instanceof createjs.Node ) ) {
		continue
	    }
	    
	    tweenMultipleNodeColor([smaller,bigger],['teal','green'],
		{'timeLine': tl,'message': message ,'print_id': smaller.value, 'startAt': start_time+=tbt});
            
	    //If I have an Inifinity Node lets skip
	    
             connectGridandNode(smaller, free_grids.shift(), {'timeLine': tl, 'startAt': start_time += tbt })  ;
	    
        }
	
		
	//Lets tell the user which partitions are active
	start_time += tbt;
	for (var index = lo; index <= hi; index++ ) {
	    tweenDrawLine( dummy=current_node/*No tweening - Just posting a message*/,
		{'timeLine': tl, 
		'outsideTextNode': a[index], 'outsideText':' ',
		'startAt': start_time, 'onlyMessage':true} );
	}
   }
  
   
   mergesort(nodes, 0, nodes.length - 1)
   
   postSort( );  
}
/********************************************************************************
 * Quick Sort
********************************************************************************/ 
function Quick_Sort(){
    
    preSort();
    
    
    Log('\n********************************************* \n Quick Sort '
         + '\n*********************************************\n');
    
    var nodes = getNodesAttachedToGrid(), number_of_partitions = -1;
    
    
    // Modified from Analysis of Algorithms(SedgeWick, Flajolet - 2nd Ed.)
    // p. 19 Program 1.2
    function quicksort(array, lo , hi) {
	
	if( hi <= lo )
	    return;
	
	//Lets tell the user which partitions are active
	for (var index = lo; index <= hi; index++ ) {
	    tweenDrawLine( dummy=current_node/*No tweening - Just posting a message*/,
		{'timeLine': tl, 
		'outsideTextNode': array[index], 'outsideText':'Active Partition',
		'startAt': start_time, 'onlyMessage':true} );
	}
    
	//Lets Allow the user to see which sets of partitions are active
    
	number_of_partitions++;    
	
	var i = lo - 1, j = hi +1, middle = Math.ceil( (hi-lo)/2 ) + lo,
	pivot = array[middle], message='', tempNodeBeforePartition, tempNodeAfterPartition,
	pivot_switch_occured=false;//
	
	//Lets color the pivot red so we see the divisions
	tweenNodeColor(pivot, {'timeLine': tl,'message':'\nPivot Node is set to ' + pivot.id,
	    'startAt': start_time += tbt, 'color':'red','keepColor':[pivot]});	
	
	
	while (true) {
	    
	    //While all the numbers before the partition
	    //are smaller keep iterating forward
	    do { number_of_comparisons++;
		
		var overlay= false, keepColor = [];
		tempNodeBeforePartition = array[++i];
		
		var message = '\nChecking if Node ' + tempNodeBeforePartition.id +
		    ' is greater than Pivot Node ' + pivot.id;
		
		if (tempNodeBeforePartition.value > pivot.value) {
		    keepColor = [tempNodeBeforePartition]
		    
		    message += '\n\nNode ' + tempNodeBeforePartition.id +' is greater '
		    + 'than than Pivot Node ' + pivot.id + ' and will be switched';
		}
		
		var color = 'teal';
		
		if(tempNodeBeforePartition == pivot) { overlay = true; };
		
		//Lets turn the number being checked before the partition back to white after we're done
		tweenNodeColor(tempNodeBeforePartition, {'timeLine': tl,'message':message,
		    'startAt': start_time += tbt, 'color':color, 'overlay':overlay,
		    'overlayAlpha': 0.5, 'overlayHexColor':'#fe0000',
		    'keepColor':keepColor.concat(pivot)}
		);
		
		
	    }
	    while (tempNodeBeforePartition.value < pivot.value );
	    
	    
	    
	    //While all the numbers ahead of the partition
	    //are greater keep iterating backward
	    do{
		
		number_of_comparisons++;
		
		tempNodeAfterPartition = array[--j];
		
		var overlay = false, color = 'green',
		    message = '\nChecking if Node ' + tempNodeAfterPartition.id +
		    ' is less than Pivot Node ' + pivot.id; ;
		
		if( tempNodeAfterPartition == pivot ) { overlay = true ; };
		
		if ( tempNodeAfterPartition.value < pivot.value) {
		    		    
		    message += '\n\nNode ' + tempNodeAfterPartition.id +' is less '
		    + 'than than Pivot ' + pivot.id + ' and will be switched!';
		}
		
		//Lets turn the numbers being checked before the partition 
		tweenNodeColor(tempNodeAfterPartition, {'timeLine': tl,'message':message,
		    'startAt': start_time += tbt, 'color':color, 'overlay':overlay,
		    'overlayAlpha': 0.5, 'overlayHexColor':'#fe0000',
		    'keepColor':keepColor.concat(pivot)});
		
		
		//So you dont go off before the beginning
		//i.e. array[-1] ....STOP!!
		if (j == lo ){
		    break;
		}
		
		
		
		 
	    }while ( pivot.value < tempNodeAfterPartition.value)
	    
	    
	    
	    
	    //Now they have met which means you have sorted
	    //all you can for this partition and need to
	    //start a new one with arrays (lower and higher)
	    //splitting up where they met
	    if ( i >= j) {
		    break;
	    }
	   
	   
	    print_id = array[i].value;
	    
	    message = '\nNode ' + array[i].value + ' is greater than '
		    + array[j].value + ' ... Swapping ';
	    
	    var color1 =  'teal', color2 = 'green';
	    
	    /*
	    if (array[i] == pivot) { color1 = 'red' }
	    else if (array[j] == pivot) { color2 = 'red' } 
	    */
	    
	     //Now switch the numbers to sort them after the
	    //comparisons had stopped inside our Canvas Grid
	    swapNodesbetweenGrids( array[i] , array[j], {'timeLine': tl, 'print_id': print_id,
		'message': message, 'startAt': start_time += tbt,'colors':[color1, color2],
		} );
	    number_of_swaps++;
	    
	    //Swap nodes in array to reflect our new positions
	    var temp = array[i];
	    array[i] = array[j]; array[j] = temp ;
	    
	    
	    //Lets turn the number being checked before the partition back to white after we're done
	    tweenNodeColor(pivot, {'timeLine': tl,'message':null,'startAt': start_time += tbt,
		'color':'red','keepColor':[pivot]}
	    );
	    
	    
	}//end while (true){...
	
	    var multiple_nodes = [pivot,tempNodeAfterPartition,tempNodeBeforePartition];
	    
	    //Lets change all the colors back
	    tweenMultipleNodeColor(multiple_nodes,['white'],
		{'timeLine': tl,'message': null, 'startAt': start_time,
		 'overlayNodes':multiple_nodes, 'overlayHexColors':['#00000'],
		 'overlayAlphas':[0]});
	    
	    
	    //Lets tell the reset the partitions to zero
	    for (var index = lo; index <= hi; index++ ) {
		tweenDrawLine( dummy=current_node/*No tweening - Just posting a message*/,
		    {'timeLine': tl, 
		    'outsideTextNode': array[index], 'outsideText':'',
		    'startAt': start_time, 'onlyMessage':true} );
	    }
	    
	    
	    quicksort(array, lo, i - 1);
	    quicksort(array, i , hi);
	
    }
    
    
    
    quicksort(nodes, 0, nodes.length-1);
    
    postSort( );
    
}
/********************************************************************************
 * Radix Sort - http://stackoverflow.com/questions/14717560/how-does-radix-sort-work
********************************************************************************/ 
function Radix_Sort(){
    
    preSort();
    
    Log('\n********************************************* \n Radix Sort '
         + '\n*********************************************\n');
    
   var nodes = getNodesAttachedToGrid(), sorted = {}, radix = base = 10,
   quit =  false, max_number_of_digits = 0, tbt = 2;
   
   //Lets see how many digits the biggest number is
   $.each(nodes, function(index, node){
	var length = node.value.toString().length;    
	( length > max_number_of_digits  ) ? max_number_of_digits = length : '' ;
    });
  
   
   //Lets preprocess the numbers and split them up 
   for ( var digits = 0; digits < max_number_of_digits; digits++ ) {
	
	var  modulo = [];
	//var next = null;
  
	for (var i=0 ; i< nodes.length ; i++) {    
	    var index = nodes[i].value % radix, current_node = node = nodes[i];
	    
	    ( modulo[index] ) ? modulo[index].push(node) : modulo[index]= [node];
	    
	    var index = current_node.value % radix ,
		message = "\nNode "+ current_node.value +" % " + radix + " = " + index;
	    
	    tweenDrawLine( dummy=current_node/*No tweening - Just posting a message*/,
		{'timeLine': tl, 'superText':current_node.value + ' % ' + radix,
		'superTextNode': current_node,
		'subText': '  = ' + index , 'subTextNode': current_node,
		
		    'startAt': start_time += tbt, 'onlyMessage':true} );
	    
	}
	
	nodes = [];
	
	for (var i in modulo) {
	    
	    for (var j in modulo[i] ){
		
		var current_node = modulo[i][j];
		nodes.push( current_node );
		
	    
	    
	    
		slideNodesInGrid( {'mainNode':current_node,'otherNode': grids[0].occupant,
	    'timeLine': tl, 'print_id': current_node.id,'direction':1,
	    'message': message, 'startAt': start_time += tbt} )
		
	    }
	}
	
	

	radix *= base;	
	
	
	//Now I need to place them in the Canvas Grid
	
    
    }
    
    //Just for tweening
	for (var i = nodes.length-1; i>=0; i--) {
	    var message = '';
	    if (nodes[i] == grids[0].occupant) { continue }
	    
		slideNodesInGrid( {'mainNode': nodes[i],'otherNode': grids[0].occupant,
	    'timeLine': tl, 'print_id': nodes[i].id,'direction':1,
	    'message': message, 'startAt': start_time += tbt} )
	}
    
    postSort( );
}
/********************************************************************************
 * Select Sort - PsuedoCode from http://en.wikipedia.org/wiki/Selection_sort
********************************************************************************/ 
function Selection_Sort(){
    
    preSort();
    
    //Lets get some breathing room by giving this a title and a space    
    Log('\n********************************************* \n Selection Sort '
         + '\n*********************************************\n');
    
    
    var nodes = getNodesAttachedToGrid(), i, j, indexofMin, message='', temp_minimum_node;
    
    
    //Lets iterate through the array starting from beginning
    for ( j = 0; j < nodes.length; j++ ) {
        
        //Local Minimum to compare to with other numbers ahead in the array
        indexofMin = j;
        
        
        
        //Now lets test the local min vs elements ahead in the array
        for (var i = j+1; i < nodes.length; i++) {
            
	    number_of_comparisons++;
	    
            message += "\n\nNode " + nodes[j].value + " being compared to " + "Node " + nodes[j].value;
            
	    tweenMultipleNodeColor([nodes[j],nodes[i]],['teal','green'],
		{'timeLine': tl,'keepColor':[nodes[j]],'message': message,
		'startAt': start_time+=tbt});
	    
	    	    
            //if current element is less the previously recorded minimum then
            //current element is the new minimum
            if ( nodes[i].value < nodes[indexofMin].value ) {
                indexofMin = i;		
		
		//If we have a previous temp minimum node lets color it black
		if (temp_minimum_node) {
		    
		    tweenNodeColor(temp_minimum_node, {'timeLine': tl,'message':null,
		    'startAt': start_time += tbt, 'color':'white'});	
		}
		
		temp_minimum_node = nodes[indexofMin];
		
		
                message = "\n\nNode " + nodes[i].value + " is less than Current Node " + nodes[j].value
                    + " and is now the new minimum";
		    
		
		tweenNodeColor(temp_minimum_node, {'timeLine': tl,'message':null,'keepColor':[temp_minimum_node],
		    'startAt': start_time += tbt, 'color':'red'});
		
            }
            
            
            //I didnt find a new minimum so Im moving on
            else{
                
                message = "\nNode " + nodes[i].value + " is not less than Current Node " + nodes[j].value
                    + ". Moving on...";
                
            }
	    
	    tweenDrawLine( dummy=current_node/*No tweening - Just posting a message*/,
		{'timeLine': tl,'message': message,
		 'startAt': start_time += .5, 'onlyMessage':true} );
	   
        }
        
        
        //Now that Ive iterated through the whole array lets swap the nodes if
        //the indexofMin found doesnt equal the index of current node with index of j
        if (indexofMin != j) {  //can also be if (indexofMin > j)
            	    
	    var print_id = nodes[indexofMin].value;
		message = "\nSwapping new Min Node " + nodes[indexofMin].value
		+ " and Node " + nodes[j].value;
            
            //Swapping it in the grid for the viewer
            swapNodesbetweenGrids(nodes[indexofMin], nodes[j], {'timeLine': tl, 'print_id': print_id,
		    'message': message, 'startAt': start_time += tbt});
	    
	    number_of_swaps++;
	    message = '';
            
            //Swapping it in the 'nodes' array so we can keep track of sorted and unsorted
            var temp = nodes[indexofMin];  nodes[indexofMin] = nodes[j]; nodes[j] = temp; 
            
        }
	
	    //Lets change the color back
	    tweenMultipleNodeColor([nodes[indexofMin], nodes[j], temp_minimum_node],['white'],
		{'timeLine': tl, /*'keepColor':[nodes[j]],*/
		'message': message, 'startAt': start_time+=tbt});
        
    }
    
    postSort( );
}
/********************************************************************************
 * Graph Connections
 * Adjacency List, Incidence List, Adjaceny Matrix, Incidence Matrix
********************************************************************************/


/********************************************************************************
 * Adjacency List
********************************************************************************/
function Adjacency_List(node_array) {
    
    var html, nodes = node_array || nodes_in_canvas,
    a_l = $("#view_adjacency_list");
    
    a_l.empty();
    
    /*
    if (!nodes.length) {
       a_l.html("No nodes in Canvas Yet");
       return;
    }
    */ 
    
    nodes.sort(function(a, b){ return a.value-b.value });
 
    
    html  = '<table class="table table-bordered">';
    html += "<thead><tr><th>Node #</th><th>Adjacent To</th></tr></thead>"; 
    
    
    for ( var i in nodes ) {
        
        html += "<tr> \
                  <td>" +  nodes[i].value  +  "</td><td>\ ";
        
            for (var j in nodes[i].connectionLines ) {
                var line_id = nodes[i].connectionLines[j].id;
                
                
                html += "[ #" + nodes[i].connectedByLine[line_id].value + " - ( " +
                  + nodes[i].connectionLines[j].value + " ) ] " ;                
                
                
            }
        
        html +=  "</td></tr>";
        
        
    }
    
    
    
    html +=  '</table>';
    
    a_l.html(html);
    
    
}


/********************************************************************************
 * Incidence List
********************************************************************************/
function Incidence_List( line_array ) {
    
    
    var html, lines = line_array || elements_in_canvas.filter(function(n){
        if(n instanceof  createjs.Line) return n }),
    i_l = $("#view_incidence_list");
    
    i_l.empty();
    
    if (Object.keys(lines_in_canvas).length < 0) {
       i_l.html("No lines in Canvas Yet");
       return;
    }
 
    
    
    html  = '<table class="table table-bordered">';
    html += "<thead><tr><th>Line #</th><th>Connecting</th></tr></thead>"; 
    
    
    for ( var i in lines ) {
        
        html += "<tr> \
                  <td>" +  lines[i].value  +  "</td> ";        
                
                
                html += "<td> [ #" + lines[i].connectionPrimary.value + " - #" +
                  + lines[i].connectionSecondary.value + "  ] </td> " ;                
                
                
           // }
        
        html +=  "</tr>";
        
        
    }
    
    
    
    html +=  '</table>';
    
    i_l.html(html);
    
    
}

/********************************************************************************
 * Incidence Matrix
********************************************************************************/
function Incidence_Matrix(  ) {
    
    var html, lines = lines_in_canvas, matrix = $("#view_incidence_matrix");
    
    matrix.empty();
    
    if (Object.keys(nodes_in_canvas_by_id).length < 0) {
       matrix.html("No nodes in Canvas Yet");
       return;
    }
    
    html  = '<table class="table table-bordered">';
    html += '<thead><tr><th>Line #</th><th>Node #</th></tr></thead>';
    
    html += '<tr><td>  </td>';
    $.each(nodes_in_canvas,function(index, node){
	html+= '<td>' + node.id + '</td>';});    
    html += '</tr>';
    
    
    $.each(lines_in_canvas,function(index, line){
	html+= '<tr><td>' + line.value + '</td>'
	
	$.each(nodes_in_canvas,function(index, innerNode){
	var connected = (innerNode.connectedByLine[line.id])? 1 : 0 ;
	html+= '<td>' + connected + '</td>';
	
	;});
	
	html+= '</tr>';
	
    }); 
    
    
    html +=  '</table>';
    
    matrix.html(html);
    
}

/********************************************************************************
 * Adjacency Matrix
********************************************************************************/
function Adjacency_Matrix( line_array ) {
    
    var html, lines = lines_in_canvas, matrix = $("#view_adjacency_matrix");
    
    matrix.empty();
    
    if (Object.keys(nodes_in_canvas_by_id).length < 0) {
       matrix.html("No nodes in Canvas Yet");
       return;
    }
    
    html  = '<table class="table table-bordered">';
    html += '<thead><tr><th>Node #</th></tr></thead>';
    
    html += '<tr><td>  </td>';
    $.each(nodes_in_canvas,function(index, node){
	html+= '<td>' + node.id + '</td>';});    
    html += '</tr>';
    
    
    $.each(nodes_in_canvas,function(index, node){
	html+= '<tr><td>' + node.id + '</td>'
	
	$.each(nodes_in_canvas,function(index, innerNode){
	var connected = (node.getLineConnectedToNode[innerNode.id])? 1 : 0 ;
	html+= '<td>' + connected + '</td>';
	
	;});
	
	html+= '</tr>';
	
    }); 
    
    
    html +=  '</table>';
    
    matrix.html(html);
    
}
/********************************************************************************
 * Data Structures and Operations -> Linked List, Binary Search Tree,
 * Red-Black & AVL Tree
 * - Notes - All these Data Structures will have the same code to figure out
 * what route to take as far as Insert, Search, and Delete so lets process
 * the options here
********************************************************************************/
var ppDSO = preprocessDataStructureOperation = function ( args ) {
    
    var operation = args.operation , number = parseInt( args.number ),
        data_structure = args.data_structure;
   
    var current_ids = [], node;
    $.each(nodes_in_canvas,function(index, node){ current_ids.push(node.value); });
    
    //Lets take care of 'Insert' preprocessing
    if ( operation == 'insert') {
        	
        //Do not want nodes with same value in Canvas!		
        if( $.inArray( number , current_ids) >= 0  ){
            Log("Error: Node " + number + " is already in Canvas.\ Please choose another number for 'Insert' operation");
            return false;
        }
        
        
        
    }
    
    if ( operation == 'delete' || operation == 'search') {
        
        //Lets make sure we can search/delete a node that actually exists!		
        if( $.inArray( number , current_ids) < 0  ){
            Log("Error: Cannot "  +  operation  + " because Node " + number + " is not in Canvas.");
            return false;
        }
        
        node = nodes_in_canvas_by_id[ number ];
        
    }
    
    Log('\n********************************************* \n '+  operation.toUpperCase() +' '
         + '\n*********************************************');
    
    
    //If its a heap operation lets make  
    solve_by_algorithm( args, node );
        
    return true;

    
}
/********************************************************************************
 * Linked List Data Structure	 
********************************************************************************/
var LL = LinkedList = function( args ){
    
    var self = this;
    self.args = args;
    tl = timeline = self.tl = self.timeLine = args.timeline;
    /*
    var timeline = args.tl || tl, tween_time = args.tween_length|| args.time || 2,
	    startAt = args.startAt || startAt;
    */
    
    self.type_of_data_structure = self.tods = "Linked List ";
    
    //Lets get some breathing room by giving this a title and a space    
    Log('\n********************************************* \n Linked List '
         + '\n*********************************************');
    
    this.Search = function( user_defined_node, root ){	
	var counter = 0;
	
	Log('Operation: SEARCH\n');
	
	//While I havent found an answer and node has a child
	while ( root != user_defined_node && root.rightChild  ) {
	    
	    var message = "\nNode " + root.id + " is not equal to " + user_defined_node.id +
		".  Moving on to Child Node " +	root.rightChild.id ;
	    
	    tweenNodeColor(root, {'timeLine': tl, 'startAt':  start_time += tbt,
		'message': message, 'print_id':root.id });
	    
	    //I set it up as rightChild arbitrarily
	    root = root.rightChild ;
	    counter++;    
	}	
	
	//Found a match!! 
	if( root == user_defined_node ){	    
	    
	    var message = "\nNode " + root.value + " found on Level " +
		counter ;
	    
	    tweenNodeColor(root, {'timeLine': self.tl, 'startAt':  start_time += tbt,
		'message': message,'color':'purple', 'print_id':root.id });
	    
	    return user_defined_node;
	}
    }
    
    this.Insert = function( nodeBefore,  root ){	
	
	if ( nodeBefore == null ) {
	    Log('Error: One or more of your nodes does not exist in Canvas. ' +
		'Are your sure your second argument for "Insertion After" is valid? ');
	    return;
	}
    
	//Lets Search for the node first
	var //searchedNode = self.Search( node_to_search, root),
	    node_to_insert = createNode( {'id' : this.args.number, 'tween':false} ) ;
	    oldChild = nodeBefore.rightChild;
	
	Log("Inserting Node " + node_to_insert.id + " after Node " +
	     nodeBefore.id );
	
	//If I have a child lets update him
	if ( oldChild ) {  
	    breakConnection( nodeBefore, oldChild );
	    createParent_Child_Relationship(node_to_insert, oldChild);
	}
	
	createParent_Child_Relationship(nodeBefore, node_to_insert);
	
	//slideNodesInGrid( args )
	
    }
    
    this.Delete = function( deleteThisNode, root ){	
	
		
	//Lets Search for the node first
	var //searchedNode = self.Search( deleteNode, root),
	    oldChild = deleteThisNode.rightChild, oldParent = deleteThisNode.animationParent;
	
	deleteThisNode.breakAllConnections();
	//breakConnection( deleteNode.animationParent, searchedNode );
	
	//If I have a child lets update him
	if ( oldChild && oldParent ) {
	    //breakConnection( deleteNode, oldChild );
	    createParent_Child_Relationship( oldParent, oldChild);
	}
	
	
	deleteNode( deleteThisNode );
	
	
	//user
	
    }
    
    
}



/********************************************************************************
 * BST will be main data structure Object wherein other operations will be based
 * off this
********************************************************************************/
var BST = DSO = DataStructureOperation = function(args) {    
    
    var self = this;
    self.args = args;
    self.type_of_data_structure = self.tods = "Binary ";
    
    }
    
    BST.prototype.Search = function (  user_defined_node, root ){       
        
        
        var current_node =  root , searching_for_node = user_defined_node,
            success = false, counter = 0;
        
        while ( !success ) {
            
            // If I found the node lets return it
            if (current_node.value == searching_for_node.value) {
                     
                     Log("Node " + current_node.value + " found on Level " + searching_for_node.getNodeLevel())
                     success = true;
            }
            
            
            // If target node's value is greater traverse the tree
            // or create Child-Parent RelationShip depending on if rightChild exists
            else if (searching_for_node.value  > current_node.value){
                
               
                Log("Node " + searching_for_node.value + " is greater than Current Node "
                    + current_node.value + ".  Moving on to valid rightChild first or valid leftChild second." );
                current_node = current_node.rightChild || current_node.leftChild;
            }
            
            // If target node's value is less traverse the tree
            // or create Child-Parent RelationShip depending on if leftChild exists
            else if ( searching_for_node.value < current_node.value ){
                
                
                Log("Node " + searching_for_node.value + " is less than Current Node " + 
                      + current_node.value + ".  Moving on to valid leftChild first or valid rightChild second." );
                current_node = current_node.leftChild || current_node.rightChild;
            }
            
            counter++;
	       
        }
        
        return current_node;//Return the found node
        
    }; 
    
    
    //TODO: Problem when there is only when node here
    BST.prototype.Insert = function ( user_defined_node, root ) {
		
        var current_node =  root,
	    new_node =  user_defined_node || createNode( {'id' : this.args.number, 'tween':false} ) ,
            success = false;
        
	//Not enough nodes in canvas to do anything or nodes are equal 
	if (!root || user_defined_node == root) {
	    return;
	}
	
        while ( !success ) {            
            // If target node's value is greater traverse the tree
            // or create Child-Parent RelationShip depending on if rightChild exists
            if (current_node.value < new_node.value) {
                (current_node.rightChild) ? current_node = current_node.rightChild :
                    ( success = true, createParent_Child_Relationship(current_node, new_node) );
            }
            
            // If target node's value is less traverse the tree
            // or create Child-Parent RelationShip depending on if leftChild exists
            else {
                (current_node.leftChild) ? current_node = current_node.leftChild :
                    ( success = true, createParent_Child_Relationship(current_node, new_node) ) ;
            }
	       
        }
        
        Log("Node " + new_node.value +  " inserted at level  " + new_node.getNodeLevel() );      
        
        return current_node;
        
    };
    
    //This is wrong for two parents
    //TODO: Problem when there is only when node here
    BST.prototype.Delete = function ( current_node, root ) {
        
        var self = this, /*current_node = this.Search( search_for_node, root ),*/
            parent = current_node.animationParent, hasParent = true,
	    deletedNodeRightChild = current_node.rightChild,
	    deletedNodeLeftChild  = current_node.leftChild;
        
	current_node.breakAllConnections();
	
        if (parent) {
	    //breakConnection(parent, current_node);
        
	}
	if (deletedNodeLeftChild && deletedNodeRightChild){
	    var tempNode = deletedNodeRightChild;
	    while( tempNode.leftChild ){
		tempNode = tempNode.leftChild;
	    }
	    //If temp has any right Children lets update that before changing
	    /*if (tempNode.rightChild) {
		var tempRightChild = tempNode.rightChild,
		    tempParent = tempNode.animationParent;
		tempNode.breakAllConnections();
		self.Insert( tempRightChild, tempParent );
	    }*/
	    
	    //If it traverses far enoug will break from actual parent or current_node 
	    tempNode.breakConnection(tempNode.animationParent );
	    
	    //Lets put in the old nodes
	    self.Insert( tempNode, parent );
	    self.Insert( deletedNodeLeftChild, tempNode );
	    self.Insert( deletedNodeRightChild, tempNode );
	}
	
	else if (deletedNodeLeftChild) {
	    //breakConnection( current_node, deletedNodeLeftChild);
	    self.Insert( deletedNodeLeftChild, parent )
	}
	
	else if (deletedNodeRightChild) {
	    //breakConnection( current_node, deletedNodeRightChild);
	    self.Insert( deletedNodeRightChild, parent );
	}
	
	
        deleteNode( current_node );
        
        return parent;
    
    }
/********************************************************************************
 * Now lets create a AVl Object and have that inherit all the functions from BST
********************************************************************************/
function paintNode(node, color) {
    
	var redFilter =  new createjs.ColorFilter(1,0,0,1),
	blackFilter =  new createjs.ColorFilter(0,0,0,1),
	greenFilter = new createjs.ColorFilter(0,1,0,1);
	
    
	if (color == "black" ) {
	    node.bitmap_image.filters = [ blackFilter ];
	    node.changeTextColor("#ffffff");
	}
	
	else if (color == "red" ){
	    node.bitmap_image.filters = [ redFilter ];
	}
	
	else{
	   node.bitmap_image.filters = [ greenFilter ]; 
	    
	}
    
	
	node.bitmap_image.cache(0,0, node.bitmap_image.image.width,
	    node.bitmap_image.image.height);
	//var tween = createjs.Tween.get(filter).
	    //to({redMultiplier:1 }, 1000);
	
	
	node.color = color;
	
	function updateCache (node){ node.bitmap_image.cache(0,0,
	node.bitmap_image.width,node.bitmap_image.height); }
	
    }


var Red_Black = function (args) {
    
    //ColorFilter red = (1,0,0,1), black = 
    var self = this, black ="black", red = "red", green = "green";
	
	
    this.prototype = new BST();
    
    /*
    this.prototype.paintNodeRed = function (node) {
	var filter = new createjs.ColorFilter(0,0,0,1);
	node.bitmap_image.filters = [ filter ];
	node.bitmap_image.cache(0,0, t.bitmap_image.width,t.bitmap_image.height);
	var tween = createjs.Tween.get(filter).
	    to({redMultiplier:1 }, 1000);
	node.changeTextColor("#000");
	node.color = red;
    }
    
    this.prototype.paintNodeBlack = function (node) {
	node.bitmap_image.filters = [new createjs.ColorFilter(0,0,0,1) ];
	node.bitmap_image.cache(0,0, t.bitmap_image.width,t.bitmap_image.height);
	node.changeTextColor("#ffffff");
	node.color = black;
    }    
    */
    
    //Root
    this.InsertCase5 = function (current_node){
	
	
	
	//Case 5
	parent = current_node.animationParent;
	grandparent = current_node.animationParent.animationParent;
	
	paintNode(parent,black); 
	paintNode(grandparent,red);
	
	if (current_node == parent.leftChild) {
	    self.prototype.rotateRight({'startingChild': parent});
	}
	
	else if (current_node == parent.leftChild) {
	    self.prototype.rotateLeft({'startingChild': parent});
	}
	
    }
    
   
    
    this.Refactor = function(current_node){
	
	//self.insert1(current_node);
	
	//Case 0
	if (current_node == null) {
	    return;
	}
	
	//Should I paint this green?? --> Lets start green and tween the color later
	paintNode(current_node, red);
	
	//Case 1 - If its the root
	if( current_node.animationParent == null ){    
	    paintNode(current_node, black);
	    return;
	}
	
	//Case 2
	if ( current_node.animationParent.color == black) {
	    paintNode(current_node,  red);
	}
	
	else if ( current_node.animationParent.color == red){
	    paintNode(current_node,  black);
	}
	
	//Case 3
	var uncle = current_node.animationParent.getSibling();
	var parent = current_node.animationParent, grandparent = current_node.animationParent.animationParent;
	
	if ( uncle && uncle.color == red) {
	    paintNode(parent, black);	
	    paintNode(uncle, black);
	    
	    if (grandparent) {
		paintNode(grandparent, red);
		self.Refactor(grandparent);
	    }
	    
	    return;	    
	}
	
	//Case 4
	if ( current_node==parent.rightChild && parent == grandparent.leftChild  ){
	    paintNode(parent,red);    
	    self.prototype.rotateLeft(parent);
	}
	
	else if ( current_node==parent.leftChild && parent == grandparent.rightChild  ){
	    paintNode(parent,red);    
	    self.prototype.rotateRight(parent);
	}
	
	//InsertCase5(current_node);
	
	
    }
    
    
 
    
}
/********************************************************************************
 * Now lets create a AVl Object and have that inherit all the functions from BST
********************************************************************************/
var AVL = function ( args ) {
    
    //object.create ??
    this.prototype =  new BST(args);
    this.args = args;
    var self = this;
    
    self.type_of_data_structure = self.tods = "AVL ";
    
    //After Operation we need to refactor the tree so that it becomes balances
    self.Refactor = function ( node_to_refactor ) {
        var self = this;
	//Node passed doesnt exist
        if ( node_to_refactor == null ) {
	    return;
	}
	
	//Lets recursively go down the tree and perform rotations
	self.Refactor( node_to_refactor.leftChild  );
	self.Refactor( node_to_refactor.rightChild );
        
        var balanceFactor = node_to_refactor.cbf();
	
	if ( balanceFactor >= -1 && balanceFactor <= 1 ) {
	    return;
	}
        
	var current_node = node_to_refactor;
	
        if ( balanceFactor < -1  ) {
            
	    var child = current_node.leftChild, child_balanceFactor = child.cbf();
	    
	    //Left-Right Case
	    if( child_balanceFactor == 1  ){//child has a rightChild
		
		this.rotateLeft( { 'parent': current_node.leftChild,
		    'child' : current_node.leftChild.rightChild }  );
		
		
		this.rotateRight( { 'parent': current_node,
		    'child' : current_node.leftChild || current_node.rightChild }  );
		
		
	    }
	    
	    	    
	    //Left-Left Case  and ...      Left-Even Case
	    else if( child_balanceFactor == -1  || child_balanceFactor == 0){
		
		self.rotateRight( { 'parent': current_node,
		    'child' : current_node.leftChild }  );
		
	    }
	    
        }
	
	else if (  balanceFactor > 1 ){
	    
	    var child = current_node.rightChild, child_balanceFactor = child.cbf();
	    
	    //Right-Left Case
	    if( child_balanceFactor == -1  ){
		
		self.rotateRight( { 'parent': current_node.rightChild,
		    'child' : current_node.rightChild.leftChild }  );
		
		
		self.rotateLeft( { 'parent': current_node,
		    'child' : current_node.rightChild || current_node.leftChild}  );
		
		
	    }
	    
	    //Right-Right Case
	    else if( child_balanceFactor == 1 ||  child_balanceFactor ==  0 ){
		
		self.rotateLeft( { 'parent': current_node,
		    'child' : current_node.rightChild }  );
		
	    }    
	    
	}      
        
    };
}   
    //Extending rotations outside of the constructor because I need it for Red Black
    AVL.prototype.rotateLeft = function( args ){
	
	var startingParent = args.parent, startingChild = args.child,
	grandParent = startingParent.animationParent,
	orphanedLeftChild= startingChild.leftChild;	
	
	//I saved the orphanedChild and free to set up a new leftChild    
	if( orphanedLeftChild != null){
	    breakConnection(startingChild, orphanedLeftChild );
	    
	}	
	
	//Lets break the line connecting the Parent and Child
	breakConnection(startingParent, startingChild);
	
	
	//Now if there is a parent(not null) of 'startingParent'
	//lets set the rightChild equal to Starting Child
	if ( grandParent ) {
	    //grandParent.leftChild = startingChild;
	    
	    //Lets break the line connecting the grandparent and parent
	    breakConnection(grandParent, startingParent);	    
	    //Lets make the line for grandParent and child
	    createParent_Child_Relationship(grandParent, startingChild);
	}
	
	
	//Lets make the line for grandParent and child
	createParent_Child_Relationship(startingChild, startingParent);
	//Now lets swap their places
	//swapNodesbetweenGrids(startingParent, startingChild);
	
	//If balance factor of child is zero then I have even number of childre.
	//I have to unload one of them to my new child
	if ( orphanedLeftChild ) {
	    
	    createParent_Child_Relationship( startingParent, orphanedLeftChild);
	}
	
    }
    
    AVL.prototype.rotateRight = function( args ){
	
	var self= this, startingChild = args.child,
	    startingParent = args.parent || args.child.animationParent, 
	    grandParent = startingParent.animationParent,
	    orphanedRightChild= startingChild.rightChild;
	
	//I saved the orphanedChild and free to set up a new rightChild    
	if( orphanedRightChild != null){	    
	    breakConnection(startingChild, orphanedRightChild);	    
	}
	
	
	//Lets break the line connecting the Parent and Child
	breakConnection(startingParent, startingChild);
	
	//Now if there is a parent of 'startingParent' lets set the rightChild
	//equal to Starting Child
	if ( grandParent ) {
	    //grandParent.rightChild = startingChild;
	    
	    //Lets break the line connecting the grandparent and parent
	    breakConnection(grandParent, startingParent);	    
	    //Lets make the line for grandParent and child
	    createParent_Child_Relationship(grandParent, startingChild);
	}
	
	
	//Lets make the line for grandParent and child
	createParent_Child_Relationship(startingChild, startingParent);
	//Now lets swap their places
	//swapNodesbetweenGrids(startingParent, startingChild);
	
	//If balance factor of child is zero then I have even number of children.
	//I have to unload one of them to my new child
	if ( orphanedRightChild ) {
	    
	    createParent_Child_Relationship( startingParent, orphanedRightChild);
	}
	
    }
    
    
      
/********************************************************************************
 * Linked List Operations 
********************************************************************************/
function LinkedList_Tree( args, user_defined_node ) {   
    
    var roots = retrieve_top_node();
 
    if ( roots.length > 2) {	
	
	Log('Error: Linked List Operations cannot be performed because two or more '
         + 'nodes dont have parents. Only the root(top node) cannot have a parent');
	     
        return;
    }  
    
    var root = roots[0], node_to_search = nodes_in_canvas_by_id[args.number_after],
	operation = args.operation, ll = new LinkedList(args) ;
	
    
    
    
    switch (operation) {
	case 'insert':
	    ll.Insert(node_to_search,  root );
	    break;
	
	case 'delete':
	    ll.Delete( user_defined_node, root );
	    break;
	
	case 'search':
	    ll.Search( user_defined_node, root );
	    break;
    }    
    
}
/********************************************************************************
 * Data Structure Operations for Index, Insert, Search, and Delete 
********************************************************************************/
function BST_Tree( args, user_defined_node ) {   
    
    var roots = retrieve_top_node();
 
    if ( roots.length > 2) {
        Log('Error: AVL Operations cannot be performed because two or more '
            + 'nodes dont have parents. Only the root(top node) cannot have a parent');
        
        return;
    }  
    
    var root = roots[0] ,  operation = args.operation, bst = new DSO(args) ;
    
    
    switch (operation) {
	case 'insert':
	    bst.Insert( user_defined_node, root );
	    break;
	
	case 'delete':
	    bst.Delete( user_defined_node, root );
	    break;
	
	case 'search':
	    bst.Search( user_defined_node, root );
	    break;
    }    
    
}
/********************************************************************************
 * Red-Black Tree Function
********************************************************************************/
function Red_Black_Tree(args) {
    var roots = retrieve_top_node();
 
    if ( roots.length > 2) {
        Log('Error: Red Black Operations cannot be performed because two or more '
            + 'nodes dont have parents. Only the root(top node) cannot have a parent');
        
        return;
    }  
    
    var root = roots[0] ,  user_defined_node = nodes_in_canvas_by_id[args.number]
    operation = args.operation, rb_tree = new Red_Black() ;
    
    
    
    switch (operation) {
	case 'insert':
	    rb_tree.prototype.Insert( user_defined_node, root );
	    rb_tree.Refactor( user_defined_node, root );
	    break;
	
	case 'delete':
	    rb_tree.prototype.Delete( user_defined_node, root );
	    break;
	
	case 'search':
	    rb_tree.prototype.Search( user_defined_node, root );
	    break;
    }    
}
/********************************************************************************
 * Data Structure Operations for Index, Insert, Search, and Delete 
********************************************************************************/
function AVL_Tree( args, user_defined_node ) {   
    
    
    var roots = retrieve_top_node();
    /*
    if ( roots.length > 2) {
        Log('Error: AVL Operations cannot be performed because two or more '
            + 'nodes dont have parents. Only the root(top node) cannot have a parent');
        
        return;
    }*/
    
    var root = roots[0] ,  operation = args['operation'] || '', avl = new AVL(args), node_returned;
    
    //If its first node Im not doin anything
    //if(root == user_defined_node) {return}
    
    switch (operation) {
	case 'insert':
	    node_returned = avl.prototype.Insert( user_defined_node, root );
            avl.Refactor(  root );            
	    break;
	
	case 'delete':
	    node_returned = avl.prototype.Delete( user_defined_node, root );
	    avl.Refactor(  root ); 
	    break;
	
	case 'search':
	    node_returned = avl.prototype.Search( user_defined_node, root );
	    break;
	
	default:
	    avl.Refactor(  root );  
	break;
    }
    
    
    //if(   !node_returned.fcanb ) {
        
    //}
    
    //Now after performing the operation we need to check balance 
    
    
}
/********************************************************************************
 * Binary Heap --- 
********************************************************************************/
var Binary_Heap_Tree = function( args) {    
    
    var self = this,  node_count = 0,  /*heap_by_nodeID = {},
	heap_by_nodeIndex = [],*/	top = 0, left  = 1,  right = 2;
    
    self.args = args;
    self.heapSpace = {'array':[]}
    
    self.type_of_data_structure = self.tods = "Binary ";
    
    this.MinHeapify =  function( node, args ){
	
	//Takes care of empty children..takes care of root
	if ( node == null || node.animationParent == null ) {
	    return null;
	}
	
	
	//Switching the greater than operator makes no diff
	while ( node.animationParent && node.value > node.animationParent.value ) {
	
	    
	    var startingParent = node.animationParent, startingChild = node;
	    	    
	    var /*startingParent = node.animationParent, startingChild = node,*/
		grandParent = startingParent.animationParent,
		startingParentLeftChild =   startingParent.leftChild ,
		startingParentRightChild =  startingParent.rightChild,
		startingChildRightChild = startingChild.rightChild,
		startingChildLeftChild  = startingChild.leftChild;
		
	    
	    //I saved the startingChildLeftChild and free to set up a new rightChild
	    if( startingChildLeftChild != null ){	    
		breakConnection(startingChild, startingChildLeftChild );    
	    }
	    
	    //I saved the startingChildRightChild and free to set up a new rightChild    
	    if( startingChildRightChild != null ){	    
		breakConnection(startingChild, startingChildRightChild );    
	    }
	    
	    //Lets break the relationship of the startinParent to its children
	    //One of these next 2 ifs will be startingChild and startingParent
	    if( startingParentLeftChild != null ){	    
		breakConnection( startingParent, startingParentLeftChild );    
	    }
	    
	    if( startingParentRightChild != null ){	    
		breakConnection( startingParent, startingParentRightChild );    
	    }
	    
	    
	    //Lets break the line connecting the Parent and Child
	    //breakConnection(startingParent, startingChild);
	    
	    //Now if there is a parent of 'startingParent' lets set the child
	    //equal to Starting Child
	    if ( grandParent ) {	    
		
		//Lets break the line connecting the grandparent and parent
		breakConnection(grandParent, startingParent);	    
		//Lets make the line for grandParent and child
		createParent_Child_Relationship(grandParent,
		    startingChild,'left_to_right_children');
	    }
	    
	    //Lets create the rltnship for new parent and old child
	    createParent_Child_Relationship( startingChild,
		startingParent, 'left_to_right_children');
	    
	    // Now lets update the parents previous children with the two 
	    // if statements.  This NEEDS to be here so a new  
	    // parent(oldChild) doesnt try to update itself as its own child
	    if ( startingParentLeftChild != startingChild && startingParentLeftChild) {	    
		createParent_Child_Relationship(startingChild,
		    startingParentLeftChild, 'left_to_right_children');     
	    }
	    
	    if ( startingParentRightChild != startingChild && startingParentRightChild) {	    
		createParent_Child_Relationship(startingChild,
		    startingParentRightChild, 'left_to_right_children'); 	    
	    }
	    
	 
	    
	    //Now lets swap their places
	    //swapNodesbetweenGrids(startingParent, startingChild);
	    
	    //If balance factor of child is zero then I have even number of children.
	    //I have to unload one of them to my new child
	    if ( startingChildLeftChild ) {
		
		createParent_Child_Relationship( startingParent,
		    startingChildLeftChild, 'left_to_right_children');
	    }
	    
	    if ( startingChildRightChild ) {
		
		createParent_Child_Relationship( startingParent,
		    startingChildRightChild, 'left_to_right_children');
	    }
		
	}    
	
	
	self.MinHeapify( node.rightChild, args );
	self.MinHeapify( node.leftChild, args  );
	
	return node.animationParent || node;
    }
    
    this.Presort = function(){
	heapSpace = {};
	heapSpace.array = [];
	
    }
    
    
    //I have to resort everytime I insert or delete to take care of special 
    //cases where the user might have played around with the graph
    this.Resort = function( node, parentIndex, left_or_right_or_top, heapSpace ){
	
	//var heapArray = heap || heapSpace;
	
	if ( node == null) {
	    return heapSpace;
	}
	
	//Lets set the current node index
	var iterate_index = 1 ,
	    current_node_index =  2*(parentIndex) + left_or_right_or_top;	
	
	//current_node_index = 2*(parentIndex) + left_or_right;
	heapSpace[node.id] = current_node_index;
	heapSpace['array'][ current_node_index ] = node;
	
	//Now lets increase the index recursively rearrange the children
	if( node.leftChild ) {
	    
	    self.Resort(node.leftChild, current_node_index, iterate_index, heapSpace);
	    iterate_index++;
	}
	
	
	
	self.Resort(node.rightChild,current_node_index, iterate_index, heapSpace);
	
	return heapSpace;
	
    }
    //Something is wrong with my array 
    this.Search = function (  node, root, args, heap ){       
	
	//self.Resort(root, top ,  top );
	
	var heapSpace = heap || this.heapSpace,
	    index = heapSpace[node.value], level = Math.ceil(index/2);
	
        Log("\nSearch: Node " + node.value + " found in Array Index "
	    + index +' on Level ' + level + ' as '+
	    node.relationToParent + 'child of ' + node.animationParent.id );   
   
        return node;//Return the found node        
    }; 
    
    
    //TODO: Problem when there is only when node here
    this.Insert = function ( root , insert_new_node, heap) {
	
	var heapSpace = heap || this.heapSpace;
	//self.Resort(root, top ,  top );
	
	/*/First Node...lets not do anything
	if (nodes_in_canvas.length == 0) {
	    
	    return false;
	}
	*/
	var new_node = insert_new_node || createNode( {'id' : args.number, 'tween':false} );
	
	var index_of_new_node = heapSpace['array'].length; 
        var parent = heapSpace['array'][ Math.floor( (index_of_new_node -1)/ 2 ) ];
        
	if (parent) {
	    createParent_Child_Relationship(parent, new_node, 'left_to_right_children');
	}
	
	heapSpace.array.push(new_node);

        return new_node;
        
    };
    
    //TODO: Must finish Binary Heap
    this.Delete = function ( deleteThisNode, root, args, heap ) {
        var self = this,
	    heapSpace = heap || this.heapSpace;
	    breakfromParents = [], new_root = heapSpace.array[1];
	
	
	//Lets reset the array by cutting off everything after the node
	var reattachNodes = heapSpace.array.slice(heapSpace[deleteThisNode.id] +  1);
	heapSpace.array = heapSpace.array.slice(0, heapSpace[deleteThisNode.id]);
	
	//If I have a valid root let me reset it to that else it will be the same
	//Takes care of deleting the overall root
	new_root = heapSpace.array[0] || new_root;
	
	deleteThisNode.breakAllConnections();
	
	/*
	if(deleteThisNode.animationParent) breakConnection( deleteThisNode.animationParent, deleteThisNode );
	if(deleteThisNode.leftChild) breakConnection( deleteThisNode.leftChild, deleteThisNode );
	if(deleteThisNode.rightChild) breakConnection( deleteThisNode.rightChild, deleteThisNode );
	*/
	for (var i in reattachNodes) {
	    var node = reattachNodes[i];
	    
	    node.breakAllConnections();
	    /*
	    if(node.animationParent) breakConnection( node.animationParent, node );
	    if(node.leftChild) breakConnection( node.leftChild, node );
	    if(node.rightChild) breakConnection( node.rightChild, node );
	    */
	    
	    
	}
	
	//If I deleted the root lets put one back in
	if (heapSpace.array.length == 0) {
	    heapSpace.array.push(new_root);
	}
	
	for (var i in reattachNodes) {
	    if (new_root != reattachNodes[i]) {
		self.Insert(new_root, reattachNodes[i]);
	    }
	    
	}
	
	deleteNode( deleteThisNode );
	
	return heapSpace.array[0];
    
    }
    
        
}//End of Binary Heap


/********************************************************************************
 * Binary Heap   
********************************************************************************/
function Binary_Heap( args, user_defined_node ) {
    
    var roots = retrieve_top_node();
 
    if ( roots.length > 2) {
        Log('Error: Heap Operations cannot be performed because two or more '
            + 'nodes dont have parents. Only the root(top node) cannot have a parent');
        
        return;
    }  
    
    var viable_node = roots[0], top= 0 ,root = roots[0], operation = args.operation, bheap = new Binary_Heap_Tree(args) ;
    
    
    bheap.Resort(root, top,  top, bheap.heapSpace);
    
    switch (operation) {

	case 'insert':
	    viable_node = bheap.Insert( root );
	    break;
	
	case 'delete':
	    viable_node = bheap.Delete( user_defined_node, root, args );
	    break;
	
	case 'search':
	    bheap.Search( user_defined_node, root, args );
	    break;
    }
    
    if( viable_node ){
	
	root = viable_node.getRoot();
    
	if ( (operation == 'insert' || operation == 'delete') && root ) {
	    
	    bheap.MinHeapify(root.rightChild, args);
	    bheap.MinHeapify(root.leftChild, args);
	    
	}
    }
}
/********************************************************************************
 * Binomial Heap Tree
********************************************************************************/

var Binomial_Heap_Tree = function(args){
    
    var self = this, top = 0;
    
    this.args = args;
    self.heapSpace = {'array':[]};
    self.prototype = new Binary_Heap_Tree(args);
    
    this.isBinomialNumber = function( number ) {
	 var binomial = Math.log( number )/Math.log(2);
	 return ( binomial % 1 === 0 ) ? true : false ;
    }
    
    this.isValidRoot = function( rootID ){
	
	if( !isValidNumber(rootID) ){
	    Log("Error: " + rootID + " is not a valid number");
	    return false;
	}
	
	else if( !nodes_in_canvas_by_id[ rootID ]){
	    Log("Error: Node " + rootID + " does not exist in Canvas");
	    return false;
	}
	else if( nodes_in_canvas_by_id[ rootID ].animationParent){
	    Log("Error: Node " + rootID + " is not a root and has Parent Node " +
		nodes_in_canvas_by_id[ rootID ].animationParent.value);
	    return false;
	    
	}
	
	else{return true;}
    }
    
    this.getNumberofNodesinThisTree = function ( node, count ) {
	
	
	
	if ( node == null ) {  return 0;}
	
	for (var i in node.animationChildren) {
	    var childNode = node.animationChildren[i];
	    count = self.getNumberofNodesinThisTree(childNode, count );
	}
	
	
	return count +1;
    }
    
    this.deleteMin = function(userNode ){
	
	var root = userNode.getRoot();
	
	var rootIDsConnectedToNode=[] ;//= Object.keys(root.connectedByLine).sort().map(Number);
	
	$.each(root.connectedByLine,function(index,node){
	    rootIDsConnectedToNode.push( (node.id).toString() );
	})
	
	//Break all Connections so the other nodes are now roots to be merged
	root.breakAllConnections();
	
	//Not going to merge only one node so lets return
	if (rootIDsConnectedToNode.length < 2) {
	    return;
	}
	
	//for (var i=1; i< Object.keys(rootIDsConnectedToNode).length; i++) {
	this.Merge( rootIDsConnectedToNode.sort().map(Number).map(String), true );
	
	deleteNode( root );
	//}
	
	
    }
    
    this.deleteNode = function(){
	
	this.prototype.Delete( deleteThisNode, this.heapSpace[0]/*root*/, args );
	
    }
    
    this.Merge = function (array_of_root_IDs, max_heapify) {
	
	var all_valid = true;
	
	for ( var i in array_of_root_IDs) {
	    var rootID = array_of_root_IDs[i];
	    
	    if ( !self.isValidRoot(rootID)  ) {
		all_valid = false;
	    }
	    
	    else if (array_of_root_IDs.length < 2 ) {
		all_valid = false;
		Log("There are too few root inputs to merge in Canvas.");
	    }
	    
	    else {
		var rootNode = nodes_in_canvas_by_id[rootID].getRoot(),
		  number_of_nodes_in_heap = self.getNumberofNodesinThisTree( rootNode, 0 );
		
		if( !self.isBinomialNumber( number_of_nodes_in_heap ) ){
		    all_valid = false;
		    Log("Tree with root Node " + rootNode.value + " is not a valid Binomial Heap "
			+ " because it has " + number_of_nodes_in_heap +
			" nodes which isnt a binomial number.");
		    
		}
	    }
	    
	}
	
	if (!all_valid) { return; }
	
	array_of_root_IDs = array_of_root_IDs.map(Number).sort();
	
	var masterRoot = nodes_in_canvas_by_id[ array_of_root_IDs.shift() ].getRoot();
	
	$.each(array_of_root_IDs, function(index, id){
	    
	     createParent_Child_Relationship( masterRoot,
		nodes_in_canvas_by_id[id], 'left_to_right_children');
	    
	    })
	    
	   
	
	
	/*
	for ( var i=0; i<= array_of_root_IDs.length - 2; i++) {
	    var root1, root2, node1 = nodes_in_canvas_by_id[ array_of_root_IDs[i] ],
		node2 = nodes_in_canvas_by_id[ array_of_root_IDs[i+1] ];
	    
	    ( node1.value > node2.value ) ? (root1 =node1, root2 =node2):
		(root1 =node2, root2 =node1) ;
		
	    createParent_Child_Relationship( root1, root2,
		'left_to_right_children');
	    
	}
	*/
	
	
    }
    
    
}
/********************************************************************************
 * Binomial Heap  
********************************************************************************/
function Binomial_Heap(args) {
    
    
    var roots = retrieve_top_node();
    var user_defined_roots = $.map( $('input#binomial_roots').val().split(","), $.trim);
    //var c = getNumberofNodesinThisTree ( roots[0], 0 );
    
    
 
    var root = roots[0], operation = $('#select_option').val().trim(),
	binomial_heap = new Binomial_Heap_Tree(args);
	//binomial_heap.prototype = new Binary_Heap_Tree();
    
    
    switch (operation) {
	
	case 'merge':
	    binomial_heap.Merge( user_defined_roots );
	    break;
	
	case 'delete_min':
	    var userNode = nodes_in_canvas_by_id[parseInt( user_defined_roots )];
	    binomial_heap.deleteMin( userNode  );
	    break;
	
	/*
	case 'search':
	    binomial_heap.Search( user_defined_node, root );
	    break;
	*/
    }
    
    /*
    if (operation == 'insert' || operation == 'delete') {
	bheap.MaxHeapify(root.rightChild);
	bheap.MaxHeapify(root.leftChild);
    }
    
    //code
    */
}