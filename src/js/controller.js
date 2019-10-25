import { to2dIsometric, getRotationMatrix, columnVecToPoint, rotatePoint } from "./isometric";

export default class Controller {

	constructor() {
		this.animAmt = 0;
		this.period = 3;

		this.xzAngle = Math.PI / 6;
		this.yAngle = Math.PI / 8;
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
		context.strokeStyle = 'black';
		context.fillStyle = 'black';
		context.lineCap = 'round';
		context.lineWidth = 2;
		
		const moveAngle = -Math.PI * this.animAmt;
		const moveXAmt = Math.cos(moveAngle);
		const moveYAmt = Math.sin(moveAngle);
	
		const numSides = 4;
		for (let i = 0; i < numSides; i++) {
			const angle = 2 * Math.PI * (i / numSides);
			const rotationMatrix = getRotationMatrix(angle, 0);
			const points = [
				{x: 100, y: 0, z: 0},
				{
					x: 50 + 50 * moveXAmt,
					y: 50 * moveYAmt,
					z: 50 + 50 * moveXAmt},
				{x: 0, y: 0, z: 100},
			];
			const rotatedPoints = points.map(p => rotatePoint(p, rotationMatrix));

			context.beginPath();
			for (let j = 0; j < rotatedPoints.length; j++) {
				const point = rotatedPoints[j];
				if (j == 0) {
					this.moveTo3d(context, point);
				}
				else {
					this.lineTo3d(context, point);
				}
				// context.closePath();
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
