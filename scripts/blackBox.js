function backLab1(powerSupply, voltmeter, variant, p1, invert, useR2, useD2) {
    voltmeter.setError(((199 * variant) % 5) - 2.5);

    if (p1) {
        
    } else {
        voltmeter.setVoltage(powerSupply.getVoltage());
    }
}