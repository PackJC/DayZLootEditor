const electron = require("electron");
const { app, BrowserWindow ,ipcMain,dialog} = electron;
const path = require('path')
const fs = require('fs');
const xml2js = require('xml2js');
const json2html = require('node-json2html');

try {
  require('electron-reloader')(module)
} catch (_) {}

let localDataFile;

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    icon: './media/DayZLogo.PNG',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      nodeIntegrationInWorker: true,
    }
  })
  mainWindow.loadFile('index.html')
  mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// Use local web browser to open links
app.on('web-contents-created', (e, contents) => {
  contents.on('new-window', (e, url) => {
    e.preventDefault();
    require('open')(url);
  });
  contents.on('will-navigate', (e, url) => {
    if (url !== contents.getURL()){
      e.preventDefault();
      require('open')(url);
    }
  });
});

ipcMain.on("getFileEvent",(event)=>{
  options={
    title:"Select XML Files to import",
    buttonLabel:"Import .XML File",
    defaultPath:app.getPath('desktop'),
    properties:['openFile'],
    filters :[
      {name: 'XML', extensions: ['xml']}
        ],
  }
  dialog.showOpenDialog(options).then((result)=>{
    pages = result.filePaths
    let filePath = result.filePaths.toString()
    if(false === result.canceled){
      const data = fs.readFileSync(filePath,
          {encoding:'utf8', flag:'r'});
        // Parse XML to JSON
        xml2js.parseString(data, (err, result) => {
          if(err) {
            throw err;
          }
          console.log(JSON.stringify(result))
          // Convert to JSON String and event reply
          //localDataFile = JSON.stringify(result, null, 0)
          localDataFile = JSON.stringify(result)
        });
      //localDataFile sends JSON string
      //sends JSON Object
      //data sends raw XML9
      event.reply("receiveDataReply",localDataFile)

    }
    else{
      console.warn("File was not selected!")
    }
  })
})

ipcMain.on("saveFileEvent",(event)=>{
  options={
    title:"Select XML Files to export",
    buttonLabel:"Save",
    defaultPath:app.getPath('desktop'),
    filters :[
      {name: 'XML', extensions: ['xml']}
    ],
  }
  dialog.showSaveDialog(options).then((result)=>{
    if(false === result.canceled) {
      console.log("Out: " + localDataFile)
      const builder = new xml2js.Builder();
      const xml = builder.buildObject((JSON.parse(localDataFile)));
      fs.writeFile(result.filePath, xml, (err) => {
      });
    }
    else{
      console.warn("File was not selected!")
    }
  })
})
