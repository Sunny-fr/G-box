const ipc = require('electron').ipcRenderer

const MessageCollection = require('../views/messages/MessageCollection')


const messageCollection = new MessageCollection()
messageCollection.setLabels(['UNREAD', 'INBOX']).fetch()
messageCollection.on('sync', (c) => {
    ipc.send('tray-title', messageCollection.length)
    setTimeout(()=>{
        messageCollection.fetch()
    }, 5 * 60 * 1000)
})
module.exports = {}