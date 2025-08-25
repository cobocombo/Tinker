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

    this.addComponent({ component: new ui.Heading({ level: 1, text: 'This is a heading!' }) });
    this.addComponent({ component: new ui.Paragraph({ text: 'This is a [em:very] [strong:strong] paragraph!' }) });
  }
}

let page = new HomePage();