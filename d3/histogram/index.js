// 数据
const data = [
    { label: "A", value: 20 },
    { label: "B", value: 50 },
    { label: "C", value: 30 },
    { label: "D", value: 80 },
    { label: "E", value: 40 },
];

// 配置
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// 比例尺
const x = d3.scaleBand()
    .domain(data.map(function (d) { return d.label; }))
    .range([0, width])
    .padding(.2);

const y = d3.scaleLinear()
    .domain([0, d3.max(data, function (d) { return d.value; })])
    .range([height, 0]);

// 绘图区域
const svg = d3.select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// X轴
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

// Y轴
svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y).ticks(10));

// 柱形
svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function (d) { return x(d.label); })
    .attr("y", function (d) { return y(d.value); })
    .attr("width", x.bandwidth())
    .attr("height", function (d) { return height - y(d.value); });
