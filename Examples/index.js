class HomePage extends ui.Page
{
  constructor()
  {
    super();

    this.container = 'fixed';
    this.title = 'Home';
    this.favicon = 'star.png';

    let search = new ui.Searchbar();

    let form = new ui.Form();
    form.addControl({ control: search });
  
    this.addComponent({ component: form });
  }
}

let page = new HomePage();