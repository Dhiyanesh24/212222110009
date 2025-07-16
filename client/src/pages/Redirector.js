import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { log } from '../utils/logger';

export default function Redirector() {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const resolveShortcode = async () => {
      try {
        console.log("🔍 Resolving shortcode:", shortcode);
        const res = await axios.get(`http://20.244.56.144:8080/resolve/${shortcode}`);
        console.log("🌐 Redirecting to:", res.data.originalURL);
        log('frontend', 'info', 'page', `Redirecting to ${res.data.originalURL}`);
        window.location.href = res.data.originalURL;
      } catch (err) {
        console.error("❌ Shortcode not found or expired:", shortcode);
        log('frontend', 'error', 'page', `Failed to resolve shortcode: ${shortcode}`);
        navigate('/');
      }
    };

    resolveShortcode();
  }, [shortcode, navigate]);

  return <p>🔁 Redirecting...</p>;
}
