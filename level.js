const menu = document.getElementById('menu')

let levelIncreaseInterval
let endlessLevel = 0
let endlessInterval = 1000
let endlessBorderSize = 10

let endlessLevelTimerInterval
let endlessLevelTimer = 60

function startLevel(id) {
    menu.style.display = 'none'
    player.health.current = player.health.max
    updateHealth()

    player.position.y = game.offsetHeight / 2 - playerDisplay.offsetHeight / 2
    player.position.x = 100

    if(id === 'endless') {
        doge('score').style.top = '10px'
        doge('level').style.left = '10px'
        doge('endlessTimer').style.display = 'flex'
        placeHazards()
    
        function placeHazards(delay) {
            setTimeout(() => {        
                if(endlessLevel === 0) {
                    createHazard('box', DeBread.randomNum(0, game.offsetWidth - 400), DeBread.randomNum(0, game.offsetHeight - 400), 400, 1000, 2500)
                } else if(endlessLevel === 1) {
                    createHazard('box', DeBread.randomNum(0, game.offsetWidth - 400), DeBread.randomNum(0, game.offsetHeight - 400), 400, 1000, 2500)
                    setTimeout(() => {
                        createHazard('bar', DeBread.randomNum(0, game.offsetWidth - 50), DeBread.randomNum(0, game.offsetHeight - 50), 50, 1000, 2500, DeBread.randomNum(0, 1))
                    }, endlessInterval / 2);
                } else if(endlessLevel === 2) {
                    createHazard('box', DeBread.randomNum(0, game.offsetWidth - 400), DeBread.randomNum(0, game.offsetHeight - 400), 400, 1000, 2500)
                    setTimeout(() => {
                        createHazard('bar', DeBread.randomNum(0, game.offsetWidth - 50), DeBread.randomNum(0, game.offsetHeight - 50), 50, 1000, 2500, DeBread.randomNum(0, 1))
                        setTimeout(() => {
                            createHazard('trail', DeBread.randomNum(0, game.offsetWidth - 50), DeBread.randomNum(0, game.offsetHeight - 50), 50, 1000, 2500, DeBread.randomNum(0, 1), 250)
                        }, endlessInterval / 3);
                    }, endlessInterval / 3);
                } else if(endlessLevel === 3) {
                    let randomHazardSize = DeBread.randomNum(300, 700)
                    createHazard('box', DeBread.randomNum(0, game.offsetWidth - randomHazardSize), DeBread.randomNum(0, game.offsetHeight - randomHazardSize), randomHazardSize, 1000, 2500)
                    setTimeout(() => {
                        createHazard('bar', DeBread.randomNum(0, game.offsetWidth - 50), DeBread.randomNum(0, game.offsetHeight - 50), 50, 1000, 2500, DeBread.randomNum(0, 1))
                        setTimeout(() => {
                            createHazard('trail', DeBread.randomNum(0, game.offsetWidth - 50), DeBread.randomNum(0, game.offsetHeight - 50), 50, 1000, 2500, DeBread.randomNum(0, 1), 250)
                        }, endlessInterval / 3);
                    }, endlessInterval / 3);
                } else if(endlessLevel === 4) {
                    let randomHazardSize = DeBread.randomNum(300, 700)
                    let randomHazardSizeBar = DeBread.randomNum(50, 200)
                    createHazard('box', DeBread.randomNum(0, game.offsetWidth - randomHazardSize), DeBread.randomNum(0, game.offsetHeight - randomHazardSize), randomHazardSize, 1000, 2500)
                    setTimeout(() => {
                        createHazard('bar', DeBread.randomNum(0, game.offsetWidth - randomHazardSizeBar), DeBread.randomNum(0, game.offsetHeight - randomHazardSizeBar), randomHazardSizeBar, 1000, 2500, DeBread.randomNum(0, 1))
                        setTimeout(() => {
                            createHazard('trail', DeBread.randomNum(0, game.offsetWidth - 50), DeBread.randomNum(0, game.offsetHeight - 50), 50, 1000, 2500, DeBread.randomNum(0, 1), 250)
                        }, endlessInterval / 3);
                    }, endlessInterval / 3);
                } else {
                    let randomHazardSize = DeBread.randomNum(300, 700)
                    let randomHazardSizeBar = DeBread.randomNum(50, 200)
                    let randomHazardSizeTrail = DeBread.randomNum(50, 200)
                    createHazard('box', DeBread.randomNum(0, game.offsetWidth - randomHazardSize), DeBread.randomNum(0, game.offsetHeight - randomHazardSize), randomHazardSize, 1000, 2500)
                    setTimeout(() => {
                        createHazard('bar', DeBread.randomNum(0, game.offsetWidth - randomHazardSizeBar), DeBread.randomNum(0, game.offsetHeight - randomHazardSizeBar), randomHazardSizeBar, 1000, 2500, DeBread.randomNum(0, 1))
                        setTimeout(() => {
                            createHazard('trail', DeBread.randomNum(0, game.offsetWidth - randomHazardSizeTrail), DeBread.randomNum(0, game.offsetHeight - randomHazardSizeTrail), randomHazardSizeTrail, 1000, 2500, DeBread.randomNum(0, 1), DeBread.randomNum(100, 500))
                        }, endlessInterval / 3);
                    }, endlessInterval / 3);
                    if(endlessInterval > 500) {
                        endlessInterval -= 5
                    }
                }
                if(!gameOver) {
                    placeHazards(endlessInterval)
                }
            }, delay);
        } 

        levelIncreaseInterval = setInterval(() => {
            endlessLevel++
            doge('level').innerText = `Level ${endlessLevel}`
            if(player.health.current !== 5) {
                player.health.current++
                updateHealth()
            }
            if(endlessBorderSize < 100 && endlessLevel > 5) {
                endlessBorderSize += 10
            }
            if(endlessLevel > 5) {
                createBorders(endlessBorderSize)
            }

            endlessLevelTimer = 60
            doge('endlessTimerOverlay').style.width = endlessLevelTimer / 60 * 100 + '%'
            
        }, 60000)
        endlessLevelTimerInterval = setInterval(() => {
            endlessLevelTimer--
            doge('endlessTimerOverlay').style.width = endlessLevelTimer / 60 * 100 + '%'
        }, 1000)
    }
}

function createBorders(size) {
    createHazard('bar', 0, 0, size, 63000, 3000, 0)
    createHazard('bar', 0, 0, size, 63000, 3000, 1)
    createHazard('bar', game.offsetWidth - size, game.offsetHeight - size, size, 63000, 3000, 0)
    createHazard('bar', game.offsetWidth - size, game.offsetHeight - size, size, 63000, 3000, 1)
}

function endLevel() {
    clearInterval(levelIncreaseInterval)
    doge('score').style.top = '-50px'
    doge('level').style.left = '-100px'
    doge('endlessTimer').style.display = 'none'
    doge('endingScore').innerText = `Score: ${player.score}`
}