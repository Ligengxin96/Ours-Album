const shuffle = (ary) => {
  let length = ary.length;
  while(length > 0) {
    const index = Math.floor(Math.random() * length--);
    [ary[index], ary[length]] = [ary[length], ary[index]];
  }
  return ary;
}  

export default shuffle;