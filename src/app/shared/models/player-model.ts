export enum PlayerState {
  UNINITIALIZED,
  INITIALIZED,
  PAUSED,
  PLAYING,
  ERRORED
}

export class PlayerModel {
  state: PlayerState;
  src: string;

  constructor() { }
}
