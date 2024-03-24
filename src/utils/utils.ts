
function getTimeRoundToMinuteString(date: Date) {
    let h = date.getHours().toString();
    while(h.length < 2) {
        h = '0' + h;
    }
    let m = date.getMinutes().toString();
    while(m.length < 2) {
        m = '0' + m;
    }
    return `${h}:${m}`
}

export function formatDate(secondTimeMill: number) {
    const date = new Date(secondTimeMill * 1000);
    const nowDate = new Date();

    if (
        date.getFullYear() == nowDate.getFullYear() &&
        date.getMonth() == nowDate.getMonth() &&
        date.getDay() == nowDate.getDay()
    ) {
        return `${date.getHours()}:${date.getMinutes()}`;
    }

    nowDate.setDate(nowDate.getDate() - 1);

    if (
        date.getFullYear() == nowDate.getFullYear() &&
        date.getMonth() == nowDate.getMonth() &&
        date.getDay() == nowDate.getDay()
    ) {
        return `昨天 ${getTimeRoundToMinuteString(date)}`;
    }

    return `${date.getMonth()}月${date.getDay()}日 ${getTimeRoundToMinuteString(date)}`;
}