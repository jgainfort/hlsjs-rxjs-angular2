import { Component, OnInit } from '@angular/core';
import { PlayerService, PlayerState, PlayerSource } from '../../shared';

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.css']
})
export class LoggerComponent implements OnInit {
  messages: string[] = [];

  constructor(private playerService: PlayerService) { }

  ngOnInit() {
    this.initSubscribers();
  }

  private onPlayerStateChange(state: PlayerState): void {
    if (state !== null) {
      this.messages.push(`Player State: ${PlayerState[ state ]}`);
    }
  }

  private onPlayerSrcChange(src: PlayerSource): void {
    if (src !== null) {
      this.messages.push(`Player Source: ${src.url}`);
    }
  }

  private initSubscribers(): void {
    this.playerService.currentState
      .subscribe(this.onPlayerStateChange.bind(this));
    this.playerService.currentSrc
      .subscribe(this.onPlayerSrcChange.bind(this));
  }
}
