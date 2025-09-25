"use client"
import Image from "next/image";
import styles from "./page.module.css";
import useGameManager from "@/hook/gameManager";
import AudioPlayer from './components/AudioPlayer';

const BarraDeVida = ({ vidaAtual, vidaMaxima }) => {
    const porcentagem = (vidaAtual / vidaMaxima) * 100;
    return (
        <div className={styles.barraVidaContainer}>
            <div
                className={styles.barraVidaFill}
                style={{
                    width: `${porcentagem}%`,
                    backgroundColor: porcentagem > 50 ? '#4caf50' : porcentagem > 20 ? '#ff9800' : '#f44336',
                }}
            ></div>
        </div>
    );
};

const PainelHeroi = ({ heroi, isActive }) => (
    <div className={`${styles.painelHeroi} ${isActive ? styles.active : ''}`}>
        <div className={styles.infoHeroi}>
            <span>{heroi.nome}</span>
            <BarraDeVida vidaAtual={heroi.vida} vidaMaxima={heroi.vidaMaxima} />
            <span>HP: {heroi.vida} / {heroi.vidaMaxima}</span>
        </div>
        <Image src={heroi.spriteUrl} alt={heroi.nome} width={64} height={64} unoptimized />
    </div>
);

const PainelVilao = ({ vilao }) => (
    <div className={styles.painelVilao}>
        <Image src={vilao.spriteUrl} alt={vilao.nome} width={384} height={384} unoptimized />
        <div className={styles.infoVilao}>
            <span>{vilao.nome}</span>
            <BarraDeVida vidaAtual={vilao.vida} vidaMaxima={vilao.vidaMaxima} />
            <span>HP: {vilao.vida} / {vilao.vidaMaxima}</span>
        </div>
    </div>
);

export default function Home() {
    const {
        party,
        vilao,
        log,
        turnoDoPlayer,
        activeHeroIndex,
        handlerAcaoHeroi,
        gameOver,
        mensagemFinal,
        pocoes // Pega a contagem de poções do hook
    } = useGameManager();

    return (
        <div className={styles.page}>
            <AudioPlayer src="/audio/battle_music.mp3" />

            <main className={`${styles.main} ${styles.telaBatalha}`}>
                <div className={styles.areaVilao}>
                    <PainelVilao vilao={vilao} />
                </div>
                <div className={styles.areaParty}>
                    {party.map((heroi, index) => (
                        <PainelHeroi key={heroi.id} heroi={heroi} isActive={index === activeHeroIndex && turnoDoPlayer && !gameOver && heroi.vida > 0} />
                    ))}
                </div>
            </main>

            <footer className={styles.hudInferior}>
                <div className={styles.logContainer}>
                    <ol>
                        {log.slice(0, 5).map((mensagem, index) => (
                            <li key={index}>{mensagem}</li>
                        ))}
                    </ol>
                </div>

                {/* --- BOTÕES ATUALIZADOS --- */}
                <div className={styles.ctas}>
                    <button onClick={() => handlerAcaoHeroi('atacar')} disabled={!turnoDoPlayer || gameOver}>
                        Atacar
                    </button>
                    <button onClick={() => handlerAcaoHeroi('defender')} disabled={!turnoDoPlayer || gameOver}>
                        Defender
                    </button>
                    <button onClick={() => handlerAcaoHeroi('usarPocao')} disabled={!turnoDoPlayer || gameOver || pocoes === 0}>
                        Poção ({pocoes})
                    </button>
                </div>
            </footer>

            {gameOver && (
                <div className={styles.telaGameOver}>
                    <h1>{mensagemFinal}</h1>
                </div>
            )}
        </div>
    );
}