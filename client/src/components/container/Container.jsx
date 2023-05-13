import { useState } from 'react';

import './container.css';
import './inputContainer.css';
import './outputContainer.css';

const Container = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({});
  const [inputText, setInputText] = useState('');

  const fetchData = async() => {
    try {
      setLoading(true);
      const url = 'http://localhost:5005/analyse';
      const fetchedData = await fetch(url, 
        {
          method: 'post',
          body: JSON.stringify({text: inputText}),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await fetchedData.json();
      if(data.error) return alert('Error: ', data.error.message);
      if(data.length === 0) return alert('Some error occured please try again');
      setResult(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
    
  }

  const handleOnClickRun = () => {
    if(inputText.length === 0) return alert('Empty input! Please enter some text.')
    if(inputText.length > 0) fetchData();
  }

  function resizeTextArea(textarea, userDefinedHeight = 0) {
    const { style, value } = textarea;

    style.height = style.minHeight = 'auto';
    style.minHeight = `${ Math.min(textarea.scrollHeight + 4, parseInt(textarea.style.maxHeight)) }px`;
    style.height = `${ Math.max(textarea.scrollHeight + 4, userDefinedHeight) }px`;
  }
  let userDefinedHeight = 0;

  const handleMouseUp = (e) => {
    const { height, minHeight } = e.target.style;
    userDefinedHeight = height === minHeight ? 0 : parseInt(height, 10);
  };
  
  const handleOnChange = (e) => {
    const input = e.target.value;
    setInputText(input);
    console.log(inputText);
    resizeTextArea(e.target, userDefinedHeight);
  }

  return (
    <div className="container">
      <div className='input-container' style={{filter: loading ? 'blur(1.3px)': 'none'}}>
        <textarea onChange={handleOnChange} onMouseUp={handleMouseUp} className="text-input" id='textarea' placeholder='Input your text here...'></textarea>
      </div>

      {
        loading 
          ? <div className="running-div">
              <i className="running bi bi-gear-fill"></i>
            </div>
          : <i className="run bi bi-caret-right-fill" onClick={handleOnClickRun}></i>
      }

      <div className='output-container' style={{filter: loading ? 'blur(1.3px)': 'none'}}>
        <h3>Result</h3>
        <div className='result'>
          <p>Sentiment: 
            {
              result?.sentiment ? <span>{result.sentiment}</span> : ''
            }
          </p>
          <p>Score: 
            {
              result?.perc ? <span>{result.perc}</span> : ''
            }
          </p>
        </div>
      </div>
    </div>
  )
}

export default Container