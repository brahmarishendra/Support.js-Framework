
import React, { useState } from 'react';
import { 
  CustomButton, 
  useWindowSize, 
  useLocalStorage 
} from 'support.js/react';
import { dateUtils, stringUtils } from 'support.js/utils';

export function ReactExample() {
  const { width, height } = useWindowSize();
  const [name, setName] = useLocalStorage('userName', '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Support.js React Integration</h1>
      
      <div>
        <h2>Window Size Hook</h2>
        <p>Current size: {width} x {height}</p>
      </div>

      <div>
        <h2>Local Storage Hook</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <p>Stored name: {name}</p>
      </div>

      <div>
        <h2>Custom Button</h2>
        <CustomButton
          variant="primary"
          size="large"
          loading={loading}
          onClick={handleSubmit}
        >
          Submit
        </CustomButton>
      </div>

      <div>
        <h2>Utility Functions</h2>
        <p>Current date: {dateUtils.formatDate(new Date(), 'YYYY-MM-DD')}</p>
        <p>Processed text: {stringUtils.toCamelCase('hello-world-example')}</p>
      </div>
    </div>
  );
}
