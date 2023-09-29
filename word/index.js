var examples = {
    'red-chamber': {
        list: '6 紅樓夢\n3 賈寶玉\n3 林黛玉\n3 薛寶釵\n3 王熙鳳\n3 李紈\n3 賈元春\n3 賈迎春\n' +
            '3 賈探春\n3 賈惜春\n3 秦可卿\n3 賈巧姐\n3 史湘雲\n3 妙玉\n2 賈政\n2 賈赦\n' +
            '2 賈璉\n2 賈珍\n2 賈環\n2 賈母\n2 王夫人\n2 薛姨媽\n2 尤氏\n2 平兒\n2 鴛鴦\n' +
            '2 襲人\n2 晴雯\n2 香菱\n2 紫鵑\n2 麝月\n2 小紅\n2 金釧\n2 甄士隱\n2 賈雨村',
        option: '{\n' +
            '  gridSize: 8,\n' +
            '  weightFactor: 16,\n' +
            '  fontFamily: \'Hiragino Mincho Pro, serif\',\n' +
            '  color: \'random-dark\',\n' +
            '  backgroundColor: \'#f0f0f0\',\n' +
            '  rotateRatio: 0\n' +
            '}'
    },
};

var maskCanvas;

jQuery(function ($) {
    var $form = $('#form');
    var $canvas = $('#canvas');
    var $htmlCanvas = $('#html-canvas');
    var $canvasContainer = $('#canvas-container');
    var $loading = $('#loading');

    var $list = $('#input-list');
    var $options = $('#config-option');
    var $css = $('#config-css');
    var $webfontLink = $('#link-webfont');

    if (!WordCloud.isSupported) {
        $('#not-supported').prop('hidden', false);
        $form.find('textarea, input, select, button').prop('disabled', true);
        return;
    }

    var $box = $('<div id="box" hidden />');
    $canvasContainer.append($box);
    window.drawBox = function drawBox(item, dimension) {
        if (!dimension) {
            $box.prop('hidden', true);
            return;
        }
        var dppx = $dppx.val();

        $box.prop('hidden', false);
        $box.css({
            left: dimension.x / dppx + 'px',
            top: dimension.y / dppx + 'px',
            width: dimension.w / dppx + 'px',
            height: dimension.h / dppx + 'px'
        });
    };

    $canvas.on('wordcloudstop', function wordcloudstopped(evt) {
        $loading.prop('hidden', true);
    });

    $form.on('submit', function formSubmit(evt) {
        evt.preventDefault();

        changeHash('');
    });

    var run = function run() {
        $loading.prop('hidden', false);

        // Load web font
        $webfontLink.prop('href', $css.val());

        // devicePixelRatio
        var devicePixelRatio = 1;

        // Set the width and height
        var width = $('#canvas-container').width();
        var height = Math.floor(width * 0.65);
        var pixelWidth = width;
        var pixelHeight = height;

        if (devicePixelRatio !== 1) {
            $canvas.css({ 'width': width + 'px', 'height': height + 'px' });

            pixelWidth *= devicePixelRatio;
            pixelHeight *= devicePixelRatio;
        } else {
            $canvas.css({ 'width': '', 'height': '' });
        }

        $canvas.attr('width', pixelWidth);
        $canvas.attr('height', pixelHeight);

        $htmlCanvas.css({ 'width': pixelWidth + 'px', 'height': pixelHeight + 'px' });

        var options = {};
        if ($options.val()) {
            options = (function evalOptions() {
                try {
                    return eval('(' + $options.val() + ')');
                } catch (error) {
                    return {};
                }
            })();
        }

        if (devicePixelRatio !== 1) {
            if (!('gridSize' in options)) {
                options.gridSize = 8;
            }
            options.gridSize *= devicePixelRatio;

            if (options.origin) {
                if (typeof options.origin[0] == 'number')
                    options.origin[0] *= devicePixelRatio;
                if (typeof options.origin[1] == 'number')
                    options.origin[1] *= devicePixelRatio;
            }

            if (!('weightFactor' in options)) {
                options.weightFactor = 1;
            }
            if (typeof options.weightFactor == 'function') {
                var origWeightFactor = options.weightFactor;
                options.weightFactor =
                    function weightFactorDevicePixelRatioWrap() {
                        return origWeightFactor.apply(this, arguments) * devicePixelRatio;
                    };
            } else {
                options.weightFactor *= devicePixelRatio;
            }
        }

        if ($list.val()) {
            var list = [];
            $.each($list.val().split('\n'), function each(i, line) {
                if (!$.trim(line))
                    return;

                var lineArr = line.split(' ');
                var count = parseFloat(lineArr.shift()) || 0;
                list.push([lineArr.join(' '), count]);
            });
            options.list = list;
        }

        if (maskCanvas) {
            options.clearCanvas = false;

            var bctx = document.createElement('canvas').getContext('2d');

            bctx.fillStyle = options.backgroundColor || '#fff';
            bctx.fillRect(0, 0, 1, 1);
            var bgPixel = bctx.getImageData(0, 0, 1, 1).data;

            var maskCanvasScaled =
                document.createElement('canvas');
            maskCanvasScaled.width = $canvas[0].width;
            maskCanvasScaled.height = $canvas[0].height;
            var ctx = maskCanvasScaled.getContext('2d');

            ctx.drawImage(maskCanvas,
                0, 0, maskCanvas.width, maskCanvas.height,
                0, 0, maskCanvasScaled.width, maskCanvasScaled.height);

            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var newImageData = ctx.createImageData(imageData);
            for (var i = 0; i < imageData.data.length; i += 4) {
                if (imageData.data[i + 3] > 128) {
                    newImageData.data[i] = bgPixel[0];
                    newImageData.data[i + 1] = bgPixel[1];
                    newImageData.data[i + 2] = bgPixel[2];
                    newImageData.data[i + 3] = bgPixel[3];
                } else {
                    newImageData.data[i] = bgPixel[0];
                    newImageData.data[i + 1] = bgPixel[1];
                    newImageData.data[i + 2] = bgPixel[2];
                    newImageData.data[i + 3] = bgPixel[3] ? (bgPixel[3] - 1) : 0;
                }
            }

            ctx.putImageData(newImageData, 0, 0);

            ctx = $canvas[0].getContext('2d');
            ctx.drawImage(maskCanvasScaled, 0, 0);

            maskCanvasScaled = ctx = imageData = newImageData = bctx = bgPixel = undefined;
        }

        if (!options.clearCanvas) {
            $htmlCanvas.empty();
            $htmlCanvas.css('background-color', options.backgroundColor || '#fff');
        }
        WordCloud([$canvas[0], $htmlCanvas[0]], options);
    };

    var loadExampleData = function loadExampleData(name) {
        var example = examples[name];

        $options.val(example.option || '');
        $list.val(example.list || '');
        $css.val(example.fontCSS || '');
    };

    var changeHash = function changeHash(name) {
        if (window.location.hash === '#' + name ||
            (!window.location.hash && !name)) {
            hashChanged();
        } else {
            window.location.hash = '#' + name;
        }
    };

    var hashChanged = function hashChanged() {
        var name = window.location.hash.substr(1);
        if (!name) {
            run();
        } else if (name in examples) {
            loadExampleData(name);
            run();
        } else {
            window.location.replace('#');
        }
    }

    hashChanged();
});
