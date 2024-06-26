import React, { useEffect, useState } from 'react';

const HomePage: React.FC = () => {
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    const BDState = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/message');
        const data = await res.json();
        console.log("I NEED TO FUCKING NUT");
        
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
        <p>Connected to MongoDB</p>
      ) : (
        <p>Error with MongoDB</p>
      )}
    </div>
  );
};

export default HomePage;
