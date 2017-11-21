var ItemMoveActionTag = 123;
var INVALID_DISTANCE = 30;

var WenyuSp = cc.Sprite.extend({
    ctor: function (filename = "res/gpu/8.png", fsh = "res/gpu/Shaders/node1.fsh", vsh = "res/gpu/Shaders/node1.vsh") {
        this._super(filename);
        this.index = 0;
        this.initShader(fsh, vsh);
    },
    onEnter: function () {
        this._super();
        this.bindTouch({
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this),
        })
    },
    initShader: function (fsh, vsh) {
        if( 'opengl' in cc.sys.capabilities ) {
            if(cc.sys.isNative){
                this.shader = new cc.GLProgram(vsh, fsh);
                this.shader.link();
                this.shader.updateUniforms();
            }
            else{
                this.shader = new cc.GLProgram(vsh, fsh);
                this.shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                this.shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                this.shader.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);

                this.shader.link();
                this.shader.updateUniforms();
                this.shader.use();

                this.PosX = this.shader.getUniformLocationForName("PosX");
                this.PosY = this.shader.getUniformLocationForName("PosY");

                this.shader.setUniformLocationWith1f(this.PosX, 0.0);
                this.shader.setUniformLocationWith1f(this.PosY, 0.0);
            }
            if(cc.sys.isNative){
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.shader);
                glProgram_state.setUniformFloat("PosX", 0.0);
                glProgram_state.setUniformFloat("PosY", 0.0);
                this.m_pShaderProgram = glProgram_state;
                this.setGLProgramState(this.m_pShaderProgram);
            }else{
                this.shaderProgram = this.shader;
                this.m_pShaderProgram = this.shader;
            }
        }
    },
    changePosX: function () {
        var pos = this.getPosition();
        var posX = (pos.x - V.w / 2) / V.w; 
        var zOrder = Math.ceil(9999 - Math.abs(pos.x - V.w / 2));
        this.setLocalZOrder(zOrder);

        if( 'opengl' in cc.sys.capabilities ) {
            if(cc.sys.isNative){
                // console.log("这个是对其他本地平台生效的");
                // this.getGLProgramState().setUniformFloat("u_threshold", 250);
                this.m_pShaderProgram.setUniformFloat("PosX", posX);
                
            }else{
                // console.log("网页生效");
                this.m_pShaderProgram.use();
                this.m_pShaderProgram.setUniformLocationWith1f(this.PosX, posX);
                this.m_pShaderProgram.updateUniforms();
            }
        }
    },
    onTouchBegan: function(touch, event) {
        var pos = touch.getLocation();
        this.mStartTouchPos = pos;
        this.mTouchMove = false;
        return true;
    },
    onTouchMoved: function(touch, event) {
        var pos = touch.getLocation();
        if (cc.pDistance(pos, this.mStartTouchPos) > INVALID_DISTANCE) {
            this.mTouchMove = true;
        }
    },
    onTouchEnded: function(touch, event) {
        var pos = touch.getLocation();
        if (cc.pDistance(pos, this.mStartTouchPos) > INVALID_DISTANCE) {
            this.mTouchMove = true;
        }
        var target = event.getCurrentTarget();
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);
        if (this.mTouchMove == false && cc.rectContainsPoint(rect, locationInNode)) {
            // console.log(this.index, "onTouchEnded");
            mlog(this.index, "onTouchEnded");
        }
    },
});

var WenyuLayer = cc.Layer.extend({

    ctor: function () {
        this._super();
        // 选择界面当前是第几个 this._ItemIndex
        this.itemIndex = 0;
        // item结点集合
        this.mItemSet = [];
        // Item间隔
        this.mInterval = -300;
    },

    onEnter: function () {
        this._super();
        // 背景
        this.bag = new cc.Sprite("res/common/frozen.png").to(this).p(V.w/2, V.h/2);
        // 滑块
        this.loadDisplay();
        
        this.scheduleUpdate();
    },
    loadDisplay: function () {
        for (var i = 0; i < 10; i++) {
            var item = new WenyuSp().to(this, 2).p(V.w/2, V.h/2);
            item.p((item.cw() + this.mInterval) * i - item.cw() / 2, V.h / 2);
            item.index = i;
            this.mItemSet.push(item);
        }
        var dx = this.mItemSet[this.itemIndex].px() - V.w / 2;
        this.moveItem(dx);
        this.adjustItem();
        // this.a
    },
    moveItem: function (dx) {
        for (var i = 0; i < 10; i++) {
            item = this.mItemSet[i];
            item.px(item.px() + dx);
            // 调整位置， 让她循环起来
            var tempWidth = (this.mInterval + item.cw()) * this.mItemSet.length;
            if (item.px() < -(this.mInterval + item.cw())) {
                item.px(item.px() + tempWidth);
            } else if (item.px() > (this.mInterval + item.cw() + V.w)) {
                item.px(item.px() - tempWidth);
            }
        }
    },

    soundKaka: function () {
        SoundEngine.playEffect("res/common/kaka.mp3");
    },

    stopItemAction: function () {
        for (var i = 0; i < 10; i++) {
            this.mItemSet[i].stopActionByTag(ItemMoveActionTag);
        }
    },
    // 当触控结束后， 调整一下位置， 结点始终居中
    adjustItem: function (centerItem, speed) {
        // 新的居中 Item
        // 计算好要移动多少
        var dx = null;
        for (var i = 0; i < 10; i++) {
            var item = this.mItemSet[i];
            var tempDx = item.px() - V.w / 2;
            // 对中间占有者， 做些惩罚， 让其容易退位
            if (i == this.itemIndex) {
                var tax = (item.cw() + this.mInterval) / 1.5;
                if (tempDx > 0) {
                    tempDx += tax;
                } else {
                    tempDx -= tax;
                }
            }
            if (dx == null || (Math.abs(tempDx) < Math.abs(dx))) {
                dx = tempDx;
                centerItem = i;
            }
        }
        // 先停止之前的动作
        this.stopItemAction();
        // 移动过去
        var dx = this.mItemSet[centerItem].px() - V.w / 2;
        var speed = speed || 1000;
        var delay = Math.abs(dx) / speed;
        for (var i = 0; i < 10; i++) {
            var action = cc.moveBy(delay, cc.p(-dx, 0));
            if (i == 0) {
                action = cc.sequence(action, cc.callFunc(function() {
                    this.itemIndex = centerItem;
                }));
            }
            action.setTag(ItemMoveActionTag);
            this.mItemSet[i].runAction(action);
        }
    },
    
    update: function(dt) {
        for (var i = 0; i < 10; i++) {
            this.mItemSet[i].changePosX();
        }
    },
    onExit: function () {
        this._super();
    }
});

var WenyuTouch = cc.Layer.extend({
    ctor: function (config) {
        this._super();
    },
    onEnter: function () {
        this._super();
        this.bindTouch({
            swallowTouches: false,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this),
        })
    },
    onTouchBegan: function(touch, event) {
        var scene = cc.director.getRunningScene();
        var pos = touch.getLocation();
        this.startPosX = pos.x;
        scene.wenyuLayer.stopItemAction();
        this.mPreX = pos.x;
        return true;
    },
    onTouchMoved: function(touch, event) {
        var scene = cc.director.getRunningScene();
        var pos = touch.getLocation();
        var dx = pos.x - this.mPreX;
        scene.wenyuLayer.moveItem(dx);
        this.mPreX = pos.x;
    },
    onTouchEnded: function(touch, event) {
        var scene = cc.director.getRunningScene();
        var pos = touch.getLocation();
        var dx = pos.x - this.mPreX;
        scene.wenyuLayer.moveItem(dx);
        if (Math.abs(pos.x - this.startPosX) > 30) {
            scene.wenyuLayer.soundKaka();
        }
        // 调整位置
        scene.wenyuLayer.adjustItem();
        this.mPreX = null;
    },
});

var Wenyu = cc.Scene.extend({

    ctor: function () {
        this._super();
        
    },

    onEnter: function () {
        this._super();

        this.wenyuLayer = new WenyuLayer().to(this);
        this.wenyuTouch = new WenyuTouch().to(this);
    }
});