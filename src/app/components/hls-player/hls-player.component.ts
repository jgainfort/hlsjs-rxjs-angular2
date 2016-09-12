import { Component, OnInit, ViewChild } from '@angular/core';
import { PlayerService, PlayerState, PlayerSource } from '../../shared';

@Component({
  selector: 'app-hls-player',
  templateUrl: './hls-player.component.html',
  styleUrls: [ './hls-player.component.css' ]
})
export class HlsPlayerComponent implements OnInit {
  @ViewChild('video') video: HTMLVideoElement;

  private hls: Hls;

  constructor(public playerService: PlayerService) { }

  ngOnInit() {
    this.video = this.video[ 'nativeElement' ];
    this.hls = new Hls();
    this.hls.attachMedia(this.video);

    this.initSubscribers();
    this.setVideoListeners();
    this.setHlsPlayerListeners();
  }

  loadSrc(src: PlayerSource): void {
    if (src) {
      this.hls.loadSource(src.url);
    }
  }

  play(): void {
    this.video.play();
  }

  pause(): void {
    this.video.pause();
  }

  private initSubscribers(): void {
    this.playerService.currentSrc
      .subscribe(this.loadSrc.bind(this));
  }

  private setHlsPlayerListeners(): void {
    this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      console.log('$$$ Hls::MEDIA_ATTACHED');
      this.playerService.setPlayerState(PlayerState.INITIALIZED);
      if (this.playerService.config.source[ 0 ] && this.playerService.config.source[ 0 ].url !== '') {
        this.loadSrc(this.playerService.config.source[ 0 ]);
      }
    });
    this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
      console.log(`$$$ hls::MANIFEST_PARSED::QualityLevels: ${data.levels.length}`);
      this.playerService.setPlayerState(PlayerState.PAUSED);
      this.play();
    });
    this.hls.on(Hls.Events.ERROR, this.onHlsError.bind(this));
  }

  private setVideoListeners(): void {
    this.video.addEventListener('playing', () => {
      this.playerService.setPlayerState(PlayerState.PLAYING);
    });
    this.video.addEventListener('pause', () => {
      this.playerService.setPlayerState(PlayerState.PAUSED);
    });
  }

  private onHlsError(event: any, data: any): void {
    const errorType: string = data.type;
    const errorDetails: string = data.details;
    const errorFatal: boolean = data.fatal;

    console.log(`$$$ hls::ERROR::Type: ${errorType} Details: ${errorDetails} Fatal: ${errorFatal}`);

    if (errorFatal) {
      switch (errorType) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          console.log('$$$ hls::fatal network error encountered, try to recover');
          this.hls.startLoad();
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          console.log('$$$ hls::fatal media error encountered, try to recover');
          this.hls.recoverMediaError();
          break;
        default:
          console.log('$$$ hls::non-recoverable error encountered, destroying');
          this.hls.destroy();
          break;
      }
    }
  }
}
