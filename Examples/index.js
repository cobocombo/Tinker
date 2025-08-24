class HomePage extends Page
{
  constructor()
  {
    super();
  }
}

let page = new HomePage();
page.title = 'Home';
page.favicon = 'star.png';
page.container = 'fixed';
page.present();