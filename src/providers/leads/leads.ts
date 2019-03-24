import { LeadTypeID, LeadType } from './../../models/lead-property-metadata';
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
  private leadsDictionary: { [id: string]: AngularFirestoreCollection<firestore.DocumentData> } = {};

  private static standardLeadKeys = [
    "avatar",
    "name",
    "phone",
    "created",
    "budget",
    "area",
    "property",
    "rooms",
    "source"
  ];

  constructor(
    public http: HttpClient,
    private afStore: AngularFirestore,
    private leadPropertyMetadataProvider: LeadPropertyMetadataProvider,
    private user: User
  ) {
    this.initLeadCollections()
  }

  private initLeadCollections() {
    let userData = this.user.getUserData();
    LeadType.getAllLeadTypes().forEach(leadType => {
      let leadsCollectionRef = this.afStore
        .collection("users")
        .doc(userData.email)
        .collection("leads_" + leadType.id.toString().toLowerCase(), ref => ref.orderBy("created", "desc"));
      this.leadsDictionary[leadType.id.toString()] = leadsCollectionRef;
    });
  }

  public get(leadTypeId: LeadTypeID): Observable<firestore.DocumentData[]> {
    return this.leadsDictionary[leadTypeId.toString()].valueChanges();
  }

  /**
  * Filter function does not support multivalues. Filter multivalues in consumer code
  */
  public filter(filters: LeadFilter[], leadTypeId: LeadTypeID): Query {
    let query: Query = this.leadsDictionary[leadTypeId.toString()].ref;

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
    return this.leadsDictionary[item.type.toString()].add(dbObject);
  }

  public delete(item: Lead) {

  }

  private addBudgetFilter(filters: LeadFilter[], query: Query): Query {
    let dealType = this.leadPropertyMetadataProvider.getDealType(filters.map(filter => filter.metadata));
    let range = dealType === DealType.Sell ? 200000 : 1500;
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
