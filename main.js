const { app, BrowserWindow, Tray, Menu } = require('electron');

let win
let quit = false

const createWindow = () => {
    win = new BrowserWindow({
    height: 400,
    width: 400,
    icon: __dirname + './src/assets/upload.png'
  });

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
  const tray = new Tray(__dirname + './src/assets/upload.png')

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
