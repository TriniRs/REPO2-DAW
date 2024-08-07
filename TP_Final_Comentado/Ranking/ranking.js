document.addEventListener('DOMContentLoaded', function() { // Ejecuta la función cuando el DOM se ha cargado completamente
    var rankingTableBody = document.querySelector('#rankingTable tbody'); 
    // Selecciona el cuerpo de la tabla donde se insertarán las filas del ranking

    var sortScoreButton = document.getElementById('sortScore'); 
    // Selecciona el botón de ordenar por puntos

    var sortDateButton = document.getElementById('sortDate'); 
    // Selecciona el botón de ordenar por fecha

    function loadRankingData() { 
        // Función para cargar los datos del ranking desde localStorage
        return JSON.parse(localStorage.getItem('rankingData')) || []; 
        // Recupera los datos de ranking almacenados en localStorage y los convierte en un objeto JavaScript. Si no hay datos, devuelve un array vacío.
    }

    function renderRanking(rankingData) { 
        // Función para renderizar (mostrar) los datos del ranking en la tabla
        var tableContent = ''; 
        // Variable para almacenar las filas de la tabla como cadenas de texto

        for (var i = 0; i < rankingData.length; i++) { 
            // Itera sobre el array de datos de ranking
            var item = rankingData[i]; 
            // Obtiene el elemento actual del array

            tableContent += '<tr>' +
                '<td>' + item.player + '</td>' + 
                // Crea una celda con el nombre del jugador

                '<td>' + item.point + '</td>' + 
                // Crea una celda con los puntos del jugador

                '<td>' + new Date(item.date).toLocaleDateString() + '</td>' + 
                // Crea una celda con la fecha del juego, formateada como una cadena de fecha local

                '</tr>';
                // Cierra la fila de la tabla
        }

        rankingTableBody.innerHTML = tableContent; 
        // Inserta todas las filas generadas en el cuerpo de la tabla
    }

    function sortRanking(sortFunction) { 
        // Función para ordenar los datos del ranking según una función de ordenación
        var rankingData = loadRankingData(); 
        // Carga los datos del ranking

        rankingData.sort(sortFunction); 
        // Ordena los datos del ranking utilizando la función de ordenación proporcionada

        renderRanking(rankingData); 
        // Renderiza la tabla con los datos ordenados
    }

    sortScoreButton.onclick = function() { 
        // Define la acción cuando se hace clic en el botón de ordenar por puntos
        sortRanking(function(a, b) { 
            // Función de comparación que ordena los datos de mayor a menor puntaje
            return b.point - a.point;
        });
    };

    sortDateButton.onclick = function() { 
        // Define la acción cuando se hace clic en el botón de ordenar por fecha
        sortRanking(function(a, b) { 
            // Función de comparación que ordena los datos de la fecha más reciente a la más antigua
            return new Date(b.date) - new Date(a.date);
        });
    };

    sortRanking(function(a, b) { 
        // Ordena y muestra los datos inicialmente por puntos, de mayor a menor
        return b.point - a.point;
    });
});
