(function () {



  let $ = null;

  let UTIL = {
    /**
     *Object.assign 适用于浅拷贝对象的第一层属性，而 UTIL.inheritAttrs 适用于深度复制对象及其原型链上的所有可枚举属性，并且排除函数属性
     * @param {object} applyTo
     * @param {object} applyFrom
     * @returns
     */
    inheritAttrs: function (applyTo, applyFrom) {
      for (let attr in applyFrom) {
        if (applyFrom.hasOwnProperty(attr)) {
          if (
            applyTo[attr] instanceof Object &&
            applyFrom[attr] instanceof Object &&
            typeof applyFrom[attr] !== "function"
          ) {
            this.inheritAttrs(applyTo[attr], applyFrom[attr]);
          } else {
            applyTo[attr] = applyFrom[attr];
          }
        }
      }
      return applyTo;
    },

    /**
     * 该方法的作用是将两个对象的属性进行合并，并返回一个新的对象。如果两个对象具有相同的属性， obj2 中的属性将覆盖 obj1 中的属性。这样可以实现对象属性的合并操作。
     * @param {object} obj1
     * @param {object} obj2
     * @returns {object}
     */
    createMerge: function (obj1, obj2) {
      let newObj = {};
      if (obj1) {
        this.inheritAttrs(newObj, this.cloneObj(obj1));
      }
      if (obj2) {
        this.inheritAttrs(newObj, obj2);
      }
      return newObj;
    },

    /**
     * 在方法内部，首先进行条件判断，检查全局变量 $ 是否存在。这里的 $ 通常是指jQuery库。 
        - 如果 $ 存在，表示当前环境中使用了jQuery库，那么将通过 Array.prototype.unshift 方法，在参数列表的开头插入两个参数： true 和一个空对象 {} 。这是为了在参数列表中的第一个位置插入一个布尔值 true 和一个空对象，以便在调用 $.extend 方法时，将 true 作为第一个参数，表示执行深度合并。 
        - 然后，通过 $.extend.apply($, arguments) 调用jQuery的 extend 方法，将参数列表中的所有参数传递给它，并返回合并后的结果。 
        - 如果 $ 不存在，表示当前环境中没有使用jQuery库，那么将调用 UTIL.createMerge 方法，将参数列表中的所有参数传递给它，并返回合并后的结果。 
     * @returns {*}
     */
    extend: function () {
      if ($) {
        Array.prototype.unshift.apply(arguments, [true, {}]);
        return $.extend.apply($, arguments);
      } else {
        return UTIL.createMerge.apply(this, arguments);
      }
    },

    /**
     * 该方法的作用是对一个对象进行深度克隆，即创建一个新的对象，并将原对象的属性递归地克隆到新对象中。这样可以得到一个与原对象具有相同属性值但完全独立的新对象。
     * @param {object} obj
     * @returns {*}
     */
    cloneObj: function (obj) {
      if (Object(obj) !== obj) {
        return obj;
      }
      let res = new obj.constructor();
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          res[key] = this.cloneObj(obj[key]);
        }
      }
      return res;
    },

    /**
     * 该方法的作用是根据当前环境中是否存在jQuery库来选择不同的方式来绑定事件。如果存在jQuery库，使用 $(el).on() 方法来绑定事件；如果不存在jQuery库，则根据浏览器的兼容性选择适当的方式来绑定事件。这样可以实现跨浏览器的事件绑定
     * @param {Element} el
     * @param {string} eventType
     * @param {function} handler
     */
    addEvent: function (el, eventType, handler) {
      if ($) {
        $(el).on(eventType + ".treant", handler);
      } else if (el.addEventListener) {
        // DOM Level 2 browsers
        el.addEventListener(eventType, handler, false);
      } else if (el.attachEvent) {
        // IE <= 8
        el.attachEvent("on" + eventType, handler);
      } else {
        // ancient browsers
        el["on" + eventType] = handler;
      }
    },

    /**
     * 该方法的作用是根据当前环境中是否存在jQuery库来选择不同的方式来查找元素。如果存在jQuery库，使用jQuery的选择器语法来查找元素；如果不存在jQuery库，则根据选择器的不同情况使用原生的DOM方法来查找元素。这样可以实现跨浏览器的元素查找。
     * @param {string} selector
     * @param {boolean} raw
     * @param {Element} parentEl
     * @returns {Element|jQuery}
     */
    findEl: function (selector, raw, parentEl) {
      parentEl = parentEl || document;

      if ($) {
        let $element = $(selector, parentEl);
        return raw ? $element.get(0) : $element;
      } else {
        // todo: getElementsByName()
        // todo: getElementsByTagName()
        // todo: getElementsByTagNameNS()
        if (selector.charAt(0) === "#") {
          return parentEl.getElementById(selector.substring(1));
        } else if (selector.charAt(0) === ".") {
          let oElements = parentEl.getElementsByClassName(
            selector.substring(1)
          );
          return oElements.length ? oElements[0] : null;
        }

        throw new Error("Unknown container element");
      }
    },

    // 用于获取元素的外部高度和外部宽度
    getOuterHeight: function (element) {
      let nRoundingCompensation = 1;
      if (typeof element.getBoundingClientRect === "function") {
        return element.getBoundingClientRect().height;
      } else if ($) {
        return Math.ceil($(element).outerHeight()) + nRoundingCompensation;
      } else {
        return Math.ceil(
          element.clientHeight +
          UTIL.getStyle(element, "border-top-width", true) +
          UTIL.getStyle(element, "border-bottom-width", true) +
          UTIL.getStyle(element, "padding-top", true) +
          UTIL.getStyle(element, "padding-bottom", true) +
          nRoundingCompensation
        );
      }
    },

    getOuterWidth: function (element) {
      let nRoundingCompensation = 1;
      if (typeof element.getBoundingClientRect === "function") {
        return element.getBoundingClientRect().width;
      } else if ($) {
        return Math.ceil($(element).outerWidth()) + nRoundingCompensation;
      } else {
        return Math.ceil(
          element.clientWidth +
          UTIL.getStyle(element, "border-left-width", true) +
          UTIL.getStyle(element, "border-right-width", true) +
          UTIL.getStyle(element, "padding-left", true) +
          UTIL.getStyle(element, "padding-right", true) +
          nRoundingCompensation
        );
      }
    },

    getStyle: function (element, strCssRule, asInt) {
      let strValue = "";
      if (document.defaultView && document.defaultView.getComputedStyle) {
        strValue = document.defaultView
          .getComputedStyle(element, "")
          .getPropertyValue(strCssRule);
      } else if (element.currentStyle) {
        strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1) {
          return p1.toUpperCase();
        });
        strValue = element.currentStyle[strCssRule];
      }
      //Number(elem.style.width.replace(/[^\d\.\-]/g, ''));
      return asInt ? parseFloat(strValue) : strValue;
    },

    addClass: function (element, cssClass) {
      if ($) {
        $(element).addClass(cssClass);
      } else {
        if (!UTIL.hasClass(element, cssClass)) {
          if (element.classList) {
            element.classList.add(cssClass);
          } else {
            element.className += " " + cssClass;
          }
        }
      }
    },

    hasClass: function (element, my_class) {
      return (
        (" " + element.className + " ")
          .replace(/[\n\t]/g, " ")
          .indexOf(" " + my_class + " ") > -1
      );
    },

    toggleClass: function (element, cls, apply) {
      if ($) {
        $(element).toggleClass(cls, apply);
      } else {
        if (apply) {
          //element.className += " "+cls;
          element.classList.add(cls);
        } else {
          element.classList.remove(cls);
        }
      }
    },

    setDimensions: function (element, width, height) {
      if ($) {
        $(element).width(width).height(height);
      } else {
        element.style.width = width + "px";
        element.style.height = height + "px";
      }
    },
    isjQueryAvailable: function () {
      return typeof $ !== "undefined" && $;
    },
  };

  /**
   * ImageLoader is used for determining if all the images from the Tree are loaded.
   * Node size (width, height) can be correctly determined only when all inner images are loaded
   *
   * 该 ImageLoader 对象用于管理树中的图片加载，提供了方法来处理图片加载、移除加载任务、判断加载状态等。它可以确保在所有图片加载完成后，获取节点的正确大小。
   */
  let ImageLoader = function () {
    this.reset();
  };

  ImageLoader.prototype = {
    /**
     * @returns {ImageLoader}
     */
    reset: function () {
      this.loading = [];
      return this;
    },

    /**
     * @param {TreeNode} node
     * @returns {ImageLoader}
     */
    processNode: function (node) {
      let aImages = node.nodeDOM.getElementsByTagName("img");

      let i = aImages.length;
      while (i--) {
        this.create(node, aImages[i]);
      }
      return this;
    },

    /**
     * @returns {ImageLoader}
     */
    removeAll: function (img_src) {
      let i = this.loading.length;
      while (i--) {
        if (this.loading[i] === img_src) {
          this.loading.splice(i, 1);
        }
      }
      return this;
    },

    /**
     * @param {TreeNode} node
     * @param {Element} image
     * @returns {*}
     */
    create: function (node, image) {
      let self = this,
        source = image.src;

      function imgTrigger() {
        self.removeAll(source);
        node.width = node.nodeDOM.offsetWidth;
        node.height = node.nodeDOM.offsetHeight;
      }

      if (image.src.indexOf("data:") !== 0) {
        this.loading.push(source);

        if (image.complete) {
          return imgTrigger();
        }

        UTIL.addEvent(image, "load", imgTrigger);
        UTIL.addEvent(image, "error", imgTrigger); // handle broken url-s

        // load event is not fired for cached images, force the load event
        image.src +=
          (image.src.indexOf("?") > 0 ? "&" : "?") + new Date().getTime();
      } else {
        imgTrigger();
      }
    },

    /**
     * @returns {boolean}
     */
    isNotLoading: function () {
      return this.loading.length === 0;
    },
  };

  /**
   *  TreeStore 对象用于管理已初始化的 Tree 对象，提供了创建、获取和销毁 Tree 对象的方法。通过使用 TreeStore 对象，可以避免使用全局变量，并且能够在页面上支持多个独立的树。
   */
  let TreeStore = {
    store: [],

    /**
     * @param {object} jsonConfig
     * @returns {Tree}
     */
    createTree: function (jsonConfig) {
      let nNewTreeId = this.store.length;
      this.store.push(new Tree(jsonConfig, nNewTreeId));
      return this.get(nNewTreeId);
    },

    /**
     * @param {number} treeId
     * @returns {Tree}
     */
    get: function (treeId) {
      return this.store[treeId];
    },

    /**
     * @param {number} treeId
     * @returns {TreeStore}
     */
    destroy: function (treeId) {
      let tree = this.get(treeId);
      if (tree) {
        tree._R.remove();
        let draw_area = tree.drawArea;

        while (draw_area.firstChild) {
          draw_area.removeChild(draw_area.firstChild);
        }

        let classes = draw_area.className.split(" "),
          classes_to_stay = [];

        for (let i = 0; i < classes.length; i++) {
          let cls = classes[i];
          if (cls !== "Forest" && cls !== "Forest-loaded") {
            classes_to_stay.push(cls);
          }
        }
        draw_area.style.overflowY = "";
        draw_area.style.overflowX = "";
        draw_area.className = classes_to_stay.join(" ");

        this.store[treeId] = null;
      }
      return this;
    },
  };

  /**
   * Tree constructor.
   * @param {object} jsonConfig
   * @param {number} treeId
   * @constructor
   */
  let Tree = function (jsonConfig, treeId) {
    /**
     * 用于重置树对象的配置和状态
     * @param {object} jsonConfig
     * @param {number} treeId
     * @returns {Tree}
     */
    this.reset = function (jsonConfig, treeId) {
      this.initJsonConfig = jsonConfig;
      this.initTreeId = treeId;

      this.id = treeId;

      this.CONFIG = UTIL.extend(Tree.CONFIG, jsonConfig.chart);
      // 获取绘制区域的DOM元素
      this.drawArea = UTIL.findEl(this.CONFIG.container, true);
      if (!this.drawArea) {
        throw new Error(
          'Failed to find element by selector "' + this.CONFIG.container + '"'
        );
      }

      UTIL.addClass(this.drawArea, "Forest");

      // 清空绘制区域的内容
      this.drawArea.innerHTML = "";

      // 创建一个 ImageLoader 对象，用于加载树节点的图片。
      this.imageLoader = new ImageLoader();

      // 创建一个 NodeDB 对象，用于管理树节点的数据库。
      this.nodeDB = new NodeDB(jsonConfig.nodeStructure, this);

      // 创建一个空对象 connectionStore ，用于存储节点连接器的引用
      this.connectionStore = {};

      this.loaded = false;

      //  创建一个 Raphael 对象，用于绘制树的图形。
      this._R = new Raphael(this.drawArea);
      console.log("🚀 ~ file: forest.js:421 ~ Tree ~ drawArea:", this.drawArea);

      return this;
    };

    /**
     * 用于重新加载树对象
     * @returns {Tree}
     */
    this.reload = function () {
      this.reset(this.initJsonConfig, this.initTreeId).redraw();
      return this;
    };

    // 在构造函数中，调用 reset 方法来初始化树对象，传入初始的配置信息和树ID。
    this.reset(jsonConfig, treeId);
  };

  Tree.prototype = {
    /**
     * @returns {NodeDB}
     */
    getNodeDb: function () {
      return this.nodeDB;
    },

    /**
     * @param {TreeNode} parentTreeNode
     * @param {object} nodeDefinition
     * @returns {TreeNode}
     */
    addNode: function (parentTreeNode, nodeDefinition) {
      this.CONFIG.callback.onBeforeAddNode.apply(this, [
        parentTreeNode,
        nodeDefinition,
      ]);

      let oNewNode = this.nodeDB.createNode(
        nodeDefinition,
        parentTreeNode.id,
        this
      );
      oNewNode.createGeometry(this);

      oNewNode.parent().createSwitchGeometry(this);

      this.positionTree();

      this.CONFIG.callback.onAfterAddNode.apply(this, [
        oNewNode,
        parentTreeNode,
        nodeDefinition,
      ]);

      return oNewNode;
    },

    /**
     * @returns {Tree}
     */
    redraw: function () {
      this.positionTree();
      return this;
    },

    /**
     *  positionTree 方法用于对树进行定位，包括计算节点位置、边界信息和层级数据。它还支持在初始化时进行动画效果，并在树加载完成后执行回调函数。如果图片加载尚未完成，则会延迟一段时间后再次尝试进行定位。
     * @param {function} callback
     * @returns {Tree}
     */
    positionTree: function (callback) {
      let self = this;

      // 如果图片加载器 imageLoader 没有正在加载的图片，则进行树的定位操作。
      if (this.imageLoader.isNotLoading()) {
        //获取树的根节点，并调用 resetLevelData 方法重置层级数据。
        let root = this.root();
        this.resetLevelData();

        // 调用 firstWalk 方法进行第一次遍历，计算每个节点的位置信息。
        this.firstWalk(root, 0);
        // 调用 secondWalk 方法进行第二次遍历，计算每个节点的最终位置和边界信息。
        this.secondWalk(root, 0, 0, 0);

        //  调用 positionNodes 方法对所有节点进行定位。
        this.positionNodes();

        //  如果配置中设置了在初始化时进行动画效果，则通过 setTimeout 延迟一定时间后，调用根节点的 toggleCollapse 方法，以展开或折叠根节点。
        if (this.CONFIG.animateOnInit) {
          setTimeout(function () {
            root.toggleCollapse();
          }, this.CONFIG.animateOnInitDelay);
        }

        // 如果树尚未加载完成，则添加 Forest-loaded 类名到绘制区域元素，表示节点在加载完成前隐藏。如果 callback 参数是一个函数，则调用该函数，并将当前树对象作为参数传入。然后，调用配置中指定的 onTreeLoaded 回调函数，并将根节点作为参数传入。最后，将 loaded 属性设置为 true ，表示树已加载完成。
        if (!this.loaded) {
          UTIL.addClass(this.drawArea, "Forest-loaded"); // nodes are hidden until .loaded class is added
          if (
            Object.prototype.toString.call(callback) === "[object Function]"
          ) {
            callback(self);
          }
          self.CONFIG.callback.onTreeLoaded.apply(self, [root]);
          this.loaded = true;
        }
      } else {
        // 如果图片加载器 imageLoader 正在加载图片，则通过 setTimeout 延迟10毫秒后，再次调用 positionTree 方法进行定位。
        setTimeout(function () {
          self.positionTree(callback);
        }, 10);
      }
      //  最后，返回当前的 Tree 对象。
      return this;
    },

    /**
     *这段代码是树布局算法中的第一次后序遍历（post-order walk）的实现。在遍历过程中，为树的每个节点分配了一个初步的 x 坐标（保存在节点的 prelim 属性中），同时为内部节点分配了修正值（modifier），用于将它们的子节点向右移动。
     * @param {TreeNode} node
     * @param {number} level
     * @returns {Tree}
     */
    firstWalk: function (node, level) {
      node.prelim = null;
      node.modifier = null;

      //调用 setNeighbors 方法为节点设置相邻节点的引用，以便在后续的计算中使用。
      this.setNeighbors(node, level);
      // 调用 calcLevelDim 方法计算节点所在层级的尺寸信息。
      this.calcLevelDim(node, level);

      let leftSibling = node.leftSibling();

      //如果节点没有子节点或者已经到达最大层级（level 等于 CONFIG.maxDepth），则将 prelim 属性设置为相应的值。如果存在左侧兄弟节点，则 prelim 值为左侧兄弟节点的 prelim 值加上左侧兄弟节点的尺寸和 siblingSeparation 属性的值；否则 prelim 值为 0。
      if (node.childrenCount() === 0 || level == this.CONFIG.maxDepth) {
        // set preliminary x-coordinate
        if (leftSibling) {
          node.prelim =
            leftSibling.prelim +
            leftSibling.size() +
            this.CONFIG.siblingSeparation;
        } else {
          node.prelim = 0;
        }
      } else {
        //- 如果节点有子节点，则对每个子节点递归调用 firstWalk 方法进行遍历。
        for (let i = 0, n = node.childrenCount(); i < n; i++) {
          this.firstWalk(node.childAt(i), level + 1);
        }
        //- 计算节点的中心位置（childrenCenter 方法返回子节点的中心位置），并将其减去节点自身尺寸的一半，得到 midPoint。
        let midPoint = node.childrenCenter() - node.size() / 2;

        // 如果存在左侧兄弟节点，则计算节点的 prelim 值和 modifier 值，并调用 apportion 方法进行修正。
        if (leftSibling) {
          node.prelim =
            leftSibling.prelim +
            leftSibling.size() +
            this.CONFIG.siblingSeparation;
          node.modifier = node.prelim - midPoint;
          this.apportion(node, level);
        } else {
          node.prelim = midPoint;
        }

        // 如果节点是堆叠子节点的父节点（stackParent），则将 modifier 值增加一个偏移量，该偏移量由堆叠子节点的第一个子节点的尺寸的一半和 connStyle.stackIndent 属性的值组成。
        if (node.stackParent) {
          // handle the parent of stacked children
          node.modifier +=
            this.nodeDB.get(node.stackChildren[0]).size() / 2 +
            node.connStyle.stackIndent;
        } else if (node.stackParentId) {
          //  如果节点是堆叠子节点（stackParentId），则将 prelim 值设置为 0。
          node.prelim = 0;
        }
      }
      return this;
    },

    /*
     * 这段代码用于调整小型兄弟子树的位置。兄弟子树是独立形成的，并尽可能地靠近放置。通过要求子树在放置时保持刚性，避免了由于位置调整而产生的不良效果。

    这段代码的作用是根据兄弟子树之间的间隙，调整它们的位置，以确保它们尽可能地靠近放置。通过在形成子树时保持刚性，避免了节点位置调整可能带来的不良影响
     */
    apportion: function (node, level) {
      let firstChild = node.firstChild(),
        firstChildLeftNeighbor = firstChild.leftNeighbor(),
        compareDepth = 1,
        depthToStop = this.CONFIG.maxDepth - level;

      while (
        firstChild &&
        firstChildLeftNeighbor &&
        compareDepth <= depthToStop
      ) {
        // calculate the position of the firstChild, according to the position of firstChildLeftNeighbor

        let modifierSumRight = 0,
          modifierSumLeft = 0,
          leftAncestor = firstChildLeftNeighbor,
          rightAncestor = firstChild;

        for (let i = 0; i < compareDepth; i++) {
          leftAncestor = leftAncestor.parent();
          rightAncestor = rightAncestor.parent();
          modifierSumLeft += leftAncestor.modifier;
          modifierSumRight += rightAncestor.modifier;

          // all the stacked children are oriented towards right so use right variables
          if (rightAncestor.stackParent !== undefined) {
            modifierSumRight += rightAncestor.size() / 2;
          }
        }

        // find the gap between two trees and apply it to subTrees
        // and matching smaller gaps to smaller subtrees

        let totalGap =
          firstChildLeftNeighbor.prelim +
          modifierSumLeft +
          firstChildLeftNeighbor.size() +
          this.CONFIG.subTeeSeparation -
          (firstChild.prelim + modifierSumRight);

        if (totalGap > 0) {
          let subtreeAux = node,
            numSubtrees = 0;

          // count all the subtrees in the LeftSibling
          while (subtreeAux && subtreeAux.id !== leftAncestor.id) {
            subtreeAux = subtreeAux.leftSibling();
            numSubtrees++;
          }

          if (subtreeAux) {
            let subtreeMoveAux = node,
              singleGap = totalGap / numSubtrees;

            while (subtreeMoveAux.id !== leftAncestor.id) {
              subtreeMoveAux.prelim += totalGap;
              subtreeMoveAux.modifier += totalGap;

              totalGap -= singleGap;
              subtreeMoveAux = subtreeMoveAux.leftSibling();
            }
          }
        }

        compareDepth++;

        firstChild =
          firstChild.childrenCount() === 0
            ? node.leftMost(0, compareDepth)
            : (firstChild = firstChild.firstChild());

        if (firstChild) {
          firstChildLeftNeighbor = firstChild.leftNeighbor();
        }
      }
    },

    /*
     *  这段代码是树布局算法中的第二次前序遍历（pre-order walk）的实现。在遍历过程中，每个节点被赋予最终的 x 坐标，通过将其初步的 x 坐标和所有祖先节点的修正值相加得到。y 坐标取决于树的高度。当根节点的方向为 EAST 或 WEST 时，x 和 y 的角色会互换。 
    
    这段代码的作用是根据节点的 prelim 值和祖先节点的修正值，确定节点的最终位置。根据根节点的方向和对齐方式，计算节点的 x 和 y 坐标，并根据方向进行调整。同时，通过递归遍历子节点和右侧兄弟节点，完成对整个树的遍历和位置计算。
     */
    secondWalk: function (node, level, X, Y) {
      if (level > this.CONFIG.maxDepth) {
        return;
      }

      let xTmp = node.prelim + X,
        yTmp = Y,
        align = this.CONFIG.nodeAlign,
        orient = this.CONFIG.rootOrientation,
        levelHeight,
        nodesizeTmp;

      if (orient === "NORTH" || orient === "SOUTH") {
        levelHeight = this.levelMaxDim[level].height;
        nodesizeTmp = node.height;
        if (node.pseudo) {
          node.height = levelHeight;
        } // assign a new size to pseudo nodes
      } else if (orient === "WEST" || orient === "EAST") {
        levelHeight = this.levelMaxDim[level].width;
        nodesizeTmp = node.width;
        if (node.pseudo) {
          node.width = levelHeight;
        } // assign a new size to pseudo nodes
      }

      node.X = xTmp;

      if (node.pseudo) {
        // pseudo nodes need to be properly aligned, otherwise position is not correct in some examples
        if (orient === "NORTH" || orient === "WEST") {
          node.Y = yTmp; // align "BOTTOM"
        } else if (orient === "SOUTH" || orient === "EAST") {
          node.Y = yTmp + (levelHeight - nodesizeTmp); // align "TOP"
        }
      } else {
        node.Y =
          align === "CENTER"
            ? yTmp + (levelHeight - nodesizeTmp) / 2
            : align === "TOP"
              ? yTmp + (levelHeight - nodesizeTmp)
              : yTmp;
      }

      if (orient === "WEST" || orient === "EAST") {
        let swapTmp = node.X;
        node.X = node.Y;
        node.Y = swapTmp;
      }

      if (orient === "SOUTH") {
        node.Y = -node.Y - nodesizeTmp;
      } else if (orient === "EAST") {
        node.X = -node.X - nodesizeTmp;
      }

      if (node.childrenCount() !== 0) {
        if (node.id === 0 && this.CONFIG.hideRootNode) {
          // ako je root node Hiden onda nemoj njegovu dijecu pomaknut po Y osi za Level separation, neka ona budu na vrhu
          this.secondWalk(node.firstChild(), level + 1, X + node.modifier, Y);
        } else {
          this.secondWalk(
            node.firstChild(),
            level + 1,
            X + node.modifier,
            Y + levelHeight + this.CONFIG.levelSeparation
          );
        }
      }

      if (node.rightSibling()) {
        this.secondWalk(node.rightSibling(), level, X, Y);
      }
    },

    /**
     * 定义了一个名为 positionNodes 的方法，用于对所有节点进行定位，并将树居中在容器中。对所有节点进行定位的功能。它会根据树的尺寸和绘制区域的尺寸，将树居中在绘制区域中，并根据节点的位置信息对节点进行定位。在定位过程中，还会处理节点的折叠状态和连接器的绘制
     * @returns {Tree}
     */
    positionNodes: function () {
      // 获取树的基础信息
      let self = this,
        treeSize = {
          x: self.nodeDB.getMinMaxCoord("X", null, null),
          y: self.nodeDB.getMinMaxCoord("Y", null, null),
        },
        treeWidth = treeSize.x.max - treeSize.x.min,
        treeHeight = treeSize.y.max - treeSize.y.min,
        treeCenter = {
          x: treeSize.x.max - treeWidth / 2,
          y: treeSize.y.max - treeHeight / 2,
        };

      // 调用  handleOverflow  函数，处理树的溢出情况，即根据树的大小调整绘制区域的大小。
      this.handleOverflow(treeWidth, treeHeight);

      // 计算绘制区域的中心位置（containerCenter），即绘制区域的宽度的一半和高度的一半。
      let containerCenter = {
        x: self.drawArea.clientWidth / 2,
        y: self.drawArea.clientHeight / 2,
      },
        // 计算树的中心位置与绘制区域中心位置之间的偏移量
        deltaX = containerCenter.x - treeCenter.x,
        deltaY = containerCenter.y - treeCenter.y,
        // 根据树的坐标情况，计算 X 和 Y 坐标的偏移量, 确保所有节点的坐标都是正数。
        negOffsetX =
          treeSize.x.min + deltaX <= 0 ? Math.abs(treeSize.x.min) : 0,
        negOffsetY =
          treeSize.y.min + deltaY <= 0 ? Math.abs(treeSize.y.min) : 0,
        i,
        len,
        node;

      // 遍历所有节点，对每个节点进行定位。
      for (i = 0, len = this.nodeDB.db.length; i < len; i++) {
        node = this.nodeDB.get(i);

        //在定位节点之前，调用  onBeforePositionNode  回调函数，方便我们获取节点状态
        self.CONFIG.callback.onBeforePositionNode.apply(self, [
          node,
          i,
          containerCenter,
          treeCenter,
        ]);

        //  如果节点是根节点且设置了隐藏根节点（ this.CONFIG.hideRootNode ），则跳过该节点的定位。
        if (node.id === 0 && this.CONFIG.hideRootNode) {
          self.CONFIG.callback.onAfterPositionNode.apply(self, [
            node,
            i,
            containerCenter,
            treeCenter,
          ]);
          continue;
        }

        // 如果树的大小小于绘制区域的大小，则将节点的 X 坐标增加偏移量 deltaX，否则增加配置中的 padding 值。
        node.X +=
          negOffsetX +
          (treeWidth < this.drawArea.clientWidth
            ? deltaX
            : this.CONFIG.padding);
        node.Y +=
          negOffsetY +
          (treeHeight < this.drawArea.clientHeight
            ? deltaY
            : this.CONFIG.padding);

        let collapsedParent = node.collapsedParent(),
          hidePoint = null;
        if (collapsedParent) {
          // 如果节点有被折叠的父节点（collapsedParent），则将节点定位到父节点的连接点之后，并隐藏节点。
          hidePoint = collapsedParent.connectorPoint(true);
          node.hide(hidePoint);
        } else if (node.positioned) {
          // 如果节点已经定位过（node.positioned），则显示节点。
          node.show();
        } else {
          // 如果节点是初始创建的节点，则设置节点的位置。
          node.nodeDOM.style.left = node.X + "px";
          node.nodeDOM.style.top = node.Y + "px";
          node.positioned = true;
        }

        // 如果节点不是根节点且不是隐藏根节点，则调用  setConnectionToParent  方法，建立与父节点的连接。
        if (
          node.id !== 0 &&
          !(node.parent().id === 0 && this.CONFIG.hideRootNode)
        ) {
          this.setConnectionToParent(node, hidePoint); // 跳过根节点
        } else if (!this.CONFIG.hideRootNode && node.drawLineThrough) {
          // 如果不隐藏根节点且节点需要画横线（node.drawLineThrough），则对根节点进行画横线的处理。
          node.drawLineThroughMe();
        }

        // 在定位节点之后，调用  onAfterPositionNode  回调函数。 方便我们处理状态
        self.CONFIG.callback.onAfterPositionNode.apply(self, [
          node,
          i,
          containerCenter,
          treeCenter,
        ]);
      }
      return this;
    },

    /**
     * 根据树的尺寸和配置中的设置，创建 Raphael 实例，并根据需要设置滚动条效果。根据配置的不同，可以选择使用原生的滚动条、jQuery 的 perfect-scrollbar 插件，或者根据绘制区域的尺寸调整大小
     * @param {number} treeWidth
     * @param {number} treeHeight
     * @returns {Tree}
     */
    handleOverflow: function (treeWidth, treeHeight) {
      let viewWidth =
        treeWidth < this.drawArea.clientWidth
          ? this.drawArea.clientWidth
          : treeWidth + this.CONFIG.padding * 2,
        viewHeight =
          treeHeight < this.drawArea.clientHeight
            ? this.drawArea.clientHeight
            : treeHeight + this.CONFIG.padding * 2;

      this._R.setSize(viewWidth, viewHeight);

      if (this.CONFIG.scrollbar === "resize") {
        UTIL.setDimensions(this.drawArea, viewWidth, viewHeight);
      } else if (
        !UTIL.isjQueryAvailable() ||
        this.CONFIG.scrollbar === "native"
      ) {
        if (this.drawArea.clientWidth < treeWidth) {
          // is overflow-x necessary
          this.drawArea.style.overflowX = "auto";
        }

        if (this.drawArea.clientHeight < treeHeight) {
          // is overflow-y necessary
          this.drawArea.style.overflowY = "auto";
        }
      }
      // Fancy scrollbar relies heavily on jQuery, so guarding with if ( $ )
      else if (this.CONFIG.scrollbar === "fancy") {
        let jq_drawArea = $(this.drawArea);
        if (jq_drawArea.hasClass("ps-container")) {
          // znaci da je 'fancy' vec inicijaliziran, treba updateat
          jq_drawArea.find(".Forest").css({
            width: viewWidth,
            height: viewHeight,
          });

          jq_drawArea.perfectScrollbar("update");
        } else {
          let mainContainer = jq_drawArea.wrapInner('<div class="Forest"/>'),
            child = mainContainer.find(".Forest");

          child.css({
            width: viewWidth,
            height: viewHeight,
          });

          mainContainer.perfectScrollbar();
        }
      } // else this.CONFIG.scrollbar == 'None'

      return this;
    },
    /**
     * 用于设置树节点与其父节点之间的连接器。根据节点的属性和配置，创建连接器的路径，并设置连接器的样式。如果连接器已经存在，则更新其几何形状。如果节点需要绘制横穿线，则绘制横穿线。最后，将连接器对象保存到节点的属性中，并返回当前的 Tree 对象。
     * @param {TreeNode} treeNode
     * @param {boolean} hidePoint
     * @returns {Tree}
     */
    setConnectionToParent: function (treeNode, hidePoint) {
      let stacked = treeNode.stackParentId,
        connLine,
        parent = stacked ? this.nodeDB.get(stacked) : treeNode.parent(),
        pathString = hidePoint
          ? this.getPointPathString(hidePoint)
          : this.getPathString(parent, treeNode, stacked);

      if (this.connectionStore[treeNode.id]) {
        // connector already exists, update the connector geometry
        connLine = this.connectionStore[treeNode.id];
        this.animatePath(connLine, pathString);
      } else {
        connLine = this._R.path(pathString);
        console.log("🚀 ~ file: forest.js:974 ~ connLine:", connLine.hide);
        this.connectionStore[treeNode.id] = connLine;

        // don't show connector arrows por pseudo nodes
        if (treeNode.pseudo) {
          delete parent.connStyle.style["arrow-end"];
        }
        if (parent.pseudo) {
          delete parent.connStyle.style["arrow-start"];
        }

        connLine.attr(parent.connStyle.style);

        if (treeNode.drawLineThrough || treeNode.pseudo) {
          treeNode.drawLineThroughMe(hidePoint);
        }
      }
      treeNode.connector = connLine;
      return this;
    },

    /**
     * 创建一个表示为一个点的路径字符串，用于隐藏连接器的起始点。路径字符串的格式为"M x,y L x,y x,y"，其中(x, y)为指定的点坐标。
     * 路径字符串的格式"M x,y L x,y x,y"表示以下内容： 
        - "M x,y"表示将画笔移动到指定的坐标点(x, y)。 
        - "L x,y"表示从当前画笔位置绘制一条直线到指定的坐标点(x, y)。 
        - "x,y x,y"表示再次绘制一条直线到另一个指定的坐标点(x, y)。 
因此，这个路径字符串表示从起始点(x, y)开始，绘制一条直线到第一个指定的坐标点(x, y)，然后再绘制一条直线到第二个指定的坐标点(x, y)。这样就形成了一个隐藏的路径，起始点和终点重合，看起来就像是一个点。
     * @param {object} hidePoint
     * @returns {string}
     */
    getPointPathString: function (hidePoint) {
      return [
        "_M",
        hidePoint.x,
        ",",
        hidePoint.y,
        "L",
        hidePoint.x,
        ",",
        hidePoint.y,
        hidePoint.x,
        ",",
        hidePoint.y,
      ].join(" ");
    },

    /**
     * This method relied on receiving a valid Raphael Paper.path.
     * See: http://dmitrybaranovskiy.github.io/raphael/reference.html#Paper.path
     * A pathString is typically in the format of "M10,20L30,40"
     * @param path
     * @param {string} pathString
     * @returns {Tree}
     */
    animatePath: function (path, pathString) {
      if (path.hidden && pathString.charAt(0) !== "_") {
        // path will be shown, so show it
        path.show();
        path.hidden = false;
      }

      // See: http://dmitrybaranovskiy.github.io/raphael/reference.html#Element.animate
      path.animate(
        {
          path:
            pathString.charAt(0) === "_" ? pathString.substring(1) : pathString, // remove the "_" prefix if it exists
        },
        this.CONFIG.animation.connectorsSpeed,
        this.CONFIG.animation.connectorsAnimation,
        function () {
          if (pathString.charAt(0) === "_") {
            // animation is hiding the path, hide it at the and of animation
            path.hide();
            path.hidden = true;
          }
        }
      );
      return this;
    },

    /**
     *
     * @param {TreeNode} from_node
     * @param {TreeNode} to_node
     * @param {boolean} stacked
     * @returns {string}
     */
    getPathString: function (from_node, to_node, stacked) {
      let startPoint = from_node.connectorPoint(true),
        endPoint = to_node.connectorPoint(false),
        orientation = this.CONFIG.rootOrientation,
        connType = from_node.connStyle.type,
        P1 = {},
        P2 = {};

      if (orientation === "NORTH" || orientation === "SOUTH") {
        P1.y = P2.y = (startPoint.y + endPoint.y) / 2;

        P1.x = startPoint.x;
        P2.x = endPoint.x;
      } else if (orientation === "EAST" || orientation === "WEST") {
        P1.x = P2.x = (startPoint.x + endPoint.x) / 2;

        P1.y = startPoint.y;
        P2.y = endPoint.y;
      }

      // sp, p1, pm, p2, ep == "x,y"
      let sp = startPoint.x + "," + startPoint.y,
        p1 = P1.x + "," + P1.y,
        p2 = P2.x + "," + P2.y,
        ep = endPoint.x + "," + endPoint.y,
        pm = (P1.x + P2.x) / 2 + "," + (P1.y + P2.y) / 2,
        pathString,
        stackPoint;

      if (stacked) {
        // STACKED CHILDREN

        stackPoint =
          orientation === "EAST" || orientation === "WEST"
            ? endPoint.x + "," + startPoint.y
            : startPoint.x + "," + endPoint.y;

        if (connType === "step" || connType === "straight") {
          pathString = ["M", sp, "L", stackPoint, "L", ep];
        } else if (connType === "curve" || connType === "bCurve") {
          let helpPoint, // used for nicer curve lines
            indent = from_node.connStyle.stackIndent;

          if (orientation === "NORTH") {
            helpPoint = endPoint.x - indent + "," + (endPoint.y - indent);
          } else if (orientation === "SOUTH") {
            helpPoint = endPoint.x - indent + "," + (endPoint.y + indent);
          } else if (orientation === "EAST") {
            helpPoint = endPoint.x + indent + "," + startPoint.y;
          } else if (orientation === "WEST") {
            helpPoint = endPoint.x - indent + "," + startPoint.y;
          }
          pathString = ["M", sp, "L", helpPoint, "S", stackPoint, ep];
        }
      } else {
        // NORMAL CHILDREN
        if (connType === "step") {
          pathString = ["M", sp, "L", p1, "L", p2, "L", ep];
        } else if (connType === "curve") {
          pathString = ["M", sp, "C", p1, p2, ep];
        } else if (connType === "bCurve") {
          pathString = ["M", sp, "Q", p1, pm, "T", ep];
        } else if (connType === "straight") {
          pathString = ["M", sp, "L", sp, ep];
        }
      }

      return pathString.join(" ");
    },

    /**
     * 这段代码的作用是在树的布局过程中，为每个节点设置左侧和右侧的相邻节点。通过设置相邻节点，可以在后续的布局过程中确定节点的位置和连接线的绘制。
     * @param {TreeNode} node
     * @param {number} level
     * @returns {Tree}
     */
    setNeighbors: function (node, level) {
      node.leftNeighborId = this.lastNodeOnLevel[level];
      if (node.leftNeighborId) {
        node.leftNeighbor().rightNeighborId = node.id;
      }
      this.lastNodeOnLevel[level] = node.id;
      return this;
    },

    /**
     * 在树的布局过程中，计算每个层级的最大高度和宽度，以便后续的布局操作能够根据这些尺寸信息进行定位。
     * @param {TreeNode} node
     * @param {number} level
     * @returns {Tree}
     */
    calcLevelDim: function (node, level) {
      // root node is on level 0
      this.levelMaxDim[level] = {
        width: Math.max(
          this.levelMaxDim[level] ? this.levelMaxDim[level].width : 0,
          node.width
        ),
        height: Math.max(
          this.levelMaxDim[level] ? this.levelMaxDim[level].height : 0,
          node.height
        ),
      };
      return this;
    },

    /**
     * @returns {Tree}
     */
    resetLevelData: function () {
      this.lastNodeOnLevel = [];
      this.levelMaxDim = [];
      return this;
    },

    /**
     * @returns {TreeNode}
     */
    root: function () {
      return this.nodeDB.get(0);
    },
  };

  /**
   * NodeDB is used for storing the nodes. Each tree has its own NodeDB.
   * @param {object} nodeStructure
   * @param {Tree} tree
   * @constructor
   */
  let NodeDB = function (nodeStructure, tree) {
    this.reset(nodeStructure, tree);
  };
  // 这段代码定义了  NodeDB  对象的一些方法，用于管理节点的存储、创建和遍历。它还包含了一些辅助方法，用于计算树的尺寸和判断节点是否有孙子节点。
  NodeDB.prototype = {
    /**
     * 用于重置  NodeDB  对象的状态。它接受两个参数， nodeStructure  表示节点的结构对象， tree  表示所属的树对象。
     * @param {object} nodeStructure
     * @param {Tree} tree
     * @returns {NodeDB}
     */
    reset: function (nodeStructure, tree) {
      this.db = [];

      let self = this;

      /**
       * 在 iterateChildren 函数中，根据节点的属性创建新的节点对象，并将其添加到数据库中。
       * @param {object} node
       * @param {number} parentId
       */
      function iterateChildren(node, parentId) {
        let newNode = self.createNode(node, parentId, tree, null);

        // 如果节点有子节点，则根据节点的属性进行处理。如果节点设置了 childrenDropLevel 属性且大于0，则创建伪节点（pseudo node）用于连接到下一层级的子节点。每个伪节点继承父节点的连接样式，并设置 children 为一个空数组。
        if (node.children) {
          if (node.childrenDropLevel && node.childrenDropLevel > 0) {
            while (node.childrenDropLevel--) {
              let connStyle = UTIL.cloneObj(newNode.connStyle);
              newNode = self.createNode("pseudo", newNode.id, tree, null);
              newNode.connStyle = connStyle;
              newNode.children = [];
            }
          }

          // 如果节点设置了 stackChildren 属性且没有孙子节点，则创建一个堆叠节点（stack node）。
          let stack =
            node.stackChildren && !self.hasGrandChildren(node)
              ? newNode.id
              : null;

          if (stack !== null) {
            newNode.stackChildren = [];
          }
          for (let i = 0, len = node.children.length; i < len; i++) {
            // 遍历节点的子节点，如果存在堆叠节点，则将子节点添加到堆叠节点中；否则，递归调用 iterateChildren 函数处理子节点。
            if (stack !== null) {
              newNode = self.createNode(
                node.children[i],
                newNode.id,
                tree,
                stack
              );
              if (i + 1 < len) {
                newNode.children = [];
              }
            } else {
              iterateChildren(node.children[i], newNode.id);
            }
          }
        }
      }

      // 如果配置animateOnInit，需要支持展开
      if (tree.CONFIG.animateOnInit) {
        nodeStructure.collapsed = true;
      }

      iterateChildren(nodeStructure, -1); // root node

      // createGeometries 方法遍历节点数据库中的每个节点，并调用节点的 createGeometry 方法创建几何形状。
      this.createGeometries(tree);

      return this;
    },

    /**
     * @param {Tree} tree
     * @returns {NodeDB}
     */
    createGeometries: function (tree) {
      let i = this.db.length;

      while (i--) {
        this.get(i).createGeometry(tree);
      }
      return this;
    },

    /**
     * @param {number} nodeId
     * @returns {TreeNode}
     */
    get: function (nodeId) {
      return this.db[nodeId]; // get TreeNode by ID
    },

    /**
     * @param {function} callback
     * @returns {NodeDB}
     */
    walk: function (callback) {
      let i = this.db.length;

      while (i--) {
        callback.apply(this, [this.get(i)]);
      }
      return this;
    },

    /**
     *
     * @param {object} nodeStructure
     * @param {number} parentId
     * @param {Tree} tree
     * @param {number} stackParentId
     * @returns {TreeNode}
     */
    createNode: function (nodeStructure, parentId, tree, stackParentId) {
      let node = new TreeNode(
        nodeStructure,
        this.db.length,
        parentId,
        tree,
        stackParentId
      );

      this.db.push(node);

      // skip root node (0)
      if (parentId >= 0) {
        let parent = this.get(parentId);

        // todo: refactor into separate private method
        if (nodeStructure.position) {
          if (nodeStructure.position === "left") {
            parent.children.push(node.id);
          } else if (nodeStructure.position === "right") {
            parent.children.splice(0, 0, node.id);
          } else if (nodeStructure.position === "center") {
            parent.children.splice(
              Math.floor(parent.children.length / 2),
              0,
              node.id
            );
          } else {
            // edge case when there's only 1 child
            let position = parseInt(nodeStructure.position);
            if (parent.children.length === 1 && position > 0) {
              parent.children.splice(0, 0, node.id);
            } else {
              parent.children.splice(
                Math.max(position, parent.children.length - 1),
                0,
                node.id
              );
            }
          }
        } else {
          parent.children.push(node.id);
        }
      }

      if (stackParentId) {
        this.get(stackParentId).stackParent = true;
        this.get(stackParentId).stackChildren.push(node.id);
      }

      return node;
    },

    getMinMaxCoord: function (dim, parent, MinMax) {
      // used for getting the dimensions of the tree, dim = 'X' || 'Y'
      // looks for min and max (X and Y) within the set of nodes
      parent = parent || this.get(0);

      MinMax = MinMax || {
        // start with root node dimensions
        min: parent[dim],
        max: parent[dim] + (dim === "X" ? parent.width : parent.height),
      };

      let i = parent.childrenCount();

      while (i--) {
        let node = parent.childAt(i),
          maxTest = node[dim] + (dim === "X" ? node.width : node.height),
          minTest = node[dim];

        if (maxTest > MinMax.max) {
          MinMax.max = maxTest;
        }
        if (minTest < MinMax.min) {
          MinMax.min = minTest;
        }

        this.getMinMaxCoord(dim, node, MinMax);
      }
      return MinMax;
    },

    /**
     * @param {object} nodeStructure
     * @returns {boolean}
     */
    hasGrandChildren: function (nodeStructure) {
      let i = nodeStructure.children.length;
      while (i--) {
        if (
          nodeStructure.children[i].children &&
          nodeStructure.children[i].children.length > 0
        ) {
          return true;
        }
      }
      return false;
    },
  };

  /**
   * -  TreeNode  构造函数接受五个参数： nodeStructure  表示节点的结构对象， id  表示节点的ID， parentId  表示节点的父节点ID， tree  表示节点所属的树对象， stackParentId  表示堆叠子节点的父节点ID。
   * @param {object} nodeStructure
   * @param {number} id
   * @param {number} parentId
   * @param {Tree} tree
   * @param {number} stackParentId
   * @constructor
   */
  let TreeNode = function (nodeStructure, id, parentId, tree, stackParentId) {
    this.reset(nodeStructure, id, parentId, tree, stackParentId);
  };

  TreeNode.prototype = {
    /**
     * @param {object} nodeStructure
     * @param {number} id
     * @param {number} parentId
     * @param {Tree} tree
     * @param {number} stackParentId
     * @returns {TreeNode}
     */
    reset: function (nodeStructure, id, parentId, tree, stackParentId) {
      this.id = id;
      this.parentId = parentId;
      this.treeId = tree.id;

      this.prelim = 0;
      this.modifier = 0;
      this.leftNeighborId = null;

      this.stackParentId = stackParentId;

      // pseudo node is a node with width=height=0, it is invisible, but necessary for the correct positioning of the tree
      this.pseudo = nodeStructure === "pseudo" || nodeStructure["pseudo"]; // todo: surely if nodeStructure is a scalar then the rest will error:

      this.meta = nodeStructure.meta || {};
      this.image = nodeStructure.image || null;

      this.link = UTIL.createMerge(tree.CONFIG.node.link, nodeStructure.link);

      this.connStyle = UTIL.createMerge(
        tree.CONFIG.connectors,
        nodeStructure.connectors
      );
      this.connector = null;

      this.drawLineThrough =
        nodeStructure.drawLineThrough === false
          ? false
          : nodeStructure.drawLineThrough || tree.CONFIG.node.drawLineThrough;

      this.collapsable =
        nodeStructure.collapsable === false
          ? false
          : nodeStructure.collapsable || tree.CONFIG.node.collapsable;
      this.collapsed = nodeStructure.collapsed;

      this.text = nodeStructure.text;

      // '.node' DIV
      this.nodeInnerHTML = nodeStructure.innerHTML;
      this.nodeHTMLclass =
        (tree.CONFIG.node.HTMLclass ? tree.CONFIG.node.HTMLclass : "") + // globally defined class for the nodex
        (nodeStructure.HTMLclass ? " " + nodeStructure.HTMLclass : ""); // + specific node class

      this.nodeHTMLid = nodeStructure.HTMLid;

      this.children = [];

      return this;
    },

    /**
     * @returns {Tree}
     */
    getTree: function () {
      return TreeStore.get(this.treeId);
    },

    /**
     * @returns {object}
     */
    getTreeConfig: function () {
      return this.getTree().CONFIG;
    },

    /**
     * @returns {NodeDB}
     */
    getTreeNodeDb: function () {
      return this.getTree().getNodeDb();
    },

    /**
     * @param {number} nodeId
     * @returns {TreeNode}
     */
    lookupNode: function (nodeId) {
      return this.getTreeNodeDb().get(nodeId);
    },

    /**
     * @returns {Tree}
     */
    Tree: function () {
      return TreeStore.get(this.treeId);
    },

    /**
     * @param {number} nodeId
     * @returns {TreeNode}
     */
    dbGet: function (nodeId) {
      return this.getTreeNodeDb().get(nodeId);
    },

    /**
     * Returns the width of the node
     * @returns {float}
     */
    size: function () {
      let orientation = this.getTreeConfig().rootOrientation;

      if (this.pseudo) {
        // prevents separating the subtrees
        return -this.getTreeConfig().subTeeSeparation;
      }

      if (orientation === "NORTH" || orientation === "SOUTH") {
        return this.width;
      } else if (orientation === "WEST" || orientation === "EAST") {
        return this.height;
      }
    },

    /**
     * @returns {number}
     */
    childrenCount: function () {
      return this.collapsed || !this.children ? 0 : this.children.length;
    },

    /**
     * @param {number} index
     * @returns {TreeNode}
     */
    childAt: function (index) {
      return this.dbGet(this.children[index]);
    },

    /**
     * @returns {TreeNode}
     */
    firstChild: function () {
      return this.childAt(0);
    },

    /**
     * @returns {TreeNode}
     */
    lastChild: function () {
      return this.childAt(this.children.length - 1);
    },

    /**
     * @returns {TreeNode}
     */
    parent: function () {
      return this.lookupNode(this.parentId);
    },

    /**
     * @returns {TreeNode}
     */
    leftNeighbor: function () {
      if (this.leftNeighborId) {
        return this.lookupNode(this.leftNeighborId);
      }
    },

    /**
     * @returns {TreeNode}
     */
    rightNeighbor: function () {
      if (this.rightNeighborId) {
        return this.lookupNode(this.rightNeighborId);
      }
    },

    /**
     * @returns {TreeNode}
     */
    leftSibling: function () {
      let leftNeighbor = this.leftNeighbor();

      if (leftNeighbor && leftNeighbor.parentId === this.parentId) {
        return leftNeighbor;
      }
    },

    /**
     * @returns {TreeNode}
     */
    rightSibling: function () {
      let rightNeighbor = this.rightNeighbor();

      if (rightNeighbor && rightNeighbor.parentId === this.parentId) {
        return rightNeighbor;
      }
    },

    /**
     * @returns {number}
     */
    childrenCenter: function () {
      let first = this.firstChild(),
        last = this.lastChild();

      return first.prelim + (last.prelim - first.prelim + last.size()) / 2;
    },

    /**
     * Find out if one of the node ancestors is collapsed
     * @returns {*}
     */
    collapsedParent: function () {
      let parent = this.parent();
      if (!parent) {
        return false;
      }
      if (parent.collapsed) {
        return parent;
      }
      return parent.collapsedParent();
    },

    /**
     * Returns the leftmost child at specific level, (initial level = 0)
     * @param level
     * @param depth
     * @returns {*}
     */
    leftMost: function (level, depth) {
      if (level >= depth) {
        return this;
      }
      if (this.childrenCount() === 0) {
        return;
      }

      for (let i = 0, n = this.childrenCount(); i < n; i++) {
        let leftmostDescendant = this.childAt(i).leftMost(level + 1, depth);
        if (leftmostDescendant) {
          return leftmostDescendant;
        }
      }
    },

    // returns start or the end point of the connector line, origin is upper-left
    connectorPoint: function (startPoint) {
      let orient = this.Tree().CONFIG.rootOrientation,
        point = {};

      if (this.stackParentId) {
        // return different end point if node is a stacked child
        if (orient === "NORTH" || orient === "SOUTH") {
          orient = "WEST";
        } else if (orient === "EAST" || orient === "WEST") {
          orient = "NORTH";
        }
      }

      // if pseudo, a virtual center is used
      if (orient === "NORTH") {
        point.x = this.pseudo
          ? this.X - this.Tree().CONFIG.subTeeSeparation / 2
          : this.X + this.width / 2;
        point.y = startPoint ? this.Y + this.height : this.Y;
      } else if (orient === "SOUTH") {
        point.x = this.pseudo
          ? this.X - this.Tree().CONFIG.subTeeSeparation / 2
          : this.X + this.width / 2;
        point.y = startPoint ? this.Y : this.Y + this.height;
      } else if (orient === "EAST") {
        point.x = startPoint ? this.X : this.X + this.width;
        point.y = this.pseudo
          ? this.Y - this.Tree().CONFIG.subTeeSeparation / 2
          : this.Y + this.height / 2;
      } else if (orient === "WEST") {
        point.x = startPoint ? this.X + this.width : this.X;
        point.y = this.pseudo
          ? this.Y - this.Tree().CONFIG.subTeeSeparation / 2
          : this.Y + this.height / 2;
      }
      return point;
    },

    /**
     * @returns {string}
     */
    pathStringThrough: function () {
      // get the geometry of a path going through the node
      let startPoint = this.connectorPoint(true),
        endPoint = this.connectorPoint(false);

      return [
        "M",
        startPoint.x + "," + startPoint.y,
        "L",
        endPoint.x + "," + endPoint.y,
      ].join(" ");
    },

    /**
     * @param {object} hidePoint
     */
    drawLineThroughMe: function (hidePoint) {
      // 根据是否存在隐藏点（ hidePoint ），确定要绘制的路径字符串。如果存在隐藏点，则调用 Tree().getPointPathString(hidePoint) 方法获取连接点的路径字符串；否则，调用 pathStringThrough() 方法获取通过节点的路径字符串
      let pathString = hidePoint
        ? this.Tree().getPointPathString(hidePoint)
        : this.pathStringThrough();

      // 创建一个名为 lineThroughMe 的属性，用于存储绘制的横线。如果 lineThroughMe 属性已经存在，则不再创建新的横线。
      this.lineThroughMe =
        this.lineThroughMe || this.Tree()._R.path(pathString);

      // 克隆节点连接线的样式（ connStyle.style ），并删除箭头样式。
      let line_style = UTIL.cloneObj(this.connStyle.style);

      delete line_style["arrow-start"];
      delete line_style["arrow-end"];
      console.log("🚀 ~ file: forest.js:1742 ~ line_style:", line_style);

      this.lineThroughMe.attr(line_style);

      // 如果存在隐藏点，则隐藏横线并将 lineThroughMe.hidden 属性设置为 true
      if (hidePoint) {
        this.lineThroughMe.hide();
        this.lineThroughMe.hidden = true;
      }
    },

    addSwitchEvent: function (nodeSwitch) {
      let self = this;
      UTIL.addEvent(nodeSwitch, "click", function (e) {
        e.preventDefault();
        if (
          self
            .getTreeConfig()
            .callback.onBeforeClickCollapseSwitch.apply(self, [
              nodeSwitch,
              e,
            ]) === false
        ) {
          return false;
        }

        self.toggleCollapse();

        self
          .getTreeConfig()
          .callback.onAfterClickCollapseSwitch.apply(self, [nodeSwitch, e]);
      });
    },

    /**
     * @returns {TreeNode}
     */
    collapse: function () {
      if (!this.collapsed) {
        this.toggleCollapse();
      }
      return this;
    },

    /**
     * @returns {TreeNode}
     */
    expand: function () {
      if (this.collapsed) {
        this.toggleCollapse();
      }
      return this;
    },

    /**
     * @returns {TreeNode}
     */
    toggleCollapse: function () {
      let oTree = this.getTree();

      if (!oTree.inAnimation) {
        oTree.inAnimation = true;

        this.collapsed = !this.collapsed; // toggle the collapse at each click
        UTIL.toggleClass(this.nodeDOM, "collapsed", this.collapsed);

        oTree.positionTree();

        let self = this;

        setTimeout(
          function () {
            // set the flag after the animation
            oTree.inAnimation = false;
            oTree.CONFIG.callback.onToggleCollapseFinished.apply(oTree, [
              self,
              self.collapsed,
            ]);
          },
          oTree.CONFIG.animation.nodeSpeed >
            oTree.CONFIG.animation.connectorsSpeed
            ? oTree.CONFIG.animation.nodeSpeed
            : oTree.CONFIG.animation.connectorsSpeed
        );
      }
      return this;
    },

    hide: function (collapse_to_point) {
      collapse_to_point = collapse_to_point || false;

      let bCurrentState = this.hidden;
      this.hidden = true;

      this.nodeDOM.style.overflow = "hidden";

      let tree = this.getTree(),
        config = this.getTreeConfig(),
        oNewState = {
          opacity: 0,
        };

      if (collapse_to_point) {
        oNewState.left = collapse_to_point.x;
        oNewState.top = collapse_to_point.y;
      }

      // if parent was hidden in initial configuration, position the node behind the parent without animations
      if (!this.positioned || bCurrentState) {
        this.nodeDOM.style.visibility = "hidden";
        if ($) {
          $(this.nodeDOM).css(oNewState);
        } else {
          this.nodeDOM.style.left = oNewState.left + "px";
          this.nodeDOM.style.top = oNewState.top + "px";
        }
        this.positioned = true;
      } else {
        // todo: fix flashy bug when a node is manually hidden and tree.redraw is called.
        if ($) {
          $(this.nodeDOM).animate(
            oNewState,
            config.animation.nodeSpeed,
            config.animation.nodeAnimation,
            function () {
              this.style.visibility = "hidden";
            }
          );
        } else {
          this.nodeDOM.style.transition =
            "all " + config.animation.nodeSpeed + "ms ease";
          this.nodeDOM.style.transitionProperty = "opacity, left, top";
          this.nodeDOM.style.opacity = oNewState.opacity;
          this.nodeDOM.style.left = oNewState.left + "px";
          this.nodeDOM.style.top = oNewState.top + "px";
          this.nodeDOM.style.visibility = "hidden";
        }
      }

      // animate the line through node if the line exists
      if (this.lineThroughMe) {
        let new_path = tree.getPointPathString(collapse_to_point);
        if (bCurrentState) {
          // update without animations
          this.lineThroughMe.attr({ path: new_path });
        } else {
          // update with animations
          tree.animatePath(
            this.lineThroughMe,
            tree.getPointPathString(collapse_to_point)
          );
        }
      }

      return this;
    },

    /**
     * @returns {TreeNode}
     */
    hideConnector: function () {
      let oTree = this.Tree();
      let oPath = oTree.connectionStore[this.id];
      if (oPath) {
        oPath.animate(
          { opacity: 0 },
          oTree.CONFIG.animation.connectorsSpeed,
          oTree.CONFIG.animation.connectorsAnimation
        );
      }
      return this;
    },

    show: function () {
      this.hidden = false;

      this.nodeDOM.style.visibility = "visible";

      let oTree = this.Tree();

      let oNewState = {
        left: this.X,
        top: this.Y,
        opacity: 1,
      },
        config = this.getTreeConfig();

      // if the node was hidden, update opacity and position
      if ($) {
        $(this.nodeDOM).animate(
          oNewState,
          config.animation.nodeSpeed,
          config.animation.nodeAnimation,
          function () {
            // $.animate applies "overflow:hidden" to the node, remove it to avoid visual problems
            this.style.overflow = "";
          }
        );
      } else {
        this.nodeDOM.style.transition =
          "all " + config.animation.nodeSpeed + "ms ease";
        this.nodeDOM.style.transitionProperty = "opacity, left, top";
        this.nodeDOM.style.left = oNewState.left + "px";
        this.nodeDOM.style.top = oNewState.top + "px";
        this.nodeDOM.style.opacity = oNewState.opacity;
        this.nodeDOM.style.overflow = "";
      }

      if (this.lineThroughMe) {
        this.getTree().animatePath(
          this.lineThroughMe,
          this.pathStringThrough()
        );
      }

      return this;
    },

    /**
     * @returns {TreeNode}
     */
    showConnector: function () {
      let oTree = this.Tree();
      let oPath = oTree.connectionStore[this.id];
      if (oPath) {
        oPath.animate(
          { opacity: 1 },
          oTree.CONFIG.animation.connectorsSpeed,
          oTree.CONFIG.animation.connectorsAnimation
        );
      }
      return this;
    },
  };

  /**
   * Build a node from the 'text' and 'img' property and return with it.
   *
   * The node will contain all the fields that present under the 'text' property
   * Each field will refer to a css class with name defined as node-{$property_name}
   *
   * 该方法根据 text 属性的配置，构建了一个包含了不同字段的节点。每个字段对应一个 CSS 类名，类名的命名规则为 node-{$property_name} 。通过这种方式，可以根据配置的 text 属性，灵活地构建节点的内容。
   *
   * Example:
   * The definition:
   *
   *   text: {
   *     desc: "some description",
   *     paragraph: "some text"
   *   }
   *
   * will generate the following elements:
   *
   *   <p class="node-desc">some description</p>
   *   <p class="node-paragraph">some text</p>
   *
   * @Returns the configured node
   */
  TreeNode.prototype.buildNodeFromText = function (node) {
    // IMAGE
    if (this.image) {
      image = document.createElement("img");
      image.src = this.image;
      node.appendChild(image);
    }

    // TEXT
    if (this.text) {
      for (let key in this.text) {
        // adding DATA Attributes to the node
        if (key.startsWith("data-")) {
          node.setAttribute(key, this.text[key]);
        } else {
          let textElement = document.createElement(
            this.text[key].href ? "a" : "p"
          );

          // make an <a> element if required
          if (this.text[key].href) {
            textElement.href = this.text[key].href;
            if (this.text[key].target) {
              textElement.target = this.text[key].target;
            }
          }

          textElement.className = "node-" + key;
          textElement.appendChild(
            document.createTextNode(
              this.text[key].val
                ? this.text[key].val
                : this.text[key] instanceof Object
                  ? "'val' param missing!"
                  : this.text[key]
            )
          );

          node.appendChild(textElement);
        }
      }
    }
    return node;
  };

  /**
   * Build a node from  'nodeInnerHTML' property that defines an existing HTML element, referenced by it's id, e.g: #someElement
   * Change the text in the passed node to 'Wrong ID selector' if the referenced element does ot exist,
   * return with a cloned and configured node otherwise
   *
   * @Returns node the configured node
   */
  TreeNode.prototype.buildNodeFromHtml = function (node) {
    // get some element by ID and clone its structure into a node
    if (this.nodeInnerHTML.charAt(0) === "#") {
      let elem = document.getElementById(this.nodeInnerHTML.substring(1));
      if (elem) {
        node = elem.cloneNode(true);
        node.id += "-clone";
        node.className += " node";
      } else {
        node.innerHTML = "<b> Wrong ID selector </b>";
      }
    } else {
      // insert your custom HTML into a node
      node.innerHTML = this.nodeInnerHTML;
    }
    return node;
  };

  /**
   * @param {Tree} tree
   */
  TreeNode.prototype.createGeometry = function (tree) {
    // 检查节点的ID是否为0且配置中设置了隐藏根节点（ tree.CONFIG.hideRootNode ）。如果满足条件，将节点的宽度和高度设置为0，并直接返回。
    if (this.id === 0 && tree.CONFIG.hideRootNode) {
      this.width = 0;
      this.height = 0;
      return;
    }

    let drawArea = tree.drawArea,
      image,
      // 创建链接节点，根据链接属性决定使用  <a>  元素还是  <div>  元素。
      node = document.createElement(this.link.href ? "a" : "div");

    node.className = !this.pseudo ? TreeNode.CONFIG.nodeHTMLclass : "pseudo";
    if (this.nodeHTMLclass && !this.pseudo) {
      node.className += " " + this.nodeHTMLclass;
    }

    if (this.nodeHTMLid) {
      node.id = this.nodeHTMLid;
    }

    if (this.link.href) {
      node.href = this.link.href;
      node.target = this.link.target;
    }

    node.data = {
      treenode: this,
    };

    // 构建节点的内容，根据节点是否有自定义的HTML内容（ this.nodeInnerHTML ）来决定使用哪种方式构建节点的内容。
    if (!this.pseudo) {
      node = this.nodeInnerHTML
        ? this.buildNodeFromHtml(node)
        : this.buildNodeFromText(node);

      // 如果节点不是伪节点，则处理折叠开关的情况。如果节点已折叠（ this.collapsed ），或者可折叠且有子节点且不是堆叠父节点（ this.collapsable && this.childrenCount() && !this.stackParentId ），则创建折叠开关的几何形状。
      if (
        this.collapsed ||
        (this.collapsable && this.childrenCount() && !this.stackParentId)
      ) {
        this.createSwitchGeometry(tree, node);
      }
    }

    // 调用周期函数  onCreateNode ，并传入当前树对象和节点作为参数。
    tree.CONFIG.callback.onCreateNode.apply(tree, [this, node]);

    // 添加到根节点渲染
    drawArea.appendChild(node);

    this.width = node.offsetWidth;
    this.height = node.offsetHeight;

    this.nodeDOM = node;

    // 调用图像加载器的  processNode  方法，处理节点的图像。
    tree.imageLoader.processNode(this);
  };

  /**
   * @param {Tree} tree
   * @param {Element} nodeEl
   */
  TreeNode.prototype.createSwitchGeometry = function (tree, nodeEl) {
    nodeEl = nodeEl || this.nodeDOM;

    // safe guard and check to see if it has a collapse switch
    let nodeSwitchEl = UTIL.findEl(".collapse-switch", true, nodeEl);
    if (!nodeSwitchEl) {
      nodeSwitchEl = document.createElement("a");
      nodeSwitchEl.className = "collapse-switch";

      nodeEl.appendChild(nodeSwitchEl);
      this.addSwitchEvent(nodeSwitchEl);
      if (this.collapsed) {
        nodeEl.className += " collapsed";
      }
      nodeSwitchEl.innerHTML = "-";

      tree.CONFIG.callback.onCreateNodeCollapseSwitch.apply(tree, [
        this,
        nodeEl,
        nodeSwitchEl,
      ]);
    }
    return nodeSwitchEl;
  };

  // ###########################################
  //      Expose global + default CONFIG params
  // ###########################################

  Tree.CONFIG = {
    maxDepth: 100,
    rootOrientation: "NORTH", // NORTH || EAST || WEST || SOUTH
    nodeAlign: "CENTER", // CENTER || TOP || BOTTOM
    levelSeparation: 30,
    siblingSeparation: 30,
    subTeeSeparation: 30,

    hideRootNode: false,

    animateOnInit: false,
    animateOnInitDelay: 500,

    padding: 15, // the difference is seen only when the scrollbar is shown
    scrollbar: "native", // "native" || "fancy" || "None" (PS: "fancy" requires jquery and perfect-scrollbar)

    connectors: {
      type: "curve", // 'curve' || 'step' || 'straight' || 'bCurve'
      style: {
        stroke: "black",
      },
      stackIndent: 15,
    },

    node: {
      // each node inherits this, it can all be overridden in node config

      // HTMLclass: 'node',
      // drawLineThrough: false,
      // collapsable: false,
      link: {
        target: "_self",
      },
    },

    animation: {
      // each node inherits this, it can all be overridden in node config
      nodeSpeed: 450,
      nodeAnimation: "linear",
      connectorsSpeed: 450,
      connectorsAnimation: "linear",
    },

    callback: {
      onCreateNode: function (treeNode, treeNodeDom) { }, // this = Tree
      onCreateNodeCollapseSwitch: function (
        treeNode,
        treeNodeDom,
        switchDom
      ) { }, // this = Tree
      onAfterAddNode: function (newTreeNode, parentTreeNode, nodeStructure) { }, // this = Tree
      onBeforeAddNode: function (parentTreeNode, nodeStructure) { }, // this = Tree
      onAfterPositionNode: function (
        treeNode,
        nodeDbIndex,
        containerCenter,
        treeCenter
      ) { }, // this = Tree
      onBeforePositionNode: function (
        treeNode,
        nodeDbIndex,
        containerCenter,
        treeCenter
      ) { }, // this = Tree
      onToggleCollapseFinished: function (treeNode, bIsCollapsed) { }, // this = Tree
      onAfterClickCollapseSwitch: function (nodeSwitch, event) { }, // this = TreeNode
      onBeforeClickCollapseSwitch: function (nodeSwitch, event) { }, // this = TreeNode
      onTreeLoaded: function (rootTreeNode) { }, // this = Tree
    },
  };

  TreeNode.CONFIG = {
    nodeHTMLclass: "node",
  };

  // #############################################
  // Makes a JSON chart config out of Array config
  // #############################################

  let JSONconfig = {
    make: function (configArray) {
      let i = configArray.length,
        node;

      this.jsonStructure = {
        chart: null,
        nodeStructure: null,
      };
      //fist loop: find config, find root;
      while (i--) {
        node = configArray[i];
        if (node.hasOwnProperty("container")) {
          this.jsonStructure.chart = node;
          continue;
        }

        if (
          !node.hasOwnProperty("parent") &&
          !node.hasOwnProperty("container")
        ) {
          this.jsonStructure.nodeStructure = node;
          node._json_id = 0;
        }
      }

      this.findChildren(configArray);

      return this.jsonStructure;
    },

    findChildren: function (nodes) {
      let parents = [0]; // start with a a root node

      while (parents.length) {
        let parentId = parents.pop(),
          parent = this.findNode(this.jsonStructure.nodeStructure, parentId),
          i = 0,
          len = nodes.length,
          children = [];

        for (; i < len; i++) {
          let node = nodes[i];
          if (node.parent && node.parent._json_id === parentId) {
            // skip config and root nodes

            node._json_id = this.getID();

            delete node.parent;

            children.push(node);
            parents.push(node._json_id);
          }
        }

        if (children.length) {
          parent.children = children;
        }
      }
    },

    findNode: function (node, nodeId) {
      let childrenLen, found;

      if (node._json_id === nodeId) {
        return node;
      } else if (node.children) {
        childrenLen = node.children.length;
        while (childrenLen--) {
          found = this.findNode(node.children[childrenLen], nodeId);
          if (found) {
            return found;
          }
        }
      }
    },

    getID: (function () {
      let i = 1;
      return function () {
        return i++;
      };
    })(),
  };

  const Forest = function (jsonConfig, callback) {
    if (jsonConfig instanceof Array) {
      jsonConfig = JSONconfig.make(jsonConfig);
    }

    this.tree = TreeStore.createTree(jsonConfig);
    this.tree.positionTree(callback);

    let doms = document.querySelectorAll(".collapse-switch");
    doms.forEach((dom) => {
      dom.onclick = (e) => {
        e.target.innerHTML = e.target.innerHTML === "-" ? "+" : "-";
        console.log(e.target.innerHTML);
      };
    });
  };

  Forest.prototype.destroy = function () {
    TreeStore.destroy(this.tree.id);
  };

  window.Forest = Forest;
})();
