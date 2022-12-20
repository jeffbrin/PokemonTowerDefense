export const normalize = (vector) => { 
    const a = Math.sqrt(vector.x * vector.x + vector.y * vector.y); 
    vector.x = vector.x / a;
    vector.y = vector.y / a;
    return vector 
};

export const distanceBetween = (vector1, vector2) => {
    return Math.sqrt(Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2))
}