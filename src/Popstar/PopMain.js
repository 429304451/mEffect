currentLevel = 1;
currentLevelScore = 0;

function getRandom(maxSize)
{
    return Math.floor(Math.random() * maxSize) % maxSize;
}

var PopMain = {};
PopMain.createScore = function(node, p, message) {
	var label = new cc.LabelTTF.create(message, "Arial", 30);
    label.setPosition(p);
    label.setColor(cc.color(255, 255, 255));
    label.setLocalZOrder(10000);
    node.addChild(label);
    return label;
};

PopMain.StarParticleCreate = function(node, x, y, name) {
	var particle = cc.ParticleSystem.create("res/Popstar/particles/" + name + ".plist");
    particle.setAnchorPoint(cc.p(0.5, 0.5));
    particle.setPosition(cc.p(x, y));
    particle.setLocalZOrder(120);
    node.addChild(particle);
    return particle;
};

Array.prototype.contains = function (value)
{
    for (var i = 0; i < this.length; i++) {
        if (this[i] == value) {
            return true;
        }
    }
    return false;
}