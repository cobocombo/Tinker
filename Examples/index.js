class HomePage extends ui.Page
{
  constructor()
  {
    super();

    this.container = 'fixed';
    this.title = 'Home';
    this.favicon = 'star.png';

    this.addHeader({ header: new ui.Header() });
    this.addFooter({ footer: new ui.Footer() });

    let row = new ui.Row();
    row.addColumn({ column: new ui.Column({ component: new ui.Icon({ name: 'fa-solid fa-house' }) }) });
    row.addColumn({ column: new ui.Column({ component: new ui.Button({ text: 'Hello!' }) }) });
    this.addComponent({ component: row });
  }
}

let page = new HomePage();