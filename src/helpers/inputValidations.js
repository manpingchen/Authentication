
export const passwordValidateHandler = (enteredValue) => enteredValue.trim().length > 5;

export const emailValidateHandler = (emailAddress) => {
  var mailformat = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;
  return mailformat.test(emailAddress);
};