const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
new vm.Script(script);
const core = script.slice(script.indexOf('  const NOISE_PREVIEW_LIMITS'), script.indexOf('  function t(key)'));
const wavCore = script.slice(script.indexOf('  function bytesToAscii'), script.indexOf('  function updateTopbar'));
const context = vm.createContext({ Float32Array, Uint8Array, DataView, t: key => key });
vm.runInContext(core + wavCore + '\nthis.preview = prepareNoisePreview; this.exportWav = exportEditedWav;', context);
const rate = 48000;
const wave = (n, amplitude) => Float32Array.from({ length: n }, (_, i) => amplitude * Math.sin(i * 2 * Math.PI * 440 / rate));
let checks = 0;
function check(name, fn) { fn(); checks++; console.log('PASS ' + name); }
function bounds(result) {
  const ceiling = 10 ** (-12 / 20);
  const rmsCeiling = 10 ** (-18 / 20);
  for (const ch of result.channels) {
    let sum = 0;
    const w = Math.min(ch.length, 2400);
    for (let i = 0; i < ch.length; i++) {
      assert.ok(Number.isFinite(ch[i]) && Math.abs(ch[i]) <= ceiling);
      sum += ch[i] ** 2;
      if (i >= w) sum -= ch[i-w] ** 2;
      if (i >= w-1) assert.ok(Math.sqrt(Math.max(0, sum / w)) <= rmsCeiling + 1e-9);
    }
  }
}
for (const type of ['quiet', 'click', 'music', 'sparse', 'single', 'hot-float']) {
  check(type + ' output bounds and unchanged source', () => {
    const ch = wave(type === 'single' ? 1 : rate, type === 'music' ? 0.9 : type === 'hot-float' ? 12 : 0.001);
    if (type === 'click') ch[700] = 1;
    if (type === 'single') ch[0] = 0.001;
    if (type === 'sparse') { ch.fill(0); ch.set(wave(2400, 0.01), 20000); }
    const before = ch.slice();
    const result = context.preview([ch], 0, ch.length, rate);
    bounds(result);
    assert.deepEqual(ch, before);
    // A 0.001-amplitude sine should reach the former High profile's -18 dBFS RMS.
    if (type === 'quiet') assert.ok(result.gainDb > 44.9 && result.gainDb < 45.1);
  });
}
check('silence is not played', () => assert.equal(context.preview([new Float32Array(100)], 0, 100, rate).silent, true));
check('invalid audio fails closed', () => {
  for (const value of [NaN, Infinity, -Infinity]) assert.throws(() => context.preview([new Float32Array([value])], 0, 1, rate));
});
check('maximum boost is 60 dB', () => assert.ok(context.preview([wave(500, 1e-12)], 0, 500, rate).gainDb <= 60));
check('stereo uses shared gain', () => {
  const left = wave(5000, 0.001), right = Float32Array.from(left, x => x * 0.5);
  const p = context.preview([left, right], 0, 5000, rate);
  for (let i = 0; i < left.length; i++) assert.equal(p.channels[1][i], p.channels[0][i] * 0.5);
});
check('multichannel is explicitly mixed before measuring', () => {
  const p = context.preview(Array.from({length:8}, () => wave(5000, 0.01)), 0, 5000, rate);
  assert.equal(p.channels.length, 1); bounds(p);
});
function fixture() {
  const frames = rate * 6, b = Buffer.alloc(44 + frames * 4);
  b.write('RIFF'); b.writeUInt32LE(b.length - 8, 4); b.write('WAVEfmt ', 8);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(2, 22);
  b.writeUInt32LE(rate, 24); b.writeUInt32LE(rate * 4, 28); b.writeUInt16LE(4, 32); b.writeUInt16LE(16, 34);
  b.write('data', 36); b.writeUInt32LE(frames * 4, 40);
  for (let i=0; i<frames; i++) {
    const amp = i > rate * 2 && i < rate * 4 ? 20000 : 40;
    const s = Math.round(amp * Math.sin(i * 2 * Math.PI * 440 / rate));
    b.writeInt16LE(s, 44+i*4); b.writeInt16LE(Math.round(s/2), 46+i*4);
  }
  return b;
}
check('preview leaves WAV export byte-exact', () => {
  const b = fixture(), source = b.buffer.slice(b.byteOffset, b.byteOffset+b.length);
  const info = context.parseWav(source), channels = context.decodeToFloatChannels(source, info);
  context.preview(channels, 0, rate, rate);
  assert.deepEqual(Buffer.from(context.exportWav(source, [])), b);
});
console.log(`${checks} checks passed`);
module.exports = { fixture };
