import { LeadFilter } from "./../../models/lead-filter";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Lead } from "../../models/lead";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  Query
} from "angularfire2/firestore";
import { Observable } from "rxjs/Rx";
import { User } from "..";
import { firestore } from "firebase";
import { LeadPropertyType } from "../../models/lead-property-metadata";
/*
  Generated class for the LeadsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LeadsProvider {
  private leadsCollectionRef: AngularFirestoreCollection;
  private leads$: Observable<firestore.DocumentData[]>;
  private static arrayToDbObjectsKeys = ["type", "property", "rooms"];
  private static standardLeadKeys = [
    "avatar",
    "name",
    "phone",
    "created",
    "budgetMin",
    "budgetMax",
    "area",
    "source"
  ];

  constructor(
    public http: HttpClient,
    private afStore: AngularFirestore,
    user: User
  ) {
    let userData = user.getUserData();
    this.leadsCollectionRef = this.afStore
      .collection("users")
      .doc(userData.email)
      .collection("leads", ref => ref.orderBy("created", "desc"));
    this.leads$ = this.leadsCollectionRef.valueChanges();
  }

  get(): Observable<firestore.DocumentData[]> {
    return this.leads$;
  }

  filter(filters: LeadFilter[]): Query {
    let query: Query = this.leadsCollectionRef.ref;

    filters
      .filter(filter => filter.metadata.type === LeadPropertyType.StringSinglValue)
      .forEach(filter => {
        if (filter.metadata.options) {
          filter.metadata.options
            .filter(option => option.selected)
            .forEach(option => {
              let optionFieldName = this.getKeyValueDbName(
                filter.id,
                option.title
              );
              query = query.where(optionFieldName, "==", true);
            });
        }
      });

    return query;
  }

  add(item: Lead): Promise<firestore.DocumentReference> {
    let dbObject = this.getLeadDbObject(item);
    return this.leadsCollectionRef.add(dbObject);
  }

  delete(item: Lead) {}

  private getLeadDbObject(item: Lead): Object {
    let leadObj = {};
    LeadsProvider.standardLeadKeys.forEach(key => (leadObj[key] = item[key]));

    LeadsProvider.arrayToDbObjectsKeys.forEach(key => {
      let arrObj = this.arrayToDbObject(item[key], key);
      Object.assign(leadObj, arrObj);
    });
    return leadObj;
  }

  private arrayToDbObject(arr: string[], key: string) {
    let arrObj = {};

    arr.forEach(item => {
      let fieldName = this.getKeyValueDbName(key, item);
      arrObj[fieldName] = true;
    });

    return arrObj;
  }

  private getKeyValueDbName(key: string, value: string) {
    return `${key}_${value}`;
  }

  private getValue(item: object, key: string) {
    let itemKeys = Object.keys(item);
    let fieldName = itemKeys.find(itemKey => itemKey.startsWith(key));
    return fieldName.split("_")[1];
  }

  public convertDbObjectToLead(item: firebase.firestore.DocumentData): Lead {
    let lead = <Lead>{};
    LeadsProvider.standardLeadKeys.forEach(key => (lead[key] = item[key]));
    LeadsProvider.arrayToDbObjectsKeys.forEach(
      key => (lead[key] = this.getValue(item, key))
    );
    return lead;
  }
}
