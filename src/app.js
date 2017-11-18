
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    onEnter: function () {
        this._super();

        var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38).to(this).pp(0.5, 0.75);

        var sprite = new cc.Sprite(res.HelloWorld_png).to(this).pp(0.5, 0.5);
        sprite.bt(function(touch, event) {
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

