class HomePage extends Page
{
  constructor()
  {
    super();

    console.log('Home!');
  }
}

let page = new HomePage();
page.title = 'Home';
page.favicon = 'star.png';
page.present();