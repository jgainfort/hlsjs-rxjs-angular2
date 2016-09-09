import { Component, OnInit } from '@angular/core';
import { PlayerService, PlayerState } from '../../shared';

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
    this.messages.push(`Player State: ${PlayerState[ state ]}`);
  }

  private onPlayerSrcChange(src: string): void {
    this.messages.push(`Player Source: ${src}`);
  }

  private initSubscribers(): void {
    this.playerService.currentState
      .subscribe(this.onPlayerStateChange.bind(this));
    this.playerService.currentSrc
      .subscribe(this.onPlayerSrcChange.bind(this));
  }
}
