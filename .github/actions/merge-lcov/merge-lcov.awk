# Merges LCOV tracefiles that describe the same sources, summing hit counts so
# a sharded test run reports the same totals as a single run would. Vitest
# shards each emit a report for every source file (coverage.all is on), so the
# same DA/FNDA records repeat across shards and have to be added rather than
# overwritten. Totals (LF/LH/FNF/FNH) are recomputed from the summed counters
# instead of being added, since summing them would multiply by the shard count.
# Branch records are stripped before this runs, so only line and function
# counters are handled.
#
# Usage: awk -f merge-lcov.awk shard-1.info shard-2.info ... > lcov.info
/^SF:/ {
  sf = substr($0, 4)
  if (!(sf in sf_seen)) {
    sf_seen[sf] = 1
    sf_order[++sf_count] = sf
  }
  next
}
# FN is either "FN:<line>,<name>" or "FN:<start>,<end>,<name>", so the name is
# what follows the last comma; keep the leading fields verbatim so whichever
# form the coverage provider emits is reproduced unchanged.
/^FN:/ {
  rest = substr($0, 4)
  comma = 0
  for (p = length(rest); p > 0; p--) {
    if (substr(rest, p, 1) == ",") { comma = p; break }
  }
  if (comma == 0) next
  name = substr(rest, comma + 1)
  key = sf SUBSEP name
  if (!(key in fn_prefix)) {
    fn_prefix[key] = substr(rest, 1, comma)
    fn_names[sf] = fn_names[sf] (fn_names[sf] == "" ? "" : RS) name
  }
  next
}
/^FNDA:/ {
  rest = substr($0, 6)
  comma = index(rest, ",")
  if (comma == 0) next
  name = substr(rest, comma + 1)
  fn_hits[sf SUBSEP name] += substr(rest, 1, comma - 1)
  next
}
/^DA:/ {
  rest = substr($0, 4)
  comma = index(rest, ",")
  if (comma == 0) next
  lineno = substr(rest, 1, comma - 1)
  key = sf SUBSEP lineno
  if (!(key in da_seen)) {
    da_seen[key] = 1
    da_order[sf] = da_order[sf] (da_order[sf] == "" ? "" : RS) lineno
  }
  da_hits[key] += substr(rest, comma + 1)
  next
}
END {
  for (i = 1; i <= sf_count; i++) {
    sf = sf_order[i]
    print "TN:"
    print "SF:" sf

    fn_found = 0
    fn_hit = 0
    fn_count = split(fn_names[sf], names, RS)
    for (j = 1; j <= fn_count; j++) {
      if (names[j] == "") continue
      fn_found++
      print "FN:" fn_prefix[sf SUBSEP names[j]] names[j]
    }
    for (j = 1; j <= fn_count; j++) {
      if (names[j] == "") continue
      hits = fn_hits[sf SUBSEP names[j]] + 0
      if (hits > 0) fn_hit++
      print "FNDA:" hits "," names[j]
    }
    print "FNF:" fn_found
    print "FNH:" fn_hit

    lines_found = 0
    lines_hit = 0
    line_count = split(da_order[sf], lines, RS)
    for (j = 1; j <= line_count; j++) {
      if (lines[j] == "") continue
      lines_found++
      hits = da_hits[sf SUBSEP lines[j]] + 0
      if (hits > 0) lines_hit++
      print "DA:" lines[j] "," hits
    }
    print "LF:" lines_found
    print "LH:" lines_hit
    print "end_of_record"
  }
}
