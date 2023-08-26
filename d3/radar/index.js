var data = [
    { name: "A", value: 0.95 },
    { name: "B", value: 0.82 },
    { name: "C", value: 0.5 },
    { name: "D", value: 0.75 },
    { name: "E", value: 0.43 },
    { name: "F", value: 0.6 },
    { name: "G", value: 0.25 },
    { name: "H", value: 0.9 }
];

var width = 400,
    height = 400,
    margin = { top: 20, right: 20, bottom: 20, left: 20 };

var radius = Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 2;
var centerX = (width - margin.left - margin.right) / 2 + margin.left;
var centerY = (height - margin.top - margin.bottom) / 2 + margin.top;

var angleSlice = Math.PI * 2 / data.length;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g")
    .attr("transform", "translate(" + centerX + "," + centerY + ")");

var rScale = d3.scaleLinear()
    .range([0, radius])
    .domain([0, 1]);

var axisGrid = g.append("g")
    .attr("class", "axisWrapper");

axisGrid.selectAll(".levels")
    .data(d3.range(1, (data.length + 1)).reverse())
    .enter()
    .append("circle")
    .attr("class", "gridCircle")
    .attr("r", function (d, i) { return radius / data.length * d; })
    .style("fill", "#CDCDCD")
    .style("stroke", "#CDCDCD")
    .style("fill-opacity", 0.1)
    .style("stroke-opacity", 0.1);

axisGrid.selectAll(".axisLabel")
    .data(d3.range(1, (data.length + 1)).reverse())
    .enter().append("text")
    .attr("class", "axisLabel")
    .attr("x", 4)
    .attr("y", function (d) { return -d * radius / data.length; })
    .attr("dy", "0.4em")
    .style("font-size", "10px")
    .attr("fill", "#737373")
    .text(function (d) { return Math.round(d / data.length * 100) + "%" });

var radarLine = d3.lineRadial()
    .curve(d3.curveLinearClosed)
    .radius(function (d) { return rScale(d.value); })
    .angle(function (d, i) { return i * angleSlice; });

var dataLine = g.selectAll(".radarChart")
    .data([data])
    .enter()
    .append("path")
    .attr("class", "radarChart")
    .attr("d", function (d) { return radarLine(d); })
    .style("stroke-width", "1.5px")
    .style("stroke", "#F7683B")
    .style("fill", "#F7683B")
    .style("fill-opacity", 0.4);