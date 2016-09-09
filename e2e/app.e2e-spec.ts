import { HlsjsRxjsAngular2Page } from './app.po';

describe('hlsjs-rxjs-angular2 App', function() {
  let page: HlsjsRxjsAngular2Page;

  beforeEach(() => {
    page = new HlsjsRxjsAngular2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
