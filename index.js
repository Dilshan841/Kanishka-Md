const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const P = require('pino');
const express = require('exs');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;
const { BOT_NAME } = require('./config');
app.get('/', (req, res) => {
    res.send(`🤖 BOT_NAME Bot Is Running¡);
);
app.listen(PORT, () => 
    console.log(`Server started on Port{PORT}`);
});

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('sessions');
    const { version } = await fetchLatestBaileysVersion();
    
    const sock = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state,
        version
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if(connection === 'close') {
      if((lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut) {
                startBot();
            } else {
                console.log('Connection closed. You are logged out.');
            }
        } else if(connection === 'open') {
            console.log('Bot connected successfully!');
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        if (!m.messages || !m.messages[0].message) return;
        const msg = m.messages[0];
        const from = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

        if (text === '.menu') {
            await sock.sendMessage(from, { text: `Hello! I am BOT_NAME Bot 🤖:.menu - Show Menu.status - Check Status` );
        
        if (text === '.status') 
            await sock.sendMessage(from,  text: `✅{BOT_NAME} is Online!` });
        }
    });
}

startBot();
