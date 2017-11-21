




var BinsRipple = cc.Scene.extend({

    ctor: function () {
        this._super();
        
    },

    onEnter: function () {
        this._super();

        var node = new cc.LabelTTF("BinsRipple", "Arial", 26).to(this, 99).p(V.w/2, V.h/2);
        // this.bag = new cc.Sprite("res/common/frozen.png").to(this).p(V.w/2, V.h/2);

        var shaderNode = new ShaderNode("res/gpu/Shaders/example_Heart.vsh", "res/gpu/Shaders/example_Heart.fsh").to(this).p(V.w/2, V.h/2);
    }
});