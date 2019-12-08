import { Component } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
    selector: 'legal-mentions-dialog',
    templateUrl: 'legal-mentions-dialog.html',
})
export class LegalMentionsSheet {
    constructor(private _bottomSheetRef: MatBottomSheetRef<LegalMentionsSheet>) { }
}