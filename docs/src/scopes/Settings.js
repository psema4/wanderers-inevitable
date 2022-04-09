addGameScope(new GameScope({
    name: 'Settings',
    type: SCOPES.MENU,
    subType: 'MENU',

    bg_img: false,
    button_img: false,

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

        this._bg_img = document.getElementById('img_bg_computer')
        this._button_img = document.getElementById('img_ui_button')

        this._fontLight = new FontImage(document.getElementById('img_font_light'), vec2(64,64)) 
        this._fontDark = new FontImage(document.getElementById('img_font_dark'), vec2(64,64)) 

        this._vars.buttons.push(new LJSButton({
            x: 0,
            y: 5,
            w: 12,
            h: 3,
            label: 'VOL UP',
            bgColor: new Color(.7, .7, 1),
            image: this._button_img,
            onClick: () => {
                new Sound([.5,.5]).play(mousePos)

                masterVolume += 0.1
                if (masterVolume > 1)
                    masterVolume = 1

                if (menuGainNode)
                    menuGainNode.gain.value = masterVolume

                if (gameGainNode)
                    gameGainNode.gain.value = masterVolume
            }
        }))

        this._vars.buttons.push(new LJSButton({
            x: 0,
            y: 0,
            w: 12,
            h: 3,
            label: 'VOL DOWN',
            bgColor: new Color(.7, .7, 1),
            image: this._button_img,
            onClick: () => {
                new Sound([.5,.5]).play(mousePos)

                masterVolume -= 0.1
                if (masterVolume < 0)
                    masterVolume = 0

                if (menuGainNode)
                    menuGainNode.gain.value = masterVolume

                if (gameGainNode)
                    gameGainNode.gain.value = masterVolume
            }
        }))

        this._vars.buttons.push(new LJSButton({
            x: 0,
            y: -16,
            w: 12,
            h: 3,
            label: 'BACK',
            bgColor: new Color(.7, .7, 1),
            image: this._button_img,
            onClick: () => {
                new Sound([.5,.5]).play(mousePos)
                setGameScope("Main Menu")
            }
        }))

        cameraScale = 16 // default: 16
    },

    gameUpdate: function () {
        if (!this._scopedMouse || (this._scopedMouse && this._name === currentScope)) {
            if (mouseWasPressed(0)) {
                let clickPos = mousePos.floor()

                this._vars.buttons.forEach((button, btnIdx) => {
                    button.isClicked(clickPos)
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
            button.draw(this._fontDark)
        })
    },

    gameRenderPost: function () {
        const textScale = 0.35
        const charSize = 64 * textScale
        let xOffset = (charSize * this._name.length) / 2
        this._fontLight.drawTextScreen(this._name, vec2((overlayCanvas.width/2)-xOffset, 6), textScale)

        const msg = `Volume: ${parseInt(masterVolume*10, 10)}`
        xOffset = (charSize * msg.length)/2
        this._fontDark.drawTextScreen(msg, vec2((overlayCanvas.width/2)-xOffset, 120), textScale)
    },

    onEnter: function() {},

    onExit: function() {},
}))
