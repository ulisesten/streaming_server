require('dotenv').config();

class BaseConfig {
    DB_USER = process.env.DB_USER
    DB_PASSWORD = process.env.DB_PASSWORD
    DB_SERVER = process.env.DB_SERVER
    DB_DATABASE = process.env.DB_DATABASE
    DB_ENCRYPT = true
    DB_TRUST_CERTIFICATE = true
}

class Settings extends BaseConfig {
    BACKEND_CORS_ORIGINS = process.env.BACKEND_CORS_ORIGINS
    SERVER_HOST = process.env.SERVER_HOST
    SERVER_PORT = process.env.SERVER_PORT
    SECRET_KEY  = process.env.SECRET_KEY
    API_NAS     = process.env.API_NAS
    PUBLIC_ID_LENGTH = process.env.PUBLIC_ID_LENGTH
    

    getDatabaseConfig() {
        return {
            user: this.DB_USER,
            password: this.DB_PASSWORD,
            server: this.DB_SERVER,
            database: this.DB_DATABASE,
            options: {
                encrypt: process.env.DB_ENCRYPT === 'false',
                trustServerCertificate: process.env.DB_TRUST_CERTIFICATE === 'false'
            }

        }
    }

    getSecretKey() {
        return this.SECRET_KEY;
    }

    getCredentials() {
        return {
            usu_id: process.env.USU_ID,
            usu_correo: process.env.USU_CORREO,
            usu_nombre: process.env.USU_NOMBRE
        }
    }

    getExpirationDays() {
        return process.env.EXPIRATION_DAYS;
    }

    getCors() {
        return this.BACKEND_CORS_ORIGINS;
    }

    getApiNAS() {
        return this.API_NAS;
    }

    getPublicIdLength(){
        return  this.PUBLIC_ID_LENGTH;
    }
}

module.exports = new Settings();