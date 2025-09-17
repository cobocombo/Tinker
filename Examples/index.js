class HomePage extends ui.Page
{
  constructor()
  {
    super();

    this.container = 'fixed';
    this.title = 'Home';
    this.favicon = 'star.png';

    let button = new ui.Button({ text: 'Click Me!' })
    
    let form = new ui.Form();
    form.addControl({ control: button });
  
    this.addComponent({ component: form });
  }
}

let page = new HomePage();