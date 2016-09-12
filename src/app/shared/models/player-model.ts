export enum PlayerState {
  UNINITIALIZED,
  INITIALIZED,
  PAUSED,
  PLAYING,
  ERRORED
}

interface IPlayerSource {
  url?: string;
  title?: string;
  type?: string;
}

export class PlayerSource {
  url: string;
  title: string;
  type: string;

  constructor(obj?: IPlayerSource) {
    this.url = obj && obj.url || '';
    this.title = obj && obj.title || '';
    this.type = obj && obj.type || '';
  }
}

interface IPlayerModel {
  id?: string;
  controls?: boolean;
  autoplay?: boolean;
  width?: number;
  height?: number;
  errorMessage?: string;
  source?: any[];
}

const defaultErrorMessage = `To view this video please enable JavaScript, and consider upgrading to a web browser that
<a href='http://videojs.com/html5-video-support/' target='_blank'>supports HTML5 video</a>`;

export class PlayerModel {
  id: string;
  controls: boolean;
  autoplay: boolean;
  width: number;
  height: number;
  errorMessage: string;
  state: PlayerState;
  source: PlayerSource[];

  constructor(obj?: IPlayerModel) {
    this.id = obj && obj.id || '';
    this.controls = obj && obj.controls || true;
    this.autoplay = obj && obj.autoplay || false;
    this.width = obj && obj.width || 720;
    this.height = obj && obj.width || 405;
    this.errorMessage = obj && obj.errorMessage || defaultErrorMessage;
    this.state = null;
    this.source = obj && obj.source ? [].concat(obj.source.map((src: any) => { return new PlayerSource(src); }))
        : [].concat(new PlayerSource());
  }
}
