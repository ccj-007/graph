// 生成一些假数据
const data = {
  list: [
    [
      5300, 6600, 6800, 6700, 6900, 7200, 7200, 7300, 7400, 8000, 7900, 8100,
      8200, 10000, 10200, 10400, 10000, 9000, 11000, 10000, 10900, 12000, 12200,
      12400, 12900, 13000,
    ],
    [
      5000, 6000, 6500, 6400, 5800, 9100, 15030, 15200, 15000, 17000, 18000,
      16000, 15000, 15900, 17000, 18000, 16000, 12000, 17000, 16000, 15000,
      14000, 13000, 12000, 12900, 19000,
    ],
    [
      5000, 6000, 6500, 6700, 6800, 10200, 15000, 15300, 15070, 17300, 18000,
      17000, 17000, 17000, 22000, 22000, 21000, 24000, 25000, 23000, 22000,
      22000, 25000, 25800, 28000, 40000,
    ],
    [
      6000, 6000, 6500, 6700, 6800, 10200, 15000, 15300, 15070, 17300, 18000,
      17000, 17000, 17000, 22000, 22000, 21000, 24000, 25000, 33000, 33000,
      22000, 25000, 55800, 58000, 60000,
    ],
    [
      6000, 6000, 6500, 6700, 6800, 10200, 15000, 15300, 15070, 17300, 18000,
      17000, 17000, 17000, 55000, 55000, 51000, 54000, 55000, 53000, 52000,
      22000, 45000, 45800, 50000, 56000,
    ],
    [
      6000, 6000, 6500, 6700, 6800, 10200, 15000, 15300, 15070, 17300, 18000,
      17000, 17000, 17000, 22000, 44000, 41000, 44000, 45000, 43000, 42000,
      33000, 35000, 35800, 38000, 40000,
    ],
    [
      5000, 6000, 6500, 6700, 6800, 10000, 25000, 25800, 25000, 37000, 38000,
      37000, 47000, 47000, 48000, 59000, 59000, 59000, 67000, 66000, 65000,
      64000, 73000, 72000, 72900, 83000,
    ],
  ],
  date: [
    "1997",
    "1998",
    "1999",
    "2000",
    "2001",
    "2002",
    "2003",
    "2004",
    "2005",
    "2006",
    "2007",
    "2008",
    "2009",
    "2010",
    "2011",
    "2012",
    "2013",
    "2014",
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
  ],
  color: [
    "#5470C6",
    "#91CC75",
    "#fac858",
    "#ee6666",
    "#73c0de",
    "#3ba272",
    "#9a60b4",
  ],
  label: ["Norwat", "France", "China", "Poland", "Russia", "Iceland", "US"],
};

// 定义边距、宽高
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const width = 1000 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;
// 计算y轴的最小日期和最大日期
const parseDate = d3.timeParse("%Y");

const minX = parseDate("1997");
const maxX = parseDate("2023");

// 将日期字符串转化为日期对象
data.date = data.date.map((d) => parseDate(d));
// 定义x轴比例尺
const x = d3.scaleTime().range([0, width]).domain([minX, maxX]);

// 定义y轴比例尺
const y = d3
  .scaleLinear()
  .range([height, 0])
  .domain([0, d3.max(data.list.flat().map((d) => d))]);

// 在SVG中添加g元素并设置transform，来让g元素居中显示
const svg = d3
  .select("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

const g = svg
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// 添加x轴及其标签
g.append("g")
  .call(d3.axisBottom(x).ticks(26))
  .attr("class", "x-axis")
  .style("color", "#aaa")
  .attr("transform", `translate(0,${height})`);

// 添加y轴及其标签
g.append("g")
  .attr("class", "y-axis")
  .style("color", "#aaa")
  .call(d3.axisLeft(y).ticks(6));

g.selectAll(".y-axis .tick line")
  .filter((d, i) => i > 0)
  .attr("x2", width)
  .attr("stroke", "#aaa")
  .attr("stroke-width", 0.4);
g.select(".y-axis path").style("display", "none");

// 定义生成折线的函数
const lineGenerator = d3
  .line()
  .x((d, i) => x(data.date[i]))
  .y((d) => y(d));

const group = g
  .selectAll(".group")
  .data(data.list)
  .enter()
  .append("g")
  .attr("class", "group");

// 添加一个辅助虚线的元素
const helperLine = g
  .append("line")
  .attr("class", "helper-line")
  .style("stroke-dasharray", "4 2") // 设置虚线样式
  .style("pointer-events", "none")
  .style("stroke", "gray")
  .style("opacity", 0); // 初始时隐藏虚线

function initLabel(id) {
  const overLines = labelOverlay
    .selectAll(".over-lines")
    .data(() => {
      let list = [];
      data.list.forEach((item, index) => {
        let obj = {
          label: data.label[index],
          value: item[id],
        };
        list.push(obj);
      });
      return list;
    })
    .enter()
    .append("g")
    .attr("class", "over-lines")
    .attr("transform", (d, i) => `translate(10, ${35 + i * 20})`);
  overLines
    .append("circle")
    .attr("cx", 5)
    .attr("cy", 5)
    .attr("r", 5)
    .style("fill", (d, i) => data.color[i]);

  overLines
    .append("text")
    .text((d) => `${d.label}:`)
    .attr("x", 15)
    .attr("y", 9)
    .attr("class", "over-text")
    .attr("fill", "black")
    .style("font-size", "12px");
  overLines
    .append("text")
    .text((d) => `${d.value}`)
    .attr("x", 130)
    .attr("y", 9)
    .attr("text-anchor", "end")
    .attr("font-weight", "bold")
    .attr("fill", "black")
    .style("font-size", "12px");
}

const lines = group
  .append("path")
  .datum((d, i) => d)
  .attr("id", (d, i) => `line-path-${i}`)
  .attr("class", "a-line")
  .attr("d", lineGenerator)
  .attr("stroke", (d, i) => data.color[i])
  .attr("stroke-width", "2")
  .attr("fill", "none")
  .text((d, i) => data.label[i]);

let labelOverlay = null;

svg
  .on("mousemove", function (event) {
    const mouseX = d3.pointer(event)[0];
    const mouseY = d3.pointer(event)[1];

    const year = new Date(x.invert(mouseX - margin.left)).getFullYear();

    // 更新辅助虚线的位置和显示状态
    if (year >= 1997 && year <= 2022) {
      console.log("🚀 ~ file: index.js:101 ~ mouseX:", year);

      // 获取索引位置
      let id = data.date.findIndex((item) => {
        return new Date(item).getFullYear() === year;
      });
      helperLine
        .attr("x1", x(data.date[id]))
        .attr("y1", 0)
        .attr("x2", x(data.date[id]))
        .attr("y2", height)
        .style("opacity", 1);

      // 更新浮层位置
      labelOverlay.attr(
        "transform",
        `translate(${mouseX > width - 150 ? width - 150 : mouseX + 10}, ${
          mouseY > height - 180 ? height - 180 : mouseY + 10
        })`
      );
      d3.select(".label-rect").style("display", "block");
      d3.select(".over-year").text(year);
      initLabel(id);

      // 绘制垂直辅助线helperLine和7条折线的7个相交点，并绘制圆形
      const cs = group
        .selectAll(".circle")
        .data((d) => {
          return [d[id]];
        })
        .join("circle")
        .attr("class", "circle")
        .attr("cx", (d, i) => x(data.date[id]))
        .attr("cy", (d, i) => y(d))
        .attr("r", 5);

      let i = -1;
      cs.each(function () {
        const dom = d3.select(this);
        i++;
        dom.attr("fill", data.color[i]);
      });
    }
  })
  .on("mouseenter", (e) => {
    // 创建浮层元素
    labelOverlay = svg.append("g").attr("class", "label-overlay");

    // 绘制元素
    labelOverlay
      .append("rect")
      .attr("class", "label-rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("width", 150)
      .attr("height", 180)
      .style("display", "none")
      .attr("fill", "#fff");

    labelOverlay
      .append("text")
      .attr("class", "over-year")
      .attr("x", 10)
      .attr("y", 22)
      .attr("fill", "#aaa");
  })
  .on("mouseout", function (e) {
    const mouseX = e.pageX;
    const mouseY = e.pageY;

    const chartX = svg.node().getBoundingClientRect().x;
    const chartY = svg.node().getBoundingClientRect().y;
    const chartWidth = svg.node().getBoundingClientRect().width;
    const chartHeight = svg.node().getBoundingClientRect().height;

    if (
      mouseX < chartX ||
      mouseX > chartX + chartWidth ||
      mouseY < chartY ||
      mouseY > chartY + chartHeight
    ) {
      svg.selectAll(".label-overlay").remove();
    }
  });

group.append("text").text("11").attr("class", "a-txt");

const texts = d3.selectAll(".a-txt"); // 选择所有文本元素

lines.each(function (d, i) {
  const line = d3.select(this); // 当前折线元素
  const text = texts.filter(function (_, j) {
    return j === i; // 根据索引筛选对应的文本元素
  });

  const pathEl = line.node();
  console.log("🚀 ~ file: index.js:317 ~ pathEl:", pathEl);
  const pathLength = pathEl.getTotalLength();
  const interpolator = d3.interpolate(0, pathLength);

  line
    .attr("stroke-dasharray", `${pathLength} ${pathLength}`)
    .attr("stroke-dashoffset", pathLength)
    .transition()
    .ease(d3.easeLinear)
    .delay(0)
    .duration(6000)
    .attr("stroke-dashoffset", 0)
    .tween("end", function () {
      return function (t) {
        const length = interpolator(t);
        const point = pathEl.getPointAtLength(length);
        const x = point.x;
        const y = point.y;

        text
          .text(data.label[i])
          .attr("x", x + 10)
          .attr("y", y); // 将位置应用到对应的文本元素
      };
    });
});
