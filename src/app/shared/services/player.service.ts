import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { PlayerState } from '../models/player-model';

@Injectable()
export class PlayerService {
  currentState: Subject<PlayerState> = new BehaviorSubject<PlayerState>(PlayerState.UNINITIALIZED);
  currentSrc: Subject<string> = new BehaviorSubject<string>(null);

  constructor() { }

  setPlayerState(state: PlayerState): void {
    this.currentState.next(state);
  }

  setCurrentSrc(src: string): void {
    this.currentSrc.next(src);
  }
}
