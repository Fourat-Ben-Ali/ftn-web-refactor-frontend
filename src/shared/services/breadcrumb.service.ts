import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Breadcrumb } from 'models';


@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const breadcrumbs = this.createBreadcrumbs(this.route.root);
        this.breadcrumbsSubject.next(breadcrumbs);
      });
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    path: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (let child of children) {
      const routeParts = child.snapshot.url.map((segment) => segment.path);
      if (routeParts.length > 0) {
        path += '/' + routeParts.join('/');
      }

      const label = child.snapshot.data['breadcrumb'];
      const icon = child.snapshot.data['icon'];
      if (label) {
        breadcrumbs.push({ label: label, url: path, icon: icon });
      }

      return this.createBreadcrumbs(child, path, breadcrumbs);
    }

    return breadcrumbs;
  }
}
