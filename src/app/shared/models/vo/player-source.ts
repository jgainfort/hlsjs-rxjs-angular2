export class IPlayerSource {
  url?: string;
  title?: string;
  type?: string;
}

export class PlayerSource {
  url: string;
  title: string;
  type: string;

  constructor(obj?: any) {
    this.url = obj && obj.url || null;
    this.title = obj && obj.title || null;
    this.type = obj && obj.type || null;
  }
};
