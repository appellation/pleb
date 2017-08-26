import numeral from 'numeral';

export const pretty = (value) => {
  return numeral(value).format('0,0');
}
