/**
Copyright (c) 2014, Ben Dilday
bepd50 at gmail dot com
**/

// globals

var lines = {};
var xScale, yScale;
var xAxis = 'time', yAxis = 'eloRank';
var fdata;
var pdata = [];
var rdata;
var minyear ;//= 1851;
var maxyear ;//= 2010;
var slope;// = 45;
var nplayer;// = 50;

var descriptions;
var inp_yrType = 'playing';
//var yearSelKeys = {"playing":"year_id", "birth":"year_birth"};
var yearSelKeys = {"playing":"minyr", "birth":"birthYear"};
var bounds;
var lcolors = {};
var avgdata = {};

//// RENDERING FUNCTIONS

var valueline = d3.svg.line()
    .x(function(d) {
	return xScale(d[xAxis]);
	//		return d[xAxis];
    })
    .y(function(d) {
	return yScale(d[yAxis]);
	//		return d[yAxis];
    });

function highlight_on(player)
{
    lines[player.name]
	.attr("stroke-opacity", 1)
	.style("stroke-width", 10)
	.style("stroke", function (d) {return lcolors[player.name]})
//	.style("stroke", "red")
	.moveToFront();
}

function highlight_off(player)
{
    lines[player.name]
	.attr("stroke-opacity", 0.15)
	.style("stroke-width", 1)
	.style("stroke",d3.rgb(25,25,25));
}


function updatePlayerLists(nl1, nl2, nl3) {    

    d3.select('#playerList1')
	.text('player list ' + nl1.length)
	.style({'font-size': '10px'});
    d3.select('#playerList1')
	.selectAll('li')
	.data(nl1)
	.enter()
	.append('li')
	.text(function(d) {return d.name + ' (' + avgdata[d.name].toFixed(1) + ')'})
	.style({'font-size': '10px'})
    	.on('mouseover', function(d) {
	    d3.select('svg g.chart #playerLabel')
		.text(d["name"] + ' (' + avgdata[d.name].toFixed(1) + ')')	
		.transition()
		.style('fill', '#555')
		.style('opacity', 1)
		.style('font-size', "40px")
		.attr('x', xScale(d[xAxis]))
		.attr('y', yScale(d[yAxis]))
	    ;
	    highlight_on(d);
	})
	.on('mouseout', function(d) {
	    d3.select('svg g.chart #playerLabel')
		.transition()
		.duration(1500)
		.style('opacity', 0);
	    highlight_off(d);
	});
    

    d3.select('#playerList2')
	.text('player list ' + nl2.length)
	.style({'font-size': '12px'});
    d3.select('#playerList2')
	.selectAll('li')
	.data(nl2)
	.enter()
	.append('li')
	.text(function(d) {return d.name + ' (' + avgdata[d.name].toFixed(1) + ')'})
	.style({'font-size': '10px'})
    	.on('mouseover', function(d) {
	    d3.select('svg g.chart #playerLabel')
		.text(d["name"] + ' (' + avgdata[d.name].toFixed(1) + ')')	
		.transition()
		.style('fill', '#555')
		.style('opacity', 1)
		.style('font-size', "40px")
		.attr('x', xScale(d[xAxis]))
		.attr('y', yScale(d[yAxis]))
	    ;
	    highlight_on(d);
	})
	.on('mouseout', function(d) {
	    d3.select('svg g.chart #playerLabel')
		.transition()
		.duration(1500)
		.style('opacity', 0);
	    highlight_off(d);
	});



    d3.select('#playerList3')
	.text('player list ' + nl3.length)
	.style({'font-size': '12px'});
    d3.select('#playerList3')
	.selectAll('li')
	.data(nl3)
	.enter()
	.append('li')
	.text(function(d) {return d.name + ' (' + avgdata[d.name].toFixed(1) + ')'})
	.style({'font-size': '10px'})
    	.on('mouseover', function(d) {
	    d3.select('svg g.chart #playerLabel')
		.text(d["name"] + ' (' + avgdata[d.name].toFixed(1) + ')')	
		.transition()
		.style('fill', '#555')
		.style('opacity', 1)
		.style('font-size', "40px")
		.attr('x', xScale(d[xAxis]))
		.attr('y', yScale(d[yAxis]))
	    ;
	    highlight_on(d);
	})
	.on('mouseout', function(d) {
	    d3.select('svg g.chart #playerLabel')
		.transition()
		.duration(1500)
		.style('opacity', 0);
	    highlight_off(d);
	});

    
}



function updateChart(init, bounds) {
    updateScales(bounds);
    
    // Also update the axes
    d3.select('#xAxis')
	.transition()
	.call(makeXAxis);
    
    d3.select('#yAxis')
	.transition()
	.call(makeYAxis);
    
    // Update axis labels
    d3.select('#xLabel')
	.text(descriptions[xAxis]);
    
    d3.select('#yLabel')
	.text(descriptions[yAxis]);
    
    d3.select('svg g.chart')
	.selectAll('circle')
	.transition()
	.duration(500)
	.ease('quad-out')
	.attr('cx', function(d) {
	    return isNaN(d[xAxis]) ? d3.select(this).attr('cx') : xScale(d[xAxis]);
	})
	.attr('cy', function(d) {
	    return isNaN(d[yAxis]) ? d3.select(this).attr('cy') : yScale(d[yAxis]);
	})
	.attr('r', function(d) {
	    return isNaN(d[xAxis]) || isNaN(d[yAxis]) ? 0 : 0.1 ;
	})
	.attr('stroke-width', function(d) {
	    return d["ithisyear"] ? 1.5 : (d['ihof']==0 ? 0 : (d['ihof']==1 ? 1.5 : 1.5));
	})
	.attr('stroke', d3.rgb(25, 25, 25))
	.style('opacity', function(d) {
	    return d['ihof']==0.1 ? 1 : (d['ihof']==1 ? 1 : 0.5);
	})
    ;	

    d3.select("svg g.chart")
	.selectAll(".players")
	.transition(200)
	.attr("d", function(d) {
//	    console.log(d);
	    return valueline(d.values);
	})
//	.style("stroke",d3.rgb(25, 25, 25))
	.style("fill","none")
    ;


    var npl = pdata.length;
    
    
    updatePlayerLists(pdata.slice(0, npl/3)
		      , pdata.slice(npl/3+1, 2*npl/3)
		      , pdata.slice(2*npl/3+1, npl)
		     );
    
}


function updateScales(bounds) {
    xScale = d3.scale.linear()
        .domain([bounds[xAxis].min, bounds[xAxis].max])
        .range([20, 700]);
    
    yScale = d3.scale.linear()
        .domain([bounds[yAxis].min, bounds[yAxis].max])
        .range([600, 100]);    
}

function makeXAxis(s) {
    s.call(d3.svg.axis()
	   .scale(xScale)
	   .orient("bottom"));
}

function makeYAxis(s) {
    s.call(d3.svg.axis()
	   .scale(yScale)
	   .orient("left"));
}

function updateMenus() {
    d3.select('#x-axis-menu-l')
	.selectAll('li')
	.classed('selected', function(d) {
	    return d === xAxis;
	});
    d3.select('#x-axis-menu-r')
	.selectAll('li')
	.classed('selected', function(d) {
	    return d === xAxis;
	});
    d3.select('#y-axis-menu-l')
	.selectAll('li')
	.classed('selected', function(d) {
	    return d === yAxis;
	});
    d3.select('#y-axis-menu-r')
	.selectAll('li')
	.classed('selected', function(d) {
	    return d === yAxis;
	});
}


// HELPERS
function parseData(d) {
    var newd = {};
 
    var keys = _.keys(d[0]);
    return _.map(d, function(d) {
	var o = {};
	_.each(keys, function(k) {
	    if( k == 'name' )
		o[k] = d[k];
	    else if( k == 'pname' ) 
		o[k] = d[k];
	    else if( k == 'days_since_01012011' ) {
		nk = 'time';
	        o[nk] = parseFloat(d[k]);
	    }
	    else
		if ( d['isBatter']==1 ) {		    
		    o[k] = 1.0*parseFloat(d[k]);
		} else {
//		    o[k] = -1.0*parseFloat(d[k]);
//		    o[k] = 1.0*parseFloat(d[k]) + 0.5;
		    o[k] = 1.0*parseFloat(d[k]);
		}

	});
	return o;
	console.log("ll", lcolors);

    });


}

function groupData(data) {
    gkey = "name";
    var tdata = {};
    var tmp = {};
    var allkeys = {};
    pdata = [];
    for (var i = 0; i < data.length; i++) {
	d = data[i];
	if ( ! (d[gkey] in tdata) ) {
	    tdata[d[gkey]] = [];
	    pdata.push({"name" : d[gkey]
			, "time" : d["time"]
			, "eloRank" : d["eloRank"]
			, "eloRating" : d["eloRating"]
		       });
/**
	    tdata[d[gkey]]["time"] = [];
	    tdata[d[gkey]]["eloRank"] = [];
	    tdata[d[gkey]]["eloRating"] = [];
**/

	}

	tmp = {};
	tmp["time"] = d["time"];
	tmp["eloRating"] = d["eloRating"];
	tmp["eloRank"] =d["eloRank"];
	tdata[d[gkey]].push(tmp);
/**
	tdata[d[gkey]]["time"].push(d["time"]);
	tdata[d[gkey]]["eloRank"].push(d["eloRank"]);
	tdata[d[gkey]]["eloRating"].push(d["eloRating"]);
**/


    }

    ndata = [];
    var t = {};

    for ( k in tdata ) {

	d = tdata[k];
	tmp = {};
	tmp["name"] = k;
	tmp["values"] = []
	for (var i = 0; i < d.length; i++) {
	    t = {};
	    t["time"] = d[i]["time"];
	    t["eloRank"] = d[i]["eloRank"];
	    t["eloRating"] = d[i]["eloRating"];
//	    tmp["values"].push(d[i]);
	    tmp["values"].push(t);
//	    console.log(d[i]["time"], xScale(d[i]["time"]));
//	    console.log(d[i]["eloRank"], yScale(d[i]["eloRank"]));
	}
	
	ndata.push(tmp);
   }
    return ndata;
}

function filterData(data, minyear, maxyear, filtType) {
//    var sk = yearSelKeys[inp_yrType];
    var sk = "eloRank";
    var tdata = [];
    var mxdata = {};
    avgdata = {};

    var tcol = {0 : "red", 1 : "blue"};
    for (var i = 0; i < data.length; i++) {
	d = data[i];

	var k = d["name"];


	if ( k == "KenGriffey" && d["eloRank"]>=100 ) {
	    continue;
	}

	if ( k == "FrankThomas" && d["eloRank"]>=100 ) {
	    continue;
	}




	if ( ! ( k in avgdata ) ) {
	    avgdata[k] = [];
	}

	avgdata[k].push(d["eloRank"]);

	lcolors[d["name"]] = tcol[d["isBatter"]];	
	if ( ! ( k in mxdata ) ) {
	    mxdata[k] = {"minrank" : 99999 , "maxrank" : -1};
	}

	if (d["eloRank"]>mxdata[k]["maxrank"]) {
	    mxdata[k]["maxrank"] = d["eloRank"];
	}

	if (d["eloRank"]<mxdata[k]["minrank"]) {
	    mxdata[k]["minrank"] = d["eloRank"];
	}
    }

    for ( var k in avgdata ) {
	var sum = 0.0;
	console.log(k, avgdata[k]);
	for ( var i=0; i < avgdata[k].length; i++ ) {
	    v = avgdata[k][i];
	    sum += parseFloat(v);
	    console.log(k, v, sum);
	}
	var tmp = (1.0*sum)/(avgdata[k].length);
	avgdata[k] = tmp;

    }
    
    console.log(avgdata);
//    console.log(mxdata);
    for (var i = 0; i < data.length; i++) {
	d = data[i]
	k = d["name"];

	if ( k == "KenGriffey" && d["eloRank"]>=100 ) {
	    continue;
	}

	if ( k == "FrankThomas" && d["eloRank"]>=40 ) {
	    continue;
	}

	var keys = _.keys(d);
	var tmp = {};
	var mn = mxdata[d["name"]]["minrank"];
	var mx = mxdata[d["name"]]["maxrank"];


	if ( (mn>=minyear && mn<=maxyear) || (mx>=minyear && mx<=maxyear)) {
	    for(var ik=0;ik<keys.length;ik++) {
		tmp[keys[ik]] = d[keys[ik]]; 
	    }
	    tdata.push(tmp);
	}
    }
    return tdata;
}
    
function getBounds(d, paddingFactor) {
    // Find min and maxes (for the scales)
    paddingFactor = typeof paddingFactor !== 'undefined' ? paddingFactor : 1;
    
    
    var keys = _.keys(d[0]), b = {};
    _.each(keys, function(k) {
	b[k] = {};
	_.each(d, function(d) {
	    if(isNaN(d[k]))
		return;
	    if(b[k].min === undefined || d[k] < b[k].min)
		b[k].min = d[k];
	    if(b[k].max === undefined || d[k] > b[k].max)
		b[k].max = d[k];
	});
	b[k].max > 0 ? b[k].max *= paddingFactor : b[k].max /= paddingFactor;
	b[k].min > 0 ? b[k].min /= paddingFactor : b[k].min *= paddingFactor;
    });
//    console.log(b);
    return b;
}



function readInputs() {
    var minyear = document.getElementById("inp_minyear").value;
    var maxyear = document.getElementById("inp_maxyear").value;

    if(minyear<1)
	minyear = 1;
    else if(minyear>9999)
	minyear = 9999;

    if(maxyear<1)
	maxyear = 1;
    else if(maxyear>9999)
	maxyear = 9999;


    if (slope>89.99) 
	slope = 89.99;


    return {slope: slope, nplayer: nplayer, minyear: minyear, maxyear: maxyear, inp_yrType: inp_yrType};

}


/*************************/
function doStuff(lup) {

    d3.select("svg").remove();
    main();

}


/*************************/
function main() {
    d3.csv('data/eloWayback.csv', function(data) {
	
	var xAxisOptions = ["time"];
	var yAxisOptions = ["eloRank", "eloRating"];
	
	
	descriptions = {
	    "time" : "time (days since 01/01/2011)"
	    ,"eloRank" : "elo Rank"
	    ,"eloRating" : "elo Rating"
	};


	var keys = _.keys(data[0]);	
	var data = parseData(data);

	var aa = readInputs(); 

	slope = aa['slope'];
	minyear = aa['minyear'];
	maxyear = aa['maxyear'];
	inp_yrType = aa['inp_yrType'];
	nplayer = aa['nplayer'];

	fdata = filterData(data, minyear, maxyear, inp_yrType );
//	console.log(fdata);

	bounds = getBounds(fdata, 1);
	updateScales(bounds);

	var gdata = groupData(fdata);
//	console.log(gdata);



/*****************************
	for (var i = 0; i < gdata.length; i++) {
	    d = gdata[i];
	    console.log(i, d.name);
	    for (var j=0; j<d.values.length;j++ ) {
		console.log(j, d.values[j]["time"] , xScale(d.values[j]["time"] ));
		console.log(j, d.values[j]["eloRank"] , yScale(d.values[j]["eloRank"] ));
		console.log(j, d.values[j]["eloRating"] , yScale(d.values[j]["eloRating"] ));
	    }
	}
***********************************/

	// SVG AND D3 STUFF
	var svg = d3.select("#chart")
	    .append("svg")
	    .attr("width", 1000)
	    .attr("height", 640);
	
	svg.append('g')
	    .classed('chart', true)
	    .attr('transform', 'translate(80, -60)');
	
	// Build menus
	d3.select('#x-axis-menu-l')
	    .selectAll('li')
	    .data(xAxisOptions)
	    .enter()
	    .append('li')
	    .text(function(d) {return d;})
	    .classed('selected', function(d) {
		return d === xAxis;
	    })
	    .on('click', function(d) {
		xAxis = d;
		updateChart(false, bounds);
		updateMenus();
	    });
	
	d3.select('#y-axis-menu-l')
	    .selectAll('li')
	    .data(yAxisOptions)
	    .enter()
	    .append('li')
	    .text(function(d) {return d;})
	    .classed('selected', function(d) {
		return d === yAxis;
	    })
	    .on('click', function(d) {
		yAxis = d;
		updateChart(false, bounds);
		updateMenus();
	    });
	
	// Player name
	d3.select('svg g.chart')
	    .append('text')
	    .attr({'id': 'playerLabel', 'x': 60, 'y': 60})
	    .style({'font-size': '40px', 'fill': '#ddd'});
	
	// Best fit line (to appear behind points)
/**
	d3.select('svg g.chart')
	    .append('line')
	    .attr('id', 'bestfit');
**/
	
	// Slopey line
	d3.select('svg g.chart')
	    .append('line')
	    .attr('id', 'slopey');
	
	// Axis labels
	d3.select('svg g.chart')
	    .append('text')
	    .attr({'id': 'xLabel', 'x': 400, 'y': 670, 'text-anchor': 'middle'})
	    .text(descriptions[xAxis]);
	
	d3.select('svg g.chart')
	    .append('text')
	    .attr('transform', 'translate(-60, 330)rotate(-90)')
	    .attr({'id': 'yLabel', 'text-anchor': 'middle'})
	    .text(descriptions[yAxis]);
	
	
	//  var pointColour = d3.scale.category20b();
	var pointColour = ["red","blue"];	

	//  tdata = d3.selectAll

	d3.select('svg g.chart')
	    .selectAll('circle')
	    .data(fdata)
	    .enter()
	    .append('circle')
	    .attr('cx', function(d) {
		return isNaN(d[xAxis]) ? 
		    d3.select(this).attr('cx') : 
		    xScale(d[xAxis]);
	    })
	    .attr('cy', function(d) {
		return isNaN(d[yAxis]) ? 
		    d3.select(this).attr('cy') : 
		    yScale(d[yAxis]);
	    })
	    .attr('r', 0.1)
	    .attr('fill', function(d, i) {
		return d["ithisyear"]==1 ? 
		    "#FFFF66" : 
		    pointColour[d["isBatter"]]
		;})

	    .style('cursor', 'pointer')
	    .on('mouseover', function(d) {
		d3.select('svg g.chart #playerLabel')
		    .text(d.name)
		    .transition()
		    .style('fill', '#555')
		    .style('opacity', 1)
		    .style('font-size', "40px")
		    .attr('x', xScale(d[xAxis]))
		    .attr('y', yScale(d[yAxis]))
		;
		highlight_on(d);
	    })
	    .on('mouseout', function(d) {
		d3.select('svg g.chart #playerLabel')
		    .transition()
		    .duration(1500)
		    .style('opacity', 0)
		;
		highlight_off(d);
	    });


	var players = d3.select("svg g.chart")
//sv.
	    .selectAll(".players")
	    .data(gdata)
	    .enter()
	    .append("g")
	    .attr("class","players");

	players.append("path")
	    .attr("class","line")
	    .attr("d", function(d) {
		console.log(d);
		lines[d.name] = d3.select(this);
		return valueline(d.values);
	    })
//	    .style("stroke", function(d) {return pointColour[d["isBatter"]]})
	    .style("stroke", d3.rgb(25,25,25))
	    .style("fill","none")
	    .style("opacity",0.15)
	    .style("stroke-width", 1);
	;


/**
	var player = svg.selectAll(".player")
	    .data(players)
	    .enter().append("g")
	    .attr("class", "player");

	player.append("path")
	    .attr("class", "line")
	    .attr("d", function(d) { return line(d.values); })
	    .style("stroke", function(d) { return color(d.name); });
**/

	updateChart(true, bounds);
	updateMenus();
	
	// Render axes
	d3.select('svg g.chart')
	    .append("g")
	    .attr('transform', 'translate(0, 630)')
	    .attr('id', 'xAxis')
	    .call(makeXAxis);
	
	d3.select('svg g.chart')
	    .append("g")
	    .attr('id', 'yAxis')
	    .attr('transform', 'translate(-10, 0)')
	    .call(makeYAxis);
    })}


main();
