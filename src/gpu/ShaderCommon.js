
var ShaderSprite = cc.Sprite.extend({
    ctor: function (filename, fsh = "res/gpu/Shaders/default.fsh", vsh = "res/gpu/Shaders/default.vsh") {
        this._super(filename);

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
                // this.shader.setUniformLocationWith1f(this.shader.getUniformLocationForName('u_threshold'), 1.75);
                // this.shader.setUniformLocationWith3f(this.shader.getUniformLocationForName('u_outlineColor'), 0 / 255, 255 / 255, 0 / 255);
            }
            if(cc.sys.isNative){
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.shader);
                // glProgram_state.setUniformFloat("u_threshold", 1.75);
                // glProgram_state.setUniformVec3("u_outlineColor", {x: 0/255, y: 255/255, z: 0/255});
                this.setGLProgramState(glProgram_state);
            }else{
                this.shaderProgram = this.shader;
            }
        }
    }
});

cc.GLNode = cc.GLNode || cc.Node.extend({
    ctor:function(){
        this._super();
        this.init();
    },
    init:function(){
        this._renderCmd._needDraw = true;
        this._renderCmd._matrix = new cc.math.Matrix4();
        this._renderCmd._matrix.identity();
        this._renderCmd.rendering =  function(ctx){
            var wt = this._worldTransform;
            this._matrix.mat[0] = wt.a;
            this._matrix.mat[4] = wt.c;
            this._matrix.mat[12] = wt.tx;
            this._matrix.mat[1] = wt.b;
            this._matrix.mat[5] = wt.d;
            this._matrix.mat[13] = wt.ty;

            cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
            cc.kmGLPushMatrix();
            cc.kmGLLoadMatrix(this._matrix);

            this._node.draw(ctx);

            cc.kmGLPopMatrix();
        };
    },
    draw:function(ctx){
        this._super(ctx);
    }
});

var ShaderNode = cc.GLNode.extend({
    ctor:function(vertexShader, framentShader) {
        this._super();
        this.init();
        this.width = V.w;
        this.height = V.h;
        this.anchorX = 0.5;
        this.anchorY = 0.5;

        if( 'opengl' in cc.sys.capabilities ) {
            this.shader = cc.GLProgram.create(vertexShader, framentShader);
            this.shader.retain();
            this.shader.addAttribute("aVertex", cc.VERTEX_ATTRIB_POSITION);
            this.shader.link();
            this.shader.updateUniforms();

            var program = this.shader.getProgram();
            this.uniformCenter = gl.getUniformLocation( program, "center");
            this.uniformResolution = gl.getUniformLocation( program, "resolution");
            this.initBuffers();

            this.scheduleUpdate();
            this._time = 0;
        }
    },
    draw:function() {
        // console.log("draw");
        this.shader.use();
        this.shader.setUniformsForBuiltins();
        // Uniforms
        var frameSize = cc.view.getFrameSize();
        var visibleSize = cc.view.getVisibleSize();
        var retinaFactor = cc.view.getDevicePixelRatio();
        var position = this.getPosition();

        var centerx = position.x * frameSize.width/visibleSize.width * retinaFactor;
        var centery = position.y * frameSize.height/visibleSize.height * retinaFactor;
        // var centerx = position.x;
        // var centery = position.y;
        // console.log(frameSize, visibleSize, retinaFactor, position, centerx, centery, this.width, this.height);
        //             508,864    1280,720     1             640,360   254      431       1280       720
        //             2029,1334  1280,720     1             640,360   1014.5   666.59    1280       720
        this.shader.setUniformLocationF32( this.uniformCenter, centerx, centery);
        this.shader.setUniformLocationF32( this.uniformResolution, this.width, this.height);

        gl.enableVertexAttribArray( cc.VERTEX_ATTRIB_POSITION );

        // Draw fullscreen Square
        gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
        gl.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    },

    update:function(dt) {
        this._time += dt;
    },
    initBuffers:function() {
        // Square
        var squareVertexPositionBuffer = this.squareVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        vertices = [
            this.width,            this.height,
            0,              this.height,
            this.width,            0,
            0,              0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
});

// shader 测试专用测试场景
var ShaderCommon = cc.Scene.extend({

    ctor: function () {
        this._super();
        
        // 测试使用
    },

    onEnter: function () {
        this._super();
        var node = new cc.LabelTTF("ShaderCommon", "Arial", 26).to(this, 99).p(V.w/2, V.h/2);
        this.bag = new ShaderSprite("res/common/frozen.png").to(this).p(V.w/2, V.h/2);
        // var node = new cc.LabelTTF(this.introduceDic.HelloWorldScene, "Arial", 20);
        // node.to(this).pp(0.5, 0.5);
        // var name = "HelloWorldScene";
        // var node = new MLabel(name, this.introduceDic[name]).to(this).p(V.w/2, V.h/2);
    }
});