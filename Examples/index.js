class HomePage extends ui.Page
{
  constructor()
  {
    super();

    this.container = 'fixed';
    this.title = 'Home';
    this.favicon = 'star.png';

    let ford = new ui.RadioButton({ name: 'truck' });
    let chevy = new ui.RadioButton({ name: 'truck' });
    let dodge = new ui.RadioButton({ name: 'truck' });
    
    let form = new ui.Form();
    form.addControl({ control: ford, label: 'Ford' });
    form.addControl({ control: chevy, label: 'Chevy' });
    form.addControl({ control: dodge, label: 'Dodge' });
  
    this.addComponent({ component: form });
  }
}

let page = new HomePage();