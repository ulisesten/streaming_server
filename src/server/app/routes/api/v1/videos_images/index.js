const { Router } = require("express");
const images = Router();
const path = require('path')
const multer = require('multer');
const productImages = require('./domain.js');

const images_path = '/home/ulises/Documentos/Development/apinas/images/products/';

// Configurar dónde se almacenarán las imágenes subidas
const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, images_path); // Carpeta donde se guardarán las imágenes
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname)); // Nombre único de archivo
        }
    });


const upload = multer({ storage: storage });


images.post("/", upload.single('image'), async function (req, res) {
    
    productImages.images_upload(req, res);
    
});



images.get("/:ima_id:ext", async function (req, res) {

    console.log('GET /api/v1/videos/thumbnails/:ima_id:ext', req.params);

    productImages.images_get_one(
        ima_id = req.params.ima_id,
        req,
        res
    )

});


module.exports = images;