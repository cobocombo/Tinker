class HomePage extends ui.Page
{
  constructor()
  {
    super();

    this.container = 'fixed';
    this.title = 'Home';
    this.favicon = 'star.png';

    let area = new ui.TextArea();
    area.caretColor = 'red';

    let form = new ui.Form();
    form.addControl({ control: area });
  
    this.addComponent({ component: form });
  }
}

let page = new HomePage();