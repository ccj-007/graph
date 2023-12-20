(function () {
    let $ = null;
    // 方法集
    let Utils = {
        /**
         * 深拷贝
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
         * 对象合并
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
         *  继承属性
         * @returns {*}
         */
        extend: function () {
            return Utils.createMerge.apply(this, arguments);
        },

        /**
         * 深拷贝
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
         * 兼容性自定义事件
         * @param {Element} el
         * @param {string} eventType
         * @param {function} handler
         */
        addEvent: function (el, eventType, handler) {
            if (el.addEventListener) {
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
         * 查找dom元素
         * @param {string} selector
         * @param {boolean} raw
         * @param {Element} parentEl
         * @returns {Element|jQuery}
         */
        findEl: function (selector, raw, parentEl) {
            parentEl = parentEl || document;
            if (selector.charAt(0) === "#") {
                return parentEl.getElementById(selector.substring(1));
            } else if (selector.charAt(0) === ".") {
                let oElements = parentEl.getElementsByClassName(
                    selector.substring(1)
                );
                return oElements.length ? oElements[0] : null;
            }

            throw new Error("Unknown container element");
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
                    Utils.getStyle(element, "border-top-width", true) +
                    Utils.getStyle(element, "border-bottom-width", true) +
                    Utils.getStyle(element, "padding-top", true) +
                    Utils.getStyle(element, "padding-bottom", true) +
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
                    Utils.getStyle(element, "border-left-width", true) +
                    Utils.getStyle(element, "border-right-width", true) +
                    Utils.getStyle(element, "padding-left", true) +
                    Utils.getStyle(element, "padding-right", true) +
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
            return asInt ? parseFloat(strValue) : strValue;
        },

        addClass: function (element, cssClass) {
            if ($) {
                $(element).addClass(cssClass);
            } else {
                if (!Utils.hasClass(element, cssClass)) {
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
        }
    };

    /**
     * 用于管理树中的图片加载，提供了方法来处理图片加载、移除加载任务、判断加载状态等。它可以确保在所有图片加载完成后，获取节点的正确大小。
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

                Utils.addEvent(image, "load", imgTrigger);
                Utils.addEvent(image, "error", imgTrigger);

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
     *  管理多个独立的树。
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
     * 构造树
     * @param {object} jsonConfig
     * @param {number} treeId
     * @constructor
     */
    let Tree = function (jsonConfig, treeId) {

        this.reset = function (jsonConfig, treeId) {
            this.initJsonConfig = jsonConfig;
            this.initTreeId = treeId;

            this.id = treeId;

            this.CONFIG = Utils.extend(Tree.CONFIG, jsonConfig.chart);
            this.drawArea = Utils.findEl(this.CONFIG.container, true);


            Utils.addClass(this.drawArea, "Forest");

            // 清空绘制区域的内容
            this.drawArea.innerHTML = "";

            // 用于加载树节点的图片。
            this.imageLoader = new ImageLoader();

            // 用于管理树节点的数据库。
            this.nodeDB = new NodeDB(jsonConfig.nodeStructure, this);

            // 用于存储节点连接器的引用
            this.connectionStore = {};

            this.loaded = false;

            //  创建一个 Raphael 对象，用于绘制树的图形，比如线条
            this._R = new Raphael(this.drawArea, 100, 100);

            return this;
        };

        /**
         * 重绘
         * @returns {Tree}
         */
        this.reload = function () {
            this.reset(this.initJsonConfig, this.initTreeId).redraw();
            return this;
        };

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
         * 向树结构中添加一个新节点
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
                    Utils.addClass(this.drawArea, "Forest-loaded");
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
         * 树布局算法中的第一次后序遍历（post-order walk）的实现。在遍历过程中，为树的每个节点分配了一个初步的 x 坐标（保存在节点的 prelim 属性中），同时为内部节点分配了修正值（modifier），用于将它们的子节点向右移动。
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
         * 用于调整小型兄弟子树的位置。兄弟子树是独立形成的，并尽可能地靠近放置。
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
                // 计算首个节点的位置
                let modifierSumRight = 0,
                    modifierSumLeft = 0,
                    leftAncestor = firstChildLeftNeighbor,
                    rightAncestor = firstChild;

                for (let i = 0; i < compareDepth; i++) {
                    leftAncestor = leftAncestor.parent();
                    rightAncestor = rightAncestor.parent();
                    modifierSumLeft += leftAncestor.modifier;
                    modifierSumRight += rightAncestor.modifier;

                    if (rightAncestor.stackParent !== undefined) {
                        modifierSumRight += rightAncestor.size() / 2;
                    }
                }

                // 找到两棵树之间的间隙，并将其应用于子树 ，将更小的间隙匹配到更小的子树

                let totalGap =
                    firstChildLeftNeighbor.prelim +
                    modifierSumLeft +
                    firstChildLeftNeighbor.size() +
                    this.CONFIG.subTeeSeparation -
                    (firstChild.prelim + modifierSumRight);

                if (totalGap > 0) {
                    let subtreeAux = node,
                        numSubtrees = 0;

                    // 计算LeftSibling 中的所有子树
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
         */
        secondWalk: function (node, level, X, Y) {
            // 判断当前层级（level）是否超过了最大层级
            if (level > this.CONFIG.maxDepth) {
                return;
            }

            // 根据当前节点的 prelim 值（node.prelim）和修正值（X），计算出节点的 x 坐标（xTmp），并将其赋值给节点的 X 属性。
            let xTmp = node.prelim + X,
                yTmp = Y,
                align = this.CONFIG.nodeAlign,
                orient = this.CONFIG.rootOrientation,
                levelHeight,
                nodesizeTmp;

            // 根据树的方向（orient）和对齐方式（align），计算出当前层级的高度（levelHeight）和节点的尺寸（nodesizeTmp）
            if (orient === "NORTH" || orient === "SOUTH") {
                levelHeight = this.levelMaxDim[level].height;
                nodesizeTmp = node.height;
                if (node.pseudo) {
                    node.height = levelHeight;
                }
            } else if (orient === "WEST" || orient === "EAST") {
                levelHeight = this.levelMaxDim[level].width;
                nodesizeTmp = node.width;
                if (node.pseudo) {
                    node.width = levelHeight;
                }
            }

            node.X = xTmp;

            // 根据树的方向，为节点计算 y 坐标（yTmp）并赋值给节点的 Y 属性。如果节点是伪节点（pseudo），则需要特殊处理，根据方向选择对齐方式。 
            if (node.pseudo) {
                if (orient === "NORTH" || orient === "WEST") {
                    node.Y = yTmp;
                } else if (orient === "SOUTH" || orient === "EAST") {
                    node.Y = yTmp + (levelHeight - nodesizeTmp);
                }
            } else {
                node.Y =
                    align === "CENTER"
                        ? yTmp + (levelHeight - nodesizeTmp) / 2
                        : align === "TOP"
                            ? yTmp + (levelHeight - nodesizeTmp)
                            : yTmp;
            }

            // 如果树的方向是 WEST 或 EAST，则交换节点的 X 和 Y 坐标，以实现横向布局。 
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
            // 如果节点有子节点，则递归调用 secondWalk 方法计算子节点的位置。根据是否隐藏根节点（this.CONFIG.hideRootNode）来决定是否将子节点的 Y 坐标向下移动一定距离（levelHeight + this.CONFIG.levelSeparation）。
            if (node.childrenCount() !== 0) {
                if (node.id === 0 && this.CONFIG.hideRootNode) {

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
            // 如果节点有右侧兄弟节点，则递归调用 secondWalk 方法计算右侧兄弟节点的位置。 
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
                // 根据树的坐标情况，计算 X 和 Y 坐标的偏移量，确保所有节点的坐标都是正数。
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
            return this; //注意要返回this，方便链式调用
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
                Utils.setDimensions(this.drawArea, viewWidth, viewHeight);
            }
            else if (this.CONFIG.scrollbar === "fancy") {
                let jq_drawArea = $(this.drawArea);
                if (jq_drawArea.hasClass("ps-container")) {
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
            }

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
                connLine = this.connectionStore[treeNode.id];
                this.animatePath(connLine, pathString);
            } else {
                connLine = this._R.path(pathString);
                this.connectionStore[treeNode.id] = connLine;

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
         * 创建一个表示为一个点的路径字符串，用于隐藏连接器的起始点。路径字符串的格式为"M x,y L x,y x,y"
         * 路径字符串的格式"M x,y L x,y x,y"表示以下内容： 
            - "M x,y"表示将画笔移动到指定的坐标点(x, y)。 
            - "L x,y"表示从当前画笔位置绘制一条直线到指定的坐标点(x, y)。 
            - "x,y" 此时绘制到起始点 也就是开始点和终点重合。 
    
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
         *  Raphael 的路径动画
         * @param path
         * @param {string} pathString
         * @returns {Tree}
         */
        animatePath: function (path, pathString) {
            if (path.hidden && pathString.charAt(0) !== "_") {
                path.show();
                path.hidden = false;
            }

            path.animate(
                {
                    path:
                        pathString.charAt(0) === "_" ? pathString.substring(1) : pathString,
                },
                this.CONFIG.animation.connectorsSpeed,
                this.CONFIG.animation.connectorsAnimation,
                function () {
                    if (pathString.charAt(0) === "_") {
                        path.hide();
                        path.hidden = true;
                    }
                }
            );
            return this;
        },

        /**
         * 生成两个节点之间连接线的路径字符串
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
                stackPoint =
                    orientation === "EAST" || orientation === "WEST"
                        ? endPoint.x + "," + startPoint.y
                        : startPoint.x + "," + endPoint.y;

                if (connType === "step" || connType === "straight") {
                    pathString = ["M", sp, "L", stackPoint, "L", ep];
                } else if (connType === "curve" || connType === "bCurve") {
                    let helpPoint,
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
     * 管理节点的数据
     * @param {object} nodeStructure
     * @param {Tree} tree
     * @constructor
     */
    let NodeDB = function (nodeStructure, tree) {
        this.reset(nodeStructure, tree);
    };
    NodeDB.prototype = {
        /**
         * 重置  NodeDB  对象的状态
         * @param {object} nodeStructure
         * @param {Tree} tree
         * @returns {NodeDB}
         */
        reset: function (nodeStructure, tree) {
            this.db = [];

            let self = this;

            /**
             * 迭代子节点
             * @param {object} node
             * @param {number} parentId
             */
            function iterateChildren(node, parentId) {
                // 通过 createNode 创建树节点
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
                    // 遍历子节点
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
         * 创建图形
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
            return this.db[nodeId];
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
         * 创建节点
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

            // 跳过根节点
            if (parentId >= 0) {
                let parent = this.get(parentId);

                // 根据情况插入节点位置
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
                        // 只有一个节点
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

            // 堆叠节点处理位置
            if (stackParentId) {
                this.get(stackParentId).stackParent = true;
                this.get(stackParentId).stackChildren.push(node.id);
            }

            return node;
        },

        /**
         * 在树结构中查找指定维度（'X' 或 'Y'）上的最小和最大坐标
         * @param {*} dim 
         * @param {*} parent 
         * @param {*} MinMax 
         * @returns 
         */
        getMinMaxCoord: function (dim, parent, MinMax) {
            parent = parent || this.get(0);

            MinMax = MinMax || {
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
         * 判断一个节点的子节点中是否存在至少一个具有子节点的节点（孙节点）
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
     * - TreeNode  构造函数接受五个参数： nodeStructure  表示节点的结构对象， id  表示节点的ID， parentId  表示节点的父节点ID， tree  表示节点所属的树对象， stackParentId  表示堆叠子节点的父节点ID。
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
         * 
         * 将节点的属性重新设置为指定的值
         * @param {object} nodeStructure
         * @param {number} id
         * @param {number} parentId
         * @param {Tree} tree
         * @param {number} stackParentId
         * @returns {TreeNode}
         */
        reset: function (nodeStructure, id, parentId, tree, stackParentId) {

            // 基本属性的重置
            this.id = id;
            this.parentId = parentId;
            this.treeId = tree.id;

            this.prelim = 0;
            this.modifier = 0;
            this.leftNeighborId = null;

            this.stackParentId = stackParentId;

            this.pseudo = nodeStructure === "pseudo" || nodeStructure["pseudo"];

            this.meta = nodeStructure.meta || {};
            this.image = nodeStructure.image || null;

            this.link = Utils.createMerge(tree.CONFIG.node.link, nodeStructure.link);

            this.connStyle = Utils.createMerge(
                tree.CONFIG.connectors,
                nodeStructure.connectors
            );
            this.connector = null;

            // 绘制线条和折叠属性的重置
            this.drawLineThrough =
                nodeStructure.drawLineThrough === false
                    ? false
                    : nodeStructure.drawLineThrough || tree.CONFIG.node.drawLineThrough;

            this.collapsable =
                nodeStructure.collapsable === false
                    ? false
                    : nodeStructure.collapsable || tree.CONFIG.node.collapsable;
            this.collapsed = nodeStructure.collapsed;

            // 文本重置
            this.text = nodeStructure.text;

            // 节点样式和内容的重置
            this.nodeInnerHTML = nodeStructure.innerHTML;
            this.nodeHTMLclass =
                (tree.CONFIG.node.HTMLclass ? tree.CONFIG.node.HTMLclass : "") +
                (nodeStructure.HTMLclass ? " " + nodeStructure.HTMLclass : "");

            this.nodeHTMLid = nodeStructure.HTMLid;

            // 子节点的重置
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
         * 返回节点尺寸
         * @returns {float}
         */
        size: function () {
            let orientation = this.getTreeConfig().rootOrientation;

            if (this.pseudo) {
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
         * 节点是否已展开
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
         * 查找树节点在特定层级（从树的顶级开始，初始层级为0）上的最左侧子节点。
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

        // 用于计算连接线的起始点或终点位置
        connectorPoint: function (startPoint) {
            // 获取树的朝向
            let orient = this.Tree().CONFIG.rootOrientation,
                point = {};

            // 处理堆叠子节点
            if (this.stackParentId) {
                if (orient === "NORTH" || orient === "SOUTH") {
                    orient = "WEST";
                } else if (orient === "EAST" || orient === "WEST") {
                    orient = "NORTH";
                }
            }

            // 根据是否是伪节点生成最终的坐标
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
         * 生成一个 SVG 路径字符串
         * @returns {string}
         */
        pathStringThrough: function () {
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
         * 在节点上绘制一条横贯节点的线
         * @param {object} hidePoint
         */
        drawLineThroughMe: function (hidePoint) {
            let pathString = hidePoint
                ? this.Tree().getPointPathString(hidePoint)
                : this.pathStringThrough();

            this.lineThroughMe =
                this.lineThroughMe || this.Tree()._R.path(pathString);

            let line_style = Utils.cloneObj(this.connStyle.style);

            delete line_style["arrow-start"];
            delete line_style["arrow-end"];

            this.lineThroughMe.attr(line_style);

            if (hidePoint) {
                this.lineThroughMe.hide();
                this.lineThroughMe.hidden = true;
            }
        },

        addSwitchEvent: function (nodeSwitch) {
            let self = this;
            Utils.addEvent(nodeSwitch, "click", function (e) {
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
         * 折叠
         * @returns {TreeNode}
         */
        collapse: function () {
            if (!this.collapsed) {
                this.toggleCollapse();
            }
            return this;
        },

        /**
         * 展开
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

                this.collapsed = !this.collapsed;
                Utils.toggleClass(this.nodeDOM, "collapsed", this.collapsed);

                oTree.positionTree();

                let self = this;

                setTimeout(
                    function () {
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

            if (this.lineThroughMe) {
                let new_path = tree.getPointPathString(collapse_to_point);
                if (bCurrentState) {
                    this.lineThroughMe.attr({ path: new_path });
                } else {
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

            if ($) {
                $(this.nodeDOM).animate(
                    oNewState,
                    config.animation.nodeSpeed,
                    config.animation.nodeAnimation,
                    function () {
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
     * 根据给定节点的 text 属性的配置，构建一个包含不同字段的节点
     *
     *   text: {
     *     desc: "some description",
     *     paragraph: "some text"
     *   }
     *
     *   -> 
     * 
     *   <p class="node-desc">some description</p>
     *   <p class="node-paragraph">some text</p>
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
                if (key.startsWith("data-")) {
                    node.setAttribute(key, this.text[key]);
                } else {
                    let textElement = document.createElement(
                        this.text[key].href ? "a" : "p"
                    );

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
     * 根据html构建新的节点
     * @Returns node
     */
    TreeNode.prototype.buildNodeFromHtml = function (node) {
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
            node.innerHTML = this.nodeInnerHTML;
        }
        return node;
    };

    /**
     * @param {Tree} tree
     */
    TreeNode.prototype.createGeometry = function (tree) {
        if (this.id === 0 && tree.CONFIG.hideRootNode) {
            this.width = 0;
            this.height = 0;
            return;
        }

        let drawArea = tree.drawArea,
            image,
            // 创建dom节点
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

        if ($) {
            $(node).data("treenode", this);
        } else {
            node.data = {
                treenode: this,
            };
        }

        // 构建节点内容
        if (!this.pseudo) {
            node = this.nodeInnerHTML
                ? this.buildNodeFromHtml(node)
                : this.buildNodeFromText(node);

            if (
                this.collapsed ||
                (this.collapsable && this.childrenCount() && !this.stackParentId)
            ) {
                this.createSwitchGeometry(tree, node);
            }
        }

        tree.CONFIG.callback.onCreateNode.apply(tree, [this, node]);

        drawArea.appendChild(node);

        this.width = node.offsetWidth;
        this.height = node.offsetHeight;

        this.nodeDOM = node;

        tree.imageLoader.processNode(this);
    };

    /**
     * 创建展开节点的元素
     * @param {Tree} tree
     * @param {Element} nodeEl
     */
    TreeNode.prototype.createSwitchGeometry = function (tree, nodeEl) {
        nodeEl = nodeEl || this.nodeDOM;

        let nodeSwitchEl = Utils.findEl(".collapse-switch", true, nodeEl);
        if (!nodeSwitchEl) {
            nodeSwitchEl = document.createElement("a");
            nodeSwitchEl.className = "collapse-switch";

            nodeEl.appendChild(nodeSwitchEl);
            this.addSwitchEvent(nodeSwitchEl);
            if (this.collapsed) {
                nodeEl.className += " collapsed";
            }

            tree.CONFIG.callback.onCreateNodeCollapseSwitch.apply(tree, [
                this,
                nodeEl,
                nodeSwitchEl,
            ]);
        }
        return nodeSwitchEl;
    };


    // 默认配置
    Tree.CONFIG = {
        maxDepth: 100,
        rootOrientation: "NORTH", // NORTH | EAST | WEST | SOUTH
        nodeAlign: "CENTER", // CENTER | TOP | BOTTOM
        levelSeparation: 30,
        siblingSeparation: 30,
        subTeeSeparation: 30,

        hideRootNode: false,

        animateOnInit: false,
        animateOnInitDelay: 500,

        padding: 15,
        scrollbar: "native", // "native" | "fancy" | "None" 

        connectors: {
            type: "curve", // 'curve' | 'step' | 'straight' | 'bCurve'
            style: {
                stroke: "black",
            },
            stackIndent: 15,
        },

        node: {
            // HTMLclass: 'node',
            // drawLineThrough: false,
            // collapsable: false,
            link: {
                target: "_self",
            },
        },

        animation: {
            nodeSpeed: 450,
            nodeAnimation: "linear",
            connectorsSpeed: 450,
            connectorsAnimation: "linear",
        },

        callback: {
            onCreateNode: function (treeNode, treeNodeDom) { },
            onCreateNodeCollapseSwitch: function (
                treeNode,
                treeNodeDom,
                switchDom
            ) { },
            onAfterAddNode: function (newTreeNode, parentTreeNode, nodeStructure) { },
            onBeforeAddNode: function (parentTreeNode, nodeStructure) { },
            onAfterPositionNode: function (
                treeNode,
                nodeDbIndex,
                containerCenter,
                treeCenter
            ) { },
            onBeforePositionNode: function (
                treeNode,
                nodeDbIndex,
                containerCenter,
                treeCenter
            ) { },
            onToggleCollapseFinished: function (treeNode, bIsCollapsed) { },
            onAfterClickCollapseSwitch: function (nodeSwitch, event) { },
            onBeforeClickCollapseSwitch: function (nodeSwitch, event) { },
            onTreeLoaded: function (rootTreeNode) { },
        },
    };

    TreeNode.CONFIG = {
        nodeHTMLclass: "node",
    };

    // 数组配置转为json配置
    let JSONconfig = {
        make: function (configArray) {
            let i = configArray.length,
                node;

            this.jsonStructure = {
                chart: null,
                nodeStructure: null,
            };
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
            let parents = [0];

            while (parents.length) {
                let parentId = parents.pop(),
                    parent = this.findNode(this.jsonStructure.nodeStructure, parentId),
                    i = 0,
                    len = nodes.length,
                    children = [];

                for (; i < len; i++) {
                    let node = nodes[i];
                    if (node.parent && node.parent._json_id === parentId) {
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

    // 初始化入口
    const Forest = function (jsonConfig, callback) {
        if (jsonConfig instanceof Array) {
            jsonConfig = JSONconfig.make(jsonConfig);
        }

        this.tree = TreeStore.createTree(jsonConfig);
        this.tree.positionTree(callback);
    };

    Forest.prototype.destroy = function () {
        TreeStore.destroy(this.tree.id);
    };

    window.Forest = Forest;
})();
