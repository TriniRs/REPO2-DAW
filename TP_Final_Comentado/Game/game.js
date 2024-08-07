// Lista de letras que pueden aparecer en el tablero
var list = "ABCDEFGHIJKLMNOPQRSTUWXYZ";

// Variables globales para gestionar el estado del juego
var currentTrack = []; // Almacena la secuencia de coordenadas de las letras seleccionadas
var clickable = []; // Almacena las coordenadas de los dados que se pueden seleccionar
var submitted = new Set(); // Almacena las palabras ya enviadas para evitar duplicados
var currentWord = ""; // Almacena la palabra que se está formando actualmente
var lastSelectedButton = null; // Guarda el último botón de dado seleccionado
var words = []; // Almacena las palabras válidas junto con su puntaje

// Función para obtener parámetros de la URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Función para iniciar el temporizador del juego
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    var intervalId = setInterval(function() {
        // Calcular minutos y segundos restantes
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        // Formatear tiempo para que siempre muestre dos dígitos
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        // Actualizar el display del temporizador
        display.textContent = minutes + ":" + seconds;

        // Verificar si el tiempo ha terminado
        if (--timer < 0) {
            clearInterval(intervalId);
            saveResults(); // Guardar resultados cuando el tiempo termina
            showModal(); // Mostrar el modal de finalización
        }
    }, 1000); // Ejecutar cada segundo
}

// Función para mostrar el modal al finalizar el juego
function showModal() {
    var modal = document.getElementById("myModal"); // Obtener el modal
    var span = document.getElementsByClassName("close")[0]; // Botón de cerrar
    var modalBtn = document.getElementById("modalBtn"); // Botón del modal

    modal.style.display = "block"; // Mostrar el modal

    // Cerrar el modal al hacer clic en la "X" o en el botón
    span.onclick = function() {
        modal.style.display = "none";
        window.location.href = "conteo.html"; // Redirigir a la página de conteo
    };

    modalBtn.onclick = function() {
        modal.style.display = "none";
        window.location.href = "conteo.html";
    };

    // Cerrar el modal si se hace clic fuera del modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            window.location.href = "conteo.html";
        } 
    };
}

// Función para finalizar el juego manualmente
document.getElementById("finish").onclick = function() {
    saveResults(); // Guardar resultados
    window.location.href = "conteo.html"; // Redirigir a la página de conteo
};

// Función que se ejecuta al cargar la página
window.onload = function() {
    var timeSelect = getUrlParameter('time'); // Obtener el tiempo seleccionado de la URL
    var timeInSeconds = parseInt(timeSelect) * 60; // Convertir a segundos
    var display = document.querySelector('#time'); // Elemento para mostrar el tiempo
    startTimer(timeInSeconds, display); // Iniciar el temporizador
};

// Función para guardar los resultados del juego
function saveResults() {
    var totalPoints = words.reduce(function(sum, word) {
        return sum + word.points; // Sumar los puntos de todas las palabras válidas
    }, 0);
    var namePlayer = localStorage.getItem('namePlayer'); // Obtener el nombre del jugador

    // Crear un nuevo objeto de resultado
    var newResult = {
        player: namePlayer,
        point: totalPoints,
        date: new Date().toISOString() // Guardar la fecha actual
    };

    // Obtener los datos de ranking guardados en localStorage
    var rankingData = JSON.parse(localStorage.getItem('rankingData')) || [];
    rankingData.push(newResult); // Agregar el nuevo resultado
    localStorage.setItem('rankingData', JSON.stringify(rankingData)); // Guardar en localStorage
    localStorage.setItem('words', JSON.stringify(words)); // Guardar las palabras válidas
    localStorage.setItem('puntosTotales', totalPoints); // Guardar el puntaje total
}

// Inicializa el tablero y asigna eventos a los botones
board();
buttonEvent();

// Función para generar y mostrar el tablero del juego
function board() {
    var board = []; // Arreglo para almacenar el tablero
    var boardGenerator = list.split(''); // Separar las letras en un arreglo
    shuffle(boardGenerator); // Mezclar las letras

    // Crear un tablero de 4x4
    for (var i = 0; i < 16; i += 4) {
        var line = boardGenerator.slice(i, i + 4); // Obtener una fila de 4 letras
        board.push(line); // Agregar la fila al tablero
    }

    // Mostrar el tablero en la interfaz
    for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
            var character = board[row][col]; // Obtener la letra
            var button = "<button type='button' class='dice' row='" + row + "' col='" + col + "'>" + character + "</button>"; // Crear el botón
            var rowSelector = document.getElementById("row" + row); // Obtener el contenedor de la fila
            if (rowSelector) {
                rowSelector.innerHTML += button; // Añadir el botón a la fila
            } else {
                console.error("Element with id 'row" + row + "' not found."); // Mostrar un error si no se encuentra el contenedor
            }
        }
    }

    // Función para mezclar un arreglo
    function shuffle(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1)); // Elegir un índice aleatorio
            var temp = arr[i]; // Intercambiar los elementos
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
}

// Función para asignar eventos a los botones del tablero
function buttonEvent() {
    var events = document.getElementsByClassName('dice'); // Obtener todos los botones de dados
    for (var i = 0; i < events.length; i++) {
        events[i].onclick = function() {
            var row = Number(this.getAttribute('row')); // Obtener la fila del dado
            var col = Number(this.getAttribute('col')); // Obtener la columna del dado
            var text = this.innerHTML; // Obtener la letra del dado

            if (lastSelectedButton) {
                lastSelectedButton.classList.remove('selected'); // Quitar la clase 'selected' del último botón seleccionado
            }

            if (!this.classList.contains('active')) {
                currentTrack.push([row, col]); // Agregar las coordenadas del dado a la pista actual
                currentWord += text; // Añadir la letra a la palabra actual
                this.classList.add('selected'); // Marcar el botón como seleccionado
                lastSelectedButton = this; // Actualizar el último botón seleccionado
            } else {
                currentTrack.pop(); // Eliminar las coordenadas del dado de la pista
                currentWord = currentWord.substring(0, currentWord.length - 1); // Eliminar la última letra de la palabra actual
                this.classList.remove('selected'); // Quitar la selección del botón
                lastSelectedButton = null; // Restablecer el último botón seleccionado
            }

            // Si hay dados seleccionados, actualizar los dados adyacentes que se pueden seleccionar
            if (currentTrack.length !== 0) {
                var currentDice = currentTrack[currentTrack.length - 1]; // Obtener el último dado seleccionado
                ajacent(currentDice[0], currentDice[1]); // Encontrar los dados adyacentes
                clickable = modifyClickable(clickable, currentTrack); // Modificar la lista de dados clicables
                clickable.push([currentDice[0], currentDice[1]]); // Añadir el dado actual a la lista de clicables
            } else {
                clickable = []; // Si no hay dados seleccionados, no hay dados clicables
            }
            updateClickableDice(); // Actualizar los botones de los dados para reflejar cuáles son clicables
            document.getElementById('currentWord').innerHTML = currentWord; // Mostrar la palabra actual
            this.classList.toggle('active'); // Alternar la clase 'active' en el botón actual
        };
    }

    var submitButton = document.getElementById('submit');
    if (submitButton) {
        submitButton.onclick = validateAndSubmitWord; // Asignar el evento para validar y enviar la palabra
    } else {
        console.error("Element with id 'submit' not found."); // Mostrar un error si no se encuentra el botón de enviar
    }
}

// Función para modificar la lista de dados clicables
function modifyClickable(clickable, currentTrack) {
    return clickable.filter(function(dice1) {
        return !currentTrack.some(function(dice2) {
            return dice1[0] === dice2[0] && dice1[1] === dice2[1]; // Eliminar de la lista de clicables los dados que ya están en la pista
        });
    });
}

// Función para actualizar los botones de los dados para reflejar cuáles son clicables
function updateClickableDice() {
    var events = document.getElementsByClassName('dice'); // Obtener todos los botones de dados
    for (var i = 0; i < events.length; i++) {
        var event = events[i];
        var row = Number(event.getAttribute('row')); // Obtener la fila del dado
        var col = Number(event.getAttribute('col')); // Obtener la columna del dado
        var isClickable = currentTrack.length === 0 || clickable.some(function(dice) {
            return dice[0] === row && dice[1] === col; // Verificar si el dado es clicable
        });

        event.disabled = !isClickable; // Deshabilitar los dados que no son clicables
        if (isClickable) {
            event.classList.add('highlightBtn'); // Añadir la clase para resaltar los dados clicables
        } else {
            event.classList.remove('highlightBtn'); // Quitar la clase de resalte si no es clicable
        }
    }
}

// Función para mostrar un modal si la palabra ya ha sido enviada
function showWordExistsModal() {
    var modal = document.getElementById("wordExistsModal");
    var span = document.getElementsByClassName("close")[1];

    modal.style.display = "block"; // Mostrar el modal

    // Cerrar el modal al hacer clic en la "X"
    span.onclick = function() {
        modal.style.display = "none";
    };

    // Cerrar el modal si se hace clic fuera del modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

// Función para validar y enviar la palabra
function validateAndSubmitWord() {
    if (currentWord.length < 3) {
        showError("The word must have at least 3 letters."); // Mostrar un error si la palabra tiene menos de 3 letras
    } else if (submitted.has(currentWord)) {
        showWordExistsModal(); // Mostrar un modal si la palabra ya ha sido enviada
        resetWord(); // Reiniciar la palabra actual
        afterSubmit(); // Acciones posteriores al envío de la palabra
    } else {
        // Verificar si la palabra es válida utilizando una API
        fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + currentWord)
            .then(function(response) {
                if (response.ok) {
                    return response.json(); // Si la respuesta es válida, continuar
                } else {
                    throw new Error("Invalid word"); // Si no es válida, lanzar un error
                }
            })
            .then(function() {
                var score = calculateScore(currentWord); // Calcular el puntaje de la palabra
                words.push({ word: currentWord, points: score }); // Agregar la palabra válida y su puntaje a la lista
                submitWord(); // Enviar la palabra
                updateWords(); // Actualizar la lista de palabras en la interfaz
                clearSelectedButtons(); // Limpiar la selección de botones
                afterSubmit(); // Acciones posteriores al envío de la palabra
            })
            .catch(function() {
                showError("The word is not valid. Points will be deducted."); // Mostrar un error si la palabra no es válida
                var score = -calculateScore(currentWord); // Calcular un puntaje negativo
                words.push({ word: currentWord, points: score }); // Agregar la palabra inválida y su puntaje negativo a la lista
                updateWords(); // Actualizar la lista de palabras en la interfaz
                resetWord(); // Reiniciar la palabra actual
                clearSelectedButtons(); // Limpiar la selección de botones
                afterSubmit(); // Acciones posteriores al envío de la palabra
            });
    }
}

// Función para reiniciar la palabra actual
function resetWord() {
    currentWord = "";
    document.getElementById('currentWord').innerHTML = currentWord; // Actualizar la interfaz
}

// Función para limpiar la selección de botones
function clearSelectedButtons() {
    var selectedButtons = document.getElementsByClassName('selected');
    var activeButtons = document.getElementsByClassName('active');

    // Quitar la selección de todos los botones seleccionados
    for (var i = 0; i < selectedButtons.length; i++) {
        selectedButtons[i].classList.remove('selected');
    }
    for (var i = 0; i < activeButtons.length; i++) {
        activeButtons[i].classList.remove('active');
    }

    lastSelectedButton = null; // Restablecer el último botón seleccionado
}

// Función para enviar la palabra actual
function submitWord() {
    currentTrack = []; // Vaciar la pista actual
    submitted.add(currentWord); // Añadir la palabra al conjunto de palabras enviadas
    resetWord(); // Reiniciar la palabra actual
}

// Función para realizar acciones después de enviar una palabra
function afterSubmit() {
    var events = document.getElementsByClassName('dice');
    for (var i = 0; i < events.length; i++) {
        events[i].classList.remove('active'); // Quitar la clase 'active' de todos los botones
    }
    currentTrack = []; // Vaciar la pista actual
    updateClickableDice(); // Actualizar los dados clicables
}

// Función para actualizar la lista de palabras y el puntaje total en la interfaz
function updateWords() {
    var validWords = words.filter(function(entry) {
        return entry.points > 0; // Filtrar solo las palabras con puntaje positivo
    });
    var wordsHtml = validWords.map(function(entry) {
        return entry.word + " (" + entry.points + ")"; // Crear el HTML para la lista de palabras
    }).join(' - ');
    var sum = words.reduce(function(total, entry) {
        return total + entry.points; // Sumar los puntos totales
    }, 0);

    document.getElementById('tableWords').innerHTML = wordsHtml; // Actualizar la lista de palabras en la interfaz
    document.getElementById('totalScore').innerHTML = sum; // Actualizar el puntaje total en la interfaz
}

// Función para calcular el puntaje de una palabra en función de su longitud
function calculateScore(word) {
    var length = word.length;
    if (length <= 2) return 0; // Si la palabra tiene 2 o menos letras, el puntaje es 0
    if (length <= 4) return 1; // Si tiene 3 o 4 letras, el puntaje es 1
    if (length === 5) return 2; // Si tiene 5 letras, el puntaje es 2
    if (length === 6) return 3; // Si tiene 6 letras, el puntaje es 3
    if (length === 7) return 5; // Si tiene 7 letras, el puntaje es 5
    return 11; // Si tiene 8 o más letras, el puntaje es 11
}

// Función para verificar si las coordenadas están dentro del rango del tablero
function withinRange(row, col) {
    return (row >= 0 && row < 4 && col >= 0 && col < 4); // Devuelve true si las coordenadas están dentro del tablero 4x4
}

// Arreglo que contiene las direcciones de los dados adyacentes
var ajacentDice = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],          [0, 1],
    [1, -1], [1, 0], [1, 1]
];

// Función para encontrar los dados adyacentes a un dado dado
function ajacent(row, col) {
    clickable = ajacentDice
        .map(function(dice) {
            return [Number(row) + dice[0], Number(col) + dice[1]]; // Calcular las coordenadas de los dados adyacentes
        })
        .filter(function(dice) {
            return withinRange(dice[0], dice[1]); // Filtrar solo los dados que están dentro del tablero
        });
}

// Función para mostrar un error temporal en la interfaz
function showError(message) {
    var errorElement = document.getElementById('error');
    errorElement.innerHTML = message; // Mostrar el mensaje de error
    errorElement.style.display = 'block'; // Mostrar el elemento de error
    setTimeout(function() {
        errorElement.style.display = 'none'; // Ocultar el elemento de error después de 3 segundos
    }, 3000);
}
