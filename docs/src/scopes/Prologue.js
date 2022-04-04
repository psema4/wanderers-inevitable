addGameScope(new GameScope({
    name: 'Overworld',
    label: '493 GA - Icaraus Project HQ',
    type: SCOPES.GAME,
    subType: 'DEFAULT',

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

    gameInit:       function () {
        if (debug) console.debug(`${this._name} initialized.`)

        this._bg_img = document.getElementById('img_bg_start')
        this._button_img = document.getElementById('img_ui_button')

        this._fontLight = new FontImage(document.getElementById('img_font_light'), vec2(64,64))
        this._fontDark = new FontImage(document.getElementById('img_font_dark'), vec2(64,64))

        this._vars.buttons.push(new LJSButton({
            x: 0,
            y: -10,
            w: 12,
            h: 2,
            label: '>>',
            bgColor: new Color(.7, .7, 1),
            image: this._button_img,
            onClick: () => {
                new Sound([.5,.5]).play(mousePos)
                setGameScope("Scene 1")
            }
        }))

        cameraScale = 16 // default: 16

    },

    gameUpdate:     function () {
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
            button.draw(this._fontDark)
        })
    },

    gameRenderPost: function () {
        const textScale = 0.35
        const charSize = 64 * textScale
        const label = this._label || this._name
        const xOffset = (charSize * label.length) / 2
        this._fontLight.drawTextScreen(label, vec2((overlayCanvas.width/2)-xOffset, 6), textScale)
    },

    onEnter: function() {
        menuGainNode.gain.value = 0

        if (!gameAudioCtx)
            gameAudioCtx = new AudioContext()

        let gameAudioSrcEl = document.getElementById('mus_game')
        let parentNode = document.getElementById('assets')
        let src = '/assets/music/wc-inevitable-trailer.mp3'

        if (gameAudioSrcEl) {
            src = gameAudioSrcEl.src
            parentNode = gameAudioSrcEl.parentNode
            parentNode.removeChild(gameAudioSrcEl)
        }

        gameAudioSrcEl = document.createElement('audio')
        gameAudioSrcEl.id = 'mus_game'
        parentNode.appendChild(gameAudioSrcEl)
        gameAudioSrcEl.src = src
        gameAudioSrcEl.loop = true

        gameGainNode = gameAudioCtx.createGain()

        setTimeout(() => {
            gameTrack = gameAudioCtx.createMediaElementSource(gameAudioSrcEl)

            gameTrack.connect(gameGainNode)
                 .connect(gameAudioCtx.destination)

            toggleGameMusic()
        }, 1000)
    },

    onExit: function() {
        destroyGameAudio()
    }
}))