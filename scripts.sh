#/bin/sh

run_prettier() {
  prettier -c *.mjs
}

run_eslint() {
  eslint *.mjs
}

run_testami() {
  testami *_test.mjs
}


watch_test() {
  while true; do
    inotifywait -e modify -e move -e create -e delete .;
    run_testami
  done
}

run_debug() {
  node --inspect-brk -i `which testami` *_test.mjs
}

cover() {
  nyc instrument . ./output &&
  nyc --reporter=text-lcov testami output/*_test.mjs > coverage.lcov
  rm -rf output
}

lint_test() {
  run_prettier && run_eslint && run_testami
}

lint() {
  run_prettier && run_eslint
}
