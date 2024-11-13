import { AxiosResponse } from 'axios';
import { NavigateFunction } from 'react-router-dom';


export const checkResponse = (response: AxiosResponse, navigate: NavigateFunction) => {
  if (response.status === 401) {
    console.error('Unauthorized access.');
    navigate('/?login=true');
    localStorage.removeItem('token');
    throw new Error('Unauthorized access.');
  } else if (response.status === 403) {
    console.error('Forbidden access.');
    navigate('/dashboard');
    throw new Error('Forbidden access.');
  } else if (response.status === 404) {
    console.error('Resource not found.');
    throw new Error('Resource not found.');
  } else if (response.status >= 500 && response.status <= 599) {
    console.error('Server error occurred.');
    throw new Error('Server error. Please try again later.');
  } else {
    console.error(`Unexpected response code: ${response.status}`);
    console.error(response);
    throw new Error('An unexpected error occurred.');
  }
};