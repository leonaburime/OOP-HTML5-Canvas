<!DOCTYPE html>
<html>
  
   
  <head>
    <title>OOP Canvas Tutorials</title>
    
    
    <script src="http://code.jquery.com/jquery-latest.js"></script>
    <script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
    
    
    <link rel="stylesheet" type="text/css"
	  href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css"/>
     
       
    <!-- Bootstrap -->
    <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.min.css" rel="stylesheet">
    <script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
    
    
    <script src="http://code.createjs.com/createjs-2013.02.12.min.js"></script>
    <script src="js/ColorFilter.js"></script>
    
    
    <!--CDN link for the latest TweenMax-->
    <script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
    
    <!--CreateJS doesnt have a line class so I had to make my own.
    Are you f'ing kidding me?! A line is the most basic thing!! -->
    <script src="js/Classes.js"></script>
    <script src="js/algorithms.js"></script>	
    <script src="js/setup.js"></script>
    
  </head>
  
  
  
  
  <body>
    
    
    
    <div class="navbar  navbar-inverse navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
            <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </a>
            
            <div class="nav-collapse collapse">
                <ul class="nav">
                    <li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown">
                    	Animation<b class="caret"></b></a>								
                        <ul class="dropdown-menu">
                            <li class="active"><a href="http://canvas.civinia.com">Canvas</a></li>
                            <li><a href="http://flash.civinia.com">Flash</a></li>
                            <li><a href="http://webgl.civinia.com">WebGL</a></li>
                            
                        </ul>
            		</li>
                    
                    <li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="http://cms.civinia.com">CMS<b class="caret"></b></a>								
                        <ul class="dropdown-menu">
                            <li><a href="http://drupal7.civinia.com">Drupal 7</a></li>
                            <li><a href="http://joomla.civinia.com">Joomla</a></li>
                            <li><a href="http://magento.civinia.com">Magento</a></li>
                            <li><a href="http://wordpress.civinia.com">Wordpress</a></li>
                        </ul>
            		</li>
                    
                    
            
                    <li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown">
                            Frameworks<b class="caret"></b></a>								
                        <ul class="dropdown-menu">
                           
                            <li><a href="http://django.civinia.com">Django</a></li>
                            <li><a href="http://rails.civinia.com">Ruby on Rails</a></li>
                            <li><a href="http://zend.civinia.com">Zend</a></li>
                            
                        </ul>
                    </li>
                    
		    
                    <li><a href="http://jquery.civinia.com">jQuery</a></li>
                    <li><a href="http://mobile.civinia.com">Mobile</a></li>  
                    
                    <li><a href="http://portfolio.civinia.com">Portfolio</a></li>
                                 
                    <li><a href="http://programs.civinia.com">Programming</a></li>        
                    <li><a href="http://themes.civinia.com">Themes</a></li>
                    
                    <li><a href="http://contactme.civinia.com">Contact Me</a></li>
                </ul>
            </div>
        </div>
      </div>
    </div>
    
    
    <h2>  Objected Oriented Interactive Animation   </h2>

    
    <style>
    
	    h2{
	      margin: 50px auto 25px  auto;
	      text-align: center;
        
        	}  
			
	    
	
	    canvas#animation{
	     
	      border-width: thin;
	      border-style:solid;
	      border-color:black;
			    
	      min-height: 500px;
	      
				    
	    }
				
	    ul.nav{
	      cursor: pointer;
					    
									    
				    
	    }
	    
	    div.main-page{	      
	      margin-top: 30px;
	    }
	    
	    div.btn-group{
	      margin-left: 0 !important;
	      
	    }
	    
	    textarea{
	      resize: horizontal;
	      width: 80%;
	    
	      
	    }
	    
	    textarea:hover{
	      resize: horizontal;  
	      cursor: default;
	    }
	    
	    .caption{
	      font-size: 12px;
	    }
	    
	    
	    #messages{
	      min-height: 200px;
	      border: 1px solid black;
	      margin-top: 5px;
	      
	    }
	    
	    
	    #options{
	      margin-bottom: 60px;
	      margin-left:  0;
	      
	    }
	    
	    #input{ width: 50%;
	      max-width: 300px;
	      margin-left: 10px;
	    }
	    
	    .inline{
	      display: inline;
	    }
	    
	    
	    input#start , input#finish{
	      width: 30%;
	      max-width: 100px;
	    }
	    
	    input.small{
	      
	      max-width: 100px;
	    }
	    
	    input#line_value{
	       max-width: 75px;
	       margin-right: 3px;
	    }
		
	    #options .btn-small{
		  letter-spacing: 1px;
	    }
	    
	    #options button{	      
	      margin: 5px 5px 5px 0;
	    }
	    
	    #user-interface{
	     
	      height: 100%;
	      
	    }
	    
	    .ui-dialog { width: 225px !important;} 
	    .ui-dialog-titlebar {display:none}
	    .ui-dialog-content {min-height: 10px !important}
	    
	    .draggable { min-width: 450px;  padding: 0.5em; }
        
	    .tab-pane{
	      min-height: 100px;
	    }
	    
	    .interact{
	      visibility: hidden;
	    }
	
	    .footer{
	      min-height: 300px;
		    }
		    
		    
	    canvas{
	      
	      -moz-user-select: none;
	      -khtml-user-select: none;
	      -webkit-user-select: none;
	      user-select: none;
	      
	    }
	    
	    
        </style>
        
      
          
    
    <div class="container">
      
      
	<div class="row-fluid"  >
	  
	  <div class="span6">  
	      <ul class="nav nav-pills span12 tabs " id="algorithm_options">                   
			  <li><a data-toggle="pill" href="#data_structures">Data Structures</a></li>
			  <li><a data-toggle="pill" href="#graphs">Node Connections</a></li>
			  <!--li><a data-toggle="pill" href="#heaps">Heaps</a></li-->		      
			  <li><a data-toggle="pill" href="#search">Search</a></li>
			  <li><a data-toggle="pill" href="#sort">Sort</a></li>                   
	      </ul>
	      
	     
              <div id="options" class="span12">
		
		<div class="tab-content">
		  
		  <div class="tab-pane ppDSO" id="data_structures" > 
		    <button id="linked_list" class="btn btn-info btn-small run_animation"> Linked List</button>
		    <button id="binary_search_tree" class="btn btn-info btn-small run_animation"> Binary Search Tree</button>
		    <!--button id="red_black_tree" class="btn btn-info btn-small run_animation"> Red Black Tree</button-->
		    <button id="avl_tree" class="btn btn-info btn-small run_animation"> AVL Tree</button>
		  </div> 
		
		  <div class="tab-pane" id="graphs">
		    <button id="adjacency_list" class="btn btn-info btn-small run_animation show_modal"> Adjacency List</button>
		    <button id="incidence_list" class="btn btn-info btn-small run_animation show_modal"> Incidence List</button>
		    <button id="adjacency_matrix" class="btn btn-info btn-small run_animation show_modal"> Adjacency Matrix</button>
		    <button id="incidence_matrix" class="btn btn-info btn-small run_animation show_modal"> Incidence Matrix</button>
		  </div>
		  
		  <div class="tab-pane ppDSO" id="heaps" >
		    <button id="binary_heap" class="btn btn-info btn-small run_animation heap"> Binary Heap</button>
		    <button id="binomial_heap" class="btn btn-info btn-small run_animation heap"> Binomial Heap</button>
		    
		    <button id="max-heapify" class="btn btn-success btn-small heapify"> Max-Heapify</button>
		    <button id="min-heapify" class="btn btn-success btn-small heapify"> Min-Heapify</button>
		  </div>
		  
		  <div class="tab-pane" id="search">
		    <button id="depth_first" class="btn btn-info btn-small run_animation"> Depth First</button>
		    <button id="breadth_first" class="btn btn-info btn-small run_animation"> Breadth First</button>
		    <button id="mst" class="btn btn-info btn-small run_animation"> Minimum Spanning Tree</button>
		    <button id="dijkstra" class="btn btn-info btn-small run_animation"> Dijkstra</button>
		    <button id="bellman-ford" class="btn btn-info btn-small run_animation"> Bellman-Ford</button>  
		  </div>
		  
		  <div class="tab-pane" id="sort">
		    <button id="bubble_sort" class="btn btn-info btn-small run_animation"> Bubble Sort</button>
		    <button id="insertion_sort" class="btn btn-info btn-small run_animation"> Insertion Sort</button>
		    <button id="merge_sort" class="btn btn-info btn-small run_animation"> Merge Sort</button>
		    <button id="quick_sort" class="btn btn-info btn-small run_animation"> Quick Sort</button>
		    <button id="radix_sort" class="btn btn-info btn-small run_animation"> Radix Sort</button>
		    <button id="selection_sort" class="btn btn-info btn-small run_animation"> Selection Sort</button>
		  </div> 
		  
		
		</div>
		
		  <div class="btn-group" style="margin-left:0">
		    <button id="populate" class="btn btn-primary btn-small interact"> Populate </button>
		    <button id="add_node" class="btn btn-primary btn-small interact  ">Add Random Node </button>
		  </div>
		  <div class="btn-group">
		    <button id="solve" class="btn btn-success btn-small interact  "> Solve </button>
		    <button id="output" class="btn btn-small btn-success interact">Show Results </button>
		    <a href="#modal_controls" role="button" class="btn btn-small btn-success interact" data-toggle="modal"> Toggle Controls</a>
		  </div>
		  <div class="btn-group ">
		    <button id="clear_clicks" class="btn btn-danger btn-small interact "> Clear Double Clicks</button>
		    <button id="clear_lines" class="btn btn-danger btn-small interact ">Clear All Lines </button>
		    <button id="clear" class="btn btn-danger btn-small interact ">Clear All </button>
		  </div>
		
		
		
		
		
	      </div>
	     
	  </div><!-- .span6 -->
	  
	  <div id="user-interface" class="span6" >
	    <div id="user_input"><span id="instructions">  Search for Number </span>
		<input id="input"> <br>
	    </div>
	    <textarea id="messages" disabled> </textarea>  
	  </div><!-- .span6 -->
	  
	  
	  
	    
	  <div class="span8">
	    <div id="slider"></div>
	  </div>
	  
	  <button id="play-button" class="span1 btn-warning btn-small "> <i class="icon-play icon-white"></i></button>
	  <button id="pause-button" class="span1 btn-warning btn-small "> <i class="icon-pause icon-white"></i></button>
	  <button id="stop-button" class="span1 btn-warning btn-small "> <i class="icon-stop icon-white"></i></button>
	  
	  
	</div>
       
        <div class="span8">
	    To connect two nodes simply double click on both of them. To disconnect
	    do the same.
	  </div>
	
	
	
    
      <div class="row-fluid main-page" style="margin-top: 30px;" >
      
        <div class="span12" >
          <canvas width="900" height="900" id="animation"> </canvas>
        </div>
	
	<div class="span12">
	  
           
	   <div class="dialog line-value">
	    <input id="line_value"><button class="btn btn-small btn-primary change-line-value">Line Value</button>
	   </div><!-- Dialog-->
	   
	  <!-- Modal -->
	  <div id="modal_controls" class="modal hide fade draggable" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	    <div class="modal-header">
	      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	      <h3 id="myModalLabel">Here's What Happened</h3>
	    </div>
	    
	    
	    
	    
	    
	    
	    
	    <div class="modal-body">
	      
	      
	      <ul class="nav nav-tabs" id="topTabs">
		<li class="active"><a data-toggle="tab" href="#animation_results">Animation Results</a></li>
		<li><a data-toggle="tab" href="#instant_replay">Instant Replay</a></li>
		<li><a data-toggle="tab" href="#generate_graphs">Graphs</a></li>
	      </ul>
	       
	       
	      <div class="tab-content">
		<div class="tab-pane  active" id="animation_results">Not seeing sh!@</div>
		<div class="tab-pane" id="generate_graphs">
		  
		      <ul class="nav nav-pills span12" id="myTab">
			<li class="active"><a data-toggle="tab" href="#view_adjacency_list">Adjacency List</a></li>
			<li><a data-toggle="tab" href="#view_adjacency_matrix">Adjancency Matrix</a></li>
			<li><a data-toggle="tab" href="#view_incidence_list">Incidence List</a></li>
			<li><a data-toggle="tab" href="#view_incidence_matrix">Incidence Matrix</a></li>
		      </ul>
		      
		      <button id="refresh_graphs" style="margin-bottom:20px" class="btn btn-primary btn-small" >Refresh Graphs </button>
		       
		      <div class="tab-content">
			<div class="tab-pane active" id="view_adjacency_list"></div>
			<div class="tab-pane" id="view_adjacency_matrix"></div>
			<div class="tab-pane" id="view_incidence_list"></div>
			<div class="tab-pane" id="view_incidence_matrix"></div>
		      </div>
		      
		      
		  
		  
		  
		  
		  
		</div>
		
		
		<div class="tab-pane" id="instant_replay">Hehe</div>
		
		
		
		
	      </div>
	      
	      
	      <!--p>One fine body…</p-->
	    </div>
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    <div class="modal-footer">
	      <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
	    </div>
	  </div>
	  
	  
	  
	</div><!-- .span12 -->     
      </div><!-- .row-fluid -->
      
    </div><!-- .container -->

  

 
    
    <div class="footer" > </div>
    
    
    

  </body>
</html>
