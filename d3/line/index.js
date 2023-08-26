// 要绘制的数据
var data = [
  { x: new Date("2021/1/1"), y: 10 },
  { x: new Date("2021/2/1"), y: 20 },
  { x: new Date("2021/3/1"), y: 15 },
  { x: new Date("2021/4/1"), y: 30 },
  { x: new Date("2021/5/1"), y: 25 },
  { x: new Date("2021/6/1"), y: 40 },
];

// 定义画布大小和边距
var margin = { top: 20, right: 20, bottom: 30, left: 50 },
  width = 500 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

// 创建SVG元素
var svg = d3
  .select("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 定义X轴和Y轴的比例尺
var x = d3
  .scaleTime()
  .domain(
    d3.extent(data, function (d) {
      return d.x;
    })
  )
  .range([0, width]);

var y = d3
  .scaleLinear()
  .domain([
    0,
    d3.max(data, function (d) {
      return d.y;
    }),
  ])
  .range([height, 0]);

// 定义X轴和Y轴
var xAxis = d3.axisBottom(x),
  yAxis = d3.axisLeft(y);

// 添加X轴和Y轴
svg
  .append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

svg.append("g").call(yAxis);

// 绘制折线图
// var line = d3.line()
//     .x(function (d) { return x(d.x); })
//     .y(function (d) { return y(d.y); });

svg
  .append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr(
    "d",
    d3
      .line()
      .x((d) => x(d.x))
      .y((d) => y(d.y))
  );
