import { json, redirect } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export const action = async ({ request }) => {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get('mode') || 'login';

  if (mode !== 'login' && mode !== 'signup') {
    throw json({ message: 'Invalid mode' }, { status: 422 });
  }

  const data = await request.formData();
  const authData = {
    email: data.get('email'),
    password: data.get('password'),
  };

  const response = await fetch(`http://localhost:8080/${mode}`, {
    method: 'POST',
    body: JSON.stringify(authData),
    headers: {
      'Content-Type': 'application/json',
    },
  })  

  if (response.status === 422 || response.status === 401) {
    return response
  }

  if (!response.ok) {
    throw json({ message: 'Could not authenticate user' }, { status: 500 });
  }

  const responseData = await response.json();
  const token = responseData.token;

  localStorage.setItem('token', token);
  const expirationDate = new Date();
  expirationDate.setSeconds(expirationDate.getSeconds() + 30);
  localStorage.setItem('expirationDate', expirationDate.toISOString());


  return redirect('/');
};
