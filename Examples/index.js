class HomePage extends ui.Page
{
  constructor()
  {
    super();

    this.container = 'fixed';
    this.title = 'Home';
    this.favicon = 'star.png';

    let picker = new ui.FilePicker();
    picker.onUpload = (value) => { console.log(value); }

    let form = new ui.Form();
    form.addControl({ control: picker });
  
    this.addComponent({ component: form });
  }
}

let page = new HomePage();