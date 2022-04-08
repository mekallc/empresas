import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DbCategoriesService } from '@modules/categories/services/db-categories.service';
import { timer } from 'rxjs';
import { AppState } from '@store/app.state';
import { Store } from '@ngrx/store';
import * as actions from '@store/actions';

@Component({
  selector: 'app-rating-modal',
  templateUrl: './rating-modal.component.html',
  styleUrls: ['./rating-modal.component.scss'],
})
export class RatingModalComponent implements OnInit {

  @Input() id: number;
  @Input() company: any;
  num = 4;
  data: any = [];
  score: number;
  comment: string = 'Write your comment...';

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private modal: ModalController,
    private db: DbCategoriesService,
  ) { }

  ngOnInit() {
    timer(300).subscribe(() => {
      console.log(this.id);
      console.log(this.company);
    })
  }

  onSubmit = () => {
    const data = {
      status: 'CLOSED',
      store: this.score,
      review: this.comment,
    };
    this.store.select('company').subscribe((res: any) => {
      if (!res.loading) {
        this.db.finishService(this.id, res.company.id, data).subscribe((res: any) => {
          console.log('COMPANY ', res);
          this.getState(res.id);
          this.modal.dismiss();
          this.router.navigate(['pages', 'home']);
        });
      }
    })
  }

  getStar = (ev: number) => this.score;

  onClose = () => this.modal.dismiss();

  private getState = (id: any) => {
    this.store.dispatch(actions.closedLoad({ id }));
    this.store.dispatch(actions.loadHistory({ id }));
    this.store.dispatch(actions.loadAccepted({ id }));
    this.store.dispatch(actions.loadSolicitud({ id }));
  }
}
