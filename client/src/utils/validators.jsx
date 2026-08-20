export const emailPattern = {
  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
  message: 'Enter a valid email address',
};

export const passwordMinLength = {
  value: 8,
  message: 'Password must be at least 8 characters',
};

export const nameMaxLength = {
  value: 60,
  message: 'Must be under 60 characters',
};