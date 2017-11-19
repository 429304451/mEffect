// 入口函数 从这里进入分流

var MLabel = cc.LabelTTF.extend({
	ctor: function (name, showName) {
		this._super(showName, "Arial", 25);
		this.name = name;
		this.showName = showName;
	},
	onEnter: function () {
		this._super();
		var self = this;
		this.bt(function() {
			mstr = "cc.director.runScene(new " + self.name + "())";
			eval(mstr);
		});
	}
});

var MEnter = cc.Scene.extend({
	// introduceDic: {},

	ctor: function () {
		this._super();
		this.introduceDic = {"HelloWorldScene": "Hey 哈喽 矮油！"};

		// 测试使用
	},

	onEnter: function () {
		this._super();
		// var node = new cc.LabelTTF(this.introduceDic.HelloWorldScene, "Arial", 20);
		// node.to(this).pp(0.5, 0.5);
		var name = "HelloWorldScene";
		var node = new MLabel(name, this.introduceDic[name]).to(this).pp(0.5, 0.5);
	}
});
