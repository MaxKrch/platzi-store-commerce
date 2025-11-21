export type CalculatePositionArgs = {
    anchor: HTMLElement;
    popup: HTMLElement;
    container?: HTMLElement | null;
}

export type CalculatePositionResult = {
    left: number;
    top: number;
    width: number;
    height: number;
}

const calculatePosition = ({ anchor, popup, container }: CalculatePositionArgs): CalculatePositionResult => {
    const position: CalculatePositionResult = {
        top: 0,
        left: 0,
        width: 0,
        height: 0
    };
    const anchorCoords = anchor.getBoundingClientRect();
    const { width, height } = popup.getBoundingClientRect();
    
    position.width = width;
    position.height = height;
    
    const containerCoords = container ? container.getBoundingClientRect() : null;
    
    const topSpace = containerCoords ? containerCoords.top - anchorCoords.top : anchorCoords.top;
    const bottomSpace = containerCoords ? containerCoords.bottom - anchorCoords.bottom : window.innerHeight - anchorCoords.bottom;
    const leftSpace = containerCoords ? anchorCoords.left - containerCoords.left : anchorCoords.left;
    const rightSpace = containerCoords ? containerCoords.right - anchorCoords.right : window.innerWidth - anchorCoords.right;

    if(bottomSpace < height && topSpace >= height) {
        position.top = anchorCoords.top + height + window.scrollY;
    } else {
        position.top = anchorCoords.bottom + window.scrollY;
    }

    if(rightSpace < width && leftSpace >= width) {
        position.left = anchorCoords.right - width;
    } else {
        position.left = anchorCoords.left;
    }

    return position;
};

export default calculatePosition;