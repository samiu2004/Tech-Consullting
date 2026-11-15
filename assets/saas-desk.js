(() => {
  const form = document.querySelector('.sd-roi');
  if (!form) return;
  const inputs = [...form.querySelectorAll('input')];
  const error = form.querySelector('.sd-roi-error');
  const results = form.querySelector('.sd-roi-results');
  const format = number => number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  function calculate() {
    let valid = true;
    inputs.forEach(input => {
      const okay = input.value.trim() !== '' && input.validity.valid && Number.isFinite(input.valueAsNumber) && input.valueAsNumber >= 0;
      input.setAttribute('aria-invalid', String(!okay));
      if (!okay) valid = false;
    });
    error.hidden = valid;
    results.hidden = !valid;
    if (!valid) return;
    const [setup, recurring, hours, rate] = inputs.map(input => input.valueAsNumber);
    const benefit = hours * rate * 12;
    const cost = setup + recurring * 12;
    const net = hours * rate - recurring;
    const put = (key, value) => { form.querySelector(`[data-roi="${key}"]`).textContent = value; };
    put('benefit', format(benefit));
    put('cost', format(cost));
    put('roi', cost === 0 ? 'Undefined (zero cost)' : ((benefit - cost) / cost * 100).toFixed(1) + '%');
    put('payback', net <= 0 ? 'No positive payback' : setup === 0 ? 'Immediate (no setup cost)' : format(setup / net) + ' months');
  }
  form.addEventListener('submit', event => { event.preventDefault(); calculate(); });
  inputs.forEach(input => input.addEventListener('input', calculate));
  calculate();
})();
