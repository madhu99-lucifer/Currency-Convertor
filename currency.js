// Currency Converter using Frankfurter API (stable)

const API_URL = "https://api.frankfurter.app";

// Elements
const selects   = document.querySelectorAll(".dropdown select");
const fromSel   = document.querySelector(".from select");
const toSel     = document.querySelector(".to select");
const amountInp = document.querySelector(".amount input");
const msg       = document.querySelector(".msg");
const btn       = document.querySelector("form button");
const swapIcon  = document.querySelector(".fa-arrow-right-arrow-left");

// Currency -> Flag map
const CCY_TO_FLAG = {
  AED: "AE",
  AFN: "AF",
  XCD: "AG",
  ALL: "AL",
  AMD: "AM",
  ANG: "AN",
  AOA: "AO",
  AQD: "AQ",
  ARS: "AR",
  AUD: "AU",
  AZN: "AZ",
  BAM: "BA",
  BBD: "BB",
  BDT: "BD",
  XOF: "BE",
  BGN: "BG",
  BHD: "BH",
  BIF: "BI",
  BMD: "BM",
  BND: "BN",
  BOB: "BO",
  BRL: "BR",
  BSD: "BS",
  NOK: "BV",
  BWP: "BW",
  BYR: "BY",
  BZD: "BZ",
  CAD: "CA",
  CDF: "CD",
  XAF: "CF",
  CHF: "CH",
  CLP: "CL",
  CNY: "CN",
  COP: "CO",
  CRC: "CR",
  CUP: "CU",
  CVE: "CV",
  CYP: "CY",
  CZK: "CZ",
  DJF: "DJ",
  DKK: "DK",
  DOP: "DO",
  DZD: "DZ",
  ECS: "EC",
  EEK: "EE",
  EGP: "EG",
  ETB: "ET",
  EUR: "FR",
  FJD: "FJ",
  FKP: "FK",
  GBP: "GB",
  GEL: "GE",
  GGP: "GG",
  GHS: "GH",
  GIP: "GI",
  GMD: "GM",
  GNF: "GN",
  GTQ: "GT",
  GYD: "GY",
  HKD: "HK",
  HNL: "HN",
  HRK: "HR",
  HTG: "HT",
  HUF: "HU",
  IDR: "ID",
  ILS: "IL",
  INR: "IN",
  IQD: "IQ",
  IRR: "IR",
  ISK: "IS",
  JMD: "JM",
  JOD: "JO",
  JPY: "JP",
  KES: "KE",
  KGS: "KG",
  KHR: "KH",
  KMF: "KM",
  KPW: "KP",
  KRW: "KR",
  KWD: "KW",
  KYD: "KY",
  KZT: "KZ",
  LAK: "LA",
  LBP: "LB",
  LKR: "LK",
  LRD: "LR",
  LSL: "LS",
  LTL: "LT",
  LVL: "LV",
  LYD: "LY",
  MAD: "MA",
  MDL: "MD",
  MGA: "MG",
  MKD: "MK",
  MMK: "MM",
  MNT: "MN",
  MOP: "MO",
  MRO: "MR",
  MTL: "MT",
  MUR: "MU",
  MVR: "MV",
  MWK: "MW",
  MXN: "MX",
  MYR: "MY",
  MZN: "MZ",
  NAD: "NA",
  XPF: "NC",
  NGN: "NG",
  NIO: "NI",
  NPR: "NP",
  NZD: "NZ",
  OMR: "OM",
  PAB: "PA",
  PEN: "PE",
  PGK: "PG",
  PHP: "PH",
  PKR: "PK",
  PLN: "PL",
  PYG: "PY",
  QAR: "QA",
  RON: "RO",
  RSD: "RS",
  RUB: "RU",
  RWF: "RW",
  SAR: "SA",
  SBD: "SB",
  SCR: "SC",
  SDG: "SD",
  SEK: "SE",
  SGD: "SG",
  SKK: "SK",
  SLL: "SL",
  SOS: "SO",
  SRD: "SR",
  STD: "ST",
  SVC: "SV",
  SYP: "SY",
  SZL: "SZ",
  THB: "TH",
  TJS: "TJ",
  TMT: "TM",
  TND: "TN",
  TOP: "TO",
  TRY: "TR",
  TTD: "TT",
  TWD: "TW",
  TZS: "TZ",
  UAH: "UA",
  UGX: "UG",
  USD: "US",
  UYU: "UY",
  UZS: "UZ",
  VEF: "VE",
  VND: "VN",
  VUV: "VU",
  YER: "YE",
  ZAR: "ZA",
  ZMK: "ZM",
  ZWD: "ZW",
};

function setFlag(selectEl) {
  const ccy = selectEl.value;
  const country = CCY_TO_FLAG[ccy] || "US";
  const img = selectEl.closest(".select-container").querySelector("img");
  img.src = `https://flagsapi.com/${country}/flat/64.png`;
  img.alt = country;
}

// Load available currencies from Frankfurter
async function loadCurrencies() {
  try {
    const res = await fetch(`${API_URL}/currencies`);
    const data = await res.json();
    const codes = Object.keys(data).sort();

    selects.forEach(sel => {
      sel.innerHTML = "";
      codes.forEach(ccy => {
        const opt = document.createElement("option");
        opt.value = ccy;
        opt.textContent = ccy;
        sel.appendChild(opt);
      });
    });

    // Defaults
    fromSel.value = "USD";
    toSel.value   = "INR";
    setFlag(fromSel);
    setFlag(toSel);
    msg.textContent = "";
  } catch (e) {
    msg.textContent = "Could not load currency list!";
  }
}

// Convert on button click
btn.addEventListener("click", async (e) => {
  e.preventDefault();
  let amount = parseFloat(amountInp.value);
  if (isNaN(amount) || amount <= 0) amount = 1;

  msg.textContent = "Fetching rate…";

  try {
    const res = await fetch(
      `${API_URL}/latest?amount=${amount}&from=${fromSel.value}&to=${toSel.value}`
    );
    const data = await res.json();
    const rate = data.rates[toSel.value];
    msg.textContent = `${amount} ${fromSel.value} = ${rate} ${toSel.value}`;
  } catch (err) {
    msg.textContent = "Could not fetch rate. Try again.";
  }
});

// Change flag on currency change
selects.forEach(sel => sel.addEventListener("change", e => setFlag(e.target)));

// Swap currencies
if (swapIcon) {
  swapIcon.addEventListener("click", () => {
    const tmp = fromSel.value;
    fromSel.value = toSel.value;
    toSel.value = tmp;
    setFlag(fromSel);
    setFlag(toSel);
  });
}

// Init
loadCurrencies();