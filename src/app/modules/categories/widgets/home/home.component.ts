import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DbCategoriesService } from '@modules/categories/services/db-categories.service';

@Component({
  selector: 'app-widget-categories',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeWidgetComponent implements OnInit {

  totalCategories = 6;
  total = 0;
  toogleCategory = false;
  categories$: Observable<any[]>;
  constructor(
    private nav: NavController,
    private router: Router,
    private db: DbCategoriesService
  ) {}

  ngOnInit() {
    this.categories$ = this.db.getIcone().pipe(
      map((res: any) => {
        this.total = res.length;
        return res;
      })
    );
  }

  goToSolicitud = (item: any) => this.router.navigate(
    ['pages', 'solicitud', 'home',item.id]);

  onToogleCategories = () => this.toogleCategory = !this.toogleCategory;

}
