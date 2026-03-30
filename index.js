const bedrock = require('bedrock-protocol')
const config = require('./config.json')

let client;

function startBot() {
  client = bedrock.createClient({
    host: config.host,
    port: config.port,
    username: config.gamertag,

    // ⚠️ ép version (rất quan trọng)
    version: '1.20.0',

    offline: true,

    // fix handshake
    skipPing: false
  })

  client.on('join', () => {
    console.log('✅ Bot đã vào server')

    // giữ AFK
    setInterval(() => {
      client.write('player_auth_input', {
        pitch: 0,
        yaw: 0,
        position: client.entity.position,
        moveVector: { x: 0, z: 0 },
        inputs: 0
      })
    }, 2000)
  })

  client.on('spawn', () => {
    console.log('🎮 Spawn thành công')
  })

  client.on('disconnect', (packet) => {
    console.log('❌ Disconnected:', packet.reason)

    console.log('🔁 Reconnect sau', config.reconnect, 'giây')

    setTimeout(startBot, config.reconnect * 1000)
  })

  client.on('error', (err) => {
    console.log('⚠️ Error:', err)
  })
}

startBot()
