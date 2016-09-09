import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-hls-player',
  templateUrl: './hls-player.component.html',
  styleUrls: ['./hls-player.component.css']
})
export class HlsPlayerComponent implements OnInit {
  @ViewChild('video')video: HTMLVideoElement;

  private hls: any;

  constructor() {}

  ngOnInit() {
    this.video = this.video[ 'nativeElement' ];
    this.hls = new Hls();
    this.hls.attachMedia(this.video);

    this.setListeners();
  }

  loadSrc(src: string): void {
    this.hls.loadSource(src);
  }

  play(): void {
    this.video.play();
  }

  private setListeners(): void {
    this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      console.log('$$$ Hls::MEDIA_ATTACHED');
      this.loadSrc('http://www.streambox.fr/playlists/test_001/stream.m3u8');
    });
    this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
      console.log(`$$$ hls::MANIFEST_PARSED::QualityLevels: ${data.levels.length}`);
    });
    this.hls.on(Hls.Events.ERROR, this.onHlsError.bind(this));
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
