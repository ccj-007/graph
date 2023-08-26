// 定义数据结构
const data = [
  {
    label: "2020",
    index: 0,
    season: [
      { label: "Q1", value: 300 },
      { label: "Q2", value: 220 },
      { label: "Q3", value: 80 },
      { label: "Q4", value: 260 },
    ],
  },
  {
    label: "2021",
    index: 1,
    season: [
      { label: "Q1", value: 100 },
      { label: "Q2", value: 20 },
      { label: "Q3", value: 220 },
      { label: "Q4", value: 120 },
    ],
  },
  {
    label: "2022",
    index: 2,
    season: [
      { label: "Q1", value: 10 },
      { label: "Q2", value: 20 },
      { label: "Q3", value: 170 },
      { label: "Q4", value: 20 },
    ],
  },
  {
    label: "2023",
    index: 3,
    season: [
      { label: "Q1", value: 200 },
      { label: "Q2", value: 20 },
      { label: "Q3", value: 120 },
      { label: "Q4", value: 88 },
    ],
  },
  {
    label: "2024",
    index: 4,
    season: [
      { label: "Q1", value: 300 },
      { label: "Q2", value: 20 },
      { label: "Q3", value: 120 },
      { label: "Q4", value: 100 },
    ],
  },
];
// 每年4个季度
const seasonLen = 4;
// 统计年的数量
const yearLen = data.length;
const colors = ["#5470C6", "#91CC75", "#fac858", "#ee6666"];

const svgWidth = 960;
const svgHeight = 500;

// 定义图幅大小
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;
const svg = d3.select("svg").attr("width", svgWidth).attr("height", svgHeight);

// 创建比例尺
const xScale = d3
  .scaleBand()
  .domain(data.map((d) => d.label))
  .range([0, chartWidth])
  .padding(0.2);

const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(data, (d) => d3.max(d.season, (s) => s.value))])
  .range([chartHeight, 0]);

// 获取每个柱子的宽度
const columnWidth = xScale.bandwidth() / seasonLen;

// 创建图表的根节点
const chart = svg
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// 创建坐标轴
chart
  .append("g")
  .attr("class", "x-axis")
  .style("color", "#aaa")
  .attr("transform", `translate(0,${chartHeight})`)
  .call(d3.axisBottom(xScale).tickSizeOuter(0).tickSize(0).tickPadding(10));
chart
  .append("g")
  .attr("class", "y-axis")
  .style("color", "#aaa")
  .call(d3.axisLeft(yScale).ticks(5).tickSizeOuter(0));

chart
  .selectAll(".y-axis .tick line")
  .filter((d, i) => i > 0)
  .attr("x2", svgWidth - margin.left - margin.right)
  .attr("stroke", "#aaa")
  .attr("stroke-width", 0.4);
chart.select(".y-axis path").style("display", "none");

// 创建group组，存不同年份的分组节点
const horizontals = chart
  .selectAll(".y-horizontal")
  .enter()
  .append("g")
  .attr("class", "group")
  .attr("transform", (d) => `translate(${xScale(d.label) + columnWidth},0)`);

// 创建group组，存不同年份的分组节点
const group = chart
  .selectAll(".group")
  .data(data)
  .enter()
  .append("g")
  .attr("class", "group")
  .attr("transform", (d) => `translate(${xScale(d.label) + columnWidth},0)`);

/**
 * 季度分组
 */
const groupItems = group
  .append("rect")
  .attr("x", (d) => columnWidth * ["Q1", "Q2", "Q3", "Q4"].indexOf(d.label))
  .attr("y", 0)
  .attr("width", xScale.bandwidth())
  .attr("height", (d) => chartHeight)
  .attr("class", "rect-group")
  .style("opacity", 0)
  .on("mouseover", function (e, d) {
    d3.select(this).style("fill", "blue").style("opacity", 0.05);
    onGroupLabel(e, d);
  })
  .on("mouseout", function (e) {
    d3.select(this).style("fill", "blue").style("opacity", 0);
    removeGroupLabel(e);
  });

/**
 * 监听浮层的位置
 */
function onGroupLabel(e, d) {
  const mouseX = e.pageX;
  const mouseY = e.pageY;
  const labelOverlay = svg
    .append("g")
    .attr("class", "label-overlay")
    .attr("transform", `translate(${mouseX}, ${mouseY})`);

  labelOverlay
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("width", 100)
    .attr("height", 120)
    .attr("fill", "#fff");

  labelOverlay
    .append("text")
    .text(d.label)
    .attr("x", 10)
    .attr("y", 22)
    .attr("fill", "#aaa");

  const seasons = labelOverlay
    .selectAll(".season")
    .data(d.season)
    .enter()
    .append("g")
    .attr("class", "season")
    .attr("transform", (d, i) => `translate(10, ${35 + i * 20})`);
  seasons
    .append("circle")
    .attr("cx", 5)
    .attr("cy", 5)
    .attr("r", 5)
    .style("fill", (d, i) => colors[i]);

  seasons
    .append("text")
    .text((d) => `${d.label}:`)
    .attr("x", 15)
    .attr("y", 9)
    .attr("fill", "black")
    .style("font-size", "12px");
  seasons
    .append("text")
    .text((d) => `${d.value}`)
    .attr("x", 75)
    .attr("y", 9)
    .attr("text-anchor", "end")
    .attr("font-weight", "bold")
    .attr("fill", "black")
    .style("font-size", "12px");
  svg.on("mousemove", function (e) {
    labelOverlay.attr("transform", `translate(${e.pageX}, ${e.pageY})`);
  });
}
/**
 * 移除浮层的位置
 */
function removeGroupLabel(e) {
  svg.selectAll(".label-overlay").remove();
  svg.on("mousemove", null);
}

/**
 * 每个季度
 */
const rects = group
  .selectAll(".rect-column")
  .data((d) => d.season)
  .enter()
  .append("rect")
  .style("fill", (d, i) => colors[i])
  .attr("class", "rect-hover")
  .attr(
    "x",
    (d) => columnWidth * (["Q1", "Q2", "Q3", "Q4"].indexOf(d.label) - 1)
  )
  .attr("y", (d) => yScale(d.value))
  .attr("width", xScale.bandwidth() / seasonLen)
  .attr("height", (d) => chartHeight - yScale(d.value))
  .on("mouseover", function (e, d) {
    rects.filter((d1) => d1.label !== d.label).style("opacity", "0.2");
    onGroupLabel(e, d3.select(this.parentNode).datum());
  })
  .on("mouseout", () => {
    rects.style("fill", (d, i) => colors[i]).style("opacity", "1");
    removeGroupLabel();
  })
  .style("fill", (d, i) => colors[i]);

group
  .selectAll("text")
  .data((d) => d.season)
  .enter()
  .append("text")
  .text((d, i) => {
    return `${d.label}-${d.value}`;
  })
  .style("pointer-events", "none")
  .attr("class", "rect-hover")
  .attr(
    "x",
    (d) => columnWidth * (["Q1", "Q2", "Q3", "Q4"].indexOf(d.label) - 1) + 10
  )
  .attr("y", function (d) {
    const textHeight = this.getBoundingClientRect().height; // 获取文本高度
    return chartHeight + textHeight; // 加上一些偏移量，使文本位于 X 轴上方
  })
  .attr("fill", "#000")
  .attr("transform", (d, i) => {
    // 使用 transform 属性旋转文本
    const x = columnWidth * (["Q1", "Q2", "Q3", "Q4"].indexOf(d.label) - 1);
    const y = chartHeight;
    return `rotate(270 ${x} ${y})`; // 在元素的中心点处旋转90度
  })
  .filter((d, i) => i === 0)
  .attr("fill", "#fff");
