/**
 * Module generates a unique QAR code.
 */


const generateQARCode = (latestQar) => {

    let qarParts = latestQar.split('-')
    let prefix = qarParts[0];
    let suffix = qarParts[1];
    let newSuffix = parseInt(suffix) + 1;
    let newQARCode = prefix + '-' + newSuffix;

    return newQARCode;
}

export default generateQARCode;
