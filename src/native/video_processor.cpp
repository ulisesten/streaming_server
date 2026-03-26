#include "video_processor.h"
#include <iostream>
#include <filesystem>

VideoProcessor::VideoProcessor() : formatContext(nullptr), fileOpened(false) {
    avformat_network_init();
}

VideoProcessor::~VideoProcessor() {
    closeFile();
    avformat_network_deinit();
}

bool VideoProcessor::openFile(const std::string& filename) {
    if (fileOpened) {
        closeFile();
    }
    
    int ret = avformat_open_input(&formatContext, filename.c_str(), nullptr, nullptr);
    if (ret < 0) {
        std::cerr << "Error opening file: " << filename << std::endl;
        return false;
    }
    
    ret = avformat_find_stream_info(formatContext, nullptr);
    if (ret < 0) {
        std::cerr << "Error finding stream info" << std::endl;
        avformat_close_input(&formatContext);
        return false;
    }
    
    fileOpened = true;
    return true;
}

void VideoProcessor::closeFile() {
    if (formatContext) {
        avformat_close_input(&formatContext);
        formatContext = nullptr;
    }
    fileOpened = false;
}

bool VideoProcessor::isOpened() const {
    return fileOpened;
}

AVFormatContext* VideoProcessor::getFormatContext() {
    return formatContext;
}

bool VideoProcessor::convertToHLS(const std::string& inputFile, const std::string& outputDir) {
    struct FileDeleter {
        std::string path;
        ~FileDeleter() {
            std::error_code ec;
            std::filesystem::remove(path, ec);
            if (ec) {
                std::cerr << "Warning: Could not remove input file " << path << ": " << ec.message() << "\n";
            }
        }
    } deleter{inputFile};

    AVFormatContext* inFmtCtx = nullptr;
    AVFormatContext* outFmtCtx = nullptr;
    const AVOutputFormat* outFmt = nullptr;
    int ret = 0;

    // Asegurar rutas absolutas
    std::filesystem::path outPath = std::filesystem::absolute(outputDir);
    std::string outDirAbs = outPath.string();
    std::string playlistPath = outDirAbs + "/playlist.m3u8";
    std::string segmentPattern = outDirAbs + "/segment-%03d.ts";

    // Crear directorio si hace falta
    try {
        std::filesystem::create_directories(outPath);
    } catch (const std::exception &e) {
        std::cerr << "Failed to create outputDir: " << e.what() << "\n";
        return false;
    }

    std::cerr << "[convertToHLS] input: " << inputFile << "\n";
    std::cerr << "[convertToHLS] outputDir: " << outDirAbs << "\n";
    std::cerr << "[convertToHLS] playlistPath: " << playlistPath << "\n";
    std::cerr << "[convertToHLS] segmentPattern: " << segmentPattern << "\n";

    // Opcional: activar logs FFmpeg (útil para debug)
    av_log_set_level(AV_LOG_INFO);

    // Abrir input
    if ((ret = avformat_open_input(&inFmtCtx, inputFile.c_str(), nullptr, nullptr)) < 0) {
        char errbuf[256]; av_strerror(ret, errbuf, sizeof(errbuf));
        std::cerr << "Error opening input file: " << errbuf << " (" << ret << ")\n";
        return false;
    }
    if ((ret = avformat_find_stream_info(inFmtCtx, nullptr)) < 0) {
        char errbuf[256]; av_strerror(ret, errbuf, sizeof(errbuf));
        std::cerr << "Error finding stream info: " << errbuf << " (" << ret << ")\n";
        avformat_close_input(&inFmtCtx);
        return false;
    }

    // Crear contexto de salida HLS *pasando la playlistPath*
    if ((ret = avformat_alloc_output_context2(&outFmtCtx, nullptr, "hls", playlistPath.c_str())) < 0 || !outFmtCtx) {
        char errbuf[256]; av_strerror(ret, errbuf, sizeof(errbuf));
        std::cerr << "Could not create HLS output context: " << errbuf << " (" << ret << ")\n";
        avformat_close_input(&inFmtCtx);
        return false;
    }
    outFmt = outFmtCtx->oformat;

    // Mapear solo video y audio
    std::vector<int> stream_mapping(inFmtCtx->nb_streams, -1);
    int out_index = 0;
    for (unsigned int i = 0; i < inFmtCtx->nb_streams; i++) {
        AVStream* inStream = inFmtCtx->streams[i];
        if (inStream->codecpar->codec_type != AVMEDIA_TYPE_VIDEO &&
            inStream->codecpar->codec_type != AVMEDIA_TYPE_AUDIO) {
            continue;
        }

        AVStream* outStream = avformat_new_stream(outFmtCtx, nullptr);
        if (!outStream) {
            std::cerr << "Failed to allocate output stream\n";
            avformat_close_input(&inFmtCtx);
            avformat_free_context(outFmtCtx);
            return false;
        }

        if ((ret = avcodec_parameters_copy(outStream->codecpar, inStream->codecpar)) < 0) {
            char errbuf[256]; av_strerror(ret, errbuf, sizeof(errbuf));
            std::cerr << "Failed to copy codec parameters: " << errbuf << " (" << ret << ")\n";
            avformat_close_input(&inFmtCtx);
            avformat_free_context(outFmtCtx);
            return false;
        }

        outStream->codecpar->codec_tag = 0;
        outStream->time_base = inStream->time_base;
        stream_mapping[i] = out_index++;
    }

    // Opciones HLS (SIN temp_file)
    AVDictionary* opts = nullptr;
    av_dict_set(&opts, "hls_time", "4", 0);
    av_dict_set(&opts, "hls_list_size", "0", 0);
    av_dict_set(&opts, "hls_segment_filename", segmentPattern.c_str(), 0);
    av_dict_set(&opts, "hls_flags", "independent_segments", 0);

    // Abrir playlist de salida
    if (!(outFmt->flags & AVFMT_NOFILE)) {
        if ((ret = avio_open(&outFmtCtx->pb, playlistPath.c_str(), AVIO_FLAG_WRITE)) < 0) {
            char errbuf[256]; av_strerror(ret, errbuf, sizeof(errbuf));
            std::cerr << "Could not open output file (" << playlistPath << "): " << errbuf << " (" << ret << ")\n";
            av_dict_free(&opts);
            avformat_close_input(&inFmtCtx);
            avformat_free_context(outFmtCtx);
            return false;
        }
    }

    if ((ret = avformat_write_header(outFmtCtx, &opts)) < 0) {
        char errbuf[256]; av_strerror(ret, errbuf, sizeof(errbuf));
        std::cerr << "Error writing header (avformat_write_header): " << errbuf << " (" << ret << ")\n";
        av_dict_free(&opts);
        if (!(outFmt->flags & AVFMT_NOFILE)) avio_closep(&outFmtCtx->pb);
        avformat_close_input(&inFmtCtx);
        avformat_free_context(outFmtCtx);
        return false;
    }

    // Remux loop
    AVPacket pkt;
    av_init_packet(&pkt);
    while ((ret = av_read_frame(inFmtCtx, &pkt)) >= 0) {
        int in_idx = pkt.stream_index;
        if (in_idx < 0 || in_idx >= (int)inFmtCtx->nb_streams) { av_packet_unref(&pkt); continue; }
        int out_idx = stream_mapping[in_idx];
        if (out_idx < 0) { av_packet_unref(&pkt); continue; }

        AVStream* inStream  = inFmtCtx->streams[in_idx];
        AVStream* outStream = outFmtCtx->streams[out_idx];

        av_packet_rescale_ts(&pkt, inStream->time_base, outStream->time_base);
        pkt.stream_index = out_idx;

        ret = av_interleaved_write_frame(outFmtCtx, &pkt);
        av_packet_unref(&pkt);
        if (ret < 0) {
            char errbuf[256]; av_strerror(ret, errbuf, sizeof(errbuf));
            std::cerr << "Error writing frame: " << errbuf << " (" << ret << ")\n";
            break;
        }
    }

    av_write_trailer(outFmtCtx);

    av_dict_free(&opts);
    if (!(outFmt->flags & AVFMT_NOFILE)) avio_closep(&outFmtCtx->pb);
    avformat_close_input(&inFmtCtx);
    avformat_free_context(outFmtCtx);

    return (ret == AVERROR_EOF || ret >= 0);
}