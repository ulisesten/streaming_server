const fs = require('fs');
const path = require('path')

class ImagesCommon {
    
    
    deleteImage(filename, filepath) {
        const uri = path.join(filepath, filename); // Ruta completa del archivo
      
        // Verifica si el archivo existe antes de intentar eliminarlo
        fs.stat(uri, (err, stats) => {
            if (err) {
                console.error('Archivo no encontrado:', uri);
                return;
            }
      
            // Borrar el archivo
            fs.unlink(uri, (err) => {
                if (err) {
                    console.error('Error al eliminar el archivo:', err);
                } else {
                    console.log('Archivo eliminado:', filename);
                }
            });
        });
    }
}

module.exports = new ImagesCommon();