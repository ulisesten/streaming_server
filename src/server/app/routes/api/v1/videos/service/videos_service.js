const nativeModule = require("../../../../../../../../build/Release/video_streamer")
const path = require("path");
const multer = require("multer");
const {nanoid} = require('nanoid');
const config = require("../../../../../../config");
const settings = require('../../../../../core/configuration')

const id_length = 12;

const video_storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(config.videosPath);
        //fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        console.log(file.originalname)
        const name_arr = file.originalname.split(".");
        const vid_id = nanoid(id_length);
        const vid_name = "vid-" + vid_id + "." + name_arr[name_arr.length - 1];

        req.vid_id_public = vid_id;

        cb(null, vid_name);
    },
});


// Configurar dónde se almacenarán las imágenes subidas
const thumb_storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, settings.getApiNAS()); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        const thu_id_public = nanoid(id_length);
        const name_arr = file.originalname.split(".");
        const ima_name = "tmb-" + thu_id_public + "." + name_arr[name_arr.length - 1];

        req.vid_id_thu_public = thu_id_public;

        cb(null, ima_name ); // Nombre único de archivo
    }
});



class VideosService {
    constructor(){
        this.upload_video = multer({ storage: video_storage });
        this.upload_thumbnail = multer({ storage: thumb_storage });
    }

    async processToHLS(inputPath, outputDir) {
        return new Promise((resolve) => {
            try {
                const ok = nativeModule.convertToHLS(inputPath, outputDir);
                console.log('ok', ok);
                resolve(ok);
            } catch (err) {
                console.error("Error en convertToHLS:", err);
                resolve(false);
            }
        });
    }
}

module.exports = new VideosService();