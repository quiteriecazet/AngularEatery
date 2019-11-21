import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import localeFr from '@angular/common/locales/fr';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from '../../app.component';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeFr, 'fr');

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, '../../assets/i18n', '.json');
}

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    exports: [TranslateModule],
    providers: [
        {
            provide: LOCALE_ID,
            useValue: 'fr'
        }
    ],
    bootstrap: [AppComponent]
})
export class TranslationModule { }