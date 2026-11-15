(() => {
  const desk = document.querySelector('.saas-desk');
  if (desk) {
    const select = desk.querySelector('#workflow-example');
    const run = desk.querySelector('#workflow-run');
    const demo = desk.querySelector('.sd-demo');
    const status = desk.querySelector('#workflow-status');
    const examples = {
      lead: { trigger: 'New eligible enquiry', check: 'Owner, address, duplicates', action: 'Send once or flag for review', result: 'Example result: an eligible enquiry is assigned and checked before one response. Missing information goes to a person.' },
      invoice: { trigger: 'Invoice reaches reminder date', check: 'Unpaid, no dispute or extension', action: 'Remind or pause for the owner', result: 'Example result: an outstanding invoice is reminded only after checking payment and dispute status.' },
      onboarding: { trigger: 'Engagement is approved', check: 'Owner and required details', action: 'Prepare kickoff or request review', result: 'Example result: an approved client receives the next request. Missing essentials are flagged to the project owner.' }
    };
    function update() {
      const example = examples[select.value];
      ['trigger', 'check', 'action'].forEach(key => { desk.querySelector(`[data-flow="${key}"]`).textContent = example[key]; });
      demo.classList.remove('is-run');
      status.textContent = 'Illustration only. No accounts connected or messages sent.';
    }
    select.addEventListener('change', update);
    run.addEventListener('click', () => {
      demo.classList.add('is-run');
      status.textContent = examples[select.value].result + ' Illustration only; no real action was taken.';
    });
    update();
  }

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
