class HomePage extends ui.Page
{
  constructor()
  {
    super();

    this.container = 'fixed';
    this.title = 'Home';
    this.favicon = 'star.png';

    let sw = new ui.Switch({ 
      checked: true, 
      name: 'toggle-switch', 
      color: 'red',
      onChange: (value) => { console.log(value); } 
    });

    let form = new ui.Form();
    form.addControl({ control: sw, label: 'Switch Example' });

    this.addComponent({ component: form });

    setTimeout(() => { sw.off(); }, 2000);
    setTimeout(() => { sw.on(); }, 4000);
    setTimeout(() => { sw.toggle(); }, 6000);
  }
}

let page = new HomePage();