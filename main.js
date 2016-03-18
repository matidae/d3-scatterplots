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
        .domain([d3.min(data, function(d){return d.x;})*0.9, d3.max(data, function(d){return d.x;})*1.1])
        .range([margin.left, width - margin.right]);

    var yScale = d3.scale.linear()
        .domain([d3.min(data, function(d){return d.y;})*0.9, d3.max(data, function(d){return d.y;})*1.1])
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

    var cValue = function(d) { return d.z;}, color = d3.scale.category20();

    svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("cx", function(d){return xScale(d.x)})
    .attr("cy", function(d){return yScale(d.y)})
    .attr("r",5)
    .style("fill", function(d){return color(cValue(d));});

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height - margin.top) + ")")
        .call(xAxis)
        .append("text")
        .attr("transform", "translate(600, -5)")
        .text("PC1");

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis)
        .append("text")
        .attr('text-anchor', 'end')
        .attr("transform", "translate(15, 40) rotate(-90)")
        .text("PC2");

}

