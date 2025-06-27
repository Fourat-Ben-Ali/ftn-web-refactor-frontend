import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

interface Article {
  titre: string;
  type: string;
  date: string;
  image: string;
}

@Component({
  selector: 'app-front-office',
  template: `
    <div class="front-office-container">
      <div class="header">
        <h1>Swimming Federation</h1>
        <p-menu [model]="menuItems" [style]="{'width': '100%'}"></p-menu>
      </div>
      <div class="content">
        <router-outlet></router-outlet>
      </div>
    </div>
    <div class="articles-container">
      <div class="article-card" *ngFor="let article of articles">
        <img [src]="article.image" alt="Image article" class="article-img" />
        <div class="article-type">NATATION</div>
        <div class="article-title">{{ article.titre }}</div>
        <div class="article-date">{{ article.date }}</div>
      </div>
    </div>
  `,
  styles: [`
    .front-office-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    .header {
      background-color: #ffffff;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #2196F3;
      margin: 0 0 1rem 0;
      text-align: center;
    }
    .content {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .articles-container {
      display: flex;
      flex-wrap: wrap;
      gap: 48px;
      justify-content: center;
      margin-top: 40px;
    }
    .article-card {
      width: 370px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.10);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 24px;
      transition: transform 0.2s;
    }
    .article-card:hover {
      transform: translateY(-8px) scale(1.03);
      box-shadow: 0 8px 32px rgba(0,0,0,0.13);
    }
    .article-img {
      width: 100%;
      height: 210px;
      object-fit: cover;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }
    .article-type {
      margin-top: 18px;
      color: #7c5c3e;
      font-size: 1.05rem;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-weight: 500;
      text-align: center;
      border-bottom: 2px solid #a97c50;
      width: 120px;
      margin-bottom: 10px;
    }
    .article-title {
      font-size: 2rem;
      color: #2356a8;
      text-align: center;
      font-family: 'Georgia', serif;
      margin-bottom: 10px;
      margin-top: 0;
    }
    .article-date {
      color: #bdbdbd;
      font-size: 1.1rem;
      text-align: center;
      margin-top: 8px;
      letter-spacing: 1px;
    }
  `]
})
export class FrontOfficeComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Athletes',
      icon: 'pi pi-users',
      routerLink: ['/front-office/athletes']
    },
    {
      label: 'Clubs',
      icon: 'pi pi-building',
      routerLink: ['/front-office/clubs']
    }
  ];

  articles: Article[] = [
    {
      titre: 'Programme Technique des Compétitions 2025',
      type: 'NATATION',
      date: '19 JUIN 2025',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    },
    {
      titre: 'Calendrier international 2025',
      type: 'NATATION',
      date: '3 AVRIL 2025',
      image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80'
    },
    {
      titre: 'Minimas de participation aux jeux aquatiques Arabes, âges groupes',
      type: 'NATATION',
      date: '10 MAI 2025',
      image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80'
    }
  ];
} 