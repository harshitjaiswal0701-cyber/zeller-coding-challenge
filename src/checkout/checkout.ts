type SKU = "ipd" | "mbp" | "atv" | "vga";
interface Product {
  sku: SKU;
  name: string;
  price: number;
}
interface PricingRule {
  apply(items: SKU[], catalogue: Record<SKU, Product>): number;
}

const catalogue: Record<SKU, Product> = {
  ipd: { sku: "ipd", name: "Super iPad", price: 549.99 },
  mbp: { sku: "mbp", name: "MacBook Pro", price: 1399.99 },
  atv: { sku: "atv", name: "Apple TV", price: 109.50 },
  vga: { sku: "vga", name: "VGA adapter", price: 30.00 },
};

class ThreeForTwoRule implements PricingRule {
  constructor(private sku: SKU) {}
  apply(items: SKU[], catalogue: Record<SKU, Product>): number {
    const count = items.filter(i => i === this.sku).length;
    const product = catalogue[this.sku];
    const groupsOfThree = Math.floor(count / 3);
    const remainder = count % 3;
    return (groupsOfThree * 2 + remainder) * product.price;
  }
}

class BulkDiscountRule implements PricingRule {
  constructor(private sku: SKU, private minimum: number, private discountedPrice: number) {}
  apply(items: SKU[], catalogue: Record<SKU, Product>): number {
    const count = items.filter(i => i === this.sku).length;
    if (count > this.minimum) {
      return count * this.discountedPrice;
    }
    return count * catalogue[this.sku].price;
  }
}

class StandardPricingRule implements PricingRule {
  constructor(private sku: SKU) {}
  apply(items: SKU[], catalogue: Record<SKU, Product>): number {
    const count = items.filter(i => i === this.sku).length;
    return count * catalogue[this.sku].price;
  }
}

class Checkout {
  private items: SKU[] = [];
  private pricingRules: PricingRule[];
  constructor(pricingRules: PricingRule[]) {
    this.pricingRules = pricingRules;
  }
  scan(sku: SKU) {
    this.items.push(sku);
  }
  total(): number {
    let total = 0;
    // Group items by SKU first
    const itemCounts: Record<SKU, number> = {
      ipd: 0,
      mbp: 0,
      atv: 0,
      vga: 0,
    };
    for (const item of this.items) {
      itemCounts[item] = (itemCounts[item] || 0) + 1;
    }
    
    // Apply pricing rules for each SKU that was scanned
    for (const sku of Object.keys(itemCounts) as SKU[]) {
      const count = itemCounts[sku];
      // Find the pricing rule for this specific SKU
      const rule = this.pricingRules.find(r => {
        // Check if this rule is for this SKU by checking the rule's internal sku property
        return (r as any).sku === sku;
      });
      
      if (rule) {
        total += rule.apply(this.items, catalogue);
      } else {
        total += count * catalogue[sku].price;
      }
    }
    
    return parseFloat(total.toFixed(2));
  }
}

// Pricing rules setup
const pricingRules: PricingRule[] = [
  new ThreeForTwoRule("atv"),
  new BulkDiscountRule("ipd", 4, 499.99),
  new StandardPricingRule("mbp"),
  new StandardPricingRule("vga"),
];

export { Checkout, pricingRules, catalogue };
