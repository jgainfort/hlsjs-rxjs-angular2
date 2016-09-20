import { PlayerState } from '../../';

interface IPlayerControls {
  enabled?: boolean;
  state?: PlayerState;
  volume?: number;
  ccEnabled?: boolean;
  fullscreenEnabled?: boolean;
  fullscreen?: boolean;
}

export class PlayerControls {
  enabled: boolean;
  state: PlayerState;
  volume: number;
  ccEnabled: boolean;
  fullscreenEnabled: boolean;
  fullscreen: boolean;
  currentTime: number;
  totalTime: number;

  constructor(obj?: IPlayerControls) {
    this.enabled = obj && obj.enabled || false;
    this.state = obj && obj.state || PlayerState.UNINITIALIZED;
    this.volume = obj && obj.volume || 1.0;
    this.ccEnabled = obj && obj.ccEnabled || false;
    this.fullscreenEnabled = obj && obj.fullscreenEnabled || true;
    this.fullscreen = obj && obj.fullscreen || false;
    this.currentTime = 0;
    this.totalTime = 0;
  }
}
