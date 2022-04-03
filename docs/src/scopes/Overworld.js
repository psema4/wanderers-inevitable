addGameScope(new GameScope({
    name: 'Overworld',
    type: SCOPES.GAME,
    subType: 'DEFAULT',

    bg_img: false,

    fontLight: false,
    fontDark: false,

    scopedUpdate: true,
    scopedRender: true,
    scopedKeboard: true,
    scopedMouse: true,
    scopedGamepad: true,

    vars: {
        PIXEL_SIZE: 2,
        PIXEL_COLOR: new Color(.7, .7, .2),
        MAP_WIDTH: 8,
        MAP_HEIGHT: 8,
        x: 0,
        y: 0,
        health: 0,
        gold: 0,
        inventory: [],
    },

    gameInit:       function () {
        if (debug) console.debug(`${this._name} initialized.`)

        this._bg_img = document.getElementById('img_bg_scene_1')

        this._fontLight = new FontImage(document.getElementById('img_font_light'), vec2(64,64))
        this._fontDark = new FontImage(document.getElementById('img_font_dark'), vec2(64,64))

        cameraScale = 16 // default: 16

    },

    gameUpdate:     function () {
        if (!this._scopedMouse || (this._scopedMouse && this._name === currentScope)) {
            if (mouseWasPressed(0)) sound_click.play(mousePos)
        }

        if (!this._scopedKeyboard || (this._scopedKeyboard && this._name === currentScope)) {
            if (keyWasReleased(27)) { // ESC
                setGameScope('Main Menu')
            }
        }
    },
    
    gameUpdatePost: function () {},
    
    gameRender:     function () {
        const sfcPos = vec2(0,0)
        const sfcSize = vec2(1/cameraScale, 1/cameraScale)

        drawCanvas2D(sfcPos, sfcSize, 0, false, (ctx) => {
            const bgImage = this._bg_img
            const originalScale = cameraScale

            ctx.save()
            cameraScale = 1

            const topLeft = screenToWorld(vec2(0,0))
            ctx.drawImage(bgImage, topLeft.x, topLeft.y, -1*topLeft.x*2, -1*topLeft.y*2)

            cameraScale = originalScale
            ctx.restore()
        })

        this._vars.buttons && this._vars.buttons.forEach((button) => {
            this.drawButton(button, this._fontDark)
        })
    },

    gameRenderPost: function () {
        const textScale = 0.35
        const charSize = 64 * textScale
        const xOffset = (charSize * this._name.length) / 2
        this._fontLight.drawTextScreen(this._name, vec2((overlayCanvas.width/2)-xOffset, 6), textScale)
    },

    onEnter: function() {},
    
    onExit: function() {},

    drawButton: function(button, font) {
        drawRect(vec2(button.x, button.y), vec2(button.w, button.h), button.bgColor, 0, 0)

        if (font && font.drawTextScreen) {
            const textScale = 0.35
            const charSize = 64 * textScale
            const xOffset = (charSize * button.label.length) / 2

            font.drawTextScreen(button.label, vec2(overlayCanvas.width/2-xOffset, overlayCanvas.height/2 -12 + ((button.y*15)*-1)), textScale)

        } else {
            drawText(`${button.label}`, overlayCanvas.width/2 + button.x, overlayCanvas.height/2 - 12 + (button.y*15)*-1, 30)
        }
    },
}))
