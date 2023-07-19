const iconMap = ["виноград", "апельсин", "вишня", "колокольчики", "слива", "barbar", "777", "арбуз", "лемон"];
const icon_width = 105;
const icon_height = 75;
const num_icons = 9;
const time_per_icon = 100;
const indexes = [0, 0, 0];
let statusSpining = false;
let statusAuto = false;
let interval;

if (!(localStorage.getItem('pointsCurrent'))) {
    localStorage.setItem('pointsCurrent', '0')
}
let pointsCurrentValue = localStorage.getItem('pointsCurrent')
const pointsCurrentElement = document.querySelector('.scale__current');
pointsCurrentElement.textContent = pointsCurrentValue;

if (!(localStorage.getItem('pointsFull'))) {
    localStorage.setItem('pointsFull', '9000')
}
let pointsFullValue = localStorage.getItem('pointsFull')
const pointsFullElement = document.querySelector('.scale__full');
pointsFullElement.textContent = pointsFullValue;

if (!(localStorage.getItem('balance'))) {
    localStorage.setItem('balance', '1000000')
}
let balanceValue = localStorage.getItem('balance')
const balanceElement = document.querySelector('.balance__bill');
balanceElement.textContent = balanceValue;

if (!(localStorage.getItem('set'))) {
    localStorage.setItem('set', '50000')
}
const setValue = localStorage.getItem('set')
const setElement = document.querySelector('.set__value');
setElement.textContent = setValue;

if (!(localStorage.getItem('win'))) {
    localStorage.setItem('win', '0')
}
const winValue = localStorage.getItem('win')
const winElement = document.querySelector('.win-scale__bill');
winElement.textContent = winValue;

const changeSet = (action) => {
    if (statusSpining === false) {
        if (action === 'plus') {
            let setValue = Number(localStorage.getItem('set'));
            setValue += 100;
            localStorage.setItem('set', setValue.toString())
            setElement.textContent = setValue;
        } else if (action === 'minus') {
            let setValue = Number(localStorage.getItem('set'));
            if (setValue > 0) {
                setValue -= 100;
                localStorage.setItem('set', setValue.toString())
                setElement.textContent = setValue;
            }
        }
    }

}

const roll = (reel, offset = 0) => {
    const delta = (offset + 2) * num_icons + Math.round(Math.random() * num_icons);
    return new Promise((resolve, reject) => {

        const style = getComputedStyle(reel)
        const backgroundPositionY = parseFloat(style["background-position-y"])
        const targetBackgroundPositionY = backgroundPositionY + delta * icon_height
        const normTargetBackgroundPositionY = targetBackgroundPositionY % (num_icons * icon_height);

        setTimeout(() => {
            reel.style.transition = `background-position-y ${(8 + 1 * delta) * time_per_icon}ms cubic-bezier(.41,-0.01,.63,1.09)`;
            reel.style.backgroundPositionY = `${backgroundPositionY + delta * icon_height}px`;
        }, offset * 150);
        setTimeout(() => {
            reel.style.transition = `none`;
            reel.style.backgroundPositionY = `${normTargetBackgroundPositionY}px`;
            resolve(delta % num_icons);
        }, (8 + 1 * delta) * time_per_icon + offset * 150);
    });
};
const autoRollAll = () => {
    if (statusAuto === false) {
        const buttonAuto = document.querySelector('.footer__button-auto');
        buttonAuto.style.border = `2px solid #ffb800`
        statusAuto = true;
        interval = setInterval(rollAll, 1000);
    } else {
        const buttonAuto = document.querySelector('.footer__button-auto');
        buttonAuto.style.border = `1px solid rgba(0, 163, 255, 1)`
        statusAuto = false;
        clearInterval(interval);
    }
}
const rollAll = () => {
    if (statusSpining === false) {
        statusSpining = true
        const pointsCurrent = Number(localStorage.getItem('pointsCurrent')) + 100
        localStorage.setItem('pointsCurrent', pointsCurrent)
        pointsCurrentElement.textContent = pointsCurrent
        const buttonSpin = document.querySelector('.footer__button-spin');
        buttonSpin.style.border = `2px solid #ffb800`
        setTimeout(() => {
            buttonSpin.style.border = `1px solid #FFB800`
        }, 500)
        const reelsList = document.querySelectorAll('.main__container > .column');
        winElement.textContent = 0;
        localStorage.setItem('win', '0')

        if (!(localStorage.getItem('balance'))) {
            localStorage.setItem('balance', '1000000')
        }
        let balanceValue = localStorage.getItem('balance')
        let setValue = Number(localStorage.getItem('set'))
        if (balanceValue > setValue) {
            const setValue = localStorage.getItem('set')
            balanceValue -= setValue
            localStorage.setItem('balance', balanceValue)
            balanceElement.textContent = balanceValue;

            Promise.all([...reelsList].map((reel, i) => roll(reel, i)))
                .then((deltas) => {
                    deltas.forEach((delta, i) => indexes[i] = (indexes[i] + delta) % num_icons);
                    if (indexes.every(element => element === indexes[0])) {
                        const setValue = localStorage.getItem('set')
                        let balanceValue = localStorage.getItem('balance')
                        const winValue = Number(setValue) * 5;
                        balanceValue = Number(balanceValue) + winValue
                        localStorage.setItem('balance', balanceValue)
                        balanceElement.textContent = balanceValue;
                        winElement.textContent = winValue
                        localStorage.setItem('win', winValue)
                    }
                    statusSpining = false
                });
        }
    }
};
