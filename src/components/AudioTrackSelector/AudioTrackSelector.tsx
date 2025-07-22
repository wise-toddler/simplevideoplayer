import React, { useState, useEffect } from 'react';
import { useVideoContext } from '../VideoContextProvider/VideoContextProvider';

type AudioTrackSelectorProps = {
    video: HTMLVideoElement | null;
};

type AudioTrack = {
    enabled: boolean;
    label: string;
    language: string;
};

// Extend HTMLVideoElement type to include audioTracks
interface ExtendedHTMLVideoElement extends HTMLVideoElement {
    audioTracks?: {
        length: number;
        [index: number]: AudioTrack & { enabled: boolean };
    };
}

function AudioTrackSelector({ video }: AudioTrackSelectorProps) {
    const { setSelectedVideo, selectedAudioTrack } = useVideoContext();
    const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);

    useEffect(() => {
        if (!video) return;

        const handleLoadedMetadata = () => {
            const extendedVideo = video as ExtendedHTMLVideoElement;
            if (extendedVideo.audioTracks && extendedVideo.audioTracks.length > 1) {
                const tracks: AudioTrack[] = [];
                for (let i = 0; i < extendedVideo.audioTracks.length; i++) {
                    const track = extendedVideo.audioTracks[i];
                    tracks.push({
                        enabled: track.enabled,
                        label: track.label,
                        language: track.language,
                    });
                }
                setAudioTracks(tracks);
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
        const extendedVideo = video as ExtendedHTMLVideoElement;
        
        if (extendedVideo?.audioTracks) {
            // Disable all tracks
            for (let i = 0; i < extendedVideo.audioTracks.length; i++) {
                extendedVideo.audioTracks[i].enabled = false;
            }
            // Enable selected track
            if (extendedVideo.audioTracks[trackIndex]) {
                extendedVideo.audioTracks[trackIndex].enabled = true;
            }
        }

        setSelectedVideo((prev) => ({
            ...prev,
            selectedAudioTrack: trackIndex,
        }));
    };

    if (audioTracks.length <= 1) {
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
                {audioTracks.map((track, index) => (
                    <option key={index} value={index}>
                        {track.label || `Track ${index + 1}`}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default AudioTrackSelector;