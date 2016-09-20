import { Component, OnInit, ElementRef } from '@angular/core';
import { PlayerService, PlayerModel } from './shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  configUrl: string;
  title = 'app works!';
  hlsIsSupported: boolean;
  configLoaded: boolean = false;
  playerConfig: PlayerModel;

  constructor(private playerService: PlayerService, private el: ElementRef) {
    this.configUrl = this.el.nativeElement.getAttribute('configUrl');
  }

  ngOnInit() {
    this.hlsIsSupported = Hls.isSupported();
    this.playerService.loadConfig(this.configUrl)
      .subscribe((config: PlayerModel) => {
        this.playerConfig = config;
        this.configLoaded = true;
      });
  }
}
