// Test checkbox case sensitivity fix
import { setCheckboxForValue } from './src/utils/excel/checkbox.js';

// Mock cell object
const mockCell = { value: '' };

console.log('Testing setCheckboxForValue with case sensitivity:\n');

// Test 1: lowercase "pea" should check PEA
setCheckboxForValue(mockCell, 'pea', 'PEA', 'PEA');
console.log('Test 1 - API value "pea" vs checkValue "PEA":');
console.log('Result:', mockCell.value);
console.log('Expected: ☑ PEA\n');

// Test 2: uppercase "PEA" should check PEA
mockCell.value = '';
setCheckboxForValue(mockCell, 'PEA', 'PEA', 'PEA');
console.log('Test 2 - API value "PEA" vs checkValue "PEA":');
console.log('Result:', mockCell.value);
console.log('Expected: ☑ PEA\n');

// Test 3: lowercase "mea" should NOT check PEA
mockCell.value = '';
setCheckboxForValue(mockCell, 'mea', 'PEA', 'PEA');
console.log('Test 3 - API value "mea" vs checkValue "PEA":');
console.log('Result:', mockCell.value);
console.log('Expected: ☐ PEA\n');

// Test 4: MEA checkbox manual check
const meaTestLower = ('pea' || '').toLowerCase() === 'mea' ? '☑ MEA' : '☐ MEA';
const meaTestUpper = ('mea' || '').toLowerCase() === 'mea' ? '☑ MEA' : '☐ MEA';

console.log('Test 4 - MEA checkbox logic:');
console.log('When value is "pea":', meaTestLower, '(Expected: ☐ MEA)');
console.log('When value is "mea":', meaTestUpper, '(Expected: ☑ MEA)');
