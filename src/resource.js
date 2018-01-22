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
	"res/gpu/Shaders/ripple.vsh",
	
    "res/Popstar/star_packer.plist",
    "res/Popstar/star_packer.png",
    "res/Popstar/sounds/broken.mp3",
    "res/Popstar/sounds/click.mp3",
    "res/Popstar/sounds/fire.mp3",
    "res/Popstar/sounds/gameover.mp3",
    "res/Popstar/sounds/select.mp3",
    "res/Popstar/sounds/stageclear.mp3",
    "res/Popstar/sounds/win.mp3",

    "res/Popstar/fonts/bitmapFontTest.png",
    "res/Popstar/fonts/character.png",
    "res/Popstar/fonts/highscore.png",
    "res/Popstar/fonts/s_number_member_small.fnt",
    "res/Popstar/fonts/s_number_member_small.png",
    "res/Popstar/fonts/s_number_score.fnt",
    "res/Popstar/fonts/s_number_score.png",
    "res/Popstar/fonts/titleinfo.fnt",

    "res/Popstar/particles/fire.png",
    "res/Popstar/particles/leaf_open.plist",
    "res/Popstar/particles/quanquan.plist",
    "res/Popstar/particles/spark.plist",
    "res/Popstar/particles/star1d.png",
    "res/Popstar/particles/star2d.png",
    "res/Popstar/particles/star3d.png",
    "res/Popstar/particles/star4d.png",
    "res/Popstar/particles/star5d.png",
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