export function to2dIsometric(x, y, z, xzAngle=0, yAngle=0) {
    const transformMatrix = getRotationMatrix(xzAngle, yAngle);

    const transformed = matrixMul(transformMatrix, [[x], [y], [z]]);
    // Just return the x and y
    return {x: transformed[0][0], y: transformed[1][0]};
}

export function getRotationMatrix(xzAngle, yAngle) {
    // s/o to wikipedia for these rotation matrices
    const xzRotateMatrix = [
        [Math.cos(xzAngle), 0, -Math.sin(xzAngle)],
        [0, 1, 0],
        [Math.sin(xzAngle), 0, Math.cos(xzAngle)]
    ];
    const yRotateMatrix = [
        [1, 0, 0],
        [0, Math.cos(yAngle), Math.sin(yAngle)],
        [0, -Math.sin(yAngle), Math.cos(yAngle)]
    ];
    return matrixMul(yRotateMatrix, xzRotateMatrix);
}

export function columnVecToPoint(vec) {
	return {x: vec[0][0], y: vec[1][0], z: vec[2][0]}; 
}

export function pointToColumnVec(vec) {
	return [[vec.x], [vec.y], [vec.z]];
}

export function rotatePoint(point, rotationMatrix) {
	return columnVecToPoint(
		matrixMul(
			rotationMatrix,
			pointToColumnVec(point)
		)
	);
}

/**
 * I kinda forgot how matrix multiplication works but I think this is it.
 *
 * @param {Array<Array<number>>} mat1
 * @param {Array<Array<number>>} mat2
 */
export function matrixMul(mat1, mat2) {
	// the order of these is weird because I'm sticking to the x / y thing
	// instead of rows / cols
	const result = zeros(mat2[0].length, mat1.length);
	// each row in the first matrix
	for (let i = 0; i < mat1.length; i++) {
		// each column in the first matrix / each row in the second matrix
		for (let j = 0; j < mat1[0].length; j++) {
			// each column in the second matrix
			for (let k = 0; k < mat2[0].length; k++) {
				result[i][k] += mat1[i][j] * mat2[j][k]
			}
		}
	}
	return result;
}

export function identity(dim) {
	const matrix = [];
	// generate the identity matrix
	for (let i = 0; i < dim; i++) {
		const row = [];
		for (let j = 0; j < dim; j++) {
			row.push(i === j ? 1 : 0);
		}
		matrix.push(row);
	}
	return matrix;
}

/**
 * @param {number} dim1 x-axis. i.e. columns. Maybe backwards from what you'd think
 * @param {number} dim2 y-axis, i.e. Rows.
 */
export function zeros(dim1, dim2) {
	const matrix = [];
	for (let y = 0; y < dim2; y++) {
		const row = [];
		for (let x = 0; x < dim1; x++) {
			row.push(0);
		}
		matrix.push(row);
	}
	return matrix;
}
