import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

declare var videojs: any;

@Component({
	selector: 'app-tutorial-lecture',
	templateUrl: './tutorial-lecture.component.html',
	styleUrls: ['./tutorial-lecture.component.scss']
})
export class TutorialLectureComponent implements OnInit, AfterViewInit, OnDestroy {
	private videoJSplayer: any;
	public videos: any;
	public currentVideo: any;
	public whereYouAt: any;
	public duration: any;
	showNav: Boolean = false;

  	constructor() { }

  	ngOnInit() {
		this.videos = [{
			title: 'Disney\'s Oceans',
			poster: 'http://vjs.zencdn.net/v/oceans.png',
			file: 'http://vjs.zencdn.net/v/oceans.mp4'
		}, {
			title: 'Wildlife',
			poster: 'http://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/bbb.png',
			file: 'https://ia800209.us.archive.org/24/items/WildlifeSampleVideo/Wildlife.mp4'
		}];
		this.currentVideo = 'http://vjs.zencdn.net/v/oceans.mp4';
	}
	ngAfterViewInit(): void {
		this.initVideoJs(this.currentVideo);
	}

	initVideoJs(src) {
		let videoLoaded = 10;
		var myPlayer = videojs('video_player');
		myPlayer.src(src);
		this.duration = myPlayer.duration();
		myPlayer.load();
		myPlayer.currentTime(videoLoaded);
		myPlayer.play();
		setInterval(() => {
		  let currentTime = myPlayer.currentTime();
		  this.whereYouAt = currentTime;
		}, 1);
	}
	public setVideo(video) {
		this.currentVideo = video.file;
		this.initVideoJs(video.file);
	}
  	navBtn() {
    	this.showNav = true;
  	}
	cnacelBtn() {
		this.showNav = false;
	}
	ngOnDestroy() {
		this.videoJSplayer.dispose();
	}
}
