export const API = 'http://localhost:3000/api';

export async function credit(email, reference, amount = 1000) {
  await postData(API + '/users/credit', { email, reference, amount });
}

export async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (response.status >= 300 || response.status < 200) {
    throw response.json();
  }
  return response.json();
}

export async function fetchTransactions(id) {
  let req = await fetch(API + '/transactions/' + id);
  return req.json();
}

export async function fetchUser(userEmail) {
  let req = await fetch(API + '/users/' + userEmail);
  return req.json();
}

export async function transfer(recEmail, recAmount, userEmail) {
  if (recEmail && recAmount && userEmail) {
    try {
      await postData(API + '/transactions', {
        donorEmail: userEmail,
        receiverEmail: recEmail,
        amount: recAmount,
      });
      alert('Transfer successful');
    } catch (error) {
      if (error instanceof Promise) {
        const err = await error;
        alert(err.message);
      } else {
        alert('Transfer failed, try again!');
      }
    }
  } else {
    alert('Transfer fields must be filled');
  }
}
