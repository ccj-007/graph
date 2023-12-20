const tree_structure = {
  chart: {
    container: "#OrganiseChart6",
    levelSeparation: 70,
    siblingSeparation: 15,
    subTeeSeparation: 15,
    rootOrientation: "WEST",

    node: {
      HTMLclass: "it-draw",
      drawLineThrough: true,
      collapsable: true
    },
    connectors: {
      type: "curve",
      style: {
        "stroke-width": 0.5,
        stroke: "#ccc",
      },
    },
  },

  nodeStructure: {
    text: {
      name: {
        val: "大前端学习路径",
        href: "https://www.runoob.com/",
      },
    },
    HTMLclass: "winner",
    children: [
      {
        text: {
          name: "前端基础",
          desc: "HTML、CSS等",
        },
        children: [
          {
            text: {
              name: "JavaScript进阶",
              desc: "深入学习JavaScript",
            },
            children: [
              {
                text: {
                  name: "Vue.js",
                  desc: "学习Vue.js前端框架",
                },
                children: [
                  {
                    text: {
                      name: "Vue.js项目实战",
                      title: 1,
                    },
                    image: "icon/vue.png",
                    HTMLclass: "first-draw",
                  },
                  {
                    text: {
                      name: "Vue.js插件开发",
                      title: 2,
                    },
                    image: "icon/vue.png",
                    HTMLclass: "first-draw bye",
                  },
                ],
              },
              {
                text: {
                  name: "React",
                  desc: "学习React前端框架",
                },
                children: [
                  {
                    text: {
                      name: "React项目实战",
                      title: 3,
                    },
                    image: "icon/react.png",
                    HTMLclass: "first-draw",
                  },
                  {
                    text: {
                      name: "React生态系统",
                      title: 4,
                    },
                    image: "icon/react.png",
                    HTMLclass: "first-draw",
                  },
                ],
              },
            ],
          },
          {
            text: {
              name: "前端工程化",
              desc: "学习Webpack等",
            },
            children: [
              {
                text: {
                  name: "Webpack",
                  desc: "学习Webpack",
                },
                children: [
                  {
                    text: {
                      name: "Webpack配置与优化",
                      title: 5,
                    },
                    image: "icon/webpack.png",
                    HTMLclass: "first-draw",
                  },
                  {
                    text: {
                      name: "Webpack插件开发",
                      title: 6,
                    },
                    image: "icon/webpack.png",
                    HTMLclass: "first-draw",
                  },
                ],
              },
              {
                text: {
                  name: "Babel",
                  desc: "学习Babel编译工具",
                },
                children: [
                  {
                    text: {
                      name: "Babel配置与使用",
                      title: 7,
                    },
                    image: "icon/babel.png",
                    HTMLclass: "first-draw",
                  },
                  {
                    text: {
                      name: "Babel插件开发",
                      title: 8,
                    },
                    image: "icon/babel.png",
                    HTMLclass: "first-draw",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        text: {
          name: "后端开发",
          desc: "学习后端开发技术",
        },
        children: [
          {
            text: {
              name: "Node.js",
              desc: "学习Node.js后端开发",
            },
            children: [
              {
                text: {
                  name: "Express.js",
                  desc: "学习Express.js框架",
                },
                children: [
                  {
                    text: {
                      name: "Express.js项目实战",
                      title: 9,
                    },
                    image: "icon/express.png",
                    HTMLclass: "first-draw",
                  },
                  {
                    text: {
                      name: "Express.js中间件开发",
                      title: 10,
                    },
                    image: "icon/express.png",
                    HTMLclass: "first-draw",
                  },
                ],
              },
              {
                text: {
                  name: "Koa.js",
                  desc: "学习Koa.js后端框架",
                },
                children: [
                  {
                    text: {
                      name: "Koa.js项目实战",
                      title: 11,
                    },
                    image: "icon/koa.png",
                    HTMLclass: "first-draw",
                  },
                  {
                    text: {
                      name: "Koa.js中间件开发",
                      title: 12,
                    },
                    image: "icon/koa.png",
                    HTMLclass: "first-draw",
                  },
                ],
              },
            ],
          },
          {
            text: {
              name: "数据库",
              desc: "学习数据库技术",
            },
            children: [
              {
                text: {
                  name: "MySQL",
                  desc: "学习MySQL数据库",
                },
                children: [
                  {
                    text: {
                      name: "MySQL基础",
                      title: 13,
                    },
                    image: "icon/mysql.png",
                    HTMLclass: "first-draw",
                  },
                  {
                    text: {
                      name: "MySQL高级特性",
                      title: 14,
                    },
                    image: "icon/mysql.png",
                    HTMLclass: "first-draw",
                  },
                ],
              },
              {
                text: {
                  name: "MongoDB",
                  desc: "学习MongoDB数据库",
                },
                children: [
                  {
                    text: {
                      name: "MongoDB基础",
                      title: 15,
                    },
                    image: "icon/mongodb.png",
                    HTMLclass: "first-draw bye",
                  },
                  {
                    text: {
                      name: "MongoDB数据建模",
                      title: 16,
                    },
                    image: "icon/mongodb.png",
                    HTMLclass: "first-draw",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};
