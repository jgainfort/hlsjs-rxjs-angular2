import { Component, OnInit, ElementRef } from '@angular/core';
import { PlayerService } from './shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  configUrl: string;
  title = 'app works!';
  hlsIsSupported: boolean;

  constructor(private playerService: PlayerService, private el: ElementRef) {
    this.configUrl = this.el.nativeElement.getAttribute('configUrl');
  }

  ngOnInit() {
    this.hlsIsSupported = Hls.isSupported();
    this.playerService.loadConfig(this.configUrl);
  }
}
