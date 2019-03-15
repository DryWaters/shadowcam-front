export default ({ name, value }) => {
  let isValid = true;
  switch (name) {
    case "email":
      isValid = isValid && isValidEmail(value);
      break;
    case "password":
      isValid = isValid && isValidPassword(value);
      break;
    default:
      isValid = true;
  }
  return isValid;
};

const isValidEmail = val =>
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
    val
  );

const isValidPassword = val => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(val);
