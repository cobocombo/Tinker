class HomePage extends ui.Page
{
  constructor()
  {
    super();

    this.container = 'fixed';
    this.title = 'Home';
    this.favicon = 'star.png';

    let table = new ui.Table({ striped: true });
    let headerRow = new ui.TableRow();
    let bodyRow1 = new ui.TableRow();
    let bodyRow2 = new ui.TableRow();
    let footerRow = new ui.TableRow();

    headerRow.addCell({ cell: new ui.TableCell({ type: 'header', text: 'Planet' }) });
    headerRow.addCell({ cell: new ui.TableCell({ type: 'header', text: 'Diam. (km)' }) });
    headerRow.addCell({ cell: new ui.TableCell({ type: 'header', text: 'Dist. to Sun (AU)' }) });
    headerRow.addCell({ cell: new ui.TableCell({ type: 'header', text: 'Grav. (m/s²)' }) });

    bodyRow1.addCell({ cell: new ui.TableCell({ type: 'body', text: 'Mercury' }) });
    bodyRow1.addCell({ cell: new ui.TableCell({ type: 'body', text: '4,880' }) });
    bodyRow1.addCell({ cell: new ui.TableCell({ type: 'body', text: '0.39' }) });
    bodyRow1.addCell({ cell: new ui.TableCell({ type: 'body', text: '3.7' }) });

    bodyRow2.addCell({ cell: new ui.TableCell({ type: 'body', text: 'Venus' }) });
    bodyRow2.addCell({ cell: new ui.TableCell({ type: 'body', text: '12,104' }) });
    bodyRow2.addCell({ cell: new ui.TableCell({ type: 'body', text: '0.72' }) });
    bodyRow2.addCell({ cell: new ui.TableCell({ type: 'body', text: '8.9' }) });

    footerRow.addCell({ cell: new ui.TableCell({ type: 'header', text: 'Average' }) });
    footerRow.addCell({ cell: new ui.TableCell({ type: 'body', text: '9,126' }) });
    footerRow.addCell({ cell: new ui.TableCell({ type: 'body', text: '0.91' }) });
    footerRow.addCell({ cell: new ui.TableCell({ type: 'body', text: '341' }) });

    table.addRow({ row: headerRow, scope: 'header' });
    table.addRow({ row: bodyRow1, scope: 'body' });
    table.addRow({ row: bodyRow2, scope: 'body' });
    table.addRow({ row: footerRow, scope: 'footer' });

    this.addComponent({ component: table });
  }
}

let page = new HomePage();