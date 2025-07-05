import { Component, OnInit, OnDestroy } from '@angular/core';
import { AthleteService } from '../../../services/athlete.service';
import { ClubService } from '../../../services/club.service';
import { ActualiteAcademieService } from '../../../services/actualite-academie.service';
import { ProgrammeFormationService } from '../../../services/programme-formation.service';
import { Athlete } from '../../../models/athlete.model';
import { Club } from '../../../models/club.model';
import { ActualiteAcademie } from '../../../services/actualite-academie.service';
import { ProgrammeFormation } from '../../../services/programme-formation.service';
import { StatutPublication } from '../../../shared/models/statut-publication.enum';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  // Data arrays
  athletes: Athlete[] = [];
  clubs: Club[] = [];
  actualites: ActualiteAcademie[] = [];
  programmes: ProgrammeFormation[] = [];

  // Dashboard KPIs
  totalAthletes: number = 0;
  totalClubs: number = 0;
  totalActualites: number = 0;
  totalProgrammes: number = 0;
  publishedActualites: number = 0;
  activeProgrammes: number = 0;
  maleAthletes: number = 0;
  femaleAthletes: number = 0;

  // Chart data
  genderChartData: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [] };
  clubsAthletesChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  actualitesStatusChartData: ChartConfiguration<'pie'>['data'] = { labels: [], datasets: [] };
  programmesTimelineData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  monthlyAthletesData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };

  // Loading states
  isLoading: boolean = true;
  chartOptions: ChartOptions = {};

  constructor(
    private athleteService: AthleteService,
    private clubService: ClubService,
    private actualiteService: ActualiteAcademieService,
    private programmeService: ProgrammeFormationService
  ) {}

  ngOnInit() {
    this.initializeChartOptions();
    this.loadDashboardData();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  private initializeChartOptions() {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#333',
            font: {
              size: 12
            }
          }
        }
      }
    };
  }

  loadDashboardData() {
    this.isLoading = true;
    
    // Load all data in parallel
    Promise.all([
      this.loadAthletes(),
      this.loadClubs(),
      this.loadActualites(),
      this.loadProgrammes()
    ]).then(() => {
      this.calculateKPIs();
      this.prepareChartData();
      this.isLoading = false;
    }).catch(error => {
      console.error('Error loading dashboard data:', error);
      this.isLoading = false;
    });
  }

  private async loadAthletes() {
    try {
      this.athletes = await this.athleteService.getAthletes().toPromise() || [];
    } catch (error) {
      console.error('Error loading athletes:', error);
      this.athletes = [];
    }
  }

  private async loadClubs() {
    try {
      this.clubs = await this.clubService.getClubs().toPromise() || [];
    } catch (error) {
      console.error('Error loading clubs:', error);
      this.clubs = [];
    }
  }

  private async loadActualites() {
    try {
      this.actualites = await this.actualiteService.getAllActualiteAcademies().toPromise() || [];
    } catch (error) {
      console.error('Error loading actualites:', error);
      this.actualites = [];
    }
  }

  private async loadProgrammes() {
    try {
      this.programmes = await this.programmeService.getAllProgrammeFormations().toPromise() || [];
    } catch (error) {
      console.error('Error loading programmes:', error);
      this.programmes = [];
    }
  }

  private calculateKPIs() {
    // Basic counts
    this.totalAthletes = this.athletes.length;
    this.totalClubs = this.clubs.length;
    this.totalActualites = this.actualites.length;
    this.totalProgrammes = this.programmes.length;

    // Gender distribution
    this.maleAthletes = this.athletes.filter(a => a.genre === 'Male').length;
    this.femaleAthletes = this.athletes.filter(a => a.genre === 'Female').length;

    // Published content
    this.publishedActualites = this.actualites.filter(a => a.statutPublication === StatutPublication.PUBLIE).length;
    
    // Active programmes (current date within start and end dates)
    const now = new Date();
    this.activeProgrammes = this.programmes.filter(p => {
      const startDate = new Date(p.dateDebut);
      const endDate = new Date(p.dateFin);
      return now >= startDate && now <= endDate;
    }).length;
  }

  private prepareChartData() {
    this.prepareGenderChart();
    this.prepareClubsAthletesChart();
    this.prepareActualitesStatusChart();
    this.prepareProgrammesTimelineChart();
    this.prepareMonthlyAthletesChart();
  }

  private prepareGenderChart() {
    this.genderChartData = {
      labels: ['Male', 'Female'],
      datasets: [{
        data: [this.maleAthletes, this.femaleAthletes],
        backgroundColor: ['#3B82F6', '#EC4899'],
        borderColor: ['#2563EB', '#DB2777'],
        borderWidth: 2
      }]
    };
  }

  private prepareClubsAthletesChart() {
    const clubData = this.clubs.map(club => {
      const athleteCount = this.athletes.filter(a => a.club?.id === club.id).length;
      return {
        name: club.clubName,
        count: athleteCount
      };
    }).sort((a, b) => b.count - a.count).slice(0, 5); // Top 5 clubs

    this.clubsAthletesChartData = {
      labels: clubData.map(c => c.name),
      datasets: [{
        label: 'Athletes per Club',
        data: clubData.map(c => c.count),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3B82F6',
        borderWidth: 2,
        borderRadius: 8
      }]
    };
  }

  private prepareActualitesStatusChart() {
    const statusCounts = {
      'Published': this.actualites.filter(a => a.statutPublication === StatutPublication.PUBLIE).length,
      'Not Published': this.actualites.filter(a => a.statutPublication === StatutPublication.NON_PUBLIE).length,
      'Pending': this.actualites.filter(a => a.statutPublication === StatutPublication.EN_ATTENTE).length
    };

    this.actualitesStatusChartData = {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: ['#10B981', '#F59E0B', '#6B7280'],
        borderColor: ['#059669', '#D97706', '#4B5563'],
        borderWidth: 2
      }]
    };
  }

  private prepareProgrammesTimelineChart() {
    const currentYear = new Date().getFullYear();
    const monthlyData = new Array(12).fill(0);
    
    this.programmes.forEach(programme => {
      const startDate = new Date(programme.dateDebut);
      if (startDate.getFullYear() === currentYear) {
        monthlyData[startDate.getMonth()]++;
      }
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    this.programmesTimelineData = {
      labels: monthNames,
      datasets: [{
        label: 'Programmes Started',
        data: monthlyData,
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
  }

  private prepareMonthlyAthletesChart() {
    // Simulate monthly athlete registration data
    const monthlyData = [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    this.monthlyAthletesData = {
      labels: monthNames,
      datasets: [{
        label: 'New Athletes',
        data: monthlyData,
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
  }

  getPublicationRate(): number {
    return this.totalActualites > 0 ? Math.round((this.publishedActualites / this.totalActualites) * 100) : 0;
  }

  getActiveProgrammeRate(): number {
    return this.totalProgrammes > 0 ? Math.round((this.activeProgrammes / this.totalProgrammes) * 100) : 0;
  }
}
