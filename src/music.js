var masterVolume = 1

var menuAudioCtx = false
var menuGainNode = false
var menuTrack = false
var menuMusicPlaying = 'false'

function toggleMenuMusic(id='mus_trailer') {
    if (!menuAudioCtx)
        return

    const menuAudioSrcEl = document.getElementById(id)

    if (menuAudioCtx.state === 'suspended')
        menuAudioCtx.resume()

    if (menuMusicPlaying === 'false') {
        menuAudioSrcEl.play()
        menuMusicPlaying = 'true'

    } else if (menuMusicPlaying === 'true') {
        menuAudioSrcEl.pause()
        menuMusicPlaying = 'false'
    }
}

var gameAudioCtx = false
var gameGainNode = false
var gameTrack = false
var gameMusicPlaying = 'false'

function toggleGameMusic(id='mus_game') {
    if (!gameAudioCtx)
        return

    const gameAudioSrcEl = document.getElementById(id)

    if (gameAudioCtx.state === 'suspended')
        gameAudioCtx.resume()

    if (gameMusicPlaying === 'false') {
        gameAudioSrcEl.play()
        gameMusicPlaying = 'true'

    } else if (gameMusicPlaying === 'true') {
        gameAudioSrcEl.pause()
        gameMusicPlaying = 'false'
    }
}

function destroyGameAudio() {
    if (gameAudioCtx) {
        toggleGameMusic()

        if (gameTrack) {
            gameTrack.disconnect()
            gameTrack = false
        }

        if (gameGainNode)
            gameGainNode = false

        gameAudioCtx = false

        const gameAudioSrcEl = document.getElementById('mus_game')
        if (gameAudioSrcEl)
            gameAudioSrcEl.parentNode.removeChild(gameAudioSrcEl)
    }
}
