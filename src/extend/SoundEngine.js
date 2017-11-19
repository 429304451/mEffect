/**
 * Created on 2017/11/18.
 */

var __SoundEngine = function () {

	// 所使用的引擎
	var audioEngine;
	if (cc.sys.isNative) {
		audioEngine = jsb.AudioEngine;
	} else {
		audioEngine = cc.audioEngine;
	}

	// 最后播放的时间
	var lastPlayTick = [];

	this.stopAll = function () {
		audioEngine.stopAll();
	};

	if (cc.sys.isNative) {
		// 背景音乐id
		this.backgroundMusicID = null;
		this.effectVolume = 0.5;
		this.musicVolume = 0.5;

		this.setEffectsVolume = function (effectVolume) {
			this.effectVolume = effectVolume;
		};

		this.getEffectsVolume = function () {
			return this.effectVolume;
		};

		this.setBackgroundMusicVolume = function (musicVolume) {
			this.musicVolume = musicVolume;
			if (this.backgroundMusicID != null) {
				audioEngine.setVolume(this.backgroundMusicID, this.musicVolume);
			}
		};

		this.getBackgroundMusicVolume = function () {
			return this.musicVolume;
		};

		this.stop = function (soundID) {
			return audioEngine.stop(soundID);
		};

		// 播放音效
		this.playEffect = function (soundPath, isLoop, volume, audioProfile) {
			if (!lastPlayTick[soundPath]) {
				if (Date.now() - lastPlayTick[soundPath] < 20) {
					return;
				}
			}
			lastPlayTick[soundPath] = Date.now();

			var v = volume == null ? this.effectVolume * 1 : this.effectVolume * volume;
			v = v > 1 ? 1 : v;
			v = v < 0 ? 0 : v;
			// jsb可不识别空参数 你有传 他就会试着解析
			if (audioProfile) {
				return audioEngine.play2d(soundPath, isLoop == null ? false : isLoop, v, audioProfile);
			}
			return audioEngine.play2d(soundPath, isLoop == null ? false : isLoop, v);
		};

		this.stopBackgroundMusic = function () {
			if (this.backgroundMusicID != null) {
				audioEngine.stop(this.backgroundMusicID);
				this.backgroundMusicID = null;
			}
		};

		// 播放背景音乐
		this.playBackgroundMusic = function (soundPath, isLoop, volume, audioProfile) {
			if (this.backgroundMusicID != null) {
				audioEngine.stop(this.backgroundMusicID);
			}
			if (audioProfile) {
				return this.backgroundMusicID = audioEngine.play2d(soundPath, isLoop, volume == null ? this.musicVolume : volume, audioProfile);
			}
			return this.backgroundMusicID = audioEngine.play2d(soundPath, isLoop, volume == null ? this.musicVolume : volume);
		};

		this.pauseAll = function () {
			audioEngine.pauseAll();
		};

		this.resumeAll = function () {
			audioEngine.resumeAll();
		};

		this.setAllVolume = function (volume) {
			audioEngine.setAllVolume(volume);
		};

		this.resumeBackgroundMusic = function () {
			if (this.backgroundMusicID != null) {
				audioEngine.resume(this.backgroundMusicID);
			}
		};

		this.pauseBackgroundMusic = function () {
			if (this.backgroundMusicID != null) {
				audioEngine.pause(this.backgroundMusicID);
			}
		};
	} else {
		// 背景音乐ID
		this.backgroundMusicID = null;
		this.effectVolume = 1; // 音效音量
		this.musicVolume = 1;  // 背景声音音量

		this.setEffectsVolume = function (effectVolume) {
			this.effectVolume = effectVolume;
			audioEngine.setEffectsVolume(this.effectVolume);
		};

		this.getEffectsVolume = function () {
			return this.effectVolume;
		};

		this.setBackgroundMusicVolume = function (musicVolume) {
			this.musicVolume = musicVolume;
			return audioEngine.setMusicVolume(musicVolume);
		};

		this.getBackgroundMusicVolume = function () {
			return this.musicVolume;
		};

		this.stop = function (soundID) {
			return audioEngine.stopEffect(soundID);
		};

		// 播放音效
		this.playEffect = function (soundPath, isLoop, volume, audioProfile) {
			return audioEngine.playEffect(soundPath, isLoop);
		};

		this.stopBackgroundMusic = function () {
			return audioEngine.stopMusic();
		};

		// 播放背景音乐
		this.playBackgroundMusic = function (soundPath, isLoop, volume, audioProfile) {
			return audioEngine.playMusic(soundPath, isLoop);
		};

		this.resumeBackgroundMusic = function () {
			return audioEngine.resumeMusic();
		};

		this.pauseBackgroundMusic = function() {
			return audioEngine.pauseMusic();
		};
	}

	this.stopEffect = this.stop;
	this.pauseMusic = this.pauseBackgroundMusic;
	this.resumeMusic = this.resumeBackgroundMusic;
	this.playMusic = this.playBackgroundMusic;
	this.stopMusic = this.stopBackgroundMusic;
	this.getMusicVolume = this.getBackgroundMusicVolume;
	this.setMusicVolume = this.setBackgroundMusicVolume;
};

var SoundEngine = new __SoundEngine();