import { db } from './mockDatabase';

export const login = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = db.users.find((user) => user.email.toLowerCase() === email.toLowerCase());

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
          name: user.firstName,
          email: user.email,
        },
      });
    }, 1000);
  });
};

export const register = (firstName, lastName, dateOfBirth, email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const emailExists = db.users.find((u) => u.email === email);

      if (emailExists) {
        reject(new Error('Este e-mail já está cadastrado.'));
        return;
      }

      const newUser = {
        id: db.users.length + 1,
        firstName,
        lastName,
        dateOfBirth,
        email,
        password,
      };

      db.users.push(newUser);

      console.log('Banco Atualizado:', db.users);

      resolve(newUser);
    }, 1000);
  });
};
