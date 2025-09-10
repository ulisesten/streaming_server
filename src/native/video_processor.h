#ifndef VIDEO_PROCESSOR_H
#define VIDEO_PROCESSOR_H

#include <napi.h>
#include <string>
extern "C" {
    #include <libavformat/avformat.h>
    #include <libavcodec/avcodec.h>
}

class VideoProcessor {
public:
    VideoProcessor();
    ~VideoProcessor();
    
    bool openFile(const std::string& filename);
    void closeFile();
    bool isOpened() const;
    AVFormatContext* getFormatContext();
    bool convertToHLS(const std::string& inputFile, const std::string& outputDir);
    
private:
    AVFormatContext* formatContext;
    bool fileOpened;

    //const AVOutputFormat* outFmt;
};

#endif // VIDEO_PROCESSOR_H