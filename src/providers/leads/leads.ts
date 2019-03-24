import { LeadPropertyMetadataProvider } from './../lead-property-metadata/lead-property-metadata';
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
import { LeadPropertyType, DealType } from "../../models/lead-property-metadata";
/*
  Generated class for the LeadsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LeadsProvider {
  private leadsCollectionRef: AngularFirestoreCollection;
  private leads$: Observable<firestore.DocumentData[]>;
  private static standardLeadKeys = [
    "avatar",
    "name",
    "phone",
    "created",
    "budget",
    "area",
    "type",
    "property",
    "rooms",
    "source"
  ];

  constructor(
    public http: HttpClient,
    private afStore: AngularFirestore,
    private leadPropertyMetadataProvider: LeadPropertyMetadataProvider,
    user: User
  ) {
    let userData = user.getUserData();
    this.leadsCollectionRef = this.afStore
      .collection("users")
      .doc(userData.email)
      .collection("leads", ref => ref.orderBy("created", "desc"));
    this.leads$ = this.leadsCollectionRef.valueChanges();
  }

  public get(): Observable<firestore.DocumentData[]> {
    return this.leads$;
  }

  /**
  * Filter function does not support multivalues. Filter multivalues in consumer code
  */
  public filter(filters: LeadFilter[]): Query {
    let query: Query = this.leadsCollectionRef.ref;

    query = this.addBudgetFilter(filters, query);
    query = this.addStringFilters(filters, query);
 
    return query;
  }

  public convertDbObjectToLead(item: firebase.firestore.DocumentData): Lead {
    let lead = <Lead>{};
    LeadsProvider.standardLeadKeys.forEach(key => (lead[key] = item[key]));
    return lead;
  }

  public add(item: Lead): Promise<firestore.DocumentReference> {
    let dbObject = this.getLeadDbObject(item);
    return this.leadsCollectionRef.add(dbObject);
  }

  public delete(item: Lead) {}
  private addBudgetFilter(filters: LeadFilter[], query: Query): Query {
    let dealType = this.leadPropertyMetadataProvider.getDealType(filters.map(filter => filter.metadata));
    let range = dealType === DealType.Sell? 200000 : 1500;
    filters
      .filter(filter => filter.metadata.type === LeadPropertyType.Budget)
      .forEach(filter => {
        if (filter.value) {
          query = query
            .where("budget", "<=", filter.value + range)
            .where("budget", ">=", filter.value - range);
        }
      });

    return query;
  }

  private addStringFilters(filters: LeadFilter[], query: Query): Query {
    filters
      .filter(
        filter => filter.metadata.type === LeadPropertyType.StringSingleValue
      )
      .forEach(filter => {
        if (filter.value) {
          query = query.where(filter.id, "==", filter.value);
        }
      });

    return query;
  }

  private getLeadDbObject(item: Lead): Object {
    let leadObj = {};
    LeadsProvider.standardLeadKeys.forEach(key => (leadObj[key] = item[key]));
    return leadObj;
  }
}
