const game = document.getElementById('game')
const playerDisplay = document.getElementById('player')
const tooltip = document.getElementById('tooltip')

let debugOpen = false

let colliding = false
let activeHazards = 0
let gameOver = false
let gameActive = false

let intervals = {
    up: null,
    down: null,
    left: null,
    right: null,
    particles: null,
};

let player = {
    direction: {
        up: false,
        down: false,
        left: false,
        right: false
    },
    position: {
        y: game.offsetHeight / 2 - playerDisplay.offsetHeight / 2,
        x: 100,
    },
    dash: {
        active: false,
        available: true
    },
    health: {
        current: 0,
        max: 5
    },

    movementSpeed: 5,
    invincible: false,

    score: 0,
}

player.health.current = player.health.max

//KEY DOWN EVENTS

document.addEventListener('keydown', (event) => {
    //START MOVE UP
    if(event.key === 'w') {
        if(!player.direction.up) {
            intervals.up = setInterval(() => {
                if((player.position.y - player.movementSpeed) >= 0) {
                    player.position.y -= player.movementSpeed
                }
            }, 10);
            player.direction.up = true
        }
    }

    //START MOVE DOWN
    if(event.key === 's') {
        if(!player.direction.down) {
            intervals.down = setInterval(() => {
                if((player.position.y + player.movementSpeed) <= game.offsetHeight - playerDisplay.offsetHeight) {
                    player.position.y += player.movementSpeed
                }
            }, 10);
            player.direction.down = true
        }
    }

    //START MOVE LEFT
    if(event.key === 'a') {
        if(!player.direction.left) {
            intervals.left = setInterval(() => {
                if((player.position.x - player.movementSpeed) >= 0) {
                    player.position.x -= player.movementSpeed
                }
            }, 10);
            player.direction.left = true
        }
    }

    //START MOVE RIGHT
    if(event.key === 'd') {
        if(!player.direction.right) {
            intervals.right = setInterval(() => {
                if((player.position.x + player.movementSpeed) <= game.offsetWidth - playerDisplay.offsetWidth) {
                    player.position.x += player.movementSpeed
                }
            }, 10);
            player.direction.right = true
        }
    }

    //DASH
    if(event.key === ' ') {
        //Checks if dash is available
        if(player.dash.available) {

            //Plays dash audio
            DeBread.playSound(`sfx/dash${DeBread.randomNum(0, 2)}.mp3`, 0.1)

            //Changes dash attributes
            player.dash.available = false
            player.invincible = true

            //Displays invincibility
            playerDisplay.style.setProperty('outline','3px solid rgba(255, 255, 255, 0.5)')
    
            player.movementSpeed = 25
            DeBread.shake('game', 10, 10, 10, 100, true, 2)
            playerDisplay.classList.add('dashAnim')
            setTimeout(() => {
                player.invincible = false
                playerDisplay.style.setProperty('outline','none')
                playerDisplay.classList.remove('dashAnim')
            }, 400);
            setTimeout(() => {
                player.dash.available = true
            }, 500);

            let dashShock = document.createElement('div')
            dashShock.classList.add('dashShock')
            dashShock.style.top = player.position.y - 25 / 2 + 'px'
            dashShock.style.left = player.position.x - 25 / 2 + 'px'
            game.appendChild(dashShock)
            setTimeout(() => {
                game.removeChild(dashShock)
            }, 100);
        } else {

        }
    }

    if(event.key === '`') {
        if(debugOpen) {
            doge('debug').style.setProperty('display','none')
            debugOpen = false
        } else {
            doge('debug').style.setProperty('display','unset')     
            debugOpen = true
        }
    }

    if(event.key === 'Escape') {
        player.health.current = 0
        updateHealth()
    }

    // if(event.key === '-') {
    //     player.health.current--
        
    //     DeBread.shake('healthBar', 10, 5, 5, 100, true, 2)
    //     updateHealth()
    // }

    // if(event.key === '=') {
    //     player.health.current++
    //     updateHealth()
    // }

    // if(event.key === '[') {
    //     player.health.max--
    //     updateHealth()
    // }

    // if(event.key === ']') {
    //     player.health.max++
    //     updateHealth()
    // }

    //PARTICLE INTERVAL

    if(intervals.particles === null) {
        intervals.particles = setInterval(() => {
            if(!gameOver) {
                let particle = document.createElement('div')
    
                let randomSize = DeBread.randomNum(5, 10)
                particle.style.width = randomSize + 'px'
                particle.style.height = randomSize + 'px'
                
                particle.style.top = player.position.y + (playerDisplay.offsetWidth / 2) - (randomSize / 2) + (DeBread.randomNum(-playerDisplay.offsetWidth / 2 + randomSize / 2, playerDisplay.offsetWidth / 2 - randomSize / 2)) + 'px'
                particle.style.left = player.position.x + (playerDisplay.offsetHeight / 2) - (randomSize / 2) + (DeBread.randomNum(-playerDisplay.offsetHeight / 2 + randomSize / 2, playerDisplay.offsetHeight / 2 - randomSize / 2)) + 'px'
                particle.classList.add('particle')
                game.appendChild(particle)
    
                setTimeout(() => {
                    particle.style.setProperty('transform','scale(0)')
                    particle.style.setProperty('opacity','0')
                    setTimeout(() => {
                        game.removeChild(particle)
                    }, 1000);
                }, 100);
            }
        }, 50);
    }

    playerDisplay.style.setProperty('transform','scaleX(120%) scaleY(80%)')

    if(event.key === 'e' && collision(playerDisplay, doge('songEndless'))) {
        startLevel('endless')
    }

    updateDirection()
})

setInterval(() => {
    if(player.movementSpeed > 5) {
        player.movementSpeed -= 5
    }
}, 100)

//KEY UP EVENTS

document.addEventListener('keyup', (event) => {
    //STOP MOVE UP

    if(event.key === 'w') {
        clearInterval(intervals.up)
        player.direction.up = false
    }
    //STOP MOVE DOWN

    if(event.key === 's') {
        clearInterval(intervals.down)
        player.direction.down = false
    }
    //STOP MOVE LEFT

    if(event.key === 'a') {
        clearInterval(intervals.left)
        player.direction.left = false
    }
    //STOP MOVE RIGHT

    if(event.key === 'd') {
        clearInterval(intervals.right)
        player.direction.right = false
    }

    updateDirection()
})

function playerHit() {
    if(!player.invincible && !gameOver) {
        DeBread.playSound(`sfx/hurt.mp3`, 0.25)
        DeBread.shake('healthBar', 10, 5, 5, 100, true, 2)
        DeBread.shake('game', 10, 5, 5, 100, true, 2)
        if(player.health.current > 0 && !player.invincible) {
            player.health.current--
        }
        player.invincible = true
        DeBread.shake('game', 10, 20, 250, true, 100)
        playerDisplay.style.backgroundColor = 'red'
        setTimeout(() => {
            playerDisplay.style.backgroundColor = 'aqua'
            setTimeout(() => {
                playerDisplay.style.backgroundColor = 'red'
                setTimeout(() => {
                    playerDisplay.style.backgroundColor = 'aqua'
                }, 100);
            }, 100);
        }, 100);
        
        playerDisplay.classList.add('playerHurt')

        setTimeout(() => {
            playerDisplay.classList.remove('playerHurt')
            player.invincible = false
        }, 1000);
    } else {
        //
    }
    updateHealth()
}

//HAZARD CREATION

function createHazard(type, x, y, size, time, delay, rotation, trailDelay) {
    if(type === 'box') {
        let hazard = document.createElement('div')
        hazard.classList.add('hazard')
        hazard.style.top = y + 'px'
        hazard.style.left = x + 'px'
        hazard.style.width = size + 'px'
        hazard.style.height = size + 'px'
        
        game.appendChild(hazard)
        activeHazards++
    
        setTimeout(() => {
            hazard.classList.add('hazardAnimIn')
            if(!gameOver) {
                player.score += 100
            }
            doge('score').innerText = player.score
            let hazardCollision = setInterval(() => {
                if(collision(hazard, playerDisplay)) {
                    playerHit()
                    colliding = true
                } else {
                    colliding = false
                }
            }, 10);
            DeBread.shake('game', 10, 5, 5, 100, false)
            setTimeout(() => {
                hazard.classList.add('hazardAnimOut')
                clearInterval(hazardCollision)
                setTimeout(() => {
                    game.removeChild(hazard)
                    activeHazards--
                }, 250);
            }, time);
        }, delay);
    }
    if(type === 'bar') {
        let hazard = document.createElement('div')
        hazard.classList.add('hazard')

        if(rotation === 0) {
            hazard.style.width = '100%'
            hazard.style.height = size + 'px'
            hazard.style.top = y + 'px'
        } else {
            hazard.style.height = '100%'
            hazard.style.width = size + 'px'
            hazard.style.left = x + 'px'
        }

        game.appendChild(hazard)
        activeHazards++

        setTimeout(() => {
            hazard.classList.add('hazardAnimIn')
            if(!gameOver) {
                player.score += 100
            }
            doge('score').innerText = player.score
            let hazardCollision = setInterval(() => {
                if(collision(hazard, playerDisplay)) {
                    playerHit()
                    colliding = true
                } else {
                    colliding = false
                }
            }, 10);
            if(rotation === 0) {
                DeBread.shake('game', 10, 10, 0, 100, false)
            } else {
                DeBread.shake('game', 10, 0, 10, 100, false)
            }
            setTimeout(() => {
                if(rotation === 0) {
                    hazard.classList.add('hazardAnimOutBarY')
                } else {
                    hazard.classList.add('hazardAnimOutBarX')
                }
                clearInterval(hazardCollision)
                setTimeout(() => {
                    game.removeChild(hazard)
                    activeHazards--
                }, 250);
            }, time);
        }, delay);
    }
    if(type === 'trail') {
        if(rotation === 0) {
            if(!gameOver) {
                player.score += 100
            }
            doge('score').innerText = player.score
            for(let i = 0; i * size < game.offsetWidth; i++) {
                setTimeout(() => {
                    let hazard = document.createElement('div')
                    hazard.classList.add('hazard')
                    hazard.style.top = y + 'px'
                    hazard.style.left = i * (size + size / 10) + 'px'
                    hazard.style.width = size + 'px'
                    hazard.style.height = size + 'px'
                    
                    game.appendChild(hazard)
                    activeHazards++
                
                    setTimeout(() => {
                        hazard.classList.add('hazardAnimIn')
                        if(!gameOver) {
                            player.score += 10
                        }
                        doge('score').innerText = player.score
                        let hazardCollision = setInterval(() => {
                            if(collision(hazard, playerDisplay)) {
                                playerHit()
                                colliding = true
                            } else {
                                colliding = false
                            }
                        }, 10);
                        // DeBread.shake('game', 10, 5, 5, 100, false)
                        setTimeout(() => {
                            hazard.classList.add('hazardAnimOut')
                            clearInterval(hazardCollision)
                            setTimeout(() => {
                                game.removeChild(hazard)
                                activeHazards--
                            }, 250);
                        }, time);
                    }, delay);
                }, trailDelay * i);
            }
        }
        if(rotation === 1) {
            for(let i = 0; i * size < game.offsetHeight; i++) {
                setTimeout(() => {
                    let hazard = document.createElement('div')
                    hazard.classList.add('hazard')
                    hazard.style.top = i * (size + size / 10) + 'px'
                    hazard.style.left = x + 'px'
                    hazard.style.width = size + 'px'
                    hazard.style.height = size + 'px'
                    
                    game.appendChild(hazard)
                    activeHazards++
                
                    setTimeout(() => {
                        hazard.classList.add('hazardAnimIn')
                        let hazardCollision = setInterval(() => {
                            if(collision(hazard, playerDisplay)) {
                                playerHit()
                                colliding = true
                            } else {
                                colliding = false
                            }
                        }, 10);
                        // DeBread.shake('game', 10, 5, 5, 100, false)
                        setTimeout(() => {
                            hazard.classList.add('hazardAnimOut')
                            clearInterval(hazardCollision)
                            setTimeout(() => {
                                game.removeChild(hazard)
                                activeHazards--
                            }, 250);
                        }, time);
                    }, delay);
                    if(!gameOver) {
                        player.score += 10
                    }
                    doge('score').innerText = player.score
                }, trailDelay * i);
            }
        }
    }
}

function createItem(type, x, y) {
    let item = document.createElement('div')
    item.classList.add('item')
    item.style.left = x + 'px'
    item.style.top = y + 'px'
    
    if(type === 'health') {
        item.innerHTML = '<img src="images/icons/health.png" width="30">'
        
        let interval = setInterval(() => {
            if(collision(playerDisplay, item)) {
                clearInterval(interval)
                player.health.current++
                updateHealth()
                game.removeChild(item)
            }
        }, 8);
    }
    game.appendChild(item)
}

//MISC STUFF

function updateDirection() {
    if(!gameOver) {
        if(player.direction.left && player.direction.up) {
            playerDisplay.style.setProperty('rotate','45deg')
        } else if(player.direction.right && player.direction.up) {
            playerDisplay.style.setProperty('rotate','135deg')
        } else if(player.direction.left && player.direction.down) {
            playerDisplay.style.setProperty('rotate','315deg')
        } else if(player.direction.right && player.direction.down) {
            playerDisplay.style.setProperty('rotate','225deg')
        } else if(player.direction.up) {
            playerDisplay.style.setProperty('rotate','90deg')
        } else if(player.direction.down) {
            playerDisplay.style.setProperty('rotate','270deg')
        } else if(player.direction.left) {
            playerDisplay.style.setProperty('rotate','0deg')
        } else if(player.direction.right) {
            playerDisplay.style.setProperty('rotate','180deg')
        } else {
            playerDisplay.style.setProperty('transform','scaleX(100%) scaleY(100%)')
        }
    }
}

updateHealth()
function updateHealth() {
    const bar = doge('healthBarOverlay')
    const text = doge('health')
    bar.style.width = player.health.current / player.health.max * 100 + '%'
    text.innerText = `${player.health.current} / ${player.health.max}`
    if(player.health.current === 0 && !gameOver) {
        endLevel()
        game.classList.add('gameAnim')
        gameOver = true
        doge('healthBar').style.height = 0
        setTimeout(() => {
            doge('healthBar').style.width = 0
            setTimeout(() => {
                doge('healthBar').style.scale = 0
            }, 500);
        }, 500);

        setTimeout(() => {
            DeBread.shake('game', 10, 10, 10, 100, true, 3)
            playerDisplay.style.backgroundColor = 'transparent'
            doge('deathScreenContainer').style.setProperty('display','flex')
        }, 3000);

        setInterval(() => {
            player.movementSpeed = 0
        }, 1);
    }
}

setInterval(updatePosition, 8)

function updatePosition() {
    playerDisplay.style.left = player.position.x + 'px'
    playerDisplay.style.top = player.position.y + 'px'
    tooltip.style.left = player.position.x - (tooltip.offsetWidth / 2) + playerDisplay.offsetWidth / 2 + 'px'
    tooltip.style.top = player.position.y - 75 + 'px'
    doge('playerPosX').innerText = `X: ${player.position.x}`
    doge('playerPosY').innerText = `Y: ${player.position.y}`
    doge('playerSpeed').innerText = `Speed: ${player.movementSpeed}`
    doge('playerColliding').innerText = `Colliding?: ${colliding}`
    doge('playerUp').innerText = `Up?: ${player.direction.up}`
    doge('playerDown').innerText = `Down?: ${player.direction.down}`
    doge('playerLeft').innerText = `Left?: ${player.direction.left}`
    doge('playerRight').innerText = `Right?: ${player.direction.right}`
    doge('activeHazards').innerText = `Active Hazards: ${activeHazards}`
    if(collision(playerDisplay, healthBar) && !gameOver) {
        healthBar.style.opacity = 0.5
    } else {
        healthBar.style.opacity = 1
    }
    if(collision(playerDisplay, doge('endlessTimer'))) {
        doge('endlessTimer').style.opacity = 0.5
    } else {
        doge('endlessTimer').style.opacity = 1
    }
    if(collision(playerDisplay, doge('score'))) {
        doge('score').style.opacity = 0.5
    } else {
        doge('score').style.opacity = 1
    }
    if(collision(playerDisplay, doge('level'))) {
        doge('level').style.opacity = 0.5
    } else {
        doge('level').style.opacity = 1
    }
    if(collision(doge('songEndless'), playerDisplay)) {
        tooltip.style.setProperty('transform','scale(100%)')
        doge('songEndless').style.scale = '110%'
    } else {
        tooltip.style.setProperty('transform','scale(0%)')
        doge('songEndless').style.scale = '100%'
    }
}

//Chat GPT my beloved

function collision(div1, div2) {
    const rect1 = div1.getBoundingClientRect();
    const rect2 = div2.getBoundingClientRect();
  
    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
}

//FPS COUNTER
//CREDIT: https://www.growingwiththeweb.com/2017/12/fast-simple-js-fps-counter.html

const times = [];
let fps;

function refreshLoop() {
  window.requestAnimationFrame(() => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    refreshLoop();
  });
}

refreshLoop();

setInterval(() => {
    document.getElementById('fps').innerText = `FPS: ${fps}`
}, 500);