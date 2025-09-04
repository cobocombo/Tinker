class HomePage extends ui.Page
{
  constructor()
  {
    super();

    this.container = 'fixed';
    this.title = 'Home';
    this.favicon = 'star.png';

    let textfield = new ui.Textfield();
    textfield.text = 'First Name...';
    textfield.type = 'password';
    textfield.caretColor = 'red';
    textfield.textColor = 'blue';
    textfield.maxLength = 5;
    textfield.onChange = (value) => { console.log(value); }
    textfield.onTextChange = (value) => { console.log(value); }
    textfield.failure = true;
    textfield.success = true;

    let sw = new ui.Switch({ 
      checked: true, 
      name: 'toggle-switch', 
      color: 'red',
      onChange: (value) => { console.log(value); } 
    });

    let form = new ui.Form();
    form.addControl({ control: textfield });
    form.addControl({ control: sw, label: 'Switch Example' });
  
    this.addComponent({ component: form });
  }
}

let page = new HomePage();