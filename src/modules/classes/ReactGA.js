import * as OrginalReactGA from 'react-ga';

class ReactGA {

  constructor() {
    this.lastestPage = null;
    this.original = OrginalReactGA;

    this.original.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID, {
      // debug: true
    });

    this.original.set({
      // sendHitTask: null,  // google-analytics送信しない設定
      location: `${window.location.protocol}//${window.location.hostname}/`
    });
  }

  doPageTracking = () => {
    const page = window.location.pathname;
    if (page === this.lastestPage) {
      return;
    }
    this.lastestPage = page;

    this.original.set({
      // 独自なデータを設定
      page
    });
    this.original.pageview(page);
  }

}

export default new ReactGA();
