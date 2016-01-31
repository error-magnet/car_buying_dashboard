# Car Buying Helper

This is a webpage made to assist people trying to buy cars. The data used for this exercise is taken from the UCI ML Repository's Automobile dataset.
https://archive.ics.uci.edu/ml/datasets/Automobile

The dashboard has the following sections:

### Preferences section
A number of simple questions are asked to the user. The user is allowed set priority (High, Low, Don't Care) to these topics. The cars are rated based on these priorities and shown in other parts of the dashboard. For example, if the user gives a High priority for the car the be a city car, we can say the user wants high city mpg, and a compact car with respects to the measurements. Based on this a simple weight sum scoring can be done to see which car suits the user the best. The questions should be based on what users usually look for in a car.

TODO: The scoring algorithm has not been implemented. Random values are assigned currently in other parts of the dashboard, where scoring is necessary.


### Tiles section
All the cars are listed here with an image, name and price. Users can click to see details regarding the car, and this details popup allows the user to add the vehicle to the "Shortlist".

TODO: Add sorting options to the tiles list - based on name, rating and other parameters.

### Bubble Chart section
A Bubble Chart is shown to help the user see what the overall "design space" looks like.
Each circle shown in the Bubble Chart represents a car - the user is able to click on the circle to see details regarding the car (and add to shortlist). The size of the circle is dependent on the rating of the car based on the user's preferences. The bigger circle indicates cars which are better for the user - I have made the score-circle radius relationship non-linear so the bigger circles are highlighted more.

A dropdown is provided to for the user to select the parameter of interest. 
If a categorical parameter is selected, the circles(cars) are colored and visually grouped based on the value of the parameter selected. This way, the user can easy find the answer to the question - "Which is the hatchback which best suits my needs?"
If a continous parameter is selected, the circles(cars) are arranged on a scale based on the parameter minimum and maximum value on the y-axis.


Things which can be added:
Search button to search car by name
"Buy" button
Check local availability from dealers in the area






