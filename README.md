# Car Buying Helper

Webpage link : http://error-magnet.github.io/car_buying_dashboard/

This is a webpage made to assist people trying to buy a car. The data used for this exercise is taken from the UCI ML Repository's Automobile dataset.
https://archive.ics.uci.edu/ml/datasets/Automobile

The dashboard has the following sections:

### Preferences section
A number of simple questions are asked to the user. The user is allowed set priority (High, Low, Don't Care) to these topics. The cars are rated based on these priorities and the rating is reflected in other parts of the dashboard. The questions showed are just sample questions, these should be based on what people usually look in a car.

For example, if the user sets High priority for the "City car" question, we can say the user wants high city mpg, and a compact car with respects to the body measurements. Based on this, a simple weighted sum rating can be done to see which car suits the user the best. 


**TODO**: The rating algorithm has not been implemented. Random values are assigned currently in other parts of the dashboard, where such a rating is necessary.


### Tiles section
All the cars are listed here with an image, name and price. Users can click individual car tiles to see details regarding the car, and this details popup allows the user to add the vehicle to the "Shortlist".

**TODO**: Add sorting options to the tiles list - based on name, rating and other parameters. 

### Bubble Chart section
A Bubble Chart is shown to help the user see what the overall "design space" looks like.

Each circle shown in the Bubble Chart represents a car - the user is able to click on the circle to see details regarding the car (and add to shortlist). The size of the circle is dependent on the rating of the car based on the user's preferences. A bigger circle indicates a car which is better for the user - I have made the score-circle radius relationship non-linear so the bigger circles are highlighted more.

A dropdown is provided to for the user to select the parameter of interest. 

If a **categorical** parameter is selected, the circles(cars) are colored and visually grouped based on the value of the parameter selected. This way, the user can easy find the answer to the question - "Which is the hatchback that best suits my needs?"

If a **continous** parameter is selected, the circles(cars) are arranged on a scale based on the parameter minimum and maximum value along the y-axis. This allows the user to see where the majority of the cars lie for this parameter, and select the best car available for this parameter visually.

**TODO**: The positioning of the categorical parameters needs some tweaking, sometimes they are offscreen.
**TODO**: There are some circles which get stuck in the middle of the wrong categories, or stuck in the center of the screen, not moving at all. Need to investigate why this happens.

### Shortlist table section (unimplemented)
A simple table is shown with all the details regarding the shortlisted vehicles.

**TODO**: the table is not actually implemented. A simple image is shown for now.

**TODO**: allow users to compare cars - for example, choose car A as a baseline, and see how car B better/worse for each criteria.

### Filters section
This section contains filters for each of the parameters available in the dataset(current implementation shows only continous parameters). Using this, the user can select ranges/categories which he/she does not wish to see. 

When the filters are changed by the user, the Tiles section and the Bubble Chart are updated to show only the cars satisfying the filter conditions.

The rating of cars done should be done only on cars which are not filtered out.

**TODO**: currently there are only filters for the continous parameters. Categorical parameters should be added - where users can select or unselect checkboxes for each category. 

**TODO**: only categories useful for the user should be shown prominently. Parameters such as bore, stroke etc., which the user may hardly be interested in should be put in an "Others" category, so the UI does not look cluttered.

### Future Work Suggestions
- Search button to search car by name
- "Buy" button
- Check local availability from dealers in the area
- Insurance estimates

### Libraries used
- <a href="http://d3js.org">d3.js</a> - For data reading and manipulation, and for the Bubble Chart.
- <a href="http://polymer-project.org">Polymer</a> - For the cards in the Tiles section, Car details popup. I would have used it for the filter sliders, but there seems to be no good implementation of a range slider in Polyer 1.0, so ended using jQuery UI :)
- <a href="http://jquery.com">jQuery</a>, <a href="http://jqueryui.com">jQuery UI</a> - For the filter range sliders



