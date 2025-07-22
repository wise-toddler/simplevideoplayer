import React, { useState, useEffect } from 'react';
import { useVideoContext } from '../VideoContextProvider/VideoContextProvider';

type AudioTrackSelectorProps = {
    video: HTMLVideoElement | null;
};

function AudioTrackSelector({ video }: AudioTrackSelectorProps) {
    const { setSelectedVideo, selectedAudioTrack } = useVideoContext();
    const [audioTracks, setAudioTracks] = useState<AudioTrackList | null>(null);

    useEffect(() => {
        if (!video) return;

        const handleLoadedMetadata = () => {
            if (video.audioTracks && video.audioTracks.length > 1) {
                setAudioTracks(video.audioTracks);
            }
        };

        if (video.readyState >= 1) {
            handleLoadedMetadata();
        } else {
            video.addEventListener('loadedmetadata', handleLoadedMetadata);
        }

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, [video]);

    const handleAudioTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const trackIndex = parseInt(e.target.value);
        
        if (audioTracks) {
            // Disable all tracks
            for (let i = 0; i < audioTracks.length; i++) {
                audioTracks[i].enabled = false;
            }
            // Enable selected track
            if (audioTracks[trackIndex]) {
                audioTracks[trackIndex].enabled = true;
            }
        }

        setSelectedVideo((prev) => ({
            ...prev,
            selectedAudioTrack: trackIndex,
        }));
    };

    if (!audioTracks || audioTracks.length <= 1) {
        return null;
    }

    return (
        <div className="audio-track-selector">
            <label htmlFor="audio-track-select" className="text-white text-sm">
                Audio Track:
            </label>
            <select
                id="audio-track-select"
                value={selectedAudioTrack}
                onChange={handleAudioTrackChange}
                className="ml-2 bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 text-sm"
            >
                {Array.from(audioTracks).map((track, index) => (
                    <option key={index} value={index}>
                        {track.label || `Track ${index + 1}`}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default AudioTrackSelector;