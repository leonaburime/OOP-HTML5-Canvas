/****************************************************************
 * My name is Leon Aburime and I made all this right here
 * U...S...C TROJAAAAAANSS!!
 * This page is mainly responsible for
 * the setup associated with the Animation page
 *
 *
 *
 *
 ***************************************************************/


/********************************************************************************
* I want this stuff below done ASAP! And I mean YESTERDAY so I dont have to
* deal with loading issues
********************************************************************************/ 

    //GLOBALS are evil I know
    var  image_folder = '../images/', canvas_jQ, context, 
         canvas_width, canvas_height, stage, text_height, lines_in_canvas = {},
         elements_in_canvas = [], nodes_in_canvas = [], nodes_in_canvas_by_id = [],
	 choose_shape = [], modify_Parent_Child_relationship_queue = [],
         all_nodes = [], unique_animation_ids = [], line_values = [],
	 heapSpace = {'array':[]},time_difference_btwn_double_clicks =5000, //5 seconds
	 max_number_of_children =2, max_number_of_parents= 1, algorithm_method='',
	 solve_by_algorithm, ordered_children = false, left_to_right_children = false,
	 changing_line_value_node, node_tween_speed = 2500, animation_delay_order = 0,
	 solving = false;
	
    //Lets set up the all important timeline  TODO: Hmmm maybe i should move it inside the  $(function(){...
    var  tl=null, time_between_tweens = tbt = 2, start_time = 0, number_of_comparisons = 0,
	number_of_swaps = 0, slider;
	
    function timelineComplete() {	
	$('#instant_replay').append(replay[0]);	
    }
	
	
	//All Important grid attributes
	var grids =[] , gridSpace_width=150, gridSpace_height=150
	, gridInformation = new Object();
	 
	 
            
            
    //Lets Preload some Images ASAP to stop the quirky onload problems
    //Im getting
    var queue = new createjs.LoadQueue(), replay ;
        queue.loadManifest([
	{id: "circle", src: image_folder + 'circle.jpg'},
	{id: "rectangle", src: image_folder + 'rectangle.jpg'}
        ]);
/********************************************************************************
********************************************************************************/   




/********************************************************************************
* The point of having this "$(function(){..." scope is to wait until the
* document is ready before I execute the following code
********************************************************************************/
$(function(){
	
	
	var standard_instructions = '<div id="user_input"><span id="instructions">  Search for Number </span>' +
		'<input id="input"> <br> </div> ';
	
	slider =  $( "#slider" );
	slider.slider({step: 0.1, animate: "fast", slide: function( event, ui ) {
		
		tl.gotoAndStop(ui.value);
		//console.log( ui.value );	
		
		}
	});
	
	$('#play-button').click(function(){
		if( !tl || tl.duration < 1) return;
		
		tl.play(); Log('\nPlaying'); })
	
	$('#pause-button').click(function(){
	    if( !tl || tl.paused()) return;
				 
	    tl.pause(); Log('\nPausing'); })
	
	$('#stop-button').click(function(){
	   if( !tl ) return;
	   
	   //Lets go to the end before deleting all the tweens
	   tl.currentProgress = 1;
	   
	   tl.clear(); Log('\nStopped'); solving = false; })
	
	//Dont want numbers getting too high	
	$("input").attr('maxlength','6');
	
	$('#modal_controls').draggable({
		handle: ".modal-header"
	});
	
	$('#modal_controls').modal({
	  keyboard: false, backdrop: false,
	  show: false
		
	});
	
	$(".line-value").dialog({ autoOpen: false, resizable: false, draggable : false}).parent().draggable();
	
	$('body').on('keypress', '#user_input input:not(#number, .data_structure)', function(e){ 
		if ((e.keyCode || e.which) == 13){$('button#solve').trigger('click');}
	
	});
	
	algorithm_options;
	
	
	//Here Im dealing with a data structure option(Index, Insert, Search, Delete)
	$('body').on('keypress', '#user_input input#number, #user_input input.data_structure', function(e){
		if ( (e.keyCode || e.which) == 13 ){
			
			$('button#solve').trigger('click');
		}	
	});
	
		
	$('button#solve').click(function(){
		
		if (nodes_in_canvas.length == 0 &&
		    $('.ppDSO button.run_animation[disabled="disabled"]').length ==0 ) {
			
			Log('Error:  You must first add nodes to the Page');
			return;
		}
		
		if (!algorithm_method) {
			Log('Error:  You must first define a "Algorithmic Solve Method" (Light Blue Button)');
			return;
		}
		
		if (solving) {
			Log('Program is currently being solved.  Please wait until completion.');
			return;
		}
		
		animation_delay_order = 0;
		
		replay = [];
		var counter = 0;
		
		
		var worker = new Worker('js/canvasToImage.js');
		
		var t= window.setInterval(function() {
			
		   //canvas.toDataURL("image/png")	
		/*
		   worker.postMessage( canvas.toDataURL("image/png") );
			
		   worker.addEventListener('message', function(e) {
		     replay.push( e.data );
		   }, false);
		   */
			
		}, 500);
		
		
		tl = new TimelineLite({onStart:function(){ solving = true;}  ,onUpdate: function(){
			
			/*
			if( counter++ % 10 != 0) return;
			
			var im = new Image();
		        im.src = canvas.toDataURL("image/png")
			
			replay.push( im  );
			*/
			
			/*
			if( counter++ % 10 != 0) return;
			
			console.log(counter++);
			
			slider.slider( "value",
			tl.progress()*slider.slider( "option", "max" ) ); */
			},				      
			onComplete:function(){ timelineComplete(); solving = false; clearInterval(t) }  });
		
		number_of_comparisons = number_of_swaps = 0, start_time = 0;
		
		tl.pause();
		
		if ( $('.ppDSO button.run_animation[disabled="disabled"]').length>0 ) {
			
		    var user_number = $('#user_input input#number').val(),
			    user_number_after = $('#user_input input#number_after').val(),
			    user_operation = $('select#select_option').val();
			    
			var max_heapify = $('button#max-heapify').is(':disabled'),
			    min_heapify = $('button#min-heapify').is(':disabled') ;
			
			if (max_heapify || min_heapify) {}
			
			//If not valid number and not binary heap
			else if( !isValidNumber( user_number ) ) {
				return;	
			}			
			
			ppDSO({'operation': user_operation, 'number': user_number,
				'data_structure': solve_by_algorithm, 'timeline': tl,
				'number_after' : user_number_after,
				'max_heapify':max_heapify, 'min_heapify':min_heapify			
			}); 
		}
		else{
			
		    solve_by_algorithm();	
		}
		
		
		
		slider.slider( "option", "max", tl.getChildren().length );
		
		
		tl.play(); //On t1 finish function timelineComplete will be run
		
		
		//Now lets reset our variables for another run
			
			
	});
	
	$('button#depth_first, button#breadth_first').click(function(){
		
	  $('#user_input').empty().html( standard_instructions);
	})
	
	$('a[href$="data_structures"],button#binary_heap, a[href$="heaps"], #data_structures button:not(#linked_list)')
		.click(function(){
		var data_structures_input = '<select id="select_option" style="width:120px ; min-height:22px"> \
			<option value="insert">Insert</option> \
			<option value="search">Search</option> \
			<option value="delete">Delete</option>  \
		      </select> &nbsp &nbsp &nbsp' +
			
		'<input id="number" maxlength="6"> <br> ';
		
		$('#user_input').empty().html(data_structures_input);
		
	});
	
	$('button#linked_list').click(function(){
		var linked_list_input = '<select id="select_option" style="width:120px ; min-height:22px"> \
			<option value="insert">Insert __ After __</option> \
			<option value="search">Search</option> \
			<option value="delete">Delete</option>  \
		      </select> &nbsp &nbsp &nbsp' +	
		'<div class="inline" id="linked_list_input" ><input class="small data_structure" id="number" maxlength="6"> <input class="small  data_structure" id="number_after"  maxlength="6"> </div> <br> ';
		
		$('#user_input').empty().html(linked_list_input);
		
	});
	
	$('button#binomial_heap').click(function(){
		var binomial_heap_input = '<select id="select_option" style="width:170px ; min-height:22px"> \
			<option value="merge">Merge Binom. Heaps</option> \
			<option value="delete_min">Delete Minimum</option> \
			<option value="delete">Delete</option>  \
		      </select> &nbsp &nbsp &nbsp' +	
		'<div class="inline" id="binomial_input" ><input class="" id="binomial_roots" > </div> <br> '
		+ '<span class="caption"> Enter root for single operation or roots to merge  separated by a <br/> comma. Ex: 405, 10, 110, 101</span>';
		
		$('#user_input').empty().html(binomial_heap_input);
		
	});
	
	
	$(document).on('change', '#select_option',function(event) {
	  if(  $('#select_option').val() == 'insert' ){
		  $('#linked_list_input').empty()
			.html('<div class="inline" id="linked_list_input" ><input class="small data_structure" id="number" maxlength="6"> <input class="small data_structure" id="number_after"  maxlength="6"> </div> <br> ');	
			
		}
	
	  else{
	        $('#linked_list_input').empty()
			.html('<div class="inline" id="linked_list_input" ><input class=" data_structure" id="number" maxlength="6"> </div> <br> ');	
	  }	
		
	});
	
	$('button#mst').click(function(){
		var mst_controls = '<span id="instructions"> Start with Node </span> <input  id="start">';
		
		$('#user_input').empty().html(mst_controls);
		
	});
	
	
	
	$('button#dijkstra, button#bellman-ford').click(function(){
		var dijkstra_controls = '<span id="instructions"> Shortest Path from </span> <input  id="start">'+
		  ' to <input id="finish"> <br> ';
		
		$('#user_input').empty().html(dijkstra_controls);
		
	});
	
	$('button.heap').click(function(){	
		$('button#min-heapify').trigger('click');		
	})
	
	$('button#max-heapify').click(function(){
		
		if ( $('button#binomial_heap').is(':disabled') ){
			Log("Error: Only 'Min-Heapify' is allowed for a Binomial Heap");	
		
		
		setTimeout(function(){
		   $('button#max-heapify').attr('disabled', false);
		   $('button#min-heapify').attr('disabled', true);
			}, 200)
		}
	})
	
	
	
	$('body').on('keypress', '#line_value', function(e){ 
		if ((e.keyCode || e.which) == 13){$('button.change-line-value').trigger('click');}
	
	});
	
	$('button#clear_lines').click(function(){		
		for(var i in lines_in_canvas){
			var line = lines_in_canvas[i];
			line.x -= -1000;
			breakConnection(line.connectionPrimary, line.connectionSecondary);
			//line.deleteLine([lines_in_canvas, elements_in_canvas]);
		}
	})
	
	$('button.change-line-value').click( function(){
		new_line_value =  $('input#line_value').val() ;
		
		if (!isValidNumber(new_line_value) ) {
			return;	
		}
		
		if (algorithm_method == 'dijkstra' &&  parseInt(new_line_value) < 0) {
			Log("Error: Negative line values are not allowed in Dijkstra" );
			return;
		}
			
		changing_line_value_node.changeLineValue( new_line_value );
		$(".line-value").dialog("close");
	
	})
	
	$('#refresh_graphs').click(function(){		
		
		
		
		Adjacency_List();
		Incidence_List();
		Adjacency_Matrix();
		Incidence_Matrix();
		
		$('#topTabs a[href$="generate_graphs"]').tab('show');
		
		
		
		$.each(lines_in_canvas, function(i, l){l.showLineValue(true)})
	});
	
	$('.show_modal').click(function(){
		
		$('#modal_controls').modal('show');
		$('#refresh_graphs').trigger('click');
		
		$('#myTab a[href*="' + $(this).attr('id') + '"]').tab('show');
		
	});
	//Close button for modal 
	$('.modal-footer button').click(function(){
		$('button.show_modal').removeAttr('disabled'); })
	
	
	$('button#clear_clicks').click( function(){	
		modify_Parent_Child_relationship_queue.length =0;
		Log('Cleared of Double Clicks');
	});
	
	
	
	$('button#add_node').click(function(){
	   if (!solve_by_algorithm) {
		Log('Error:  You must first define a "Algorithmic Solve Method" (Light Blue Button) before adding nodes');
		return;
	   }
	   
	   if (solve_by_algorithm == LinkedList_Tree && nodes_in_canvas.length > 1 ) {
		
		Log('Error: Must add Nodes to canvas via the Console for Linked List \
		    after inserting first node');
		return;
	   }
	   
	   if ($.inArray(solve_by_algorithm,[AVL_Tree, BST_Tree] ) > -1 ) {
		
		Log('Error: Must add Nodes to canvas via the Console for Data Structure operations');
		return;
	   }
	   
	   
	   
	   if ( $('button#binary_heap').is(':disabled')) {
		Log('Error: Must add Nodes to canvas via the Console for Binary Heap operations');
		return;
	   }
	   
	   var args = {shape: 'circle', id: generateUniqueNodeId() };        
	   createNode( args );
	   
	});
	
	  //On click populate the button set to run various animations
	$('ul.nav li a').click(function(){		
		$('.interact').css({'visibility':'visible'});		
	});
	
	
	$('button.heapify').click( function(){
	   $('.heapify').siblings('.heapify').attr("disabled", false);
	   $(this).attr("disabled", true);
	});
	
	$('button.run_animation').click( function(){
	   $('.run_animation').siblings('.btn-info').attr("disabled", false);
	   $(this).attr("disabled", true);
	   algorithm_method = $(this).attr('id');
	   
	   
	   switch(algorithm_method)
		{
			/* Search Algorithms*/
			case 'depth_first':
			  ordered_children = true;
			  max_number_of_children =2;
			  max_number_of_parents  = 1;
			  solve_by_algorithm = Depth_First;
			  break;
			case 'breadth_first':
			  ordered_children = true;
			  max_number_of_children =2;
			  max_number_of_parents  = 1;
			  solve_by_algorithm = Breadth_First;
			  break;
			case 'mst':
			  ordered_children = false;
			  max_number_of_children = 10000;
			  max_number_of_parents  = 10000;
			  solve_by_algorithm = MST; 
			  break;
			case 'dijkstra':
			  ordered_children = false;
			  max_number_of_children = 10000;
			  max_number_of_parents  = 10000;
			  solve_by_algorithm = Dijkstra; 
			  break;
			case 'bellman-ford':
			  ordered_children = false;
			  max_number_of_children = 10000;
			  max_number_of_parents  = 10000;
			  solve_by_algorithm = Bellman_Ford;
			  break;
			
			/* Sort Algorithms*/
			case 'bubble_sort':
			  solve_by_algorithm = Bubble_Sort;
			  break;
			case 'bucket_sort':
			  solve_by_algorithm = Bucket_Sort;
			  break;
			case 'heap_sort':
			  solve_by_algorithm = Heap_Sort;
			  break;
			case 'insertion_sort':
			  solve_by_algorithm = Insertion_Sort;
			  break;
			case 'merge_sort':
			  solve_by_algorithm = Merge_Sort;
			  break;
			case 'quick_sort':
			  solve_by_algorithm = Quick_Sort;
			  break;
			case 'radix_sort':
			  solve_by_algorithm = Radix_Sort;
			  break;
			case 'selection_sort':
			  solve_by_algorithm = Selection_Sort;
			  break;
			
			
			/* Heap Algorithms  */
			case 'binary_heap':
			  max_number_of_children =2;
			  left_to_right_children = true;
			  ordered_children = false;
			  max_number_of_parents = 1;
			  solve_by_algorithm = Binary_Heap;
			  break;
			case 'binomial_heap':
			  max_number_of_children = 1000000;
			  left_to_right_children = true;
			  ordered_children = false;
			  max_number_of_parents = 1;
			  solve_by_algorithm = Binomial_Heap;
			  break;
			case 'fibonacci_heap':
			  solve_by_algorithm = Fibonacci_Heap;
			  break;
			
			
			/* Graph  Algorithms  */
			case 'adjacency_list':
			  ordered_children = false;
			  max_number_of_children = 10000;
			  max_number_of_parents  = 10000;
			  solve_by_algorithm = Adjacency_List;
			  break;
			case 'incidence_list':
			  ordered_children = false;
			  max_number_of_children = 10000;
			  max_number_of_parents  = 10000;				
			  solve_by_algorithm = Incidence_List;
			  break;
			case 'adjacency_matrix':
			  ordered_children = false;
			  max_number_of_children = 10000;
			  max_number_of_parents  = 10000;
			  solve_by_algorithm = Binary_Heap;
			  break;
			case 'incidence_matrix':
			  ordered_children = false;
			  max_number_of_children = 10000;
			  max_number_of_parents  = 10000; 
			  solve_by_algorithm = Binomial_Heap;
			  break;
			
			
			/* Data Structure Algorithms  */
			case 'avl_tree':
			  ordered_children = true;
			  max_number_of_children =2;
			  max_number_of_parents  = 1;	
			  solve_by_algorithm = AVL_Tree;
			  break;
			case 'binary_search_tree':
			  ordered_children = true;
			  max_number_of_children =2;
			  max_number_of_parents  = 1;	
			  solve_by_algorithm = BST_Tree;
			  break;
			case 'red_black_tree':
			  ordered_children = true;
			  max_number_of_children =2;
			  max_number_of_parents  = 1;	
			  solve_by_algorithm = Red_Black_Tree;
			  break;
			case 'linked_list':
			  ordered_children = true;
			  max_number_of_children = 1;
			  max_number_of_parents  = 1;
			  solve_by_algorithm = LinkedList_Tree;
			  break;
			
		}	
	   
	});
	
	
	init();      
             
	function init() {
                
		//Lets Initialiaze All my the Variables
		text_height = 15,
		
			
		//Lets get some canvas information
		canvas = document.getElementsByTagName("canvas")[0],
		      canvas_jQ = $('canvas'),//jQuery Canvas Object
		      context = canvas.getContext('2d'),
		      canvas_width = canvas.width,
		      canvas_height = canvas.height
		      
		     
		stage = new createjs.Stage("animation");
			
		gridify_the_canvas(canvas);
		stage.update();        
        		
	} 
	       
})

/********************************************************************************
* Now Lets set up some utility functions
*
********************************************************************************/
function resetAllNodes(node_array) {
	var nodes = node_array || nodes_in_canvas;
	
	$.each(nodes, function( index, current_node){
		//Lets reset the text 
		current_node.changeSubText('');
		
		current_node.changeColor('white');
		//Lets clear the lines
		$('button#clear_lines').trigger('click');
	})	
	
}
/********************************************************************************
*Lets create set some grid Space Objects up so I can easily move and
*snap my canvas elements
********************************************************************************/ 
function gridify_the_canvas(canvas){
	
	
	var counter = 0, row = 0, column = 0 ;
		
	for(y=0 ; y< canvas.height; y+= gridSpace_height){ 	
		for(x=0 ; x < canvas.width; x+= gridSpace_width){ 
			
			
			centerPoint = {'x': column*gridSpace_width + gridSpace_width/2 ,
				'y': row*gridSpace_height + gridSpace_height/2 };
			var topLeft = {'x': x, 'y': y}, topRight = {'x': x +gridSpace_width, 'y': y},
			bottomLeft = { 'x' : x, 'y': y + gridSpace_height }, 
			bottomRight = {'x' : x+gridSpace_width, 'y': y + gridSpace_height }	
			
			var grid = new createjs.Grid({ 'width' : gridSpace_width,
			    'height' : gridSpace_height, 'row' : row, 'column': column,
			    'centerPoint': centerPoint, 'topLeft': topLeft ,
			    'topRight': topRight, 'bottomLeft': bottomLeft, 'bottomRight': bottomRight,
			    'order': counter, 'name' : 'grid_' + counter			    
			    });
			
			grids.push( grid);//I want global access to them
			stage.addChild(grid);
			
			counter++;
			column++;    	
			
			
		}
		row++;  column = 0;	
	}
	
	//Lets set some general grid information for snapping
	var number_of_grids_in_one_row = canvas.width / gridSpace_width,
	    number_of_grids_in_one_column = canvas.height / gridSpace_height;
		
	gridInformation.number_of_grids_in_one_row =number_of_grids_in_one_row;
	gridInformation.number_of_grids_in_one_column = number_of_grids_in_one_column;
	gridInformation.number_of_grids = number_of_grids_in_one_row
		* number_of_grids_in_one_column;
	
	gridInformation.row_index = function(me){
		var row_index = [];
		for (var i = 0; i <= me.number_of_grids_in_one_column; i++) {
			row_index.push(i);
		}
		 
		return row_index;	
	}(gridInformation)
	
			
		
}
/********************************************************************************
********************************************************************************/


/********************************************************************************
*On mouseup I want to snap the element to a gridSpace
*:Being sent to by function createNode(..)
********************************************************************************/
function snap_Element_to_gridSpace(element_to_Snap_to_gridSpace, grid_to_Snap_To) {
	
	var node = element_to_Snap_to_gridSpace, grid =  grid_to_Snap_To;
	
	if (grid) {		
	  connectGridandNode(node, grid);	
	  return;
	}
	
	//We need to find what grid it is in
	var nearest_grid = return_Nearest_grid(
		node.x + node.centerPoint.x,
		node.y + node.centerPoint.y);
	
	//If there is a node there dont place it down
	if ( nearest_grid.occupant ) {
		return;
	}
	
	connectGridandNode(node, nearest_grid);
	
}

/********************************************************************************
 * Move a node up or down just to get it out of the way
********************************************************************************/
function tweenNowhere(node, args) {
	
	var tl = args.timeLine, tween_time = args.tween_length|| args.time || 2,
	    startAt = args.startAt, offset = args.offset || -60,
	    moveUp = node.gridSpace.center.y - node.centerPoint.y + offset
	    
	    
	    
	    
	    tl.add(  TweenLite.to( node, tween_time, {y: moveUp, 
		  onStart: function(){
			  
		    if( args.detachFromNode){
			node.gridSpace.occupant = null;
			node.gridSpace = null;
		    }	
				
				
		  }
		, ease:Quad.easeIn} ) , startAt  );
	
}
/********************************************************************************
 * Do I have to type everything for you to understand??!!
********************************************************************************/
function tweenDrawLine(line, args) {
	
	var tl = args.timeLine, tween_time = args.tween_length|| args.time || 2,
	    startAt = args.startAt, onlyMessage = args.onlyMessage,
	    hex_line_color = args.color || args.hex_color || '#ca413b', drawTime = args.drawTime,
            startNode = args.startDrawingFromNode,
	    
	    subText = args.subText, subTextNode = args.subTextNode,  
	    superText  = args.superText, superTextNode = args.superTextNode ,
	    outsideText  = args.outsideText, outsideTextNode = args.outsideTextNode ,
	    nodeColor = args.nodeColor, nodeToColor = args.nodeToColor;
		
	tl.add(  TweenLite.to( line, tween_time, {
	     onStart: function(){
		if (subTextNode ) {
		   subTextNode.changeSubText(subText);
		}
	    
	     
		if (superTextNode) {
		   superTextNode.changeSuperText(superText);
		}
		
		if (outsideTextNode) {
		   outsideTextNode.changeOutsideText(outsideText);
		}
		
		if (nodeToColor) {
		   nodeToColor.changeColor(nodeColor)
		}
		
	     
	     
	     if( args.message ){ Log( args.message ) };
	     if ( !onlyMessage ) { line.redrawLine(hex_line_color, drawTime, startNode); }
		
	}, ease:Quad.easeIn} ) , startAt  );
		
}

/********************************************************************************
 * Change color of multiple nodes 
********************************************************************************/
function tweenMultipleNodeColor(node_array,color_array, args) {
	var last_valid_line_color, last_valid_overlay_alpha = 0,
		last_valid_overlay_hex_color =  '#000000';
	
	if (!color_array[0]) {throw new Error('You need to insert at least one color in the color array');}
	
	if ( args.overlayAlphas && args.overlayAlphas.length > 0 ) { last_valid_overlay_alpha = args.overlayAlphas[0]; }
	
	if (args.overlayHexColors && args.overlayHexColors.length > 0) {  last_valid_overlay_hex_color = args.overlayHexColors[0] }
	
	for(var i=0; i<node_array.length; i++){
		var node =  node_array[i];
		
		if (color_array[i]) {
		    last_valid_line_color = color_array[i];
		}
		
		if (args.overlayAlphas) {
		    last_valid_overlay_alpha = args.overlayAlphas[i];
		}
		
		if (args.overlayHexColors) {
		    last_valid_overlay_hex_color = args.overlayHexColors[i];
		}
		
		args.color = last_valid_line_color;
		
		if ( node ) {
			
			//If I want to change overlay
			if ( args.overlayNodes && args.overlayNodes.indexOf(node)>-1) {
				args.overlayAlpha = last_valid_overlay_alpha;
				args.overlayHexColor =  last_valid_overlay_hex_color;
				args.overlay = true;
			}
			
			
			tweenNodeColor(node, args);
		}
	
		
	}	
	
}
/********************************************************************************
 * Change color while its being used
********************************************************************************/
function tweenNodeColor(node, args) {
	
	if (!( node instanceof createjs.Node) ) {
		console.log("Warning: Invalid node to color...returning");
		return;
	}
	
	var tl = args.timeLine, tween_time = args.tween_length|| args.time || 2,
	    startAt = args.startAt, keepColor = args.keepColor || [],
	    color = args.color || 'teal', count = 0;
	
	
		tl.add(  TweenLite.to( node, tween_time, {
		   onStart: function(){
			if( args.message && args.print_id == node.id  ){ Log( args.message ); }
			
			node.changeColor(color,{'overlay': args.overlay,
			   'overlayAlpha':args.overlayAlpha,'overlayHexColor':args.overlayHexColor });
			//node.changeOverlay( args.overlayHexColor ,args.overlayAlpha);
			
		     },
		   
		   //If I want to keep that node that same color for a while
		   onComplete:function(){
			if( keepColor.indexOf(node) < 0 ){
				node.changeColor('white');
				node.overlay.alpha = 0;
			}
			
			
		   },
		   
		   ease:Quad.easeIn} ) , startAt );
		
	
		
}
/********************************************************************************
********************************************************************************/
function connectGridandNode(node, grid, tween_args) {
	
	
	//Update grid info for node and grid space
	if(node.gridSpace){
		node.gridSpace.occupant = null;
		node.gridSpace=null;
		
	}
	
	var new_x = grid.center.x - node.centerPoint.x,
		new_y = grid.center.y - node.centerPoint.y;
	
	
	if ( tween_args ) {
		
		var tl = tween_args.timeLine, tween_time = tween_args.tween_length|| tween_args.time || 1.5,
		    startAt = tween_args.startAt, print_id = tween_args.print_id;
		
		tl.add(  TweenLite.to( node, tween_time, {x: new_x, y: new_y,
			onStart: function(){ if(  print_id == node.value ){
				if(tween_args.message) Log( tween_args.message ) }
				
				if (tween_args.color) {
				    tween_args.message = null;//Dont want this printing out again
				    tweenNodeColor(node, tween_args);
				}
				
			}
		, ease:Quad.easeIn} ) , startAt  );		
	}
	
	
	else{	
		//Snap it to the grid space
		node.x = new_x ;
		node.y = new_y; 
	}
	
	
	
	node.gridSpace = grid;
	grid.occupant =  node;
	
}
/********************************************************************************
********************************************************************************/
function insertNode(node, args) {
	
}
/********************************************************************************
********************************************************************************/
function slideNodesInGrid( args ) {
	
	var tl = args.timeline, tbt = args.tbt || 0, tween_time = args.time || 2,
	direction = args.direction || 1 , mainNode = args.mainNode,
	otherNode = args.otherNode, this_way;
	
	
	
	var main  = mainNode.gridSpace.order;
	if ( otherNode ) {
	    last = otherNode.gridSpace.order;
	}
	else{
	    var i=0;
	    while (grids[i++].occupant) { }
	    otherNode = grids[--i].occupant;	
	}
	
	
	
	var newMainNodeGrid = otherNode.gridSpace,
	   finish = Math.max(mainNode.gridSpace.order, otherNode.gridSpace.order);
	   start = Math.min(mainNode.gridSpace.order, otherNode.gridSpace.order);
	
	//Lets detach our main node from the gridspace to clear the pointers up
	mainNode.gridSpace = mainNode.gridSpace.occupant = null;
	
	for ( i = finish-1 ; i >= start; i-=direction ) {
	     var node1 = grids[i].occupant , grid2 = grids[i+direction];
	     
	     
	     node1.gridSpace.occupant = null;
	     node1.gridSpace = null;
	     grid2.occupant = null;	     
	     	     
	     connectGridandNode(node1, grid2, args);	     
	}	
	
	connectGridandNode(mainNode, newMainNodeGrid, args);
	
}
/********************************************************************************
********************************************************************************/
function swapNodesbetweenGrids(node1, node2, tween_args) {	
	
	var grid1 = node1.gridSpace, grid2 = node2.gridSpace,
	    tween1_args = $.extend(true, {}, tween_args ),
	    tween2_args = $.extend(true, {}, tween_args );
	
	grid1.occupant = null, node1.gridSpace = null;
	grid2.occupant = null, node2.gridSpace = null;
	
	if (tween_args.colors) {
		tween1_args['color'] = tween_args.colors[0];
		tween2_args['color'] = tween_args.colors[1];
	}
	
	connectGridandNode(node1, grid2, tween1_args);
	connectGridandNode(node2, grid1, tween2_args);	
	
}
/********************************************************************************
********************************************************************************/
function return_Nearest_grid(x_position, y_position) {	
	
	
	var column_position_number_of_element = Math.floor((x_position / gridSpace_width))  ,
	    row_position_number_of_element = Math.floor((y_position / gridSpace_height)) ;
	    
	//Lets get some error checking bounds in case an element was pulled slighty offscreen
	row_position_number_of_element = Math.min( Math.max(0, row_position_number_of_element)
		, gridInformation.number_of_grids_in_one_column -1);/* -1 in 0-based 'grids' */
	
	column_position_number_of_element = Math.min( Math.max(0, column_position_number_of_element)
		, gridInformation.number_of_grids_in_one_row -1 );/* -1 in 0-based 'grids' */
	    
	
	gridSpace_index = column_position_number_of_element  + 
		gridInformation.number_of_grids_in_one_row* gridInformation.row_index
			[row_position_number_of_element] ;  
	
		
	return grids[gridSpace_index];
}
/********************************************************************************
* Function is mainly responsible for creating the shapes you see on the grid
********************************************************************************/ 
function createNode( args ) {
	
	if (nodes_in_canvas.length >= gridInformation.number_of_grids ) {
		Log("Error: Number of Nodes will cannot exceed Number of Grids");
		return null;
	}
	
        
        var shape_image = new createjs.Bitmap(queue.getResult("circle")),
            text = new createjs.Text(args.id,  text_height + "px Arial", "#000"),
	    subText = new createjs.Text('', 10 + "px Arial", "#ca413b"),
	    superText = new createjs.Text('', 10 + "px Arial", "#ca413b");;
	    outsideText = new createjs.Text('', 10 + "px Arial", "#ca413b");;
	
	    
        
	shape_node = new createjs.Node({ 'image' : shape_image,
		'text' : text, 'id': parseInt( args.id ), 'subText':subText,
		'superText': superText, 'outsideText':outsideText});
	  
        //Lets center the text          
        var metrics = context.measureText(text.text),
            text_width = metrics.width;
            text.x = shape_image.image.width/2 - text_width/2,
            text.y = shape_image.image.height/2 - text_height/2      
       
	subText.x = text.x - 7;
	subText.y = text.y + 20;
	
	superText.x = text.x - 15;
	superText.y = text.y - 20;
	
	outsideText.x = text.x - 15;
	outsideText.y = text.y + 60;
	
	shape_node.Log = Log;
        
        //Add Shape instance to stage display list.
        stage.addChild(shape_node);
	
        //Update stage will render next frame
        stage.update();
	
	var self = shape_node;	    
	self.addEventListener("mousedown", function(evt) {
	
	    if (solving) {
		Log('Please wait until the algorithm has finished to move nodes');
		return;
	    }
			    
	    var offset = {x:self.x-evt.stageX, y:self.y-evt.stageY};                                        
	    // add handlers directly to the event object:
	    evt.onMouseMove = function(evt) {    
		
		    self.x = evt.stageX+offset.x;
		    self.y = evt.stageY+offset.y;     
	    }
	    //Lets add an onmouseup event listener so I can
	    //snap elements to a grid Space and update position     
	    evt.onMouseUp = function(evt) {
		/*
		//Update grid info for node and grid space
		    if(self.gridSpace){
			self.gridSpace.occupant = null;
			self.gridSpace=null;
			
			}  
		*/
		
		//When I move up free the gridspace
		(self.gridSpace) ? self.gridSpace.occupant = null : '';
		
		snap_Element_to_gridSpace(self);
		
		for (var line_index in self.connectionLines) {
			self.connectionLines[line_index].redrawLine();
		    }		    
		stage.update(); 
		    
	    }
	    
	    
	});
	    
	self.addEventListener( "dblclick", function(evt) {
		
	    console.log("Double Clicked the container object"); 
	    
	    var date = new Date();
	    var current_time = date.getTime();
	    
	    
	    //Pushing the container and also the time clicked   
	    modify_Parent_Child_relationship_queue.push({
		time_clicked : current_time,
		node : self                                 
	    });
	    
				 
		
	    //If I have two shape_nodes in the queue I need to create a child
	    //parent relationship
	    if (modify_Parent_Child_relationship_queue.length == 2) {
		
		if ( ( modify_Parent_Child_relationship_queue[1].time_clicked -
		       modify_Parent_Child_relationship_queue[0].time_clicked )
			  < time_difference_btwn_double_clicks ) {
		    
		    
		    modify_child_Parent_relationship();
		}
		
		
		else modify_Parent_Child_relationship_queue.length = 0;
			       
	    }
	    
	}); 
        
                
        //Now I can need to gather all the active elements for manipulation
        elements_in_canvas[shape_node.id] = shape_node ;
        nodes_in_canvas.push( shape_node );
	
	//Creating this here because Im not sure if nodes and lines can have same id
	nodes_in_canvas_by_id[ shape_node.id ] = shape_node;
        
        Log('Adding Node ' + shape_node.id);
	
        var startX = args.startX || canvas.width-100, startY =  args.startY ||100,
	tween_time = 2.5;
	if (args.tween == false ) {
		startX = startY = 150, tween_time = 0;
	}
	
	TweenLite.to( shape_node, tween_time, { x: startX, y: startY, ease:Quad.easeOut} )
	
        //tween.to({x:canvas.width-100, y: 100, rotation:0}, 2500, createjs.Ease.circOut);
        
        createjs.Ticker.addEventListener("tick", stage);
	
	
	return shape_node;
        
    }
/********************************************************************************
********************************************************************************/   

/********************************************************************************
* Can you guess what this does? ;-)
********************************************************************************/      
function generateUniqueNodeId(to , from, id_array ) {
	
    	//Takes care of bad and null values
        var to = to || 0 , from = from || 10000;
	
	
	//Lets make sure I have a unique id for each node
	var unique_node_id, arr = id_array || unique_animation_ids;
	
	do{
	    unique_node_id = Math.floor(Math.random()*(to-from+1)+from);
	}while ( arr[unique_node_id])	;
	
	
	arr[unique_node_id] = unique_node_id;
	
       return unique_node_id;
}
/********************************************************************************
 *Lets break the connection.  Mainly used to refactor nodes and create dynamic
 *relationships
********************************************************************************/ 
function breakConnection(parent, child, bypass) {
	
	var breakParent, breakChild;
	
	if( !parent.getLineConnectedToNode[child.id]){
	  Log('Warning: Parent Node ' + parent.id +'  and Child Node '+
	      child.id +'are not connected ' +  'and dont need to be broken');
	  return;
	}
		
	//Ternary if else if to capture the true parent - child relationship
	//just in case the relationship has been switched at some point
	( child.animationChildren[parent.id] ==  parent ) ? (breakChild = parent, breakParent = child) :
	((child.animationParent == parent ) ? (breakChild = child, breakParent = parent): '' ) ;
	
	if (!breakParent || !breakChild) {
		bypass =  true;
	}
	
	//I want to bypass all of this if its not a parent child relationship
	if ( bypass == null || bypass == false) {	
	
		
	
		child.animationParent = null;
		child.relationToParent = '';
		var templine_node = parent.animationChildrenLine[child.id] ||
			child.animationChildrenLine[parent.id];
		templine_node.deleteLine({1: elements_in_canvas});
		
		
		parent.animationChildren[child.id] = null;
		
		
		if ( parent.rightChild == child) {
			parent.rightChild = null;
		}
		
		else if ( parent.leftChild == child) {
			parent.leftChild = null;
		}
		
		parent.numOfChildren--;
		
		Log("Breaking Parent - Child ( "+ breakParent.id + " ---> "
		    + breakChild.id + " ) relationship");
		
		
		delete parent.animationChildren[child.id] ;
	}	
		
	//If bypass is true	
	else if( bypass==true ){
		
		var templine = parent.getLineConnectedToNode[child.id];
		templine.deleteLine({1: elements_in_canvas, 2:lines_in_canvas});
		
		Log("Breaking Connection from Node "+ parent.id + " to Node "
			+ child.id );
		
	}
	
	delete parent.getLineConnectedToNode[child.id];
	delete child.getLineConnectedToNode[parent.id];
	
	/*
	Log("Breaking Connection between parent" + parent.value
	    + " child " + child.value);
	*/

		
}

/********************************************************************************
 *Set up the Parent Child relationship
********************************************************************************/
function modify_child_Parent_relationship() {
	
	var parent_index = 0, child_index = 1;
	
	

	parent = modify_Parent_Child_relationship_queue[parent_index].node,
	child  = modify_Parent_Child_relationship_queue[child_index].node;
	
	//If I get here no matter what I have to clear the queue
	modify_Parent_Child_relationship_queue.length = 0;
	
	if ( parent === child ) {
		//If parent is child i'll delete the earliest clicked element
		//modify_Parent_Child_relationship_queue.splice(0);
		Log('Warning: Node ' + parent.id + ' cannot be a parent or child of itself');
		//modify_Parent_Child_relationship_queue.length = 0;
		return;
		
	}
	
	
	//If you clicked on the two nodes and they are already
	//parent child but in the reverse order that you clicked
	//them break them up
	if ( child.animationChildren[parent.id] ==  parent ) {
		
		breakConnection(child, parent);	
		/*Log("Breaking Parent - Child ( "+ parent.id + " ---> "
		    + child.id + " ) relationship");	*/
		return; 
	}
	
	//If they already parent child then break the relationship
	if (child.animationParent == parent ) {
		breakConnection(parent, child);	
		/*Log("Breaking Parent - Child ( "+ parent.id + " ---> "
		    + child.id + " ) relationship");*/
		   
		return; 
	}
		
	//If child already has parent... See yaaaa
	if( (child.animationParent &&  child.animationParent != parent && max_number_of_parents<=1)){
		Log('Warning: No node including Node ' + child.id +
		    ' can have  more than one parent');
		return;	
	}
	
	if( Object.keys(parent.animationChildren).length 
		>= max_number_of_children && parent.animationChildren[child.id]!=child  ){
		Log('Warning: No node including Node ' + parent.id +
		    ' can have  more than '+ max_number_of_children + ' child(ren)');
			return;
		
		}
		
	
	if (  parent.getLineConnectedToNode[child.id] ||
	      child.getLineConnectedToNode[parent.id]) {
		
		breakConnection( parent, child, true);
		//Lets disconnect them if theyre not parent-child
		
		    
		Log("Breaking Connection from Node "+ parent.id + " to Node "
			+ child.id );
		    
		    return;
	}	
		
	createParent_Child_Relationship(parent, child);    
	    
	
}

/********************************************************************************
 *Creating parent child relationship based on maximum number of children 
 *left child, right child etc
********************************************************************************/
function createParent_Child_Relationship(parent, child, appendOrder) {
	
	if (max_number_of_parents == 1 && child.animationParent	) {
			Log("Error: Node " + child.value +
			    " already has parent " + child.animationParent.value);
			
			return;
	}
	
	if (parent == child) {
		Log("Warning: Child and Parent Node w/ value " + child.value +
		  " are the same and cant be connected ");
			
			return;
	}
	
	
	var parent_text = "", child_text = "";
	
	//Set the left child and the right child
	//Have this show "P" for parent & "C" for child
	if (ordered_children ) {
		
		//Dealing with a Linked List Here
		if (max_number_of_children == 1) {
			
			if ( parent.rightChild ) {
			    Log('Error: Max Number of Children is 1 and Node ' + parent.id + 
			    ' already has Child Node ' + parent.rightChild.id);
				
			    return;
			}
			
			parent.rightChild  = child;
			child.relationToParent = 'right';
			child_text = "C";
			
		}
		
		//Childs value is greater than parent so its a right Child
		else if( child.value > parent.value && !parent.rightChild  ){
			parent.rightChild  = child;
			child.relationToParent = 'right';
			child_text = "RC";
			
			
		}
		
		//Already has a right child so we CANNOT add it
		else if( child.value > parent.value && parent.rightChild ){
			Log('Error: Cannot add child Node ' + child.id + ' to parent Node '
			    + parent.id + ' because ' + parent.id +
			    ' already has right child Node ' + parent.rightChild.id);
			return;
		}
		
		//
		else if( child.value < parent.value && !parent.leftChild  ){
			parent.leftChild  = child;
			child.relationToParent = 'left';
			child_text = "LC";
			
		}
		
		else if( child.value < parent.value && parent.leftChild ){
			Log('Error: Cannot add child Node ' + child.id + ' to parent Node '
			    + parent.id + ' because ' + parent.id +
			    ' already has left child Node ' + parent.leftChild.id);
			return;
		}
		
		//If the program hasnt returned we know its a parent-child relationship
		parent_text ="P";
		
				
		//Only want this here for  Binary Trees
		//TODO:Fix this because your non ordered children are messed up
		
		//Performed all the checks so now make them related
		child.animationParent = parent;
		 
		parent.animationChildren[child.id] = child;
		parent.numOfChildren++;
		
		Log("Creating Parent - Child ( "+ parent.id + " ---> "
			+ child.id + " ) relationship");
		
	}
	
	//Used for binomial trees
	else if ( left_to_right_children ) {
		
		if (max_number_of_children <= 2 ) {
			
			if ( parent.leftChild == null  ) {
				parent.leftChild = child;
				child.relationToParent = 'left';
				child_text = "LC";
			}
			
			else if ( parent.rightChild == null  ) {
				parent.rightChild = child;
				child.relationToParent = 'right';
				child_text = "RC";
			}
			
			else{
				throw new Error("Parent " + parent.value + "Parentrighchild " + parent.rightChild.value
				    + "Parentleftchild " + parent.leftChild.value + "Child " + child.value +
				    "Somethings wrong in binary heap Leon check your code");

				
				return;
			}	
		
		}
		
		//If the program hasnt returned we know its a parent-child relationship
		parent_text ="P";
		child_text = child_text || "C";
				
		//Only want this here for  Binary Trees
		//TODO:Fix this because your non ordered children are messed up
		
		//Performed all the checks so now make them related
		child.animationParent = parent;
		 
		parent.animationChildren[child.id] = child;
		parent.numOfChildren++;
		
		Log("Creating Parent - Child ( "+ parent.id + " ---> "
			+ child.id + " ) relationship");
		
	}
	
	
	//Lets add some text so the user knows whats going on
	parent_text = new createjs.Text(parent_text, "15px Arial", "#ff7700");
	child_text = new createjs.Text(child_text, "15px Arial", "#ff7700");
	
	//Do I want to show the line value? Lets see...
	var show_line_value = ( ['dijkstra','bellman-ford','mst'].indexOf(algorithm_method)>-1  )
					? true : false ;
	
	
	//Lets create the line object and information
	line_node = new createjs.Line({'parent': parent, 
		'child' : child, 'algorithm': algorithm_method, 
		'all_text':  {'parent_text' : parent_text, 
		'child_text' : child_text }, 'line_values': line_values,
		'show_line_value': show_line_value});
	
	var line_self = line_node;
	line_node.addEventListener( "dblclick", function(evt) {
		$( ".dialog" ).dialog( "open" );
		$('input#line_value').val(line_self.value);
		changing_line_value_node = line_self ;
		
	});	
	
	
	parent.animationChildrenLine[child.id] =line_node;
	
	//Im connected to this node by this Line
	child.connectedByLine[line_node.id] = parent;
	parent.connectedByLine[line_node.id] = child;
	
	
	parent.getLineConnectedToNode[child.id] =  line_node;
	child.getLineConnectedToNode[parent.id] =  line_node;
        
        elements_in_canvas[ line_node.id ] = line_node;
	lines_in_canvas[ line_node.id ] = line_node;
	
	line_node.inArrays.push( elements_in_canvas , lines_in_canvas);
        
        stage.addChild(line_node);
        stage.update();	
}
/********************************************************************************
 *Utility function for Logging so I can see the message and the datatype
 *at the same time.
********************************************************************************/
function Log(/* arguments */) {
	$.each(arguments, function(index, log_message){	
		console.log( log_message );
		
		$('#messages').append(log_message + '\n\n ');
	})
	
	
  var canvas_console = $('#messages');
    canvas_console.scrollTop(
        canvas_console[0].scrollHeight - canvas_console.height()
    );
    
}
/********************************************************************************
 * Delete Node from Canvas
********************************************************************************/
function deleteNode( node ) {
	
	Log("Deleting Node " + node.id);
	
	elements_in_canvas[node.id] = null;
	nodes_in_canvas_by_id[node.id] = null;
	nodes_in_canvas.splice( nodes_in_canvas.indexOf( node ), 1 );
	
	if (node.animationParent) {
	    node.animationParent.animationChildren[node.id] = null;
	}
	
	node.deleteNode();
	
}

/********************************************************************************
 * Converts the canvas to a PNG Image
********************************************************************************/
function convertCanvasToImage(canvas) {
	var image = new Image();
	image.src = canvas.toDataURL("image/png");
	return image;
}


/********************************************************************************
 *Gets the sign of a number
********************************************************************************/
function sign(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; }

