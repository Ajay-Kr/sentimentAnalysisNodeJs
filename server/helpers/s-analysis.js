const tf = require('@tensorflow/tfjs');
const positivity = '';

const getMetaData = async () => {
  // console.log('in getMetaData');
  const metadata = await fetch("https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json")
  return metadata.json()
}

const padSequences = (sequences, metadata) => {
  // console.log('in padSequence');
  return sequences.map(seq => {
    if (seq.length > metadata.max_len) {
      seq.splice(0, seq.length - metadata.max_len);
    }
    if (seq.length < metadata.max_len) {
      const pad = [];
      for (let i = 0; i < metadata.max_len - seq.length; ++i) {
        pad.push(0);
      }
      seq = pad.concat(seq);
    }
    return seq;
  });
}

const loadModel = async () => {
  // console.log('in loadModel')
    const url = `https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json`;
    const model = await tf.loadLayersModel(url);
    return model;
};

const predict = (text, model, metadata) => {
  // console.log('in predict')
  const trimmed = text.trim().toLowerCase().replace(/(\.|\,|\!)/g, '').split(' ');
  const sequence = trimmed.map(word => {
    const wordIndex = metadata.word_index[word];
    if (typeof wordIndex === 'undefined') {
      return 2; //oov_index
    }
    return wordIndex + metadata.index_from;
  });
  const paddedSequence = padSequences([sequence], metadata);
  const input = tf.tensor2d(paddedSequence, [1, metadata.max_len]);

  const predictOut = model.predict(input);
  const score = predictOut.dataSync()[0];
  predictOut.dispose();
  return score;
}

const getSentiment = (score) => {
  if (score > 0.66) {
    return `Positive`;
  }
  else if (score > 0.4) {
    return `Neutral`;
  }
  else {
    return `Negative`;
  }
}

const run = async (text) => {
  // console.log('in run')
  const metadata = await getMetaData();
  // console.log(metadata.max_len);
  const model = await loadModel();
  // console.log(model);
  let sum = 0;
  const perc = predict(text, model, metadata);
  const sentiment = getSentiment(perc);
  const result = {perc, sentiment};
  // console.log(result);
  return result;
};

// const result = run('die hard fan');
// console.log(result);

module.exports = run;