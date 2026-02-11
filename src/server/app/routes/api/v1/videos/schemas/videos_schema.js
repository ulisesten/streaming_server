
const subir_video_response = {
    type: 'object',
    properties: {
        msg:        { type: 'string' },
        success:    { type: 'boolean' },
        error:      { type: 'integer' },
        data: {
            type: 'object',
            properties: {
                vid_id: { type: 'integer' },
                vid_thumbnail: { type: 'string' }
            }
        }
    }
}