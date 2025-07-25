import {ElMessage} from "element-plus";

export async function nextFrame() {
    return new Promise<void>((r) => {
        requestAnimationFrame(() => {
            r();
        });
    });
}

export async function copyToClip(text: string, message?: string) {
    await navigator.clipboard.writeText(text);
    if (message) {
        ElMessage.success(message);
    }
}

export async function cpy(href: string) {
    await copyToClip(href, "已将复制链接")
}