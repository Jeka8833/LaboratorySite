const powerSupplyElement = document.getElementById("powerSupply");
const voltmeterElement = document.getElementById("voltmeter");
const variantElement = document.getElementById("variant");
const p1SwitchElement = document.getElementById("p1Switch");
const invertSupplyElement = document.getElementById("invertSupply");
const r1ResistorElement = document.getElementById("r1Resistor");
const r2ResistorElement = document.getElementById("r2Resistor");
const d1DiodeElement = document.getElementById("d1Diode");
const d2DiodeElement = document.getElementById("d2Diode");

const powerSupply = new PowerSupply(powerSupplyElement);
const voltmeter = new Voltmeter(voltmeterElement);

powerSupply.setAutoHeight(true);
voltmeter.setAutoHeight(true);

powerSupply.addListener(elementChange);

variantElement.addEventListener("change", () => {
    getVariant();
    elementChange();
});

p1SwitchElement.addEventListener("change", elementChange);

invertSupplyElement.addEventListener("change", elementChange);

r1ResistorElement.addEventListener("change", elementChange);
r2ResistorElement.addEventListener("change", elementChange);

d1DiodeElement.addEventListener("change", elementChange);
d2DiodeElement.addEventListener("change", elementChange);

function elementChange() {
    backLab1(powerSupply, voltmeter, getVariant(), p1SwitchElement.checked, invertSupplyElement.checked,
        r2ResistorElement.checked, d2DiodeElement.checked);
}
elementChange();

function getVariant() {
    const variant = parseInt(variantElement.value, 10);
    if (!isNaN(variant) && variant > 0) {
        variantElement.classList.remove("is-invalid");
        return variant;
    }
    variantElement.classList.add("is-invalid");

    return 0;
}

getVariant();