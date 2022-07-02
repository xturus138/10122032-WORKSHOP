function addCommas(numberString) {
    numberString += '';
    var x = numberString.split('.'),
        x1 = x[0],
        x2 = x.length > 1 ? '.' + x[1] : '',
        rgxp = /(\d+)(\d{3})/;

    while (rgxp.test(x1)) {
      x1 = x1.replace(rgxp, '$1' + '.' + '$2');
    }

    return x1 + x2;
}