export const isPointInObject = (x, y, object) => {
                                                return x >= object.position.x
                                                && x <= object.position.x + object.dimensions.x
                                                && y >= object.position.y
                                                && y <= object.position.y + object.dimensions.y;
}