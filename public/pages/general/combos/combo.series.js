let urlSeries = `/api/v1/series`;

// ID del combo
const cmb_id_series_container = "combo_id_series";

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
            //{ser_id: 0, ser_nombre: "Seleccione..."},
            {ser_id: 1, ser_nombre: "One Punch Man"},
            {ser_id: 2, ser_nombre: "One Piece"},
            {ser_id: 3, ser_nombre: "Kamen Rider"}
        ]
    )

}

const funCmboSeries = function(opts) {
    let cmb_series = null;

    const combo_series_container = document.getElementById(cmb_id_series_container);
    if(!combo_series_container) {
        console.error("No combo series container");
        return;
    }
    
    if(opts['id']){
        
        cmb_series = document.getElementById(opts['id'])
        if( cmb_series )
            cmb_series.remove();
        
        cmb_series = document.createElement('select');
        cmb_series.id = opts['id'];
        cmb_series.setAttribute('class','combo');
    }

    if(opts['url'])     urlSeries = opts['url'];

    funFetchComboSeries( ( options )=> {
        if(!options) return;

        const optionElementDefault = document.createElement("option");
        optionElementDefault.value = 0; // Establecer el valor del atributo 'value'
        optionElementDefault.textContent = "Seleccione..."; // Establecer el texto que verá el usuario
        cmb_series.appendChild(optionElementDefault);

        for( let i = 0; i < options.length; i++ ) {
            const optionElement = document.createElement("option");
            optionElement.value = options[i].ser_id; // Establecer el valor del atributo 'value'
            optionElement.textContent = options[i].ser_nombre; // Establecer el texto que verá el usuario
            cmb_series.appendChild(optionElement);
        }
    })

    combo_series_container.appendChild(cmb_series)
}

//funCmboSeries();