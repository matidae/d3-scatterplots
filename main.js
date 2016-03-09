var margin = {top: 20, right: 20, bottom: 40, left: 40},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var data;

d3.csv("./data.csv", function(dataCSV) {
    dataCSV.forEach(function(d){
        d.x = +d.x;
        d.y = +d.y;
        d.z = +d.z;
    });
    data = dataCSV;
    main();
});

function main() {   
    var xScale = d3.scale.linear()
        .domain([ d3.min(data, function(d){return d.x;}), d3.max(data, function(d){return d.x;}) ])
        .range([margin.left, width - margin.right]);

    var yScale = d3.scale.linear()
        .domain([ d3.min(data, function(d){return d.y;}), d3.max(data, function(d){return d.y;})])
        .range([margin.bottom, height - margin.top]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");
    
    var svg = d3.select("#div_main")
        .append("svg")
        .attr("height", height)
        .attr("width", width);

    svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("cx", function(d){return xScale(d.x)})
    .attr("cy", function(d){return yScale(d.y)})
    .attr("r",10);

}

