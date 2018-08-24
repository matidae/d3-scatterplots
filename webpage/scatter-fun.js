$(document).ready(function() {
    var screenWidth = $(window).width();
	$("#txtSearch").val('')
    var selection = $("#selStrain").find(":selected").text();
    if (selection == "Y486") {
        json_file = "y486.json";
        load_data(json_file);
    }
    build_slider(0, 6, 0.1, "Range of orfogenic index: ");

});


$( function() {
	$("#txtSearch").autocomplete({
        minLength: 3,
        appendTo: "#autocomplete",
        source: function( request, response ) {
            $.ajax( {
                //url: "./" + identifier + "/" + identifier + ".a.txt",
				url: "./keywords.txt",
                dataType: "text",
                success: function( data ) {
                    var keys = data.split('\n');
                    var results = $.ui.autocomplete.filter(keys, request.term);
                    response(results.slice(0,10))}
            });
        }
    })
});


function build_slider(min, max, step, lbl_desc) {
    $("#lbl-amount").text(lbl_desc)
    $( "#slider-range" ).slider({
      animate: "slow",
      delay: 100,
      range: true,
      step: step,
      min: min,
      max: max,
      values: [min, max],
      slide: function(event, ui) {
        $( "#amount" ).val(ui.values[0] + " - " + ui.values[1]);
        var a1 = ui.values[0];
        var a2 = ui.values[1];
        var selection = $("#selColor").find(":selected").text();
        slider(a1, a2, selection);
      }
    });
    $( "#amount" ).val($( "#slider-range" ).slider( "values", 0) +
                   " - " + $( "#slider-range" ).slider( "values", 1));
}


function slider(a1, a2, selection){
    var circles = d3.selectAll("circle");
    if (selection == "Orfogenic index") {
        circles.each(function(d) {
            if (d.oi < a1 || d.oi > a2)
                d3.select(this).style('visibility','hidden');
            else
                d3.select(this).style('visibility','visible');
        });
    } else if (selection == "GC content") {
        circles.each(function(d) {
            if (d.gc < a1 || d.gc > a2)
                d3.select(this).style('visibility','hidden');
            else
                d3.select(this).style('visibility','visible');
        });
    } else if (selection == "O/E stops"){
        circles.each(function(d) {
            if (d.oe < a1 || d.oe > a2)
                d3.select(this).style('visibility','hidden');
            else
                d3.select(this).style('visibility','visible');
        });
   } else if (selection == "Y486 coverage"){
        circles.each(function(d) {
            if (d.cy < a1 || d.cy > a2)
                d3.select(this).style('visibility','hidden');
            else
                d3.select(this).style('visibility','visible');
        });
   } else if (selection == "MT1 coverage"){
        circles.each(function(d) {
            if (d.cm< a1 || d.cm > a2)
                d3.select(this).style('visibility','hidden');
            else
                d3.select(this).style('visibility','visible');
        });
   } else if (selection == "Liem coverage"){
        circles.each(function(d) {
            if (d.cl < a1 || d.cl > a2)
                d3.select(this).style('visibility','hidden');
            else
                d3.select(this).style('visibility','visible');            
        });
   } else if (selection == "Depth"){
        circles.each(function(d) {
            if (d.dp < a1 || d.dp > a2)
                d3.select(this).style('visibility','hidden');
            else
                d3.select(this).style('visibility','visible');
        });
   } else if (selection == "nORFs"){
        circles.each(function(d) {
            if (d.no < a1 || d.no > a2)
                d3.select(this).style('visibility','hidden');
            else
                d3.select(this).style('visibility','visible');
        });
   } else if (selection == "nRY"){
        circles.each(function(d) {
            if (d.ry < a1 || d.ry > a2)
                d3.select(this).style('visibility','hidden');
            else
                d3.select(this).style('visibility','visible');
        });
     }
 }


$("#selStrain").on("change",
    function() {
        var selection = $("#selStrain").find(":selected").text();
        var selColor = $("#selColor").find(":selected").text();
        if (selection == "MT1") {
            $("#tabResults").empty();
            $('#btnClear').css("visibility", "hidden");
            $('#selColor option[value="cov1"]').text("Y486 coverage")
            json_file = "mt1.json";
            $("#scatter").empty();
            load_data(json_file);
        } else if (selection == "Y486") {
            $("#tabResults").empty();
            $('#btnClear').css("visibility", "hidden");
            $('#selColor option[value="cov1"]').text("MT1 coverage")
//            $('#selColor option[value="cov3"]').text("Y486 depth")
            json_file = "y486.json";
            $("#scatter").empty();
            load_data(json_file);
        } else if (selection == "Liem") {
            $("#tabResults").empty();
            $('#btnClear').css("visibility", "hidden");
            $('#selColor option[value="cov2"]').text("MT1 coverage")
            json_file = "liem.json";
            $("#scatter").empty();
            load_data(json_file);
        }
    });

function load_data(json_file) {
    var a1 = new Date().getTime();
    $('.cs-loader').css('visibility','visible');
    var selStrain = $("#selStrain").find(":selected").text();
    $.ajax({
//        url: 'http://bioinformatica.fcien.edu.uy/vivax/scatter/' + json_file +
        url: 'http://localhost/scatter4/' + json_file +
             '?jsoncallback=callback_fun',
        dataType: 'jsonp'
    }).complete(function() {
        var circles = d3.selectAll("circle");
        circles.each(function(d) {
            var id = d.id.replace(".","_");
            line = "<strong>" + d.id + "</strong><br>"+d.s+":"+d.e+"<br>OI: " + d.oi + " OE: " +
                d.oe + "  GC: " + d.gc + " len:" + d.ln;
            if (selStrain == "Y486") {
                line += "<br>Coverage: MT1:" + d.cm + "  Liem:" + d.cl;
            } else if (selStrain == "MT1") {
                line += "<br>Y486_cov:" + d.cy + "Liem_cov:" + d.cl;
            } else if (selStrain == "Liem") {
                line += "<br>Y486_cov:" + d.cy + " MT1_cov:" + d.cm;
            }
            line += "<br> Depth: " + d.dp + " nORFs: " + d.no + "  RY:" + d.ry
			if (d.de != "-")
                line += "<br>" + d.de.replace(/ /g, "<br>");

            $('#' + id).tipso({
                tooltipHover: true,
                color: '#ffffff',
                background: '#3c3c3c',
                useTitle: true,
                titleBackground: '#333355',
                titleColor: '#ffffff',
                width: 300,
                delay:0,
                speed:0,
                content: line
            });
        });
        $('.cs-loader').css('visibility','hidden');
        $('#div_right').css('visibility','visible');
        $('#title').css('visibility','visible');
        $('#scatter').css('visibility','visible');
        $('.dot').click(
            function(event) {
                sel_id = $(this).attr("id");
				console.log(sel_id)
                sel_data = d3.select("#" + sel_id).datum();
                if ($('#btnClear').css("visibility") == "hidden")
                    $('#btnClear').css("visibility", "visible");
                if ($("#tr_" + sel_id).length == 0) {
                    entry = "<tr id='tr_" + sel_id + "'><th class='th_left'>" +
                            "<a target='_blank' href='./nuc/" + sel_data.id + ".fasta' >" + sel_data.id + 
                            "</a><br>" + 
                            "OI: " + sel_data.oi + 
                            " OE: " + sel_data.oe + 
                            " GC: " + sel_data.gc + "<br>"
                    if (selStrain == "Y486")
                        entry += "Coverage: MT1: " + sel_data.cm + " Liem:" + sel_data.cl + "<br>";
                    else if (selStrain == "MT1")
                        entry += "Coverage: Y486: " + sel_data.cy + " Liem:" + sel_data.cl + "<br>";
                    else if (selStrain == "Liem") 
                        entry += "Coverage: Y486:" + sel_data.cy + " MT1:" + sel_data.cm + "<br>";
                    entry += "Depth:" + sel_data.dp + "  nORFs:" + sel_data.no + "  nRY:" + sel_data.ry
			        if (sel_data.de != "-")
                        entry += "<br>" + sel_data.de.replace(/ /g, "<br>");
                    $("#tabResults").append(entry);
                } else {
                    $("#tr_" + sel_id).remove();
                    if ($('#tabResults > tbody > tr').length == 0) {
                        $('#btnClear').css("visibility", "hidden");
                }
            }
        });
        console.log(new Date().getTime() - a1)
    });
}


$('#btnClear').click(
    function() {
        $('#tabResults').empty();
        $('#btnClear').css("visibility", "hidden");
    });


$('#btnSearch').click(
    function() {
        var search = $('#txtSearch').val().toLowerCase();
        if (search.length > 2) {
            var re_search = new RegExp(search);
            var circles = d3.selectAll("circle");
            circles.each(function(d) {
                desc = d.de.toLowerCase()
                name = d.id
                if (desc.match(search) || name.match(search)) {
                    d3.select(this).attr("r", "4")
                       .classed("unsel", false).classed("sel", true)
                }
            });
        }
    });


$('#btnUnsel').click(
    function() {
        var circles = d3.selectAll(".sel")
        circles.each(function(d) {
            d3.select(this).attr("r", "2")
               .classed("unsel", true).classed("sel", false)
        });
    });

$('#chkSelected').click(
    function() {
        var checked = $(this).is(':checked');
        if (checked)
           d3.selectAll('.sel').style('visibility', 'hidden');
        else
           d3.selectAll('.sel').style('visibility', 'visible');
    });

$('#chkUnselected').click(
    function() {
        var checked = $(this).is(':checked');
        if (checked)
           d3.selectAll('.unsel').style('visibility', 'hidden');
        else
           d3.selectAll('.unsel').style('visibility', 'visible')
    });

function callback_fun(json) {
    var data = json;
    var margin = {
            top: 10,
            right: 100,
            bottom: 30,
            left: 30
        };
        outerWidth = $('#scatter').outerWidth();
        outerHeight = $('#scatter').outerHeight();
        width = outerWidth - margin.left - margin.right;
        height = outerHeight - margin.top - margin.bottom;

    var x = d3.scale.linear().range([0, width]).nice();
    var y = d3.scale.linear().range([height, 0]).nice();

    var xMax = d3.max(data, function(d) {
            return d.x;
        }) * 1.05,
        xMin = d3.min(data, function(d) {
            return d.x;
        }),
        xMin = xMin > 0 ? 0 : xMin,
        yMax = d3.max(data, function(d) {
            return d.y;
        }) * 1.05,
        yMin = d3.min(data, function(d) {
            return d.y;
        }),
        yMin = yMin > 0 ? 0 : yMin;

    x.domain([xMin, xMax]);
    y.domain([yMin, yMax]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickSize(-height);
    var yAxis = d3.svg.axis().scale(y).orient("left").tickSize(-width);

    var zoomBeh = d3.behavior.zoom()
        .x(x).y(y).scaleExtent([0.5, 10]).on("zoom", zoom);

    var svg = d3.select("#scatter")
        .append("svg")
        .classed("canvas", true)
        .attr("width", outerWidth)
        .attr("height", outerHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoomBeh);

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "rgba(0,0,0,0.05)");

    svg.append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .classed("label", true)
        .attr("x", width)
        .attr("y", margin.bottom - 10)
        .style("text-anchor", "end")
        .text("PC1")
        .attr("font-family", "sans").attr("font-size", "12px")

    svg.append("g")
        .classed("y axis", true)
        .call(yAxis)
        .append("text")
        .classed("label", true)
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("PC2")
        .attr("font-family", "sans").attr("font-size", "12px")


    var selection = $("#selColor").find(":selected").text()
    var selStrain = $("#selStrain").find(":selected").text()
    var colors = ["darkgreen", "green", "yellowgreen", "orange", "red"];

    if (selection == "Orfogenic index") {
        var scale = d3.scale.linear()
            .domain([0, colors.length - 1])
            .range([0, 3]);
    } else if (selection == "GC content") {
        var scale = d3.scale.linear()
            .domain([0, colors.length - 1])
            .range([0.3, 0.71]);
    } else if (selection == "O/E stops") {
        var scale = d3.scale.linear()
            .domain([0, colors.length - 1])
            .range([0.4, 0.9]);
    } else if (selection == "Y486 coverage") {
        var scale = d3.scale.linear()
            .domain([0, colors.length - 1])
            .range([0, 1]);
    } else if (selection == "MT1 coverage") {
        var scale = d3.scale.linear()
            .domain([0, colors.length - 1])
            .range([0, 1]);
    } else if (selection == "Liem coverage") {
        var scale = d3.scale.linear()
            .domain([0, colors.length - 1])
            .range([0, 1]);
    } else if (selection == "Depth") {
        if (selStrain=="Y486"){
            var scale = d3.scale.linear()
                .domain([0, colors.length - 1])
                .range([0, 10]);}
        else if (selStrain=="MT1"){
            var scale = d3.scale.linear()
                .domain([0, colors.length - 1])
                .range([0, 50]);}
        else{
            var scale = d3.scale.linear()
                .domain([0, colors.length - 1])
                .range([0, 50]);}

    } else if (selection == "nORFs") {
        var scale = d3.scale.linear()
            .domain([0, colors.length - 1])
            .range([0, 4]);
    } else if (selection == "nRY") {
        var scale = d3.scale.linear()
            .domain([0, colors.length - 1])
            .range([0.4, 0.6]);
    }

    var color = d3.scale.linear()
        .domain(d3.range(colors.length).map(scale)).range(colors);

    var objects = svg.append("svg")
        .classed("objects", true)
        .attr("width", width).attr("height", height);

    objects.append("svg:line")
        .classed("axisLine hAxisLine", true)
        .attr("x1", 0).attr("y1", 0)
        .attr("x2", width).attr("y2", 0)
        .attr("transform", "translate(0," + height + ")");

    objects.append("svg:line")
        .classed("axisLine vAxisLine", true)
        .attr("x1", 0).attr("y1", 0)
        .attr("x2", 0).attr("y2", height);
    objects.selectAll(".dot")
        .data(data).enter().append("circle")
        .classed("dot", true).classed("unsel", true)
        .attr("r", 2)
        .attr("id", function(d) {
            return d.id.replace(".","_");
        })
        .attr("transform", transform)
        .style("fill", function(d) {
            if (selection == "Orfogenic index")
                return color(d.oi);
            else if (selection == "GC content")
                return color(d.gc);
            else if (selection == "O/E stops")
                return color(d.oe);
        });

    var key = d3.select("svg").append("svg").attr("width", 80).attr("height", 300)
        .attr("x", width + 50).attr("y", "150");

    var newy = d3.scale.linear().range([200, 0]).domain([0, 3]);
    var newyAxis = d3.svg.axis().scale(newy).orient("right");
    key.append("g").attr("class", "y axis").attr("transform", "translate(20,10)")
        .call(newyAxis).attr("font-family", "sans").attr("font-size", "12px")
        .append("text").attr("transform", "rotate(-90)").attr("y", 40).attr("font-family", "sans")
        .attr("font-size", "12px").attr("dy", ".71em").style("text-anchor", "end")
        .text("orfogenic index");
    d3.select("#selColor").on("change", change);
     var key = d3.select("svg").append("svg").attr("width", 80).attr("height", 300)
            .attr("x", width + 50).attr("y", "150");
        var legend = key.append("defs").append("svg:linearGradient").attr("id", "gradient")
            .attr("x1", "100%").attr("y1", "0%").attr("x2", "100%")
            .attr("y2", "100%").attr("spreadMethod", "pad");
        legend.append("stop").attr("offset", "0%").attr("stop-color", "red")
            .attr("stop-opacity", .8);
        legend.append("stop").attr("offset", "25%").attr("stop-color", "orange")
            .attr("stop-opacity", .8);
        legend.append("stop").attr("offset", "50%").attr("stop-color", "yellowgreen")
            .attr("stop-opacity", .8);
        legend.append("stop").attr("offset", "75%").attr("stop-color", "green")
            .attr("stop-opacity", .8);
        legend.append("stop").attr("offset", "100%").attr("stop-color", "darkgreen")
            .attr("stop-opacity", .8);
        key.append("rect").attr("width", 20).attr("height", 200)
            .style("fill", "url(#gradient)").attr("transform", "translate(0,10)");
    change();


    function change() {
        var selection = $('#selColor').find(":selected").text();
        var colors = ["darkgreen", "green", "yellowgreen", "orange", "red"];
        if (selection == "GC content") {
            color_change({selection:selection, 
                range_start:0.3, 
                range_end:0.71, 
                slider_start:0, 
                slider_end:1, 
                slider_step:0.05, 
                slider_title:"Range of GC content: "}); 
        } else if (selection == "Orfogenic index") {
            color_change({selection:selection, 
                range_start:0, 
                range_end:3, 
                slider_start:0, 
                slider_end:6, 
                slider_step:0.1, 
                slider_title:"Range of orfogenic index: "});
        } else if (selection == "O/E stops") {
            color_change({selection:selection, 
                range_start:0.4, 
                range_end:0.9, 
                slider_start:0, 
                slider_end:1, 
                slider_step:0.05, 
                slider_title:"Range of O/E stops: "});
       } else if (selection == "Y486 coverage") {
            color_change({selection:selection, 
                range_start:0, 
                range_end:1, 
                slider_start:0, 
                slider_end:1, 
                slider_step:0.05, 
                slider_title:"Coverage of Y486 reads: "});
        } else if (selection == "MT1 coverage") {
            color_change({selection:selection, 
                range_start:0, 
                range_end:1, 
                slider_start:0, 
                slider_end:1, 
                slider_step:0.05, 
                slider_title:"Coverage of MT1 reads: "});
        } else if (selection == "Liem coverage") {                
            color_change({selection:selection, 
                range_start:0, 
                range_end:1, 
                slider_start:0, 
                slider_end:1, 
                slider_step:0.05, 
                slider_title:"Coverage of Liem reads: "});
        } else if (selection == "Depth") {
            if (selStrain == "Y486"){
                color_change({selection:selection, 
                    range_start:0, 
                    range_end:10, 
                    slider_start:0, 
                    slider_end:50, 
                    slider_step:1, 
                    slider_title:"Depth: "});
            }
             if (selStrain == "MT1"){
                color_change({selection:selection, 
                    range_start:0, 
                    range_end:80, 
                    slider_start:0, 
                    slider_end:100, 
                    slider_step:1, 
                    slider_title:"Depth: "});
            }
             if (selStrain == "Liem"){
                color_change({selection:selection, 
                    range_start:0, 
                    range_end:30, 
                    slider_start:0, 
                    slider_end:100, 
                    slider_step:1, 
                    slider_title:"Depth: "});
            }
      } else if (selection == "nORFs") {                
            color_change({selection:selection, 
                range_start:0, 
                range_end:4, 
                slider_start:0, 
                slider_end:5, 
                slider_step:0.1, 
                slider_title:"number of ORFs: "});
        } else if (selection == "nRY") {                
            color_change({selection:selection, 
                range_start:0.4, 
                range_end:0.6, 
                slider_start:0.3, 
                slider_end:0.7, 
                slider_step:0.01, 
                slider_title:"nRY: "});
        }
    }

    function color_change(args){
        build_slider(args.slider_start, args.slider_end, args.slider_step, args.slider_title);
        var scale = d3.scale.linear()
            .domain([0, colors.length - 1])
            .range([args.range_start, args.range_end]);
        var color = d3.scale.linear().domain(d3.range(colors.length).map(scale))
            .range(colors);
        var newy = d3.scale.linear().range([200, 0])
            .domain([args.range_start, args.range_end]);
        var newyAxis = d3.svg.axis().scale(newy).orient("right");
        d3.selectAll(".y")[0][1].remove();
        key.append("g").attr("class", "y axis").attr("transform", "translate(20,10)")
            .call(newyAxis).attr("font-family", "sans").attr("font-size", "12px")
            .append("text").attr("transform", "rotate(-90)").attr("y", 45)
            .attr("font-family", "sans").attr("font-size", "12px").attr("dy", ".81em")
            .style("text-anchor", "end").text(args.selection);
        d3.selectAll(".dot")
            .style('visibility','visible')
            .style("fill", function(d) {
        if (args.selection == "GC content")
            return color(d.gc);
        else if (args.selection == "Orfogenic index")
            return color(d.oi);
        else if (args.selection == "O/E stops")
            return color(d.oe);
        else if (args.selection == "Y486 coverage")
            return color(d.yc);
        else if (args.selection == "MT1 coverage")
            return color(d.cm);
        else if (args.selection == "Liem coverage")
            return color(d.cl);
        else if (args.selection == "Depth")
            return color(d.dp);
        else if (args.selection == "nORFs")
            return color(d.no);
        else if (args.selection == "nRY")
            return color(d.ry);

        })
    }

    function zoom() {
        svg.select(".x.axis").call(xAxis);
        svg.select(".y.axis").call(yAxis);
        svg.selectAll(".dot").attr("transform", transform);
    }

    function transform(d) {
        return "translate(" + x(d.x) + "," + y(d.y) + ")";
    } 
}

