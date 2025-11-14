import { db } from './mockDatabase';

export const login = (email, password) => {

  return new Promise((resolve, reject) => {

    setTimeout(() => {

      const user = db.users.find(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        reject(new Error('Email ou senha inválidos.'));
        return;
      }

      if (user.password !== password) {
        reject(new Error('Email ou senha inválidos.'));
        return;
      }

      resolve({
        token: 'fake-jwt-token-123456789', 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    }, 1000);
  });
};