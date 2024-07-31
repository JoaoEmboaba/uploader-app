const { app, BrowserWindow, Tray, Menu } = require('electron');

let win
let quit = false

const createWindow = () => {
    win = new BrowserWindow({
    height: 300,
    width: 250,
    resizable: true,
    icon: __dirname + './src/assets/logo.png'
  });

  win.setBounds({x: 50, y: 700});

  win.once('ready-to-show', () => {
    win.show()
  })

  win.loadFile('./dist/uploader-ng-app/index.html');

  win.on('minimize', (event) => {
    event.preventDefault();
    win.hide();
  })

  win.on('close', (event) => {
    if(!quit) {
      event.preventDefault();
      win.hide()
    }
  })
}

app.whenReady().then(() => {
  createWindow();
})

app.on('ready', () => {
  const tray = new Tray(__dirname + './src/assets/logo.png')

  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Exibir uploader', click: () => {
        win.show();
      }
    },
    {
      label: 'Sair', click: () => {
        quit = true;
        app.quit();
      }
    }
  ]))
})
