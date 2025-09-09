class HomePage extends ui.Page
{
  constructor()
  {
    super();

    this.container = 'fixed';
    this.title = 'Home';
    this.favicon = 'star.png';

    let search = new ui.Searchbar();
    let accordion = new ui.Accordion({ title: 'This is a title', titleColor: 'blue' });
    
    let form = new ui.Form();
    form.addControl({ control: search });
  
    this.addComponent({ component: form });
  }
}

let page = new HomePage();