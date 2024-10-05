function tetrisPiecesStyling(pieze) {
    switch(pieze) {
        case 'square':
            return { fill: '#FF3131', stroke: '#4a4a4a', strokeWidth: 2 };
        case 'snake':
            return { fill: '#00FFFF', stroke: '#4a4a4a', strokeWidth: 2 };
        case 'snakeInverse':
            return { fill: '#FFFF00', stroke: '#4a4a4a', strokeWidth: 2 };
        case 'stick':
            return { fill: '#FF00FF', stroke: '#4a4a4a', strokeWidth: 2 };
        case 'elle':
            return { fill: '#39FF14', stroke: '#4a4a4a', strokeWidth: 2 };
        case 'elleInverse':
            return { fill: '#FF6600', stroke: '#4a4a4a', strokeWidth: 2 };
        case 'tee':
            return { fill: '#FF69B4', stroke: '#4a4a4a', strokeWidth: 2 };
    }
}
