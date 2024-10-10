import React from 'react';

const PasswordStrengthMeter = ({ password }) => {
  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length > 6) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="password-strength-meter">
      <div className={`strength-${strength}`}></div>
      <span>{['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength]}</span>
    </div>
  );
};

export default PasswordStrengthMeter;