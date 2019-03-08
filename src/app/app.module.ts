import { LeadPropertyMetadataProvider } from './../providers/lead-property-metadata/lead-property-metadata';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ErrorHandler, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { IonicStorageModule, Storage } from "@ionic/storage";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { Items } from "../mocks/providers/items";
import { Settings, User, Api } from "../providers";
import { MyApp } from "./app.component";
import { LeadsProvider } from "../providers/leads/leads";
import { CallLog } from "@ionic-native/call-log/ngx";
import { AuthProvider } from "../providers/auth/auth";
import { environment } from "../environments/environment";
import { AngularFireModule } from "angularfire2";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFirestore, AngularFirestoreModule } from "angularfire2/firestore";
import { PipesModule } from "../pipes/pipes.module";
import { ComponentsModule } from "../components/components.module";

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

export function provideSettings(storage: Storage) {
  return new Settings(storage, {
    defaultBudget: 1500000,
    maxBudget: 5000000,
    presetBudgets: [50000, 1000000, 1500000, 2000000, 2500000, 3000000],
    defaultRentBudget: 4000,
    maxRentBudget: 10000,
    presetRentBudgets:[3500,4000,4500,5000,5500,6000,6500,7000,8000]
  });
}

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    HttpClientModule,
    PipesModule,
    ComponentsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp, {
      menuType: "overlay",
      backButtonIcon: "arrow-round-forward",
      iconMode: "ios",
      platforms: {
        ios: {
          // menuType: 'overlay',
        }
      }
    }),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence()
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    Api,
    Items,
    User,
    SplashScreen,
    StatusBar,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LeadPropertyMetadataProvider,
    LeadsProvider,
    CallLog,
    AngularFireAuth,
    AuthProvider,
    AngularFirestore
  ]
})
export class AppModule { }
