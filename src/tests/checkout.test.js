const { Checkout, pricingRules } = require("../checkout/checkout");

describe("Checkout System", () => {
  test("atv, atv, atv, vga - Apple TV special", () => {
    const co = new Checkout(pricingRules);
    co.scan("atv");
    co.scan("atv");
    co.scan("atv");
    co.scan("vga");
    expect(co.total()).toBe(249.0);
  });

  test("atv, ipd, ipd, atv, ipd, ipd, ipd - iPad bulk discount", () => {
    const co = new Checkout(pricingRules);
    co.scan("atv");
    co.scan("ipd");
    co.scan("ipd");
    co.scan("atv");
    co.scan("ipd");
    co.scan("ipd");
    co.scan("ipd");
    expect(co.total()).toBe(2718.95);
  });

  test("mbp, vga, mbp, mbp", () => {
    const co = new Checkout(pricingRules);
    co.scan("mbp");
    co.scan("vga");
    co.scan("mbp");
    co.scan("mbp");
    expect(co.total()).toBe(4229.97);
  });
});
