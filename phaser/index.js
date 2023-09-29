const config = {
    type: Phaser.AUTO,
    // width: 2100, // 设置游戏的宽度
    // height: 1400, // 设置游戏的高度
    width: 1050, // 设置游戏的宽度
    height: 700, // 设置游戏的高度
    parent: 'game-container',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create
    }
};
const game = new Phaser.Game(config);
let map;

function preload() {
    this.load.tilemapTiledJSON('map', './assets/data.json'); // 加载Tiled导出的JSON
    this.load.image('tiles_spritesheet', './assets/tiles_spritesheet.png');
    this.load.image('items_spritesheet', './assets/items_spritesheet.png');
}

function create() {
    map = this.make.tilemap({ key: 'map' }); // 创建地图对象
    const tileset = map.addTilesetImage('tiles_spritesheet');

    const wallLayer = map.createStaticLayer('wall', tileset, 0, 0);

    wallLayer.setScale(0.5);

    const objects = map.createFromObjects('obj', 'items_spritesheet');
    console.log("🚀 ~ file: index.js:35 ~ create ~ map:", objects)

    // 对加载的对象进行进一步的设置和处理
    objects.forEach((object) => {
        // 设置对象的属性、位置、大小等
        object.setOrigin(0.5, 0.5);
        object.setScale(0.5);
    });
}