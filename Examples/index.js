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

    this.addComponent({ component: new ui.Icon({ name: 'bi bi-github', color: 'red', size: '32px' }) });

    let card = new ui.Card();
    card.addComponent({ component: new ui.Paragraph({ text: 'This is paragraph inside a card!' }) });

    let section = new ui.Section();
    section.addComponent({ component: new ui.Heading({ level: 1, text: 'This is a new section!' }) });
    section.addComponent({ component: new ui.Paragraph({ text: 'This is a paragraph inside a section!' }) });

    let hgroup = new ui.HeadingGroup();
    hgroup.addComponent({ component: new ui.Heading({ level: 1, text: 'This is a new section in heading group!' }) });
    hgroup.addComponent({ component: new ui.Paragraph({ text: 'This is a paragraph inside a heading group!' }) });

    let bquote = new ui.Blockquote();
    bquote.addComponent({ component: new ui.Heading({ level: 1, text: 'This is a new section in blockquote!' }) });
    bquote.addComponent({ component: new ui.Paragraph({ text: 'This is a paragraph inside a blockquote!' }) });

    this.addComponent({ component: new ui.Heading({ level: 1, text: 'This is a heading!' }) });
    this.addComponent({ component: new ui.Paragraph({ text: 'This is a [em:very] [strong:strong] paragraph!' }) });
    this.addComponent({ component: card });
    this.addComponent({ component: section });
    this.addComponent({ component: new ui.Divider() });
    this.addComponent({ component: hgroup });
    this.addComponent({ component: new ui.Divider() });
    this.addComponent({ component: bquote });
    this.addComponent({ component: new ui.Button({ styles: ['outline'], text: 'Hello!' }) });
  }
}

let page = new HomePage();