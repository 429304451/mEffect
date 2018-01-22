// 竖屏所用的配置
var V = {w:720, h:1280};

var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function (name) {
        this._super();

        if (!name)
            name = "Hello World";
        var helloLabel = new cc.LabelTTF(name, "Arial", 38);

        var sprite = new cc.Sprite(res.HelloWorld_png).to(this).pp(0.5, 0.5);
        sprite.quickBt(function(touch, event) {
            var pos = touch.getLocation();
            mlog("function");
            console.log(pos);
        });
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

