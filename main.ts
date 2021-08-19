namespace SpriteKind {
    export const destroyed_enemy = SpriteKind.create()
    export const bullet_remaining = SpriteKind.create()
}
function resetRemainingBulletSprites () {
    for (let queue of sprites.allOfKind(SpriteKind.bullet_remaining)) {
        queue.destroy()
    }
    for (let queue_index = 0; queue_index <= bullets_remaining - 1; queue_index++) {
        bullet_remaining_sprite = sprites.create(img`
            f f 
            f f 
            `, SpriteKind.bullet_remaining)
        bullet_remaining_sprite.setPosition(5 + queue_index * 5, 5)
        bullet_remaining_sprite.setFlag(SpriteFlag.Ghost, true)
    }
}
function create_enemy_images () {
    enemy_right_images = [img`
        . . . . . . . . 
        . . . . . . . . 
        . . . 6 6 6 . . 
        f 2 2 2 2 2 2 . 
        f 2 4 4 4 4 2 2 
        . . 4 4 4 . . . 
        . . 4 4 . . . . 
        . . . . . . . . 
        `, img`
        . . . . . . . . 
        . . . . . . . . 
        . . . 6 6 6 . . 
        f 5 5 5 5 5 5 . 
        f 5 3 3 3 3 5 5 
        . . 3 3 3 . . . 
        . . 3 3 . . . . 
        . . . . . . . . 
        `]
    enemy_left_images = []
    for (let queue of enemy_right_images) {
        enemy_left_images.push(queue.clone())
    }
    for (let value2 of enemy_left_images) {
        value2.flipX()
    }
}
function Spawn_Cannon () {
    Cannon = sprites.create(img`
        . . . . . . . . 
        . . . 1 1 . . . 
        . . . 5 4 . . . 
        . . . 5 4 . . . 
        . . . a a . . . 
        . . a a a a . . 
        . a a a a a a . 
        e e e e e e e e 
        `, SpriteKind.Player)
    Cannon.bottom = scene.screenHeight() - 8
    Cannon.x = scene.screenWidth() / 2
}
function spawnEnemyShipsFromQueues () {
    queue_index = 1
    for (let queue of enemy_queue_left) {
        if (queue.length > 0) {
            spawnEnemyShip("left", queue_index, queue.shift())
        }
        queue_index += 1
    }
    queue_index = 1
    for (let queue of enemy_queue_right) {
        if (queue.length > 0) {
            spawnEnemyShip("right", queue_index, queue.shift())
        }
        queue_index += 1
    }
}
function fire_bullet2 () {
    if (bullets_remaining > 0) {
        bullets_remaining += -1
        resetRemainingBulletSprites()
        projectile = sprites.createProjectileFromSprite(img`
            5 4 
            5 4 
            `, Cannon, 0, 0 - bullet_speed)
        projectile.setFlag(SpriteFlag.DestroyOnWall, true)
        projectile.setKind(SpriteKind.Projectile)
        sprites.setDataNumber(projectile, "orig_id", next_bullet_id)
        sprites.setDataNumber(projectile, "chain", 0)
        next_bullet_id += 1
        music.pewPew.play()
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    fire_bullet2()
})
function spawnEnemyShip (side: string, row: number, _type: number) {
    if (_type == 0) {
        return
    } else if (_type == 1) {
        if (side == "left") {
            enemy_ship = sprites.createProjectileFromSide(enemy_left_images[randint(0, enemy_left_images.length - 1)], 0 - enemy_speed, 0)
        } else {
            enemy_ship = sprites.createProjectileFromSide(enemy_right_images[randint(0, enemy_right_images.length - 1)], enemy_speed, 0)
        }
        enemy_ship.y = row * 12 + 8
        enemy_ship.setKind(SpriteKind.Enemy)
    }
}
function convert_direction_to_vy (degrees: number) {
    return Math.cos((degrees + 90) * (3.14 / 180)) * -1
}
function addEnemyShipsToQueues () {
    if (Math.percentChance(3)) {
        setNextEnemySquad("arrow")
    } else if (Math.percentChance(2)) {
        setNextEnemySquad("wave")
    } else {
        temp_queue_length = 0
        for (let queue of enemy_queue_left) {
            temp_queue_length += queue.length
        }
        for (let queue of enemy_queue_right) {
            temp_queue_length += queue.length
        }
        if (temp_queue_length <= 10) {
            setNextEnemySquad("normal")
        }
    }
    if (next_ship_squad.length > 0) {
        for (let queue of enemy_queue_right) {
            for (let ship of next_ship_squad.shift()) {
                queue.push(ship)
            }
        }
        for (let queue of enemy_queue_left) {
            for (let ship of next_ship_squad.shift()) {
                queue.push(ship)
            }
        }
    }
}
function setNextEnemySquad_Normal () {
    for (let index = 0; index < 10; index++) {
        if (Math.percentChance(5)) {
            next_ship_squad.push([1])
        } else {
            next_ship_squad.push([0])
        }
    }
}
function createEnemyShipQueues () {
    enemy_queue_left = [
    [0],
    [0],
    [0],
    [0],
    [0]
    ]
    enemy_queue_right = [
    [0],
    [0],
    [0],
    [0],
    [0]
    ]
}
function convert_direction_to_vx (degrees: number) {
    return Math.sin((degrees + 90) * (3.14 / 180))
}
function setNextEnemySquad_Arrow () {
    next_ship_squad = [
    [
    0,
    0,
    0,
    0,
    1,
    1
    ],
    [
    0,
    0,
    1,
    1,
    0,
    0
    ],
    [
    1,
    1,
    0,
    0,
    0,
    0
    ],
    [
    0,
    0,
    1,
    1,
    0,
    0
    ],
    [
    0,
    0,
    0,
    0,
    1,
    1
    ]
    ]
    addEmptyEnemySquad(next_ship_squad, 5)
}
function create_background () {
    scene.setBackgroundColor(9)
    tiles.setTilemap(tilemap`level`)
}
function enemy_ship_hit2 (bullet: Sprite, enemy: Sprite) {
    enemy.setKind(SpriteKind.destroyed_enemy)
    spawn_enemy_bullet2(enemy, sprites.readDataNumber(bullet, "orig_id"), sprites.readDataNumber(bullet, "chain") + 2, bullet, sprites.readDataNumber(bullet, "chain"))
    bullet.destroy()
    enemy.destroy(effects.ashes, 100)
    info.changeScoreBy(1)
    music.smallCrash.play()
}
function setNextEnemySquad_Wave () {
    next_ship_squad = [
    [
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1
    ],
    [
    0,
    0,
    0,
    1,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    1,
    0
    ],
    [
    0,
    0,
    1,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    1,
    0,
    0
    ],
    [
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    1,
    0,
    0,
    0
    ],
    [
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0
    ]
    ]
    addEmptyEnemySquad(next_ship_squad, 13)
}
function setNextEnemySquad (_type: string) {
    next_ship_squad = []
    if (_type == "arrow") {
        setNextEnemySquad_Arrow()
    } else if (_type == "wave") {
        setNextEnemySquad_Wave()
    } else if (_type == "normal") {
        setNextEnemySquad_Normal()
    }
}
scene.onOverlapTile(SpriteKind.Projectile, assets.tile`tile1`, function (sprite, location) {
    sprite.setFlag(SpriteFlag.Ghost, true)
    sprite.setVelocity(0, 0)
    sprite.y = 100
    sprite.setImage(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . 4 4 . . . . . . . 
        . . . . . . 4 5 5 4 . . . . . . 
        . . . . . . 2 5 5 2 . . . . . . 
        . . . . . . . 2 2 . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `)
    sprite.setImage(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . 4 . . . . . 
        . . . . 2 . . . . 4 4 . . . . . 
        . . . . 2 4 . . 4 5 4 . . . . . 
        . . . . . 2 4 d 5 5 4 . . . . . 
        . . . . . 2 5 5 5 5 4 . . . . . 
        . . . . . . 2 5 5 5 5 4 . . . . 
        . . . . . . 2 5 4 2 4 4 . . . . 
        . . . . . . 4 4 . . 2 4 4 . . . 
        . . . . . 4 4 . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `)
    sprite.setImage(img`
        . 3 . . . . . . . . . . . 4 . . 
        . 3 3 . . . . . . . . . 4 4 . . 
        . 3 d 3 . . 4 4 . . 4 4 d 4 . . 
        . . 3 5 3 4 5 5 4 4 d d 4 4 . . 
        . . 3 d 5 d 1 1 d 5 5 d 4 4 . . 
        . . 4 5 5 1 1 1 1 5 1 1 5 4 . . 
        . 4 5 5 5 5 1 1 5 1 1 1 d 4 4 . 
        . 4 d 5 1 1 5 5 5 1 1 1 5 5 4 . 
        . 4 4 5 1 1 5 5 5 5 5 d 5 5 4 . 
        . . 4 3 d 5 5 5 d 5 5 d d d 4 . 
        . 4 5 5 d 5 5 5 d d d 5 5 4 . . 
        . 4 5 5 d 3 5 d d 3 d 5 5 4 . . 
        . 4 4 d d 4 d d d 4 3 d d 4 . . 
        . . 4 5 4 4 4 4 4 4 4 4 4 . . . 
        . 4 5 4 . . 4 4 4 . . . 4 4 . . 
        . 4 4 . . . . . . . . . . 4 4 . 
        `)
    timer.after(400, function () {
        sprite.destroy()
    })
})
function spawn_enemy () {
    if (Math.percentChance(50)) {
        enemy_ship = sprites.createProjectileFromSide(enemy_right_images[randint(0, enemy_right_images.length - 1)], enemy_speed, 0)
    } else {
        enemy_ship = sprites.createProjectileFromSide(enemy_left_images[randint(0, enemy_left_images.length - 1)], 0 - enemy_speed, 0)
    }
    enemy_ship.y = randint(1, 5) * 16 + 8
    enemy_ship.setKind(SpriteKind.Enemy)
}
function addEmptyEnemySquad (squad: any[], length: number) {
    temp_empty_squad = []
    for (let index = 0; index < length; index++) {
        temp_empty_squad.push(0)
    }
    for (let index = 0; index < 5; index++) {
        squad.push(temp_empty_squad)
    }
    return squad
}
function spawn_enemy_bullet2 (enemy: Sprite, orig_id: number, num_bullets: number, bullet_sprite: Sprite, chain: number) {
    for (let index2 = 0; index2 <= num_bullets - 1; index2++) {
        projectile = sprites.createProjectileFromSprite(img`
            5 4 
            5 4 
            `, enemy, convert_direction_to_vx(360 / num_bullets * (index2 + 1)) * bullet_speed, convert_direction_to_vy(360 / num_bullets * (index2 + 1)) * bullet_speed)
        if (enemy.vx < 0) {
            projectile.vx = 0 - projectile.vx
        }
        projectile.setFlag(SpriteFlag.DestroyOnWall, true)
        projectile.setKind(SpriteKind.Projectile)
        sprites.setDataNumber(projectile, "orig_id", orig_id)
        sprites.setDataNumber(projectile, "chain", Math.constrain(chain + 1, 1, chain_max))
    }
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    enemy_ship_hit2(sprite, otherSprite)
})
let temp_empty_squad: number[] = []
let next_ship_squad: number[][] = []
let temp_queue_length = 0
let enemy_ship: Sprite = null
let projectile: Sprite = null
let enemy_queue_right: number[][] = []
let enemy_queue_left: number[][] = []
let queue_index = 0
let Cannon: Sprite = null
let enemy_left_images: Image[] = []
let enemy_right_images: Image[] = []
let bullet_remaining_sprite: Sprite = null
let enemy_speed = 0
let bullet_speed = 0
let next_bullet_id = 0
let bullets_remaining = 0
let chain_max = 0
info.setScore(0)
chain_max = 25
let start_bullets = 10
bullets_remaining = start_bullets
next_bullet_id = 0
bullet_speed = 65
enemy_speed = 55
create_background()
Spawn_Cannon()
createEnemyShipQueues()
create_enemy_images()
resetRemainingBulletSprites()
game.onUpdateInterval(2000, function () {
    if (bullets_remaining <= 0) {
        if (sprites.allOfKind(SpriteKind.Projectile).length <= 0) {
            game.over(true, effects.confetti)
        }
    }
})
game.onUpdateInterval(200, function () {
    addEnemyShipsToQueues()
    spawnEnemyShipsFromQueues()
})
