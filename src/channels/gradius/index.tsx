import type { FormattedDonation, Total } from '@gdq/types/tracker';
import { ChannelProps, registerChannel } from '../channels';

import { useListenFor, useReplicant } from 'use-nodecg';
import styled from '@emotion/styled';
import TweenNumber from '@gdq/lib/components/TweenNumber';
import Game from "./classes/Game";
import { usePIXICanvas } from '@gdq/lib/hooks/usePIXICanvas';
import { useEffect, useRef } from 'react';
import { debug } from 'console';

registerChannel('Gradius', 30, Gradius, {
	position: 'bottomLeft',
	site: 'GitHub',
	handle: 'ViMaSter',
});

export function Gradius(props: ChannelProps) {
	const [total] = useReplicant<Total | null>('total', null);
	
	const game = new Game(1092, 332);

	const FPS = 45;
	let elapsed: number, end: number;
	let now = Date.now();
	
    const canvasRef = useRef<HTMLCanvasElement>(null);

	function animate() {
		requestAnimationFrame(animate);
		end = Date.now();
		elapsed = end - now;
		if (elapsed > 1000 / FPS) {
			end = now;
			now = Date.now();
			// Main Code here
			const ctx = canvasRef.current!.getContext('2d')!;
			ctx.clearRect(0, 0, 1092, 332);
			game.update();
			game.draw(ctx);
		}
	}

	// when canvas becomes available, initialize the game
	useEffect(() => {
		debugger;
		if (canvasRef.current) {
			animate();
		}
	}, [canvasRef.current]);

	useListenFor('donation', (donation: FormattedDonation) => {
		/**
		 * Respond to a donation.
		 */
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

const TotalEl = styled.div`
	font-family: gdqpixel;
	font-size: 46px;
	color: white;

	position: absolute;

	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
`;
