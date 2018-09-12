import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import '@firebase/auth';
import { authState } from 'rxfire/auth';
import { filter } from 'rxjs/operators';

export { firebase, collectionData, authState, filter };
