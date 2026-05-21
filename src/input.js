import state from './state.js';

export function setupInput() {
    document.addEventListener('keydown', function (e) {
        switch (e.key) {
            case 'ArrowUp': case 'w': case 'W':
                if (state.direction.y !== 1) state.nextDirection = { x: 0, y: -1 };
                break;
            case 'ArrowDown': case 's': case 'S':
                if (state.direction.y !== -1) state.nextDirection = { x: 0, y: 1 };
                break;
            case 'ArrowLeft': case 'a': case 'A':
                if (state.direction.x !== 1) state.nextDirection = { x: -1, y: 0 };
                break;
            case 'ArrowRight': case 'd': case 'D':
                if (state.direction.x !== -1) state.nextDirection = { x: 1, y: 0 };
                break;
        }
    });
}
