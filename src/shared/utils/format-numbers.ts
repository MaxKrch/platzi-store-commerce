export const addSpaces = (value: string) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
export const removeSpaces = (value: string) => value.replace(/\s/g, '');