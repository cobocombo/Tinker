class HomePage extends ui.Page
{
  constructor()
  {
    super();

    this.container = 'fixed';
    this.title = 'Home';
    this.favicon = 'star.png';

    this.addHeader({ header: new ui.Header() });
    this.addFooter({ footer: new ui.Footer() });
  }
}

let page = new HomePage();