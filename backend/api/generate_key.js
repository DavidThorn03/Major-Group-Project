import speakeasy from 'speakeasy';

const secret = speakeasy.generateSecret({length: 20});

console.log(secret);