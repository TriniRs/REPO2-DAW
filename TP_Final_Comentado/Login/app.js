document.getElementById("startGameButton").onclick = function() { // Agrega un evento click al botón de inicio
    var name = document.getElementById('name').value; // Obtiene el valor del campo nombre
    var mail = document.getElementById('mail').value; // Obtiene el valor del campo correo
    var time = document.getElementById('selectTime').value; // Obtiene el valor del menú desplegable
    var errorMessage = document.getElementById('errorMessage'); // Referencia al contenedor de mensajes de error

    var mailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Patrón RegEx para validar correos electrónicos

    if (name.length >= 3 && mailPattern.test(mail) && time) { // Comprueba si el nombre tiene al menos 3 caracteres, el correo es válido y el tiempo está seleccionado
        localStorage.setItem('namePlayer', name); // Guarda el nombre en el almacenamiento local
        window.location.href = "game.html?time=" + time; // Redirige a la página del juego con el tiempo seleccionado en la URL
    } else {
        if (name.length < 3) { // Verifica si el nombre es demasiado corto
            errorMessage.textContent = "Too short (3 letters minimum)"; // Muestra un mensaje de error si el nombre es demasiado corto
        } else if (!mailPattern.test(mail)) { // Verifica si el correo es inválido
            errorMessage.textContent = "Invalid email"; // Muestra un mensaje de error si el correo es inválido
        } else { // Si falta algún campo
            errorMessage.textContent = "Complete all the fields"; // Muestra un mensaje de error si faltan campos
        }
        errorMessage.style.display = "block"; // Muestra el mensaje de error
    }
};