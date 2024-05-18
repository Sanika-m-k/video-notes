import React, { useRef } from 'react';
import VideoPlayer from './components/VideoPlayer';
import Notes from './components/Notes';

const App = () => {
    const videoId = '9bZkp7q19f0'; 
    const playerRef = useRef(null);

    const onPlayerReady = (event) => {
        const player = event.target;
        playerRef.current = player;
    };

    return (
        <div className="container px-12 w-full my-4">
            <h1 className="text-2xl font-bold mb-4">Video Player with Notes</h1>
            <VideoPlayer videoId={videoId} onReady={onPlayerReady}  playerRef={playerRef}/>
            <Notes videoId={videoId} playerRef={playerRef} />
        </div>
    );
};

export default App;
