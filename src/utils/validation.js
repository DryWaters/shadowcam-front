import {
  MAX_HEIGHT,
  MAX_WEIGHT,
  MIN_HEIGHT,
  MIN_WEIGHT,
  MIN_YEAR,
  MAX_YEAR,
  MIN_PASSWORD_LENGTH
} from "./constants";

export const isValidEmail = val =>
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
    val
  );

export const isValidPassword = val =>
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(val);

export const confirmPassword = (password, otherPW) => password === otherPW;

export const isValidDate = val =>
  val.slice(0, 4) > MIN_YEAR && val.slice(0, 4) < MAX_YEAR;

export const isValidHeight = val => val > MIN_HEIGHT && val < MAX_HEIGHT;

export const isValidWeight = val => val > MIN_WEIGHT && val < MAX_WEIGHT;

export const minChars = val => val.length >= MIN_PASSWORD_LENGTH;

export const hasNumber = val => /[0-9]/.test(val);

export const hasLower = val => /[a-z]/.test(val);

export const hasUpper = val => /[A-Z]/.test(val);

export const hasSymbol = val => /[!@#$%^&*-]/.test(val);

export default {
  email: isValidEmail,
  password: isValidPassword,
  confirmPassword: confirmPassword,
  birthdate: isValidDate,
  height: isValidHeight,
  weight: isValidWeight,
  passwordValidators: {
    minChars,
    hasNumber,
    hasLower,
    hasUpper,
    hasSymbol
  }
};
