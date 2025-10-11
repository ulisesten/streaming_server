const sql = require('mssql');
require('dotenv').config();

const settings = require('../../core/configuration');

const tipoMSSQL = {
    'varchar': sql.VarChar,
    'nvarchar': sql.NVarChar,
    'int': sql.Int,
    'char': sql.Char,
    'datetime': sql.DateTime,
    'numeric': sql.Numeric,
    'decimal': sql.Decimal
};

const config = settings.getDatabaseConfig();

class SqlEject {

    async store_eject(sp_name, params, database) {

        // cambiar este valor por el devuelto por la función de login
        const login_id = 1;

        const valores = {};
        config.database = database;

        try {

            let pool = await sql.connect(config);
            const request = pool.request();

            /// Obteniendo parámetros del Procedimiento almacenado
            const query = `
                select
                    PARAMETER_NAME,
                    DATA_TYPE
                from
                    information_schema.parameters
                where
                    specific_name= @procedimientoAlmacenado;
            `;

            const sp_schema_result = await request
                .input('procedimientoAlmacenado', sql.NVarChar, sp_name)
                .query(query);

            const proc_params = sp_schema_result.recordset

            /// Estableciendo valores a null y tipos en el arreglo valores como plantilla de parámetros
            for(let i = 0; i < proc_params.length; i++) {
                const tipo = proc_params[i]['DATA_TYPE'];
                const columna = proc_params[i]['PARAMETER_NAME'].replace('@', '');

                if(columna == 'usuario_alta' || columna == 'usuario_mod') {
                    valores[columna] = {value: login_id, type: tipo};
                    continue;
                }
                else
                if(tipo === 'datetime') {
                    if(columna == 'fecha_alta' || columna == 'fecha_mod')
                        valores[columna] = {value: new Date(), type: tipo};
                    else
                        valores[columna] = {value: '1900-01-01 00:00:00', type: tipo};

                    continue;
                }
                else
                if(tipo === 'datetime') {
                    valores[columna] = {value: new Date(), type: tipo};
                    continue;
                }
                else
                if(tipo === 'int') {
                    valores[columna] = {value: 0, type: tipo};
                    continue;
                }
                
                valores[columna] = {value: null, type: tipo};
            }
            

            /// Estableciendo valores en la plantilla de parámetros
            const params_keys = Object.keys(params);
            for(let i = 0; i < params_keys.length; i++ ) {
                valores[params_keys[i]].value = params[params_keys[i]];
            }
            
            const sp_request = pool.request();
            
            /// Añadiendo los parametros ya procesados al query
            const valores_keys = Object.keys(valores);
            for( let i = 0; i < valores_keys.length; i++ ) {
                if (!valores[valores_keys[i]]) {
                    console.warn(`Parámetro ${valores[valores_keys[i]].value} está indefinido`);
                }
                //console.log('tipo:', valores[valores_keys[i]].type)
                sp_request.input( `${valores_keys[i]}`, tipoMSSQL[valores[valores_keys[i]].type], `${valores[valores_keys[i]].value}`);
            }
            

            /// Ejecutando el procedimiento almacenado
            const result = await sp_request.execute(sp_name);
    
            return result.recordset;

        } catch (err) {

            console.error('Error:', err);

        } finally {

            sql.close(); // Cierra la conexión

        }
    }

}

module.exports = new SqlEject();