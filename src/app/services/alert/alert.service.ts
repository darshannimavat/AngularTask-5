import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private ToastrService: ToastrService) { }

  showSuccess(alert: string) {
    this.ToastrService.success(alert, 'Success');
  }
  showError(error: string) {
    this.ToastrService.error(error, 'Error');
  }
}
