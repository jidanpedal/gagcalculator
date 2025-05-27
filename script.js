const modifiers = [
  'disco', 'choc', 'bloodlit', 'celestial', 'moonlit',
  'frozen', 'zomb', 'shocked', 'plasma'
];
const modifierLabels = {
  disco: 'Disco',
  choc: 'Choc',
  bloodlit: 'Bloodlit',
  celestial: 'Celestial',
  moonlit: 'Moonlit',
  frozen: 'Frozen',
  zomb: 'Zombified',
  shocked: 'Shocked',
  plasma: 'Plasma'
};
const fruitTypes = [
  { id: 'rainbow', label: 'Rainbow' },
  { id: 'gold', label: 'Gold' }
];
const categories = {
  "Seed Shop": ['carrot','strawberry','blueberry','orangetulip','tomato','corn','daffodil','watermelon','pumpkin','apple','bamboo','coconut','cactus','dragonfruit','mango','grape','mushroom','pepper','cacao','beanstalk'],
  "Night Event": ['nightshade','mint','glowshroom','moonmelon','starfruit','moonflower','bloodbanana','moonglow','moonblossom','celestiberry','moonmango'],
  "Easter Event": ['candyblossom','easteregg'],
  "Normal Seed Pack": ['raspberry','pear','peach'],
  "Event Seed Pack": ['cranberry','durian','eggplant'],
  "Exotic Plants": ['papaya','banana','passionfruit','soulfruit']
};

// Render modifier buttons
const modifierContainer = document.getElementById('modifiers');
modifierContainer.innerHTML = '';
modifiers.forEach(id => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'mod-btn';
  btn.id = `modbtn-${id}`;
  btn.textContent = modifierLabels[id] || (id.charAt(0).toUpperCase() + id.slice(1));
  btn.onclick = () => toggleModifier(id);
  modifierContainer.appendChild(btn);
});
// Render fruit type buttons
const fruitRow = document.getElementById('fruitRow');
fruitRow.innerHTML = '';
fruitTypes.forEach(fruit => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'fruit-btn';
  btn.id = `fruitbtn-${fruit.id}`;
  btn.textContent = fruit.label;
  btn.onclick = () => toggleFruitBtn(fruit.id);
  fruitRow.appendChild(btn);
});

// Dynamically build plant categories as button groups (not checkboxes)
const categoryContainer = document.getElementById('categoryContainer');
const plantIds = [];
Object.entries(categories).forEach(([title, ids]) => {
  const categoryDiv = document.createElement('div');
  categoryDiv.className = 'category';
  categoryDiv.innerHTML = `<div class="category-title">${title}</div>`;
  const btnWrap = document.createElement('div');
  btnWrap.style.display = 'flex';
  btnWrap.style.flexWrap = 'wrap';
  btnWrap.style.gap = '0';
  ids.forEach(id => {
    plantIds.push(id);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'plant-btn';
    btn.id = `plantbtn-${id}`;
    btn.textContent = id.charAt(0).toUpperCase() + id.slice(1);
    btn.onclick = () => togglePlantBtn(id);
    btnWrap.appendChild(btn);
  });
  categoryDiv.appendChild(btnWrap);
  categoryContainer.appendChild(categoryDiv);
});

// --- Modifier logic ---
function toggleModifier(id) {
  const btn = document.getElementById(`modbtn-${id}`);
  const isActive = btn.classList.contains('active');
  // Special logic for frozen/wet/chilled (if you want to add wet/chilled buttons, add them to modifiers array)
  if (id === 'frozen') {
    if (!isActive) {
      setModifierActive('frozen', true);
      setModifierActive('wet', false, true);
      setModifierActive('chilled', false, true);
    } else {
      setModifierActive('frozen', false);
      setModifierActive('wet', false, false);
      setModifierActive('chilled', false, false);
    }
  } else if (id === 'wet' || id === 'chilled') {
    if (!isActive) {
      setModifierActive(id, true);
      setModifierActive(id === 'wet' ? 'chilled' : 'wet', false);
      setModifierActive('frozen', false, true);
    } else {
      setModifierActive(id, false);
      setModifierActive('frozen', false, false);
    }
  } else {
    setModifierActive(id, !isActive);
  }
  calculateValue();
}
function setModifierActive(id, active, disable = false) {
  const btn = document.getElementById(`modbtn-${id}`);
  if (!btn) return;
  if (active) btn.classList.add('active');
  else btn.classList.remove('active');
  btn.disabled = !!disable;
}
// --- Fruit logic ---
function toggleFruitBtn(id) {
  fruitTypes.forEach(fruit => {
    const btn = document.getElementById(`fruitbtn-${fruit.id}`);
    if (fruit.id === id) btn.classList.toggle('active');
    else btn.classList.remove('active');
  });
  calculateValue();
}
// --- Plant logic ---
function togglePlantBtn(changed) {
  plantIds.forEach(id => {
    const btn = document.getElementById(`plantbtn-${id}`);
    if (btn) btn.classList.toggle('active', id === changed);
  });
  // Do NOT auto-set weight anymore
  calculateValue();
}

// --- Calculate value logic ---
function getActivePlantId() {
  for (const id of plantIds) {
    const btn = document.getElementById(`plantbtn-${id}`);
    if (btn && btn.classList.contains('active')) return id;
  }
  return null;
}
function isModifierActive(id) {
  const btn = document.getElementById(`modbtn-${id}`);
  return btn && btn.classList.contains('active');
}
function isFruitActive(id) {
  const btn = document.getElementById(`fruitbtn-${id}`);
  return btn && btn.classList.contains('active');
}
const plantMinWeights = {
  easteregg: 2.85,
  moonflower: 1.90,
  starfruit: 2.85,
  pepper: 4.75,
  grape: 2.85,
  nightshade: 0.48,
  mint: 0.95,
  glowshroom: 0.70,
  bloodbanana: 1.42,
  beanstalk: 9.5,
  coconut: 13.31,
  candyblossom: 2.85,
  carrot: 0.24,
  strawberry: 0.29,
  blueberry: 0.17,
  orangetulip: 0.0499,
  tomato: 0.44,
  daffodil: 0.16,
  watermelon: 7.3,
  pumpkin: 6.9,
  mushroom: 25.9,
  bamboo: 3.80,
  apple: 2.85,
  corn: 1.90,
  cactus: 6.65,
  cranberry: 0.95,
  moonmelon: 6.84,
  pear: 2.85,
  durian: 7.6,
  peach: 1.90,
  cacao: 7.6,
  moonglow: 6.65,
  dragonfruit: 11.38,
  mango: 14.28,
  moonblossom: 2.86,
  raspberry: 0.71,
  eggplant: 4.75,
  papaya: 2.86,
  celestiberry: 1.90,
  moonmango: 14.25,
  banana: 1.425,
  passionfruit: 2.867,
  soulfruit: 23.75
};
function calculateValue() {
  const weight = parseFloat(document.getElementById('weight').value) || 0;
  const activePlant = getActivePlantId();

  // Show/hide warning if weight < min
  if (activePlant && plantMinWeights[activePlant] !== undefined && weight < plantMinWeights[activePlant]) {
    warnElem.textContent = `Minimum weight for ${activePlant.charAt(0).toUpperCase() + activePlant.slice(1)} is ${plantMinWeights[activePlant]} kg`;
    warnElem.style.display = 'block';
  } else {
    warnElem.textContent = '';
    warnElem.style.display = 'none';
  }

  // Set all plant variables to false except the active one
  let candyblossom = false, beanstalk = false, corn = false, coconut = false, easteregg = false, moonflower = false, starfruit = false, pepper = false, grape = false, nightshade = false, mint = false, glowshroom = false, bloodbanana = false, carrot = false, strawberry = false, blueberry = false, orangetulip = false, tomato = false, daffodil = false, watermelon = false, pumpkin = false, bamboo = false, cactus = false, apple = false, mushroom = false, moonmelon = false, cranberry = false, pear = false, durian = false, moonglow = false, peach = false, cacao = false, dragonfruit = false, mango = false, moonblossom = false, eggplant = false, raspberry = false, papaya = false, celestiberry = false, banana = false, passionfruit = false, soulfruit = false, moonmango = false;

  if (activePlant) {
    // Set the corresponding variable to true
    eval(`${activePlant} = true`);
  }

  let modifierMultiplier = 0;
  modifierMultiplier += isModifierActive('shocked') ? 99 : 0;
  modifierMultiplier += isModifierActive('frozen') ? 9 : 0;
  modifierMultiplier += isModifierActive('wet') ? 1 : 0;
  modifierMultiplier += isModifierActive('chilled') ? 1 : 0;
  modifierMultiplier += isModifierActive('choc') ? 1 : 0;
  modifierMultiplier += isModifierActive('moonlit') ? 1 : 0;
  modifierMultiplier += isModifierActive('bloodlit') ? 3 : 0;
  modifierMultiplier += isModifierActive('celestial') ? 119 : 0;
  modifierMultiplier += isModifierActive('disco') ? 124 : 0;
  modifierMultiplier += isModifierActive('zomb') ? 24 : 0;
  modifierMultiplier += isModifierActive('plasma') ? 4 : 0;

  let baseValue = 0;
  // ...existing baseValue logic...
  if (easteregg) {
    baseValue = (weight < 2.85) ? 2256 : 277.5 * Math.pow(weight, 2);
  }
  else if (moonflower) {
    baseValue = (weight < 1.90) ? 8574 : 2381 * Math.pow(weight, 2);
  }
  else if (starfruit) {
    baseValue = (weight < 2.85) ? 13538 : 1666.6 * Math.pow(weight, 2);
  }
  else if (pepper) {
    baseValue = (weight < 4.75) ? 7200 : 320 * Math.pow(weight, 2);
  }
  else if (grape) {
    baseValue = (weight < 2.85) ? 7085 : 872 * Math.pow(weight, 2);
  }
  else if (nightshade) {
    baseValue = (weight < 0.48) ? 3159 : 13850 * Math.pow(weight, 2);
  }
  else if (mint) {
    baseValue = (weight < 0.95) ? 4738 : 5230 * Math.pow(weight, 2);
  }
  else if (glowshroom) {
    baseValue = (weight < 0.70) ? 271 : 532.5 * Math.pow(weight, 2);
  }
  else if (bloodbanana) {
    baseValue = (weight < 1.42) ? 5415 : 2670 * Math.pow(weight, 2);
  }
  else if (beanstalk) {
    baseValue = (weight < 9.5) ? 18050 : 200 * Math.pow(weight, 2);
  }
  else if (coconut) {
    baseValue = (weight < 13.31) ? 361 : 2.04 * Math.pow(weight, 2);
  }
  else if (candyblossom) {
    baseValue = (weight < 2.85) ? 90250 : 11111.111 * Math.pow(weight, 2);
  }
  else if (carrot) {
    baseValue = (weight < 0.24) ? 18 : 275 * Math.pow(weight, 2);
  }
  else if (strawberry) {
    baseValue = (weight < 0.29) ? 14 : 175 * Math.pow(weight, 2);
  }
  else if (blueberry) {
    baseValue = (weight < 0.17) ? 18 : 500 * Math.pow(weight, 2);
  }
  else if (orangetulip) {
    baseValue = (weight < 0.0499) ? 767 : 300000 * Math.pow(weight, 2);
  }
  else if (tomato) {
    baseValue = (weight < 0.44) ? 27 : 120 * Math.pow(weight, 2);
  }
  else if (daffodil) {
    baseValue = (weight < 0.16) ? 903 : 25000 * Math.pow(weight, 2);
  }
  else if (watermelon) {
    baseValue = (weight < 7.3) ? 2708 : 61.25 * Math.pow(weight, 2);
  } 
  else if (pumpkin) {
    baseValue = (weight < 6.90) ? 3069 : 64 * Math.pow(weight, 2);
  }
  else if (mushroom) {
    baseValue = (weight < 25.9) ? 136278 : 241.6 * Math.pow(weight, 2);
  }
  else if (bamboo) {
    baseValue = (weight< 3.80) ? 3610 : 250 * Math.pow(weight,2);
  }
  else if (apple) {
    baseValue = (weight< 2.85) ? 248 : 30.53 * Math.pow(weight,2);
  }
  else if (corn) {
    baseValue = (weight < 1.90) ? 36 : 10.00 * Math.pow(weight,2);
  }
  else if (cactus) {
    baseValue = ( weight < 6.65) ? 3069 : 69.4 * Math.pow(weight,2);
  }
  else if (cranberry) {
    baseValue = (weight < 0.95) ? 1805 : 2000 * Math.pow(weight,2);
  }
  else if (moonmelon) {
    baseValue = (weight < 6.84) ? 16245 : 280.85 * Math.pow(weight, 2);
  }
  else if (pear) {
    baseValue = (weight < 2.85) ? 451 : 55.5 * Math.pow(weight, 2);
  }
  else if (durian) {
    baseValue = (weight < 7.60) ? 4513 : 78.19 * Math.pow(weight, 2);
  }
  else if (peach) {
    baseValue = (weight < 1.90) ? 271 : 75 * Math.pow(weight, 2);
  }
  else if (cacao) {
    baseValue = (weight < 7.6) ? 9928 : 171.875 * Math.pow(weight, 2);
  }
  else if (moonglow) {
    baseValue = (weight < 6.65) ? 18050 : 408.45 * Math.pow(weight, 2);
  }
  else if (dragonfruit) {
    baseValue = (weight < 11.38) ? 4287 : 32.99 * Math.pow(weight, 2);
  }
  else if (mango) {
    baseValue = (weight < 14.28 ) ? 5866 : 28.89 * Math.pow(weight,2);
  }
  else if (moonblossom) {
    baseValue = (weight < 2.86) ? 45125 : 5555.555 * Math.pow(weight, 2);
  }
  else if (raspberry) {
    baseValue = (weight < 0.71) ? 90 : 177.5 * Math.pow(weight, 2);
  }
  else if (eggplant) {
    baseValue = (weight < 4.75) ? 6769 : 300 * Math.pow(weight, 2);
  }
  else if (papaya) {
    baseValue = (weight < 2.86) ? 903 : 111.11 * Math.pow(weight, 2);
  }
  else if (celestiberry) {
    baseValue = (weight < 1.90) ? 7220 : 2000 * Math.pow(weight,2);
  }
  else if (moonmango) {
    baseValue = (weight < 14.25) ? 22563 : 111.11 * Math.pow(weight,2);
  }
  else if (banana) {
    baseValue = (weight < 1.425) ? 1579 : 777.77 * Math.pow(weight,2);
  }
  else if (passionfruit) {
    baseValue =  (weight < 2.867) ? 3204 : 395 * Math.pow(weight,2);
  }
  else if (soulfruit) {
    baseValue = ( weight < 23.75) ? 6994 : 12.4 * Math.pow(weight,2);
  }
  else { 
    baseValue = Math.pow(weight, 2);
  }

  let fruitMultiplier = isFruitActive('rainbow') ? 50 :
                        isFruitActive('gold') ? 20 : 1;

  let result = Math.ceil(baseValue * fruitMultiplier * (1 + modifierMultiplier));
  document.getElementById('value').innerText = `≈$${result.toLocaleString()}`;
}

// --- Clear all logic ---
function clearAll() {
  // Clear plant buttons
  plantIds.forEach(id => {
    const btn = document.getElementById(`plantbtn-${id}`);
    if (btn) btn.classList.remove('active');
  });
  // Clear modifier buttons
  modifiers.forEach(id => setModifierActive(id, false, false));
  // Clear fruit buttons
  fruitTypes.forEach(fruit => {
    const btn = document.getElementById(`fruitbtn-${fruit.id}`);
    if (btn) btn.classList.remove('active');
  });
  document.getElementById('weight').value = 1.00;
  document.getElementById('value').innerText = '$0';
  warnElem.textContent = '';
  warnElem.style.display = 'none';
  calculateValue();
}

// Attach events
document.getElementById('weight').addEventListener('input', calculateValue);
document.getElementById('resetBtn').addEventListener('click', clearAll);

// Initial calculation
window.onload = calculateValue;

// Add plant button styles
const style = document.createElement('style');
style.innerHTML = `
.plant-btn {
  display: inline-block;
  padding: 8px 18px;
  margin: 4px 8px 4px 0;
  border-radius: 18px;
  background: #232634;
  color: var(--text-muted, #b7b9c7);
  border: 2px solid var(--input-border, #35384a);
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, border 0.18s, box-shadow 0.18s;
  user-select: none;
  outline: none;
  min-width: 90px;
  text-align: center;
  box-shadow: 0 1px 6px #0002;
}
.plant-btn.active {
  background: var(--primary, #7f9cff);
  color: #fff;
  border-color: var(--primary, #7f9cff);
  box-shadow: 0 2px 12px #7f9cff33;
}
.plant-btn:active {
  background: var(--primary-dark, #4b5fd6);
}
`;
document.head.appendChild(style);

// Add warning element below weight input
const inputRow = document.querySelector('.input-row');
let warnElem = document.createElement('div');
warnElem.id = 'weight-warning';
warnElem.style.display = 'none';
warnElem.style.color = '#ff5c5c';
warnElem.style.fontSize = '0.98em';
warnElem.style.marginTop = '4px';
warnElem.style.marginLeft = '2px';
inputRow.appendChild(warnElem);
