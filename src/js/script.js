const timeElement = document.querySelector('.time')
const controlButton = document.querySelector('.timer-control')
const resetButton = document.querySelector('.reset-button')
const workTimeElement = document.querySelector('#work-time-options')
const turnElement = document.querySelector('.turns')
const totalTurnsElement = document.querySelector('#total-turns-options')
const timeModeElement = document.querySelector('.time-mode')
const notificationSound = document.querySelector('#notification')

controlButton.addEventListener("click", toggleStartPause)
resetButton.addEventListener("click", reset)

let timeRemaining = 0
let timer = null
let isRunning = false
let isBreakTime = false
let workTime = 0
let breakTime = 0
let longBreakTime = 0
let totalTurns = 0
let currentTurn = 1
let totalTime = 0


document.getElementById('toggle-config').addEventListener("click", ()=> {
    const config = document.getElementById('drop-content')
    config.style.display = config.style.display === "none" || !config.style.display ? "flex" : "none"
})

function toggleStartPause() {
    isRunning ? pause() : start()
}

function reset() {
    pause()
    initTimerSettings()
    updateTimeDisplay()
    updateUI()
}

function initTimerSettings() {
    const workValue = parseInt(workTimeElement.value)
    const turnsValue = parseInt(totalTurnsElement.value)
    isRunning = false
    isBreakTime = false
    workTime = workValue * 60
    breakTime = (workValue / 5) * 60
    longBreakTime = (workValue - 10) * 60
    totalTurns = turnsValue
    currentTurn = 1
    totalTime = workTime
    timeRemaining = totalTime
    timer = null
}

function updateTurnDisplay() {
    const mode = isBreakTime ? (currentTurn < totalTurns ? "Descanso" : "Descanso Longo") : "Trabalho"
    timeModeElement.innerText = mode
    turnElement.innerText =  `${currentTurn}/${totalTurns}`
}

function updateTimeDisplay() {
    const minutes = Math.floor(timeRemaining / 60).toString().padStart(2, "0")
    const seconds = (timeRemaining % 60).toString().padStart(2, "0")
    timeElement.innerText = `${minutes}:${seconds}`
}

function nextTurn() {
    isBreakTime = !isBreakTime
    if (!isBreakTime) currentTurn++

    if (currentTurn <= totalTurns) {
        if(isBreakTime) {
            totalTime = currentTurn < totalTurns ? breakTime : longBreakTime
            showNotification("Hora de descansar", "Parabéns pelo trabalho, aproveite os próximos minutos  para descansar.")
        } else {
            totalTime = workTime
            showNotification("Voltar ao trabalho", "Você está quase lá, só mais alguns minutos de trabalho.")
        }
        timeRemaining = totalTime
    } else {
        reset()
    }
}

function showNotification(title, body) {
    if (Notification.permission === "granted") {
        const notification = new Notification(title, { body })
        setTimeout(() => notification.close(), 4000)
    }
}

function finishTurn() {
    notificationSound.play()
    nextTurn()
    updateUI()
}

function updateTimer() {
    if (timeRemaining > 0) {
        timeRemaining--
        updateTimeDisplay()
    } else {
        finishTurn()
    }
}

function updateUI() {
    updateTimeDisplay()
    updateTurnDisplay()
}

function start() {
    if (Notification.permission !== "granted") {
        Notification.requestPermission()
    }
    isRunning = true
    controlButton.innerText = "Pausar"
    timer = setInterval(updateTimer, 1000)
}

function pause() {
    isRunning = false
    controlButton.innerText = "Iniciar"
    clearInterval(timer)
}

initTimerSettings()


