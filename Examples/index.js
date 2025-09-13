class HomePage extends ui.Page
{
  constructor()
  {
    super();

    this.container = 'fixed';
    this.title = 'Home';
    this.favicon = 'star.png';

    let checkbox = new ui.Checkbox({ failure: true });
    
    let form = new ui.Form();
    form.addControl({ control: checkbox, label: 'Red' });
  
    this.addComponent({ component: form });
  }
}

let page = new HomePage();