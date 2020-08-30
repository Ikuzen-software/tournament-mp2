import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private messageService: MessageService) { }

  success(summaryMessage: string, detailMessage: string){
    this.messageService.add({ key: 'tc', severity:'success', summary: summaryMessage, detail:detailMessage});
  }
  
  showError(summaryMessage: string, detailMessage: string) {
    this.messageService.add({ key: 'tc', severity: 'error', summary: summaryMessage, detail: detailMessage });
  }
  showInfo() {
    this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'PrimeNG rocks' });
  }

  showWarn() {
    this.messageService.add({ severity: 'warn', summary: 'Warn Message', detail: 'There are unsaved changes' });
  }

  showCustom() {
    this.messageService.add({ key: 'custom', severity: 'info', summary: 'Custom Toast', detail: 'With a Gradient' });
  }

  showTopLeft() {
    this.messageService.add({ key: 'tl', severity: 'info', summary: 'Success Message', detail: 'Order submitted' });
  }

  showTopCenter() {
    this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Info Message', detail: 'PrimeNG rocks' });
  }

  showConfirm() {
    this.messageService.clear();
    this.messageService.add({ key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed' });
  }

  showMultiple() {
    this.messageService.addAll([
      { severity: 'info', summary: 'Message 1', detail: 'PrimeNG rocks' },
      { severity: 'info', summary: 'Message 2', detail: 'PrimeUI rocks' },
      { severity: 'info', summary: 'Message 3', detail: 'PrimeFaces rocks' }
    ]);
  }

  onConfirm() {
    this.messageService.clear('c');
  }

  onReject() {
    this.messageService.clear('c');
  }

  clear() {
    this.messageService.clear();
  }
}
