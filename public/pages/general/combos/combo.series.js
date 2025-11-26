const urlSeries = `/api/v1/series`;

// ID del combo
const cmb_id_series = "combo_id_series"
const funFetchComboSeries = function(callback) {
    const options = {
        method: "GET"
    };

    fetch(urlSeries)
    .then(response => response.json())
    .then(data => {
        if(data.error == 0) {
            callback(data.data);
            return;
        }

        callback(null);
    });

    callback(
        [
            {ser_id: 1, ser_nombre: "One Punch Man"},
            {ser_id: 2, ser_nombre: "One Piece"}
        ]
    )

}

const funCmboSeries = function() {
    const combo_series_container = document.getElementById(cmb_id_series);
    if(!combo_series_container) {
        console.error("No combo series container");
        return;
    }
    const cmb_series = document.createElement('select');

    combo_series_container.innerHTML = "";

    funFetchComboSeries( ( options )=> {
        if(!options) return;

        for( let i = 0; i < options.length; i++ ) {
            const optionElement = document.createElement("option");
            optionElement.value = options[i].ser_id; // Establecer el valor del atributo 'value'
            optionElement.textContent = options[i].ser_nombre; // Establecer el texto que verá el usuario
            cmb_series.appendChild(optionElement);
        }
    })

    combo_series_container.appendChild(cmb_series)
}

funCmboSeries();