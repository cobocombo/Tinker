class HomePage extends ui.Page
{
  constructor()
  {
    super();

    this.container = 'fixed';
    this.title = 'Home';
    this.favicon = 'star.png';

    let select = new ui.Selector({ prompt: 'Pick a number...' , multiple: true });
    select.options = ['One', 'Two', 'Three'];
    select.onChange = (value) => { console.log(select.selectedOption) };
    
    let form = new ui.Form();
    form.addControl({ control: select });
  
    this.addComponent({ component: form });
  }
}

let page = new HomePage();