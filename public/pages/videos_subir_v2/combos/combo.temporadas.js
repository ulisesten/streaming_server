const camposTemporadas = {
    id: 'sea_id',
    name: 'sea_numero'
}

Gb.define('cbx_temporadas', {
    type: 'combobox',
    //id: 'cbx_temporadas',
    label: 'Id Temporada',
    remote: true,
    autoload: false,
    result: 'data',
    fields: camposTemporadas
})
