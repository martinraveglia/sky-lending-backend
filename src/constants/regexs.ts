export const SSN_REGEX = /^(?!666|000|9\d{2})\d{3}(?!00)\d{2}(?!0{4})\d{4}$/;

export const PHONE_REGEX = /^\+[1-9]\d{1,14}$/;

// Minimum 8 characters, maximum 50 characters, at least one lowercase letter, one uppercase letter and one number
export const PASSWORD_VALIDATION =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=\S+$)[A-Za-z\w\W\d]{8,50}$/;
