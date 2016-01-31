var BubbleChart = function(data, categoricalParams, continousParams, circleClickCallback){
	
	//data needed for the plot

	this.data = data;
	this.categoricalParams = categoricalParams;
	this.continousParams = continousParams;

	//constant sizing parameters
	this.svgHeight = 550;
	this.svgWidth = 1000;
	this.maxCircleRadius = 20;

	this.nodes = [];
	this.circleClickCallback = circleClickCallback;
};

//make basic SVG and plot group
BubbleChart.prototype.makeSVG = function(){
	this.svg = d3.select('#bubbleChartDiv')
			.append('svg')
			.attr('height', this.svgHeight)
			.attr('width', this.svgWidth);

	this.plotGroup = this.svg.append('g');
};

//makes circles using the node data given
BubbleChart.prototype.makeCircles = function(){
	
	var _this = this;
	

	this.bubbles = this.plotGroup.selectAll('circle')
			.data(this.nodes)
			.enter()
			.append('circle')
			.attr('r', function(d,i){
				return d.radius; 
			})	
			.attr('cx', function(d){
				return d.x;
			})
			.attr('cy', function(d){
				return d.y;
			}).classed('bubble-circle', true);
};

BubbleChart.prototype.makeContinousLabels = function(){

	var _this = this;

	var paramRange = this.continousParams[this.groupParam]

	var color = d3.scale.linear()
			.domain(paramRange)
    			.range(['orange', 'blue'])
    			.interpolate(d3.interpolateRgb);

	var scale = d3.scale.linear().domain(paramRange)
			.range([50, _this.svgHeight-50]);	
	
	var gradient = this.plotGroup.append('defs')
			.append('linearGradient')
			.attr('id', 'contGrad')
			.attr('x1', '0%')
			.attr('x2', '0%')
			.attr('y1', '0%')
			.attr('y2', '100%');

	gradient.append('stop')
    		.attr('offset', '0%')
    		.attr('stop-color', 'orange')
    		.attr('stop-opacity', 1);
	
	gradient.append('stop')
    		.attr('offset', '100%')
    		.attr('stop-color', 'blue')
    		.attr('stop-opacity', 1);


	var rect = this.plotGroup.append('rect')
			.attr('x', 10)
			.attr('y', scale.range()[0])
			.attr('width', 20)
			.attr('height', scale.range()[1]-scale.range()[0])
			.style('fill', 'url(#contGrad)');
	
	this.plotGroup.append('text')
			.text(paramRange[0])
			.attr('x', 35)
			.attr('y', scale(paramRange[0]));
 	this.plotGroup.append('text')
			.text(paramRange[1])
			.attr('x', 35)
			.attr('y', scale(paramRange[1]));
 

	this.nodes.forEach(function(d){
		d.target = scale(parseFloat(d.data[_this.groupParam]));
		d.x = _this.svgWidth*Math.random();
	});


	this.bubbles.style('fill', function(d, i){
		//fill based category
		return color(d.data[_this.groupParam]);
	});

};

//set up force layout for continous parameters
BubbleChart.prototype.forceContinous = function(){
	
	var _this = this;

	//set up force with no gravity
	//but with some positive charge so particles move closer
	this.force = d3.layout.force()
			.gravity(0)
			.charge(1)
			.nodes(this.nodes)
			.size(this.svgHeight, this.svgWidth);

	
	//tick events update position of nodes based on force
	this.force.on('tick', function(event){
		var k = event.alpha* 0.2;

		//Need to move only y values based on target values
		_this.nodes.forEach(function(d){
			d.y = d.y -(d.y - d.target)*k;
		});	

	var tree = d3.geom.quadtree(_this.nodes);
		//the points may overlap on each other
		//use quad tree to detect neighbors and calculate position values
    		for(var i=0; i<_this.nodes.length;i++){
			tree.visit(_this.detectOverlap(i));
		}
		
		//use the updated d.x and d.y values given by tree visit and update it here
		_this.bubbles
			.attr('cx', function(d) { 
				return d.x; 
			})
			.attr('cy', function(d){
				return d.y;
			});	
				
	});
	this.force.start();		

};

//setup force layout needed for categorical parameters
BubbleChart.prototype.forceCategorical = function(){
	
	var _this = this;

	//set no gravity (pulls to center of svg), set some charge value
	this.force = d3.layout.force()
			.gravity(0)
			.charge(0)
			.nodes(this.nodes)
			.size(this.svgHeight, this.svgWidth);

		
	//tick events update position of nodes based on force
	this.force.on('tick', function(event){
		//speed of attraction/repulsion
		var k = event.alpha* 0.2;
		
		_this.nodes.forEach(function(d){
			var type = d.data[_this.groupParam];
			var node = _this.fixedNodes[_this.categories.indexOf(type)];
			
			//move the points towards the category "fixedNode"
			d.x = d.x + (node.x - d.x)*k;
			d.y = d.y + (node.y - d.y)*k;
		});	
		
		//when points all move towards one point there is overlap
		//use quad tree to detect neighbors and move them accordingly
		var tree = d3.geom.quadtree(_this.nodes);
    		for(var i=0; i< _this.nodes.length;i++){
			//visit each node
			tree.visit(_this.detectOverlap(i));
		}

		//quad tree visit just calculates the updated positions
		//do the actual moving here
		_this.bubbles
			.attr("transform", function(d) { 
				return "translate(" + d.x + "," + d.y + ")"; 
			})	
				
	});
			

	this.force.start();
};


//Detecting overlap of nodes
BubbleChart.prototype.detectOverlap = function(nodeNum){
	var _this = this;
	var r = _this.score[nodeNum]*_this.maxCircleRadius;
	var thisNode = _this.nodes[nodeNum];
	bound_x1 = thisNode.x - r;
	bound_x2 = thisNode.x + r;
	bound_y1 = thisNode.y - r;
	bound_y2 = thisNode.y + r;
	
	var scan = function(node, x1, y1, x2, y2){
		if(node.point && node.point !== thisNode){
			//min distance needed between centers is the sum of radii
			var totrad = thisNode.radius + node.point.radius;  

			var xdist = thisNode.x - node.point.x;
			var ydist = thisNode.y - node.point.y;
			//actual distance between centers
			var dist = Math.sqrt(Math.pow(xdist, 2)+Math.pow(ydist, 2));

			//adjust radius if they are overlapping
			if(dist < totrad){
				//determine the ratio by which it needs to be moved	
				theta = (dist - totrad)/dist* 0.5;
				xdist = xdist*theta;
				ydist = ydist*theta;
				node.point.x += xdist;
				node.point.y += ydist;
				thisNode.x -= xdist;
				thisNode.y -= ydist;
			}
			
		}
		return x1 > bound_x2 || x2 < bound_x1 || y1 > bound_y2 || y2 < bound_y1;
	};

	return scan;
};

//make labels to indicate categories
BubbleChart.prototype.makeCategoricalLabels = function(){
	var _this = this;
	
	//put colors for circles based on categories
	var colors = d3.scale.category20();
	this.bubbles.style('fill', function(d, i){
				//fill based category
				return colors(_this.categories.indexOf(
						d.data[_this.groupParam]));
			});


	this.fixedNodes = d3.range(_this.categories.length).map(function(d, i){ 
		return {
			x: _this.svgHeight*i*Math.pow(-1, i)/8, 
	    		y: _this.svgHeight*(i%2+1)*Math.pow(-1, i)/8, 
			fixed: true, category: _this.categories[i]};
	}); 

	this.plotGroup.selectAll('text')
		.data(_this.categories)
		.enter()
		.append('text')
		.text(function(d){
			return d;
		})
		.attr('x', function(d, i){
			return _this.svgWidth/2 + _this.fixedNodes[i].x;
		})
		.attr('y', function(d, i){
			return _this.svgHeight/2 + _this.fixedNodes[i].y;
		})
		.style('font-size', '16pt').style('text-anchor', 'middle');

};



BubbleChart.prototype.eventHandler = function(){
	
	var _this = this;	
	this.bubbles.on('mouseover', function(d){
		d3.select(this).style('stroke', ' black')
			.style('stroke-width', '2px');
	});

	
	this.bubbles.on('mouseout', function(d){
		d3.select(this).style('stroke', 'none');
	});
	
	this.bubbles.on('click', function(d){
		
		_this.circleClickCallback(d.data);
	
	});


};


BubbleChart.prototype.makeChart = function(param){
	var _this = this;
	d3.selectAll('svg').remove();
	this.force = null;
	//TODO: give actual score values
	this.score = d3.range(206).map(function(){return Math.random();});
	
	//default group by bodystyle
	this.groupParam = param;


	this.makeSVG();

	//create nodes for each data point, let everything start from center of SVG
	this.data.forEach(function(d, i){

		var shown = true;
		for(var key in _this.continousParams){
			if(d[key] === '' || (_this.continousParams[key] 
				&& (_this.continousParams[key][0] >= d[key]
				|| _this.continousParams[key][1] <= d[key]))){
				
					shown = false;
					break;
			}

		}


		if(d[_this.groupParam] !== null && d[_this.groupParam] !== '' && shown){
			_this.nodes.push({
				x:_this.svgWidth/2, //*Math.random(), 
				y:_this.svgHeight/2, //*Math.random(),
				data: d, radius: (Math.pow(_this.score[i]*100, 2)
							*_this.maxCircleRadius)/10000
			});
	
		}
	});

	//move cateogories inside the if	
	this.makeCircles();

	if(Object.keys(this.categoricalParams).indexOf(this.groupParam) !== -1){

		this.categories = this.categoricalParams[this.groupParam]; 
		this.makeCategoricalLabels();	
		this.forceCategorical();
	}
	else{
		this.makeContinousLabels();
		this.forceContinous();
	}
	this.eventHandler();
};



