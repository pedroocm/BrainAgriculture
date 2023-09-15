function parse_culturas (culturas) {
    if (culturas.length == 0) throw new Error('Deve haver pelos menos uma cultura cadastrada.');
    culturasString = []
    culturas = culturas
                    .filter(
                        (item, index) => (culturas.indexOf(item) == index)
                    ).sort().forEach(
                        (item) => culturasString.push(item)
                    );
    return culturasString;
}

function check_sum (cpfString, size, startingAdder) {
    calc = 0;
    for (i = 0; i < size; ++i) {
        if (startingAdder - i == 1) startingAdder = i + 9;
        calc += parseInt(cpfString[i]) * (startingAdder - i);
    }
    const remainder = calc % 11;
    return (remainder) < 2 ? "0" : (11 - remainder).toString();
}

module.exports = {
    check_cpf_cnpj: function (checkString) {
        checkString = checkString.replace(/\.*-*/g, '');
    
        length = checkString.length;
        isCpf = length == 11
        if (length != 11 && length != 14)
            throw new Error('CPF/CNPJ de tamanho inválido.')
    
        length = checkString.length - 2;
        startingAdder = (isCpf) ? 10 : 5;
    
        digit1 = check_sum(checkString, length, startingAdder);
        digit2 = check_sum(checkString.slice(0,length) + digit1, length+1, startingAdder+1);
        if (!(checkString.slice(length) == digit1 + digit2))
            throw new Error('CPF/CNPJ inválido.');
        return checkString;
    },
    
    parse_culturas_from_string: function (culturasString) {
        culturas = parse_culturas(culturasString.slice(1, -1).split(','))
        culturas.forEach((item, index, arr) => arr[index] = item.replace(/\"/g, ''))
        return culturas
    },
    
    parse_culturas_to_string: function (culturas) {
        culturas = parse_culturas(culturas)
        culturas.forEach((item, index, arr) => arr[index] = "'" + item.toString() + "'")
        return culturas
    }
}