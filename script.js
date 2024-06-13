document.addEventListener('DOMContentLoaded', () => {
    loadFormData();
    loadPreviousResults();

    // Verifica se a música está tocando e a inicia se necessário
    const backgroundMusic = document.getElementById('backgroundMusic');
    if (!backgroundMusic.paused) {
        backgroundMusic.play();
    }
});


function startAnimation() {
    saveFormData();
    const animation = document.getElementById('animation');
    const backFundo = document.getElementById('backgroundCC');
    const countdownElement = document.getElementById('animationCountdown');
    const backgroundMusic = document.getElementById('backgroundMusic'); // Obtém o elemento de áudio

    animation.style.display = 'flex';

    let count = 5;
    countdownElement.innerHTML = count.toString();

    // Inicia a música 1 segundo antes do início da contagem regressiva
    setTimeout(() => {
        backgroundMusic.play();
        backFundo.style.display = 'block';
    }, -1000);

    const interval = setInterval(() => {
        count--;
        countdownElement.innerHTML = count.toString();

        if (count <= 0) {
            clearInterval(interval);
            animation.style.display = 'none';
            sortearNomes();
        }
    }, 1000);
}

function sortearNomes() {
    const raffleName = document.getElementById('raffleName').value;
    let nameList = document.getElementById('nameList').value.split(',').map(name => name.trim()).filter(name => name !== '');
    const quantity = parseInt(document.getElementById('quantity').value);
    const allowRepeats = document.getElementById('allowRepeats').checked;

    if (nameList.length === 0) {
        alert('Por favor, insira os nomes.');
        return;
    }

    if (isNaN(quantity) || quantity <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    let previousResults = JSON.parse(localStorage.getItem('previousResults')) || [];
    let alreadySelectedNames = [];
    if (!allowRepeats) {
        previousResults.forEach(result => {
            alreadySelectedNames = alreadySelectedNames.concat(result.winners);
        });
        nameList = nameList.filter(name => !alreadySelectedNames.includes(name));
    }

    if (!allowRepeats && quantity > nameList.length) {
        alert('A quantidade a ser sorteada não pode ser maior que o número de nomes disponíveis.');
        return;
    }

    let selectedNames = [];
    if (allowRepeats) {
        for (let i = 0; i < quantity; i++) {
            const randomIndex = Math.floor(Math.random() * nameList.length);
            selectedNames.push(nameList[randomIndex]);
        }
    } else {
        const shuffledNames = nameList.sort(() => Math.random() - 0.5);
        selectedNames = shuffledNames.slice(0, quantity);
    }

    localStorage.setItem('raffleName', raffleName);
    localStorage.setItem('winners', JSON.stringify(selectedNames));

    // Salva o resultado no histórico sem limpar o localStorage
    saveResult(raffleName, selectedNames);

    // Redireciona para a página de resultado
    window.location.href = 'resultado.html';
}

function saveResult(raffleName, names) {
    let previousResults = JSON.parse(localStorage.getItem('previousResults')) || [];
    previousResults.push({ raffleName: raffleName, winners: names });
    localStorage.setItem('previousResults', JSON.stringify(previousResults));
    loadPreviousResults();
}

function loadPreviousResults() {
    const winnersList = document.getElementById('winnersList');
    winnersList.innerHTML = '';
    let previousResults = JSON.parse(localStorage.getItem('previousResults')) || [];
    previousResults.forEach((result, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Sorteio ${index + 1} (${result.raffleName}): ${result.winners.join(', ')}`;
        winnersList.appendChild(listItem);
    });
}

function togglePreviousResults() {
    const previousResultsDiv = document.getElementById('previousResults');
    previousResultsDiv.style.display = previousResultsDiv.style.display === 'none' ? 'block' : 'none';
}

function clearPreviousResults() {
    localStorage.removeItem('previousResults');
    loadPreviousResults();
}

function saveFormData() {
    const raffleName = document.getElementById('raffleName').value;
    const nameList = document.getElementById('nameList').value;
    const quantity = document.getElementById('quantity').value;
    const allowRepeats = document.getElementById('allowRepeats').checked;

    localStorage.setItem('formData', JSON.stringify({ raffleName, nameList, quantity, allowRepeats }));
}

function loadFormData() {
    const formData = JSON.parse(localStorage.getItem('formData'));
    if (formData) {
        document.getElementById('raffleName').value = formData.raffleName;
        document.getElementById('nameList').value = formData.nameList;
        document.getElementById('quantity').value = formData.quantity;
        document.getElementById('allowRepeats').checked = formData.allowRepeats;
    }
}
