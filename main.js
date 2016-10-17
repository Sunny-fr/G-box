const electron = require('electron')
const path = require('path')
// Module to control application life.
const app = electron.app
const ipc = electron.ipcMain
const Menu = electron.Menu
const Tray = electron.Tray

let trayIcon = null

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}



// TRAY ICON START


ipc.on('tray-title', function(event,count){
  trayIcon.setTitle('' + count)
  trayIcon.setContextMenu(Menu.buildFromTemplate([{
    label: count + ' messages non lus',
    click: function () {
      mainWindow.show()
    }
  }]))
})

ipc.on('put-in-tray', function (event) {
  const iconName = process.platform === 'win32' ? 'icon.png' : 'icon.png'
  const iconPath = path.join(__dirname, iconName)
  trayIcon = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate([{
    label: 'Focus',
    click: function () {
      mainWindow.show()
    }
  }])
  trayIcon.setToolTip('Gmail')
  trayIcon.setContextMenu(contextMenu)
})


ipc.on('remove-tray', function () {
  trayIcon.destroy()
})


// TRAY ICON END



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function(){
  ipc.emit('put-in-tray')
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (trayIcon) trayIcon.destroy()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
