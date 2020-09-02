export const ownerName = (owner) => owner.type === 'particulier' ? `${ owner.first_name } ${ owner.last_name }` : `${ owner.company }`;
export const mouseOver = (hoverState) => hoverState ? document.body.style.cursor = 'pointer' : document.body.style.cursor = 'default';
export const formatDate = (date) => {
  if (!date) return '';
  date = new Date(date).toISOString().substr(0, 10);
  const [year, month, day] = date.split('-');
  return `${ day }/${ month }/${ year }`;
};