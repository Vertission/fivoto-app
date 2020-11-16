import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

if (process.env.NODE_ENV === 'production') LogBox.ignoreAllLogs();

AppRegistry.registerComponent(appName, () => App);
