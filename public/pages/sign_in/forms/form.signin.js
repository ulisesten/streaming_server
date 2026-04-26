

Gb.define('form',{
    type: 'form',
    id: 'frm_signin',
    cls: 'form_signin',
    fields: [
        {
            type: 'textfield',
            label: 'Correo',
            id: 'usu_correo'
        },{
            type: 'textfield',
            label: 'Contraseña',
            id: 'usu_contrasena'
        }
    ],
    buttons: [{
            type: 'button',
            text: 'Enviar',
            id: 'my_button',
            onClick: function() {
                funUsersSignin();
            }
        },{
            type: 'button',
            text: 'Limpiar',
            id: 'my_button_limpiar',
            onClick: function() {
                let form = Gb.getComponent('frm_signin');
                //form.reset()
            }
        }
    ]
})