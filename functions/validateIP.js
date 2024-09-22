const net = require('net');

function isPrivate(ip) {
    const parts = ip.split('.');
    return parts[0] === '10' ||
        (parts[0] === '0' && parts[1] === '0' && parts[2] === '0' && parts[3] === '0') ||
        (parts[0] === '172' && parts[1] >= 16 && parts[1] <= 31) ||
        (parts[0] === '192' && parts[1] === '168');
}

function validateIP(ipAddress) {
    const isPrivateIp = isPrivate(ipAddress);

    if (!net.isIP(ipAddress)) {
        return { isValid: false, message: 'آیپی باید شامل اعداد انگلیسی باشد و فرمت ان صحیح باشد!' };
    }

    if (isPrivateIp) {
        return { isValid: false, message: 'آیپی پرایویت مجاز نمیباشد!' };
    }

    return {
        isValid: true,
        message: 'آیپی صحیح میباشد.'
    };
}

module.exports = { validateIP }