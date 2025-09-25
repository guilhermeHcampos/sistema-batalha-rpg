"use client"
import { useState, useEffect } from "react";

const partyInicial = [
    { id: 'h1', nome: "Terra", vida: 100, vidaMaxima: 100, spriteUrl: '/sprites/terra.png' },
    { id: 'h2', nome: "Cyan", vida: 100, vidaMaxima: 100, spriteUrl: '/sprites/cyan.png' },
    { id: 'h3', nome: "Locke", vida: 100, vidaMaxima: 100, spriteUrl: '/sprites/locke.png' },
    { id: 'h4', nome: "Setzer", vida: 100, vidaMaxima: 100, spriteUrl: '/sprites/setzer.png' },
];

const vilaoInicial = {
    id: 'v1',
    nome: "Kefka",
    vida: 500,
    vidaMaxima: 500,
    spriteUrl: '/sprites/kefka.gif'
};

export default function useGameManager() {
    const [party, setParty] = useState(partyInicial);
    const [vilao, setVilao] = useState(vilaoInicial);
    const [log, setLog] = useState(["A batalha contra Kefka começou!"]);
    const [turnoDoPlayer, setTurnoDoPlayer] = useState(true);
    const [activeHeroIndex, setActiveHeroIndex] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [mensagemFinal, setMensagemFinal] = useState("");
    const [pocoes, setPocoes] = useState(3);

    useEffect(() => {
        const partyDerrotada = party.every(heroi => heroi.vida <= 0);

        if (vilao.vida <= 0 && !gameOver) {
            setGameOver(true);
            setMensagemFinal("VITÓRIA!");
            adicionarLog("O time venceu a batalha!");
        } else if (partyDerrotada && !gameOver) {
            setGameOver(true);
            setMensagemFinal("DERROTA!");
            adicionarLog("O time foi derrotado!");
        }
    }, [party, vilao.vida, gameOver]);

    const adicionarLog = (mensagem) => {
        setLog(prev => [mensagem, ...prev]);
    };

    const turnoDoVilao = () => {
        if (gameOver) return;
        const alvosVivos = party.filter(heroi => heroi.vida > 0);
        if (alvosVivos.length === 0) return;

        const alvo = alvosVivos[Math.floor(Math.random() * alvosVivos.length)];
        const dano = 15;

        adicionarLog(`É a vez de Kefka!`);
        adicionarLog(`Kefka ataca ${alvo.nome} e causa ${dano} de dano!`);

        setParty(prevParty => prevParty.map(heroi =>
            heroi.id === alvo.id ? { ...heroi, vida: Math.max(0, heroi.vida - dano) } : heroi
        ));

        const primeiroHeroiVivo = party.findIndex(h => h.vida > 0);
        setActiveHeroIndex(primeiroHeroiVivo !== -1 ? primeiroHeroiVivo : 0);
        setTurnoDoPlayer(true);
    };

    const proximoTurno = () => {
        const proximoHeroiVivoIndex = party.findIndex((h, i) => i > activeHeroIndex && h.vida > 0);

        if (proximoHeroiVivoIndex !== -1) {
            setActiveHeroIndex(proximoHeroiVivoIndex);
        } else {
            setTurnoDoPlayer(false);
            setTimeout(turnoDoVilao, 1500);
        }
    };

    const handlerAcaoHeroi = (acao) => {
        if (!turnoDoPlayer || gameOver) return;

        const heroiAtual = party[activeHeroIndex];
        if (heroiAtual.vida <= 0) {
            proximoTurno();
            return;
        }

        switch (acao) {
            case 'atacar': {
                const dano = 20;
                adicionarLog(`${heroiAtual.nome} ataca Kefka e causa ${dano} de dano.`);
                setVilao(prev => ({ ...prev, vida: Math.max(0, prev.vida - dano) }));
                break;
            }
            case 'defender': {
                const cura = 10;
                adicionarLog(`${heroiAtual.nome} entra em postura defensiva e recupera ${cura} de HP.`);
                setParty(party.map(h =>
                    h.id === heroiAtual.id ? { ...h, vida: Math.min(h.vidaMaxima, h.vida + cura) } : h
                ));
                break;
            }
            case 'usarPocao': {
                if (pocoes > 0) {
                    const cura = 50;
                    adicionarLog(`${heroiAtual.nome} usa uma poção e recupera ${cura} de HP.`);
                    setParty(party.map(h =>
                        h.id === heroiAtual.id ? { ...h, vida: Math.min(h.vidaMaxima, h.vida + cura) } : h
                    ));
                    setPocoes(prev => prev - 1);
                } else {
                    adicionarLog("Não há mais poções!");
                    return;
                }
                break;
            }
        }

        proximoTurno();
    };

    return {
        party,
        vilao,
        log,
        turnoDoPlayer,
        activeHeroIndex,
        handlerAcaoHeroi,
        gameOver,
        mensagemFinal,
        pocoes
    };
}