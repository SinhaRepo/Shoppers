/**
 * Category-specific attribute schemas.
 * Each field has: key (JSON key), label (display), type (input type), options (for select/radio).
 * 'common' fields appear for ALL categories at the top.
 */

const COMMON_FIELDS = [
  { key: 'gstPercent', label: 'GST %', type: 'select', options: ['5', '12', '18', '28'] },
  { key: 'hsnCode', label: 'HSN Code', type: 'text' },
  { key: 'weight', label: 'Product Weight (grams)', type: 'number' },
  { key: 'countryOfOrigin', label: 'Country of Origin', type: 'text' },
];

const CATEGORY_SCHEMAS = {
  Electronics: [
    { key: 'modelName', label: 'Model Name', type: 'text' },
    { key: 'color', label: 'Color', type: 'text' },
    { key: 'powerVoltage', label: 'Power / Voltage', type: 'text' },
    { key: 'warrantyPeriod', label: 'Warranty Period', type: 'text' },
  ],
  Computers: [
    { key: 'modelName', label: 'Model Name', type: 'text' },
    { key: 'color', label: 'Color', type: 'text' },
    { key: 'systemRequirements', label: 'System Requirements / Compatibility', type: 'text' },
    { key: 'warrantyPeriod', label: 'Warranty Period', type: 'text' },
  ],
  Shoes: [
    { key: 'size', label: 'Size (IND/UK)', type: 'select', options: ['5 UK','6 UK','7 UK','8 UK','9 UK','10 UK','11 UK','12 UK'] },
    { key: 'color', label: 'Color', type: 'text' },
    { key: 'outerMaterial', label: 'Outer Material', type: 'text' },
    { key: 'soleMaterial', label: 'Sole Material', type: 'text' },
    { key: 'fasteningBackDetail', label: 'Fastening & Back Detail', type: 'select', options: ['Lace-Up','Slip-On','Velcro','Buckle','Zip'] },
  ],
  Clothing: [
    { key: 'size', label: 'Size', type: 'select', options: ['XS','S','M','L','XL','XXL','28','30','32','34','36','38','40','42','44'] },
    { key: 'color', label: 'Color', type: 'text' },
    { key: 'fabric', label: 'Fabric', type: 'text' },
    { key: 'patternPrintType', label: 'Pattern / Print Type', type: 'text' },
    { key: 'neckSleeveType', label: 'Neck Type / Sleeve Length', type: 'text' },
  ],
  Watches: [
    { key: 'color', label: 'Color', type: 'text' },
    { key: 'strapMaterial', label: 'Strap Material', type: 'text' },
    { key: 'dialColor', label: 'Dial Color', type: 'text' },
    { key: 'dialShape', label: 'Dial Shape', type: 'select', options: ['Round','Square','Rectangular','Octagonal','Oval'] },
    { key: 'displayType', label: 'Display Type', type: 'select', options: ['Analog','Digital','Analog-Digital','Digital AMOLED','Digital LCD'] },
  ],
  Wearables: [
    { key: 'modelName', label: 'Model Name', type: 'text' },
    { key: 'color', label: 'Color', type: 'text' },
    { key: 'strapMaterial', label: 'Strap Material', type: 'text' },
    { key: 'compatibleOS', label: 'Compatible OS', type: 'text' },
    { key: 'warrantyPeriod', label: 'Warranty Period', type: 'text' },
  ],
  Bags: [
    { key: 'color', label: 'Color', type: 'text' },
    { key: 'material', label: 'Material', type: 'text' },
    { key: 'sizeDimensions', label: 'Size / Dimensions', type: 'text' },
    { key: 'compartments', label: 'No. of Compartments', type: 'text' },
    { key: 'fasteningType', label: 'Fastening Type', type: 'text' },
  ],
  Cameras: [
    { key: 'modelName', label: 'Model Name', type: 'text' },
    { key: 'color', label: 'Color', type: 'text' },
    { key: 'resolutionMegapixels', label: 'Resolution / Megapixels', type: 'text' },
    { key: 'batteryType', label: 'Battery Type', type: 'text' },
    { key: 'warrantyPeriod', label: 'Warranty Period', type: 'text' },
  ],
  Audio: [
    { key: 'modelName', label: 'Model Name', type: 'text' },
    { key: 'color', label: 'Color', type: 'text' },
    { key: 'type', label: 'Type', type: 'select', options: ['Wired','Wireless Bluetooth','Wireless TWS','Wireless RF'] },
    { key: 'micCapability', label: 'Mic Capability', type: 'select', options: ['Yes','No'] },
    { key: 'warrantyPeriod', label: 'Warranty Period', type: 'text' },
  ],
  Storage: [
    { key: 'capacity', label: 'Capacity (GB/TB)', type: 'text' },
    { key: 'interfaceType', label: 'Interface Type', type: 'text' },
    { key: 'warrantyPeriod', label: 'Warranty Period', type: 'text' },
  ],
  'Home Appliances': [
    { key: 'modelName', label: 'Model Name', type: 'text' },
    { key: 'color', label: 'Color', type: 'text' },
    { key: 'capacityVolume', label: 'Capacity / Volume', type: 'text' },
    { key: 'material', label: 'Material', type: 'text' },
    { key: 'warrantyPeriod', label: 'Warranty Period', type: 'text' },
  ],
  Accessories: [
    { key: 'compatibleModels', label: 'Compatible Models', type: 'text' },
    { key: 'color', label: 'Color', type: 'text' },
    { key: 'material', label: 'Material', type: 'text' },
    { key: 'type', label: 'Type (e.g. Cover, Cable)', type: 'text' },
  ],
};

/**
 * Get the combined field list for a category.
 * Category-specific fields first, then common fields.
 */
export const getFieldsForCategory = (category) => {
  const specific = CATEGORY_SCHEMAS[category] || [];
  return [...specific, ...COMMON_FIELDS];
};

/**
 * Label map: JSON key → human-readable label. Used by ProductDetail specs table.
 */
export const ATTRIBUTE_LABELS = {};
Object.values(CATEGORY_SCHEMAS).forEach((fields) => {
  fields.forEach((f) => { ATTRIBUTE_LABELS[f.key] = f.label; });
});
COMMON_FIELDS.forEach((f) => { ATTRIBUTE_LABELS[f.key] = f.label; });

export { CATEGORY_SCHEMAS, COMMON_FIELDS };
