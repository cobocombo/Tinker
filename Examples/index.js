class HomePage extends ui.Page
{
  constructor()
  {
    super();

    this.container = 'fixed';
    this.title = 'Home';
    this.favicon = 'star.png';

    let slide = new ui.Slider();
    
    let form = new ui.Form();
    form.addControl({ control: slide });
  
    this.addComponent({ component: form });
  }
}

let page = new HomePage();