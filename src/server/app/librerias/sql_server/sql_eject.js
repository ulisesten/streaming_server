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

    async store_eject_old(sp_name, params, database) {

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


    async store_eject(sp_name, params, database) {
        const login_id = 1; // cambiar este valor por el devuelto por la función de login
        const valores = {};
        config.database = database;
    
        // Validaciones iniciales
        if (!sp_name || typeof sp_name !== 'string') {
            throw new Error('Nombre del stored procedure es requerido y debe ser string');
        }
    
        if (!params || typeof params !== 'object') {
            throw new Error('Params debe ser un objeto');
        }
    
        if (!database || typeof database !== 'string') {
            throw new Error('Database es requerido y debe ser string');
        }
    
        let pool;
        try {
            pool = await sql.connect(config);
        } catch (connectionError) {
            throw new Error(`Error de conexión a la base de datos: ${connectionError.message}`);
        }
    
        const request = pool.request();
    
        // Validar que el tipoMSSQL esté disponible
        if (typeof tipoMSSQL === 'undefined') {
            throw new Error('tipoMSSQL no está definido');
        }
    
        // Obtener parámetros del stored procedure
        const query = `
            SELECT PARAMETER_NAME, DATA_TYPE
            FROM information_schema.parameters
            WHERE specific_name = @procedimientoAlmacenado;
        `;
    
        const sp_schema_result = await request
            .input('procedimientoAlmacenado', sql.NVarChar, sp_name)
            .query(query)
            .catch(queryError => {
                throw new Error(`Error al obtener parámetros del SP: ${queryError.message}`);
            });
    
        // Validar que se encontraron parámetros
        if (!sp_schema_result.recordset || sp_schema_result.recordset.length === 0) {
            throw new Error(`No se encontraron parámetros para el stored procedure: ${sp_name}`);
        }
    
        const proc_params = sp_schema_result.recordset;
    
        // Procesar parámetros del stored procedure
        const processParameter = (param) => {
            const tipo = param['DATA_TYPE'];
            const columna = param['PARAMETER_NAME'].replace('@', '');
    
            // Validar nombre de columna
            if (!columna) {
                throw new Error('Nombre de parámetro inválido');
            }
    
            // Asignar valores por defecto según tipo y nombre de columna
            if (columna === 'usuario_alta' || columna === 'usuario_mod') {
                return { value: login_id, type: tipo };
            }
    
            if (tipo === 'datetime') {
                if (columna === 'fecha_alta' || columna === 'fecha_mod') {
                    return { value: new Date(), type: tipo };
                }
                return { value: '1900-01-01 00:00:00', type: tipo };
            }
    
            if (tipo === 'int') {
                return { value: 0, type: tipo };
            }
    
            return { value: null, type: tipo };
        };
    
        // Construir plantilla de parámetros
        for (let i = 0; i < proc_params.length; i++) {
            const param = proc_params[i];
            const columna = param['PARAMETER_NAME'].replace('@', '');
            valores[columna] = processParameter(param);
        }
    
        // Validar y asignar parámetros proporcionados
        const params_keys = Object.keys(params);
        const missingRequiredParams = [];
    
        for (let i = 0; i < params_keys.length; i++) {
            const paramKey = params_keys[i];
            
            if (!valores[paramKey]) {
                missingRequiredParams.push(paramKey);
                continue;
            }
    
            // Validar tipo de dato
            const expectedType = valores[paramKey].type;
            const providedValue = params[paramKey];
            
            if (expectedType === 'int' && !Number.isInteger(Number(providedValue))) {
                throw new Error(`Parámetro ${paramKey} debe ser de tipo ${expectedType}`);
            }
    
            if (expectedType === 'datetime' && !(providedValue instanceof Date) && isNaN(Date.parse(providedValue))) {
                throw new Error(`Parámetro ${paramKey} debe ser una fecha válida`);
            }
    
            valores[paramKey].value = params[paramKey];
        }
    
        // Verificar parámetros requeridos faltantes
        if (missingRequiredParams.length > 0) {
            throw new Error(`Parámetros no definidos en el SP: ${missingRequiredParams.join(', ')}`);
        }
    
        // Preparar request para ejecutar SP
        const sp_request = pool.request();
        const valores_keys = Object.keys(valores);
    
        for (let i = 0; i < valores_keys.length; i++) {
            const key = valores_keys[i];
            const paramConfig = valores[key];
    
            if (!paramConfig) {
                console.warn(`Parámetro ${key} está indefinido, omitiendo...`);
                continue;
            }
    
            // Validar que el tipo esté soportado en tipoMSSQL
            if (!tipoMSSQL[paramConfig.type]) {
                throw new Error(`Tipo de dato no soportado: ${paramConfig.type} para parámetro ${key}`);
            }
    
            sp_request.input(key, tipoMSSQL[paramConfig.type], paramConfig.value);
        }
    
        // Ejecutar stored procedure
        const result = await sp_request.execute(sp_name)
            .catch(executionError => {
                throw new Error(`Error ejecutando stored procedure ${sp_name}: ${executionError.message}`);
            });
    
        // Validar resultado
        if (!result || !result.recordset) {
            throw new Error('No se obtuvo resultado del stored procedure');
        }
    
        return result.recordset;
    }

}

module.exports = new SqlEject();