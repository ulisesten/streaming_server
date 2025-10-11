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

class HLSWorker : public Napi::AsyncWorker {
public:
    HLSWorker(const std::string& input, const std::string& output, Napi::Function& cb)
        : Napi::AsyncWorker(cb), inputFile(input), outputDir(output), success(false) {}

    // Se ejecuta en un thread separado
    void Execute() override {
        VideoProcessor processor;
        success = processor.convertToHLS(inputFile, outputDir);
        if (!success) {
            SetError("Error processing video to HLS");
        }
    }

    // Se ejecuta en el hilo principal al terminar (éxito)
    void OnOK() override {
        Napi::HandleScope scope(Env());
        Callback().Call({Env().Null(), Napi::Boolean::New(Env(), success)});
    }

    // Se ejecuta en el hilo principal si hubo error
    void OnError(const Napi::Error& e) override {
        Napi::HandleScope scope(Env());
        Callback().Call({e.Value(), Env().Undefined()});
    }

private:
    std::string inputFile;
    std::string outputDir;
    bool success;
};

// Función expuesta a Node.js
Napi::Value ConvertToHLSAsync(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 3) {
        Napi::TypeError::New(env, "Expected 3 arguments (inputFile, outputDir, callback)").ThrowAsJavaScriptException();
        return env.Null();
    }

    std::string inputFile = info[0].As<Napi::String>();
    std::string outputDir = info[1].As<Napi::String>();
    Napi::Function cb = info[2].As<Napi::Function>();

    HLSWorker* worker = new HLSWorker(inputFile, outputDir, cb);
    worker->Queue(); // se encola para ejecutarse en un worker thread

    return env.Undefined();
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "getVideoInfo"), 
                Napi::Function::New(env, GetVideoInfo));
    exports.Set(Napi::String::New(env, "convertToHLS"),
                Napi::Function::New(env, ConvertToHLS));
    exports.Set(Napi::String::New(env, "convertToHLSAsync"),
                Napi::Function::New(env, ConvertToHLSAsync));
    return exports;
}

NODE_API_MODULE(video_streamer, Init)