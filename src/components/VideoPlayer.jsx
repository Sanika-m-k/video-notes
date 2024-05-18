import React from 'react';
import YouTube from 'react-youtube';

const VideoPlayer = ({ videoId, onReady,playerRef }) => {
    console.log(playerRef.current)
    const opts = {
        height: '774',
        width: '1376',
        playerVars: {
            autoplay: 0,
            controls: 1,
            showinfo: 0,
            modestbranding:0,
            rel: 0,
            fs: 0,
            iv_load_policy: 3,
            disablekb: 0,
        },
    };

    return (
        <div className=" justify-center">
            <YouTube videoId={videoId} opts={opts} onReady={onReady} className="w-full flex justify-center" style={{ height: 'auto', width: '100%' }}/>
            <div className='relative'>
            <h1 className="text-xl font-bold font-inter pt-4">Video title goes here</h1>
            <div className='text-gray-600 mt-1'>This is the description of the video.</div>
            </div>
        </div>
    );
};

export default VideoPlayer;
