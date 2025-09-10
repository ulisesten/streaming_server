#include <napi.h>
#include "video_processor.h"
#include <thread>
#include <atomic>
#include <vector>
#include <string>

namespace {
    std::atomic<bool> streamingActive{false};
    VideoProcessor videoProcessor;
    Napi::ThreadSafeFunction tsfn;
    std::thread streamingThread;
}

// Estructura para pasar datos al callback
struct StreamData {
    std::string chunk;
};

Napi::Value StartStreaming(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    if (info.Length() < 2) {
        Napi::TypeError::New(env, "Se esperaban 2 argumentos: filename y callback").ThrowAsJavaScriptException();
        return env.Null();
    }
    
    if (!info[0].IsString()) {
        Napi::TypeError::New(env, "El primer argumento debe ser un string").ThrowAsJavaScriptException();
        return env.Null();
    }
    
    if (!info[1].IsFunction()) {
        Napi::TypeError::New(env, "El segundo argumento debe ser una función").ThrowAsJavaScriptException();
        return env.Null();
    }
    
    std::string filename = info[0].As<Napi::String>().Utf8Value();
    Napi::Function callback = info[1].As<Napi::Function>();
    
    if (streamingActive) {
        return Napi::Boolean::New(env, false);
    }
    
    if (!videoProcessor.openFile(filename)) {
        return Napi::Boolean::New(env, false);
    }
    
    streamingActive = true;
    
    // Crear ThreadSafeFunction
    tsfn = Napi::ThreadSafeFunction::New(
        env,
        callback,
        "Streaming Callback",
        0,  // Unlimited queue
        1   // Initial thread count
    );
    
    streamingThread = std::thread([filename]() {
        auto callback = [](Napi::Env env, Napi::Function jsCallback, StreamData* data) {
            // Convertir el chunk a Buffer de Node.js
            Napi::Buffer<char> buffer = Napi::Buffer<char>::Copy(env, data->chunk.data(), data->chunk.size());
            jsCallback.Call({buffer});
            delete data; // Liberar memoria
        };
        
        // Simulamos el streaming enviando datos en chunks
        for (int i = 0; i < 100 && streamingActive; ++i) {
            // Crear datos para el callback
            StreamData* data = new StreamData();
            data->chunk = "Chunk " + std::to_string(i) + " from " + filename + " - tamaño: " + std::to_string(1024 + i * 100) + " bytes";
            
            // Llamar al callback de manera segura
            napi_status status = tsfn.BlockingCall(data, callback);
            
            if (status != napi_ok) {
                delete data;
                break;
            }
            
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
        }
        
        tsfn.Release();
        streamingActive = false;
    });
    
    return Napi::Boolean::New(env, true);
}

Napi::Value StopStreaming(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    streamingActive = false;
    if (streamingThread.joinable()) {
        streamingThread.join();
    }
    
    videoProcessor.closeFile();
    
    return Napi::Boolean::New(env, true);
}

Napi::Value GetVideoInfo(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, "Se esperaba un string con el nombre del archivo").ThrowAsJavaScriptException();
        return env.Null();
    }
    
    std::string filename = info[0].As<Napi::String>().Utf8Value();
    
    if (!videoProcessor.openFile(filename)) {
        return env.Null();
    }
    
    AVFormatContext* fmt_ctx = videoProcessor.getFormatContext();
    
    Napi::Object videoInfo = Napi::Object::New(env);
    videoInfo.Set("duration", Napi::Number::New(env, fmt_ctx->duration / 1000000.0)); // segundos
    videoInfo.Set("bit_rate", Napi::Number::New(env, fmt_ctx->bit_rate));
    videoInfo.Set("streams", Napi::Number::New(env, fmt_ctx->nb_streams));
    
    videoProcessor.closeFile();
    
    return videoInfo;
}

Napi::Value ConvertToHLS(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 2) {
        Napi::TypeError::New(env, "Expected inputFile and outputDir").ThrowAsJavaScriptException();
        return env.Null();
    }

    std::string inputFile = info[0].As<Napi::String>().Utf8Value();
    std::string outputDir = info[1].As<Napi::String>().Utf8Value();

    VideoProcessor vp;
    bool success = vp.convertToHLS(inputFile, outputDir);

    return Napi::Boolean::New(env, success);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "startStreaming"), 
                Napi::Function::New(env, StartStreaming));
    exports.Set(Napi::String::New(env, "stopStreaming"), 
                Napi::Function::New(env, StopStreaming));
    exports.Set(Napi::String::New(env, "getVideoInfo"), 
                Napi::Function::New(env, GetVideoInfo));
    exports.Set(Napi::String::New(env, "convertToHLS"),
                Napi::Function::New(env, ConvertToHLS));
    return exports;
}

NODE_API_MODULE(video_streamer, Init)