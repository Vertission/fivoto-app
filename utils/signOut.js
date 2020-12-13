import { Auth } from 'aws-amplify';
import SyncStorage from 'sync-storage';
import { client } from '../service/apollo';

export default function singOut() {
  Auth.signOut();
  client.clearStore();
  SyncStorage.remove('@user_id');
  SyncStorage.remove('@user_email');
  SyncStorage.set('@sign', false);
  return true;
}
