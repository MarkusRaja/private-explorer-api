const InputDataDecoder = require('ethereum-input-data-decoder');

const abi = {
  nftNim: require('../abi/NftNim.json').abi,
  pairingNim: require('../abi/PairingNim.json').abi,
  sertifikat: require('../abi/Sertifikat.json').abi,
};

const decoder = {
  nftNim: new InputDataDecoder(abi.nftNim),
  pairingNim: new InputDataDecoder(abi.pairingNim),
  sertifikat: new InputDataDecoder(abi.sertifikat),
};

const decodeNftNim = (inputData) => {
  return decoder.nftNim.decodeData(inputData);
}

const decodePairingNim = (inputData) => {
  return decoder.pairingNim.decodeData(inputData);
}

const decodeSertifikat = (inputData) => {
  return decoder.sertifikat.decodeData(inputData);
}

const decodeInputData = (inputData) => {
  const decodedInput = decodeNftNim(inputData).method && decodeNftNim(inputData)
    || decodePairingNim(inputData).method && decodePairingNim(inputData)
    || decodeSertifikat(inputData).method && decodeSertifikat(inputData);

  return decodedInput;
}

module.exports = {
  decodeNftNim,
  decodePairingNim,
  decodeSertifikat,
  decodeInputData,
}
