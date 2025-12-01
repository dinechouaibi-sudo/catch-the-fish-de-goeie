// -----------------------------
// LEVEL 1
// -----------------------------
scene.setBackgroundColor(9)

let speler: Sprite = sprites.create(img`
    . . . . . . . . . . . . 
    . . . . . . 5 5 . . . . 
    . . . . 5  5 5 5 . . . 
    . . . 5 5 2 5 2 5 5 . . 
    . . . 5 5 5 5 5 5 5 . . 
    . . . . 5 5 5 5 5 . . . 
    . . . . . . 5 . . . . . 
    . . . . . . 5 . . . . . 
    . . . . . 5 5 5 . . . . 
    . . . . . 5 . 5 . . . . 
    . . . . . . . . . . . . 
`, SpriteKind.Player)
controller.moveSprite(speler, 100, 100)

let level1Actief = true
let vis = sprites.create(img`
    . . . . . . . 2 2 . . . . . . . 
    . . . . . . 2 2 2 2 . . . . . . 
    . . . . 2 2 2 2 2 2 2 . . . . . 
    . . 2 2 2 1 2 2 2 1 2 2 2 . . . 
    . 2 2 2 2 2 2 2 2 2 2 2 2 2 . . 
    . . . 2 2 2 2 2 2 2 2 2 2 . . . 
    . . . . . . 2 2 2 2 . . . . . . 
    . . . . . . . 2 2 . . . . . . . 
    . . . . . . . 2 2 . . . . . . . 
    . . . . . . 2 2 2 2 . . . . . . 
    . . . . . . . . . . . . . . . . 
`, SpriteKind.Food)

game.onUpdateInterval(3000, function () {
    if (!level1Actief) return
    vis.setPosition(randint(0, scene.screenWidth()), randint(0, scene.screenHeight()))
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sp, food) {
    if (!level1Actief) return
    info.changeScoreBy(1)
    food.setPosition(randint(0, scene.screenWidth()), randint(0, scene.screenHeight()))
    if (info.score() >= 40 && info.score() < 40) {
        game.onUpdateInterval(2500, function () {
            vis.setPosition(randint(0, scene.screenWidth()), randint(0, scene.screenHeight()))
        })
    }
    if (info.score() >= 50) {
        speler.say("Good!", 1000)
        pause(1000)
        level1Actief = false
        startLevel2()
    }
})

// -----------------------------
// LEVEL 2
// -----------------------------
let level2Actief = false
let baasVis: Sprite = null
let baasLeven2 = 5

function startLevel2() {
    level2Actief = true
    scene.setBackgroundColor(2)
    info.setScore(0)
    speler.setPosition(80, 90)

    baasLeven2 = 5

    baasVis = sprites.create(img`
        . . . 4 4 4 4 4 4 4 4 . . . . 
        . 4 4 1 1 1 1 1 1 1 1 4 4 . . 
        4 4 1 1 1 1 1 1 1 1 1 1 4 4 . 
        4 4 1 1 1 1 1 1 1 1 1 1 4 4 . 
        . 4 4 1 1 1 1 1 1 1 1 4 4 . . 
        . . 4 4 4 4 4 4 4 4 4 4 . . . 
    `, SpriteKind.Enemy)
    baasVis.setPosition(80, 50)
    baasVis.setVelocity(40, 40)
    baasVis.setBounceOnWall(true)

    game.onUpdateInterval(1000, function () {
        if (!level2Actief) return
        let kogel = sprites.createProjectileFromSprite(img`
            . . 4 4 . . 
            . 4 4 4 4 . 
            . . 4 4 . . 
        `, baasVis, randint(-60, 60), randint(-60, 60))
        kogel.setKind(SpriteKind.Projectile)
    })
}

sprites.onOverlap(SpriteKind.Player, SpriteKind.Projectile, function (pl, proj) {
    if (!level2Actief) return
    info.changeLifeBy(-1)
    proj.destroy()
    scene.cameraShake(2, 100)
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (pl, enemy) {
    if (!level2Actief) return
    baasLeven2 -= 1
    enemy.startEffect(effects.disintegrate, 200)
    music.baDing.play()
    enemy.setPosition(randint(20, 140), randint(20, 100))
    if (baasLeven2 <= 0) {
        level2Actief = false
        enemy.destroy(effects.smiles, 500)
        pause(1000)
        startLevel3()
    }
})

// -----------------------------
// LEVEL 3
// -----------------------------
let level3Actief = false
let baas3: Sprite = null
let baasLeven3 = 5

function startLevel3() {
    level3Actief = true
    scene.setBackgroundColor(7)
    info.setLife(5)
    speler.setPosition(80, 90)

    baasLeven3 = 5

    baas3 = sprites.create(img`
        . . . 3 3 3 3 3 3 3 3 . . . . 
        . 3 3 1 1 1 1 1 1 1 1 3 3 . . 
        3 3 1 1 1 1 1 1 1 1 1 1 3 3 . 
        3 3 1 1 1 1 1 1 1 1 1 1 3 3 . 
        . 3 3 1 1 1 1 1 1 1 1 1 3 3 . . 
        . . 3 3 3 3 3 3 3 3 3 3 . . . 
    `, SpriteKind.Enemy)
    baas3.setPosition(80, 50)
    baas3.setVelocity(40, 40)
    baas3.setBounceOnWall(true)

    game.onUpdateInterval(900, function () {
        if (!level3Actief) return
        for (let i = 0; i < 2; i++) {
            let kogel = sprites.createProjectileFromSprite(img`
                . . 3 3 . . 
                . 3 3 3 3 . 
                . . 3 3 . . 
            `, baas3, 0, 0)
            kogel.setKind(SpriteKind.Projectile)
            let dx = speler.x - baas3.x + randint(-10, 10)
            let dy = speler.y - baas3.y + randint(-10, 10)
            let afstand = Math.max(1, Math.sqrt(dx * dx + dy * dy))
            kogel.vx = (dx / afstand) * 60
            kogel.vy = (dy / afstand) * 60
        }
    })
}

sprites.onOverlap(SpriteKind.Player, SpriteKind.Projectile, function (pl, proj) {
    if (!level3Actief) return
    info.changeLifeBy(-1)
    proj.destroy()
    scene.cameraShake(2, 100)
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (pl, enemy) {
    if (!level3Actief) return
    baasLeven3 -= 1
    enemy.startEffect(effects.disintegrate, 200)
    music.baDing.play()
    enemy.setPosition(randint(10, 150), randint(10, 110))
    if (baasLeven3 <= 0) {
        level3Actief = false
        enemy.destroy(effects.hearts, 1000)
        pause(1000)
        startLevel4()
    }
})
// -----------------------------
// LEVELS 4 t/m 8 - UITBREIDING
// -----------------------------

// SpriteKinds
namespace SpriteKind {
    export const EnemyProjectile = SpriteKind.create()
    export const PlayerProjectile = SpriteKind.create()
}

// LEVEL variabelen
let level4Actief = false
let level5Actief = false
let level6Actief = false
let level7Actief = false
let level8Actief = false

let baas4: Sprite = null
let baas5: Sprite = null
let baas6: Sprite = null
let baas7: Sprite = null
let baas8: Sprite = null

let baasLeven4 = 5
let baasLeven5 = 5
let baasLeven6 = 7
let baasLeven7 = 10
let baasLeven8 = 12

let onkwetsbaar = false

// -------- SPELER DEFINITIE --------


// ---------------------- START LEVELS ----------------------

// LEVEL 4
function startLevel4() {
    speler.setImage(img`
        . . . . . . 5 . . . . . 
        . . . . . 5 5 5 . . . . 
        . . . 5 5 5 5 5 . . . . 
        . . 5 5 2 5 2 5 5 . . . 
        . . 5 5 5 5 5 5 5 . . . 
        . . . 5 5 5 5 5 . . . . 
        . . . . . 5 5 2 2 . . . 
        . . . . . . 5 2 2 2 . . 
        . . . . . 5 5 5 2 . . . 
        . . . . . 5 . 5 . . . . 
        . . . . . . . . . . . . 
    `)
    level4Actief = true
    level5Actief = false
    level6Actief = false
    level7Actief = false
    level8Actief = false
    scene.setBackgroundColor(11)
    info.setLife(5)
    baasLeven4 = 5
    onkwetsbaar = false
    speler.setPosition(80, 90)

    if (baas4) baas4.destroy()
    baas4 = sprites.create(img`
        . . . 8 8 8 8 8 8 8 8 . . . .
        . 8 8 1 1 1 1 1 1 1 1 8 8 . .
        8 8 1 1 1 1 1 1 1 1 1 1 8 8
        8 8 1 1 1 1 1 1 1 1 1 1 8 8
        . 8 8 1 1 1 1 1 1 1 1 8 8 . .
        . . 8 8 8 8 8 8 8 8 8 8 . . .
    `, SpriteKind.Enemy)
    baas4.setPosition(80, 50)
    baas4.setVelocity(40, 40)
    baas4.setBounceOnWall(true)

    let ballon = sprites.create(img`
        . . 5 5 5 . .
        . 5 5 5 5 5 .
        . . 5 5 5 . .
        . . . 2 . . .
    `, SpriteKind.Food)
    ballon.setPosition(randint(20, 140), randint(20, 100))
}

// LEVEL 5
function startLevel5() {
    speler.setImage(speler.image) // blijft zelfde
    level4Actief = false
    level5Actief = true
    level6Actief = false
    level7Actief = false
    level8Actief = false
    scene.setBackgroundColor(7)
    info.setLife(5)
    baasLeven5 = 5
    onkwetsbaar = false
    speler.setPosition(80, 90)

    if (baas5) baas5.destroy()
    baas5 = sprites.create(img`
        . . . 8 8 8 8 8 8 8 8 . . . .
        . 8 8 1 1 1 1 1 1 1 1 8 8 . .
        8 8 1 1 1 1 1 1 1 1 1 1 8 8
        8 8 1 1 1 1 1 1 1 1 1 1 8 8
        . 8 8 1 1 1 1 1 1 1 1 8 8 . .
        . . 8 8 8 8 8 8 8 8 8 8 . . .
    `, SpriteKind.Enemy)
    baas5.setPosition(80, 50)
    baas5.setVelocity(40, 40)
    baas5.setBounceOnWall(true)

    let ballon2 = sprites.create(img`
        . . 5 5 5 . .
        . 5 5 5 5 5 .
        . . 5 5 5 . .
        . . . 2 . . .
    `, SpriteKind.Food)
    ballon2.setPosition(randint(20, 140), randint(20, 100))
}

// LEVEL 6
function startLevel6() {
    level4Actief = false
    level5Actief = false
    level6Actief = true
    level7Actief = false
    level8Actief = false
    scene.setBackgroundColor(9)
    info.setLife(5)
    baasLeven6 = 6
    onkwetsbaar = false
    speler.setPosition(80, 90)

    if (baas6) baas6.destroy()
    baas6 = sprites.create(img`
        . . 9 9 9 9 9 9 9 9 . .
        9 9 2 2 2 2 2 2 2 2 9 9
        9 2 2 2 f f f 2 2 2 2 9
        9 2 2 2 f f f 2 2 2 2 9
        9 9 2 2 2 2 2 2 2 2 9 9
        . . 9 9 9 9 9 9 9 9 . .
    `, SpriteKind.Enemy)
    baas6.setPosition(80, 50)
    baas6.setVelocity(50, 50)
    baas6.setBounceOnWall(true)

    let ballon3 = sprites.create(img`
        . . 5 5 5 . .
        . 5 5 5 5 5 .
        . . 5 5 5 . .
        . . . 2 . . .
    `, SpriteKind.Food)
    ballon3.setPosition(randint(20, 140), randint(20, 100))
}

// LEVEL 7
function startLevel7() {
    level4Actief = false
    level5Actief = false
    level6Actief = false
    level7Actief = true
    level8Actief = false
    scene.setBackgroundColor(10)
    info.setLife(6)
    baasLeven7 = 7
    onkwetsbaar = false
    speler.setPosition(80, 90)

    if (baas7) baas7.destroy()
    baas7 = sprites.create(img`
        . . 7 7 7 7 7 7 7 7 . .
        7 7 3 3 3 3 3 3 3 3 7 7
        7 3 3 3 f f f 3 3 3 3 7
        7 3 3 3 f f f 3 3 3 3 7
        7 7 3 3 3 3 3 3 3 3 7 7
        . . 7 7 7 7 7 7 7 7 . .
    `, SpriteKind.Enemy)
    baas7.setPosition(80, 50)
    baas7.setVelocity(50, 50)
    baas7.setBounceOnWall(true)

    let ballon4 = sprites.create(img`
        . . 5 5 5 . .
        . 5 5 5 5 5 .
        . . 5 5 5 . .
        . . . 2 . . .
    `, SpriteKind.Food)
    ballon4.setPosition(randint(20, 140), randint(20, 100))
}

// LEVEL 8
function startLevel8() {
    level4Actief = false
    level5Actief = false
    level6Actief = false
    level7Actief = false
    level8Actief = true
    scene.setBackgroundColor(14)
    info.setLife(7)
    baasLeven8 = 7
    onkwetsbaar = false
    speler.setPosition(80, 90)

    if (baas8) baas8.destroy()
    baas8 = sprites.create(img`
        . . 6 6 6 6 6 6 6 6 . .
        6 6 4 4 4 4 4 4 4 4 6 6
        6 4 4 4 f f f 4 4 4 4 6
        6 4 4 4 f f f 4 4 4 4 6
        6 6 4 4 4 4 4 4 4 4 6 6
        . . 6 6 6 6 6 6 6 6 . .
    `, SpriteKind.Enemy)
    baas8.setPosition(80, 50)
    baas8.setVelocity(50, 50)
    baas8.setBounceOnWall(true)

    let ballon5 = sprites.create(img`
        . . 5 5 5 . .
        . 5 5 5 5 5 .
        . . 5 5 5 . .
        . . . 2 . . .
    `, SpriteKind.Food)
    ballon5.setPosition(randint(20, 140), randint(20, 100))
}

// ---------------------- SCHIETEN ----------------------
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(level4Actief || level5Actief || level6Actief || level7Actief || level8Actief)) return
    let k = sprites.createProjectileFromSprite(img`
        . 2 2 2 .
        2 2 2 2 2
        . 2 2 2 .
    `, speler, 200, 0)
    k.setKind(SpriteKind.PlayerProjectile)
})

// ---------------------- BALLON PAKKEN ----------------------
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (pl, food) {
    if (!(level4Actief || level5Actief || level6Actief || level7Actief || level8Actief)) return
    food.setPosition(-50, -50)
    onkwetsbaar = true
    speler.startEffect(effects.rings, 5000)
    control.runInBackground(function () {
        pause(5000)
        onkwetsbaar = false
        food.destroy()
        music.pewPew.play()
    })
})

// ---------------------- BAAS SCHIET ----------------------
game.onUpdateInterval(700, function () {
    function schietBaas(b: Sprite, snelheid: number, aantal: number) {
        for (let i = 0; i < aantal; i++) {
            let k = sprites.createProjectileFromSprite(img`
                . . 8 8 . .
                . 8 8 8 8 .
                . . 8 8 . .
            `, b, 0, 0)
            k.setKind(SpriteKind.EnemyProjectile)
            let dx = speler.x - b.x + randint(-20, 20)
            let dy = speler.y - b.y + randint(-20, 20)
            let afstand = Math.max(1, Math.sqrt(dx * dx + dy * dy))
            k.vx = (dx / afstand) * snelheid
            k.vy = (dy / afstand) * snelheid
        }
    }

    if (level4Actief && baas4) schietBaas(baas4, 70, 3)
    if (level5Actief && baas5) schietBaas(baas5, 80, 4)

    if (level6Actief && baas6) {
        for (let a = 0; a < 360; a += 45) {
            let radians = a * Math.PI / 180
            let k = sprites.createProjectileFromSprite(img`
                . 9 9 .
                8 8 8 8
                . 8 8 .
            `, baas6, 0, 0)
            k.setKind(SpriteKind.EnemyProjectile)
            k.vx = Math.cos(radians) * 70
            k.vy = Math.sin(radians) * 70
        }
    }

    if (level7Actief && baas7) {
        for (let a = 0; a < 360; a += 45) {
            let radians = a * Math.PI / 180
            let k = sprites.createProjectileFromSprite(img`
                . 9 9 .
                8 8 8 8
                . 8 8 .
            `, baas7, 0, 0)
            k.setKind(SpriteKind.EnemyProjectile)
            k.vx = Math.cos(radians) * 70
            k.vy = Math.sin(radians) * 70
        }
    }

    if (level8Actief && baas8) {
        for (let a = 0; a < 360; a += 45) {
            let radians = a * Math.PI / 180
            let k = sprites.createProjectileFromSprite(img`
                . 9 9 .
                8 8 8 8
                . 8 8 .
            `, baas8, 0, 0)
            k.setKind(SpriteKind.EnemyProjectile)
            k.vx = Math.cos(radians) * 70
            k.vy = Math.sin(radians) * 70
        }
    }
})

// ---------------------- KOGEL RAAKT SPELER ----------------------
sprites.onOverlap(SpriteKind.EnemyProjectile, SpriteKind.Player, function (proj, pl) {
    if (!onkwetsbaar) info.changeLifeBy(-1)
    proj.destroy()
})

// ---------------------- KOGEL RAAKT BAAS ----------------------
sprites.onOverlap(SpriteKind.PlayerProjectile, SpriteKind.Enemy, function (proj, enemy) {
    proj.destroy()

    function checkBaas(b: Sprite, levelActive: boolean, leven: number, nextLevel: () => void) {
        if (enemy == b && levelActive) {
            leven -= 1
            enemy.startEffect(effects.disintegrate, 200)
            music.baDing.play()
            enemy.setPosition(randint(10, 150), randint(10, 110))
            if (leven <= 0) {
                enemy.destroy(effects.hearts, 500)
                pause(500)
                nextLevel()
            }
        }
        return leven
    }

    baasLeven4 = checkBaas(baas4, level4Actief, baasLeven4, startLevel5)
    baasLeven5 = checkBaas(baas5, level5Actief, baasLeven5, startLevel6)
    baasLeven6 = checkBaas(baas6, level6Actief, baasLeven6, startLevel7)
    baasLeven7 = checkBaas(baas7, level7Actief, baasLeven7, startLevel8)
    if (enemy == baas8 && level8Actief) {
        baasLeven8 -= 1
        enemy.startEffect(effects.disintegrate, 200)
        music.baDing.play()
        enemy.setPosition(randint(10, 150), randint(10, 110))
        if (baasLeven8 <= 0) {
            enemy.destroy(effects.hearts, 500)
            game.splash(" you won ")
            game.over(true)

            

        }
        forever
    }
})

