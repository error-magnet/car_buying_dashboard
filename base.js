

/* Load Data from given CSV*/
d3.csv('Automobile.csv', function(data){

	//https://archive.ics.uci.edu/ml/datasets/Automobile
	//has all the meta data, use that and hard code meta data
	//rather than parsing data everytime
	var categoricalParams = {
		'symboling' : ['-3', '-2', '-1', '0', '1', '2', '3'],
		'make': ['alfa-romero', 'audi', 'bmw', 'chevrolet', 'dodge',
			'honda', 'isuzu',  'jaguar', 'mazda', 'mercedes-benz', 'mercury', 
			'mitsubishi', 'nissan', 'peugot', 'plymouth', 'porsche', 
			'renault', 'saab', 'subaru', 'toyota', 'volkswagen', 'volvo'],
		'fueltype': ['gas','diesel'],
		'aspiration': ['std', 'turbo'],
		'numofdoors': ['4', '2'],
		'bodystyle': ['hardtop', 'wagon', 'sedan', 'hatchback', 'convertible'],
		'drivewheels': ['4wd', 'fwd', 'rwd'],
		'enginelocation': ['front', 'rear'],
		'enginetype': ['dohc', 'dohcv', 'l', 'ohc', 'ohcf', 'ohcv', 'rotor'],
		'numofcylinders' : ['2', '3', '4', '5', '6', '7', '8', '12'],
		'fuelsystem': ['1bbl', '2bbl', '4bbl', 'idi', 
				'mfi', 'mpfi', 'spdi', 'spfi']
	};

	var continousParams = {
		'normalised': [65, 256],
		'wheelbase': [86.6, 120.9],
		'length': [141.1, 208.1],
		'width': [60.3, 72.3],
		'height': [47.8, 59.8],
		'curbweight': [1488, 4066],
		'enginesize': [61, 326],
		'bore': [2.54, 3.94],
		'stroke': [2.07, 4.17],
		'compressionratio': [7,23],
		'horsepower': [48, 288],
		'peakrpm': [4150, 6600],
		'citympg': [13, 49],
		'highwaympg': [16, 54],
		'price': [5118, 45400]
	};
	

	//TODO: search button?
	//show a buy button
	//build each section in the page
	makePreferencesSection();
	makeFilterSection(continousParams, categoricalParams, data);
	makeTileSection(data);
	makeChartSection(continousParams, categoricalParams, data);
	
});

/*==================================================================================
 * Set up the pop up to show full car details here
 * this is called when clicked on a car tile or the car circle in the bubble chart
 * ===============================================================================*/
var showCarDataPopup = function(carData){
	var dialog = document.querySelector('paper-dialog');
	var heading = dialog.querySelector('h2');
	var content = dialog.querySelector('paper-dialog-scrollable');


	var contentText = '';
	heading.textContent = carData.make + ' ' + carData.bodystyle + ' details';

	content.innerHTML = '';
	
	//use a dummy car image
	var image = document.createElement('img');
	image.src = 'car.jpeg';
		
	content.appendChild(image);
		
	content.innerHTML += '<br>';

	for(var key in carData){
			
		if(key === 'make' || key === 'bodystyle') continue;
		contentText  =  contentText + (key+ ' : ' + carData[key] + '<br>');
	}
		
	content.innerHTML += contentText;
	dialog.toggle();

};

/*===============================================================================
 * preferences section is where user gives high/low/dont care ratings
 * based on this we try to give a score to a car
 * TODO: scoring is not implemented, the preference drop downs are just dummy buttons
================================================================================*/
var makePreferencesSection = function(){
	
	var prefDiv = document.getElementById('prefOptions');

	var options = ['Low Price', 'Is a city car', 'High Performance', 'Lots of space',
			'Low Maintainance Cost'];

	options.forEach(function(d){
		
		var pref = document.createElement('div');
		var prefDropdown = document.createElement('select');
		prefDropdown.innerHTML = "<option>Don't Care</option><option selected>Low</option>"+
						"<option>High</option>";
		
		pref.textContent = d;
		pref.appendChild(prefDropdown);
		prefDiv.appendChild(pref);

	});


};


/*===============================================================================
 * This creates the chart section, with the dropdown with each parameter option
 * and the bubble chart. Bubble chart groups cars either based on the category chosen
 * or shows them on a scale of the continous value chosen.
 * The size of the circle is directly proportional to the score of the car based
 * on preferences - bigger the circle, the car better matches users preferences
 * TODO: make categorical params position correctly - currently offcenter
 * TODO: fine tune parameters to avoid circles being stuck in the middle of wrong groups
 * TODO: make circle-score relationship non linear - highlight higher scores more
 * ===============================================================================*/
var makeChartSection = function(continousParams, categoricalParams, data){
	var dropdown = document.getElementById('bubbleDropdown');
	var defaultParam = 'bodystyle';

	Object.keys(data[0]).forEach(function(p, i){
		var op = document.createElement('option');
		op.value = i;
		op.textContent = p;
		if(p === defaultParam){
			op.selected = true;
		}
		dropdown.appendChild(op);
	});

		
	var bubble = new BubbleChart(data, categoricalParams, continousParams, showCarDataPopup);
	bubble.makeChart(defaultParam);
	dropdown.onchange = function(d){
		Array.prototype.slice.call(this.children).forEach(function(op){
			if(op.selected){

				var bubble = new BubbleChart(data, categoricalParams, continousParams,
					showCarDataPopup);
				bubble.makeChart(op.textContent);
			}
		});
	};
};


/*============================================================================
 * Creates a tile for each car in the tile section.
 * TODO: Sort tiles based on scores/names etc.
 * ============================================================================*/
var makeTileSection = function(data, continousParams){
	
	var tilesContainer = document.getElementById('carTilesContainer');

	tilesContainer.innerHTML = '';	
		
	for(i=0; i<data.length; i++){
		
		var shown = true;
		if(continousParams){
			for(var key in continousParams){
				if(data[i][key] <= continousParams[key][0] 
					|| data[i][key] >= continousParams[key][1]){
					shown = false;
				}
			}


		}
		if(shown){
		
			tilesContainer.appendChild(makeTile(data[i]));
		}
		
	}


};

/*==========================================================================
 * Creates filters for each parameter, which can be used to by the user to not
 * see cars of range/categories not desired by the user
 * TODO: Checkbox filter for categorical params
 * TODO: hookup filter to actual data
 * =======================================================================*/

var makeFilterSection = function(continousParams, categoricalParams, data){

	var filtersDiv = $('#filtersDiv');
	for(var key in continousParams){
		
		var sliderContainer = $('<div id="'+key+
				'SliderContainer" param='+key+' class="slider-container"></div>');

		var nameDiv = $('<div id="'+key+'Name" ></div>').appendTo(sliderContainer);
  
		var textDiv = $('<div id="'+key+'Text" class="slider-text"></div>')
			.appendTo(sliderContainer);

		var sliderDiv = $('<div id="'+key+'Slider"></div>').appendTo(sliderContainer);
    		
		$(sliderDiv).slider({
      			range: true,
     			min: continousParams[key][0],
      			max: continousParams[key][1],
      			values: continousParams[key],
      			slide: function( event, ui ) {
      				$(this.parentElement).children('.slider-text')
					.text($(this).slider( 'values', 0 ) +
      			' - ' + $(this).slider( 'values', 1 ));
			},
			change: function(event, ui){
				var param = $(this.parentElement).attr('param');
				continousParams[param] = [$(this).slider( 'values', 0 ) ,
					$(this).slider( 'values', 1 )];
			
				
				makeTileSection(data, continousParams);

				makeChartSection(continousParams, categoricalParams, data);
				
			}

    		});
		
		nameDiv.text(key + ' : ');	
		textDiv.text(sliderDiv.slider( 'values', 0 ) +
      			' - ' + sliderDiv.slider( 'values', 1 ) )
	
   		filtersDiv.append(sliderContainer);
	}

};

/*============================================================================
 * Make a tile showing a card for each car with a summary - 
 * - name, type, price and a thumbnail image
 * User can click to see full details about the car
 * =========================================================================*/
var makeTile = function(carData){
	var tile = document.createElement('div');
	tile.classList.add('tile', 'card-content');
	var image = document.createElement('img');
	image.src = 'car.jpeg';
	tile.appendChild(image);

	var textName = document.createElement('span');
	textName.textContent = carData.make + ' ' + carData.bodystyle;
       	var textPrice = document.createElement('span');	
	textPrice.textContent = 'Price: ' + carData.price;
	tile.appendChild(textName);	
	tile.appendChild(textPrice);	


	var card = document.createElement('paper-card');
	card.appendChild(tile);
	
	tile.onclick = function(){
		showCarDataPopup(carData); 
	};

	return card;

};












