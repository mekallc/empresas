import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DbCategoriesService } from '@modules/categories/services/db-categories.service';
import { timer } from 'rxjs';
import { AppState } from '@store/app.state';
import { Store } from '@ngrx/store';
import * as actions from '@store/actions';
import { IntegratedService } from '@core/services/integrated.service';
import { filter, map } from 'rxjs/operators';

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
  comment: string;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private integrated: IntegratedService,
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
      score: 4,
      review: this.comment,
    };
    this.store.select('company').subscribe((res: any): void => {
      if (!res.loading) {
        this.db.finishService(this.id, res.company.id, data)
        .subscribe((res: any): void => {
          this.getData();
          this.modal.dismiss();
          this.router.navigate(['pages', 'home']);
        });
      }
    })
  }

  getStar = (ev: number): number => this.score = ev;


  onClose = (): Promise<boolean> => this.modal.dismiss();

  private getData = () => {
    this.store.select('company')
    .pipe(filter(row => !row.loading), map(res => res.company))
    .subscribe((res: any) => {
      if(res) {
        const id = res.id;
        this.store.dispatch(actions.closedLoad({ id} ));
        this.store.dispatch(actions.loadSolicitud({ id }));
        this.store.dispatch(actions.loadAccepted({ id }));
        this.store.dispatch(actions.loadHistory({ id }));
      }
    })
  }
}
