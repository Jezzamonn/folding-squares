import { to2dIsometric } from "./isometric";

export default class Controller {

	constructor() {
		this.animAmt = 0;
		this.period = 3;

		const points = [];
		for (const x of [-1, 1]) {
			for (const y of [-1, 1]) {
				for (const z of [-1, 1]) {
					points.push({x, y, z});
				}
			}
		}

		this.lines = [];
		for (let i = 0; i < points.length; i++) {
			const p1 = points[i];
			for (let j = i + 1; j < points.length; j++) {
				const p2 = points[j];

				const diff = Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y) + Math.abs(p1.z - p2.z);
				if (diff === 2) {
					this.lines.push([p1, p2]);
				}
			}
		}
	}

	/**
	 * Simulate time passing.
	 *
	 * @param {number} dt Time since the last frame, in seconds 
	 */
	update(dt) {
		this.animAmt += dt / this.period;
		this.animAmt %= 1;
	}

	/**
	 * Render the current state of the controller.
	 *
	 * @param {!CanvasRenderingContext2D} context
	 */
	render(context) {
		context.beginPath();
		context.strokeStyle = 'black';
		context.lineCap = 'round';
		context.scale(100, 100);

		for (const [p1, p2] of this.lines) {
			const p1_2d = to2dIsometric(p1.x, p1.y, p1.z);
			const p2_2d = to2dIsometric(p2.x, p2.y, p2.z);
			context.moveTo(p1_2d.x, p1_2d.y);
			context.lineTo(p2_2d.x, p2_2d.y);
		}
		context.stroke();
	}

}
