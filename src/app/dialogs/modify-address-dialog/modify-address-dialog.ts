import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatFormFieldModule, MatButtonModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { MapService } from '../../services/map/map.service';
import { } from 'googlemaps';

@Component({
    selector: 'modify-address-dialog',
    templateUrl: 'modify-address-dialog.html',
})
export class ModifyAddressDialog implements OnInit {

    autocomplete;
    address;
    userNewPosition;
    input;
    hasNewAddress = false;

    @Output() newUserPositionEvent = new EventEmitter<any>();

    constructor(
        public dialogRef: MatDialogRef<ModifyAddressDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.input = document.getElementById('location');
        this.autocomplete = new google.maps.places.Autocomplete(this.input);
        this.autocomplete.addListener('place_changed', () => {
            this.updateUserPosition();
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    updateUserPosition(): void {
        this.userNewPosition = this.autocomplete.getPlace();
        if (this.userNewPosition.geometry) { 
            this.hasNewAddress = true;
            this.newUserPositionEvent.emit(this.userNewPosition);
        }
    }
}
