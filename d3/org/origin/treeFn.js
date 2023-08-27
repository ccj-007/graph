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
            },
          ],
        },
        { name: "节点A3" },
      ],
    },
    {
      name: "节点B",
      children: [{ name: "节点B1" }, { name: "节点B2" }],
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

export function getNodeInfo(nodeId, data) {
  var result = {
    curNode: null,
    parentNode: null,
    lenList: [1, 1, 1, 1],
    curNodeIndex: 0,
  };

  function traverse(node, parent) {
    if (node.id === nodeId) {
      result.curNode = node;
      result.parentNode = parent;
      return;
    }

    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        traverse(node.children[i], node);
      }
    }
  }

  traverse(data, null);
  if (result.parentNode) {
    result.curNodeIndex = result.parentNode.children.findIndex(
      (item) => item.id === result.curNode.id
    );
    result.lenList = result.parentNode.children.map((item) => {
      return Array.isArray(item?.children) ? item.children.length : 0;
    });
  }
  return result;
}

export function getFitY(info, groupH) {
  // 不断累加到节点位置
  let zi = 0;
  const { lenList, curNodeIndex, curNode } = info;

  if (curNode.id === "0") return { fitY: groupH / 2, groupH: groupH };

  for (let i = 0; i < lenList.length; i++) {
    if (i < curNodeIndex) {
      zi += lenList[i];
    }
    if (i === curNodeIndex) zi += lenList[i] / 2;
  }

  let mu = lenList.reduce((pre, cur) => pre + cur);
  let fitY = groupH * (zi / mu);

  return { fitY, groupH: groupH * (lenList[curNodeIndex] / mu) };
}

var nodeInfo = getNodeInfo("0-0-0", data);

console.log(nodeInfo.curNode); // 当前节点信息
console.log(nodeInfo.lenList); // 当前层级每个节点的子节点数量
console.log(nodeInfo.curNodeIndex); // curNode在lenList中对应的索引
