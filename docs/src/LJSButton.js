class LJSButton {
    constructor(options) {
        this._x = options.x || 0
        this._y = options.y || 0
        this._w = options.w || 0
        this._h = options.h || 0
        this._label = options.label || 'Button'
        this._bgColor = options.bgColor || new Color(0.7, 0.7, 0.7)
        this._image = options.image || false
        this._onClick = options.onClick || false

        this._bounds = {
            x1: this._x - this._w/2,
            y1: this._y - this._h/2,
            x2: this._x + this._w/2,
            y2: this._y + this._h/2,
            screen: {}
        }

        this.getBounds()
    }

    getBounds() {
        const screenTopLeft = worldToScreen(vec2(this._bounds.x1, this._bounds.y1))
        const screenBottomRight = worldToScreen(vec2(this._bounds.x2, this._bounds.y2))

        this._bounds.screen = {
            x1: screenTopLeft.x,
            y1: screenTopLeft.y,
            x2: screenBottomRight.x,
            y2: screenBottomRight.y,
        }
        return this._bounds
    }

    draw(font) {
        const sfcPos = vec2(0,0)
        const sfcSize = vec2(1/cameraScale, 1/cameraScale)

        const screenTopLeft = vec2(this._bounds.screen.x1, this._bounds.screen.y1)
        const screenBottomRight = vec2(this._bounds.screen.x2, this._bounds.screen.y2)

        const textScale = 0.25

        this._image && drawCanvas2D(sfcPos, sfcSize, 0, false, (ctx) => {
            //const originalScale = cameraScale

            ctx.save()
            ctx.clearRect(screenTopLeft.x, screenTopLeft.y, screenBottomRight.x-screenTopLeft.x, screenBottomRight.y-screenTopLeft.y)

            if (this._image) {
                ctx.drawImage(this._image, screenTopLeft.x, screenTopLeft.y, screenBottomRight.x - screenTopLeft.x, screenBottomRight.y - screenTopLeft.y)

            } else {
                ctx.fillStyle = this._bgColor
                ctx.fillRect(screenTopLeft.x, screenTopLeft.y, screenBottomRight.x-screenTopLeft.x, screenBottomRight.y-screenTopLeft.y)
            }

            ctx.restore()
        })
        
        const drawX = overlayCanvas.width/2
        const drawY = overlayCanvas.height/2 + ((this._y*15)*-1) - this._image.height/10

        font.drawTextScreen(this._label, vec2(drawX, drawY), textScale, true)
    }

    isClicked(clickPos) {
        const clickPosScreen = worldToScreen(clickPos)

        const screenTopLeft = vec2(this._bounds.screen.x1, this._bounds.screen.y2) // invert y
        screenTopLeft.x += overlayCanvas.width/2
        screenTopLeft.y += overlayCanvas.height/2

        const screenBottomRight = vec2(this._bounds.screen.x2, this._bounds.screen.y1) // invert y
        screenBottomRight.x += overlayCanvas.width/2
        screenBottomRight.y += overlayCanvas.height/2

        //if (debug) console.debug(`is (${clickPosScreen.x},${clickPosScreen.y}) in (${screenTopLeft.x},${screenTopLeft.y})-(${screenBottomRight.x},${screenBottomRight.y})?`)

        if (clickPosScreen.x >= screenTopLeft.x && clickPosScreen.x <= screenBottomRight.x) {
            if (clickPosScreen.y >= screenTopLeft.y && clickPosScreen.y <= screenBottomRight.y) {
                if (this._onClick) this._onClick()
                return true
            }
        }

        return false
    }
}
