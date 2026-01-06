export const vibrate = (pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
    }
};

export const HAPTIC_Patterns = {
    soft: 10,
    click: 20,
    success: [50, 50, 50],
    warning: [100, 50, 100],
    error: [200, 100, 200],
    drop: [500], // Bass drop
    impulse: 50
};
