
PS_MAIN_TEXTURE = {
    STARS: ["star_b.png", "star_g.png", "star_p.png", "star_r.png", "star_y.png"]
};

PS_MAIN_SOUNDS = {
    click: "res/Popstar/sounds/click.mp3",
    broken: "res/Popstar/sounds/broken.mp3",
    select: "res/Popstar/sounds/select.mp3",
    gameover: "res/Popstar/sounds/gameover.mp3",
    stageclear: "res/Popstar/sounds/stageclear.mp3",
    win: "res/Popstar/sounds/win.mp3"
};

var PopMainLayer = cc.Layer.extend({

    ctor:function () {
    	this._super();
    	cc.spriteFrameCache.addSpriteFrames("res/Popstar/star_packer.plist");
    	// 接下来是一些初始化变量
    	this.pauseNode = this.pauseNode || {};
    	this.numX = 10;
    	this.numY = 10;
    	this.starSize = 72;
    	
    	this.sameColorList = [];
    	//fonts
    	// this.bestScoreFont = {};
    	// this.stageFont = {};
    	// this.stageFont = new cc.LabelBMFont("1", "res/Popstar/fonts/s_number_member_small.fnt").to(this.mNode, 99).p(211, 107);
    	// this.targetFont = {};
    	// this.scoreFont = {};
    	// this.scoreTipLabel = {};
    	// this.tipLabel = {};

    	// this.nextSprite = {};
    	// this.nextLevelLabel = {};
    	// this.nextTargetLabel = {};

    	this.totalScore = 0;
    	this.isClear = false;
    },
    initUi: function() {
    	this.mNode = new cc.Node().to(this).p(0, 1000);
    	this.bag = new cc.Sprite("res/Popstar/bg_main.png").to(this, -1).pp();
    	// color #ffffffff
    	new cc.LabelTTF("@TouchSnow   CocosEditor", "Arial", 25).to(this).p(353, 1293);
    	new cc.LabelBMFont("a", "res/Popstar/fonts/titleinfo.fnt").to(this.mNode).p(139, 169);
    	new cc.LabelBMFont("b", "res/Popstar/fonts/titleinfo.fnt").to(this.mNode).p(79, 123);
    	new cc.LabelBMFont("c", "res/Popstar/fonts/titleinfo.fnt").to(this.mNode).p(374, 120);
    	new cc.Sprite("#ui3.png").to(this.mNode).p(439, 153).setScaleX(2);
    	new cc.Sprite("#ui2.png").to(this.mNode).p(579, 101).setScaleX(1.5);
    	new cc.Sprite("#ui2.png").to(this.mNode).p(212, 99).setScaleX(0.6);
    	// onPauseClicked
    	this.menu1 = new ccui.Button("pause.png", "", "", ccui.Widget.PLIST_TEXTURE).to(this.mNode).p(629+23, 153+7);
    	this.bestScoreFont = new cc.LabelBMFont("2000", "res/Popstar/fonts/s_number_member_small.fnt").to(this.mNode).p(434, 163);
    	this.targetFont = new cc.LabelBMFont("34900", "res/Popstar/fonts/s_number_member_small.fnt").to(this.mNode).p(581, 110);
    	this.stageFont = new cc.LabelBMFont("1", "res/Popstar/fonts/s_number_member_small.fnt").to(this.mNode).p(211, 107);

    	new cc.Sprite("#ui1.png").to(this).p(354, 920).setScaleX(2);
    	new cc.LabelBMFont("d", "res/Popstar/fonts/titleinfo.fnt").to(this).p(355, 996);
    	this.scoreFont = new cc.LabelBMFont("300", "res/Popstar/fonts/s_number_member_small.fnt").to(this).p(347, 930);
    	
    	// onResumeClicked
    	this.pauseNode = new cc.Node().to(this).p(360, 640).hide();
    	this.pauseNode1 = new ccui.Button("resume.png", "", "", ccui.Widget.PLIST_TEXTURE).to(this.pauseNode).p(17, 61);
    	// onSaveExitClicked
    	this.pauseNode2 = new ccui.Button("save_exit.png", "", "", ccui.Widget.PLIST_TEXTURE).to(this.pauseNode).p(20, 148);

    	// color #ffffffff
    	this.scoreTipLabel = new cc.LabelTTF("4 blocks 80 Points", "Arial Black", 25).to(this).p(358, 870);
    	this.tipLabel = new cc.LabelTTF("Finish Target!", "Arial Black", 25).to(this).p(351, 822);

    	this.nextSprite = new cc.Sprite("res/Popstar/bg_main.png").to(this).anchor(0, 0).p(-730, 0);
    	// color #ffffffff
    	this.nextLevelLabel = new cc.LabelTTF("level 1", "Arial Black", 25).to(this.nextSprite).p(369, 780);
    	this.nextTargetLabel = new cc.LabelTTF("target 3000", "Arial Black", 25).to(this.nextSprite).p(368.5, 723);
    },
    onEnter:function () {
    	this._super();
    	this.initUi();
    	// ### 页面元素摆放完毕 接下来是逻辑部分
    	this.canTouch = true;
    	this.pauseNode.setLocalZOrder(120);
    	// init stars
    	this.initStarTable();
    	// stage
    	this.stageFont.setString(currentLevel + "");
    	// target  score
    	this.targetScore = 1000 * (1 + currentLevel) * currentLevel / 2;
    	this.targetFont.setString(this.targetScore + "");
    	// score
    	this.totalScore = currentLevelScore;
    	this.scoreFont.setString(this.totalScore + "");
    	// score tip
	    this.scoreTipLabel.setVisible(false);
	    this.tipLabel.setVisible(false);
	    this.tipLabel.setLocalZOrder(10);
	    // best score
	    this.bestScore = cc.sys.localStorage.getItem("starBestScore");
	    if (this.bestScore != null && this.bestScore != undefined) {
	        this.bestScore = Number(this.bestScore);
	    }
	    else {
	        this.bestScore = 0;
	    }
	    this.bestScoreFont.setString(this.bestScore + "");

	    this.bindTouch({
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan.bind(this),
            // onTouchMoved: this.onTouchMoved.bind(this),
            // onTouchEnded: this.onTouchEnded.bind(this),
        })
    },
    initStarTable: function() {
    	this.starTable = new Array(this.numX);
    	for (var i = 0; i < this.numX; i++) {
    		var sprites = new Array(this.numY);
    		for (var j = 0; j < this.numY; j++) {
    			var pSprite0 = this.getRandomStar(i, j);
    			if (pSprite0 != null) {
    				this.addChild(pSprite0);
    			}
    			sprites[j] = pSprite0;
    		}
    		this.starTable[i] = sprites;
    	}
    },
    getRandomStar: function(colIndex, rowIndex) {
    	var stars = PS_MAIN_TEXTURE.STARS;
    	var colors = ["blue", "green", "purple", "red", "yellow"];
    	var random = getRandom(stars.length);
    	var randomStar = stars[random];
    	// console.log("randomStar", randomStar);
    	// var starSprite = cc.Sprite.createWithSpriteFrameName(randomStar);
    	var starSprite = new cc.Sprite("#"+randomStar);
    	// starSprite.p(36 + colIndex * this.starSize, 1300);
    	starSprite.p(36 + colIndex * this.starSize, 1300);
    	starSprite.starData = {name: randomStar, color: colors[random], indexOfColumn: colIndex, indexOfRow: rowIndex};
    	starSprite.setLocalZOrder(100);

    	var flowTime = rowIndex / 10;
    	var fallAction = cc.MoveTo.create(flowTime, cc.p(36 + colIndex * this.starSize,
            36 + rowIndex * this.starSize));
    	starSprite.runAction(fallAction);
    	return starSprite;
    },
    onPauseClicked: function() {
    	this.pauseNode.setVisible(true);
    },
    onResumeClicked: function() {
    	this.pauseNode.setVisible(false);
    },
    onSaveExitClicked: function() {
    	cc.BuilderReader.runScene("", "StartLayer");
    	// mlog("onSaveExitClicked enter StartLayer");
    },
    checkOneStarFourSide: function(sprite) {
    	if (sprite == null) {
	        return;
	    }
	    var fourSideSpriteList = [];
	    var color = sprite.starData.color;
	    var col = sprite.starData.indexOfColumn;
	    var row = sprite.starData.indexOfRow;
	    // up 
	    if (row < 9) {
	        var upSprite = this.starTable[col][row + 1];
	        if (upSprite != null && upSprite.starData.color == color) {
	            fourSideSpriteList.push(upSprite);
	        }
	    }
	    // down
	    if (row > 0) {
	        var downSprite = this.starTable[col][row - 1];
	        if (downSprite != null && downSprite.starData.color == color) {
	            fourSideSpriteList.push(downSprite);
	        }
	    }

	    // left
	    if (col > 0) {
	        var leftSprite = this.starTable[col - 1][row];
	        if (leftSprite != null && leftSprite.starData.color == color) {
	            fourSideSpriteList.push(leftSprite);
	        }
	    }

	    // right
	    if (col < 9) {
	        var rightSprite = this.starTable[col + 1][row];
	        if (rightSprite != null && rightSprite.starData.color == color) {
	            fourSideSpriteList.push(rightSprite);
	        }
	    }
	    return fourSideSpriteList;
    },
    checkSameColorStars: function(sprite) {
    	if (sprite == null) {
	        return;
	    }
	    this.sameColorList = [];
    	this.sameColorList.push(sprite);
    	var newSameColorList = [];
    	newSameColorList.push(sprite);

    	// by logic ,check the same color star list
    	while (newSameColorList.length > 0) {
	        for (var i = 0; i < newSameColorList.length; i++) {
	            var fourSide = this.checkOneStarFourSide(newSameColorList[i]);
	            if (fourSide.length > 0) {
	                for (var j = 0; j < fourSide.length; j++) {
	                    if (!this.sameColorList.contains(fourSide[j])) {
	                        this.sameColorList.push(fourSide[j]);
	                        newSameColorList.push(fourSide[j]);
	                    }
	                }
	            }
	            newSameColorList.splice(i, 1);
	        }
	    }
	    // cc.log("sameColorList length==" + this.sameColorList.length);
	    if (this.sameColorList.length > 1) {
	        for (var k = 0; k < this.sameColorList.length; k++) {
	            var simpleStar = this.sameColorList[k];
	            if (simpleStar) {
	                simpleStar.runAction(cc.ScaleTo.create(0.1, 1.08));
	            }
	        }
	    }
    },
    removeSameColorStars: function() {
    	var length = this.sameColorList.length;
    	this.oneStarScore = 5 * length;
    	for (var k = 0; k < length; k++) {
	        var simpleStar = this.sameColorList[k];
	        if (simpleStar) {
	            var col = simpleStar.starData.indexOfColumn;
	            var row = simpleStar.starData.indexOfRow;
	            this.starTable[col].splice(row, 1, null);
	            this.removeChild(simpleStar);
	            // 创建粒子效果 稍后调试
	            // if (sys.platform != 'browser') {
	            //     var starParticle = cc.StarParticle.create(this.rootNode, (36 + col * this.starSize), (36 + row * this.starSize), "spark");
	            //     starParticle.runAction(cc.Sequence.create(cc.DelayTime.create(0.8), cc.CleanUp.create(starParticle)));
	            // }
	            // var starParticle = PopMain.StarParticleCreate(this, (36 + col * this.starSize), (36 + row * this.starSize), "spark");
	            // starParticle.runAction(cc.Sequence.create(cc.DelayTime.create(0.8), cc.CleanUp.create(starParticle)));

	            var starScoreSprite = PopMain.createScore(this, cc.p((36 + col * this.starSize), (36 + row * this.starSize)), this.oneStarScore + "");
	            starScoreSprite.runAction(cc.Sequence.create(
	                    cc.MoveTo.create(0.3 + k / 20, this.scoreFont.getPosition()),
	                    // cc.CleanUp.create(starScoreSprite),
	                    cc.removeSelf(true),
	                    cc.CallFunc.create(function ()
	                    {
	                        this.totalScore += this.oneStarScore;
	                        this.scoreFont.setString(this.totalScore + "");
	                        if (this.totalScore >= this.targetScore) {
	                            if (this.isClear == false) {
	                                this.isClear = true;
	                                this.tipLabel.setVisible(true);
	                                this.tipLabel.setString("Clear!");
	                                this.tipLabel.runAction(cc.Sequence.create(cc.DelayTime.create(1),
	                                        cc.MoveTo.create(1, cc.p(110, 1000))
	                                ));
	                                SoundEngine.playEffect(PS_MAIN_SOUNDS.stageclear);
	                                // cc.AudioEngine.getInstance().playEffect(PS_MAIN_SOUNDS.stageclear);
	                            }
	                        }
	                    }, this)
	            ));
	        }
	    }
	    this.sameColorList = [];
	    this.fallStar();
    },
    fallStar: function() {
    	for (var i = 0; i < this.starTable.length; i++) {
	        var sprites = this.starTable[i];
	        var length = sprites.length;
	        for (var j = 0; j < length; j++) {
	            var pSprite0 = sprites[j];
	            if (pSprite0 == null) {
	                var k = j + 1;
	                while (k < length) {
	                    var upSprite = sprites[k];
	                    if (upSprite != null) {
	                        upSprite.starData.indexOfColumn = i;
	                        upSprite.starData.indexOfRow = j;
	                        this.starTable[i].splice(j, 1, upSprite);
	                        this.starTable[i].splice(k, 1, null);
	                        k = length;
	                    }
	                    k++;
	                }
	            }
	        }
	    }
	    this.combineStar();
    },
    checkCombineStar: function() {
    	for (var m = 0; m < (this.starTable.length - 1); m++) {
	        if (this.starTable[m][0] == null && this.starTable[m + 1][0] != null) {
	            return m;
	        }
	    }
	    return -1;
    },
    combineStar: function() {
    	while (this.checkCombineStar() >= 0) {
	        var m = this.checkCombineStar();
	        if (m == (this.starTable.length - 1)) {      //last length
	            for (var k = 0; k < this.starTable[m].length; k++) {
	                this.starTable[m].splice(k, 1, null);
	            }
	        }
	        else {
	            for (var i = (m + 1); i < this.starTable.length; i++) {
	                for (var j = 0; j < this.starTable[i].length; j++) {
	                    if (this.starTable[i][j] != null) {
	                        this.starTable[i][j].starData.indexOfColumn = (i - 1);
	                    }
	                    this.starTable[i - 1].splice(j, 1, this.starTable[i][j]);
	                    if (i == (this.starTable.length - 1)) {
	                        this.starTable[i].splice(j, 1, null);
	                    }
	                }
	            }
	        }
	    }

	    this.moveStar();
    },
    moveStar: function() {
    	for (var i = 0; i < this.starTable.length; i++) {
	        var sprites = this.starTable[i];
	        var length = sprites.length;
	        var jj = i + "==  ";
	        for (var j = 0; j < length; j++) {
	            var pSprite0 = sprites[j];
	            if (pSprite0) {
	                var moveAction = cc.MoveTo.create(0.18, cc.p(36 + i * this.starSize, 36 + j * this.starSize));
	                this.starTable[i][j].runAction(moveAction);
	                jj += pSprite0.starData.color + pSprite0.starData.indexOfColumn + pSprite0.starData.indexOfRow + "    ";
	            }
	            else {
	                jj += "xxx" + i + j + "    ";
	            }
	        }
	        // cc.log(jj);
	        // console.log("jj", jj);
	    }
	    this.deadStar();
    },
    deadStar: function() {
    	// console.log("deadStar");
	    var isDead = true;
	    var deadCount = 0;
	    for (var i = 0; i < this.starTable.length; i++) {
	        var sprites = this.starTable[i];
	        var length = sprites.length;
	        for (var j = 0; j < length; j++) {
	            var pSprite0 = sprites[j];
	            if (pSprite0 != null) {
	                if (this.checkOneStarFourSide(pSprite0).length > 0) {
	                    isDead = false;
	                    return;
	                }
	                else {
	                    deadCount += 1;
	                }
	            }
	        }
	    }

	    if (isDead) {
	        this.canTouch = false;
	        for (var jj = 9; jj >= 0; jj--) {
	            for (var ii = 0; ii < 10; ii++) {
	                var pSprite0 = this.starTable[ii][jj];
	                if (pSprite0 != null) {
	                    var delay = 4 + 0.3 * ii - 0.4 * jj;
	                    pSprite0.runAction(cc.Sequence.create(
	                            cc.DelayTime.create(delay),
	                            // cc.CleanUp.create(pSprite0)
	                            cc.removeSelf(true)
	                    ));
	                    // var starParticle = cc.StarParticle.create(this, (36 + ii * this.starSize), (36 + jj * this.starSize), "spark");
	                    var starParticle = PopMain.StarParticleCreate(this, (36 + ii * this.starSize), (36 + jj * this.starSize), "spark");
	                    starParticle.runAction(cc.Sequence.create(cc.ScaleTo.create(0, 0),
	                            cc.DelayTime.create(delay), cc.ScaleTo.create(0, 1), cc.DelayTime.create(0.8),
	                            // cc.CleanUp.create(starParticle)
	                            cc.removeSelf(true)
	                        ));

	                    if (deadCount < 10) {
	                        if (deadCount == 0) {
	                            this.totalScore += 1000;
	                            this.scoreFont.setString(this.totalScore + "");
	                        }

	                        this.oneDeadStarScore = Math.floor((1000 - deadCount * 100) / deadCount);
	                        this.oneDeadStarScore = this.oneDeadStarScore - this.oneDeadStarScore % 10;
	                        var starScoreSprite = PopMain.createScore(this,
	                                cc.p((36 + ii * this.starSize), (36 + jj * this.starSize)), this.oneDeadStarScore + "");
	                        starScoreSprite.runAction(cc.Sequence.create(
	                                cc.ScaleTo.create(0, 0),
	                                cc.DelayTime.create(delay), cc.ScaleTo.create(0, 1),
	                                cc.MoveTo.create(0.3 + jj / 20, this.scoreFont.getPosition()),
	                                // cc.CleanUp.create(starScoreSprite),
	                                cc.CallFunc.create(function ()
	                                {
	                                    this.totalScore += this.oneDeadStarScore;
	                                    this.scoreFont.setString(this.totalScore + "");
	                                }, this),
	                                cc.removeSelf(true),
	                        ));
	                    }
	                }
	            }
	        }
	    }
	    var that = this;
	    this.scheduleOnce(function ()
	    {
	        that.winStar();
	    }, 5);
    },
    winStar: function() {

    	if (this.isClear == true) {
	        // cc.AudioEngine.getInstance().playEffect(PS_MAIN_SOUNDS.win);
	        SoundEngine.playEffect(PS_MAIN_SOUNDS.win);
	        // cc.Toast.create(this.rootNode, "Win", 3);
	        mlog("Win");
	        currentLevel += 1;
	        currentLevelScore = this.totalScore;

	        this.nextSprite.setLocalZOrder(100);
	        var that = this;
	        this.scheduleOnce(function ()
	        {
	            that.nextLevelLabel.setString("level " + currentLevel + "");
	            that.nextTargetLabel.setString("target " + 1000 * (1 + currentLevel) * currentLevel / 2);
	            that.nextSprite.runAction(cc.Sequence.create(
	                    cc.MoveTo.create(1, cc.p(0, 0)),
	                    cc.DelayTime.create(2),
	                    cc.MoveTo.create(1, cc.p(-730, 0))
	            ))
	        }, 3);
	        // this.scheduleOnce(function ()
	        // {
	        //     cc.BuilderReader.runScene("", "MainLayer");
	        // }, 7);
	        mlog("enter NewScene MainLayer")
	    }
	    else {
	        // cc.AudioEngine.getInstance().playEffect(PS_MAIN_SOUNDS.gameover);
	        SoundEngine.playEffect(PS_MAIN_SOUNDS.gameover);
	        currentLevel = 1;
	        currentLevelScore = 0;
	        // cc.Toast.create(this.rootNode, "lost", 2);
	        mlog("lost");
	        this.scheduleOnce(function ()
	        {
	            // cc.BuilderReader.runScene("", "StartLayer");
	            mlog("enter StartLayer");
	        }, 2)
	    }
	    if (this.totalScore > this.bestScore) {
	        cc.sys.localStorage.setItem("starBestScore", this.totalScore + "");
	    }
    },
    showScoreTip: function() {
    	this.scoreTipLabel.setVisible(true);
	    var length = this.sameColorList.length;
	    var tip = length + " blocks " + length * length * 5 + " points";
	    this.scoreTipLabel.setString(tip);
    },
    onTouchBegan: function(touch, event) {
    	if (this.canTouch == false) {
	        return;
	    }
	    var pos = touch.getLocation();
	    // console.log("pos", pos);
	    var star_width = 68;
	    // var loc = touches[0].getLocation();
	    this.ccTouchBeganPos = pos;
	    for (var i = 0; i < this.starTable.length; i++) {
	        // var sprites = this.starTable[i];
	        for (var j = 0; j < this.starTable[i].length; j++) {
	            // var pSprite0 = sprites[j];
	            if (this.starTable[i][j] && this.starTable[i][j] != null) {
	                //var ccRect = pSprite0.getBoundingBox(); cc.rect(
	                var mPos = this.starTable[i][j].getPosition();
	                // var ccRect = cc.rectCreate(this.starTable[i][j].getPosition(), [36, 36]);
	                var ccRect = cc.rect(mPos.x-star_width/2, mPos.y-star_width/2, star_width, star_width);
	                var pSprite0 = this.starTable[i][j];
	                if (cc.rectContainsPoint(ccRect, this.ccTouchBeganPos)) {
	                    if (this.sameColorList.length > 1) {
	                        if (this.sameColorList.contains(pSprite0)) {
	                            // cc.AudioEngine.getInstance().playEffect(PS_MAIN_SOUNDS.broken, false);
	                            SoundEngine.playEffect(PS_MAIN_SOUNDS.broken);
	                            this.removeSameColorStars();
	                            this.scoreTipLabel.setVisible(false);
	                        }
	                        else {
	                            for (var k = 0; k < this.sameColorList.length; k++) {
	                                if (this.sameColorList[k]) {
	                                    this.sameColorList[k].runAction(cc.ScaleTo.create(0.1, 1));
	                                }
	                            }
	                            this.checkSameColorStars(pSprite0);
	                            if (this.sameColorList.length > 1) {
	                                // cc.AudioEngine.getInstance().playEffect(PS_MAIN_SOUNDS.select, false);
	                                SoundEngine.playEffect(PS_MAIN_SOUNDS.select);
	                                this.showScoreTip();
	                            }
	                            else {
	                                this.scoreTipLabel.setVisible(false);
	                            }
	                        }
	                    }
	                    else {
	                        this.checkSameColorStars(pSprite0);
	                        if (this.sameColorList.length > 1) {
	                            // cc.AudioEngine.getInstance().playEffect(PS_MAIN_SOUNDS.select, false);
	                            SoundEngine.playEffect(PS_MAIN_SOUNDS.select);
	                            this.showScoreTip();
	                        }
	                        else {
	                            this.scoreTipLabel.setVisible(false);
	                        }
	                    }
	                    break;
	                }
	            }
	        }
	    }
    }

});