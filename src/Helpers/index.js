export const ownerName = (owner) => owner.type === 'particulier' ? `${owner.first_name} ${owner.last_name}` : `${owner.company}`;
export const mouseOver = (hoverState) => hoverState ? document.body.style.cursor = 'pointer' : document.body.style.cursor = 'default';
export const formatDate = (date) => {
    if (!date) return '';
    const {day, month, year} = getSplittedDate(date);
    return `${day}/${month}/${year}`;
};
export const formatDateMDY = (date) => {
    if (!date) return '';
    const {day, month, year} = getSplittedDate(date);
    return `${month}/${day}/${year}`;
};
export const sum = (a, b) => a + b;

const getSplittedDate = (date) => {
    date = new Date(date);
    if (isNaN(date.getDate())) {
        throw new Error("Invalid Date");
    }
    const day = `${date.getDate()}`.padStart(2, '0');
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const year = date.getFullYear();
    return {day, month, year};
}