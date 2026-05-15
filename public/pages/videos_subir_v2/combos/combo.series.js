const campos = {
    id: 'ser_id',
    name: 'ser_nombre'
}

Gb.define('combobox',{
    type: 'combobox',
    id: 'cbx_series',
    label: 'Id Serie',
    url: url_vid_subir_series,
    remote: true,
    autoload: true,
    result: 'data',
    fields: campos,
    onSelect: function(serieId) {
        //console.log(serieId)
        funInitComboTemporadasBySerie(serieId);
    }
})
