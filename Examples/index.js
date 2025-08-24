class HomePage extends ui.Page
{
  constructor()
  {
    super();

    this.container = 'fixed';
    this.title = 'Home';
    this.favicon = 'star.png';
  }
}

let page = new HomePage();
page.addHeader({ header: new ui.Header() });
page.present();

setTimeout(() => { page.removeHeader(); }, 3000);