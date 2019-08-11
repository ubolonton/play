const PREC = {
  compare: 2,
}

module.exports = grammar({
  name: 'test',

  word: $ => $.identifier,

  rules: {
    source_file: $ => $._expr,

    _expr: $ => choice(
      $._primary_expr,
      $.binary_expr,
    ),

    binary_expr: $ => choice(
      ...[
        ['<', PREC.compare],
      ].map(([operator, precedence]) => prec.left(precedence, seq(
        // Doesn't segfault if we don't use fields.
        field('left', $._expr),
        field('operator', operator),
        field('right', $._expr)
      )))
    ),

    _primary_expr: $ => choice(
      $.path,
      $.integer,
    ),

    // ---------------------------------------------------------------

    path: $ => sep1($.identifier, '.'),

    identifier: $ => /[a-zA-Z\$_][a-zA-Z0-9\$_]*/,

    integer: $ => seq(optional('-'), /[0-9]+/),
  }
});

function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)))
}
