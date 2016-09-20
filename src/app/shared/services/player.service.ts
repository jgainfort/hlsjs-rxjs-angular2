import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import { PlayerState, PlayerModel, PlayerSource } from '../';

@Injectable()
export class PlayerService {
  currentState: Subject<PlayerState> = new BehaviorSubject<PlayerState>(PlayerState.UNINITIALIZED);
  currentSrc: Subject<PlayerSource> = new Subject<PlayerSource>();
  currentPlayerSize: Subject<{ width: number, height: number }> = new Subject<{ width: number, height: number }>();
  currentTime: Subject<number> = new Subject<number>();
  playerModel: PlayerModel;

  constructor(private http: Http) { }

  loadConfig(src: string): Observable<PlayerModel> {
    return this.http.get(src)
      .map((res: Response) => {
        this.playerModel = new PlayerModel(res.json()[ 0 ]);
        return this.playerModel;
      });
  }

  setPlayerState(state: PlayerState): void {
    if (state !== null) {
      this.playerModel.state = state;
      this.currentState.next(state);
    }
  }

  setCurrentSrc(src: PlayerSource): void {
    this.playerModel.source = src;
    this.currentSrc.next(src);
  }

  setPlayerSize(width: number, height: number) {
    this.playerModel.width = width;
    this.playerModel.height = height;
    this.currentPlayerSize.next({ width: width, height: height });
  }

  setCurrentTime(time: number): void {
    this.playerModel.controls.currentTime = time;
    this.currentTime.next(time);
  }

  setTotalTime(time: number): void {
    this.playerModel.controls.totalTime = time;
  }
}
