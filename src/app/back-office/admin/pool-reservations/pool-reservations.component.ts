import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PoolService, Pool } from 'shared/services/pool.service';
import { ClubsService } from 'shared/services/clubs.service';
import { PoolReservationService, PoolReservation } from 'shared/services/pool-reservation.service';
import { clubs } from 'models';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-pool-reservations',
  templateUrl: './pool-reservations.component.html',
  styleUrls: ['./pool-reservations.component.css'],
  providers: [MessageService]
})
export class PoolReservationsComponent implements OnInit {
  reservationForm: FormGroup;
  pools: Pool[] = [];
  clubs: clubs[] = [];
  reservations: PoolReservation[] = [];
  timeSlots: { start: string, end: string }[] = [];
  availableTimeSlots: { label: string, value: any }[] = [];
  minDate: Date = new Date();
  loading = false;
  error: string | null = null;
  displayDialog = false;

  constructor(
    private fb: FormBuilder,
    private poolService: PoolService,
    private clubsService: ClubsService,
    private reservationService: PoolReservationService,
    public messageService: MessageService
  ) {
    this.reservationForm = this.fb.group({
      coach: ['', Validators.required],
      club: [null, Validators.required],
      pool: [null, Validators.required],
      date: ['', Validators.required],
      timeSlot: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.fetchPools();
    this.fetchClubs();
    this.fetchReservations();
    this.generateTimeSlots();
    this.reservationForm.get('pool')?.valueChanges.subscribe(() => this.updateAvailableTimeSlots());
    this.reservationForm.get('date')?.valueChanges.subscribe(() => this.updateAvailableTimeSlots());
  }

  showDialog() {
    this.reservationForm.reset();
    this.displayDialog = true;
    this.updateAvailableTimeSlots();
  }

  hideDialog() {
    this.displayDialog = false;
    this.reservationForm.reset();
  }

  fetchPools() {
    this.poolService.getAllPools().subscribe(data => this.pools = data);
  }

  fetchClubs() {
    this.clubsService.getAllClubs().subscribe(data => this.clubs = data);
  }

  fetchReservations() {
    this.reservationService.getAllReservations().subscribe(data => this.reservations = data);
  }

  generateTimeSlots() {
    this.timeSlots = [
      { start: '08:00', end: '09:30' },
      { start: '09:30', end: '11:00' },
      { start: '11:00', end: '12:30' },
      { start: '16:00', end: '17:30' },
      { start: '17:30', end: '19:00' },
      { start: '20:30', end: '22:00' }
    ];
  }

  updateAvailableTimeSlots() {
    const pool = this.reservationForm.get('pool')?.value;
    const date = this.reservationForm.get('date')?.value;
    if (!pool || !date) {
      this.availableTimeSlots = this.timeSlots.map(slot => ({ label: `${slot.start} - ${slot.end}`, value: slot }));
      return;
    }
    const reservedSlots = this.reservations.filter(r => r.pool.id === pool.id && r.date === (typeof date === 'string' ? date : this.formatDate(date)))
      .map(r => `${r.startTime}-${r.endTime}`);
    this.availableTimeSlots = this.timeSlots.map(slot => {
      const label = `${slot.start} - ${slot.end}`;
      const value = slot;
      const disabled = reservedSlots.includes(`${slot.start}-${slot.end}`);
      return { label, value, disabled };
    }).filter(slot => !slot.disabled);
  }

  formatDate(date: Date): string {
    // Format date as yyyy-MM-dd in local time
    const d = new Date(date);
    return d.toLocaleDateString('en-CA');
  }

  onSubmit() {
    if (this.reservationForm.invalid) return;
    this.loading = true;
    this.error = null;
    const { coach, club, pool, date, timeSlot } = this.reservationForm.value;
    const [startTime, endTime] = [timeSlot.start, timeSlot.end];
    const reservation: PoolReservation = {
      coach,
      club,
      pool,
      date: typeof date === 'string' ? date : this.formatDate(date),
      startTime,
      endTime
    };
    this.reservationService.createReservation(reservation).subscribe({
      next: (res) => {
        this.fetchReservations();
        this.hideDialog();
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Reservation created successfully.' });
      },
      error: (err) => {
        let msg = 'Reservation failed.';
        if (err.error && typeof err.error === 'string') {
          if (
            err.error.includes('already reserved') ||
            err.error.startsWith('This pool') ||
            err.error.includes('Unexpected token')
          ) {
            msg = 'This pool is already reserved for the selected date and time slot. Please choose another slot.';
          } else {
            msg = err.error;
          }
        } else if (err.error && err.error.message) {
          msg = err.error.message;
        }
        this.error = msg;
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Reservation Conflict', detail: msg });
      }
    });
  }

  deleteReservation(id: number) {
    this.reservationService.deleteReservation(id).subscribe(() => {
      this.fetchReservations();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Reservation deleted successfully.' });
    });
  }
} 