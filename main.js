const { app, BrowserWindow} = require('electron');

const createWindow = () => {
  const win = new BrowserWindow({
    height: 600,
    width: 800,
  });
  win.loadFile('./dist/uploader-ng-app/index.html');
}

app.whenReady().then(() => {
  createWindow();
});
