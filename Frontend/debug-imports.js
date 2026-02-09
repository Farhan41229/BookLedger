import CountUp from 'react-countup';
import * as CountUpNamespace from 'react-countup';
import * as Radix from 'radix-ui';
import * as SwitchLocal from './src/components/ui/switch.jsx';

console.log('CountUp default type:', typeof CountUp);
console.log('CountUp namespace keys:', Object.keys(CountUpNamespace));
console.log('Radix Switch type:', typeof Radix.Switch);
console.log('Local Switch export keys:', Object.keys(SwitchLocal));
console.log('Local Switch.Switch type:', typeof SwitchLocal.Switch);
