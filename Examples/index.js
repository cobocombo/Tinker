class HomePage extends ui.Page
{
  constructor()
  {
    super();

    this.container = 'fixed';
    this.title = 'Home';
    this.favicon = 'star.png';

    let w3schoolsLink = new ui.Link
    ({ 
      url: 'https://www.w3schools.com/html/html_links.asp', 
      text: 'W3 Schools - HTML Links', 
      color: 'blue'
    });

    let row = new ui.Row();
    row.addColumn({ column: new ui.Column({ component: new ui.Icon({ name: 'fa-solid fa-house' }) }) });
    row.addColumn({ column: new ui.Column({ component: new ui.Button({ text: 'Hello!' }) }) });
    this.addComponent({ component: row });
    this.addComponent({ component: w3schoolsLink });
  }
}

let page = new HomePage();