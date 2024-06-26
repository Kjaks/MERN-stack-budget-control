import React, { useEffect, useState } from 'react';

const HomePage: React.FC = () => {
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    const BDState = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/message');
        const data = await res.json();
        
        if (data.message.includes('Server and MONGODB is up ')) {
          setConnected(true);
        } else {
          setConnected(false);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    BDState();
  }, []);

  return (
    <div>
      {connected ? (
        <p>Connec MsonasfdasdfasgoDB</p>
      ) : (
        <p>Error with noDB</p>
      )}
    </div>
  );
};

export default HomePage;
