//canvas
const canvas = document.querySelector ('canvas');
const c = canvas.getContext('2d')

canvas.width=1024
canvas.height=576

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7

const background = new Sprite({
  position: {
    x:0,
    y:0
  },
  imageSrc: './imgs/background.png'
})

const shop = new Sprite({
  position: {
    x: 610,
    y: 127
  },
  imageSrc: './imgs/shop.png',
  scale: 2.75, 
  framesMax: 6
})

//players
const player = new Fighter({
  position: {
    x:0,
    y:0
  },
velocity: {
    x:0,
    y:0
  },
  offset: {
    x:0 ,
    y:0
  },
  imageSrc: './imgs/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.75 ,
  offset:{
    x: 215,
    y: 185
  },
  sprites: {
    idle: {
      imageSrc: './imgs/samuraiMack/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './imgs/samuraiMack/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './imgs/samuraiMack/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './imgs/samuraiMack/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './imgs/samuraiMack/Attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: './imgs/samuraiMack/Take hit - white silhouette.png',
      framesMax: 4
    },
    death: {
      imageSrc: './imgs/samuraiMack/Death.png',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 160,
      y: 40
    },
    width: 140,
    height: 50
  }

})

player.draw()

const enemy = new Fighter({
  position:{ 
    x:400,
    y:100
    },
  velocity: {
      x:0,
      y:0
  },
  color: 'blue',
  offset: {
    x:-70 ,
    y:0
  },
  imageSrc: './imgs/kenji/Idle.png',
  framesMax: 4,
  scale: 2.75 ,
  offset:{
    x: 215,
    y: 200
  },
  sprites: {
    idle: {
      imageSrc: './imgs/kenji/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: './imgs/kenji/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './imgs/kenji/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './imgs/kenji/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './imgs/kenji/Attack1.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './imgs/kenji/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './imgs/kenji/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -165,
      y: 50
    },
    width: 165,
    height: 50
  }

})

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  ArrowLeft:{
    pressed: false
  },
  ArrowRight:{
    pressed: false
  }
} 

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)

  background.update()
  shop.update()
  c.fillStyle = 'rgb(255, 255, 255, 0.12)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  //player movement
  if (keys.a.pressed && player.lastKey==='a')  {
    player.velocity.x = -5
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }

  //jumping
  if (player.velocity.y < 0){
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft')  {
    enemy.velocity.x = -2
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }

  //jumping
  if (enemy.velocity.y < 0){
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0){
    enemy.switchSprite('fall')
  }
 
    

  //detecting for collision && enemy gets hit
  if(
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    })&& 
    player.isAttacking && player.framesCurrent === 4 
    ) {
      enemy.takeHit()
    player.isAttacking = false
    document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    
    console.log('bam')
  }

  //if player misses
  if (player.isAttacking && player.framesCurrent === 5) {
    player.isAttacking = false
  }
  
  //this is where playre gets hit
  if(
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    })&& 
    enemy.isAttacking && enemy.framesCurrent === 2
    ) {
      player.takeHit()
    enemy.isAttacking = false
    document.querySelector('#playerHealth').style.width = player.health + '%'
    console.log('enamy attack successful')
  }

  //if enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
  }


  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({player, enemy, timerId})
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if (!player.dead){
    switch(event.key){
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break

      case 'a':
        keys.a.pressed = true
        player.lastKey='a'
        break

      case 'w':
        player.velocity.y= -20
        break

      case 's':
        player.attack()
        break
    }
  }
    
  if (!enemy.dead){
    switch(event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break

      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break

      case 'ArrowUp':
        enemy.velocity.y= -20
        break

      case 'ArrowDown':
        enemy.attack()
        break
    }
  }
  

})

window.addEventListener('keyup', (event) => {
  switch(event.key){
    case 'd':
      keys.d.pressed = false
      break

    case 'a':
      keys.a.pressed = false
      break

  }

  //enemy
  switch(event.key){
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break

    case 'Arrow.Left':
      keys.ArrowLeft.pressed = false
      break

  }

})


