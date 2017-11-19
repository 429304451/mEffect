/**
 * Created on 2017/11/18.
 */

Math.clamp = function (value, min, max) {
	return Math.min(Math.max(value, min), max);
};

// 工具类
var ttutil = {};

ttutil.uint8ArrayToString = function (buf) {
	return String.fromCharCode.apply(null, buf);
};
