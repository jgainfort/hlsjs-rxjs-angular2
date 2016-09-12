import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import { PlayerState, PlayerModel, PlayerSource } from '../models/player-model';

@Injectable()
export class PlayerService {
  currentState: Subject<PlayerState> = new BehaviorSubject<PlayerState>(PlayerState.UNINITIALIZED);
  currentSrc: Subject<PlayerSource> = new BehaviorSubject<PlayerSource>(null);
  config: PlayerModel;

  constructor(private http: Http) { }

  loadConfig(src: string): void {
    this.http.get(src)
      .map((res: Response) => {
        return res.json()[ 0 ];
      })
      .subscribe((res: any) => {
        this.config = new PlayerModel(res);
      });
  }

  setPlayerState(state: PlayerState): void {
    if (state !== null) {
      this.config.state = state;
      this.currentState.next(state);
    }
  }

  setCurrentSrc(src: PlayerSource): void {
    this.config.source[ 0 ] = src;
    this.currentSrc.next(src);
  }
}
