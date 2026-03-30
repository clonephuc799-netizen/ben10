const bedrock = require('bedrock-protocol')

const config = require('./config.json')

function startBot() {
  const client = bedrock.createClient({
    host: config.host,
    port: config.port,
    username: config.username
  })

  client.on('join', () => {
    console.log('joined')

    // Anti AFK (di chuyển ngẫu nhiên)
    setInterval(() => {
      client.queue('move_player', {
        runtime_id: client.runtime_id,
        position: {
          x: Math.random() * 20,
          y: 100,
          z: Math.random() * 20
        },
        pitch: 0,
        yaw: Math.random() * 360,
        head_yaw: Math.random() * 360,
        mode: 0,
        on_ground: true,
        ridden_runtime_id: 0
      })
    }, 15000)
  })

  client.on('disconnect', () => {
    console.log('reconnecting...')
    setTimeout(startBot, 5000)
  })

  client.on('error', (err) => {
    console.log('error:', err.message)
  })
}

startBot()
