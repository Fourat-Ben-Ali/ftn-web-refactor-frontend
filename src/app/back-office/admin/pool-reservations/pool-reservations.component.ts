import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PoolService, Pool } from 'shared/services/pool.service';
import { ClubsService } from 'shared/services/clubs.service';
import { PoolReservationService, PoolReservation } from 'shared/services/pool-reservation.service';
import { clubs } from 'models';
import { MessageService } from 'primeng/api';

interface Lane {
  id: number;
  isSelected: boolean;
  isReserved: boolean;
  reservationInfo?: {
    coach: string;
    club: string;
    timeSlot: string;
  };
}

interface TimeSlot {
  start: string;
  end: string;
  label: string;
  isAvailable: boolean;
  reservedLanes: number[];
}

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
  availableLanes: { label: string, value: number }[] = [];
  minDate: Date = new Date();
  // Loading states
  loading = false;
  loadingClubs = false;
  error: string | null = null;
  displayDialog = false;

  // Enhanced UI properties
  lanes: Lane[] = [];
  selectedLanes: number[] = [];
  enhancedTimeSlots: TimeSlot[] = [];
  selectedPool: Pool | null = null;
  selectedDate: string = '';
  selectedTimeSlot: TimeSlot | null = null;
  poolStats = {
    totalLanes: 10,
    availableLanes: 10,
    reservedLanes: 0,
    utilizationRate: 0
  };

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
      timeSlot: ['', Validators.required],
      lane: [null, Validators.required]
    });
    this.initializeLanes();
    
    // Add immediate form value change detection
    this.reservationForm.valueChanges.subscribe(values => {
      console.log('Form valueChanges triggered:', values);
      console.log('Current form state:', this.reservationForm.value);
    });
  }

  private initializeLanes() {
    this.lanes = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      isSelected: false,
      isReserved: false
    }));
  }

  ngOnInit() {
    this.fetchPools();
    this.fetchClubs();
    this.fetchReservations();
    this.generateTimeSlots();
    this.generateLanes();
    this.generateEnhancedTimeSlots();
    this.reservationForm.get('pool')?.valueChanges.subscribe(() => this.updateAvailableTimeSlots());
    this.reservationForm.get('date')?.valueChanges.subscribe(() => this.updateAvailableTimeSlots());
    this.reservationForm.get('timeSlot')?.valueChanges.subscribe(() => this.updateAvailableLanes());
    
    // Add logging for form value changes
    this.reservationForm.get('coach')?.valueChanges.subscribe(value => {
      console.log('Coach value changed:', value);
      this.logFormState('Coach changed');
      setTimeout(() => this.checkFormValues(), 100); // Check after a small delay
    });
    
    this.reservationForm.get('club')?.valueChanges.subscribe(value => {
      console.log('Club value changed:', value);
      this.logFormState('Club changed');
      setTimeout(() => this.checkFormValues(), 100); // Check after a small delay
    });
    
    this.reservationForm.get('date')?.valueChanges.subscribe(value => {
      console.log('Date value changed:', value);
      this.logFormState('Date changed');
      setTimeout(() => this.checkFormValues(), 100); // Check after a small delay
    });
  }

  generateEnhancedTimeSlots() {
    this.enhancedTimeSlots = this.timeSlots.map(slot => ({
      start: slot.start,
      end: slot.end,
      label: `${slot.start} - ${slot.end}`,
      isAvailable: true,
      reservedLanes: []
    }));
    // Don't call updateTimeSlotAvailability here - it will be called when pool/date are selected
  }

  updateTimeSlotAvailability() {
    console.log('=== updateTimeSlotAvailability called ===');
    console.log('selectedPool:', this.selectedPool);
    console.log('selectedDate:', this.selectedDate);
    console.log('reservations count:', this.reservations.length);
    console.log('reservations:', this.reservations);
    
    if (!this.selectedPool || !this.selectedDate) {
      console.log('Early return - missing pool or date');
      return;
    }
    
    const formattedDate = this.normalizeDate(this.selectedDate);
    console.log('formattedDate:', formattedDate);
    
    // Debug: Check all reservation dates to see the format
    console.log('All reservation dates:', this.reservations.map(r => ({ 
      date: r.date, 
      poolId: r.pool.id, 
      timeSlot: `${r.startTime}-${r.endTime}`,
      startTime: r.startTime,
      endTime: r.endTime
    })));
    
    const dayReservations = this.reservations.filter(r => 
      r.pool.id === this.selectedPool!.id && r.date === formattedDate
    );
    console.log('dayReservations for pool', this.selectedPool.id, 'and date', formattedDate, ':', dayReservations);
    
    // Update each time slot's availability
    this.enhancedTimeSlots.forEach(slot => {
      console.log(`\n--- Checking time slot ${slot.start}-${slot.end} ---`);
      console.log('Looking for reservations with startTime:', slot.start, 'and endTime:', slot.end);
      
      const slotReservations = dayReservations.filter(r => {
        // Normalize time format by removing seconds if present
        const normalizedStartTime = this.normalizeTime(r.startTime);
        const normalizedEndTime = this.normalizeTime(r.endTime);
        const matches = normalizedStartTime === slot.start && normalizedEndTime === slot.end;
        console.log(`Reservation ${r.startTime}-${r.endTime} (normalized: ${normalizedStartTime}-${normalizedEndTime}): matches = ${matches}`);
        return matches;
      });
      
      console.log(`Time slot ${slot.start}-${slot.end}:`, slotReservations.length, 'reservations');
      
      // Mark lanes as reserved for this time slot
      slot.reservedLanes = slotReservations.map(r => r.lane);
      
      // Time slot is available if there are less than 10 reservations (10 lanes total)
      slot.isAvailable = slotReservations.length < 10;
      
      console.log(`Slot ${slot.start}-${slot.end}: available=${slot.isAvailable}, reservedLanes=${slot.reservedLanes.length}`);
    });
    
    console.log('Final enhancedTimeSlots:', this.enhancedTimeSlots);
  }

  onPoolSelect(pool: Pool) {
    this.selectedPool = pool;
    this.reservationForm.patchValue({ pool });
    console.log('Pool selected:', pool);
    console.log('Form after pool selection:', this.reservationForm.value);
    this.updateTimeSlotAvailability();
    this.updatePoolVisualization();
  }

  onDateSelect(date: Date) {
    this.selectedDate = this.formatDate(date);
    this.reservationForm.patchValue({ date });
    console.log('Date selected:', this.selectedDate);
    console.log('Form after date selection:', this.reservationForm.value);
    this.updateTimeSlotAvailability();
    this.updatePoolVisualization();
  }

  onTimeSlotSelect(timeSlot: TimeSlot) {
    this.selectedTimeSlot = timeSlot;
    this.reservationForm.patchValue({ timeSlot: { start: timeSlot.start, end: timeSlot.end } });
    console.log('Time slot selected:', timeSlot);
    console.log('Form after time slot selection:', this.reservationForm.value);
    this.updateLaneVisualization();
  }

  onLaneClick(lane: Lane) {
    if (lane.isReserved) return;
    
    lane.isSelected = !lane.isSelected;
    if (lane.isSelected) {
      this.selectedLanes.push(lane.id);
    } else {
      this.selectedLanes = this.selectedLanes.filter(id => id !== lane.id);
    }
    this.reservationForm.patchValue({ lane: this.selectedLanes.length > 0 ? this.selectedLanes[0] : null });
    console.log('Lane selected:', this.selectedLanes);
    console.log('Form after lane selection:', this.reservationForm.value);
  }

  updatePoolVisualization() {
    if (!this.selectedPool || !this.selectedDate) return;
    
    // Update time slot availability
    this.updateTimeSlotAvailability();
    
    // Update lane visualization if a time slot is selected
    if (this.selectedTimeSlot) {
      this.updateLaneVisualization();
    }
  }

  updateLaneVisualization() {
    if (!this.selectedPool || !this.selectedDate || !this.selectedTimeSlot) return;
    
    const formattedDate = this.normalizeDate(this.selectedDate);
    
    const slotReservations = this.reservations.filter(r => 
      r.pool.id === this.selectedPool!.id && 
      r.date === formattedDate &&
      this.normalizeTime(r.startTime) === this.selectedTimeSlot!.start &&
      this.normalizeTime(r.endTime) === this.selectedTimeSlot!.end
    );
    
    // Reset lanes
    this.lanes.forEach(lane => {
      lane.isReserved = false;
      lane.isSelected = false;
      lane.reservationInfo = undefined;
    });
    
    // Mark reserved lanes
    slotReservations.forEach(reservation => {
      const lane = this.lanes.find(l => l.id === reservation.lane);
      if (lane) {
        lane.isReserved = true;
        lane.reservationInfo = {
          coach: reservation.coach,
          club: reservation.club.clubName,
          timeSlot: `${reservation.startTime} - ${reservation.endTime}`
        };
      }
    });
    
    // Update stats
    this.updatePoolStats();
  }

  updatePoolStats() {
    const reservedCount = this.lanes.filter(lane => lane.isReserved).length;
    this.poolStats.reservedLanes = reservedCount;
    this.poolStats.availableLanes = this.poolStats.totalLanes - reservedCount;
    this.poolStats.utilizationRate = Math.round((reservedCount / this.poolStats.totalLanes) * 100);
  }

  // Check if all required selections are made
  isFormComplete(): boolean {
    const formValid = this.reservationForm.valid;
    const poolSelected = this.selectedPool !== null;
    const timeSlotSelected = this.selectedTimeSlot !== null;
    const laneSelected = this.selectedLanes.length > 0;
    
    // Get individual form control values
    const coachValue = this.reservationForm.get('coach')?.value;
    const clubValue = this.reservationForm.get('club')?.value;
    const dateValue = this.reservationForm.get('date')?.value;
    
    // Check if values are actually filled (not just truthy)
    const coachFilled = coachValue && coachValue.trim() !== '';
    const clubFilled = clubValue !== null && clubValue !== undefined;
    const dateFilled = dateValue !== null && dateValue !== undefined;
    
    console.log('Form validation:', {
      formValid,
      poolSelected,
      timeSlotSelected,
      laneSelected,
      coach: coachValue,
      coachFilled,
      club: clubValue,
      clubFilled,
      date: dateValue,
      dateFilled,
      formErrors: this.reservationForm.errors,
      coachErrors: this.reservationForm.get('coach')?.errors,
      clubErrors: this.reservationForm.get('club')?.errors,
      dateErrors: this.reservationForm.get('date')?.errors
    });
    
    return coachFilled && clubFilled && dateFilled && poolSelected && timeSlotSelected && laneSelected;
  }

  // Helper methods for validation display
  isCoachValid(): boolean {
    const coachValue = this.reservationForm.get('coach')?.value;
    console.log('isCoachValid called - coachValue:', coachValue, 'type:', typeof coachValue);
    const isValid = coachValue && coachValue.trim() !== '';
    console.log('isCoachValid result:', isValid);
    return isValid;
  }

  isClubValid(): boolean {
    const clubValue = this.reservationForm.get('club')?.value;
    console.log('isClubValid called - clubValue:', clubValue, 'type:', typeof clubValue);
    const isValid = clubValue !== null && clubValue !== undefined;
    console.log('isClubValid result:', isValid);
    return isValid;
  }

  isDateValid(): boolean {
    const dateValue = this.reservationForm.get('date')?.value;
    console.log('isDateValid called - dateValue:', dateValue, 'type:', typeof dateValue);
    const isValid = dateValue !== null && dateValue !== undefined;
    console.log('isDateValid result:', isValid);
    return isValid;
  }

  showDialog() {
    this.reservationForm.reset();
    this.displayDialog = true;
    this.selectedLanes = [];
    this.selectedPool = null;
    this.selectedDate = '';
    this.selectedTimeSlot = null;
    this.initializeLanes();
    this.generateEnhancedTimeSlots();
    this.updateAvailableTimeSlots();
    this.updateAvailableLanes();
    this.logFormState('Dialog opened');
  }

  logFormState(context: string) {
    console.log(`=== Form State (${context}) ===`);
    console.log('Form valid:', this.reservationForm.valid);
    console.log('Form value:', this.reservationForm.value);
    console.log('Coach value:', this.reservationForm.get('coach')?.value);
    console.log('Club value:', this.reservationForm.get('club')?.value);
    console.log('Date value:', this.reservationForm.get('date')?.value);
    console.log('Pool value:', this.reservationForm.get('pool')?.value);
    console.log('Time slot value:', this.reservationForm.get('timeSlot')?.value);
    console.log('Lane value:', this.reservationForm.get('lane')?.value);
    console.log('Selected pool:', this.selectedPool);
    console.log('Selected date:', this.selectedDate);
    console.log('Selected time slot:', this.selectedTimeSlot);
    console.log('Selected lanes:', this.selectedLanes);
    console.log('========================');
  }

  // Manual validation check method
  checkFormValues() {
    console.log('=== Manual Form Check ===');
    console.log('Form controls:', this.reservationForm.controls);
    console.log('Coach control:', this.reservationForm.get('coach'));
    console.log('Club control:', this.reservationForm.get('club'));
    console.log('Date control:', this.reservationForm.get('date'));
    
    // Force validation update
    this.reservationForm.updateValueAndValidity();
    
    console.log('After updateValueAndValidity:');
    console.log('Form valid:', this.reservationForm.valid);
    console.log('Coach valid:', this.reservationForm.get('coach')?.valid);
    console.log('Club valid:', this.reservationForm.get('club')?.valid);
    console.log('Date valid:', this.reservationForm.get('date')?.valid);
    console.log('========================');
  }

  // Test method to manually set form values
  testSetFormValues() {
    console.log('=== Testing Form Value Setting ===');
    this.reservationForm.patchValue({
      coach: 'Test Coach',
      club: 1, // Assuming club ID 1 exists
      date: new Date()
    });
    this.reservationForm.updateValueAndValidity();
    this.checkFormValues();
  }

  onCoachInput(event: any) {
    console.log('Coach input event:', event);
    console.log('Input value:', event.target.value);
    console.log('Form control value:', this.reservationForm.get('coach')?.value);
    console.log('Form control valid:', this.reservationForm.get('coach')?.valid);
    console.log('Form control errors:', this.reservationForm.get('coach')?.errors);
    
    // Force update the form control
    this.reservationForm.get('coach')?.setValue(event.target.value);
    this.reservationForm.updateValueAndValidity();
    
    console.log('After setValue:');
    console.log('Form control value:', this.reservationForm.get('coach')?.value);
    console.log('Form control valid:', this.reservationForm.get('coach')?.valid);
    console.log('Form complete:', this.isFormComplete());
  }

  onClubChange(event: any) {
    console.log('Club change event:', event);
    console.log('Selected club value:', event.value);
    console.log('Form control value:', this.reservationForm.get('club')?.value);
    console.log('Form control valid:', this.reservationForm.get('club')?.valid);
    console.log('Form control errors:', this.reservationForm.get('club')?.errors);
    
    // Force update the form control
    this.reservationForm.get('club')?.setValue(event.value);
    this.reservationForm.updateValueAndValidity();
    
    console.log('After setValue:');
    console.log('Form control value:', this.reservationForm.get('club')?.value);
    console.log('Form control valid:', this.reservationForm.get('club')?.valid);
    console.log('Form complete:', this.isFormComplete());
  }

  debugAvailability() {
    console.log('=== DEBUG AVAILABILITY ===');
    console.log('Current state:');
    console.log('- selectedPool:', this.selectedPool);
    console.log('- selectedDate:', this.selectedDate);
    console.log('- selectedTimeSlot:', this.selectedTimeSlot);
    console.log('- reservations loaded:', this.reservations.length);
    console.log('- enhancedTimeSlots:', this.enhancedTimeSlots);
    
    if (this.selectedPool && this.selectedDate) {
      console.log('Forcing availability update...');
      this.updateTimeSlotAvailability();
    } else {
      console.log('Cannot update - missing pool or date');
    }
    
    // Test: Create a mock reservation to see if the logic works
    console.log('=== TESTING WITH MOCK DATA ===');
    const mockReservations = [
      {
        id: 999,
        coach: 'Test Coach',
        club: { id: 1, clubName: 'Test Club' } as clubs,
        pool: this.selectedPool!,
        date: this.selectedDate,
        startTime: '08:00',
        endTime: '10:00',
        lane: 1
      },
      {
        id: 998,
        coach: 'Test Coach 2',
        club: { id: 2, clubName: 'Test Club 2' } as clubs,
        pool: this.selectedPool!,
        date: this.selectedDate,
        startTime: '08:00',
        endTime: '10:00',
        lane: 2
      }
    ];
    
    console.log('Mock reservations:', mockReservations);
    
    // Test the filtering logic
    const testDayReservations = mockReservations.filter(r => 
      r.pool.id === this.selectedPool!.id && r.date === this.selectedDate
    );
    console.log('Test day reservations:', testDayReservations);
    
    this.enhancedTimeSlots.forEach(slot => {
      const testSlotReservations = testDayReservations.filter(r => 
        r.startTime === slot.start && r.endTime === slot.end
      );
      console.log(`Test slot ${slot.start}-${slot.end}:`, testSlotReservations.length, 'reservations');
    });
    
    console.log('=== END DEBUG ===');
  }

  hideDialog() {
    this.displayDialog = false;
    this.reservationForm.reset();
    this.selectedLanes = [];
    this.selectedPool = null;
    this.selectedDate = '';
    this.selectedTimeSlot = null;
  }

  fetchPools() {
    this.poolService.getAllPools().subscribe(data => this.pools = data);
  }

  fetchClubs() {
    this.loadingClubs = true;
    this.clubsService.getAllClubs().subscribe({
      next: (data) => {
        console.log('Clubs loaded:', data);
        this.clubs = data;
        this.loadingClubs = false;
      },
      error: (error) => {
        console.error('Error loading clubs:', error);
        this.loadingClubs = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load clubs'
        });
      }
    });
  }

  fetchReservations() {
    this.reservationService.getAllReservations().subscribe(data => {
      this.reservations = data;
      // Update availability after loading reservations
      if (this.selectedPool && this.selectedDate) {
        this.updateTimeSlotAvailability();
        if (this.selectedTimeSlot) {
          this.updateLaneVisualization();
        }
      }
    });
  }

  generateTimeSlots() {
    this.timeSlots = [
      { start: '06:00', end: '08:00' },
      { start: '08:00', end: '10:00' },
      { start: '10:00', end: '12:00' },
      { start: '14:00', end: '16:00' },
      { start: '16:00', end: '18:00' },
      { start: '18:00', end: '20:00' },
      { start: '20:00', end: '22:00' }
    ];
  }

  generateLanes() {
    this.availableLanes = Array.from({ length: 10 }, (_, i) => ({
      label: `Lane ${i + 1}`,
      value: i + 1
    }));
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

  updateAvailableLanes() {
    const pool = this.reservationForm.get('pool')?.value;
    const date = this.reservationForm.get('date')?.value;
    const timeSlot = this.reservationForm.get('timeSlot')?.value;
    
    if (!pool || !date || !timeSlot) {
      this.availableLanes = Array.from({ length: 10 }, (_, i) => ({
        label: `Lane ${i + 1}`,
        value: i + 1
      }));
      return;
    }

    const formattedDate = typeof date === 'string' ? date : this.formatDate(date);
    const reservedLanes = this.reservations.filter(r => 
      r.pool.id === pool.id && 
      r.date === formattedDate && 
      r.startTime === timeSlot.start && 
      r.endTime === timeSlot.end
    ).map(r => r.lane);

    this.availableLanes = Array.from({ length: 10 }, (_, i) => {
      const laneNumber = i + 1;
      const isReserved = reservedLanes.includes(laneNumber);
      return {
        label: `Lane ${laneNumber}${isReserved ? ' (Reserved)' : ''}`,
        value: laneNumber,
        disabled: isReserved
      };
    }).filter(lane => !lane.disabled);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  normalizeDate(date: any): string {
    if (typeof date === 'string') {
      // If it's already in YYYY-MM-DD format, use it directly
      if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return date;
      } else {
        // If it's an ISO date string, convert it
        return this.formatDate(new Date(date));
      }
    } else if (date instanceof Date) {
      // If it's a Date object, format it
      return this.formatDate(date);
    } else {
      console.error('Invalid date format:', date);
      return '';
    }
  }

  normalizeTime(time: string): string {
    // Remove seconds from time format (e.g., "06:00:00" -> "06:00")
    return time.replace(/:\d{2}$/, '');
  }

  onSubmit() {
    if (this.reservationForm.invalid) return;
    this.loading = true;
    this.error = null;
    const { coach, club, pool, date, timeSlot, lane } = this.reservationForm.value;
    
    // Find the full club object from the clubs array
    const selectedClub = this.clubs.find(c => c.id === club);
    if (!selectedClub) {
      this.error = 'Selected club not found';
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Selected club not found' });
      return;
    }
    
    const [startTime, endTime] = [timeSlot.start, timeSlot.end];
    const reservation: PoolReservation = {
      coach,
      club: selectedClub,
      pool,
      date: typeof date === 'string' ? date : this.formatDate(date),
      startTime,
      endTime,
      lane
    };
    this.reservationService.createReservation(reservation).subscribe({
      next: (res) => {
        this.fetchReservations();
        this.hideDialog();
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Reservation created successfully.' });
        // Refresh availability after successful reservation
        setTimeout(() => {
          if (this.selectedPool && this.selectedDate) {
            this.updateTimeSlotAvailability();
            if (this.selectedTimeSlot) {
              this.updateLaneVisualization();
            }
          }
        }, 100);
      },
      error: (err) => {
        let msg = 'Reservation failed.';
        if (err.error && typeof err.error === 'string') {
          if (
            err.error.includes('already reserved') ||
            err.error.startsWith('This pool') ||
            err.error.includes('Unexpected token')
          ) {
            msg = 'This pool and lane is already reserved for the selected date and time slot. Please choose another slot or lane.';
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