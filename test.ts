// tests go here; this will not be compiled when this package is used as an extension.
const myTestSprite = sprites.create(img`
    1 . . . . 1 1 1 . .
    4 . 1 1 1 . . 1 . .
    4 1 1 . . . 1 1 . .
    4 1 1 . . 1 . . 4 4
    4 4 . . 4 . 4 . 4 4
    . 4 . 4 4 . 4 4 4 4
    . 4 4 4 4 4 . 4 4 .
    . . 4 4 4 4 . 4 4 .
    . . . 4 . 4 4 4 4 .
    . . . 4 4 . . . 4 .
`)

controller.moveSprite(myTestSprite)

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    myTestSprite.startEffect(extraeffects.coloredTrail);
    
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    myTestSprite.setFlag(SpriteFlag.Invisible, !(myTestSprite.flags & sprites.Flag.Invisible));
})