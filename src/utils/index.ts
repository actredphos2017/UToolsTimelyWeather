export async function nextFrame() {
    return new Promise<void>((r) => {
        requestAnimationFrame(() => {
            r();
        });
    });
}