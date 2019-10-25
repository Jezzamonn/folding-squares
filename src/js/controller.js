import { to2dIsometric, getRotationMatrix, columnVecToPoint, rotatePoint } from "./isometric";
import { loop, easeInOut, slurp, gray } from './util';
export default class Controller {

	constructor() {
		this.animAmt = 0;
		this.period = 5;

		this.xzAngle = Math.PI / 12;
		this.yAngle = Math.PI / 6;
	}

	get flipped() {
		return this.animAmt >= 0.5;
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
		const tileSize = 100;
		const numTiles = 15;
		const totalSize = numTiles * tileSize;
		// Halving total size is to account for the fact that it's the width
		// from zero, and we're centered around zero.
		const furthestPosition = totalSize / 2 - tileSize / 2;
		for (let ix = 0; ix < numTiles; ix++) {
			const xAmt = numTiles == 0 ? 0 : ix / (numTiles - 1);
			const x = slurp(-furthestPosition, furthestPosition, xAmt);
			for (let iz = 0; iz < numTiles; iz++) {
				const zAmt = numTiles == 0 ? 0 : iz / (numTiles - 1);
				const z = slurp(-furthestPosition, furthestPosition, zAmt);

				this.drawShape(context, {x, y: 0, z});
			}
		}
	}

	/**
	 * @param {!CanvasRenderingContext2D} context
	 */
	drawShape(context, position) {
		const dist = Math.sqrt(position.x * position.x + position.z * position.z);
		const size = 100;
		const hSize = size / 2;
		const qSize = size / 4;
	
		const numSides = 4;
		for (let i = 0; i < numSides; i++) {
			const getMidpoint = (animAmt) => {
				const moveAngle = -Math.PI * easeInOut(loop(animAmt), 2);
				const moveXAmt = Math.cos(moveAngle);
				const moveYAmt = Math.sin(moveAngle);
				return {
					x: qSize + qSize * moveXAmt,
					y: qSize * moveYAmt,
					z: qSize + qSize * moveXAmt
				}
			};
			const initialMidpoint = getMidpoint(this.animAmt);
			const angle = Math.PI + 2 * Math.PI * (i / numSides);
			const rotationMatrix = getRotationMatrix(angle, 0);
			const points = [
				{x: hSize, y: 0, z: 0},
				initialMidpoint,
				{x: 0, y: 0, z: hSize},
			]
			.map(p => rotatePoint(p, rotationMatrix))
			.map(p => ({x: p.x + position.x, y: p.y + position.y, z: p.z + position.z}));

			context.strokeStyle = 'black';
			context.fillStyle = gray(slurp(1, 0.9, -points[1].y / qSize))
			context.lineCap = 'round';
			context.lineJoin = 'round';
			context.lineWidth = 1;
			context.beginPath();
			for (let j = 0; j < points.length; j++) {
				const point = points[j];
				if (j == 0) {
					this.moveTo3d(context, point);
				}
				else {
					this.lineTo3d(context, point);
				}
				context.fill();
				context.stroke();
			}
		}
	}

	moveTo3d(context, point) {
		const point2d = to2dIsometric(point.x, point.y, point.z, this.xzAngle, this.yAngle);
		context.moveTo(point2d.x, point2d.y);
	}

	lineTo3d(context, point){
		const point2d = to2dIsometric(point.x, point.y, point.z, this.xzAngle, this.yAngle);
		context.lineTo(point2d.x, point2d.y);
	}

}
