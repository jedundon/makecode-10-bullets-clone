@namespace
class SpriteKind:
    Bullet_00 = SpriteKind.create()
    Bullet_01 = SpriteKind.create()
    Bullet_02 = SpriteKind.create()
    Bullet_03 = SpriteKind.create()
    Bullet_04 = SpriteKind.create()
    Bullet_05 = SpriteKind.create()
    Bullet_06 = SpriteKind.create()
    Bullet_07 = SpriteKind.create()
    Bullet_08 = SpriteKind.create()
    Bullet_09 = SpriteKind.create()
    Bullet_10 = SpriteKind.create()
    Bullet_11 = SpriteKind.create()
    Bullet_12 = SpriteKind.create()
    Bullet_13 = SpriteKind.create()
    Bullet_14 = SpriteKind.create()
    Bullet_15 = SpriteKind.create()
    Bullet_16 = SpriteKind.create()
    Bullet_17 = SpriteKind.create()
    Bullet_18 = SpriteKind.create()
    Bullet_19 = SpriteKind.create()
    Bullet_20 = SpriteKind.create()
    Bullet_21 = SpriteKind.create()
    Bullet_22 = SpriteKind.create()
    Bullet_23 = SpriteKind.create()
    Bullet_24 = SpriteKind.create()
    Bullet_25 = SpriteKind.create()
    Bullet_26 = SpriteKind.create()
    Bullet_27 = SpriteKind.create()
    Bullet_28 = SpriteKind.create()
    Bullet_29 = SpriteKind.create()
    Bullet_30 = SpriteKind.create()
def spawn_enemy_bullet(enemy: Sprite, bullet_id: number, num_bullets: number, bullet_sprite: Sprite):
    global projectile, index
    while index <= num_bullets - 1:
        projectile = sprites.create_projectile_from_sprite(img("""
                5 4 
                            5 4
            """),
            enemy,
            convert_direction_to_vx(360 / num_bullets * (index + 1)) * bullet_speed,
            convert_direction_to_vy(360 / num_bullets * (index + 1)) * bullet_speed)
        projectile.set_kind(bullet_sprite.kind())
        index += 1
    bullet_combos_list[bullet_id] = bullet_combos_list[bullet_id] + 1
def create_enemy_images():
    global enemy_right_images, enemy_left_images
    enemy_right_images = [img("""
            . . . . . . . . 
                    . . . . . . . . 
                    . . . 9 9 9 . . 
                    f 2 2 2 2 2 2 . 
                    f 2 4 4 4 4 2 2 
                    . . 4 4 4 . . . 
                    . . 4 4 . . . . 
                    . . . . . . . .
        """),
        img("""
            . . . . . . . . 
                    . . . . . . . . 
                    . . . 9 9 9 . . 
                    f 5 5 5 5 5 5 . 
                    f 5 3 3 3 3 5 5 
                    . . 3 3 3 . . . 
                    . . 3 3 . . . . 
                    . . . . . . . .
        """)]
    enemy_left_images = []
    for value in enemy_right_images:
        enemy_left_images.append(value.clone())
    for value2 in enemy_left_images:
        value2.flip_x()
def Spawn_Cannon():
    global Cannon
    Cannon = sprites.create(img("""
            . . . . . . . . 
                    . . . 1 1 . . . 
                    . . . 5 4 . . . 
                    . . . 5 4 . . . 
                    . . . a a . . . 
                    . . a a a a . . 
                    . a a a a a a . 
                    e e e e e e e e
        """),
        SpriteKind.player)
    Cannon.bottom = scene.screen_height()
    Cannon.x = scene.screen_width() / 2

def on_a_pressed():
    fire_bullet()
controller.A.on_event(ControllerButtonEvent.PRESSED, on_a_pressed)

def convert_direction_to_vy(degrees: number):
    return Math.cos((degrees + 90) * (3.14 / 180)) * -1
def convert_direction_to_vx(degrees: number):
    return Math.sin((degrees + 90) * (3.14 / 180))
def create_background():
    scene.set_background_color(6)
    tiles.set_tilemap(tilemap("""
        level
    """))
def spawn_enemy():
    global enemy_ship
    if Math.percent_chance(50):
        enemy_ship = sprites.create_projectile_from_side(enemy_right_images[randint(0, len(enemy_right_images) - 1)],
            enemy_speed,
            0)
    else:
        enemy_ship = sprites.create_projectile_from_side(enemy_left_images[randint(0, len(enemy_left_images) - 1)],
            0 - enemy_speed,
            0)
    enemy_ship.y = randint(1, 5) * 16 + 8
    enemy_ship.set_kind(SpriteKind.enemy)
def get_chain_number_from_bullet(bullet: Sprite):
    return "this".substr(0, 5)
def fire_bullet():
    global bullets_remaining, projectile, next_bullet_id
    if bullets_remaining > 0:
        bullets_remaining += -1
        bullet_combos_list[next_bullet_id] = 0
        projectile = sprites.create_projectile_from_sprite(img("""
                5 4 
                            5 4
            """),
            Cannon,
            0,
            0 - bullet_speed)
        projectile.set_kind(convert_bullet_id_to_bullet_kind(next_bullet_id))
        next_bullet_id += 1

def on_on_overlap(sprite, otherSprite):
    spawn_enemy_bullet(otherSprite, 0, bullet_combos_list[0] + 2, sprite)
    sprite.destroy()
    otherSprite.destroy(effects.fire, 100)
sprites.on_overlap(SpriteKind.Bullet_00, SpriteKind.enemy, on_on_overlap)

def convert_bullet_id_to_bullet_kind(num: number):
    # unknown expression:  178
    switcher = {
            0 : SpriteKind.Bullet_00,
            1 : SpriteKind.Bullet_01,
            2 : SpriteKind.Bullet_02,
            3 : SpriteKind.Bullet_03,
            4 : SpriteKind.Bullet_04,
            5 : SpriteKind.Bullet_05,
            6 : SpriteKind.Bullet_06,
            7 : SpriteKind.Bullet_07,
            8 : SpriteKind.Bullet_08,
            9 : SpriteKind.Bullet_09,
            10 : SpriteKind.Bullet_10,
            11 : SpriteKind.Bullet_11,
            12 : SpriteKind.Bullet_12,
        }
    
    if num == 0:
        return SpriteKind.Bullet_00
    elif num == 1:
        return SpriteKind.Bullet_01
    else:
        return SpriteKind.Bullet_30
enemy_ship: Sprite = None
Cannon: Sprite = None
enemy_left_images: List[Image] = []
enemy_right_images: List[Image] = []
projectile: Sprite = None
index = 0
enemy_speed = 0
bullet_speed = 0
next_bullet_id = 0
bullets_remaining = 0
bullet_combos_list: List[number] = []
bullet_combos_list = []
start_bullets = 10
bullets_remaining = start_bullets
next_bullet_id = 0
bullet_speed = 50
enemy_speed = 40
create_background()
Spawn_Cannon()
create_enemy_images()

def on_update_interval():
    spawn_enemy()
game.on_update_interval(500, on_update_interval)
