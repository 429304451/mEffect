/**
 * Created by Changwei on 2018/1/21.
 */

// 创建场景 首先进入场景的时候要把屏幕改成竖屏的 适应 720, 1280

var PopstarScene = cc.Scene.extend({
	ctor:function () {
		// 先设置下分辨率和横竖屏
		cc.view.setFrameSize(V.w, V.h);
		cc.view.setDesignResolutionSize(V.w, V.h, cc.ResolutionPolicy.SHOW_ALL);
		// 上面处理稍后调试再说 先开发
        this._super();

    },
    onEnter:function () {
        this._super();
        // new PopStartLayer().to(this);
        new PopMainLayer().to(this);
        // this.MainLayer = new HelloWorldLayer("PopstarScene").to(this);
        // this.addChild(this.MainLayer);
        // cc.director.getRunningScene().bag.changeBgLight();
    }
});