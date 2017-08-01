// display those unholy iOS errors
window.onerror = function (errorMsg, filename, lineNumber, columnNumber, error) {
  alert(`Error: ${errorMsg}\nScript: ${filename}\nLine: ${lineNumber}\nColumn: ${columnNumber}\nStackTrace: ${error}`);
};
