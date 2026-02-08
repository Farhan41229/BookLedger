import * as Radix from 'radix-ui';
console.log('Radix keys:', Object.keys(Radix));
if (Radix.Switch) {
  console.log('Switch keys:', Object.keys(Radix.Switch));
} else {
  console.log('Switch is undefined in radix-ui');
}
