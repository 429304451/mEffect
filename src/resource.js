var res = {
    HelloWorld_png : "res/HelloWorld.png",
};

var common_res = [
	"res/common/02.png",
	"res/common/bag.png",
	"res/common/frozen.png",
	"res/common/kaka.mp3"
];

var gpu_res = [
	"res/gpu/8.png",
	"res/gpu/grossini.png",
	"res/gpu/wo.png",
	"res/gpu/Shaders/default.fsh",
	"res/gpu/Shaders/default.vsh",
	"res/gpu/Shaders/example_Heart.fsh",
	"res/gpu/Shaders/example_Heart.vsh",
	"res/gpu/Shaders/example_Outline.fsh",
	"res/gpu/Shaders/example_Outline.vsh",
	"res/gpu/Shaders/example_Outline_noMVP.vsh",
	"res/gpu/Shaders/node1.fsh",
	"res/gpu/Shaders/node1.vsh",
	"res/gpu/Shaders/ripple.fsh",
	"res/gpu/Shaders/ripple.vsh"
];




var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}

for (var i in common_res) {
    g_resources.push(common_res[i]);
}

for (var i in gpu_res) {
    g_resources.push(gpu_res[i]);
}