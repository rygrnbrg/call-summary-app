import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lead } from '../../models/lead';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Rx';
import { User } from '..';

/*
  Generated class for the LeadsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LeadsProvider {
  private leadsCollectionRef: AngularFirestoreCollection;
  private leads$: Observable<firebase.firestore.DocumentData[]>;

  constructor(public http: HttpClient, private afStore: AngularFirestore, user: User) {
    let userData = user.getUserData();
    this.leadsCollectionRef = this.afStore.collection('users').doc(userData.email).collection('leads');
    this.leads$ = this.leadsCollectionRef.valueChanges();
  }

  get(): Observable<firebase.firestore.DocumentData[]> {
    return this.leads$;
  }

  add(item: Lead): Promise<firebase.firestore.DocumentReference> {
    let itemObj = {
      phone: item.phone,
      name: item.name,
      created: item.created,
      avatar: item.avatar
    };
    return this.leadsCollectionRef.add(itemObj);
  }

  delete(item: Lead) {

  }

}
