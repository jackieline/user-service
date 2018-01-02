

const fareEstimate = (origin, destination, cb) => {
  let price = (Math.random() * (35 - 5) + 5).toFixed(2);
  let surges = [1, 2, 2, 1, 3, 1, 2, 1];
  let surgePricingRate = surges[(Math.ceil(Math.random() * surges.length - 1))];
  cb(null, [price, surgePricingRate]);
}


export.modules.fareEstimate = fareEstimate;