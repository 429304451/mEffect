var Hensive = cc.Scene.extend({

    ctor: function () {
        this._super();
        // 鼠标的位置  水宽和水深宽
    	this.ProgramInfo = [0.5, 0.5, 0.5, 0.5];
    	// 效果自命名
    	this.effectName = ["1-水坑", "2-取颜色区间变化"];
    	// 背景图
    	this.bgName = ["res/common/0frozen.png", "res/common/02.png", "res/common/bag.png"];
    	// 目前使用哪张图片作为背景
    	this.imgWhich = 1;
    	// 目前使用哪个Shader效果
    	this.shaderWhich = 1;
    },

    onEnter: function () {
        this._super();

        // var node = new cc.LabelTTF("Hensive", "Arial", 26).to(this, 99).p(V.w/2, V.h/2);
        // this.bag = new cc.Sprite("res/common/frozen.png").to(this).p(V.w/2, V.h/2);
        this.loadProgram(this.shaderWhich);
    },
    loadProgram: function (shaderWhich) {
    	this.backGround = new cc.Sprite(this.bgName[this.imgWhich]).to(this).p(V.w/2, V.h/2);
    	// Shader_Normal_Init_WithMouse
    }

});