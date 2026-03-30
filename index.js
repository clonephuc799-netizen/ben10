const bedrock = require('bedrock-protocol')
const config = require('./config.json')

function startBot() {
  const client = bedrock.createClient({
    host: config.host,
    port: config.port,
    username: config.gamertag,
    offline: true   // 🔥 FIX: không login Microsoft
  })

  client.on('join', () => {
    console.log('joined')

    // Anti-AFK: di chuyển nhẹ mỗi 15s
    setInterval(() => {
      try {
        client.queue('move_player', {
          runtime_id: client.runtime_id,
          position: {
            x: Math.random() * 5,
            y: 100,
            z: Math.random() * 5
          },
          pitch: 0,
          yaw: Math.random() * 360,
          head_yaw: Math.random() * 360,
          mode: 0,
          on_ground: true,
          ridden_runtime_id: 0
        })
      } catch (e) {}
    }, 15000)
  })

  client.on('disconnect', () => {
    console.log('disconnected → reconnect')
    setTimeout(startBot, config.reconnect * 1000)
  })

  client.on('error', (err) => {
    console.log('error:', err.message)
  })
}

startBot()
