import axios from 'axios';

export const log = async (stack, level, pkg, message) => {
  try {
    await axios.post('http://20.244.56.144/evaluation-service/logs', {
      stack,
      level,
      package: pkg,
      message,
    });
  } catch (e) {
    console.error('Log failed');
  }
};