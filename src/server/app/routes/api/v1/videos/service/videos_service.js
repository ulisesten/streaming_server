const nativeModule = require("../../../../../../../../build/Release/video_streamer")
const path = require("path");
const multer = require("multer");
const {nanoid} = require('nanoid');
const config = require("../../../../../../config");
const settings = require('../../../../../core/configuration')

const id_length = settings.getPublicIdLength();

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
        req.uploadSessionId = `upload_${vid_id}`;

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
        this.upload_progress = new Map();
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

    progress_handler = (req, res, next) => {
        const sessionId = req.headers['x-upload-session'] || req.uploadSessionId;
        
        if (sessionId) {
            this.upload_progress.set(sessionId, { progress: 0, loaded: 0, total: 0 });
            
            // Escuchar el evento 'data' del request para trackear progreso
            let loaded = 0;
            const contentLength = parseInt(req.headers['content-length']);
            
            req.on('data', (chunk) => {
                loaded += chunk.length;
                const progress = Math.round((loaded / contentLength) * 100);
                
                this.upload_progress.set(sessionId, {
                    progress: progress,
                    loaded: loaded,
                    total: contentLength,
                    status: 'uploading'
                });
                
                console.log(`Upload ${sessionId}: ${progress}%`);
            });
            
            req.on('end', () => {
                this.upload_progress.set(sessionId, {
                    progress: 100,
                    loaded: contentLength,
                    total: contentLength,
                    status: 'completed'
                });
                
                // Limpiar después de 30 segundos
                setTimeout(() => {
                    this.upload_progress.delete(sessionId);
                }, 30000);
            });
            
            req.on('error', () => {
                this.upload_progress.set(sessionId, {
                    progress: 0,
                    loaded: 0,
                    total: contentLength,
                    status: 'error'
                });
            });
        }
        
        next();
    };

    getProgress() {
        return this.upload_progress;
    }
}

module.exports = new VideosService();