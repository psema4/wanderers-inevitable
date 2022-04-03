addGameScope(new GameScope({
    name: 'Settings',
    type: SCOPES.MENU,
    subType: 'MENU',

    bg_img: false,

    fontLight: false,
    fontDark: false,

    scopedUpdate: true,
    scopedRender: true,
    scopedKeboard: true,
    scopedMouse: true,
    scopedGamepad: true,

    vars: {
        buttons: []
    },

    gameInit: function () {
        if (debug) console.debug(`${this._name} initialized.`)

        this._vars.buttons.push({
            x: 0,
            y: -10,
            w: 12,
            h: 2,
            label: 'back',
            bgColor: new Color(.7, .7, 1),
        })

        this._bg_img = document.getElementById('img_bg_computer')

        this._fontLight = new FontImage(document.getElementById('img_font_light'), vec2(64,64)) 
        this._fontDark = new FontImage(document.getElementById('img_font_dark'), vec2(64,64)) 

        cameraScale = 16 // default: 16
    },

    gameUpdate: function () {
        if (!this._scopedMouse || (this._scopedMouse && this._name === currentScope)) {
            if (mouseWasPressed(0)) {
                let clickPos = mousePos.floor()

                this._vars.buttons.forEach((button, btnIdx) => {
                    let bounds = {
                        x1: button.x - button.w/2,
                        x2: button.x + button.w/2,
                        y1: button.y - button.h/2,
                        y2: button.y + button.h/2,
                    }

                    if (clickPos.x >= bounds.x1 && clickPos.x <= bounds.x2) {
                        if (clickPos.y >= bounds.y1 && clickPos.y <= bounds.y2) {
                            new Sound([.5,.5]).play(mousePos)
                            setGameScope("Main Menu")
                        }
                    }
                })
            }
        }
    },

    gameUpdatePost: function () {},

    gameRender: function () {
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

        this._vars.buttons.forEach((button) => {
            this.drawButton(button, this._fontDark)
        })
    },

    gameRenderPost: function () {
        const textScale = 0.35
        const charSize = 64 * textScale
        const xOffset = (charSize * this._name.length) / 2
        this._fontLight.drawTextScreen(this._name, vec2((overlayCanvas.width/2)-xOffset, 6), textScale)
    },

    onEnter: function() {
    },

    onExit: function() {
    },

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
    }
}))
