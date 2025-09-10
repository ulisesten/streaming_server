{
  "targets": [
    {
      "target_name": "video_streamer",
      "sources": [
        "src/native/streaming_module.cpp",
        "src/native/video_processor.cpp"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "cflags!": ["-fno-exceptions"],
      "cflags_cc!": ["-fno-exceptions"],
      "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS", "NAPI_VERSION=6"],
      "conditions": [
        ['OS=="linux"', {
          "cflags": [
            "<!@(pkg-config --cflags libavformat libavcodec libavutil)"
          ],
          "libraries": [
            "-lavformat",
            "-lavcodec",
            "-lavutil",
            "-lswresample",
            "-lswscale",
            "-lm",
            "-lz",
            "-pthread"
          ]
        }]
      ]
}]}