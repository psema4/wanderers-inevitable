addGameScope(new GameScope({
    name: 'Scene 2a',
    type: SCOPES.GAME,
    subType: 'DEFAULT',

    bg_img: false,
    button_img: false,

    fontLight: false,
    fontMid: false,
    fontDark: false,

    scopedUpdate: true,
    scopedRender: true,
    scopedKeboard: true,
    scopedMouse: true,
    scopedGamepad: true,

    vars: {
        buttons: []
    },

    gameInit:       function () {
        if (debug) console.debug(`${this._name} initialized.`)

        this._bg_img = document.getElementById('img_bg_scene_2')
        this._button_img = document.getElementById('img_ui_button')

        this._fontLight = new FontImage(document.getElementById('img_font_light'), vec2(64,64))
        this._fontMid = new FontImage(document.getElementById('img_font_mid'), vec2(64,64))
        this._fontDark = new FontImage(document.getElementById('img_font_dark'), vec2(64,64))

        this._vars.buttons.push(new LJSButton({
            x: 0,
            y: -16,
            w: 12,
            h: 3,
            label: 'CONTINUE',
            bgColor: new Color(.7, .7, 1),
            image: this._button_img,
            onClick: () => {
                new Sound([.5,.5]).play(mousePos)
                setGameScope("Main Menu")
            }
        }))

        cameraScale = 16 // default: 16

    },

    gameUpdate:     function () {
        const now = new Date().getTime()

        if (now - this._enteredAt < 1000)
            return

        if (!this._scopedMouse || (this._scopedMouse && this._name === currentScope)) {
            if (mouseWasPressed(0)) {
                let clickPos = mousePos.floor()

                this._vars.buttons.forEach((button, btnIdx) => {
                    button.isClicked(clickPos)
                })
            }
        }

        if (!this._scopedKeyboard || (this._scopedKeyboard && this._name === currentScope)) {
            if (keyWasReleased(27)) { // ESC
                destroyGameAudio()
                setGameScope('Main Menu')
            }
        }
    },
    
    gameUpdatePost: function () {},
    
    gameRender:     function () {
        const now = new Date().getTime()

        const sfcPos = vec2(0,0)
        const sfcSize = vec2(1/cameraScale, 1/cameraScale)

        drawCanvas2D(sfcPos, sfcSize, 0, false, (ctx) => {
            const bgImage = this._bg_img
            //const originalScale = cameraScale
            //cameraScale = 1
            ctx.save()
            ctx.drawImage(bgImage, bgImage.width/2 * -1, bgImage.height/2 * -1)
            ctx.restore()
            //cameraScale = originalScale
        })

        if (now - this._enteredAt < 1000)
            return

        this._vars.buttons && this._vars.buttons.forEach((button) => {
            button.draw(this._fontDark)
        })
    },

    gameRenderPost: function () {
        const textScale = 0.35
        const charSize = 64 * textScale
        const xOffset = (charSize * this._name.length) / 2
        this._fontMid.drawTextScreen(this._name, vec2((overlayCanvas.width/2)-xOffset, 20), textScale)
    },

    onEnter: function() {
        this._enteredAt = new Date().getTime()
    },

    onExit: function() {
        destroyGameAudio()
    }
}))
