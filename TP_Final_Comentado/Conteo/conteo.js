window.onload = function() { // Ejecuta la función cuando la ventana se ha cargado completamente
    var words = JSON.parse(localStorage.getItem('words')) || []; 
    // Recupera las palabras almacenadas en localStorage y las convierte en un objeto JavaScript. Si no hay datos, usa un array vacío.
    
    var wordList = document.getElementById('wordList'); 
    // Obtiene el elemento HTML donde se listarán las palabras.
    
    var totalScore = 0; 
    // Inicializa la variable que almacenará la puntuación total.
    
    var i, entry, row, wordCell, pointsCell; 
    // Declara variables que se usarán en el bucle.

    for (i = 0; i < words.length; i++) { 
        // Itera sobre el array de palabras.
        
        entry = words[i]; 
        // Obtiene la palabra actual y sus puntos.
        
        row = document.createElement('tr'); 
        // Crea una nueva fila para la tabla.

        wordCell = document.createElement('td'); 
        // Crea una celda para la palabra.
        
        wordCell.textContent = entry.word; 
        // Asigna el nombre de la palabra a la celda.
        
        row.appendChild(wordCell); 
        // Añade la celda de la palabra a la fila.

        pointsCell = document.createElement('td'); 
        // Crea una celda para los puntos.
        
        pointsCell.textContent = entry.points; 
        // Asigna la cantidad de puntos a la celda.
        
        row.appendChild(pointsCell); 
        // Añade la celda de los puntos a la fila.

        wordList.appendChild(row); 
        // Añade la fila completa a la tabla.

        totalScore += entry.points; 
        // Suma los puntos de la palabra actual al total.
    }

    document.getElementById('totalPoints').textContent = 'Total: ' + totalScore; 
    // Actualiza el texto del elemento que muestra el total de puntos.
};
