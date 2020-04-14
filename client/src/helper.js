export const API = 'http://localhost:3000/api';

export async function credit(email, amount = 1000) {
  const creditUser = await postData(API + '/users/credit', { email, amount });
  console.log(creditUser);
}

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response.json();
}
