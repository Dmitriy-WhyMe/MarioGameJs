//IMPORTANT: Make sure to use Kaboom version 0.5.0 for this game by adding the correct script tag in the HTML file.

kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
	debug: true,
	clearColor: [0, 0, 0, 1],
})

// Speed identifiers
const MOVE_SPEED = 120
const JUMP_FORCE = 360
const BIG_JUMP_FORCE = 550
let CURRENT_JUMP_FORCE = JUMP_FORCE
const FALL_DEATH = 500
const ENEMY_SPEED = 30
const BLOCK_SIZE = 20;

// Game logic

let isJumping = true
loadSprite('coin', 'https://i.imgur.com/wbKxhcd.png')
loadSprite('evil-shroom', 'https://i.imgur.com/KPO3fR9.png')
loadSprite('brick', 'https://i.imgur.com/pogC9x5.png')
loadSprite('block', 'https://i.imgur.com/M6rwarW.png')
loadSprite('mario', 'https://i.imgur.com/Wb1qfhK.png')
loadSprite('mushroom', 'https://i.imgur.com/0wMd92p.png')
loadSprite('surprise', 'https://i.imgur.com/gesQ1KP.png')
loadSprite('unboxed', 'https://i.imgur.com/bdrLpi6.png')
loadSprite('pipe-top-left', 'https://i.imgur.com/ReTPiWY.png')
loadSprite('pipe-top-right', 'https://i.imgur.com/hj2GK4n.png')
loadSprite('pipe-bottom-left', 'https://i.imgur.com/c1cYSbt.png')
loadSprite('pipe-bottom-right', 'https://i.imgur.com/nqQ79eI.png')
loadSprite('blue-block', 'https://i.imgur.com/fVscIbn.png')
loadSprite('blue-brick', 'https://i.imgur.com/3e5YRQd.png')
loadSprite('blue-steel', 'https://i.imgur.com/gqVoI2b.png')
loadSprite('blue-evil-shroom', 'https://i.imgur.com/SvV4ueD.png')
loadSprite('blue-surprise', 'https://i.imgur.com/RMqCc1G.png')

scene("game", ({ level, score }) => {

	
	layers(['bg', 'obj', 'ui'], 'obj')
	const maps = [
		[
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=    %   =*=%=                                =',
			'=                                             =',
			'=                               -+            =',
			'=                   a  ^        ()            =',
			'==============  ===============================',
		],
		[
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=                                             =',
			'=    %%   =*=%=        %==%==%==%==        =  =',
			'=                =                       = =  =',
			'=                  =                   = = =-+=',
			'=                   =               =  = = =()=',
			'==============  ===============================',
		],
		[
			'£                                             £',
			'£                                             £',
			'£                                             £',
			'£                                             £',
			'£                                             £',
			'£                                             £',
			'£                                             £',
			'£                                             £',
			'£                                             £',
			'£                                             £',
			'£                                             £',
			'£                                             £',
			'£                                             £',
			'£                                             £',
			'£                                             £',
			'£                                             £',
			'£                                             £',
			'£                                             £',
			'£        @*@@@@              x x              £',
			'£                          x x x              £',
			'£                        x x x x  x         -+£',
			'£               z   z  x x x x x  x         ()£',
			'!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
		]
	]

	const levelCfg = {
		width: BLOCK_SIZE,
		height: BLOCK_SIZE,

		'a': [sprite('block'), solid(), 'stop'],
		'=': [sprite('block'), solid()],
		'$': [sprite('coin'), 'coin'],
		'%': [sprite('surprise'), solid(), 'coin-surprise'],
		'*': [sprite('surprise'), solid(), 'mushroom-surprise'],
		'}': [sprite('unboxed'), solid()],
		'(': [sprite('pipe-bottom-left'), solid(), scale(0.5), 'pipes'],
		')': [sprite('pipe-bottom-right'), solid(), scale(0.5), 'pipes'],
		'-': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
		'+': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe'],
		'^': [sprite('evil-shroom'), solid(), body(), 'dangerous'],
		'#': [sprite('mushroom'), solid(), 'mushroom', body()],
		'!': [sprite('blue-block'), solid(), scale(0.5)],
		'£': [sprite('blue-brick'), solid(), scale(0.5)],
		'z': [sprite('blue-evil-shroom'), solid(), scale(0.5), 'dangerous'],
		'@': [sprite('blue-surprise'), solid(), scale(0.5), 'coin-surprise'],
		'x': [sprite('blue-steel'), solid(), scale(0.5)],
	}

	const gameLevel = addLevel(maps[level], levelCfg)

	add([text('Score: '), pos(BLOCK_SIZE, 470)])

	const scoreLabel = add([
		text(score),
		pos(BLOCK_SIZE+50, 470),
		layer('ui'),
		{
			value: score,
		}
	])

	add([text('level ' + parseInt(level + 1) ), pos(BLOCK_SIZE+60, 470)])
	add([text('Press f to start again'), pos(BLOCK_SIZE+120, 470)])
	
	function big() {
		let timer = 0
		let isBig = false
		return {
			update() {
				if (isBig) {
					CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
					timer -= dt()
					if (timer <= 0) {
						this.smallify()
					}
				}
			},
			isBig() {
				return isBig
			},
			smallify() {
				this.scale = vec2(1)
				CURRENT_JUMP_FORCE = JUMP_FORCE
				timer = 0
				isBig = false
			},
			biggify(time) {
				this.scale = vec2(2)
				timer = time
				isBig = true     
			}
		}
	}

	const player = add([
		sprite('mario'), solid(),
		pos(20, 0),
		body(),
		big(),
	])

	action('mushroom', (m) => {
		m.move(30, 0)
	})

	player.on("headbump", (obj) => {
		if (obj.is('coin-surprise')) {
			gameLevel.spawn('$', obj.gridPos.sub(0, 1))
			destroy(obj)
			gameLevel.spawn('}', obj.gridPos.sub(0,0))
		}
		if (obj.is('mushroom-surprise')) {
			gameLevel.spawn('#', obj.gridPos.sub(0, 1))
			destroy(obj)
			gameLevel.spawn('}', obj.gridPos.sub(0,0))
		}
	})

	player.collides('mushroom', (m) => {
		destroy(m)
		player.biggify(6)
	})

	player.collides('coin', (c) => {
		destroy(c)
		scoreLabel.value++
		scoreLabel.text = scoreLabel.value
	})

	action('dangerous', (d) => {
		d.move(-ENEMY_SPEED, 0)
		collides("dangerous","stop", (dangerous, stop) =>{
			action("dangerous", (d) => {
				d.move(ENEMY_SPEED, 0)
			})
		});
		collides("dangerous","pipes", (dangerous, pipes) =>{
			action("dangerous", (d) => {
				d.move(-ENEMY_SPEED, 0)
			})
		});
	})


	player.collides('dangerous', (d) => {
		if (isJumping) {
			destroy(d)
		} else {
			go('lose', { score: scoreLabel.value})
		}
	})

	player.action(() => {
		camPos(player.pos.x, player.pos.y*0.62)
		if (player.pos.y >= FALL_DEATH) {
			go('lose', { score: scoreLabel.value})
		}
	})

	player.collides('pipe', () => {
		keyPress('down', () => {
			go('game', {
				level: (level + 1) % maps.length,
				score: scoreLabel.value
			})
		})
		keyPress('s', () => {
			go('game', {
				level: (level + 1) % maps.length,
				score: scoreLabel.value
			})
		})
	})



	keyDown('left', () => {
		player.move(-MOVE_SPEED, 0)
	})

	keyDown('a', () => {
		player.move(-MOVE_SPEED, 0)
	})

	keyDown('ф', () => {
		player.move(-MOVE_SPEED, 0)
	})

	keyDown('right', () => {
		player.move(MOVE_SPEED, 0)
	})

	keyDown('d', () => {
		player.move(MOVE_SPEED, 0)
	})

	keyDown('в', () => {
		player.move(MOVE_SPEED, 0)
	})

	keyDown('f', () => {
		go('game', { level: 0, score: 0});
	})

	player.action(() => {
		if(player.grounded()) {
			isJumping = false
		}
	})

	keyPress('space', () => {
		if (player.grounded()) {
			isJumping = true
			player.jump(CURRENT_JUMP_FORCE)
		}
	})

	keyPress('up', () => {
		if (player.grounded()) {
			isJumping = true
			player.jump(CURRENT_JUMP_FORCE)
		}
	})

	keyPress('w', () => {
		if (player.grounded()) {
			isJumping = true
			player.jump(CURRENT_JUMP_FORCE)
		}
	})

	keyPress('ц', () => {
		if (player.grounded()) {
			isJumping = true
			player.jump(CURRENT_JUMP_FORCE)
		}
	})
})

scene('lose', ({ score }) => {
	let highScore = localStorage.highScore || score;
	if (score >= highScore)
	localStorage.highScore = score;
	highScore = localStorage.highScore;

	add([text("Game Over"), scale(3), origin('center'), pos(width()/2, height()/ 2.3)]);
	add([text("Your score: " + score), scale(1.5), origin('center'), pos(width()/2, height()/ 2.05)]);
	add([text("High score: " + highScore), scale(1.5), origin('center'), pos(width()/2, height()/ 1.9)]);
	add([rect(160, 20),  origin('center'), pos(width()/2, height()/ 1.75),"button-lose"]);
	add([text("Play Again"), origin('center'), pos(width()/2, height()/ 1.75), color(0, 0, 0)]);

	action("button-lose", (b) => {
		let position = mousePos();
		if (position.x > width()/2-80 && position.x < width()/2+80 && position.y > height()/1.8 && position.y < height()/1.7) {
			b.use(color(0.7, 0.7, 0.7));
		} else {
			b.use(color(1, 1, 1));
		}
	})
	mouseClick(() => {
		let position = mousePos();
		if (position.x > width()/2-80 && position.x < width()/2+80 && position.y > height()/1.8 && position.y < height()/1.7) {
			go('game', { level: 0, score: 0});
		}
	})
})

start("game", { level: 0, score: 0})
