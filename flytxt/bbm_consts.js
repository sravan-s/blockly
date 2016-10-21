// To store constants
bbm.Consts = {};
// Register a block here before using
bbm.Consts.BLOCKS = {
  FLYTXT: 'flytxt',
  DELIMITER: 'delimiter',
  FIELD_EXTRACTOR: 'field_extractor',
  DYNAMIC: 'dynamic',
  LOOKUP: 'lookup',
  TP_CONSTANT: 'tp_constant',
  CONTROLS_IF: 'controls_if',
  TEST: 'test',
  LISTS_CREATE_WITH: 'lists_create_with',
  EVENT_FIELD: 'event_field',
  TERNARY: 'ternary',
  OUTPUT_FIELD: 'output_field',
  LISTS_CREATE_WITH_STREAM: 'lists_create_with_stream',
};

bbm.Consts.DYNAMIC_OPERATIONS= {
  after: "$1 = tpDate.after(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3);||boolean||binary",
  before: "$1 = tpDate.before(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3);||boolean||binary",
  differenceInMillis: "$1 = tpDate.differenceInMillis(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3);||Marker||binary",
  convertDate: "$1 = tpDate.convertDate(m$2.getData() == null ? data: m$2.getData(), m$2, MarkerFactory, m$3);||Marker||unary",

  contains: "$1 = tpString.contains(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3);||boolean||binary",
  containsIgnoreCase: "$1 = tpString.containsIgnoreCase(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3);||boolean||binary",
  endsWith: "$1 = tpString.endsWith(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3);||boolean||binary",
  endsWithIgnore: "$1 = tpString.endsWithIgnore(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3);||boolean||binary",
  extractLeading: "$1 = tpString.extractLeading(m$2.getData() == null ? data: m$2.getData(), $1, integer);||Marker||binary",
  extractTrailing: "$1 = tpString.extractTrailing(m$2.getData() == null ? data: m$2.getData(), $1, integer);||Marker||binary",
  indexOf: "$1 = tpString.indexOf(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3);||Marker||binary",
  indexOfIgnoreCase: "$1 = tpString.indexOfIgnoreCase(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3);||Marker||binary",
  merge: "$1 = tpString.merge(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3);||Marker||binary",
  startsWith: "$1 = tpString.startsWith(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3);||boolean||binary",
  toLowerCase: "$1 = tpString.toLowerCase(m$2.getData() == null ? data: m$2.getData(), m$2);||Marker||unary",
  toTitleCase: "$1 = tpString.toTitleCase(m$2.getData() == null ? data: m$2.getData(), m$2);||Marker||unary",
  toUpperCase: "$1 = tpString.toUpperCase(m$2.getData() == null ? data: m$2.getData(), m$2);||Marker||unary",
  isNull: "$1 = tpString.isNull(m$2.getData() == null ? data: m$2.getData(), m$2);||boolean||unary",
  length: "$1 = tpString.length(m$2.getData() == null ? data: m$2.getData(), m$2);||Marker||unary",
  rTrim: "$1 = tpString.rTrim(m$2.getData() == null ? data: m$2.getData(), m$2);||Marker||unary",
  lTrim: "$1 = tpString.lTrim(m$2.getData() == null ? data: m$2.getData(), m$2);||Marker||unary",
  trim: "$1 = tpString.trim(m$2.getData() == null ? data: m$2.getData(), m$2);||Marker||unary",


  addDouble: "$1 = tpMath.addDouble(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||Marker||binary",
  addLong: "$1 = tpMath.addLong(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||Marker||binary",
  eq: "$1 = tpMath.eq(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||boolean||binary",
  greaterEqThan: "$1 = tpMath.greaterEqThan(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||boolean||binary",
  greaterThan: "$1 = tpMath.greaterThan(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||boolean||binary",
  lessEqThan: "$1 = tpMath.lessEqThan(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||boolean||binary",
  lessThan: "$1 = tpMath.lessThan(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||boolean||binary",
  max: "$1 = tpMath.max(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||Marker||binary",
  min: "$1 = tpMath.min(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||Marker||binary",
  subDouble: "$1 = tpMath.subDouble(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||Marker||binary",
  subLong: "$1 = tpMath.subLong(m$2.getData() == null ? data: m$2.getData(), m$2, m$3.getData() == null ? data: m$3.getData(), m$3, mf);||Marker||binary",
  abs: "$1 =tpMath.abs(m$2.getData() == null ? data: m$2.getData(), m$2, mf);||Marker||unary",
  ceil: "$1 =tpMath.ceil(m$2.getData() == null ? data: m$2.getData(), m$2, mf);||Marker||unary",
  round: "$1 =tpMath.round(m$2.getData() == null ? data: m$2.getData(), integer, m$2, mf);||Marker||unary",
  floor: "$1 =tpMath.floor(m$2.getData() == null ? data: m$2.getData(), m$2, mf);||Marker||unary",
  isNumber: "$1 =tpMath.isNumber(m$2.getData() == null ? data: m$2.getData(), m$2, mf);||boolean||unary",
  extractDecimalFractionPart: "$1 =tpMath.extractDecimalFractionPart(m$2.getData() == null ? data: m$2.getData(), m$2, mf);||Marker||unary",
  extractDecimalIntegerPart: "$1 =tpMath.extractDecimalIntegerPart(m$2.getData() == null ? data: m$2.getData(), m$2, mf);||Marker||unary",
  toMarker: "$1 =tpMath.toMarker(m$2 , mf);||Marker||unary",
  toMarker: "$1 =tpMath.toMarker(m$2, mf);||Marker||unary",
  and: "$1 = tpLogic.and(m$2, m$3);||Marker||binary",
  or: "$1 = tpLogic.or(m$2, m$3);||Marker||binary",
  not: "$1 = tpLogic.not(m$2)||boolean||unary"
}
bbm.Consts.TEST_OPERATIONS= {

  "after":"tpDate.after(data, $1, data, $2)",
  "before":"tpDate.before(data, $1, data, $2)",
  "contains":"tpString.contains(data, $1, data, $2)",
  "containsIgnoreCase":"tpString.containsIgnoreCase(data, $1, data, $2)",
  "endsWith":"tpString.endsWith(data, $1, data, $2)",
  "endsWithIgnore":"tpString.endsWithIgnore(data, $1, data, $2)",
  "startsWith":"tpString.startsWith(data, $1, data, $2)",
  "eq":"tpMath.eq(data, $1, data, $2, mf)",
  "greaterEqThan":"tpMath.greaterEqThan(data, $1, data, $2, mf)",
  "greaterThan":"tpMath.greaterThan(data, $1, data, $2, mf)",
  "lessEqThan":"tpMath.lessEqThan(data, $1, data, $2, mf)",
  "lessThan":"tpMath.lessThan(data, $1, data, $2, mf)"
}
bbm.Consts.STREAM_EVENT_OPERATIONS= {
  "AGG_AND_TIME" : "AGG_AND_TIME",
  "AGG_ONLY" : "AGG_ONLY",
  "TIME_ONLY" : "TIME_ONLY",
  "DEFAULT_STATEFULL" : "DEFAULT_STATEFULL",
  "STATELESS" : "STATELESS"
}
bbm.Consts.MARKER_CHECK = {
    'TRUE': 'TpConstant.booleanTrueMarker',
    'FALSE': 'TpConstant.booleanFalseMarker'
} 