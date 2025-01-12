import type { FormattedDonation, Total } from '@gdq/types/tracker';
import { ChannelProps, registerChannel } from '../channels';

import { useListenFor, useReplicant } from 'use-nodecg';
import styled from '@emotion/styled';
import TweenNumber from '@gdq/lib/components/TweenNumber';
import Game from "./classes/Game";
import { usePIXICanvas } from '@gdq/lib/hooks/usePIXICanvas';
import { useEffect, useRef } from 'react';
import { debug } from 'console';
import { useRafCapped } from '@gdq/lib/hooks/useRafCapped';

registerChannel('Gradius', 30, Gradius, {
	position: 'bottomLeft',
	site: 'GitHub',
	handle: 'ViMaSter',
});

export function Gradius(props: ChannelProps) {
	const [total] = useReplicant<Total | null>('total', null);
	
	const game = useRef(new Game(1092, 332));
	
    const canvasRef = useRef<HTMLCanvasElement>(null);
	let gameStarted = false;

	useRafCapped(() => {
		const ctx = canvasRef.current!.getContext('2d')!;
		ctx.clearRect(0, 0, 1092, 332);
		game.current.update();
		game.current.draw(ctx);
	});

	// when canvas becomes available, initialize the game
	useEffect(() => {
		if (canvasRef.current) {
			if (gameStarted) return;
			gameStarted = true;
		}
	}, [canvasRef.current]);

	useListenFor('donation', () => {
		game.current.addEnemy();
	});

	return (
		<Container>
			<Canvas ref={canvasRef} width={1092} height={332} />
		</Container>
	);
}

const Canvas = styled.canvas`
	position: absolute;
	width: 100% !important;
	height: 100% !important;
`;

const Container = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	padding: 0;
	margin: 0;
`;


