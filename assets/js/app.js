
// Define svg canvas's width and height 
var svgWidth = 700;
var svgHeight = 500;

// Set svg margins
var margin = {
    top: 30,
    bottom: 50,
    right: 30,
    left: 40
};

// Create height and width for chart group
var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.right - margin.left;

// Append SVG element
var svg = d3
.select("#scatter")
.append("svg")
.attr("height", svgHeight)
.attr("width", svgWidth);

// Append group element
// Create the chartGroup that will contain the data
// Use transform attribute to fit it within the canvas
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
var file = "assets/data/data.csv"

// Function is called and passes csv data
d3.csv(file).then(successHandle, errorHandle);

// Read csv file
//If error exist, it will show in console
function errorHandle(error) {
    throw err;
}
    
function successHandle(healthData) {
            
    //Loop through the data and convert str to integer 
    healthData.forEach(function(data){
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });


    // Create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([7,d3.max(healthData, d=>d.poverty)])
        .range([0,width]);
        
    var yLinearScale = d3.scaleLinear()
        .domain([3,d3.max(healthData, d=>d.healthcare)])
        .range([height,0]);

    //Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale)

    var leftAxis = d3.axisLeft(yLinearScale)
        .ticks(14)
  
    //Append bottom axis to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    // Left axis is already at 0,0
    // Append the left axis 
    chartGroup.append("g")
        .call(leftAxis);

    //Create circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("fill","blue")
        .attr("opacity", "0.5");

    //Append text to circles
    var circlesGroup = chartGroup.selectAll()
        .data(healthData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .style("font-size", "10px")
        .style("text-anchor", "middle")
        .style('fill', 'white')
        .text(d => (d.abbr));

    //Initialize tool tipx
    var toolTip = d3.tip()
        .attr("class","tooltip")
        .offset([80,-60])
        .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Lacks Healthcare: ${d.healthcare}%`);
        });
    
    //Create tooltip in the chart
    chartGroup.call(toolTip);

    //Create event listensers to display and hide the tooltip
    circlesGroup.on("mouseover", function(data){
        toolTip.show(data,this);
    })

    //onmouseout event
        .on("mouseout", function(data){
            toolTip.hide(data);
        });

    //Create axes label
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 5)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");

}
