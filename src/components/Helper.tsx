//convert to boolean
export const ctb = (value: any) => {
  //sqlite only acceps 0 and 1 as boolean values.
  switch (value) {
    case true:
    case "true":
    case 1:
    case 1.0:
    case "1.0":
    case "1":
      return 1;
    default:
      return 0;
  }
};
