const { Router } = require("express");
const fs = require('fs');
const productsImagesDto = require("./dto.js");
const sqlEject = require("../../../../librerias/sql_server/sql_eject.js");
const multer = require('multer');

const images_path = '/home/ulises/Documentos/Development/apinas/images/products/';

class VideoImages {

    async images_upload(req, res) {
        const body = req.body;

        const filename = req.file.filename;

        const parametros = {
            tipoRegistro: "VID_IMA_INS",
            ima_id_producto: body.ima_id_producto,
            ima_arc_path: images_path,
            ima_arc_nombre: filename
        };

        const db_res = await sqlEject.store_eject(
            "procCatVideosProc",
            parametros,
            "soda_stream",
        );
        
        res.json(productsImagesDto.images_upload_response(db_res, filenames, images_path));
    };



    async images_get_one( ima_id, req, res ) {
        
        const parametros = {
            tipoConsulta: "PRO_IMAGEN_CONS",
            ima_id: ima_id
        };

        const db_res = await sqlEject.store_eject(
            "procProductsImagesCons",
            parametros,
            "hereli_api",
        );

        if (!db_res || !db_res[0]){
            res.json({
                msg: "Ocurrió un error al consultar la imagen.",
                success: false,
                error: 1,
            });
            return;
        }

        const imagen = db_res[0];

        const filename = imagen.ima_arc_nombre;
        const imagePath = imagen.ima_arc_path + filename;

        console.log(imagePath)

        // Verificar si la imagen existe
        fs.stat(imagePath, (err, stats) => {
            if (err) {
            return res.status(404).json({ message: 'Imagen no encontrada' });
            }

            // Crear un stream de lectura para la imagen
            const imageStream = fs.createReadStream(imagePath);

            res.setHeader('Content-Type', 'image/png'); // Ajustar según el tipo de imagen

            imageStream.pipe(res);
        });
    };
}


module.exports = new VideoImages();