import CounterPage from './counter/CounterPage';
import TemperatureConverterPage from './temperature-converter/TemperatureConverterPage';

export default [
  {
    path: '/counter',
    name: 'Counter',
    component: CounterPage
  },
  {
    path: '/temperature-converter',
    name: 'Temperature Converter',
    component: TemperatureConverterPage
  }
];
