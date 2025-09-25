"use client";
import { useState, useRef, useEffect } from 'react';
import styles from '@/app/page.module.css';

export default function AudioPlayer({ src }) {
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("A reprodução automática foi impedida pelo navegador. A música começará após a primeira interação do usuário.");
                });
            }
        }
    }, []);

    // Função chamada sempre que o usuário arrasta a barra de volume
    const handleVolumeChange = (event) => {
        const newVolume = event.target.value;
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    return (
        <div className={styles.audioPlayerContainer}>
            <audio ref={audioRef} src={src} loop />

            <span style={{ fontSize: '20px' }}>🔊</span>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className={styles.volumeSlider}
            />
        </div>
    );
}