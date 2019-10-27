import { to2dIsometric, getRotationMatrix, columnVecToPoint, rotatePoint } from "./isometric";
import { loop, easeInOut, slurp, gray } from './util';
export default class Controller {

	constructor() {
		this.animAmt = 0;
		this.period = 5;

		this.xzAngle = Math.PI / 4;
		this.yAngle = Math.PI / 4;
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
		const numTiles = 11;
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
		const startDistAmt = getDistAmt(position);
		const size = 100;
		const hSize = size / 2;
		const qSize = size / 4;

		const localAnimAmt = loop(this.animAmt - startDistAmt);
	
		context.strokeStyle = 'black';
		context.fillStyle = 'white';
		context.lineCap = 'round';
		context.lineJoin = 'round';
		context.lineWidth = 1;

		const height = -hSize * localAnimAmt;

		{
			const points = [
				{x: hSize, y: height, z: hSize},
				{x: hSize, y: height, z: -hSize},
				{x: -hSize, y: height, z: -hSize},
				{x: -hSize, y: height, z: hSize},
			]
			.map(p => addPoints(p, position));
			context.beginPath();
			this.drawPath(context, points);
			context.fill();
		}

		const numSides = 4;
		for (let i = 0; i < numSides; i++) {
			const angle = Math.PI + 2 * Math.PI * (i / numSides);
			const rotationMatrix = getRotationMatrix(angle, 0);

			// const initialMidpoint = getMidpoint(this.animAmt - 0.4 * startDistAmt);
			// const transformedMidpoint = addPoints(rotatePoint(initialMidpoint, rotationMatrix), position);
			
			// const distAmt = getDistAmt(transformedMidpoint);
			
			const points = [
				{
					x: hSize, 
					y: height, 
					z: 0,
				},{
					x: hSize, 
					y: height, 
					z: hSize,
				},{
					x: 0, 
					y: height, 
					z: hSize,
				},
			]
			.map(p => rotatePoint(p, rotationMatrix))
			.map(p => addPoints(p, position));

			context.beginPath();
			this.drawPath(context, points);
			context.fill();
			context.stroke();
		}

		for (let i = 2; i < 4; i++) {
			const angle = Math.PI + 2 * Math.PI * (i / numSides);
			const rotationMatrix = getRotationMatrix(angle, 0);

			const points = [
				{x: hSize, y: 0, z:hSize},
				{x: hSize, y: height, z:hSize},
				{x: hSize, y: height, z:-hSize},
				{x: hSize, y: 0, z:-hSize},
			]
			.map(p => rotatePoint(p, rotationMatrix))
			.map(p => addPoints(p, position));

			context.beginPath();
			this.drawPath(context, points);
			context.fill();
			context.stroke();
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

	drawPath(context, points) {
		for (let j = 0; j < points.length; j++) {
			const point = points[j];
			if (j == 0) {
				this.moveTo3d(context, point);
			}
			else {
				this.lineTo3d(context, point);
			}
		}

	}

}

function getDistAmt(p) {
	return Math.sqrt(p.x * p.x + p.z * p.z) / 1000;
}

function addPoints(p1, p2) {
	return {
		x: p1.x + p2.x,
		y: p1.y + p2.y,
		z: p1.z + p2.z,
	}
}
