/**
 * Created by YouChangWei on 2017/11/18.
 */

// 屏幕打印 每次的初始位置调控
var print_pos_diff = 15;

var mlog = function () {
	
	var mstr = "";
    for (var i in arguments) {
        if (i == 0) {
            mstr += arguments[i];
        } else {
            mstr += " , " + arguments[i];
        }
    }
    // console.log(mstr);

    if (print_pos_diff > 1) {
        print_pos_diff -= 1; 
    } else {
        print_pos_diff = 15;
    }

    var scene = cc.director.getRunningScene();
    var node = new cc.LabelTTF(mstr, "Arial", 31);
    node.to(scene, 9999).p(V.w / 2, print_pos_diff * 30);
    node.setFontFillColor(cc.color(255, 255, 250));

    var action = cc.sequence(
        cc.spawn(
            cc.fadeOut(3.5),
            cc.moveBy(3.5, cc.p(0, 200))
        ),
        cc.removeSelf()
        );
    node.runAction(action);
};