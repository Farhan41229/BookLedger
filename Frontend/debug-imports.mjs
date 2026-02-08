import CountUp from 'react-countup';
import * as CountUpNamespace from 'react-countup';
import * as Radix from 'radix-ui';
import * as Lucide from 'lucide-react';

console.log('CountUp default type:', typeof CountUp);
console.log('CountUp namespace keys:', Object.keys(CountUpNamespace));
console.log('Radix Switch type:', typeof Radix.Switch);
if (Radix.Switch) {
    console.log('Radix Switch keys:', Object.keys(Radix.Switch));
}
console.log('Lucide Zap type:', typeof Lucide.Zap);
