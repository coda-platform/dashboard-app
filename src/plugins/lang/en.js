const en = {
  langCode: "en",

  loading: "Loading...",

  home_new_patient: "Number of tests performed",
  home_new_case: "New cases today",
  home_daily_death: "New deaths today",

  home_positive_rate_per_site: "Positivity rate over time",
  home_new_case_per_site: "Positive cases over time",
  home_hospitalisation_rate: "Hospitalizations over time",

  icu: "Intensive care bed occupation",
  hospitalization: "Hospital bed occupation",
  home_total_occupation: " Total bed occupancy rate",

  length_of_stay: "Distribution of length of stay by site",
  age: "Distribution of age by site",
  "h/f": "Distribution of sex by COVID status",

  home_positivity: " Positivity Rate:{positivity} %",
  home_average: "Avg. float. {average}",
  home_rt: " Rate Rt. {rate}",

  covid_cases: "Number of covid cases",
  death: "Number of death",
  ventilator: "Number of patient on ventilator",

  titleTxt: "Select data",
  langTxt: "Fr",
  logoutTxt: "logout",
  siteTitleTxt: "Connected repositories",
  selectVariableTxt:
    "Please select a variable among cross-site common resources: ",
  age_groups: "Age groups",
  selectDaysTxt: "Days of selection from now",
  selectHospitalTxt: "Select hospitals to include: ",
  selectAllTxt: "Select all",
  unselectAllTxt: "Un-select all",
  selectTxt: "Select",
  runQueryTxt: "Run query",

  noData: "No data available",

  filters: "Filters",
  fields: "Fields",

  selectMeasuresTxt: "Select measures to retrive:",
  continuous: "Continuous variables",
  discreet: "Discreet",
  addNewMeasure: "+ Add New Measure",

  resourceTxt: "Resources",
  selectFieldTxt: "Select field(s)",
  resources_add: "Add (+)",

  disableBreakdown: "Disable Breakdown",
  enableBreakdown: "Enable Breakdown",

  selectBreakdownTxt: "Breakdown",
  selectBreakdownByTxt: "Breakdown by",
  selectResourceTypeTxt: "Resource type",
  selectResourceAttributeTxt: "Resource attribute",
  selectResourcePatient: "Patient",
  selectResourceAttributeAge: "Age",
  selectResourceAttributeSex: "Sex",
  selectResourceAttributeDeathDate: "deceasedDateTime",

  breakdownStart: "Start (lower limit)",
  breakdownEnd: "End (upper limit)",
  breakdownStep: "Stride (step size)",
  breakdownSteps: "steps",
  breakdownDays: "days",

  contTxt: "Continuous variables (e.g. age)",
  discTxt: "Discrete (e.g. gender)",
  selectContTxt: "Select continuous measure(s)",
  selectDiscTxt: "Select discrete measure(s) ",

  resultsTxt: "Results",
  tableTxt: "Table ",
  figureTxt: "Figure ",

  summary_age_key: "Summary Of Patient.age",
  summary_gender_key: "Summary Of Patient.gender",
  summary_age_site_strat_key:
    "Summary of Patient.age at each site, broken down by Patient.gender",

  summary_gender_site_key: "Summary of Patient.gender at each site",
  summary_age_site_key: "Summary of Patient.age at each site",
  summary_deceased_strat_key:
    "Patient.deceased.value, broken down by Patient.deathDate in bins of 14 days",

  male: "male ",
  female: "female ",

  site: "site ",
  mean: "mean ",
  stdev: "stdev0 ",
  ci95: "ci95 ",
  count: "count ",

  newSearchTxt: "New Search",
  summaryTxt: "Summary",
  keyVariablesTxt: "Key Variables",
  legendTxt: "Legend",
  meanTxt: "Mean",
  saveImgTxt: "Save Image",
  tested: "Number Tested",
  positive: "Number Positive",
  admitted: "Number Admitted",
  mean_age: "Mean Age",
  total: "Total",

  age_0_to_4: "0 to 4 yrs",
  age_5_to_19: "5 to 19 yrs",
  age_20_to_49: "20 to 49 yrs",
  age_50_to_64: "50 to 64 yrs",
  age_65_and_up: "65 and up",

  homeTxt: "Home",
  statsTxt: "Stats",
  learningTxt: "Learning",
  docsApiTxt: "API",
  activeConnectionsTxt: "Active Connections",
  noActiveConnectionsTxt: "No active connection",
  requestAccessTxt: "Request access",
  hubNotConnectedTxt: "HUB Disconnected",
  homeMetricsTxt: "HM",
  learningTitle: "Learning",
  federated_simulation: "Launch a federated learning model.",

  requestAccessDescriptionTxt: " To get access to CODA, contact this person",
  mailRequestAccessTxt:
    "mailto:address_a_determiner@coda.ca?subject=Request access",

  QB_name: "name",
  QB_category: "category",
  QB_sex: "sex",
  QB_deceased: "deceased",
  QB_deceased_date: "date of death",
  QB_in_stock: "in stock",
  QB_yes: "yes",
  QB_no: "no",
  QB_age: "age",
  QB_price: "price",
  QB_identifier: "identifier",

  prepareRequestTxt: "Prepare Request",
  TrainRequestTxt: "Train Request",
  sendPrepareTxt: "Send Prepare Request",
  sendTrainTxt: "Send Train Request",
  evaluateResultTxt: "Evaluation Results",
  countResultTxt: "Data Count",
};
export default en;
