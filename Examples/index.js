class HomePage extends ui.Page
{
  constructor()
  {
    super();

    this.container = 'fixed';
    this.title = 'Home';
    this.favicon = 'star.png';
    
    let form = new ui.Form();
    this.addComponent({ component: form });
  }
}

let page = new HomePage();