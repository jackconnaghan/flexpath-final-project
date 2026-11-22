// Runs before each test file (see jest.config.cjs).

// jsdom doesn't implement <dialog>'s methods, so your modals would crash with
// "showModal is not a function". These stubs make them no-ops.
if (typeof HTMLDialogElement !== "undefined") {
  HTMLDialogElement.prototype.showModal = jest.fn();
  HTMLDialogElement.prototype.close = jest.fn();
}

// Same idea as your backend @BeforeEach rebuilding the database:
// every test starts from a clean slate.
beforeEach(() => {
  if (typeof sessionStorage !== "undefined") sessionStorage.clear();
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});