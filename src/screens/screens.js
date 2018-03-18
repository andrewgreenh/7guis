import CellsPage from './cells/CellsPage';
import CircleDrawerPage from './circle-drawer/CircleDrawerPage';
import CounterPage from './counter/CounterPage';
import CrudPage from './crud/CrudPage';
import FlightBookerPage from './flight-booker/FlightBookerPage';
import TemperatureConverterPage from './temperature-converter/TemperatureConverterPage';
import TimerPage from './timer/TimerPage';

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
  },
  {
    path: '/flight-booker',
    name: 'Flight Booker',
    component: FlightBookerPage
  },
  {
    path: '/timer',
    name: 'Timer',
    component: TimerPage
  },
  {
    path: '/crud',
    name: 'CRUD',
    component: CrudPage
  },
  {
    path: '/circle-drawer',
    name: 'Circle Drawer',
    component: CircleDrawerPage
  },
  {
    path: '/cells',
    name: 'Cells',
    component: CellsPage
  }
];
