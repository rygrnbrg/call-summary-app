import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lead } from '../../models/lead';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Rx';
import { User } from '..';
import { firestore } from 'firebase'
/*
  Generated class for the LeadsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LeadsProvider {
  private leadsCollectionRef: AngularFirestoreCollection;
  private leads$: Observable<firestore.DocumentData[]>;
  private static searchArrayName: string = "searchTermsArray";
  constructor(public http: HttpClient, private afStore: AngularFirestore, user: User) {

    let userData = user.getUserData();
    this.leadsCollectionRef = this.afStore.collection('users').doc(userData.email).collection('leads', ref=> ref.orderBy('created','desc'));
    this.leads$ = this.leadsCollectionRef.valueChanges();
  }

  get(): Observable<firestore.DocumentData[]> {
    return this.leads$;
  }

  add(item: Lead): Promise<firestore.DocumentReference> {
     return this.leadsCollectionRef.add(Object.assign({}, item));
  }

  delete(item: Lead) {

  }

}
