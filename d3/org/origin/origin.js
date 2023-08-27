import { getNodeInfo, getFitY } from "./treeFn.js";

// 定义树图数据
var data = {
  name: "根节点",
  children: [
    {
      name: "节点A",
      children: [
        { name: "节点A1" },
        {
          name: "节点A2",
          children: [
            {
              name: "节点A2-1",
            },
            {
              name: "节点A2-2",
              children: [
                {
                  name: "节点A2-1",
                },
                {
                  name: "节点A2-3",
                },
              ],
            },
            {
              name: "节点A2-3",
              children: [
                {
                  name: "节点A2-1",
                },
                {
                  name: "节点A2-3",
                },
                {
                  name: "节点A2-3",
                },
              ],
            },
          ],
        },
        { name: "节点A3" },
      ],
    },
    {
      name: "节点B",
      children: [
        {
          name: "节点B1",
        },
        { name: "节点B2" },
      ],
    },
    {
      name: "节点B",
      children: [{ name: "节点B1" }, { name: "节点B2" }],
    },
    {
      name: "节点B",
      children: [
        { name: "节点B1" },
        {
          name: "节点B2",
        },
        {
          name: "节点B2",
        },
        {
          name: "节点B2",
        },
        {
          name: "节点B2",
        },
      ],
    },
  ],
};

/**
 * 增加id
 * @param {*} node
 * @param {*} id
 */
function addNodeId(node, id) {
  node.id = id;
  if (node.children) {
    for (var i = 0; i < node.children.length; i++) {
      addNodeId(node.children[i], id + "-" + i);
    }
  }
}
addNodeId(data, "0");

// 创建SVG画布
var svg = document.getElementById("chart");
var h = window.innerHeight;
var w = window.innerWidth;
var xDistance = 300;
svg.style.width = w;
svg.style.height = h;

// 创建节点和连线
var nodes = document.createElementNS("http://www.w3.org/2000/svg", "g");
nodes.setAttribute("class", "node");
svg.appendChild(nodes);

// 创建连线
var links = document.createElementNS("http://www.w3.org/2000/svg", "g");
svg.appendChild(links);

/**
 * 创建节点
 * @param {*} node
 * @param {number} x
 * @param {number} y
 * @param {*} g
 */
function createNode(node, pidGroup, x, y, id, groupH) {
  console.log("🚀 ~ file: origin.js:58 ~ createNode ~ pidGroup:", pidGroup);
  // 绘制组
  var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  let fitY = null;
  pidGroup.appendChild(group);

  // 开始计算适配的px
  if (node.children && node.children.length) {
    let nodeInfo = getNodeInfo(id, data);
    let fitInfo = getFitY(nodeInfo, groupH);
    console.log(
      "🚀 ~ file: origin.js:119 ~ createNode ~ nodeInfo:",
      nodeInfo,
      fitInfo
    );

    fitY = fitInfo.fitY;
    groupH = fitInfo.groupH;
  }

  // 绘制圆
  var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("r", 5);
  circle.setAttribute("cx", x); // 设置圆心的水平坐标
  circle.setAttribute("cy", fitY || y); // 设置圆心的垂直坐标
  group.appendChild(circle);

  var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", x + 10);
  text.setAttribute("y", fitY || y);
  text.textContent = node.name;
  group.appendChild(text);

  if (node.children) {
    var offset = 50;
    if (node.children.length % 2 === 0) {
      offset = -50 * (node.children.length / 2 - 0.5);
    } else {
      offset = -50 * Math.floor(node.children.length / 2);
    }

    for (var i = 0; i < node.children.length; i++) {
      // 绘制线段逻辑放在这里，因为需要得到结束点
      var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      var d =
        "M" +
        x +
        "," +
        (fitY || y) +
        "L" +
        (x + xDistance) +
        "," +
        ((fitY || y) + offset);
      path.setAttribute("class", "link");
      path.setAttribute("d", d);
      path.setAttribute("stroke", "red");
      links.appendChild(path);

      // 你要知道当前层级每个节点的子节点有多少个，根据你的id查找对应的节点，此时可以计算出当前节点组的百分比的px量，然后循环即可
      createNode(
        node.children[i],
        group,
        x + xDistance,
        (fitY || y) + offset,
        id + "-" + i,
        groupH
      );

      offset += 50;
    }
  }
}

createNode(data, nodes, 50, h / 2, "0", h);
