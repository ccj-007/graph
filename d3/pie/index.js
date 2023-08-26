var data = [
    { category: "A", value: 30 },
    { category: "B", value: 20 },
    { category: "C", value: 10 },
    { category: "D", value: 25 },
    { category: "E", value: 15 }
];

var width = 400,
    height = 400,
    margin = { top: 20, right: 20, bottom: 20, left: 20 };

var radius = Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 2;
var centerX = (width - margin.left - margin.right) / 2 + margin.left;
var centerY = (height - margin.top - margin.bottom) / 2 + margin.top;

var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g")
    .attr("transform", "translate(" + centerX + "," + centerY + ")");

var pie = d3.pie()
    .sort(null)
    .value(function (d) { return d.value; });

var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

var arcs = g.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc");

arcs.append("path")
    .attr("d", arc)
    .style("fill", function (d) { return colorScale(d.data.category); });

arcs.append("text")
    .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
    .attr("dy", "0.35em")
    .text(function (d) { return d.data.category + " (" + d.data.value + ")"; });