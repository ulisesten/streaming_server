const fs = require('fs');
const path = require('path');
const imagesCommon = require('../../../../librerias/common/images')

//const images_path = '/home/ulises/Documentos/Development/apinas/images/products/';

class ProductsImagesDto {
    images_upload_response(data, filenames, filespath) {
        if (!data)
            return {
                msg: "Ocurrió un error al guardar las imagenes del producto.",
                success: false,
                error: 1,
            };

        data = data[0];

        if(data.error > 0) {
            filenames.forEach((filename) => {
                imagesCommon.deleteImage(filename, filespath);
            });

            return {
                msg: 'Ocurrió un error y no se guardaron las imágenes.',
                success: false,
                error: 1,
                };
        }

        return {
        msg: data.msg,
        success: data.success,
        error: data.error,
        };
    }
}



  
module.exports = new ProductsImagesDto();