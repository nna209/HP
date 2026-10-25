const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');

function setup({ valid = true, search = '' } = {}) {
  const handlers = {};
  class Select { value = ''; }
  const select = new Select();
  class Form {
    elements = { namedItem: () => select };
    reportValidity() { return valid; }
    addEventListener(name, handler) { handlers[name] = handler; }
  }
  const form = new Form();
  const message = { textContent: '' };
  const location = { search, href: '' };
  const fields = {
    company: 'テスト組織', name: 'テスト担当者', email: 'test@example.test',
    tel: '', category: 'サービスのご相談', message: 'ご相談です。\n採用 + 育成 & 共創について？',
  };
  vm.runInNewContext(source, {
    document: {
      querySelector: s => s === '#contactForm' ? form : s === '#formMessage' ? message : null,
      addEventListener() {},
    },
    window: { location, matchMedia: () => ({ addEventListener() {} }) },
    HTMLFormElement: Form, HTMLSelectElement: Select, Element: class {},
    URLSearchParams,
    FormData: class { get(name) { return fields[name] ?? null; } },
  });
  return { submit: () => handlers.submit({ preventDefault() {} }), location, message, select, fields };
}

test('invalid input does not open a mail draft', () => {
  const state = setup({ valid: false });
  state.submit();
  assert.equal(state.location.href, '');
  assert.equal(state.message.textContent, '');
});

test('draft keeps the intended recipient and encodes the message', () => {
  const state = setup();
  state.submit();
  const draft = new URL(state.location.href);
  assert.equal(draft.protocol, 'mailto:');
  assert.equal(draft.pathname, 'nomuraena@e-na.jp');
  assert.equal(draft.searchParams.get('subject'), 'Enaサイトからのお問い合わせ');
  assert.ok(draft.searchParams.get('body').includes(state.fields.message));
  assert.ok(!state.message.textContent.includes('nomuraena@e-na.jp'));
  assert.ok(state.message.textContent.includes('まだ送信されていません'));
});

test('contact links preselect the requested topic', () => {
  assert.equal(setup({ search: '?category=student' }).select.value, '学生の参加について');
  assert.equal(setup({ search: '?category=service' }).select.value, 'サービスのご相談');
});
